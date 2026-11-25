import type { HttpTypes } from "@medusajs/types"

export type MetaProductEvent = {
  productId: string
  quantity: number
  value?: number
  currency?: string
}

export type MetaFunnelData = {
  content_type?: "product"
  content_ids?: string[]
  contents?: { id: string; quantity: number }[]
  num_items?: number
  value?: number
  currency?: string
  content_name?: "newsletter" | "early-access" | "email" | "google"
  status?: true
}

export function getMetaCheckoutEvent(cart: HttpTypes.StoreCart): MetaFunnelData | undefined {
  if (!cart.items?.length) return undefined
  const quantities = new Map<string, number>()
  for (const item of cart.items) {
    if (!item.product_id || !/^prod_[a-zA-Z0-9]+$/.test(item.product_id) ||
      !Number.isInteger(item.quantity) || item.quantity <= 0) return undefined
    quantities.set(item.product_id, (quantities.get(item.product_id) || 0) + item.quantity)
  }
  const contents = Array.from(quantities, ([id, quantity]) => ({ id, quantity }))
  const numItems = contents.reduce((sum, item) => sum + item.quantity, 0)
  if (contents.length > 20 || numItems > 1000) return undefined
  const currency = cart.currency_code?.toUpperCase()
  const value = cart.total
  return {
    content_type: "product", content_ids: contents.map((item) => item.id), contents, num_items: numItems,
    ...(typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 100000000 && /^[A-Z]{3}$/.test(currency || "")
      ? { value, currency } : {}),
  }
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
