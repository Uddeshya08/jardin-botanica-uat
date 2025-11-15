import { EntrySkeletonType } from "contentful"

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
  imagePosition?: 'left' | 'right'
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
  imagePosition: 'left' | 'right'
  active: boolean
}