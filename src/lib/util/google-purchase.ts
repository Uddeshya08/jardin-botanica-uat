import type { HttpTypes } from "@medusajs/types"

export const GOOGLE_MEASUREMENT_ID = "G-2XT3X045KM"

export type GooglePurchase = {
  transaction_id: string
  currency: string
  value: number
  tax: number
  shipping: number
  items: { item_id: string; item_name: string; price: number; quantity: number }[]
}

function amount(value: unknown): number | undefined {
  if (value == null || value === "") return undefined
  const number = Number(value)
  return Number.isFinite(number) && number >= 0 ? number : undefined
}

// Only the server-retrieved order is used; no customer identity is sent to GA4.
export function buildGooglePurchase(order: HttpTypes.StoreOrder): GooglePurchase | undefined {
  const currency = order.currency_code?.toUpperCase()
  const created = new Date(order.created_at).getTime()
  if (!order.id || order.status === "canceled" || !/^[A-Z]{3}$/.test(currency || "") ||
    !Number.isFinite(created) || Date.now() - created > 86400000 || created > Date.now() + 60000 ||
    !order.items?.length || order.items.length > 200) return undefined

  const items: GooglePurchase["items"] = []
  for (const item of order.items) {
    const total = amount(item.total), tax = amount(item.tax_total)
    const quantity = Number(item.quantity)
    if (!item.id || total == null || tax == null || tax > total ||
      !Number.isFinite(quantity) || quantity <= 0) return undefined
    // Medusa v2 totals are major currency units, already discounted and tax inclusive.
    items.push({ item_id: item.variant_id || item.product_id || item.id,
      item_name: item.product_title || item.title,
      price: (total - tax) / quantity, quantity })
  }
  const tax = amount(order.tax_total), shipping = amount(order.shipping_total)
  const shippingTax = amount(order.shipping_tax_total)
  if (tax == null || shipping == null || shippingTax == null || shippingTax > shipping) return undefined
  return { transaction_id: order.id, currency: currency!,
    value: Number(items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(6)),
    tax, shipping: shipping - shippingTax, items }
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

const sent = new Set<string>()

export function trackGooglePurchase(purchase: GooglePurchase): boolean {
  if (typeof window === "undefined") return false
  const key = `jardinBotanica_ga_purchase_${purchase.transaction_id}`
  try {
    if (localStorage.getItem("jardinBotanica_cookieConsent") === "declined") return false
    if (sent.has(key) || localStorage.getItem(key)) return true
  } catch { return false }
  if (typeof window.gtag !== "function") return false
  try {
    window.gtag("event", "purchase", { ...purchase, send_to: GOOGLE_MEASUREMENT_ID })
    sent.add(key)
    try { localStorage.setItem(key, "1") } catch { /* Memory and transaction_id still prevent duplicates. */ }
    return true
  } catch { return false }
}
