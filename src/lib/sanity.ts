import { client } from "../sanity/lib/client"
import type {
  SanityBlog,
  SanityBlogTemplate1,
  SanityJournalListItem,
  SanitySEO,
} from "types/sanity-blog"

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


const BLOG_TEMPLATE1_PROJECTION = `{
  title,
  "slug": slug.current,
  description,
  publishedDate,
  "coverImage": coverImage{"url": asset->url},
  imageAlt,
  categories,
  author{name, "avatar": avatar{"url": asset->url}},
  featuredProducts,
  content[]{
    ...,
    _type == "imageBlock" => {
      "image": {"url": image.asset->url},
    },
  }
}`

/**
 * Fetch a single Blog Template 1 article by slug (the classic single-column
 * journal layout migrated off Contentful). featuredProducts are raw handles —
 * the route resolves them into Medusa products.
 */
export async function getBlogTemplate1BySlugSanity(
  slug: string
): Promise<SanityBlogTemplate1 | null> {
  try {
    return await client.fetch<SanityBlogTemplate1 | null>(
      `*[_type == "blogTemplate1" && slug.current == $slug][0]${BLOG_TEMPLATE1_PROJECTION}`,
      { slug },
      cacheOpts(60)
    )
  } catch (error) {
    console.error("Error fetching Sanity blogTemplate1 by slug:", error)
    return null
  }
}

/**
 * Title/slug links for the "Latest Articles" sidebar of Blog Template 1.
 */
export async function getLatestBlogTemplate1LinksSanity(
  limit: number = 8
): Promise<{ title: string; slug: string }[]> {
  try {
    return await client.fetch<{ title: string; slug: string }[]>(
      `*[_type == "blogTemplate1"] | order(publishedDate desc) [0...$limit]{
        title,
        "slug": slug.current
      }`,
      { limit },
      cacheOpts(60)
    )
  } catch (error) {
    console.error("Error fetching Sanity blogTemplate1 latest links:", error)
    return []
  }
}

/**
 * All Blog Template 1 title/slug links, published-date order — used to build
 * previous/next post navigation.
 */
export async function getAllBlogTemplate1LinksSanity(): Promise<
  { title: string; slug: string }[]
> {
  try {
    return await client.fetch<{ title: string; slug: string }[]>(
      `*[_type == "blogTemplate1"] | order(publishedDate desc){
        title,
        "slug": slug.current
      }`,
      {},
      cacheOpts(60)
    )
  } catch (error) {
    console.error("Error fetching Sanity blogTemplate1 all links:", error)
    return []
  }
}

// GROQ projection for the merged journal listing. Uses `select()` to derive
// per-type href so page components don't need to know which schema an item
// came from.
const JOURNAL_LIST_PROJECTION = `{
  _type,
  title,
  "slug": slug.current,
  description,
  publishedDate,
  isFeatured,
  category,
  "image": coalesce(coverImage.asset->url, ""),
  "imageAlt": coalesce(imageAlt, ""),
  "href": select(
    _type == "blog" => "/blogs/template-2/" + slug.current,
    _type == "blogTemplate1" => "/blogs/" + slug.current,
    "/blogs/" + slug.current
  )
}`

/**
 * Fetch merged journal blog entries across `blog` + `blogTemplate1`, ordered
 * by publishedDate desc, paginated. Pass `featured: true` for the Featured
 * strip; `featured: false` for the Recent Entries sidebar.
 */
const buildJournalFilters = (featured?: boolean, category?: string) => {
  // isFeatured may be absent on older docs; treat missing as false so the
  // "not featured" filter still returns them.
  const featuredFilter =
    featured === undefined
      ? ""
      : featured
        ? "&& isFeatured == true"
        : "&& (isFeatured != true || !defined(isFeatured))"
  const categoryFilter = category ? "&& category == $category" : ""
  return { featuredFilter, categoryFilter }
}

export async function getJournalBlogsSanity({
  featured,
  category,
  limit = 10,
  offset = 0,
}: {
  featured?: boolean
  category?: string
  limit?: number
  offset?: number
}): Promise<SanityJournalListItem[]> {
  try {
    const { featuredFilter, categoryFilter } = buildJournalFilters(featured, category)
    return await client.fetch<SanityJournalListItem[]>(
      `*[_type in ["blog", "blogTemplate1"] ${featuredFilter} ${categoryFilter}] | order(publishedDate desc) [$offset...$end]${JOURNAL_LIST_PROJECTION}`,
      { offset, end: offset + limit, category: category ?? "" },
      cacheOpts(60)
    )
  } catch (error) {
    console.error("Error fetching Sanity journal blogs:", error)
    return []
  }
}

/**
 * Total count for merged journal listing — used to gate "View more" on the
 * Featured pagination.
 */
export async function getJournalBlogsCountSanity({
  featured,
  category,
}: {
  featured?: boolean
  category?: string
}): Promise<number> {
  try {
    const { featuredFilter, categoryFilter } = buildJournalFilters(featured, category)
    return await client.fetch<number>(
      `count(*[_type in ["blog", "blogTemplate1"] ${featuredFilter} ${categoryFilter}])`,
      { category: category ?? "" },
      cacheOpts(60)
    )
  } catch (error) {
    console.error("Error fetching Sanity journal blogs count:", error)
    return 0
  }
}

/**
 * Latest N journal entries (merged across both blog types) that actually
 * have a cover image set — used by the home page Journal section where the
 * cover is mandatory. Entries without a cover are skipped, so if the newest
 * post has no image the next-newest with one takes its place.
 */
export async function getLatestJournalWithCoverSanity(
  limit: number = 3
): Promise<SanityJournalListItem[]> {
  try {
    return await client.fetch<SanityJournalListItem[]>(
      `*[_type in ["blog", "blogTemplate1"] && defined(coverImage.asset)] | order(publishedDate desc) [0...$limit]${JOURNAL_LIST_PROJECTION}`,
      { limit },
      cacheOpts(60)
    )
  } catch (error) {
    console.error("Error fetching latest Sanity journal with cover:", error)
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
