import type { HttpTypes } from "@medusajs/types"
import { normalizeCheckoutPhone } from "./checkout-phone"

export function isCheckoutReady(
  cart: Pick<HttpTypes.StoreCart, "shipping_address" | "billing_address" | "shipping_methods"> | null
): boolean {
  if (!cart?.shipping_address || !cart.billing_address || !cart.shipping_methods?.length) {
    return false
  }

  try {
    normalizeCheckoutPhone(cart.shipping_address.phone || "")
    return true
  } catch {
    return false
  }
}
