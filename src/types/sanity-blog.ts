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
  topImage: SanityImageRef
  statement: string
  bottomImage: SanityImageRef
}

export type SanityContentBlock =
  | SanityPortableTextBlock
  | SanityImageBlock
  | SanityImageGalleryBlock
  | SanityCtaBlock
  | SanityQuoteBlock
  | SanityStatementBlock

export interface SanityBlogAuthor {
  name: string
  avatar?: SanityImageRef | null
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
}

export interface SanitySEO {
  metaTitle: string
  metaDescription: string
  keywords?: string
  shareImage?: { url: string }
}
