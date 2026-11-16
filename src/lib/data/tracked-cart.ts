"use client"

import { addToCart as addToCartServer, addOrUpdateLineItem as addOrUpdateServer } from "./cart"
import { trackMetaProductEvent } from "@lib/util/meta-pixel"
import { trackGoogleEvent } from "@lib/util/google-events"

export async function addToCart(input: Parameters<typeof addToCartServer>[0]) {
  const result = await addToCartServer(input)
  trackMetaProductEvent("AddToCart", result.metaEvent)
  trackGoogleEvent("add_to_cart", result.googleEvent)
  return result.metaEvent
}

export async function addOrUpdateLineItem(input: Parameters<typeof addOrUpdateServer>[0]) {
  const result = await addOrUpdateServer(input)
  trackMetaProductEvent("AddToCart", result.metaEvent)
  trackGoogleEvent("add_to_cart", result.googleEvent)
  return result
}
