const { test } = require("node:test")
const assert = require("node:assert/strict")
const fs = require("node:fs")
const path = require("node:path")
const vm = require("node:vm")
const ts = require("typescript")

function load(file, globals = {}, imports = {}) {
  const source = fs.readFileSync(path.join(__dirname, "..", file), "utf8")
  const code = ts.transpileModule(source, { compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX,
  } }).outputText
  const module = { exports: {} }
  vm.runInNewContext(code, { module, exports: module.exports, URL,
    require: (name) => {
      if (!(name in imports)) throw new Error(`Unexpected dependency: ${name}`)
      return imports[name]
    }, ...globals }, { filename: file })
  return module.exports
}

const data = load("src/lib/util/google-event-data.ts")
const cart = { id: "cart_1", currency_code: "inr", total: 2500, shipping_total: 300,
  items: [{ id: "item_1", variant_id: "variant_1", product_id: "prod_1", product_title: "Candle", quantity: 2, total: 2200, tax_total: 200 }] }

function browser(choice = null, ready = true) {
  const calls = [], timers = [], receipts = new Map()
  const globals = { window: { location: { href: "https://www.jardinbotanica.com/in/search?q=private%40example.com" } },
    localStorage: { getItem: () => choice },
    sessionStorage: { getItem: (key) => receipts.get(key), setItem: (key, value) => receipts.set(key, value) },
    setTimeout: (fn) => { timers.push(fn) },
  }
  if (ready) globals.window.gtag = (...args) => calls.push(args)
  const imports = { "./google-purchase": { GOOGLE_MEASUREMENT_ID: "G-TEST" } }
  return { ...load("src/lib/util/google-events.ts", globals, imports), globals, imports, calls, timers, receipts,
    setChoice: (value) => { choice = value } }
}

test("checkout/add-to-cart use purchase-compatible variant IDs and net merchandise totals", () => {
  const checkout = data.buildGoogleCartEvent(cart)
  assert.equal(checkout.value, 2000)
  assert.equal(checkout.currency, "INR")
  assert.equal(checkout.items[0].item_id, "variant_1")
  assert.equal(checkout.items[0].price, 1000)
  assert.equal(checkout.items[0].quantity, 2)
  const added = data.buildGoogleCartEvent(cart, "variant_1", 1)
  assert.equal(added.value, 1000)
  assert.equal(added.items[0].quantity, 1)
  assert.equal(data.buildGoogleCartEvent(cart, "variant_1", 0), undefined)
  assert.equal(data.buildGoogleCartEvent(cart, "variant_1", -1), undefined)
  assert.equal(data.buildGoogleCartEvent(cart, "missing", 1), undefined)
  assert.equal(data.buildGoogleCartEvent({ ...cart, items: [] }), undefined)
})

test("missing tax information never gets reported as known net revenue", () => {
  const event = data.buildGoogleCartEvent({ ...cart, items: [{ ...cart.items[0], tax_total: undefined }] })
  assert.equal(event.value, undefined)
  assert.equal(event.items[0].price, undefined)
  assert.equal(event.items[0].item_id, "variant_1")
  assert.equal(data.buildGoogleCartEvent({ ...cart, currency_code: "" }).value, undefined)
})

test("product views use selected cheapest variant and explicit tax-exclusive price", () => {
  const product = { id: "prod_1", title: "Candle", variants: [
    { id: "variant_2", calculated_price: { calculated_amount: 3000, calculated_amount_without_tax: 2500, currency_code: "inr" } },
    { id: "variant_1", calculated_price: { calculated_amount: 2200, calculated_amount_without_tax: 2000, currency_code: "inr" } },
  ] }
  const event = data.buildGoogleProductView(product)
  assert.equal(event.items[0].item_id, "variant_1")
  assert.equal(event.value, 2000)
  assert.equal(data.buildGoogleProductView({ id: "prod_2", title: "Unpriced" }).value, undefined)
})

test("search normalizes queries and redacts obvious contact details and URLs", () => {
  assert.equal(data.googleSearchTerm("  santal   pepper "), "santal pepper")
  assert.equal(data.googleSearchTerm(" "), undefined)
  for (const term of ["person@example.com", "+91 98765 43210", "https://example.com/user", "name%40example.com", "x".repeat(101)]) {
    assert.equal(data.googleSearchTerm(term), "[redacted]")
  }
})

test("all seven events target GA4 independently from Meta with GA4-native parameters", () => {
  const b = browser()
  const ecommerce = data.buildGoogleCartEvent(cart)
  const events = [["view_item", ecommerce], ["add_to_cart", ecommerce], ["begin_checkout", ecommerce],
    ["add_payment_info", { ...ecommerce, payment_type: "cod" }], ["search", { search_term: "candle" }],
    ["generate_lead", { lead_source: "newsletter" }], ["sign_up", { method: "google" }]]
  for (const [name, payload] of events) assert.equal(b.trackGoogleEvent(name, payload), true)
  assert.equal(b.calls.length, 7)
  b.calls.forEach(([command, name, payload], index) => {
    assert.equal(command, "event")
    assert.equal(name, events[index][0])
    assert.equal(payload.send_to, "G-TEST")
    assert.equal(payload.page_location, "https://www.jardinbotanica.com/in/search")
    assert.ok(!JSON.stringify(payload).includes("private%40"))
    assert.equal(payload.fbp, undefined)
  })
})

test("checkout/signup receipts suppress replay and reload but allow a new cart or payment selection", () => {
  const b = browser(), event = data.buildGoogleCartEvent(cart)
  b.trackGoogleEvent("begin_checkout", event, "cart_1")
  b.trackGoogleEvent("begin_checkout", event, "cart_1")
  load("src/lib/util/google-events.ts", b.globals, b.imports).trackGoogleEvent("begin_checkout", event, "cart_1")
  b.trackGoogleEvent("begin_checkout", event, "cart_2")
  b.trackGoogleEvent("add_payment_info", { ...event, payment_type: "cod" }, "cart_1:cod")
  b.trackGoogleEvent("add_payment_info", { ...event, payment_type: "card" }, "cart_1:card")
  b.trackGoogleEvent("sign_up", { method: "email" }, "cus_1")
  b.trackGoogleEvent("sign_up", { method: "email" }, "cus_1")
  assert.equal(b.calls.length, 5)
})

test("tag readiness queue freezes action payload and suppresses pending duplicates", () => {
  const b = browser(null, false), event = data.buildGoogleCartEvent(cart)
  b.trackGoogleEvent("begin_checkout", event, "cart_1")
  b.trackGoogleEvent("begin_checkout", event, "cart_1")
  event.value = 99999
  b.globals.window.location.href = "https://www.jardinbotanica.com/in/other"
  assert.equal(b.timers.length, 1)
  b.globals.window.gtag = (...args) => b.calls.push(args)
  b.timers.shift()()
  assert.equal(b.calls.length, 1)
  assert.equal(b.calls[0][2].value, 2000)
  assert.equal(b.calls[0][2].page_location, "https://www.jardinbotanica.com/in/search")
})

test("refusal, blocked storage, tag failure and exhausted readiness never break shopping", () => {
  const b = browser("declined")
  assert.equal(b.trackGoogleEvent("search", { search_term: "candle" }), false)
  b.setChoice(null)
  b.globals.localStorage.getItem = () => { throw new Error("blocked") }
  assert.equal(b.trackGoogleEvent("sign_up", { method: "email" }), false)
  const pending = browser(null, false)
  pending.trackGoogleEvent("generate_lead", { lead_source: "newsletter" })
  pending.setChoice("declined")
  pending.timers.shift()()
  assert.equal(pending.timers.length, 0)
  const blocked = browser(null, false)
  blocked.trackGoogleEvent("search", { search_term: "candle" })
  for (let i = 0; blocked.timers.length && i < 70; i++) blocked.timers.shift()()
  assert.equal(blocked.timers.length, 0)
  const broken = browser()
  broken.globals.window.gtag = () => { throw new Error("unavailable") }
  assert.doesNotThrow(() => broken.trackGoogleEvent("search", { search_term: "candle" }))
})

test("cart action emits GA4 only after successful mutation and only for positive additions", async () => {
  const calls = []
  const server = {
    addToCart: async () => { calls.push("saved"); return { googleEvent: data.buildGoogleCartEvent(cart, "variant_1", 1) } },
    addOrUpdateLineItem: async () => ({ lineItemId: "item_1", googleEvent: undefined }),
  }
  const actions = load("src/lib/data/tracked-cart.ts", {}, {
    "./cart": server,
    "@lib/util/meta-pixel": { trackMetaProductEvent: () => {} },
    "@lib/util/google-events": { trackGoogleEvent: (name, payload) => { if (payload) calls.push(name) } },
  })
  await actions.addToCart({})
  assert.deepEqual(calls, ["saved", "add_to_cart"])
  await actions.addOrUpdateLineItem({ quantityMode: "replace", quantity: 1 })
  assert.equal(calls.length, 2)
  server.addToCart = async () => { throw new Error("inventory") }
  await assert.rejects(actions.addToCart({}), /inventory/)
  assert.equal(calls.length, 2)
})

test("checkout emits GA4 with Meta disabled, ignores an empty cart and removes consent listener", () => {
  let effect
  const calls = [], listeners = new Map()
  const jsx = () => null
  const Component = load("src/modules/checkout/templates/checkout-form/checkout-form-client.tsx", {
    window: { addEventListener: (key, callback) => listeners.set(key, callback), removeEventListener: (key) => listeners.delete(key) },
  }, {
    react: { useEffect: (fn) => { effect = fn } }, "react/jsx-runtime": { jsx, jsxs: jsx },
    "@lib/util/meta-event-data": { getMetaCheckoutEvent: () => undefined },
    "@lib/util/meta-pixel": { trackMetaFunnelEvent: () => false },
    "@lib/util/google-event-data": data,
    "@lib/util/google-events": { trackGoogleEvent: (name, payload, key) => { if (payload) calls.push({ name, payload, key }) } },
    "next/navigation": { useSearchParams: () => ({ get: () => "address" }) },
    "./checkout-steps": {},
    "@modules/checkout/components/addresses": {}, "@modules/checkout/components/payment": {},
    "@modules/checkout/components/review": {}, "@modules/checkout/components/shipping": {},
  }).default
  Component({ cart, customer: null, shippingMethods: [], paymentMethods: [] })
  const cleanup = effect()
  assert.equal(calls[0].name, "begin_checkout")
  assert.equal(calls[0].key, "cart_1")
  assert.equal(calls[0].payload.value, 2000)
  cleanup()
  assert.equal(listeners.size, 0)
  Component({ cart: { ...cart, items: [] }, customer: null, shippingMethods: [], paymentMethods: [] })
  effect()()
  assert.equal(calls.length, 1)
})
