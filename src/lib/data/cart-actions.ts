"use server"

import { addToCart } from "@lib/data/cart"
import { getRegion } from "@lib/data/regions"
import { getAuthHeaders } from "./cookies"
import { sdk } from "@lib/config"

type AddPayload = {
  variantId: string
  quantity: number
  countryCode: string
}

/**
 * UI-only cart management functions:
 * - No API calls until checkout
 * - All cart operations handled in UI state
 * - Inventory validation deferred to checkout time
 */
export async function addToCartAction({
  variantId,
  quantity,
  countryCode,
}: AddPayload) {
  if (!variantId) throw new Error("Missing variantId")
  const qty = Math.max(1, Number(quantity || 1))
  const cc = (countryCode || "in").toLowerCase()

  // UI-only cart management - no API calls until checkout

  // Return success immediately - actual cart operations happen at checkout
  return { ok: true, quantity: qty, message: "Item added to cart (UI only)" }
}

/**
 * Check if a variant is available for the given region
 */
export async function checkVariantAvailability({
  variantId,
  countryCode,
}: {
  variantId: string
  countryCode: string
}) {
  try {
    const cc = (countryCode || "in").toLowerCase()
    const region = await getRegion(cc)
    
    if (!region) {
      throw new Error(`Region not found for country code: ${cc}`)
    }


    // Try to fetch the variant with region-specific pricing
    const variant = await sdk.client.fetch(`/store/variants/${variantId}`, {
      method: "GET",
      query: {
        region_id: region.id,
        fields: "*calculated_price,+inventory_quantity"
      },
      headers: await getAuthHeaders(),
    })

    const variantData = variant as any
    

    return {
      available: !!variant,
      hasPrice: !!variantData?.calculated_price,
      inventoryQuantity: variantData?.inventory_quantity || 0,
      variant
    }
  } catch (error: any) {
    console.error("❌ Variant availability check failed:", error)
    return {
      available: false,
      hasPrice: false,
      inventoryQuantity: 0,
      error: error.message
    }
  }
}

/**
 * Debug function to check what variants are available for a product
 */
export async function debugProductVariants({
  productId,
  countryCode,
}: {
  productId: string
  countryCode: string
}) {
  try {
    const cc = (countryCode || "in").toLowerCase()
    const region = await getRegion(cc)
    
    if (!region) {
      throw new Error(`Region not found for country code: ${cc}`)
    }


    // Fetch the product with all its variants
    const product = await sdk.client.fetch(`/store/products/${productId}`, {
      method: "GET",
      query: {
        region_id: region.id,
        fields: "*variants,*variants.calculated_price,+variants.inventory_quantity"
      },
      headers: await getAuthHeaders(),
    })

    const productData = product as any
    const variants = productData?.variants || []


    return {
      product: productData,
      variants: variants,
      availableVariants: variants.filter((v: any) => !!v.calculated_price && v.inventory_quantity > 0)
    }
  } catch (error: any) {
    console.error("❌ Product variants debug failed:", error)
    return {
      product: null,
      variants: [],
      availableVariants: [],
      error: error.message
    }
  }
}

/**
 * Check if a variant exists globally (without region restriction)
 */
export async function checkVariantExistsGlobally(variantId: string) {
  try {

    // Try to fetch variant without region restriction
    const variant = await sdk.client.fetch(`/store/variants/${variantId}`, {
      method: "GET",
      headers: await getAuthHeaders(),
    })


    return {
      exists: !!variant,
      variant: variant
    }
  } catch (error: any) {
    console.error("❌ Global variant check failed:", error)
    return {
      exists: false,
      variant: null,
      error: error.message
    }
  }
}

/**
 * Add multiple products to cart as part of a ritual
 * This is optimized for adding main product + ritual product together
 */
export async function addRitualToCartAction({
  mainProduct,
  ritualProduct,
  countryCode,
}: {
  mainProduct: { variantId: string; quantity: number }
  ritualProduct: { variantId: string; quantity: number }
  countryCode: string
}) {
  const cc = (countryCode || "in").toLowerCase()
  

  // UI-only cart management - no API calls until checkout
  return { 
    ok: true, 
    mainProductQuantity: mainProduct.quantity,
    ritualProductQuantity: ritualProduct.quantity,
    message: "Ritual products added to cart (UI only)"
  }
}
