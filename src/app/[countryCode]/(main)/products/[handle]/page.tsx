import { Metadata } from "next"
import { notFound } from "next/navigation"
import { listProducts } from "@lib/data/products"
import { getRegion, listRegions } from "@lib/data/regions"
import {
  getProductContentByHandle,
  getFeaturedSectionByKey,
  getTestimonialsSectionByKey,
  getTestimonialsSectionByProductHandle,
  getFeaturedRitualTwoSectionByKey,
  getFeaturedRitualTwoSectionByProductHandle,
  getAfterlifeSectionByProductHandle,
  getAfterlifeSectionByKey,
  getProductInfoPanelsByHandle,
  getFromTheLabSectionByProductHandle,
  getFromTheLabSectionByKey
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
      `Failed to generate static paths for product pages: ${error instanceof Error ? error.message : "Unknown error"
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


  const pricedProduct = await listProducts({
    countryCode: params.countryCode,
    queryParams: { handle: params.handle } as any,
  }).then(({ response }) => response.products[0])


  if (!pricedProduct) {
    notFound()
  }

  if (pricedProduct.variants?.length)
    pricedProduct.variants[0].inventory_quantity = 100

  console.log("PRICED PRODUCT:")
  console.log(pricedProduct)

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


  // Fetch ritual product if available in product metadata
  let ritualProduct = null
  const ritualProductHandle = (pricedProduct?.metadata?.ritual_product as string | undefined)?.trim()

  // Validate ritual product handle format (now expects handles like "soft-orris" instead of product IDs)
  const isValidProductHandle = ritualProductHandle && ritualProductHandle.length > 0 && !ritualProductHandle.startsWith('prod_')

  console.log(ritualProductHandle, isValidProductHandle)
  if (ritualProductHandle && isValidProductHandle) {
    try {
      // Fetch ritual product with proper region and calculated prices using handle

      // Use listProducts to get the ritual product by handle with calculated prices for the region
      const ritualProductResponse = await listProducts({
        countryCode: params.countryCode,
        queryParams: { handle: ritualProductHandle } as any,
      })

      console.log("RITUAL PRODUCT:")
      console.log(ritualProductResponse)

      let ritualProd = ritualProductResponse.response.products?.[0]

      // If no product found by exact handle, try alternative search methods
      if (!ritualProd) {

        // Method 1: Search by title containing the handle
        try {
          const allProductsResponse = await listProducts({
            countryCode: params.countryCode,
            queryParams: {} as any, // Get all products
          })

          const allProducts = allProductsResponse.response.products || []

          // Look for products with matching handle in title or metadata
          const possibleMatches = allProducts.filter(prod => {
            const titleMatch = prod.title?.toLowerCase().includes(ritualProductHandle.toLowerCase())
            const handleMatch = prod.handle?.toLowerCase().includes(ritualProductHandle.toLowerCase())
            const metadataMatch = (prod.metadata?.["product-name"] as string)?.toLowerCase() === ritualProductHandle.toLowerCase()

            return titleMatch || handleMatch || metadataMatch
          })

          // Use the first match if found
          if (possibleMatches.length > 0) {
            ritualProd = possibleMatches[0]
          }
        } catch (searchError) {
          console.error("Error in alternative search:", searchError)
        }
      }

      if (ritualProd) {
        // Check if the ritual product has matching product-name metadata
        const ritualProductName = (ritualProd.metadata?.["product-name"] as string | undefined)?.trim()
        const isMatchingRitualProduct = ritualProductName === ritualProductHandle

        // More flexible matching - check multiple criteria
        const flexibleMatch =
          isMatchingRitualProduct || // Exact metadata match
          ritualProd.handle === ritualProductHandle || // Exact handle match
          ritualProd.title?.toLowerCase().includes(ritualProductHandle.toLowerCase()) || // Title contains handle
          ritualProductName?.toLowerCase().includes(ritualProductHandle.toLowerCase()) // Metadata contains handle

        if (!flexibleMatch) {
          ritualProduct = null
        } else {
          const variant = ritualProd.variants?.[0]

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

            if (!hasValidPrice) {
              // Set to null if no valid price to prevent cart errors
              ritualProduct = null
            }
          } else {
            ritualProduct = null
          }
        }
      } else {
        ritualProduct = null
      }
    } catch (error) {
      // Don't throw error, just set ritualProduct to null
      ritualProduct = null
    }
  }


  let afterlifeContent = await getAfterlifeSectionByProductHandle(params.handle)

  if (!afterlifeContent) {
    afterlifeContent = await getAfterlifeSectionByKey("afterlife-default")
  }

  // Fetch product info panels from Contentful
  const productInfoPanels = await getProductInfoPanelsByHandle(params.handle)

  // Fetch "From the Lab" section content from Contentful
  // Try product-specific "From the Lab" by productHandle first
  let fromTheLabContent = await getFromTheLabSectionByProductHandle(params.handle)

  // Fall back to section key approach if product handle search doesn't find anything
  if (!fromTheLabContent) {
    const productFromTheLabKey = `${params.handle}-from-the-lab`
    fromTheLabContent = await getFromTheLabSectionByKey(productFromTheLabKey)
  }

  // Final fallback to generic PDP "From the Lab" if product-specific not found
  if (!fromTheLabContent) {
    fromTheLabContent = await getFromTheLabSectionByKey("pdp-from-the-lab")
  }

  return (
    <ProductTemplate
      product={pricedProduct}
      region={region}
      countryCode={params.countryCode}
      productContent={productContent}
      featuredContent={featuredContent}
      afterlifeContent={afterlifeContent}
      testimonialsContent={testimonialsContent}
      featuredRitualTwoContent={featuredRitualTwoContent}
      ritualProduct={ritualProduct}
      productInfoPanels={productInfoPanels}
      fromTheLabContent={fromTheLabContent}
    />
  )
}