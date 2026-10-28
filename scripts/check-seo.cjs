// Run with: node scripts/check-seo.cjs
const ts = require("typescript")
const fs = require("node:fs")
const vm = require("node:vm")
const assert = require("node:assert/strict")

function load(file, mocks, env = {}, runtime = {}) {
  const exports = {}
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText, {
    exports, require: (name) => mocks[name], process: { env }, Headers, URL, console,
    crypto: require("node:crypto").webcrypto,
    fetch: async () => ({ ok: true, json: async () => ({
      regions: [{ id: "reg", countries: [{ iso_2: "in" }] }],
    }) }),
    ...runtime,
  })
  return exports
}

async function main() {
  const NextResponse = {
    next: (options) => ({ kind: "next", options, cookies: { set() {} } }),
    redirect: (url, status) => ({ kind: "redirect", url, status, cookies: { set() {} } }),
  }
  const middleware = load("src/middleware.ts", { "next/server": { NextResponse } }, {
    MEDUSA_BACKEND_URL: "http://backend", NODE_ENV: "production",
  })
  for (const path of ["/in", "/in/", "/in/products/candle", "/in/cart", "/in/checkout", "/in/account", "/in/does-not-exist"]) {
    for (const cookie of [undefined, { value: "cache" }]) {
      const response = await middleware.middleware({
        nextUrl: new URL(`https://www.jardinbotanica.com${path}`),
        headers: new Headers(), cookies: { get: () => cookie },
      })
      assert.equal(response.kind, "next")
      assert.equal(response.options.request.headers.get("x-current-path"), path)
      if (!cookie) assert.match(response.options.request.headers.get("cookie"), /_medusa_cache_id=/)
    }
  }
  const response = await middleware.middleware({
    nextUrl: new URL("https://www.jardinbotanica.com/?utm_source=test"),
    headers: new Headers(), cookies: { get: () => undefined },
  })
  assert.equal(response.url, "https://www.jardinbotanica.com/in?utm_source=test")
  const matcher = new RegExp(`^${middleware.config.matcher[0]}$`)
  assert.equal(matcher.test("/robots.txt"), false)
  assert.equal(matcher.test("/sitemap.xml"), false)
  assert.equal(matcher.test("/in/products/candle"), true)

  // Exercise the real Next.js request/response headers and cookie serialization.
  const nextServer = require("next/server")
  const actualMiddleware = load("src/middleware.ts", { "next/server": nextServer }, {
    MEDUSA_BACKEND_URL: "http://backend", NODE_ENV: "production",
  })
  const actualResponse = await actualMiddleware.middleware(new nextServer.NextRequest(
    "https://www.jardinbotanica.com/in/products/candle?variant=123", {
      headers: { cookie: "_medusa_cart_id=cart_123; _medusa_jwt=token" },
    }
  ))
  assert.equal(actualResponse.status, 200)
  assert.equal(actualResponse.headers.get("location"), null)
  assert.match(actualResponse.headers.get("set-cookie"), /_medusa_cache_id=/)
  assert.match(actualResponse.headers.get("x-middleware-request-cookie"), /_medusa_cart_id=cart_123; _medusa_jwt=token/)
  assert.match(actualResponse.headers.get("x-middleware-request-cookie"), /_medusa_cache_id=/)
  assert.equal(actualResponse.headers.get("x-middleware-request-x-current-path"), "/in/products/candle?variant=123")

  for (const path of ["/products/candle?variant=123", "/checkout?step=payment", "/account"]) {
    const first = await actualMiddleware.middleware(new nextServer.NextRequest(`https://www.jardinbotanica.com${path}`))
    assert.equal(first.status, 307)
    assert.equal(first.headers.get("location"), `https://www.jardinbotanica.com/in${path}`)
    const second = await actualMiddleware.middleware(new nextServer.NextRequest(first.headers.get("location")))
    assert.equal(second.headers.get("location"), null)
  }

  let regionFetches = 0
  const geoMiddleware = load("src/middleware.ts", { "next/server": nextServer }, {
    MEDUSA_BACKEND_URL: "http://backend", NODE_ENV: "production", NEXT_PUBLIC_DEFAULT_REGION: "in",
  }, { fetch: async () => {
    regionFetches++
    return { ok: true, json: async () => ({ regions: [
      { id: "india", countries: [{ iso_2: "in" }] },
      { id: "usa", countries: [{ iso_2: "us" }] },
    ] }) }
  } })
  const geoRoot = await geoMiddleware.middleware(new nextServer.NextRequest("https://www.jardinbotanica.com/", {
    headers: { "x-vercel-ip-country": "US" },
  }))
  assert.equal(geoRoot.headers.get("location"), "https://www.jardinbotanica.com/us")
  const explicitCountry = await geoMiddleware.middleware(new nextServer.NextRequest("https://www.jardinbotanica.com/in", {
    headers: { "x-vercel-ip-country": "US" },
  }))
  assert.equal(explicitCountry.headers.get("location"), null)
  assert.equal(regionFetches, 1, "Country requests must reuse the region cache")

  const base = { getSEOBaseURL: () => "https://www.jardinbotanica.com" }
  const productionURLs = load("src/lib/util/env.ts", {}, { NEXT_PUBLIC_BASE_URL: "https://app.jardinbotanica.com" })
  assert.equal(productionURLs.getBaseURL(), "https://app.jardinbotanica.com")
  assert.equal(productionURLs.getSEOBaseURL(), "https://www.jardinbotanica.com")
  const robots = load("src/app/robots.ts", { "@lib/util/env": base }).default()
  assert.equal(robots.sitemap, "https://www.jardinbotanica.com/sitemap.xml")
  const offsets = []
  const sdk = { client: { fetch: async (path, options) => {
    if (path === "/store/regions") return { regions: [{ id: "reg", countries: [{ iso_2: "in" }] }] }
    offsets.push(options.query.offset)
    return {
      products: Array.from({ length: options.query.offset === 0 ? 100 : 1 }, (_, i) => ({
        handle: `candle-${options.query.offset + i}`,
      })), count: 101,
    }
  } } }
  const entries = await load("src/app/sitemap.ts", {
    "@lib/config": { sdk }, "@lib/util/env": base,
  }).default()
  assert.deepEqual(offsets, [0, 100])
  assert(entries.some((entry) => entry.url.endsWith("/in/products/candle-100")))
  assert(!entries.some((entry) => /account|checkout|cart/.test(entry.url)))
  for (const entry of entries) {
    const path = new URL(entry.url).pathname.replace(/^\/in/, "")
    if (path.startsWith("/products/")) continue
    assert(fs.existsSync(`src/app/[countryCode]/(main)${path}/page.tsx`), `Sitemap route missing: ${path}`)
  }
  console.log("PASS: country routing without cookies, query preservation, SEO exclusions, robots, paginated product sitemap")
}

main().catch((error) => { console.error(error); process.exitCode = 1 })
