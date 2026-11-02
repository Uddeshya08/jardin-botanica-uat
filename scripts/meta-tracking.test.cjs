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
  vm.runInNewContext(code, { module, exports: module.exports,
    require: (name) => {
      if (!(name in imports)) throw new Error(`Unexpected dependency: ${name}`)
      return imports[name]
    }, ...globals }, { filename: file })
  return module.exports
}

function browser(id = "1489706953077337", choice = null) {
  const scripts = [], listeners = {}
  let eventNumber = 0
  const globals = {
    process: { env: { NEXT_PUBLIC_META_PIXEL_ID: id } },
    window: { addEventListener: (name, fn) => { listeners[name] = fn } },
    localStorage: { getItem: () => choice },
    document: { createElement: () => ({}), head: { appendChild: (script) => scripts.push(script) } },
    crypto: { randomUUID: () => `event-${++eventNumber}` },
  }
  const pixel = load("src/lib/util/meta-pixel.ts", globals)
  return { ...pixel, globals, scripts, listeners, setChoice: (next) => { choice = next } }
}
const event = { productId: "prod_candle", quantity: 2, value: 3600, currency: "INR" }

test("Pixel uses the public dataset, initializes once and never emits Purchase", () => {
  const b = browser()
  b.trackMetaProductEvent("ViewContent", { ...event, quantity: 1, value: 1800 })
  b.trackMetaProductEvent("AddToCart", event)
  const queue = b.globals.window.fbq.queue
  assert.equal(b.scripts.length, 1)
  assert.equal(queue.filter((entry) => entry[0] === "init").length, 1)
  const events = queue.filter((entry) => entry[0] === "track")
  assert.equal(events.length, 2)
  assert.equal(events[1][1], "AddToCart")
  assert.equal(events[1][2].value, 3600)
  assert.equal(events[1][2].content_ids[0], "prod_candle")
  assert.notEqual(events[0][3].eventID, events[1][3].eventID)
  assert.equal(events.some((entry) => entry[1] === "Purchase"), false)
})

test("missing configuration, rejection and unavailable storage do not load Pixel", () => {
  for (const b of [browser(""), browser("invalid"), browser(undefined, "declined")]) {
    b.trackMetaProductEvent("ViewContent", event)
    assert.equal(b.scripts.length, 0)
  }
  const b = browser()
  b.globals.localStorage.getItem = () => { throw new Error("denied") }
  assert.doesNotThrow(() => b.trackMetaProductEvent("ViewContent", event))
  assert.equal(b.scripts.length, 0)
})

test("a later rejection revokes Pixel and suppresses subsequent events", () => {
  const b = browser()
  b.trackMetaProductEvent("ViewContent", event)
  b.setChoice("declined")
  b.listeners["jardinBotanica:cookie-consent"]()
  b.trackMetaProductEvent("AddToCart", event)
  const queue = b.globals.window.fbq.queue
  assert.equal(queue.at(-1)[1], "revoke")
  assert.equal(queue.filter((entry) => entry[0] === "track").length, 1)
})

test("cart data uses only the quantity added and Medusa major currency units", () => {
  const { getMetaCartEvent } = load("src/lib/util/meta-event-data.ts")
  const cart = { currency_code: "inr", items: [{ variant_id: "variant_1", product_id: "prod_candle", unit_price: 1800, quantity: 8 }] }
  assert.equal(getMetaCartEvent(cart, "variant_1", 2).value, 3600)
  assert.equal(getMetaCartEvent(cart, "variant_1", 2).quantity, 2)
  assert.equal(getMetaCartEvent(cart, "variant_1", 0), undefined)
  assert.equal(getMetaCartEvent(cart, "variant_1", -1), undefined)
  assert.equal(getMetaCartEvent(cart, "unknown", 1), undefined)
  assert.equal(getMetaCartEvent({ ...cart, currency_code: "" }, "variant_1", 1).value, undefined)
})

test("cart wrapper emits only after successful mutation and preserves errors", async () => {
  const calls = []
  const server = {
    addToCart: async () => { calls.push("saved"); return event },
    addOrUpdateLineItem: async () => ({ lineItemId: "item_1", metaEvent: undefined }),
  }
  const tracked = load("src/lib/data/tracked-cart.ts", {}, {
    "./cart": server,
    "@lib/util/meta-pixel": { trackMetaProductEvent: (_, data) => { if (data) calls.push("tracked") } },
  })
  await tracked.addToCart({})
  assert.equal(calls.join(","), "saved,tracked")
  await tracked.addOrUpdateLineItem({ quantityMode: "replace", quantity: 1 })
  assert.equal(calls.length, 2)
  server.addToCart = async () => { throw new Error("inventory") }
  await assert.rejects(tracked.addToCart({}), /inventory/)
  assert.equal(calls.length, 2)
})

test("ViewContent ignores React effect replay and variant rerenders, tracks a new product", () => {
  const ref = { current: undefined }
  const events = []
  let effect
  const { default: ProductView } = load("src/modules/products/components/meta-product-view/index.tsx", {}, {
    "react": { useRef: () => ref, useEffect: (fn) => { effect = fn } },
    "next/navigation": { usePathname: () => "/in/products/candle" },
    "@lib/util/meta-pixel": { trackMetaProductEvent: (name, data) => events.push({ name, data }) },
  })
  const product = { id: "prod_1", variants: [{ calculated_price: { calculated_amount: 1800, currency_code: "inr" } }] }
  ProductView({ product }); effect(); effect()
  ProductView({ product: { ...product } }); effect()
  assert.equal(events.length, 1)
  assert.equal(events[0].data.value, 1800)
  ProductView({ product: { ...product, id: "prod_2" } }); effect()
  assert.equal(events.length, 2)
})
