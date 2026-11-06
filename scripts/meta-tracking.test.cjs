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
  const scripts = [], listeners = {}, requests = [], receipts = new Map()
  let eventNumber = 0
  const globals = {
    process: { env: { NEXT_PUBLIC_META_PIXEL_ID: id } },
    window: { location: { href: "https://www.jardinbotanica.com/in?email=private" },
      addEventListener: (name, fn) => { listeners[name] = fn } },
    localStorage: { getItem: () => choice },
    sessionStorage: { getItem: (key) => receipts.get(key), setItem: (key, value) => receipts.set(key, value) },
    document: { cookie: "_fbp=fb.1.1760000000000.1234", createElement: () => ({}), head: { appendChild: (script) => scripts.push(script) } },
    crypto: { randomUUID: () => `00000000-0000-4000-8000-${String(++eventNumber).padStart(12, "0")}` },
    fetch: async (url, options) => { requests.push({ url, options }); return { status: 202 } },
  }
  const pixel = load("src/lib/util/meta-pixel.ts", globals)
  return { ...pixel, globals, scripts, listeners, requests, receipts, setChoice: (next) => { choice = next } }
}
const event = { productId: "prod_candle", quantity: 2, value: 3600, currency: "INR" }

test("PageView and product events share one loader and one initialization", () => {
  const b = browser()
  assert.equal(b.trackMetaPageView(), true)
  b.trackMetaProductEvent("ViewContent", event)
  b.trackMetaProductEvent("AddToCart", event)
  const queue = b.globals.window.fbq.queue
  assert.equal(b.scripts.length, 1)
  assert.equal(queue.filter((entry) => entry[0] === "init").length, 1)
  assert.equal(queue.find((entry) => entry[0] === "init")[1], "1489706953077337")
  assert.equal(queue.filter((entry) => entry[0] === "track").map((entry) => entry[1]).join(","),
    "PageView,ViewContent,AddToCart")
})

test("PageView, ViewContent and AddToCart use the same IDs on Pixel and CAPI relay", () => {
  const b = browser()
  b.trackMetaPageView()
  b.trackMetaProductEvent("ViewContent", event)
  b.trackMetaProductEvent("AddToCart", event)
  const pixelEvents = b.globals.window.fbq.queue.filter((entry) => entry[0] === "track")
  assert.equal(b.requests.length, 3)
  b.requests.forEach(({ url, options }, index) => {
    const body = JSON.parse(options.body)
    assert.equal(url, "/api/meta/events")
    assert.equal(body.event_name, pixelEvents[index][1])
    assert.equal(body.event_id, pixelEvents[index][3].eventID)
    assert.equal(body.event_source_url, "https://www.jardinbotanica.com/in")
    assert.equal(body.fbp, "fb.1.1760000000000.1234")
    assert.equal(options.keepalive, true)
    assert.equal(body.user_data, undefined)
    assert.equal(body.access_token, undefined)
  })
  assert.equal(new Set(pixelEvents.map((entry) => entry[3].eventID)).size, 3)
})

test("Purchase uses its backend-issued order ID and prevents repeated browser sends", () => {
  const b = browser()
  const plan = { state: "ready", dataset_id: "1489706953077337", event_id: "purchase_order_test",
    custom_data: { order_id: "order_test", value: 1900, currency: "INR", content_ids: ["prod_candle"] } }
  assert.equal(b.trackMetaPurchase(plan), true)
  assert.equal(b.trackMetaPurchase(plan), true)
  const purchases = b.globals.window.fbq.queue.filter((entry) => entry[1] === "Purchase")
  assert.equal(purchases.length, 1)
  assert.equal(purchases[0][3].eventID, "purchase_order_test")
  assert.equal(purchases[0][2].value, 1900)
  assert.equal(b.requests.length, 0) // CAPI Purchase is already independently queued by order.placed.
  assert.equal(b.receipts.size, 1)
})

test("Purchase never invents a new ID, changes datasets, sends rejected or invalid orders", () => {
  const plan = { state: "ready", dataset_id: "1489706953077337", event_id: "purchase_order_test",
    custom_data: { order_id: "order_test", value: 1900, currency: "INR" } }
  const b = browser()
  for (const invalid of [{ ...plan, event_id: "random-id" }, { ...plan, dataset_id: "999" },
    { ...plan, state: "waiting" }, { ...plan, custom_data: { ...plan.custom_data, value: 0 } }]) {
    assert.equal(b.trackMetaPurchase(invalid), false)
  }
  const declined = browser(undefined, "declined")
  assert.equal(declined.trackMetaPurchase(plan), false)
  assert.equal(b.scripts.length, 0)
  assert.equal(declined.scripts.length, 0)
})

test("first-party relay validates origin, uses server credentials and ignores client identity spoofing", async () => {
  const calls = []
  const relay = load("src/app/api/meta/events/route.ts", {
    URL, Buffer, AbortSignal, process: { env: { META_CAPI_RELAY_SECRET: "s".repeat(64), NEXT_PUBLIC_META_PIXEL_ID: "1489706953077337" } },
  }, {
    "node:crypto": require("node:crypto"),
    "next/server": { NextResponse: { json: (body, options = {}) => ({ body, status: options.status || 200 }) } },
    "@medusajs/js-sdk": { Client: class {
      constructor(settings) { assert.equal(settings.debug, false) }
      async fetch(url, options) { calls.push({ url, options }); return { queued: true } }
    } },
  })
  const headers = new Map([["origin", "https://www.jardinbotanica.com"], ["user-agent", "real-agent"], ["x-forwarded-for", "192.0.2.1"]])
  const req = { url: "https://www.jardinbotanica.com/api/meta/events", headers: { get: (name) => headers.get(name) },
    text: async () => JSON.stringify({ event_name: "PageView", event_id: "pageview_test", event_source_url: "https://www.jardinbotanica.com/in",
      user_data: { client_ip_address: "malicious", client_user_agent: "spoofed" } }) }
  const result = await relay.POST(req)
  assert.equal(result.status, 200)
  assert.equal(calls[0].options.headers["x-meta-relay-secret"], "s".repeat(64))
  assert.equal(calls[0].options.body.user_data.client_user_agent, "real-agent")
  assert.equal(calls[0].options.body.user_data.client_ip_address, "192.0.2.1")
  assert.equal(JSON.stringify(result).includes("s".repeat(64)), false)
  headers.set("origin", "https://attacker.example")
  assert.equal((await relay.POST(req)).status, 403)
  assert.equal(calls.length, 1)
})

test("transport retries preserve the exact same event ID and body", async () => {
  const requests = [], timers = []
  const pixel = load("src/lib/util/meta-pixel.ts", {
    process: { env: { NEXT_PUBLIC_META_PIXEL_ID: "1489706953077337" } },
    window: { location: { href: "https://www.jardinbotanica.com/in" }, addEventListener: () => {} },
    localStorage: { getItem: () => null },
    document: { cookie: "", createElement: () => ({}), head: { appendChild: () => {} } },
    crypto: { randomUUID: () => "00000000-0000-4000-8000-000000000001" },
    setTimeout: (fn) => { timers.push(fn) },
    fetch: async (_, options) => { requests.push(options.body); if (requests.length === 1) throw new Error("timeout"); return { status: 202 } },
  })
  pixel.trackMetaPageView()
  await new Promise(setImmediate)
  assert.equal(timers.length, 1)
  timers[0]()
  await new Promise(setImmediate)
  assert.equal(requests.length, 2)
  assert.equal(requests[0], requests[1])
})

test("confirmation reads canonical Purchase data and ignores an unmounted effect", async () => {
  let effect
  const requests = [], tracked = []
  const plan = { state: "ready", dataset_id: "1489706953077337", event_id: "purchase_order_test",
    custom_data: { order_id: "order_test", value: 1900, currency: "INR" } }
  const { default: Purchase } = load("src/modules/order/components/meta-purchase/index.tsx", {
    AbortController, setTimeout, clearTimeout,
    fetch: async (_, options) => { requests.push(options); return { ok: true, json: async () => plan } },
  }, {
    "react": { useEffect: (fn) => { effect = fn } },
    "@lib/util/meta-pixel": { trackMetaPurchase: (data) => tracked.push(data) },
  })
  Purchase({ orderId: "order_test" }); const first = effect(); first()
  const second = effect()
  await new Promise(setImmediate)
  assert.equal(requests.length, 2)
  assert.equal(tracked.length, 1)
  assert.equal(tracked[0].event_id, "purchase_order_test")
  assert.equal(JSON.parse(requests[1].body).order_id, "order_test")
  assert.equal(JSON.parse(requests[1].body).custom_data, undefined)
  second()
})

test("Purchase proxy uses a read-only backend plan and never queues a second CAPI Purchase", async () => {
  const calls = []
  const plan = { state: "ready", dataset_id: "1489706953077337", event_id: "purchase_order_test",
    custom_data: { order_id: "order_test", value: 1900, currency: "INR" } }
  const relay = load("src/app/api/meta/events/route.ts", {
    URL, Buffer, AbortSignal, process: { env: { META_CAPI_RELAY_SECRET: "s".repeat(64), NEXT_PUBLIC_META_PIXEL_ID: "1489706953077337" } },
  }, {
    "node:crypto": require("node:crypto"),
    "next/server": { NextResponse: { json: (body, options = {}) => ({ body, status: options.status || 200 }) } },
    "@medusajs/js-sdk": { Client: class {
      constructor(settings) { assert.equal(settings.debug, false) }
      async fetch(url, options) { calls.push({ url, options }); return plan }
    } },
  })
  const req = { url: "https://www.jardinbotanica.com/api/meta/events",
    headers: { get: (key) => key === "origin" ? "https://www.jardinbotanica.com" : null },
    text: async () => JSON.stringify({ event_name: "Purchase", order_id: "order_test", custom_data: { value: 1 } }) }
  const result = await relay.POST(req)
  assert.equal(result.body.custom_data.value, 1900)
  assert.equal(calls.length, 1)
  assert.equal(calls[0].url, "/store/custom/meta/purchase/order_test")
  assert.equal(calls[0].options.method, "GET")
  assert.equal(calls[0].options.body, undefined)
})

test("PageView is suppressed on rejection or missing configuration", () => {
  for (const b of [browser(""), browser("invalid"), browser(undefined, "declined")]) {
    assert.equal(b.trackMetaPageView(), false)
    assert.equal(b.scripts.length, 0)
  }
})

test("PageView handles navigation and search changes without effect replay duplicates", () => {
  const ref = { current: undefined }, listeners = new Set(), events = []
  let effect, pathname = "/in", search = "", allowed = true
  const { default: PageView } = load("src/app/components/MetaPageView.tsx", {
    window: { addEventListener: (_, fn) => listeners.add(fn), removeEventListener: (_, fn) => listeners.delete(fn) },
  }, {
    "react": { useRef: () => ref, useEffect: (fn) => { effect = fn } },
    "next/navigation": { usePathname: () => pathname, useSearchParams: () => ({ toString: () => search }) },
    "@lib/util/meta-pixel": { trackMetaPageView: () => {
      if (!allowed) return false
      events.push(`${pathname}?${search}`)
      return true
    } },
  })
  PageView(); let cleanup = effect(); cleanup(); cleanup = effect()
  assert.equal(events.length, 1)
  cleanup(); pathname = "/in/products/candle"; PageView(); cleanup = effect()
  cleanup(); search = "variant=small"; PageView(); cleanup = effect()
  assert.equal(events.length, 3)
  cleanup(); pathname = "/in"; search = ""; PageView(); cleanup = effect()
  assert.equal(events.length, 4)
  cleanup(); pathname = "/in/candles"; allowed = false; PageView(); cleanup = effect()
  assert.equal(events.length, 4)
  allowed = true; for (const listener of listeners) listener()
  assert.equal(events.length, 5)
  for (const listener of listeners) listener()
  assert.equal(events.length, 5)
  cleanup(); assert.equal(listeners.size, 0)
})

test("server-rendered Pixel supplies the no-JavaScript fallback for the configured ID", () => {
  const { renderToStaticMarkup } = require("react-dom/server")
  for (const id of ["1489706953077337", "", "invalid"]) {
    const { default: Pixel } = load("src/app/components/MetaPixel.tsx", {
      process: { env: { NEXT_PUBLIC_META_PIXEL_ID: id } },
    }, {
      "react": require("react"), "react/jsx-runtime": require("react/jsx-runtime"),
      "./MetaPageView": { default: () => null },
    })
    const html = renderToStaticMarkup(Pixel())
    if (id === "1489706953077337") {
      assert.match(html, /<noscript><img/)
      assert.match(html, /id=1489706953077337&amp;ev=PageView&amp;noscript=1/)
      assert.match(html, /display:none/)
      assert.doesNotMatch(html, /4120952484705648/)
    } else assert.equal(html, "")
  }
})

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
