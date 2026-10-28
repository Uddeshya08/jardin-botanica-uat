import type { MetadataRoute } from "next"
import { sdk } from "@lib/config"
import { getSEOBaseURL } from "@lib/util/env"
import type { HttpTypes } from "@medusajs/types"

export const revalidate = 3600

const publicPaths = [
  "", "/store", "/candles", "/body-hands", "/hands", "/home-creations",
  "/gift-sets", "/the-lab", "/material-archive", "/journal",
  "/help-and-faqs", "/careers", "/privacy-policy", "/terms-and-conditions",
  "/returns-and-exchanges",
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Do not use cookie-dependent storefront helpers in this public metadata route.
  const { regions } = await sdk.client.fetch<{ regions: HttpTypes.StoreRegion[] }>(
    "/store/regions", { next: { revalidate } }
  )
  const entries: MetadataRoute.Sitemap = []
  const seenCountries = new Set<string>()

  for (const region of regions) {
    const products: HttpTypes.StoreProduct[] = []
    let offset = 0
    let count = 0
    do {
      const page = await sdk.client.fetch<{ products: HttpTypes.StoreProduct[]; count: number }>(
        "/store/products", {
          query: { region_id: region.id, limit: 100, offset, fields: "handle,updated_at" },
          next: { revalidate },
        }
      )
      products.push(...page.products)
      count = page.count
      offset += page.products.length
      if (!page.products.length && offset < count) {
        throw new Error("Sitemap product pagination returned an incomplete page")
      }
    } while (offset < count)

    for (const country of region.countries ?? []) {
      const code = country.iso_2?.toLowerCase()
      if (!code || seenCountries.has(code)) continue
      seenCountries.add(code)
      for (const path of publicPaths) {
        entries.push({ url: new URL(`/${code}${path}`, getSEOBaseURL()).href })
      }
      for (const product of products) {
        if (!product.handle) continue
        entries.push({
          url: new URL(`/${code}/products/${encodeURIComponent(product.handle)}`, getSEOBaseURL()).href,
          ...(product.updated_at ? { lastModified: product.updated_at } : {}),
        })
      }
    }
  }
  if (!seenCountries.size) throw new Error("No storefront countries available for sitemap")
  return entries
}
