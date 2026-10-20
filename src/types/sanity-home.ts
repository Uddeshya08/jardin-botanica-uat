export interface HomeImage {
  url?: string
  alt?: string
}

export interface HomeHeroSlide {
  _key: string
  title?: string
  headline?: string
  description?: string
  image?: HomeImage
  videoUrl?: string
  ctaLabel?: string
  ctaAction?: "link" | "newsletter"
  ctaLink?: string
}

export interface HomeEditorialSection {
  eyebrow?: string
  heading?: string
  description?: string
  secondaryText?: string
  image?: HomeImage
  ctaLabel?: string
  ctaLink?: string
  emailPlaceholder?: string
  submitLabel?: string
  contactEmail?: string
  emailSubject?: string
}

export interface SanityHomePage {
  heroSlides?: HomeHeroSlide[]
  philosophy?: HomeEditorialSection
  products?: HomeEditorialSection
  ritual?: HomeEditorialSection
  gifting?: HomeEditorialSection
  journal?: HomeEditorialSection
  newsletter?: HomeEditorialSection
}
