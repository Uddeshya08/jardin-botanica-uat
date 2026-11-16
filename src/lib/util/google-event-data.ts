import type { HttpTypes } from "@medusajs/types"

export type GoogleItem = { item_id: string; item_name?: string; price?: number; quantity: number }
export type GoogleEcommerce = { items: GoogleItem[]; currency?: string; value?: number }

const amount = (value: unknown): number | undefined =>
  typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : undefined

function ecommerce(items: GoogleItem[], currencyCode?: string): GoogleEcommerce | undefined {
  if (!items.length || items.length > 200) return undefined
  const currency = currencyCode?.toUpperCase()
  const priced = /^[A-Z]{3}$/.test(currency || "") && items.every((item) => item.price !== undefined)
  return {
    items,
    ...(priced ? { currency, value: Number(items.reduce((sum, item) => sum + item.price! * item.quantity, 0).toFixed(6)) } : {}),
  }
}

export function buildGoogleCartEvent(cart: HttpTypes.StoreCart, variantId?: string, addedQuantity?: number): GoogleEcommerce | undefined {
  const lines = variantId ? cart.items?.filter((item) => item.variant_id === variantId) : cart.items
  if (!lines?.length || (variantId && (!Number.isInteger(addedQuantity) || addedQuantity! <= 0))) return undefined
  const items: GoogleItem[] = []
  for (const line of lines) {
    const quantity = variantId ? addedQuantity! : line.quantity
    const id = line.variant_id || line.product_id || line.id
    if (!id || !Number.isInteger(quantity) || quantity <= 0 || !Number.isInteger(line.quantity) || line.quantity <= 0) return undefined
    const total = amount(line.total), tax = amount(line.tax_total)
    // Same net-merchandise basis and variant identifiers as the existing purchase event.
    const price = total !== undefined && tax !== undefined && tax <= total ? (total - tax) / line.quantity : undefined
    items.push({ item_id: id, item_name: line.product_title || line.title, quantity,
      ...(price !== undefined ? { price } : {}) })
  }
  return ecommerce(items, cart.currency_code)
}

export function buildGoogleProductView(product: HttpTypes.StoreProduct): GoogleEcommerce | undefined {
  if (!product.id) return undefined
  const variants = [...(product.variants || [])].filter((variant) => amount(variant.calculated_price?.calculated_amount) !== undefined)
    .sort((a, b) => a.calculated_price!.calculated_amount! - b.calculated_price!.calculated_amount!)
  const variant = variants[0]
  const calculated = variant?.calculated_price
  const price = amount(calculated?.calculated_amount_without_tax) ??
    (calculated?.is_calculated_price_tax_inclusive === false ? amount(calculated.calculated_amount) : undefined)
  return ecommerce([{ item_id: variant?.id || product.id, item_name: product.title, quantity: 1,
    ...(price !== undefined ? { price } : {}) }], calculated?.currency_code || undefined)
}

// Do not forward obvious contact details, URLs or long numeric identifiers typed into search.
export function googleSearchTerm(query: string): string | undefined {
  const term = query.trim().replace(/\s+/g, " ")
  if (!term) return undefined
  if (term.length > 100 || /[@:/\\?=]|www\.|%[0-9a-f]{2}/i.test(term) ||
    term.replace(/\D/g, "").length >= 7) return "[redacted]"
  return term
}
