"use client"

import type { MetaProductEvent } from "./meta-event-data"

type PixelFunction = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void
  queue: unknown[][]
  push?: PixelFunction
  loaded: boolean
  version: string
}

declare global {
  interface Window {
    fbq?: PixelFunction
    _fbq?: PixelFunction
  }
}

let initialized = false
function declined(): boolean {
  // Honor the existing explicit cookie choice. A storage error must not break shopping.
  try { return localStorage.getItem("jardinBotanica_cookieConsent") === "declined" }
  catch { return true }
}

function initializePixel(): boolean {
  if (typeof window === "undefined" || declined()) return false
  const id = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim()
  if (!id || !/^\d+$/.test(id)) return false
  if (initialized) return true
  if (!window.fbq) {
    const fbq: PixelFunction = Object.assign(function (...args: unknown[]) {
      if (fbq.callMethod) fbq.callMethod(...args)
      else fbq.queue.push(args)
    }, { queue: [] as unknown[][], loaded: true, version: "2.0" })
    fbq.push = fbq
    window.fbq = window._fbq = fbq
    const script = document.createElement("script")
    script.async = true
    script.src = "https://connect.facebook.net/en_US/fbevents.js"
    document.head.appendChild(script)
  }
  window.fbq("set", "autoConfig", false, id)
  window.fbq("init", id)
  window.addEventListener("jardinBotanica:cookie-consent", () => {
    window.fbq?.("consent", declined() ? "revoke" : "grant")
  })
  initialized = true
  return true
}

export function trackMetaPageView(): boolean {
  try {
    if (!initializePixel()) return false
    window.fbq?.("track", "PageView")
    return true
  } catch {
    return false
  }
}

export function trackMetaProductEvent(name: "ViewContent" | "AddToCart", event?: MetaProductEvent): void {
  try {
    if (!event?.productId || !Number.isFinite(event.quantity) || event.quantity <= 0) return
    if (!initializePixel()) return
    const hasValue = Number.isFinite(event.value) && event.value! >= 0 && /^[A-Z]{3}$/.test(event.currency || "")
    window.fbq?.("track", name, {
      content_type: "product",
      content_ids: [event.productId],
      contents: [{ id: event.productId, quantity: event.quantity }],
      num_items: event.quantity,
      ...(hasValue ? { value: event.value, currency: event.currency } : {}),
    }, { eventID: `${name.toLowerCase()}_${crypto.randomUUID()}` })
  } catch {
    // Analytics failure must never turn a successful cart operation into an error.
  }
}
