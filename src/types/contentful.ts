import type { EntrySkeletonType } from "contentful"

// Contentful Product Content Fields
export interface ProductContentFields {
  title: string
  slug: string
  description: string
  images: ContentfulAsset[]
  productHandle: string // Note: Contentful uses camelCase
  features: ContentfulFeatures
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

// Simplified type for use in components
export interface ProductContent {
  title: string
  slug: string
  description: string
  images: ProductImage[]
  productHandle: string
  features: ContentfulFeatures
}

export interface ProductImage {
  url: string
  title: string
  width?: number
  height?: number
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
