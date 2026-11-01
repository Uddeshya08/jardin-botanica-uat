// Run against a production build or deployment:
// node scripts/check-seo-http.cjs http://localhost:8017
const assert = require("node:assert/strict")
const origin = process.argv[2] || "http://localhost:8017"

async function request(path) {
  const response = await fetch(new URL(path, origin), {
    redirect: "manual", signal: AbortSignal.timeout(60000),
  })
  const body = await response.text()
  console.log(`${response.status} ${path} ${response.headers.get("location") || ""}`)
  return { response, body }
}

async function main() {
  const root = await request("/?utm_source=seo-check")
  assert.equal(root.response.status, 307)
  assert.equal(new URL(root.response.headers.get("location"), origin).pathname, "/in")
  assert.equal(new URL(root.response.headers.get("location"), origin).search, "?utm_source=seo-check")

  const robots = await request("/robots.txt")
  assert.equal(robots.response.status, 200)
  assert.match(robots.response.headers.get("content-type"), /text\/plain/)
  assert.match(robots.body, /Sitemap: https:\/\/www\.jardinbotanica\.com\/sitemap.xml/)
  const sitemap = await request("/sitemap.xml")
  assert.equal(sitemap.response.status, 200)
  assert.match(sitemap.response.headers.get("content-type"), /xml/)
  assert.match(sitemap.body, /<urlset/)
  assert(!sitemap.body.includes("https://app.jardinbotanica.com"))
  assert.match(sitemap.body, /https:\/\/www\.jardinbotanica\.com\/in\/products\//)

  for (const path of ["/in", "/in/products/cedarwood-rose"]) {
    const page = await request(path)
    assert.equal(page.response.status, 200)
    assert.equal(page.response.headers.get("location"), null)
  }
  const missing = await request("/in/seo-check-nonexistent-page")
  assert.equal(missing.response.status, 404)

  // Existing checkout behavior calls notFound() when there is no cart cookie.
  const emptyCheckout = await request("/in/checkout")
  assert.equal(emptyCheckout.response.status, 404)

  for (const initial of ["/in/cart", "/in/account"]) {
    let path = initial
    const visited = new Set()
    for (let hop = 0; ; hop++) {
      assert(hop < 5 && !visited.has(path), `Redirect loop: ${initial}`)
      visited.add(path)
      const { response } = await request(path)
      const location = response.headers.get("location")
      if (!location) {
        assert.equal(response.status, 200)
        break
      }
      const target = new URL(location, origin)
      assert.equal(target.origin, new URL(origin).origin)
      path = target.pathname + target.search
    }
  }
  console.log("PASS: HTTP SEO endpoints, homepage/PDP, real 404, existing empty-cart checkout behavior, cart/account redirect chains")
}

main().catch((error) => { console.error(error); process.exitCode = 1 })
