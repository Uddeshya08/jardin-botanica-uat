"use server"

import { getContentfulClient } from "@lib/contentful"
import {
  ContentfulProductContent,
  ProductContent,
  ProductImage,
  ContentfulAsset,
  ContentfulFeaturedSection,
  FeaturedSection,
  ContentfulTestimonials,
  TestimonialsSection,
  TestimonialItem,
  ContentfulFeaturedRitualTwo,
  FeaturedRitualTwoSection,
  ContentfulAfterlifeSection,
  AfterlifeSection,
  AfterlifeItem,
  ContentfulProductInfoPanels,
  ProductInfoPanels,
  ActiveItem,
  FragranceNote,
  DynamicPanel,
  ContentfulFromTheLabSection,
  FromTheLabSection,
  FromTheLabProduct,
  ContentfulProductCard,
} from "../../types/contentful"
import { Entry } from "contentful"

/**
 * Helper function to extract plain text from Contentful rich text fields
 * Handles both plain strings and rich text document objects
 */
function extractTextFromRichText(value: any): string {
  if (!value) return ""
  
  // If it's already a string, return it
  if (typeof value === "string") return value
  
  // If it's a rich text document object
  if (value && typeof value === "object" && value.nodeType === "document" && Array.isArray(value.content)) {
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
function transformContentfulEntry(
  entry: Entry<ContentfulProductContent>
): ProductContent | null {
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

    return {
      title: fields.title || "",
      slug: fields.slug || "",
      description: fields.description || "",
      images,
      productHandle: fields.productHandle || fields.product_handle || "",
      features: fields.features || {},
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
export async function getFeaturedSectionByKey(
  sectionKey: string
): Promise<FeaturedSection | null> {
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
      .map((item) => transformFeaturedSectionEntry(item as unknown as Entry<ContentfulFeaturedSection>))
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
      subheading: extractTextFromRichText(fields.subheading) || "Subscribe to receive hand care wisdom, botanical insights, and early access to our latest concoctions.",
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
      .map((item) => transformTestimonialsSectionEntry(item as unknown as Entry<ContentfulTestimonials>))
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
          const testimonial = typeof t === 'string' ? JSON.parse(t) : t
          
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
      subheading: extractTextFromRichText(fields.subheading) || "Real experiences from those who've made our product part of their daily ritual.",
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
      .map((item) => transformFeaturedRitualTwoSectionEntry(item as unknown as Entry<ContentfulFeaturedRitualTwo>))
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
      subheading: extractTextFromRichText(fields.subheading) || "A refreshing blend of tea antioxidants and gentle exfoliants, this handwash keeps your hands healthy, glowing, and nourished.",
      backgroundColor: fields.backgroundColor || "#e3e3d8",
      imageUrl: imageUrl,
      imageAlt: fields.imageAlt || "Jardin Botanica Tea Exfoliant Rinse with hands and botanical elements",
      cta: {
        label: fields.ctaLabel || "Read more",
        href: fields.ctaLink || "#",
      },
      imagePosition: fields.imagePosition === 'left' || fields.imagePosition === 'right' ? fields.imagePosition : 'left',
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
      let icon: string | { src: string; alt: string } | undefined = undefined
      
      if (it?.icon) {
        if (typeof it.icon === "string" && (it.icon === "recycle" || it.icon === "refresh" || it.icon === "leaf")) {
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
      const active = typeof item === 'string' ? JSON.parse(item) : item
      return {
        name: active?.name || "",
        description: active?.description || "",
      }
    })

    // Transform fragrance notes array
    const fragranceNotesSrc = Array.isArray(fields.fragranceNotes) ? fields.fragranceNotes : []
    const fragranceNotes: FragranceNote[] = fragranceNotesSrc.map((item: any): FragranceNote => {
      // Handle both JSON objects and stringified JSON
      const note = typeof item === 'string' ? JSON.parse(item) : item
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
          const panel = typeof item === 'string' ? JSON.parse(item) : item
          
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
      .map((item) => transformFromTheLabSectionEntry(item as unknown as Entry<ContentfulFromTheLabSection>))
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
      if (typeof img === 'string') return img
      
      // If it's a Contentful Asset object (from References or nested)
      if (img.fields && img.fields.file && img.fields.file.url) {
        const url = img.fields.file.url
        return url.startsWith('//') ? `https:${url}` : url
      }
      
      // If it's a nested object with url property
      if (img.url) {
        return typeof img.url === 'string' ? img.url : undefined
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
          price: typeof p.fields.price === 'number' ? p.fields.price : undefined,
          currency: typeof p.fields.currency === 'string' ? p.fields.currency : undefined,
          image: getImageUrl(p.fields.image),
          hoverImage: getImageUrl(p.fields.hoverImage),
          description: typeof p.fields.description === 'string' ? p.fields.description : undefined,
          badge: typeof p.fields.badge === 'string' ? p.fields.badge : undefined,
          url: typeof p.fields.url === 'string' ? p.fields.url : undefined,
          variantId: typeof p.fields.variantId === 'string' ? p.fields.variantId : undefined,
        }
      }
      
      // If it's a link object (sys.type === 'Link'), we need to resolve it from includes
      // This shouldn't happen with include: 2, but handle it just in case
      if (p.sys && p.sys.type === 'Link' && p.sys.linkType === 'Entry') {
        console.warn('ProductCard entry not resolved, may need to check includes')
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
      const product = typeof p === 'string' ? JSON.parse(p) : p
      
      return {
        id: product?.id ?? index + 1,
        name: product?.name || "",
        price: typeof product?.price === 'number' ? product.price : undefined,
        currency: typeof product?.currency === 'string' ? product.currency : undefined,
        image: getImageUrl(product?.image),
        hoverImage: getImageUrl(product?.hoverImage),
        description: typeof product?.description === 'string' ? product.description : undefined,
        badge: typeof product?.badge === 'string' ? product.badge : undefined,
        url: typeof product?.url === 'string' ? product.url : undefined,
        variantId: typeof product?.variantId === 'string' ? product.variantId : undefined,
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
      subheading: extractTextFromRichText(fields.subheading) || "Formulations most often paired in practice.",
      backgroundColor: fields.backgroundColor || "#e3e3d8",
      products,
      isActive: fields.isActive ?? true,
    }
  } catch (error) {
    console.error("Error transforming From the Lab section entry:", error)
    return null
  }
}
