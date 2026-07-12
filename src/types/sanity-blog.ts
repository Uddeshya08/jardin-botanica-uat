// Types for the Sanity-backed blog + SEO content, replacing the Strapi/Contentful
// equivalents. `content` is native Sanity Portable Text: standard `block` items
// (paragraphs with bold/italic/links) freely interleaved with custom
// imageBlock / imageGalleryBlock / ctaBlock / quoteBlock objects.

export interface SanityImageRef {
  url: string
}

export interface SanityPortableTextBlock {
  _type: "block"
  _key: string
  style?: string
  children: { _type: "span"; text: string; marks?: string[] }[]
  markDefs?: { _type: string; _key: string; href?: string }[]
  listItem?: string
  level?: number
}

export interface SanityImageBlock {
  _type: "imageBlock"
  _key: string
  image: SanityImageRef
  alt?: string
  caption?: string
  fullBleed?: boolean
  alignment?: "left" | "center" | "right"
}

export interface SanityImageGalleryBlock {
  _type: "imageGalleryBlock"
  _key: string
  images: SanityImageRef[]
  caption?: string
}

export interface SanityCtaBlock {
  _type: "ctaBlock"
  _key: string
  label: string
  url: string
  // Not stored in Sanity — filled server-side from the Medusa product's thumbnail
  productImage?: string | null
}

export interface SanityQuoteBlock {
  _type: "quoteBlock"
  _key: string
  quote: string
  attribution?: string
}

export interface SanityStatementBlock {
  _type: "statementBlock"
  _key: string
  statement: string
}

export interface SanityAccordionBlock {
  _type: "accordionBlock"
  _key: string
  label: string
  content: SanityPortableTextBlock[]
}

export type SanityContentBlock =
  | SanityPortableTextBlock
  | SanityImageBlock
  | SanityImageGalleryBlock
  | SanityCtaBlock
  | SanityQuoteBlock
  | SanityStatementBlock
  | SanityAccordionBlock

export interface SanityBlogAuthor {
  name: string
  avatar?: SanityImageRef | null
}

export interface SanityFeaturedProduct {
  handle: string
  title: string
  image: string | null
  price: string | null
}

export interface SanityBlog {
  title: string
  slug: string
  description?: string
  publishedDate?: string
  coverImage?: SanityImageRef | null
  categories?: string[]
  tags?: string[]
  author?: SanityBlogAuthor | null
  content: SanityContentBlock[]
  // Raw product handles from Sanity — resolved server-side into SanityFeaturedProduct[]
  featuredProducts?: string[]
}

export interface SanitySEO {
  metaTitle: string
  metaDescription: string
  keywords?: string
  shareImage?: { url: string }
}

// Featured product for Blog Template 1, resolved server-side from Medusa —
// carries variants so the article's "From the Botanist's Shelf" cards can
// add to cart directly.
export interface ResolvedFeaturedProduct {
  id: string
  name: string
  handle: string
  image?: string
  hoverImage?: string
  description?: string
  subtitle?: string | null
  variants?: any[]
}

// Blog Template 1 (migrated off Contentful). `content` is Portable Text;
// `featuredProducts` holds raw Medusa handles until the route resolves them
// into ResolvedFeaturedProduct[].
export interface SanityBlogTemplate1 {
  title: string
  slug: string
  description?: string
  publishedDate?: string
  coverImage?: SanityImageRef | null
  imageAlt?: string
  author?: SanityBlogAuthor | null
  categories?: string[]
  content: SanityContentBlock[]
  featuredProducts?: string[]
  resolvedFeaturedProducts?: ResolvedFeaturedProduct[]
}
