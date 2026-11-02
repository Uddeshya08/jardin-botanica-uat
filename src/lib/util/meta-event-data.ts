import type { HttpTypes } from "@medusajs/types"

export type MetaProductEvent = {
  productId: string
  quantity: number
  value?: number
  currency?: string
}

export function getMetaCartEvent(
  cart: HttpTypes.StoreCart,
  variantId: string,
  addedQuantity: number
): MetaProductEvent | undefined {
  const item = cart.items?.find((entry) => entry.variant_id === variantId)
  if (!item?.product_id || !Number.isFinite(addedQuantity) || addedQuantity <= 0) return undefined
  const price = Number(item.unit_price)
  const currency = cart.currency_code?.toUpperCase()
  return {
    productId: item.product_id,
    quantity: addedQuantity,
    ...(item.unit_price != null && Number.isFinite(price) && price >= 0 && /^[A-Z]{3}$/.test(currency || "")
      ? { value: price * addedQuantity, currency } : {}),
  }
}
