import type { Metadata } from "next"
import type { StrapiSEO } from "./strapi"

interface FallbackSEO {
  title?: string
  description?: string
  image?: string
}

export function buildMetadata(strapi: StrapiSEO | null, fallback: FallbackSEO = {}): Metadata {
  const title = strapi?.metaTitle || fallback.title || "Jardin Botanica"
  const description = strapi?.metaDescription || fallback.description || ""
  const image = strapi?.shareImage?.url || fallback.image

  return {
    title,
    description,
    keywords: strapi?.keywords,
    openGraph: {
      title,
      description,
      images: image ? [image] : undefined,
    },
  }
}
