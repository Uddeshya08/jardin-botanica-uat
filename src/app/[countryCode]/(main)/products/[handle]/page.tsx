import { Metadata } from "next"
import { notFound } from "next/navigation"
import { listProducts, retrieveProduct } from "@lib/data/products"
import { getRegion, listRegions } from "@lib/data/regions"
import { 
  getProductContentByHandle, 
  getFeaturedSectionByKey,
  getTestimonialsSectionByKey,
  getTestimonialsSectionByProductHandle,
  getFeaturedRitualTwoSectionByKey,
  getFeaturedRitualTwoSectionByProductHandle
} from "@lib/data/contentful"
import ProductTemplate from "@modules/products/templates"

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
}

export const dynamicParams = true

export async function generateStaticParams() {
  try {
    const countryCodes = await listRegions().then((regions) =>
      regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat()
    )

    if (!countryCodes) {
      return []
    }

    const promises = countryCodes.map(async (country) => {
      const { response } = await listProducts({
        countryCode: country,
        queryParams: { limit: 100, fields: "handle" },
      })

      return {
        country,
        products: response.products,
      }
    })

    const countryProducts = await Promise.all(promises)

    return countryProducts
      .flatMap((countryData) =>
        countryData.products.map((product) => ({
          countryCode: countryData.country,
          handle: product.handle,
        }))
      )
      .filter((param) => param.handle)
  } catch (error) {
    console.error(
      `Failed to generate static paths for product pages: ${
        error instanceof Error ? error.message : "Unknown error"
      }.`
    )
    return []
  }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const { handle } = params
  const region = await getRegion(params.countryCode)

  if (!region) {
    notFound()
  }

  const product = await listProducts({
    countryCode: params.countryCode,
    queryParams: { handle: handle } as any,
  }).then(({ response }) => response.products[0])

  if (!product) {
    notFound()
  }

  return {
    title: `${product.title} | Medusa Store`,
    description: `${product.title}`,
    openGraph: {
      title: `${product.title} | Medusa Store`,
      description: `${product.title}`,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  }
}

export default async function ProductPage(props: Props) {
  const params = await props.params
  const region = await getRegion(params.countryCode)

  if (!region) {
    notFound()
  }

  console.log("region", region);

  const pricedProduct = await listProducts({
    countryCode: params.countryCode,
    queryParams: { handle: params.handle } as any,
  }).then(({ response }) => response.products[0])

  if (!pricedProduct) {
    notFound()
  }

  // Fetch product content from Contentful
  const productContent = await getProductContentByHandle(params.handle)
  
  // Fetch featured section content from Contentful
  // You can use different keys for different pages: "pdp-featured", "homepage-featured", etc.
  const featuredContent = await getFeaturedSectionByKey("pdp-featured")
  
  // Fetch testimonials section content from Contentful
  // Try product-specific testimonials by productHandle first
  let testimonialsContent = await getTestimonialsSectionByProductHandle(params.handle)
  
  // Fall back to section key approach if product handle search doesn't find anything
  if (!testimonialsContent) {
    const productTestimonialsKey = `${params.handle}-testimonials`
    testimonialsContent = await getTestimonialsSectionByKey(productTestimonialsKey)
  }
  
  // Final fallback to generic PDP testimonials if product-specific not found
  if (!testimonialsContent) {
    testimonialsContent = await getTestimonialsSectionByKey("pdp-testimonials")
  }
  
  // Debug logging for testimonials
  // console.log("Testimonials content found:", !!testimonialsContent)
  // if (testimonialsContent) {
  //   console.log("Testimonials data:", {
  //     title: testimonialsContent.title,
  //     productHandle: testimonialsContent.productHandle,
  //     sectionKey: testimonialsContent.sectionKey,
  //     itemsCount: testimonialsContent.items.length
  //   })
  // }

  // Fetch featured ritual two section content from Contentful
  // Try product-specific featured ritual two by productHandle first
  let featuredRitualTwoContent = await getFeaturedRitualTwoSectionByProductHandle(params.handle)
  
  // Fall back to section key approach if product handle search doesn't find anything
  if (!featuredRitualTwoContent) {
    const productFeaturedRitualTwoKey = `${params.handle}-featured-ritual-two`
    featuredRitualTwoContent = await getFeaturedRitualTwoSectionByKey(productFeaturedRitualTwoKey)
  }
  
  // Final fallback to generic PDP featured ritual two if product-specific not found
  if (!featuredRitualTwoContent) {
    featuredRitualTwoContent = await getFeaturedRitualTwoSectionByKey("pdp-featured-ritual-two")
  }
  
  // Debug logging
  // console.log("Product handle:", params.handle)
  // console.log("Featured ritual two content found:", !!featuredRitualTwoContent)
  // if (featuredRitualTwoContent) {
  //   console.log("Featured ritual two data:", {
  //     title: featuredRitualTwoContent.title,
  //     productHandle: featuredRitualTwoContent.productHandle,
  //     heading: featuredRitualTwoContent.heading,
  //     imageUrl: featuredRitualTwoContent.imageUrl
  //   })
  // }

  // Fetch ritual product if available in product metadata
  let ritualProduct = null
  const ritualProductId = (pricedProduct?.metadata?.ritualProduct as string | undefined)?.trim()
  
  // Validate ritual product ID format
  const isValidProductId = ritualProductId && ritualProductId.startsWith('prod_') && ritualProductId.length > 10
  
  console.log("================================")
  console.log("RITUAL PRODUCT DEBUG")
  console.log("================================")
  console.log("Main product metadata:", pricedProduct?.metadata)
  console.log("Ritual product ID from metadata:", ritualProductId)
  console.log("Ritual product ID length:", ritualProductId?.length)
  console.log("Is valid product ID:", isValidProductId)
  console.log("Region ID:", region?.id)
  
  if (ritualProductId && isValidProductId) {
    try {
      // Fetch ritual product with proper region and calculated prices
      console.log("🔄 Fetching ritual product with region:", region?.id)
      
      // Use retrieveProduct to get the ritual product with calculated prices for the region
      const ritualProd = await retrieveProduct(ritualProductId, region.id)
      
      if (ritualProd) {
        console.log("✅ Found ritual product:", ritualProd.title)
        console.log("Ritual product has variants:", ritualProd.variants?.length || 0)
        
        const variant = ritualProd.variants?.[0]
        
        console.log("Ritual product:", ritualProd.title)
        console.log("Ritual product variant:", variant)
        console.log("Variant calculated_price:", variant?.calculated_price)
        console.log("Variant ID:", variant?.id)
        
        if (variant) {
          const calculatedAmount = variant.calculated_price?.calculated_amount
          const hasValidPrice = typeof calculatedAmount === 'number' && calculatedAmount > 0
          
          ritualProduct = {
            variantId: variant.id,
            name: ritualProd.title || "Ritual Product",
            price: hasValidPrice ? calculatedAmount : 0,
            currency: variant.calculated_price?.currency_code || "inr",
            image: ritualProd.thumbnail || ritualProd.images?.[0]?.url,
          }
          
          if (hasValidPrice) {
            console.log("✅ Ritual product prepared with valid price:", ritualProduct)
          } else {
            console.warn("⚠️ Ritual product has no valid price for region:", region?.id)
            console.warn("Variant ID:", variant.id)
            console.warn("Skipping ritual product to prevent cart errors")
            // Set to null if no valid price to prevent cart errors
            ritualProduct = null
          }
        } else {
          console.warn("⚠️ Ritual product has no variants")
          ritualProduct = null
        }
      } else {
        console.log("❌ No ritual product found with ID:", ritualProductId)
        ritualProduct = null
      }
    } catch (error) {
      console.error("Failed to fetch ritual product:", error)
      // Don't throw error, just set ritualProduct to null
      ritualProduct = null
      console.log("⚠️ Continuing without ritual product due to fetch error")
    }
  } else {
    if (ritualProductId && !isValidProductId) {
      console.warn("⚠️ Invalid ritual product ID format:", ritualProductId)
      console.warn("Expected format: prod_xxxxxxxxxxxxxxxxxxxx")
    } else {
      console.log("No ritual product configured for this product")
    }
  }

  return (
    <ProductTemplate
      product={pricedProduct}
      region={region}
      countryCode={params.countryCode}
      productContent={productContent}
      featuredContent={featuredContent}
      testimonialsContent={testimonialsContent}
      featuredRitualTwoContent={featuredRitualTwoContent}
      ritualProduct={ritualProduct}
    />
  )
}
