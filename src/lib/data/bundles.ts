"use server"

import { sdk } from "@lib/config"
import type { AddBundleToCartPayload, AddBundleToCartResponse, Bundle } from "../../types/bundle"
import { getAuthHeaders, getCartId } from "./cookies"
import { getRegion } from "./regions"

interface VariantDetail {
  id: string
  title: string
  productName: string
  options: { name: string; value: string }[]
}

export async function getAllBundles(): Promise<Bundle[]> {
  const headers = await getAuthHeaders()

  try {
    const response = await sdk.client.fetch<{ bundles: Bundle[] }>("/store/bundles", {
      method: "GET",
      headers,
    })

    return response.bundles || []
  } catch (error) {
    console.error("Error fetching bundles:", error)
    return []
  }
}

export async function getVariantsByIds(variantIds: string[]): Promise<Map<string, VariantDetail>> {
  const headers = await getAuthHeaders()
  const variantMap = new Map<string, VariantDetail>()

  if (variantIds.length === 0) return variantMap

  try {
    // First, try to find by variant ID directly
    const allProducts = await sdk.client.fetch<{ products: any[] }>("/store/products", {
      method: "GET",
      query: {
        limit: 100,
        fields: "*variants,*variants.options",
      },
      headers,
    })

    // Find variants that match our IDs and extract details
    for (const product of allProducts.products || []) {
      for (const variant of product.variants || []) {
        if (variantIds.includes(variant.id)) {
          variantMap.set(variant.id, {
            id: variant.id,
            title: variant.title || "Default",
            productName: product.title || "",
            options: (variant.options || []).map((opt: any) => ({
              name: opt.option?.name || "",
              value: opt.value || "",
            })),
          })
        }
      }
    }

    // For missing variant IDs, try to find by product ID
    const missingVariantIds = variantIds.filter((id) => !variantMap.has(id))

    if (missingVariantIds.length > 0) {
      // Fetch products and try to match by product ID
      for (const product of allProducts.products || []) {
        // Check if this product's ID matches any missing variant IDs
        if (missingVariantIds.includes(product.id)) {
          // Use the first variant of this product
          const firstVariant = product.variants?.[0]
          if (firstVariant) {
            variantMap.set(product.id, {
              id: firstVariant.id,
              title: firstVariant.title || "Default",
              productName: product.title || "",
              options: (firstVariant.options || []).map((opt: any) => ({
                name: opt.option?.name || "",
                value: opt.value || "",
              })),
            })
          }
        }
      }
    }
  } catch (error) {
    console.error("Error fetching variants:", error)
  }

  return variantMap
}

export interface BundleWithVariants extends Bundle {
  variantDetails: Map<string, VariantDetail>
  productImages: string[]
}

export async function getAllBundlesWithVariants(): Promise<BundleWithVariants[]> {
  const headers = await getAuthHeaders()

  try {
    const response = await sdk.client.fetch<{ bundles: Bundle[] }>("/store/bundles", {
      method: "GET",
      headers,
    })

    const bundles = response.bundles || []

    if (bundles.length === 0) return []

    // Collect all variant IDs and product IDs from bundles
    const variantIds = new Set<string>()
    const productIds = new Set<string>()

    for (const bundle of bundles) {
      // Collect product ID if available
      if (bundle.medusa_product_id) {
        productIds.add(bundle.medusa_product_id)
      }
      // Items
      for (const item of bundle.items || []) {
        variantIds.add(item.medusa_variant_id)
      }
      // Choice slots options
      for (const slot of bundle.choice_slots || []) {
        for (const opt of slot.options || []) {
          variantIds.add(opt.medusa_variant_id)
        }
      }
    }

    // Fetch variant details
    const variantMap = await getVariantsByIds(Array.from(variantIds))

    // Fetch product details for images if we have product IDs
    const productImagesMap = new Map<string, string[]>()
    if (productIds.size > 0) {
      try {
        // Fetch products with images
        const productsResponse = await sdk.client.fetch<{ products: any[] }>("/store/products", {
          method: "GET",
          query: {
            id: Array.from(productIds),
            limit: productIds.size,
            fields: "*images",
          },
          headers,
        })

        for (const product of productsResponse.products || []) {
          const images = (product.images || []).map((img: any) => img.url)
          productImagesMap.set(product.id, images)
        }
      } catch (error) {
        console.error("Error fetching product images:", error)
      }
    }

    // Attach variant details and product images to bundles
    return bundles.map((bundle) => {
      // Get images from product or fallback to bundle_image
      let images: string[] = []
      if (bundle.medusa_product_id && productImagesMap.has(bundle.medusa_product_id)) {
        images = productImagesMap.get(bundle.medusa_product_id) || []
      }
      // If no product images, use bundle_image as fallback
      if (images.length === 0 && bundle.bundle_image) {
        images = [bundle.bundle_image]
      }

      return {
        ...bundle,
        variantDetails: variantMap,
        productImages: images,
      }
    })
  } catch (error) {
    console.error("Error fetching bundles with variants:", error)
    return []
  }
}

export async function getBundleById(id: string): Promise<Bundle | null> {
  const headers = await getAuthHeaders()

  try {
    const response = await sdk.client.fetch<{ bundle: Bundle }>(`/store/bundles/${id}`, {
      method: "GET",
      headers,
    })

    return response.bundle || null
  } catch (error) {
    console.error("Error fetching bundle:", error)
    return null
  }
}

export async function addBundleToCart(
  bundleId: string,
  data: Omit<AddBundleToCartPayload, "cart_id">
): Promise<AddBundleToCartResponse> {
  const headers = await getAuthHeaders()

  // Get or create cart
  let cartId = await getCartId()

  if (!cartId) {
    // Need to get region first to create cart
    // Default to IN for gift sets
    const region = await getRegion("in")
    if (!region) {
      throw new Error("Region not found")
    }

    // Create a new cart
    const cartResponse = await sdk.store.cart.create({ region_id: region.id }, {}, headers)
    cartId = cartResponse.cart.id
  }

  const response = await sdk.client.fetch<AddBundleToCartResponse>(
    `/store/bundles/${bundleId}/add-to-cart`,
    {
      method: "POST",
      headers,
      body: {
        cart_id: cartId,
        ...data,
      },
    }
  )

  return response
}

export async function validateBundleSelections(
  bundleId: string,
  selections: Record<string, string[]>
): Promise<{ valid: boolean; errors: string[] }> {
  const headers = await getAuthHeaders()

  const response = await sdk.client.fetch<{ valid: boolean; errors: string[] }>(
    `/store/bundles?action=validate`,
    {
      method: "POST",
      headers,
      body: {
        bundle_id: bundleId,
        selections,
      },
    }
  )

  return response
}
