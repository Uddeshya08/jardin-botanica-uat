import { client } from "../sanity/lib/client"
import type { SanityBlog, SanitySEO } from "types/sanity-blog"

// In dev, bypass Next's fetch cache entirely so Studio edits appear on refresh.
// In prod, cache with a short revalidate window for performance.
const cacheOpts = (revalidate: number) =>
  process.env.NODE_ENV === "production"
    ? ({ next: { revalidate } } as const)
    : ({ cache: "no-store" } as const)

const BLOG_PROJECTION = `{
  title,
  "slug": slug.current,
  description,
  publishedDate,
  "coverImage": coverImage{"url": asset->url},
  categories,
  tags,
  author{name, "avatar": avatar{"url": asset->url}},
  featuredProducts,
  content[]{
    ...,
    _type == "imageBlock" => {
      "image": {"url": image.asset->url},
    },
    _type == "imageGalleryBlock" => {
      "images": images[]{"url": asset->url},
    },
  }
}`

/**
 * Fetch a single blog article from Sanity by slug, including its full
 * Portable Text content (text blocks + image/gallery/cta/quote objects).
 */
export async function getBlogBySlugSanity(slug: string): Promise<SanityBlog | null> {
  try {
    const blog = await client.fetch<SanityBlog | null>(
      `*[_type == "blog" && slug.current == $slug][0]${BLOG_PROJECTION}`,
      { slug },
      cacheOpts(60)
    )
    return blog
  } catch (error) {
    console.error("Error fetching Sanity blog by slug:", error)
    return null
  }
}

/**
 * Lightweight cards (title/slug/image) for the "Also" related-articles grid.
 */
export async function getLatestBlogCardsSanity(
  limit: number = 8,
  excludeSlug?: string
): Promise<{ title: string; slug: string; image?: string }[]> {
  try {
    const cards = await client.fetch<{ title: string; slug: string; image?: string }[]>(
      `*[_type == "blog" && slug.current != $excludeSlug] | order(publishedDate desc) [0...$limit]{
        title,
        "slug": slug.current,
        "image": coverImage.asset->url
      }`,
      { excludeSlug: excludeSlug ?? "", limit },
      cacheOpts(60)
    )
    return cards
  } catch (error) {
    console.error("Error fetching Sanity latest blog cards:", error)
    return []
  }
}


/**
 * SEO metadata for a page, replacing Strapi's page-seos content type.
 */
export async function getPageSEOSanity(pageSlug: string): Promise<SanitySEO | null> {
  try {
    const seo = await client.fetch<SanitySEO | null>(
      `*[_type == "pageSeo" && pageSlug == $pageSlug][0]{
        metaTitle,
        metaDescription,
        keywords,
        "shareImage": shareImage{"url": asset->url}
      }`,
      { pageSlug },
      cacheOpts(3600)
    )
    return seo
  } catch (error) {
    console.error("Error fetching Sanity page SEO:", error)
    return null
  }
}
