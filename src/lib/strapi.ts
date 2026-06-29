const STRAPI_URL = process.env.STRAPI_API_URL
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN

export interface StrapiSEO {
  metaTitle: string
  metaDescription: string
  keywords?: string
  shareImage?: { url: string; alternativeText?: string }
}

export interface PageSEOEntry {
  pageSlug: string
  pageType: "homepage" | "product" | "blog" | "page"
  seo: StrapiSEO | null
}

export async function getPageSEO(slug: string): Promise<StrapiSEO | null> {
  if (!STRAPI_URL || !STRAPI_TOKEN) return null

  try {
    const res = await fetch(
      `${STRAPI_URL}/api/page-seos?filters[pageSlug][$eq]=${encodeURIComponent(slug)}&populate[seo][populate]=shareImage`,
      {
        headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
        next: { revalidate: 3600 },
      }
    )

    if (!res.ok) return null

    const json = await res.json()
    return json?.data?.[0]?.seo ?? null
  } catch {
    return null
  }
}
