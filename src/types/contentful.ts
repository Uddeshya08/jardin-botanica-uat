import type { Document } from "@contentful/rich-text-types"
import type { EntrySkeletonType } from "contentful"

// ... (keep existing imports)

// ...

export interface Blog {
  title: string
  slug: string
  description: string
  content: Document // Rich text document
  publishedDate: string
  image?: string
  imagealt?: string
  categories: string[]
  author?: Author
  featuredProducts: {
    id: string
    name: string
    handle: string
    image?: string
    description?: string
    subtitle?: string | null
    variants?: import("@medusajs/types").HttpTypes.StoreProductVariant[]
  }[]
  tags: string[]
}

// Contentful Product Content Fields
export interface ProductContentFields {
  title: string
  slug: string
  description: string
  images: ContentfulAsset[]
  productHandle: string // Note: Contentful uses camelCase
  features: ContentfulFeatures
  breadCrumbs?: Array<{
    fields: {
      title: string
      url: string
    }
  }>
  // productAccordions: ProductAccordion[];
}

// Contentful Product Content Entry Skeleton
export interface ContentfulProductContent extends EntrySkeletonType {
  contentTypeId: "productContent"
  fields: ProductContentFields
}

export interface ContentfulAsset {
  fields: {
    title: string
    description?: string
    file: {
      url: string
      details: {
        size: number
        image?: {
          width: number
          height: number
        }
      }
      fileName: string
      contentType: string
    }
  }
  sys: {
    id: string
  }
}

export interface ContentfulFeatures {
  [key: string]: any
}

export interface ProductAccordion {
  title: string
  contentText: string
}

// Simplified type for use in components
export interface ProductContent {
  title: string
  slug: string
  description: string
  images: ProductImage[]
  productHandle: string
  features: ContentfulFeatures
  productAccordion: ProductAccordion[]
  breadCrumbs?: BreadcrumbItem[]
}

export interface ProductImage {
  url: string
  title: string
  width?: number
  height?: number
}

export interface BreadcrumbItem {
  title: string
  url: string
}

// Featured Section Content Types
export interface FeaturedSectionFields {
  title: string
  sectionKey: string
  heading?: string
  subheading?: string
  backgroundColor?: string
  inputPlaceholder?: string
  ctaLabel?: string
  ctaLink?: string
  isActive: boolean
}

export interface ContentfulFeaturedSection extends EntrySkeletonType {
  contentTypeId: "featuredSection"
  fields: FeaturedSectionFields
}

// Simplified type for use in components
export interface FeaturedSection {
  title: string
  sectionKey: string
  heading: string
  subheading: string
  backgroundColor: string
  inputPlaceholder: string
  ctaLabel: string
  ctaLink: string
  isActive: boolean
}

// Customer Testimonials Content Types
export interface TestimonialItem {
  id: number
  name: string
  initials: string
  location: string
  rating: number
  review: string
  product?: string
  purchaseDate?: string
  verified: boolean
}

export interface TestimonialCTA {
  showMore: string
  showLess: string
  initialCount: number
}

export interface TestimonialsFields {
  title: string
  sectionKey: string
  productHandle?: string // Optional: Medusa product handle for reference
  heading?: string
  subheading?: string
  backgroundColor?: string
  showMoreText?: string
  showLessText?: string
  initialCount?: number
  testimonials: any[] // JSON objects from Contentful
  isActive: boolean
}

export interface ContentfulTestimonials extends EntrySkeletonType {
  contentTypeId: "testimonialsSection"
  fields: TestimonialsFields
}

// Simplified type for use in components
export interface TestimonialsSection {
  title: string
  sectionKey: string
  productHandle?: string // Optional: Medusa product handle for reference
  heading: string
  subheading: string
  backgroundColor: string
  cta: TestimonialCTA
  items: TestimonialItem[]
  isActive: boolean
}

// Featured Ritual Two Content Types
export interface FeaturedRitualTwoCTA {
  label: string
  href: string
}

export interface FeaturedRitualTwoFields {
  title: string
  sectionKey: string
  productHandle?: string // Optional: Medusa product handle for reference
  heading?: string
  subheading?: string
  backgroundColor?: string
  image?: ContentfulAsset // Changed from imageUrl to Contentful Asset
  imageAlt?: string
  ctaLabel?: string
  ctaLink?: string
  imagePosition?: "left" | "right"
  active: boolean
}

export interface ContentfulFeaturedRitualTwo extends EntrySkeletonType {
  contentTypeId: "featuredRitualTwoSection"
  fields: FeaturedRitualTwoFields
}

// Simplified type for use in components
export interface FeaturedRitualTwoSection {
  title: string
  sectionKey: string
  productHandle?: string
  heading: string
  subheading: string
  backgroundColor: string
  imageUrl: string // This will be the processed URL from Contentful Asset
  imageAlt: string
  cta: FeaturedRitualTwoCTA
  imagePosition: "left" | "right"
  active: boolean
}

// Afterlife Section Content Types
export interface AfterlifeItem {
  icon?:
    | string
    | {
        src: string
        alt: string
      }
  title?: string
  text: string
}

export interface AfterlifeSectionFields {
  title: string
  sectionKey: string
  productHandle?: string // Optional: Medusa product handle for reference
  heading?: string
  backgroundColor?: string
  items?: any[] // JSON objects from Contentful
  isActive: boolean
}

export interface ContentfulAfterlifeSection extends EntrySkeletonType {
  contentTypeId: "afterlifeSection"
  fields: AfterlifeSectionFields
}

// Simplified type for use in components (matches the exported AfterlifeContent from Afterlife.tsx)
export interface AfterlifeSection {
  title: string
  sectionKey: string
  productHandle?: string
  heading: string
  backgroundColor: string
  items: AfterlifeItem[]
  isActive: boolean
}

// Product Info Panels Content Types
export interface ActiveItem {
  name: string
  description: string
}

export interface FragranceNote {
  type: string // "Top Notes", "Heart Notes", "Base Notes"
  description: string
}

// Dynamic Panel Types - for future extensibility
export type PanelContentType =
  | "text" // Simple text content
  | "actives" // List of active items with name/description
  | "fragrance" // Fragrance notes
  | "ingredients" // Ingredients list
  | "structured" // Custom structured content (JSON)

export interface DynamicPanel {
  id: string // Unique identifier for the panel
  title: string // Panel title (e.g., "Ritual in Practice", "How to Use", "Benefits", etc.)
  type: PanelContentType
  content: string | ActiveItem[] | FragranceNote[] | any // Content based on type
  isVisible: boolean // Whether to show this panel
  order?: number // Display order (lower numbers appear first)
}

export interface ProductInfoPanelsFields {
  title: string
  productHandle: string
  // Legacy fields (for backward compatibility)
  ritualInPractice?: string
  actives?: any[]
  fragranceNotes?: any[]
  fullIngredients?: string
  showRitualInPractice?: boolean
  showActives?: boolean
  showFragranceNotes?: boolean
  showFullIngredients?: boolean
  // New dynamic panels array (for future extensibility)
  panels?: any[] // JSON array of DynamicPanel objects
  isActive: boolean
}

export interface ContentfulProductInfoPanels extends EntrySkeletonType {
  contentTypeId: "productInfoPanels"
  fields: ProductInfoPanelsFields
}

// Simplified type for use in components
export interface ProductInfoPanels {
  title: string
  productHandle: string
  // Legacy fields (for backward compatibility)
  ritualInPractice: string
  actives: ActiveItem[]
  fragranceNotes: FragranceNote[]
  fullIngredients: string
  showRitualInPractice: boolean
  showActives: boolean
  showFragranceNotes: boolean
  showFullIngredients: boolean
  // New dynamic panels array
  panels: DynamicPanel[]
  isActive: boolean
}

// From the Lab Section Content Types
export interface FromTheLabProduct {
  id?: string | number
  name: string
  price?: number
  currency?: string
  image?: string
  hoverImage?: string
  description?: string
  badge?: string
  url?: string
  variantId?: string // Optional: For direct cart addition
}

export interface FromTheLabProductFields {
  id?: string | number
  name: string
  price?: number
  currency?: string
  image?: string | ContentfulAsset // Can be URL string or Contentful Asset
  hoverImage?: string | ContentfulAsset // Can be URL string or Contentful Asset
  description?: string
  badge?: string
  url?: string
}

// ProductCard Content Type (Referenced from FromTheLabSection)
export interface ProductCardFields {
  name: string
  label?: string // Optional label field (used in candles collection)
  price?: number
  currency?: string
  image?: ContentfulAsset // Media field
  hoverImage?: ContentfulAsset // Media field
  description?: string
  badge?: string
  url?: string
  variantId?: string // Optional: For direct cart addition
}

export interface ContentfulProductCard extends EntrySkeletonType {
  contentTypeId: "productCard"
  fields: ProductCardFields
}

// FromTheLabSection Content Type (matches user's Contentful structure)
export interface FromTheLabSectionFields {
  heading?: string
  subheading?: string
  backgroundColor?: string
  isActive: boolean
  products?: ContentfulProductCard[] // Array of references to ProductCard
  productHandle?: string // Optional: For product-specific filtering
  sectionKey?: string // Optional: For section-specific filtering
}

export interface ContentfulFromTheLabSection extends EntrySkeletonType {
  contentTypeId: "fromTheLabSection" // Matches Contentful content type ID
  fields: FromTheLabSectionFields
}

// Simplified type for use in components
export interface FromTheLabSection {
  heading: string
  subheading: string
  backgroundColor: string
  products: FromTheLabProduct[]
  isActive: boolean
}

// Generic Page Banner Content Types (Reusable for any page)
export interface PageBannerFields {
  title: string
  description: string
  mediaType: "video" | "image"
  video?: ContentfulAsset
  image?: ContentfulAsset
  fallbackImage?: ContentfulAsset
  isActive: boolean
  pageKey: string // Required: Identifies which page this banner is for (e.g., "candles", "home", "about", "hand-care")
}

export interface ContentfulPageBanner extends EntrySkeletonType {
  contentTypeId: "pageBanner" // Generic content type name in Contentful
  fields: PageBannerFields
}

// Simplified type for use in components
export interface PageBanner {
  title: string
  description: string
  mediaType: "video" | "image"
  videoUrl?: string
  imageUrl?: string
  fallbackImageUrl?: string
  isActive: boolean
  pageKey: string
}

// Legacy type alias for backward compatibility (deprecated - use PageBanner instead)
/** @deprecated Use PageBanner instead */
export type CandlesPageBanner = PageBanner

// Candles Collection Section Content Types (uses ProductCard references)
export interface CandlesCollectionSectionFields {
  sectionKey?: string // Optional: For filtering specific sections
  isActive: boolean
  products?: ContentfulProductCard[] // Array of references to ProductCard entries
  order?: number // Display order for items within the section
}

export interface ContentfulCandlesCollectionSection extends EntrySkeletonType {
  contentTypeId: "candlesCollectionSection"
  fields: CandlesCollectionSectionFields
}

// Simplified type for use in components (maps ProductCard to candles collection format)
export interface CandlesCollectionItem {
  label: string
  src: string // Image URL
  hoverSrc?: string // Optional hover image URL
  url?: string // URL to navigate to when clicked
  order: number
  isActive: boolean
  price?: number // Optional price from Medusa
  variantId?: string // Medusa variant ID for cart
}

// Legacy type - kept for backward compatibility but deprecated
/** @deprecated Use CandlesCollectionSection with ProductCard references instead */
export interface CandlesCollectionItemFields {
  label: string
  image: ContentfulAsset
  hoverImage?: ContentfulAsset
  url?: string
  order?: number
  isActive: boolean
}

/** @deprecated Use ContentfulCandlesCollectionSection instead */
export interface ContentfulCandlesCollectionItem extends EntrySkeletonType {
  contentTypeId: "candlesCollectionItem"
  fields: CandlesCollectionItemFields
}

// Gift Set Question Content Types
export interface GiftSetQuestionFields {
  question: string
  options: any[] // References to option entries with name, size fields
}

export interface ContentfulGiftSetQuestion extends EntrySkeletonType {
  contentTypeId: "giftSetQuestion"
  fields: GiftSetQuestionFields
}

// Option item in a question (e.g., candle options)
export interface GiftSetQuestionOption {
  name: string
  size: string
}

// Simplified type for use in components
export interface GiftSetQuestion {
  question: string
  options: GiftSetQuestionOption[]
}

// Gift Set Content Types
export interface GiftSetFields {
  handle: string
  title: string
  description: string
  category: string // Short text - for filtering
  productSetsIncluded: string[] // Short text, list
  price: number
  questions: ContentfulGiftSetQuestion[] // References, many
  featured: boolean
  coverImage: ContentfulAsset // Media
  images: ContentfulAsset[] // Media, many files
  hoverImage: ContentfulAsset // Media
}

export interface ContentfulGiftSet extends EntrySkeletonType {
  contentTypeId: "giftSets"
  fields: GiftSetFields
}

// Simplified type for use in components
export interface GiftSet {
  handle: string
  title: string
  description: string
  category: string
  productSetsIncluded: string[]
  price: number
  questions: GiftSetQuestion[]
  featured: boolean
  coverImage: string // URL
  images: string[] // URLs
  hoverImage: string // URL
}

// Page Link Content Types (for navigation)
export interface PageLinkFields {
  title: string
  url: string
  image?: ContentfulAsset
}

export interface ContentfulPageLink extends EntrySkeletonType {
  contentTypeId: "pageLink"
  fields: PageLinkFields
}

export interface PageLink {
  title: string
  url: string
  image?: string
}

// Product Category Content Types (for navigation)
export interface ProductCategoryFields {
  name: string
  handle: string // Unique identifier for querying
  url?: string
  productHandles?: string[] // List of Medusa product handles associated with this category
  subCategory?: (ContentfulPageLink | ContentfulProductCategory)[] // Can reference either PageLink or ProductCategory
}

export interface ContentfulProductCategory extends EntrySkeletonType {
  contentTypeId: "productCategory"
  fields: ProductCategoryFields
}

// Recursive ProductCategory structure for nested categories
export interface ProductCategory {
  name: string
  handle: string
  url?: string
  productHandles: string[] // Medusa product handles to fetch
  subCategories: ProductCategory[] // Only nested ProductCategory items (filtered from subCategory)
}

// Navigation Content Types
export interface NavigationFields {
  items: (ContentfulProductCategory | ContentfulPageLink)[]
}

export interface ContentfulNavigation extends EntrySkeletonType {
  contentTypeId: "navigation"
  fields: NavigationFields
}

// Simplified navigation item for component use
export interface NavigationItem {
  name: string
  href?: string
  dropdown?: { label: string; href: string; image?: string }[]
}

// Author Content Types
export interface AuthorFields {
  name: string
  profilePic?: ContentfulAsset
  socialLinks?: string[]
}

export interface ContentfulAuthor extends EntrySkeletonType {
  contentTypeId: "author"
  fields: AuthorFields
}

export interface Author {
  name: string
  profilePic?: string
  socialLinks: string[]
}

// Blog Content Types
export interface BlogFields {
  title: string
  slug: string
  description: string
  content: any // Rich text
  publishedDate: string
  image?: ContentfulAsset
  imagealt?: string
  category?: any[] // References
  author?: ContentfulAuthor
  featuredProducts?: any[] // References
  tags?: string[]
}

export interface ContentfulBlog extends EntrySkeletonType {
  contentTypeId: "blog"
  fields: BlogFields
}
