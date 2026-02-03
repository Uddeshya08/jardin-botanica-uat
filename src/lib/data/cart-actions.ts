"use server"

import { addOrUpdateLineItem } from "@lib/data/cart"

type AddPayload = {
  variantId: string
  quantity: number
  countryCode: string
  canBeGifted?: boolean
}

/**
 * Lightweight wrapper around addOrUpdateLineItem that:
 * - normalizes params
 * - retries once on inventory error (common while stock-location links update)
 * - returns quickly to the client
 * - merges with existing cart items to preserve gift metadata
 * - stores canBeGifted flag in metadata for checkout gift option
 * - returns the line item ID for client-side cart sync
 */
export async function addToCartAction({
  variantId,
  quantity,
  countryCode,
  canBeGifted,
}: AddPayload) {
  if (!variantId) throw new Error("Missing variantId")
  const qty = Math.max(1, Number(quantity || 1))
  const cc = (countryCode || "in").toLowerCase()

  let lastErr: unknown = null

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const { lineItemId } = await addOrUpdateLineItem({
        variantId,
        quantity: qty,
        countryCode: cc,
        canBeGifted,
      })
      return { ok: true, quantity: qty, lineItemId }
    } catch (err: any) {
      // Medusa often throws this when channel/location/region is slightly out of sync.
      const msg = String(err?.message ?? "")
      const looksLikeInventory =
        msg.includes("required inventory") || msg.toLowerCase().includes("inventory")

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
