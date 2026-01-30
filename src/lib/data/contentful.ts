"use server"

import { getContentfulClient } from "@lib/contentful"
import type { Entry } from "contentful"
import {
  type ActiveItem,
  type AfterlifeItem,
  type AfterlifeSection,
  type BreadcrumbItem,
  type CandlesCollectionItem,
  CandlesPageBanner, // For backward compatibility
  type ContentfulAfterlifeSection,
  ContentfulAsset,
  type ContentfulCandlesCollectionItem,
  type ContentfulCandlesCollectionSection,
  type ContentfulFeaturedRitualTwo,
  type ContentfulFeaturedSection,
  type ContentfulFromTheLabSection,
  type ContentfulGiftSet,
  type ContentfulPageBanner,
  ContentfulProductCard,
  type ContentfulProductContent,
  type ContentfulProductInfoPanels,
  type ContentfulTestimonials,
  type DynamicPanel,
  type FeaturedRitualTwoSection,
  type FeaturedSection,
  type FragranceNote,
  type FromTheLabProduct,
  type FromTheLabSection,
  type GiftSet,
  type GiftSetQuestion,
  type GiftSetQuestionOption,
  type PageBanner,
  type ProductContent,
  type ProductImage,
  type ProductInfoPanels,
  type TestimonialItem,
  type TestimonialsSection,
} from "../../types/contentful"
import { getProductByHandle } from "./products"

/**
 * Helper function to extract plain text from Contentful rich text fields
 * Handles both plain strings and rich text document objects
 */
function extractTextFromRichText(value: any): string {
  if (!value) return ""

  // If it's already a string, return it
  if (typeof value === "string") return value

  // If it's a rich text document object
  if (
    value &&
    typeof value === "object" &&
    value.nodeType === "document" &&
    Array.isArray(value.content)
  ) {
    const extractText = (node: any): string => {
      if (node.nodeType === "text" && node.value) {
        return node.value
      }
      if (node.content && Array.isArray(node.content)) {
        return node.content.map(extractText).join("")
      }
      return ""
    }
    return value.content.map(extractText).join(" ").trim()
  }

  // Fallback: try to stringify if it's an object
  if (typeof value === "object") {
    return JSON.stringify(value)
  }

  return String(value)
}

/**
 * Fetch product content from Contentful by product handle
 * @param productHandle - The handle/slug of the product in Medusa
 * @returns ProductContent or null if not found
 */
export async function getProductContentByHandle(
  productHandle: string
): Promise<ProductContent | null> {
  try {
    const client = getContentfulClient()

    // Query Contentful for entries with matching productHandle
    const response = await client.getEntries({
      content_type: "productContent", // Your content type ID
      "fields.productHandle": productHandle,
      limit: 1,
    })

    console.log("PRODUCT CONTENT RESPONSE")
    console.log(response.items[0].fields)

    if (!response.items || response.items.length === 0) {
      console.warn(`No content found for product handle: ${productHandle}`)
      return null
    }

    const entry = response.items[0] as Entry<ContentfulProductContent>

    // Transform Contentful entry to our simplified type
    return transformContentfulEntry(entry)
  } catch (error) {
    console.error("Error fetching product content from Contentful:", error)
    return null
  }
}

/**
 * Fetch all product content entries from Contentful
 * @returns Array of ProductContent
 */
export async function getAllProductContent(): Promise<ProductContent[]> {
  try {
    const client = getContentfulClient()

    const response = await client.getEntries({
      content_type: "productContent",
      limit: 100, // Adjust based on your needs
    })

    if (!response.items || response.items.length === 0) {
      return []
    }

    return response.items
      .map((item) => transformContentfulEntry(item as Entry<ContentfulProductContent>))
      .filter((item): item is ProductContent => item !== null)
  } catch (error) {
    console.error("Error fetching all product content from Contentful:", error)
    return []
  }
}

/**
 * Transform Contentful entry to our simplified ProductContent type
 */
function transformContentfulEntry(entry: Entry<ContentfulProductContent>): ProductContent | null {
  try {
    const fields = entry.fields as any

    // Transform images - check if images field exists and is an array
    const images: ProductImage[] = []
    if (fields && fields.images && Array.isArray(fields.images)) {
      fields.images.forEach((asset: any) => {
        if (asset && asset.fields && asset.fields.file) {
          images.push({
            url: asset.fields.file.url.startsWith("//")
              ? `https:${asset.fields.file.url}`
              : asset.fields.file.url,
            title: asset.fields.title || "",
            width: asset.fields.file.details.image?.width,
            height: asset.fields.file.details.image?.height,
          })
        }
      })
    }

    const accordionItems = fields?.productAccordion?.map((details: any) => ({
      ...details.fields,
    }))

    // Transform breadcrumbs array if it exists
    const breadCrumbs =
      fields?.breadCrumbs?.map((crumb: any) => ({
        title: crumb?.fields?.title || crumb?.title || "",
        url: crumb?.fields?.url || crumb?.url || "",
      })) || []

    return {
      title: fields.title || "",
      slug: fields.slug || "",
      description: fields.description || "",
      images,
      productHandle: fields.productHandle || fields.product_handle || "",
      features: fields.features || {},
      productAccordion: accordionItems || [],
      breadCrumbs,
    }
  } catch (error) {
    console.error("Error transforming Contentful entry:", error)
    return null
  }
}

/**
 * Validate Contentful connection
 * @returns boolean indicating if the connection is successful
 */
export async function validateContentfulConnection(): Promise<boolean> {
  try {
    const client = getContentfulClient()
    await client.getContentTypes()
    return true
  } catch (error) {
    console.error("Contentful connection validation failed:", error)
    return false
  }
}

/**
 * Fetch featured section content from Contentful by section key
 * @param sectionKey - The unique key for the featured section (e.g., "pdp-featured", "homepage-featured")
 * @returns FeaturedSection or null if not found
 */
export async function getFeaturedSectionByKey(sectionKey: string): Promise<FeaturedSection | null> {
  try {
    const client = getContentfulClient()

    // Query Contentful for entries with matching sectionKey
    const response = await client.getEntries({
      content_type: "featuredSection",
      "fields.sectionKey": sectionKey,
      "fields.isActive": true, // Only fetch active sections
      limit: 1,
    })

    if (!response.items || response.items.length === 0) {
      console.warn(`No featured section found for key: ${sectionKey}`)
      return null
    }

    const entry = response.items[0] as unknown as Entry<ContentfulFeaturedSection>

    return transformFeaturedSectionEntry(entry)
  } catch (error) {
    console.error("Error fetching featured section from Contentful:", error)
    return null
  }
}

/**
 * Fetch all active featured sections from Contentful
 * @returns Array of FeaturedSection
 */
export async function getAllFeaturedSections(): Promise<FeaturedSection[]> {
  try {
    const client = getContentfulClient()

    const response = await client.getEntries({
      content_type: "featuredSection",
      "fields.isActive": true,
      limit: 100,
    })

    if (!response.items || response.items.length === 0) {
      return []
    }

    return response.items
      .map((item) =>
        transformFeaturedSectionEntry(item as unknown as Entry<ContentfulFeaturedSection>)
      )
      .filter((item): item is FeaturedSection => item !== null)
  } catch (error) {
    console.error("Error fetching all featured sections from Contentful:", error)
    return []
  }
}

/**
 * Transform Contentful featured section entry to simplified FeaturedSection type
 */
function transformFeaturedSectionEntry(
  entry: Entry<ContentfulFeaturedSection>
): FeaturedSection | null {
  try {
    const fields = entry.fields as any

    // Provide defaults for optional fields
    return {
      title: fields.title || "",
      sectionKey: fields.sectionKey || "",
      heading: extractTextFromRichText(fields.heading) || "Cultivate Your Ritu",
      subheading:
        extractTextFromRichText(fields.subheading) ||
        "Subscribe to receive hand care wisdom, botanical insights, and early access to our latest concoctions.",
      backgroundColor: fields.backgroundColor || "#e3e3d8",
      inputPlaceholder: fields.inputPlaceholder || "Enter your email",
      ctaLabel: fields.ctaLabel || "Subscribe",
      ctaLink: fields.ctaLink || "#",
      isActive: fields.isActive ?? true,
    }
  } catch (error) {
    console.error("Error transforming Contentful featured section entry:", error)
    return null
  }
}

/**
 * Fetch testimonials section content from Contentful by product handle
 * @param productHandle - The product handle to filter by
 * @returns TestimonialsSection or null if not found
 */
export async function getTestimonialsSectionByProductHandle(
  productHandle: string
): Promise<TestimonialsSection | null> {
  try {
    const client = getContentfulClient()

    // console.log(`Searching for testimonials section with productHandle: ${productHandle}`)

    // Query Contentful for entries with matching productHandle
    const response = await client.getEntries({
      content_type: "testimonialsSection",
      "fields.productHandle": productHandle,
      "fields.isActive": true, // Only fetch active sections
      limit: 1,
    })

    // console.log(`Found ${response.items.length} testimonials entries for productHandle: ${productHandle}`)

    if (response.items && response.items.length > 0) {
      const entry = response.items[0] as unknown as Entry<ContentfulTestimonials>
      // console.log("Testimonials entry fields:", entry.fields) // Debug logging
      return transformTestimonialsSectionEntry(entry)
    }

    // console.warn(`No testimonials section found for productHandle: ${productHandle}`)
    return null
  } catch (error) {
    console.error("Error fetching testimonials section from Contentful:", error)
    return null
  }
}

/**
 * Fetch testimonials section content from Contentful by section key
 * @param sectionKey - The unique key for the testimonials section (e.g., "pdp-testimonials", "homepage-testimonials")
 * @returns TestimonialsSection or null if not found
 */
export async function getTestimonialsSectionByKey(
  sectionKey: string
): Promise<TestimonialsSection | null> {
  try {
    const client = getContentfulClient()

    console.log(`Searching for testimonials section with key: ${sectionKey}`)

    // Query Contentful for entries with matching sectionKey
    const response = await client.getEntries({
      content_type: "testimonialsSection",
      "fields.sectionKey": sectionKey,
      "fields.isActive": true, // Only fetch active sections
      limit: 1,
    })

    console.log(`Found ${response.items.length} testimonials entries for key: ${sectionKey}`)

    if (!response.items || response.items.length === 0) {
      console.warn(`No testimonials section found for key: ${sectionKey}`)
      return null
    }

    const entry = response.items[0] as unknown as Entry<ContentfulTestimonials>
    // console.log("Testimonials entry fields:", entry.fields) // Debug logging

    return transformTestimonialsSectionEntry(entry)
  } catch (error) {
    console.error("Error fetching testimonials section from Contentful:", error)
    return null
  }
}

/**
 * Fetch all active testimonials sections from Contentful
 * @returns Array of TestimonialsSection
 */
export async function getAllTestimonialsSections(): Promise<TestimonialsSection[]> {
  try {
    const client = getContentfulClient()

    const response = await client.getEntries({
      content_type: "testimonialsSection",
      "fields.isActive": true,
      limit: 100,
    })

    if (!response.items || response.items.length === 0) {
      return []
    }

    return response.items
      .map((item) =>
        transformTestimonialsSectionEntry(item as unknown as Entry<ContentfulTestimonials>)
      )
      .filter((item): item is TestimonialsSection => item !== null)
  } catch (error) {
    console.error("Error fetching all testimonials sections from Contentful:", error)
    return []
  }
}

/**
 * Transform Contentful testimonials section entry to simplified TestimonialsSection type
 */
function transformTestimonialsSectionEntry(
  entry: Entry<ContentfulTestimonials>
): TestimonialsSection | null {
  try {
    const fields = entry.fields as any

    // Parse testimonials array
    const items: TestimonialItem[] = Array.isArray(fields.testimonials)
      ? fields.testimonials.map((t: any, index: number) => {
          // Handle both JSON objects and stringified JSON
          const testimonial = typeof t === "string" ? JSON.parse(t) : t

          return {
            id: testimonial.id ?? index + 1,
            name: testimonial.name || "",
            initials: testimonial.initials || "",
            location: testimonial.location || "",
            rating: testimonial.rating ?? 5,
            review: testimonial.review || "",
            product: testimonial.product || undefined,
            purchaseDate: testimonial.purchaseDate || undefined,
            verified: testimonial.verified ?? true,
          }
        })
      : []

    // Provide defaults for optional fields
    return {
      title: fields.title || "",
      sectionKey: fields.sectionKey || "",
      productHandle: fields.productHandle || undefined,
      heading: extractTextFromRichText(fields.heading) || "Loved By Our Customers",
      subheading:
        extractTextFromRichText(fields.subheading) ||
        "Real experiences from those who've made our product part of their daily ritual.",
      backgroundColor: fields.backgroundColor || "#e3e3d8",
      cta: {
        showMore: fields.showMoreText || "View All Reviews",
        showLess: fields.showLessText || "Show Less Reviews",
        initialCount: fields.initialCount ?? 3,
      },
      items,
      isActive: fields.isActive ?? true,
    }
  } catch (error) {
    console.error("Error transforming Contentful testimonials section entry:", error)
    return null
  }
}

/**
 * Fetch featured ritual two section content from Contentful by product handle
 * @param productHandle - The product handle to filter by
 * @returns FeaturedRitualTwoSection or null if not found
 */
export async function getFeaturedRitualTwoSectionByProductHandle(
  productHandle: string
): Promise<FeaturedRitualTwoSection | null> {
  try {
    const client = getContentfulClient()

    console.log(`Searching for featured ritual two section with productHandle: ${productHandle}`)

    // Query Contentful for entries with matching productHandle
    const response = await client.getEntries({
      content_type: "featuredRitualTwoSection",
      "fields.productHandle": productHandle,
      "fields.active": true, // Only fetch active sections
      limit: 1,
    })

    console.log(`Found ${response.items.length} entries for productHandle: ${productHandle}`)

    if (response.items && response.items.length > 0) {
      const entry = response.items[0] as unknown as Entry<ContentfulFeaturedRitualTwo>
      // console.log("Entry fields:", entry.fields) // Debug logging
      return transformFeaturedRitualTwoSectionEntry(entry)
    }

    console.warn(`No featured ritual two section found for productHandle: ${productHandle}`)
    return null
  } catch (error) {
    console.error("Error fetching featured ritual two section from Contentful:", error)
    return null
  }
}

/**
 * Fetch featured ritual two section content from Contentful by section key
 * @param sectionKey - The unique key for the featured ritual two section (e.g., "pdp-featured-ritual-two", "homepage-featured-ritual-two")
 * @returns FeaturedRitualTwoSection or null if not found
 */
export async function getFeaturedRitualTwoSectionByKey(
  sectionKey: string
): Promise<FeaturedRitualTwoSection | null> {
  try {
    const client = getContentfulClient()

    console.log(`Searching for featured ritual two section with key: ${sectionKey}`)

    // Query Contentful for entries with matching sectionKey
    const response = await client.getEntries({
      content_type: "featuredRitualTwoSection",
      "fields.sectionKey": sectionKey,
      "fields.active": true, // Only fetch active sections
      limit: 1,
    })

    console.log(`Found ${response.items.length} entries for key: ${sectionKey}`)

    if (!response.items || response.items.length === 0) {
      console.warn(`No featured ritual two section found for key: ${sectionKey}`)
      return null
    }

    const entry = response.items[0] as unknown as Entry<ContentfulFeaturedRitualTwo>
    // console.log("Entry fields:", entry.fields) // Debug logging

    return transformFeaturedRitualTwoSectionEntry(entry)
  } catch (error) {
    console.error("Error fetching featured ritual two section from Contentful:", error)
    return null
  }
}

/**
 * Fetch all active featured ritual two sections from Contentful
 * @returns Array of FeaturedRitualTwoSection
 */
export async function getAllFeaturedRitualTwoSections(): Promise<FeaturedRitualTwoSection[]> {
  try {
    const client = getContentfulClient()

    const response = await client.getEntries({
      content_type: "featuredRitualTwoSection",
      "fields.active": true,
      limit: 100,
    })

    if (!response.items || response.items.length === 0) {
      return []
    }

    return response.items
      .map((item) =>
        transformFeaturedRitualTwoSectionEntry(
          item as unknown as Entry<ContentfulFeaturedRitualTwo>
        )
      )
      .filter((item): item is FeaturedRitualTwoSection => item !== null)
  } catch (error) {
    console.error("Error fetching all featured ritual two sections from Contentful:", error)
    return []
  }
}

/**
 * Transform Contentful featured ritual two section entry to simplified FeaturedRitualTwoSection type
 */
function transformFeaturedRitualTwoSectionEntry(
  entry: Entry<ContentfulFeaturedRitualTwo>
): FeaturedRitualTwoSection | null {
  try {
    const fields = entry.fields as any

    // Process Contentful Asset to get image URL
    let imageUrl = "/assets/handCareImage.png" // Default fallback

    if (fields.image && fields.image.fields && fields.image.fields.file) {
      const assetUrl = fields.image.fields.file.url
      imageUrl = assetUrl.startsWith("//") ? `https:${assetUrl}` : assetUrl
      console.log("Contentful image URL:", imageUrl) // Debug logging
    } else {
      console.log("No Contentful image found, using default") // Debug logging
    }

    // Provide defaults for optional fields
    return {
      title: fields.title || "",
      sectionKey: fields.sectionKey || "",
      productHandle: fields.productHandle || undefined,
      heading: extractTextFromRichText(fields.heading) || "Hand Care Elevated",
      subheading:
        extractTextFromRichText(fields.subheading) ||
        "A refreshing blend of tea antioxidants and gentle exfoliants, this handwash keeps your hands healthy, glowing, and nourished.",
      backgroundColor: fields.backgroundColor || "#e3e3d8",
      imageUrl: imageUrl,
      imageAlt:
        fields.imageAlt || "Jardin Botanica Tea Exfoliant Rinse with hands and botanical elements",
      cta: {
        label: fields.ctaLabel || "Read more",
        href: fields.ctaLink || "#",
      },
      imagePosition:
        fields.imagePosition === "left" || fields.imagePosition === "right"
          ? fields.imagePosition
          : "left",
      active: fields.active ?? true,
    }
  } catch (error) {
    console.error("Error transforming Contentful featured ritual two section entry:", error)
    return null
  }
}

/**
 * Fetch afterlife section from Contentful by product handle
 * @param productHandle - The handle/slug of the product in Medusa
 * @returns AfterlifeSection or null if not found
 */
export async function getAfterlifeSectionByProductHandle(
  productHandle: string
): Promise<AfterlifeSection | null> {
  try {
    const client = getContentfulClient()

    const response = await client.getEntries({
      content_type: "afterlifeSection",
      "fields.productHandle": productHandle,
      "fields.isActive": true,
      limit: 1,
    })

    if (!response.items || response.items.length === 0) {
      return null
    }

    const entry = response.items[0] as unknown as Entry<ContentfulAfterlifeSection>
    return transformAfterlifeSectionEntry(entry)
  } catch (error) {
    console.error("Error fetching afterlife section from Contentful:", error)
    return null
  }
}

/**
 * Fetch afterlife section from Contentful by section key
 * @param sectionKey - The section key identifier
 * @returns AfterlifeSection or null if not found
 */
export async function getAfterlifeSectionByKey(
  sectionKey: string
): Promise<AfterlifeSection | null> {
  try {
    const client = getContentfulClient()

    const response = await client.getEntries({
      content_type: "afterlifeSection",
      "fields.sectionKey": sectionKey,
      "fields.isActive": true,
      limit: 1,
    })

    if (!response.items || response.items.length === 0) {
      return null
    }

    const entry = response.items[0] as unknown as Entry<ContentfulAfterlifeSection>
    return transformAfterlifeSectionEntry(entry)
  } catch (error) {
    console.error("Error fetching afterlife section from Contentful:", error)
    return null
  }
}

/**
 * Transform Contentful afterlife section entry to simplified AfterlifeSection type
 */
function transformAfterlifeSectionEntry(
  entry: Entry<ContentfulAfterlifeSection>
): AfterlifeSection | null {
  try {
    const fields = entry.fields as any

    // Transform items array
    const itemsSrc = Array.isArray(fields.items) ? fields.items : []
    const items: AfterlifeItem[] = itemsSrc.map((it: any): AfterlifeItem => {
      let icon: string | { src: string; alt: string } | undefined

      if (it?.icon) {
        if (
          typeof it.icon === "string" &&
          (it.icon === "recycle" || it.icon === "refresh" || it.icon === "leaf")
        ) {
          icon = it.icon
        } else if (typeof it.icon === "object" && it.icon.src && it.icon.alt) {
          icon = { src: it.icon.src, alt: it.icon.alt }
        }
      }

      return {
        icon,
        title: typeof it?.title === "string" ? it.title : undefined,
        text: typeof it?.text === "string" ? it.text : "",
      }
    })

    return {
      title: fields.title || "",
      sectionKey: fields.sectionKey || "",
      productHandle: fields.productHandle || undefined,
      heading: extractTextFromRichText(fields.heading) || "Afterlife",
      backgroundColor: fields.backgroundColor || "#EBEBE1",
      items,
      isActive: fields.isActive ?? true,
    }
  } catch (error) {
    console.error("Error transforming afterlife section entry:", error)
    return null
  }
}

/**
 * Fetch product info panels from Contentful by product handle
 * @param productHandle - The handle/slug of the product in Medusa
 * @returns ProductInfoPanels or null if not found
 */
export async function getProductInfoPanelsByHandle(
  productHandle: string
): Promise<ProductInfoPanels | null> {
  try {
    const client = getContentfulClient()

    const response = await client.getEntries({
      content_type: "productInfoPanels",
      "fields.productHandle": productHandle,
      "fields.isActive": true,
      limit: 1,
    })

    if (!response.items || response.items.length === 0) {
      return null
    }

    const entry = response.items[0] as unknown as Entry<ContentfulProductInfoPanels>
    return transformProductInfoPanelsEntry(entry)
  } catch (error) {
    console.error("Error fetching product info panels from Contentful:", error)
    return null
  }
}

/**
 * Transform Contentful product info panels entry to simplified ProductInfoPanels type
 */
function transformProductInfoPanelsEntry(
  entry: Entry<ContentfulProductInfoPanels>
): ProductInfoPanels | null {
  try {
    const fields = entry.fields as any

    // Transform actives array
    const activesSrc = Array.isArray(fields.actives) ? fields.actives : []
    const actives: ActiveItem[] = activesSrc.map((item: any): ActiveItem => {
      // Handle both JSON objects and stringified JSON
      const active = typeof item === "string" ? JSON.parse(item) : item
      return {
        name: active?.name || "",
        description: active?.description || "",
      }
    })

    // Transform fragrance notes array
    const fragranceNotesSrc = Array.isArray(fields.fragranceNotes) ? fields.fragranceNotes : []
    const fragranceNotes: FragranceNote[] = fragranceNotesSrc.map((item: any): FragranceNote => {
      // Handle both JSON objects and stringified JSON
      const note = typeof item === "string" ? JSON.parse(item) : item
      return {
        type: note?.type || "",
        description: note?.description || "",
      }
    })

    // Transform dynamic panels array (for future extensibility)
    const panelsSrc = Array.isArray(fields.panels) ? fields.panels : []
    const panels: DynamicPanel[] = panelsSrc
      .map((item: any, index: number): DynamicPanel | null => {
        try {
          // Handle both JSON objects and stringified JSON
          const panel = typeof item === "string" ? JSON.parse(item) : item

          if (!panel || !panel.title || !panel.type) {
            return null
          }

          // Transform content based on type
          let content: any = panel.content || ""

          if (panel.type === "actives" && Array.isArray(panel.content)) {
            content = panel.content.map((c: any) => ({
              name: c?.name || "",
              description: c?.description || "",
            }))
          } else if (panel.type === "fragrance" && Array.isArray(panel.content)) {
            content = panel.content.map((c: any) => ({
              type: c?.type || "",
              description: c?.description || "",
            }))
          }

          return {
            id: panel.id || `panel-${index}`,
            title: panel.title,
            type: panel.type as any,
            content,
            isVisible: panel.isVisible ?? true,
            order: panel.order ?? index,
          }
        } catch (error) {
          console.error("Error parsing panel:", error)
          return null
        }
      })
      .filter((panel: any): panel is DynamicPanel => panel !== null)
      .sort((a: DynamicPanel, b: DynamicPanel) => (a.order ?? 0) - (b.order ?? 0))

    return {
      title: fields.title || "",
      productHandle: fields.productHandle || "",
      ritualInPractice: fields.ritualInPractice || "",
      actives,
      fragranceNotes,
      fullIngredients: fields.fullIngredients || "",
      showRitualInPractice: fields.showRitualInPractice ?? true,
      showActives: fields.showActives ?? true,
      showFragranceNotes: fields.showFragranceNotes ?? true,
      showFullIngredients: fields.showFullIngredients ?? true,
      panels, // Dynamic panels array
      isActive: fields.isActive ?? true,
    }
  } catch (error) {
    console.error("Error transforming product info panels entry:", error)
    return null
  }
}

/**
 * Fetch "From the Lab" section content from Contentful by product handle
 * @param productHandle - The product handle to filter by
 * @returns FromTheLabSection or null if not found
 */
export async function getFromTheLabSectionByProductHandle(
  productHandle: string
): Promise<FromTheLabSection | null> {
  try {
    const client = getContentfulClient()

    // First try to find by productHandle field (if it exists in Contentful)
    const response = await client.getEntries({
      content_type: "fromTheLabSection",
      "fields.productHandle": productHandle,
      "fields.isActive": true,
      include: 2, // Include linked ProductCard entries
      limit: 1,
    })

    if (response.items && response.items.length > 0) {
      const entry = response.items[0] as unknown as Entry<ContentfulFromTheLabSection>
      return transformFromTheLabSectionEntry(entry)
    }

    // Fallback: Try sectionKey pattern matching
    const sectionKey = `${productHandle}-from-the-lab`
    return await getFromTheLabSectionByKey(sectionKey)
  } catch (error) {
    console.error("Error fetching From the Lab section from Contentful:", error)
    return null
  }
}

/**
 * Fetch "From the Lab" section content from Contentful by section key
 * @param sectionKey - The unique key for the section (e.g., "pdp-from-the-lab", "default-from-the-lab")
 * @returns FromTheLabSection or null if not found
 */
export async function getFromTheLabSectionByKey(
  sectionKey: string
): Promise<FromTheLabSection | null> {
  try {
    const client = getContentfulClient()

    // Query Contentful for entries with matching sectionKey
    // Include linked ProductCard entries (depth: 2 to get all nested references)
    const response = await client.getEntries({
      content_type: "fromTheLabSection",
      "fields.sectionKey": sectionKey,
      "fields.isActive": true, // Only fetch active sections
      include: 2, // Include linked ProductCard entries
      limit: 1,
    })

    if (!response.items || response.items.length === 0) {
      console.warn(`No From the Lab section found for key: ${sectionKey}`)
      return null
    }

    const entry = response.items[0] as unknown as Entry<ContentfulFromTheLabSection>
    return transformFromTheLabSectionEntry(entry)
  } catch (error) {
    console.error("Error fetching From the Lab section from Contentful:", error)
    return null
  }
}

/**
 * Fetch all active "From the Lab" sections from Contentful
 * @returns Array of FromTheLabSection
 */
export async function getAllFromTheLabSections(): Promise<FromTheLabSection[]> {
  try {
    const client = getContentfulClient()

    // Include linked ProductCard entries (depth: 2 to get all nested references)
    const response = await client.getEntries({
      content_type: "fromTheLabSection",
      "fields.isActive": true,
      include: 2, // Include linked ProductCard entries
      limit: 100,
    })

    if (!response.items || response.items.length === 0) {
      return []
    }

    return response.items
      .map((item) =>
        transformFromTheLabSectionEntry(item as unknown as Entry<ContentfulFromTheLabSection>)
      )
      .filter((item): item is FromTheLabSection => item !== null)
  } catch (error) {
    console.error("Error fetching all From the Lab sections from Contentful:", error)
    return []
  }
}

/**
 * Transform Contentful "From the Lab" section entry to simplified FromTheLabSection type
 */
function transformFromTheLabSectionEntry(
  entry: Entry<ContentfulFromTheLabSection>
): FromTheLabSection | null {
  try {
    const fields = entry.fields as any

    // Helper function to extract image URL from Contentful Asset or string
    const getImageUrl = (img: any): string | undefined => {
      if (!img) return undefined

      // If it's already a string URL, return it
      if (typeof img === "string") return img

      // If it's a Contentful Asset object (from References or nested)
      if (img.fields && img.fields.file && img.fields.file.url) {
        const url = img.fields.file.url
        return url.startsWith("//") ? `https:${url}` : url
      }

      // If it's a nested object with url property
      if (img.url) {
        return typeof img.url === "string" ? img.url : undefined
      }

      return undefined
    }

    // Helper function to transform ProductCard entry (from References field)
    const transformProductCard = (p: any, index: number): FromTheLabProduct => {
      // If it's a Contentful ProductCard entry (from References field)
      // Contentful returns linked entries in the includes or directly in fields
      if (p.fields) {
        // Direct ProductCard entry with fields
        return {
          id: p.sys?.id || `product-${index}`,
          name: p.fields.name || "",
          price: typeof p.fields.price === "number" ? p.fields.price : undefined,
          currency: typeof p.fields.currency === "string" ? p.fields.currency : undefined,
          image: getImageUrl(p.fields.image),
          hoverImage: getImageUrl(p.fields.hoverImage),
          description: typeof p.fields.description === "string" ? p.fields.description : undefined,
          badge: typeof p.fields.badge === "string" ? p.fields.badge : undefined,
          url: typeof p.fields.url === "string" ? p.fields.url : undefined,
          variantId: typeof p.fields.variantId === "string" ? p.fields.variantId : undefined,
        }
      }

      // If it's a link object (sys.type === 'Link'), we need to resolve it from includes
      // This shouldn't happen with include: 2, but handle it just in case
      if (p.sys && p.sys.type === "Link" && p.sys.linkType === "Entry") {
        console.warn("ProductCard entry not resolved, may need to check includes")
        return {
          id: p.sys.id || `product-${index}`,
          name: "",
          price: undefined,
          currency: undefined,
          image: undefined,
          hoverImage: undefined,
          description: undefined,
          badge: undefined,
          url: undefined,
        }
      }

      // Fallback: If it's a JSON object (backward compatibility for old entries)
      const product = typeof p === "string" ? JSON.parse(p) : p

      return {
        id: product?.id ?? index + 1,
        name: product?.name || "",
        price: typeof product?.price === "number" ? product.price : undefined,
        currency: typeof product?.currency === "string" ? product.currency : undefined,
        image: getImageUrl(product?.image),
        hoverImage: getImageUrl(product?.hoverImage),
        description: typeof product?.description === "string" ? product.description : undefined,
        badge: typeof product?.badge === "string" ? product.badge : undefined,
        url: typeof product?.url === "string" ? product.url : undefined,
        variantId: typeof product?.variantId === "string" ? product.variantId : undefined,
      }
    }

    // Parse products - Array of references to ProductCard entries
    let products: FromTheLabProduct[] = []

    if (Array.isArray(fields.products)) {
      products = fields.products.map(transformProductCard)
    } else if (fields.products && fields.products.fields) {
      // Handle single product entry (shouldn't happen but handle it)
      products = [transformProductCard(fields.products, 0)]
    }

    // Provide defaults for optional fields
    return {
      heading: extractTextFromRichText(fields.heading) || "From the Lab",
      subheading:
        extractTextFromRichText(fields.subheading) || "Formulations most often paired in practice.",
      backgroundColor: fields.backgroundColor || "#e3e3d8",
      products,
      isActive: fields.isActive ?? true,
    }
  } catch (error) {
    console.error("Error transforming From the Lab section entry:", error)
    return null
  }
}

/**
 * Helper function to extract URL from Contentful Asset
 */
function getAssetUrl(asset: any): string | undefined {
  if (!asset || !asset.fields || !asset.fields.file) {
    return undefined
  }
  const url = asset.fields.file.url
  return url.startsWith("//") ? `https:${url}` : url
}

/**
 * Fetch page banner from Contentful by page key (Generic function for any page)
 *
 * @param pageKey - Required: The page identifier (e.g., "candles", "home", "about", "hand-care")
 *
 * @returns PageBanner or null if not found
 *
 * @example
 * // Get banner for candles page
 * const banner = await getPageBanner("candles")
 *
 * @example
 * // Get banner for home page
 * const homeBanner = await getPageBanner("home")
 */
export async function getPageBanner(pageKey: string): Promise<PageBanner | null> {
  try {
    const client = getContentfulClient()

    const query: Record<string, unknown> = {
      content_type: "candlesPageBanner",
      "fields.pageKey": pageKey,
      "fields.isActive": true,
      limit: 1,
    }

    let response
    try {
      response = await client.getEntries(query)
    } catch (apiError: any) {
      // Handle Contentful API errors gracefully
      const errorMessage = apiError?.message || String(apiError)
      const errorSysId = apiError?.sys?.id
      const errorDetails = apiError?.details?.errors || []

      console.error(`[ERROR] Contentful API Error:`, {
        message: errorMessage,
        sysId: errorSysId,
        status: apiError?.status,
        statusText: apiError?.statusText,
        details: errorDetails,
        fullError: apiError,
      })

      // Most common error: Content Type doesn't exist
      if (
        errorMessage?.toLowerCase().includes("not found") ||
        errorSysId === "NotFound" ||
        errorMessage?.includes("Resource not found")
      ) {
        console.error(
          `\n[SOLUTION] ❌ Content Type "pageBanner" not found in Contentful!\n` +
            `Please create a content type with:\n` +
            `- Content Type ID (API Identifier): "pageBanner"\n` +
            `- Fields: title, description, mediaType, video, image, fallbackImage, isActive, pageKey\n\n`
        )
        return null // Return null instead of throwing
      }

      // Field not found error
      if (
        errorMessage?.includes("InvalidQuery") ||
        errorMessage?.includes("UnknownField") ||
        errorDetails.some((e: any) => e?.name === "pageKey")
      ) {
        console.error(
          `\n[SOLUTION] ❌ Field "pageKey" not found in "pageBanner" content type!\n` +
            `Please add a field with:\n` +
            `- Field ID: "pageKey"\n` +
            `- Field Type: Short text\n\n`
        )
        return null
      }

      // For other errors, log and return null
      console.error(`[ERROR] Unknown Contentful error. Please check your Contentful configuration.`)
      return null
    }

    console.log(`[DEBUG] Response items count: ${response.items?.length || 0}`)

    if (!response.items || response.items.length === 0) {
      // Try to fetch all pageBanner entries to see what's available
      try {
        const allEntries = await client.getEntries({
          content_type: "pageBanner",
          limit: 10,
        })
        console.warn(
          `[DEBUG] Available pageBanner entries:`,
          allEntries.items.map((item: any) => ({
            id: item.sys.id,
            pageKey: item.fields?.pageKey || item.fields?.page_key || "NOT FOUND",
            isActive: item.fields?.isActive ?? item.fields?.is_active ?? "NOT FOUND",
            title: item.fields?.title || "NO TITLE",
          }))
        )
      } catch (debugError) {
        console.error(`[DEBUG] Error fetching all entries:`, debugError)
      }

      console.warn(
        `No active page banner found for pageKey: "${pageKey}". ` +
          `Make sure you have an active banner entry with pageKey="${pageKey}" in Contentful. ` +
          `Content Type ID should be "pageBanner" and field should be "pageKey" (camelCase).`
      )
      return null
    }

    const entry = response.items[0] as unknown as Entry<ContentfulPageBanner>
    console.log(`[DEBUG] Found entry:`, {
      id: entry.sys.id,
      pageKey: (entry.fields as any)?.pageKey,
      title: (entry.fields as any)?.title,
    })

    return transformPageBannerEntry(entry)
  } catch (error: any) {
    console.error(`[ERROR] Error fetching page banner for pageKey "${pageKey}" from Contentful:`)
    console.error(`[ERROR] Error type:`, error?.constructor?.name)
    console.error(`[ERROR] Error message:`, error?.message)
    console.error(`[ERROR] Full error:`, error)

    // More helpful error messages
    if (error?.message?.includes("not found") || error?.sys?.id === "NotFound") {
      console.error(
        `\n[SOLUTION] Content Type "pageBanner" doesn't exist in Contentful.\n` +
          `Please create it with:\n` +
          `- Content Type ID: "pageBanner"\n` +
          `- Fields: title, description, mediaType, video, image, fallbackImage, isActive, pageKey`
      )
    }

    return null
  }
}

/**
 * Fetch candles page banner from Contentful (Legacy function - uses pageKey "candles")
 * @deprecated Use getPageBanner("candles") instead
 */
export async function getCandlesPageBanner(): Promise<PageBanner | null> {
  return getPageBanner("candles")
}

/**
 * Fetch all active page banners from Contentful
 * @returns Array of PageBanner
 */
export async function getAllPageBanners(): Promise<PageBanner[]> {
  try {
    const client = getContentfulClient()

    const response = await client.getEntries({
      content_type: "pageBanner",
      "fields.isActive": true,
      limit: 100,
    })

    if (!response.items || response.items.length === 0) {
      return []
    }

    return response.items
      .map((item) => transformPageBannerEntry(item as unknown as Entry<ContentfulPageBanner>))
      .filter((item): item is PageBanner => item !== null)
  } catch (error) {
    console.error("Error fetching all page banners from Contentful:", error)
    return []
  }
}

/**
 * Fetch all active candles page banners from Contentful (Legacy function)
 * @deprecated Use getAllPageBanners() and filter by pageKey instead
 */
export async function getAllCandlesPageBanners(): Promise<PageBanner[]> {
  const allBanners = await getAllPageBanners()
  return allBanners.filter((banner) => banner.pageKey === "candles")
}

/**
 * Transform Contentful page banner entry to simplified PageBanner type
 */
function transformPageBannerEntry(entry: Entry<ContentfulPageBanner>): PageBanner | null {
  try {
    const fields = entry.fields as any

    // Determine media type (default to "image" if not specified)
    const mediaType = fields.mediaType === "video" ? "video" : "image"

    // Process video asset if mediaType is video
    let videoUrl: string | undefined
    if (mediaType === "video" && fields.video) {
      videoUrl = getAssetUrl(fields.video)
    }

    // Process image asset (used for image type or as fallback)
    let imageUrl: string | undefined
    if (fields.image) {
      imageUrl = getAssetUrl(fields.image)
    }

    // Process fallback image asset
    let fallbackImageUrl: string | undefined
    if (fields.fallbackImage) {
      fallbackImageUrl = getAssetUrl(fields.fallbackImage)
    }

    console.log(`[DEBUG] Transforming entry fields:`, {
      title: fields.title,
      pageKey: fields.pageKey || fields.page_key,
      mediaType: fields.mediaType,
      hasVideo: !!fields.video,
      hasImage: !!fields.image,
      isActive: fields.isActive,
    })

    const result: PageBanner = {
      title: extractTextFromRichText(fields.title) || "",
      description: extractTextFromRichText(fields.description) || "",
      mediaType: mediaType as "video" | "image",
      videoUrl: videoUrl,
      imageUrl: imageUrl,
      fallbackImageUrl: fallbackImageUrl,
      isActive: fields.isActive ?? true,
      pageKey: fields.pageKey || fields.page_key || "", // Support both camelCase and snake_case
    }

    console.log(`[DEBUG] Transformed result:`, result)
    return result
  } catch (error) {
    console.error("Error transforming Contentful page banner entry:", error)
    console.error("Entry fields:", entry.fields as any)
    return null
  }
}

/**
 * Fetch candles collection from Contentful using section with ProductCard references
 * @param sectionKey - Optional section key to filter by (defaults to "candles" if not provided)
 * @returns Array of CandlesCollectionItem sorted by order
 */
export async function getCandlesCollection(
  sectionKey: string = "candles"
): Promise<CandlesCollectionItem[]> {
  try {
    const client = getContentfulClient()

    // First try to fetch from candlesCollectionSection (new approach with ProductCard references)
    const sectionQuery: Record<string, unknown> = {
      content_type: "candlesCollectionSection",
      "fields.isActive": true,
      include: 2, // Include linked ProductCard entries
      limit: 1,
    }

    if (sectionKey) {
      ;(sectionQuery as Record<string, unknown>)["fields.sectionKey"] = sectionKey
    }

    let sectionResponse
    try {
      sectionResponse = await client.getEntries(sectionQuery)
    } catch (apiError: any) {
      console.error("[getCandlesCollection] Contentful API error:", apiError?.message)
    }

    // If section found with ProductCard references, use that
    if (sectionResponse && sectionResponse.items && sectionResponse.items.length > 0) {
      const section = transformCandlesCollectionSectionEntry(
        sectionResponse.items[0] as unknown as Entry<ContentfulCandlesCollectionSection>
      )
      if (section && section.length > 0) {
        return section
      }
    }

    // Fallback to old candlesCollectionItem approach for backward compatibility
    const itemQuery: Record<string, unknown> = {
      content_type: "candlesCollectionItem",
      "fields.isActive": true,
      order: "fields.order",
      limit: 100,
    }

    let itemResponse
    try {
      itemResponse = await client.getEntries(itemQuery)
    } catch (apiError: any) {
      console.error("[getCandlesCollection] Contentful API error:", apiError?.message)
      return []
    }

    if (!itemResponse.items || itemResponse.items.length === 0) {
      return []
    }

    const items = itemResponse.items
      .map((entry) =>
        transformCandlesCollectionItemEntry(
          entry as unknown as Entry<ContentfulCandlesCollectionItem>
        )
      )
      .filter((item): item is CandlesCollectionItem => item !== null)
      .sort((a, b) => a.order - b.order)

    return items
  } catch (error) {
    console.error(
      "[getCandlesCollection] Error fetching candles collection from Contentful:",
      error
    )
    return []
  }
}

/**
 * Transform Contentful candles collection section entry to array of CandlesCollectionItem
 * Uses ProductCard references (new approach)
 */
function transformCandlesCollectionSectionEntry(
  entry: Entry<ContentfulCandlesCollectionSection>
): CandlesCollectionItem[] {
  try {
    const fields = entry.fields as any

    if (!fields.products || !Array.isArray(fields.products) || fields.products.length === 0) {
      return []
    }

    const getImageUrl = (asset: any): string | undefined => {
      if (!asset) return undefined
      return getAssetUrl(asset)
    }

    // Transform ProductCard entries to CandlesCollectionItem format
    const items: CandlesCollectionItem[] = fields.products
      .map((product: any, index: number) => {
        // Handle ProductCard entry (from References field)
        if (product.fields) {
          const imageUrl = getImageUrl(product.fields.image)
          const hoverImageUrl = getImageUrl(product.fields.hoverImage)

          if (!imageUrl) {
            console.warn(
              `[transformCandlesCollectionSectionEntry] ProductCard "${product.fields.name}" missing image`
            )
            return null
          }

          return {
            label: product.fields.label || product.fields.name || "",
            src: imageUrl,
            hoverSrc: hoverImageUrl,
            url: product.fields.url || undefined,
            order: fields.order ?? index,
            isActive: true,
          }
        }

        // Fallback handling
        return null
      })
      .filter((item: CandlesCollectionItem | null): item is CandlesCollectionItem => item !== null)

    // Sort by order
    return items.sort((a, b) => a.order - b.order)
  } catch (error) {
    console.error("Error transforming candles collection section entry:", error)
    return []
  }
}

/**
 * Transform Contentful candles collection item entry to simplified CandlesCollectionItem type
 * (Legacy function for backward compatibility)
 * Handles order field as both number and string (since Contentful might store it as Short text)
 */
function transformCandlesCollectionItemEntry(
  entry: Entry<ContentfulCandlesCollectionItem>
): CandlesCollectionItem | null {
  try {
    const fields = entry.fields as any

    if (!fields.image || !fields.image.fields || !fields.image.fields.file) {
      console.warn("[transformCandlesCollectionItemEntry] Missing image field")
      return null
    }

    const imageUrl = getAssetUrl(fields.image)
    if (!imageUrl) {
      console.warn("[transformCandlesCollectionItemEntry] Could not extract image URL")
      return null
    }

    const hoverImageUrl = fields.hoverImage ? getAssetUrl(fields.hoverImage) : undefined

    // Handle order field - can be number or string (since it's Short text in Contentful)
    let orderValue = 0
    if (fields.order !== undefined && fields.order !== null) {
      if (typeof fields.order === "number") {
        orderValue = fields.order
      } else if (typeof fields.order === "string") {
        const parsed = parseInt(fields.order, 10)
        orderValue = isNaN(parsed) ? 0 : parsed
      }
    }

    return {
      label: fields.label || "",
      src: imageUrl,
      hoverSrc: hoverImageUrl,
      url: fields.url || undefined,
      order: orderValue,
      isActive: fields.isActive ?? true,
    }
  } catch (error) {
    console.error("Error transforming candles collection item entry:", error)
    return null
  }
}

/**
 * Fetch all gift sets from Contentful
 * @returns Array of GiftSet
 */
export async function getAllGiftSets(): Promise<GiftSet[]> {
  try {
    const client = getContentfulClient()

    const response = await client.getEntries({
      content_type: "giftSets",
      include: 2, // Include linked Question entries
      limit: 100,
    })

    console.log("RESPONSE")
    console.log(response)

    if (!response.items || response.items.length === 0) {
      return []
    }

    return response.items
      .map((item) => transformGiftSetEntry(item as unknown as Entry<ContentfulGiftSet>))
      .filter((item): item is GiftSet => item !== null)
  } catch (error) {
    console.error("Error fetching all gift sets from Contentful:", error)
    return []
  }
}

/**
 * Fetch a gift set from Contentful by handle
 * @param handle - The handle/slug of the gift set
 * @returns GiftSet or null if not found
 */
export async function getGiftSetByHandle(handle: string): Promise<GiftSet | null> {
  try {
    const client = getContentfulClient()

    const response = await client.getEntries({
      content_type: "Gift Sets",
      "fields.handle": handle,
      include: 2, // Include linked Question entries
      limit: 1,
    })

    if (!response.items || response.items.length === 0) {
      console.warn(`No gift set found for handle: ${handle}`)
      return null
    }

    const entry = response.items[0] as unknown as Entry<ContentfulGiftSet>
    return transformGiftSetEntry(entry)
  } catch (error) {
    console.error("Error fetching gift set from Contentful:", error)
    return null
  }
}

/**
 * Transform Contentful gift set entry to simplified GiftSet type
 */
function transformGiftSetEntry(entry: Entry<ContentfulGiftSet>): GiftSet | null {
  try {
    const fields = entry.fields as any

    // Transform questions - Array of references to GiftSetQuestion entries
    const questions: GiftSetQuestion[] = []
    if (Array.isArray(fields.questions)) {
      fields.questions.forEach((q: any) => {
        // Handle GiftSetQuestion entry (from References field)
        if (q.fields) {
          // Transform options - Array of references with name/size fields
          const options: GiftSetQuestionOption[] = []
          if (Array.isArray(q.fields.options)) {
            q.fields.options.forEach((opt: any) => {
              if (opt.fields) {
                options.push({
                  name: opt.fields.name || "",
                  size: opt.fields.size || "",
                })
              }
            })
          }
          questions.push({
            question: q.fields.question || "",
            options,
          })
        }
      })
    }

    // Transform productSetsIncluded - Short text, list
    const productSetsIncluded: string[] = Array.isArray(fields.productSetsIncluded)
      ? fields.productSetsIncluded
      : []

    // Transform coverImage - Media
    const coverImage = getAssetUrl(fields.coverImage) || ""

    // Transform images - Media, many files
    const images: string[] = []
    if (Array.isArray(fields.images)) {
      fields.images.forEach((img: any) => {
        const url = getAssetUrl(img)
        if (url) images.push(url)
      })
    }

    // Transform hoverImage - Media
    const hoverImage = getAssetUrl(fields.hoverImage) || ""

    return {
      handle: fields.handle || "",
      title: fields.title || "",
      description: extractTextFromRichText(fields.description) || "",
      category: fields.category || "",
      productSetsIncluded,
      price: typeof fields.price === "number" ? fields.price : 0,
      questions,
      featured: fields.featured ?? false,
      coverImage,
      images,
      hoverImage,
    }
  } catch (error) {
    console.error("Error transforming gift set entry:", error)
    return null
  }
}

// ============================================================
// NAVIGATION FUNCTIONS
// ============================================================

import type { NavigationItem } from "../../types/contentful"

/**
 * Transform navigation items from Contentful to simplified format
 */
function transformNavigationItems(items: any[]): NavigationItem[] {
  const result: NavigationItem[] = []

  for (const item of items) {
    const contentType = item.sys?.contentType?.sys?.id

    if (contentType === "productCategory") {
      // Product Category → MenuItem with dropdown
      const subCategories = item.fields?.subCategory || []
      result.push({
        name: (item.fields?.name || "").toUpperCase(),
        href: item.fields?.url || subCategories[0]?.fields?.url || undefined,
        dropdown: subCategories.map((sub: any) => ({
          label: sub.fields?.title || "",
          href: sub.fields?.url || "",
          image: sub.fields?.image?.fields?.file?.url
            ? `https:${sub.fields.image.fields.file.url}`
            : undefined,
        })),
      })
    } else if (contentType === "pageLink") {
      // Page Link → Simple menu item (no dropdown)
      result.push({
        name: (item.fields?.title || "").toUpperCase(),
        href: item.fields?.url || "",
      })
    }
  }

  return result
}

/**
 * Fetch navigation from Contentful
 */
export async function getNavigation(): Promise<NavigationItem[]> {
  try {
    const client = getContentfulClient()
    const response = await client.getEntries({
      content_type: "navigation",
      include: 3, // Include nested subCategory refs
      limit: 1,
    })

    // console.log("Navigation response:", JSON.stringify(response, null, 2));

    if (!response.items.length) return []
    const nav = response.items[0].fields as any

    const result = transformNavigationItems(nav.items || [])
    // console.log("Transformed navigation:", JSON.stringify(result, null, 2));

    return result
  } catch (error) {
    console.error("Error fetching navigation:", error)
    return []
  }
}

// ============================================================
// BLOG FUNCTIONS
// ============================================================

import type { Document } from "@contentful/rich-text-types"
import type { Author, Blog } from "../../types/contentful"

/**
 * Transform a Contentful blog entry to simplified Blog type
 */
async function transformBlogEntry(entry: any, countryCode?: string): Promise<Blog | null> {
  try {
    const fields = entry.fields

    // Transform author
    let author: Author | undefined
    if (fields.author?.fields) {
      author = {
        name: fields.author.fields.name || "",
        profilePic: fields.author.fields.profilePic?.fields?.file?.url
          ? `https:${fields.author.fields.profilePic.fields.file.url}`
          : undefined,
        socialLinks: fields.author.fields.socialLinks || [],
      }
    }

    // Transform categories
    const categories: string[] = []
    if (Array.isArray(fields.category)) {
      fields.category.forEach((cat: any) => {
        if (cat.fields?.name) categories.push(cat.fields.name)
      })
    }

    // Transform featured products - fetch actual Medusa product data
    const featuredProducts: {
      id: string
      name: string
      handle: string
      image?: string
      description?: string
      variants?: any[]
    }[] = []
    if (Array.isArray(fields.featuredProducts)) {
      for (const prodRef of fields.featuredProducts) {
        if (prodRef.fields?.productHandle) {
          try {
            const medusaProduct = await getProductByHandle({
              handle: prodRef.fields.productHandle,
              countryCode,
            })

            if (medusaProduct) {
              featuredProducts.push({
                id: medusaProduct.id,
                name: medusaProduct.title,
                handle: prodRef.fields.productHandle,
                image: medusaProduct.thumbnail || undefined,
                description: medusaProduct.description || undefined,
                variants: medusaProduct.variants || [],
              })
            }
          } catch (error) {
            console.error(`Error fetching product ${prodRef.fields.productHandle}:`, error)
          }
        }
      }
    }

    return {
      title: fields.title || "",
      slug: fields.slug || "",
      description: fields.description || "",
      content: (fields.content as unknown as Document) || null,
      publishedDate: fields.publishedDate || "",
      image: fields.image?.fields?.file?.url ? `https:${fields.image.fields.file.url}` : undefined,
      imagealt: fields.imagealt || "",
      categories,
      author,
      featuredProducts,
      tags: fields.tags || [],
    }
  } catch (error) {
    console.error("Error transforming blog entry:", error)
    return null
  }
}

/**
 * Fetch all blogs from Contentful
 */
export async function getAllBlogs(limit: number = 4, countryCode?: string): Promise<Blog[]> {
  try {
    const client = getContentfulClient()
    const response = await client.getEntries({
      content_type: "blog",
      select: [
        "fields.title",
        "fields.slug",
        "fields.description",
        "fields.publishedDate",
        "fields.image",
        "fields.imagealt",
      ],
      order: ["-fields.publishedDate"],
      limit,
    })

    const blogs = await Promise.all(
      response.items.map((item) => transformBlogEntry(item, countryCode))
    )
    return blogs.filter((b): b is Blog => b !== null)
  } catch (error) {
    console.error("Error fetching all blogs:", error)
    return []
  }
}

/**
 * Fetch a single blog by slug from Contentful
 */
export async function getBlogBySlug(slug: string, countryCode?: string): Promise<Blog | null> {
  try {
    const client = getContentfulClient()
    const response = await client.getEntries({
      content_type: "blog",
      "fields.slug": slug,
      include: 2,
      limit: 1,
    })

    if (!response.items.length) return null
    return await transformBlogEntry(response.items[0], countryCode)
  } catch (error) {
    console.error("Error fetching blog by slug:", error)
    return null
  }
}

// ============================================================
// PRODUCT CATEGORY FUNCTIONS
// ============================================================

import type { ContentfulProductCategory, ProductCategory } from "../../types/contentful"

/**
 * Transform a Contentful ProductCategory entry to simplified ProductCategory type
 * Filters subCategory to only include nested ProductCategory references (not PageLink)
 * Recursively transforms nested ProductCategories
 */
function transformProductCategoryEntry(
  entry: Entry<ContentfulProductCategory>
): ProductCategory | null {
  try {
    const fields = entry.fields as any

    // Transform subCategory - filter only ProductCategory references
    const subCategories: ProductCategory[] = []
    if (Array.isArray(fields.subCategory)) {
      fields.subCategory.forEach((item: any) => {
        // Check if this is a ProductCategory reference (not PageLink)
        const contentTypeId = item.sys?.contentType?.sys?.id
        if (contentTypeId === "productCategory" && item.fields) {
          // Recursively transform nested ProductCategory
          const nestedCategory = transformProductCategoryEntry(
            item as Entry<ContentfulProductCategory>
          )
          if (nestedCategory) {
            subCategories.push(nestedCategory)
          }
        }
      })
    }

    return {
      name: fields.name || "",
      handle: fields.handle || "",
      url: fields.url || undefined,
      productHandles: Array.isArray(fields.productHandles) ? fields.productHandles : [],
      subCategories,
    }
  } catch (error) {
    console.error("Error transforming ProductCategory entry:", error)
    return null
  }
}

/**
 * Fetch a product category from Contentful by handle
 * @param handle - The unique handle identifier for the category (e.g., "home-creations")
 * @returns ProductCategory or null if not found
 */
export async function getProductCategoryByHandle(handle: string): Promise<ProductCategory | null> {
  try {
    const client = getContentfulClient()

    // Query Contentful for entries with matching handle
    // include: 2 to resolve nested ProductCategory references in subCategory
    const response = await client.getEntries({
      content_type: "productCategory",
      "fields.handle": handle,
      include: 2,
    })

    if (!response.items || response.items.length === 0) {
      console.warn(`No product category found for handle: ${handle}`)
      return null
    }

    const entry = response.items[0] as unknown as Entry<ContentfulProductCategory>
    return transformProductCategoryEntry(entry)
  } catch (error) {
    console.error(`Error fetching product category by handle "${handle}" from Contentful:`, error)
    return null
  }
}
