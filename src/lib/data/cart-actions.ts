"use server"

import { addToCart } from "@lib/data/cart"

type AddPayload = {
  variantId: string
  quantity: number
  countryCode: string
}

/**
 * Lightweight wrapper around addToCart that:
 * - normalizes params
 * - retries once on inventory error (common while stock-location links update)
 * - returns quickly to the client
 */
export async function addToCartAction({
  variantId,
  quantity,
  countryCode,
}: AddPayload) {
  if (!variantId) throw new Error("Missing variantId")
  const qty = Math.max(1, Number(quantity || 1))
  const cc = (countryCode || "in").toLowerCase()

  let lastErr: unknown = null

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      await addToCart({ variantId, quantity: qty, countryCode: cc })
      return { ok: true, quantity: qty }
    } catch (err: any) {
      // Medusa often throws this when channel/location/region is slightly out of sync.
      const msg = String(err?.message ?? "")
      const looksLikeInventory =
        msg.includes("required inventory") ||
        msg.toLowerCase().includes("inventory")

      if (looksLikeInventory && attempt === 1) {
        // backoff: tiny delay, then retry once
        await new Promise((r) => setTimeout(r, 300))
        lastErr = err
        continue
      }
      throw err
    }
  }
  throw lastErr ?? new Error("Could not add to cart")
}
