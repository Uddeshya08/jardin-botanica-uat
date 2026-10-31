"use server"

import { getCartId } from "./cookies"
import { updateCart } from "./cart"

export async function saveMetaConsent(cartId: string, accepted: boolean): Promise<{ success: boolean; error?: string }> {
  if (typeof accepted !== "boolean" || !cartId || cartId !== (await getCartId())) {
    return { success: false, error: "Your cart has changed. Refresh checkout before saving this preference." }
  }
  try {
    // Medusa merges metadata fields, preserving gift selections and other cart metadata.
    // The native cart-completion workflow copies this metadata to the order.
    await updateCart({ metadata: {
      meta_capi_consent: accepted,
      meta_capi_consent_updated_at: new Date().toISOString(),
      meta_capi_consent_source: "checkout_review_v1",
    } })
    return { success: true }
  } catch {
    return { success: false, error: "We couldn't save this preference. Your previous choice is still selected. Please try again." }
  }
}
