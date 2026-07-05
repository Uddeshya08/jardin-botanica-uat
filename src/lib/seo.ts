import type { Metadata } from "next"
import type { SanitySEO } from "types/sanity-blog"

interface FallbackSEO {
  title?: string
  description?: string
  image?: string
}

export function buildMetadata(seo: SanitySEO | null, fallback: FallbackSEO = {}): Metadata {
  const title = seo?.metaTitle || fallback.title || "Jardin Botanica"
  const description = seo?.metaDescription || fallback.description || ""
  const image = seo?.shareImage?.url || fallback.image

  return {
    title,
    description,
    keywords: seo?.keywords,
    openGraph: {
      title,
      description,
      images: image ? [image] : undefined,
    },
  }
}
