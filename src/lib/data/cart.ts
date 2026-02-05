// lib/data/cart.ts
"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import type { HttpTypes } from "@medusajs/types"
import { revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import {
  getAuthHeaders,
  getCacheOptions,
  getCacheTag,
  getCartId,
  removeCartId,
  setCartId,
} from "./cookies"
import { getRegion } from "./regions"

/**
 * Retrieves a cart by its ID. If no ID is provided, it will use the cart ID from the cookies.
 * @param cartId - optional - The ID of the cart to retrieve.
 * @returns The cart object if found, or null if not found.
 */
export async function retrieveCart(cartId?: string) {
  const id = cartId || (await getCartId())
  if (!id) return null

  const headers = { ...(await getAuthHeaders()) }

  // 🚫 Stop caching the cart: always fetch fresh
  // (this is the single most important fix)
  return await sdk.client
    .fetch<HttpTypes.StoreCartResponse>(`/store/carts/${id}`, {
      method: "GET",
      query: {
        fields:
          "*items, *region, *items.product, *items.product.categories, *items.variant, *items.thumbnail, *items.metadata, +items.total, *promotions, +shipping_methods.name",
      },
      headers,
      cache: "no-store",
    })
    .then(({ cart }) => cart)
    .catch((err) => {
      // Only return null if it's a 404 (Cart Not Found)
      // Re-throw other errors (extensions, timeouts, 500s) to prevent the UI from interpreting them as "empty cart"
      if (err?.status === 404 || err?.message?.includes("404") || err?.type === "not_found") {
        return null
      }
      console.error("Error retrieving cart:", err)
      throw err
    })
}

export async function getOrSetCart(countryCode: string) {
  const region = await getRegion(countryCode)

  if (!region) {
    throw new Error(`Region not found for country code: ${countryCode}`)
  }

  let cart = await retrieveCart()

  const headers = {
    ...(await getAuthHeaders()),
  }

  if (!cart) {
    const cartResp = await sdk.store.cart.create({ region_id: region.id }, {}, headers)
    cart = cartResp.cart

    await setCartId(cart.id)

    const cartCacheTag = await getCacheTag("carts")
    revalidateTag(cartCacheTag)
  }

  if (cart && cart?.region_id !== region.id) {
    await sdk.store.cart.update(cart.id, { region_id: region.id }, {}, headers)
    const cartCacheTag = await getCacheTag("carts")
    revalidateTag(cartCacheTag)
  }

  return cart
}

export async function updateCart(data: HttpTypes.StoreUpdateCart) {
  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("No existing cart found, please create one before updating")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.cart
    .update(cartId, data, {}, headers)
    .then(async ({ cart }) => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)

      const fulfillmentCacheTag = await getCacheTag("fulfillment")
      revalidateTag(fulfillmentCacheTag)

      return cart
    })
    .catch(medusaError)
}

export async function addToCart({
  variantId,
  quantity,
  countryCode,
}: {
  variantId: string
  quantity: number
  countryCode: string
}) {
  if (!variantId) {
    throw new Error("Missing variant ID when adding to cart")
  }

  const cart = await getOrSetCart(countryCode)

  if (!cart) {
    throw new Error("Error retrieving or creating cart")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  await sdk.store.cart
    .createLineItem(
      cart.id,
      {
        variant_id: variantId,
        quantity,
      },
      {},
      headers
    )
    .then(async () => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)

      const fulfillmentCacheTag = await getCacheTag("fulfillment")
      revalidateTag(fulfillmentCacheTag)
    })
    .catch(medusaError)
}

/**
 * Adds a variant to cart, or updates the quantity if the variant already exists.
 * This preserves existing metadata (like gift flags) on the line item.
 * @param variantId - The ID of the variant to add
 * @param quantity - The quantity to add
 * @param countryCode - The country code for the cart region
 * @param canBeGifted - Optional flag indicating if the product can be marked as a gift
 */
export async function addOrUpdateLineItem({
  variantId,
  quantity,
  countryCode,
  canBeGifted,
}: {
  variantId: string
  quantity: number
  countryCode: string
  canBeGifted?: boolean
}): Promise<{ lineItemId: string; cartId: string }> {
  if (!variantId) {
    throw new Error("Missing variant ID when adding to cart")
  }

  const cart = await getOrSetCart(countryCode)

  if (!cart) {
    throw new Error("Error retrieving or creating cart")
  }

  // Check if a line item with the same variant already exists
  const existingLineItem = cart.items?.find((item) => item.variant_id === variantId)

  const headers = {
    ...(await getAuthHeaders()),
  }

  let lineItemId: string

  if (existingLineItem) {
    // Update existing line item quantity (preserves metadata including gift flags)
    const newQuantity = existingLineItem.quantity + quantity
    lineItemId = existingLineItem.id
    await sdk.store.cart
      .updateLineItem(cart.id, existingLineItem.id, { quantity: newQuantity }, {}, headers)
      .then(async () => {
        const cartCacheTag = await getCacheTag("carts")
        revalidateTag(cartCacheTag)

        const fulfillmentCacheTag = await getCacheTag("fulfillment")
        revalidateTag(fulfillmentCacheTag)
      })
      .catch(medusaError)
  } else {
    // Create new line item with optional gift eligibility metadata
    const lineItemData: { variant_id: string; quantity: number; metadata?: Record<string, any> } = {
      variant_id: variantId,
      quantity,
    }

    // Store canBeGifted flag in metadata if provided
    if (canBeGifted !== undefined) {
      lineItemData.metadata = {
        can_be_gifted: canBeGifted,
      }
    }

    await sdk.store.cart
      .createLineItem(cart.id, lineItemData, {}, headers)
      .then(async () => {
        const cartCacheTag = await getCacheTag("carts")
        revalidateTag(cartCacheTag)

        const fulfillmentCacheTag = await getCacheTag("fulfillment")
        revalidateTag(fulfillmentCacheTag)
      })
      .catch(medusaError)

    // Fetch the cart to get the new line item ID
    const updatedCart = await retrieveCart()
    const newLineItem = updatedCart?.items?.find((item) => item.variant_id === variantId)
    lineItemId = newLineItem?.id || ""
  }

  return { lineItemId, cartId: cart.id }
}

export async function updateLineItem({ lineId, quantity }: { lineId: string; quantity: number }) {
  if (!lineId) {
    throw new Error("Missing lineItem ID when updating line item")
  }

  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("Missing cart ID when updating line item")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  await sdk.store.cart
    .updateLineItem(cartId, lineId, { quantity }, {}, headers)
    .then(async () => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)

      const fulfillmentCacheTag = await getCacheTag("fulfillment")
      revalidateTag(fulfillmentCacheTag)
    })
    .catch(medusaError)
}

/**
 * Updates the gift status and quantity for a line item.
 * Stores is_gift and gift_quantity in the line item's metadata.
 */
export async function updateLineItemGift({
  lineId,
  quantity,
  isGift,
  giftQuantity,
}: {
  lineId: string
  quantity: number
  isGift: boolean
  giftQuantity: number
}) {
  if (!lineId) {
    throw new Error("Missing lineItem ID when updating gift status")
  }

  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("Missing cart ID when updating gift status")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  await sdk.store.cart
    .updateLineItem(
      cartId,
      lineId,
      {
        quantity,
        metadata: {
          is_gift: isGift,
          gift_quantity: giftQuantity,
        },
      },
      {},
      headers
    )
    .then(async () => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)
    })
    .catch(medusaError)
}

export async function deleteLineItem(lineId: string) {
  if (!lineId) {
    throw new Error("Missing lineItem ID when deleting line item")
  }

  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("Missing cart ID when deleting line item")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  await sdk.store.cart
    .deleteLineItem(cartId, lineId, headers)
    .then(async () => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)

      const fulfillmentCacheTag = await getCacheTag("fulfillment")
      revalidateTag(fulfillmentCacheTag)
    })
    .catch(medusaError)
}

export async function setShippingMethod({
  cartId,
  shippingMethodId,
  paymentMethod,
  totalAmount,
  cod_available,
  prepaid_available,
}: {
  cartId: string
  shippingMethodId: string
  paymentMethod?: "COD" | "PREPAID"
  totalAmount?: number
  cod_available?: boolean
  prepaid_available?: boolean
}) {
  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.cart
    .addShippingMethod(
      cartId,
      {
        option_id: shippingMethodId,
        data: {
          paymentMethod: paymentMethod,
          totalAmount: totalAmount,
          cod_available: cod_available,
          prepaid_available: prepaid_available,
        },
      },
      {},
      headers
    )
    .then(async () => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)
    })
    .catch(medusaError)
}

export async function initiatePaymentSession(
  cart: HttpTypes.StoreCart,
  data: HttpTypes.StoreInitializePaymentSession
) {
  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.payment
    .initiatePaymentSession(cart, data, {}, headers)
    .then(async (resp) => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)
      return resp
    })
    .catch(medusaError)
}

export async function applyPromotions(codes: string[]) {
  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("No existing cart found")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.cart
    .update(cartId, { promo_codes: codes }, {}, headers)
    .then(async () => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)

      const fulfillmentCacheTag = await getCacheTag("fulfillment")
      revalidateTag(fulfillmentCacheTag)
    })
    .catch(medusaError)
}

export async function applyGiftCard(code: string) {
  //   const cartId = getCartId()
  //   if (!cartId) return "No cartId cookie found"
  //   try {
  //     await updateCart(cartId, { gift_cards: [{ code }] }).then(() => {
  //       revalidateTag("cart")
  //     })
  //   } catch (error: any) {
  //     throw error
  //   }
}

export async function removeDiscount(code: string) {
  // const cartId = getCartId()
  // if (!cartId) return "No cartId cookie found"
  // try {
  //   await deleteDiscount(cartId, code)
  //   revalidateTag("cart")
  // } catch (error: any) {
  //   throw error
  // }
}

export async function removeGiftCard(
  codeToRemove: string,
  giftCards: any[]
  // giftCards: GiftCard[]
) {
  //   const cartId = getCartId()
  //   if (!cartId) return "No cartId cookie found"
  //   try {
  //     await updateCart(cartId, {
  //       gift_cards: [...giftCards]
  //         .filter((gc) => gc.code !== codeToRemove)
  //         .map((gc) => ({ code: gc.code })),
  //     }).then(() => {
  //       revalidateTag("cart")
  //     })
  //   } catch (error: any) {
  //     throw error
  //   }
}

export async function submitPromotionForm(currentState: unknown, formData: FormData) {
  const code = formData.get("code") as string
  try {
    await applyPromotions([code])
  } catch (e: any) {
    return e.message
  }
}

// TODO: Pass a POJO instead of a form entity here
export async function setAddresses(currentState: unknown, formData: FormData) {
  try {
    if (!formData) {
      throw new Error("No form data found when setting addresses")
    }
    const cartId = getCartId()
    if (!cartId) {
      throw new Error("No existing cart found when setting addresses")
    }

    const data = {
      shipping_address: {
        first_name: formData.get("shipping_address.first_name")?.toString() || "",
        last_name: formData.get("shipping_address.last_name")?.toString() || "",
        address_1: formData.get("shipping_address.address_1")?.toString() || "",
        address_2: "",
        company: formData.get("shipping_address.company")?.toString() || "",
        postal_code: formData.get("shipping_address.postal_code")?.toString() || "",
        city: formData.get("shipping_address.city")?.toString() || "",
        country_code: formData.get("shipping_address.country_code")?.toString() || "",
        province: formData.get("shipping_address.province")?.toString() || "",
        phone: formData.get("shipping_address.phone")?.toString() || "",
      },
      email: formData.get("email")?.toString() || "",
    } as any

    const sameAsBilling = formData.get("same_as_billing")
    if (sameAsBilling === "on") {
      data.billing_address = data.shipping_address
    } else {
      data.billing_address = {
        first_name: formData.get("billing_address.first_name")?.toString() || "",
        last_name: formData.get("billing_address.last_name")?.toString() || "",
        address_1: formData.get("billing_address.address_1")?.toString() || "",
        address_2: "",
        company: formData.get("billing_address.company")?.toString() || "",
        postal_code: formData.get("billing_address.postal_code")?.toString() || "",
        city: formData.get("billing_address.city")?.toString() || "",
        country_code: formData.get("billing_address.country_code")?.toString() || "",
        province: formData.get("billing_address.province")?.toString() || "",
        phone: formData.get("billing_address.phone")?.toString() || "",
      }
    }
    await updateCart(data)
  } catch (e: any) {
    return e.message
  }

  redirect(`/${formData.get("shipping_address.country_code")}/checkout?step=delivery`)
}

/**
 * Places an order for a cart. If no cart ID is provided, it will use the cart ID from the cookies.
 * @param cartId - optional - The ID of the cart to place an order for.
 * @returns The cart object if the order was successful, or null if not.
 */
export async function placeOrder(cartId?: string) {
  const id = cartId || (await getCartId())

  if (!id) {
    throw new Error("No existing cart found when placing an order")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const cartRes = await sdk.store.cart
    .complete(id, {}, headers)
    .then(async (cartRes) => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)
      return cartRes
    })
    .catch(medusaError)

  if (cartRes?.type === "order") {
    const countryCode = cartRes.order.shipping_address?.country_code?.toLowerCase()

    const orderCacheTag = await getCacheTag("orders")
    revalidateTag(orderCacheTag)

    removeCartId()
    redirect(`/${countryCode}/order/${cartRes?.order.id}/confirmed`)
  }

  return cartRes.cart
}

/**
 * Updates the countrycode param and revalidates the regions cache
 * @param regionId
 * @param countryCode
 */
export async function updateRegion(countryCode: string, currentPath: string) {
  const cartId = await getCartId()
  const region = await getRegion(countryCode)

  if (!region) {
    throw new Error(`Region not found for country code: ${countryCode}`)
  }

  if (cartId) {
    await updateCart({ region_id: region.id })
    const cartCacheTag = await getCacheTag("carts")
    revalidateTag(cartCacheTag)
  }

  const regionCacheTag = await getCacheTag("regions")
  revalidateTag(regionCacheTag)

  const productsCacheTag = await getCacheTag("products")
  revalidateTag(productsCacheTag)

  redirect(`/${countryCode}${currentPath}`)
}

export async function listCartOptions() {
  const cartId = await getCartId()
  const headers = {
    ...(await getAuthHeaders()),
  }
  const next = {
    ...(await getCacheOptions("shippingOptions")),
  }

  return await sdk.client.fetch<{
    shipping_options: HttpTypes.StoreCartShippingOption[]
  }>("/store/shipping-options", {
    query: { cart_id: cartId },
    next,
    headers,
    cache: "force-cache",
  })
}

export async function addToCartAction(_prevState: unknown, formData: FormData) {
  const variantId = String(formData.get("variantId") ?? "")
  const quantity = Number(formData.get("quantity") ?? 1)
  const countryCode = String(formData.get("countryCode") ?? "in").toLowerCase()

  if (!variantId) throw new Error("Missing variantId")
  if (!quantity || quantity < 1) throw new Error("Quantity must be >= 1")

  await addToCart({ variantId, quantity, countryCode })
  // You can return something to update local UI state if you use useActionState
  return { ok: true }
}
