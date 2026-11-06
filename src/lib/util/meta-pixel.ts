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
const sentPurchases = new Set<string>()
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

function relayMetaEvent(name: string, eventId: string, customData?: Record<string, unknown>): void {
  try {
    if (typeof fetch !== "function") return
    const cookie = (name: string) => {
      const value = document.cookie?.split("; ").find((entry) => entry.startsWith(`${name}=`))?.split("=").slice(1).join("=")
      return value ? decodeURIComponent(value) : undefined
    }
    const body = JSON.stringify({ event_name: name, event_id: eventId, event_time: Math.floor(Date.now() / 1000),
      event_source_url: window.location.href.split(/[?#]/)[0], custom_data: customData,
      fbp: cookie("_fbp"), fbc: cookie("_fbc") })
    const send = (retry: boolean) => {
      void fetch("/api/meta/events", { method: "POST", credentials: "same-origin",
        headers: { "Content-Type": "application/json" }, body, keepalive: true })
        .then((response) => { if (retry && response.status >= 500) setTimeout(() => send(false), 1000) })
        .catch(() => { if (retry) setTimeout(() => send(false), 1000) })
    }
    send(true)
  } catch {
    // Browser tracking remains independent from availability of the server relay.
  }
}

export function trackMetaPageView(): boolean {
  try {
    if (!initializePixel()) return false
    const eventId = `pageview_${crypto.randomUUID()}`
    relayMetaEvent("PageView", eventId)
    window.fbq?.("track", "PageView", {}, { eventID: eventId })
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
    const customData = {
      content_type: "product",
      content_ids: [event.productId],
      contents: [{ id: event.productId, quantity: event.quantity }],
      num_items: event.quantity,
      ...(hasValue ? { value: event.value, currency: event.currency } : {}),
    }
    const eventId = `${name.toLowerCase()}_${crypto.randomUUID()}`
    relayMetaEvent(name, eventId, customData)
    window.fbq?.("track", name, customData, { eventID: eventId })
  } catch {
    // Analytics failure must never turn a successful cart operation into an error.
  }
}

export type MetaPurchasePlan = {
  state: string
  dataset_id?: string
  event_id?: string
  custom_data?: Record<string, unknown>
}

export function trackMetaPurchase(plan: MetaPurchasePlan): boolean {
  try {
    const id = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim()
    const data = plan.custom_data
    if (plan.state !== "ready" || plan.dataset_id !== id || !data ||
      typeof data.order_id !== "string" || !/^order_[a-zA-Z0-9]+$/.test(data.order_id) ||
      plan.event_id !== `purchase_${data.order_id}` ||
      typeof data.value !== "number" || !Number.isFinite(data.value) || data.value <= 0 ||
      typeof data.currency !== "string" || !/^[A-Z]{3}$/.test(data.currency)) return false
    if (declined()) return false
    const receipt = `meta-purchase:${id}:${plan.event_id}`
    if (sentPurchases.has(receipt)) return true
    try { if (sessionStorage.getItem(receipt)) return true } catch { /* Memory receipt remains available. */ }
    if (!initializePixel()) return false
    window.fbq?.("track", "Purchase", data, { eventID: plan.event_id })
    sentPurchases.add(receipt)
    try { sessionStorage.setItem(receipt, "sent") } catch { /* Stable event ID still allows Meta deduplication. */ }
    return true
  } catch { return false }
}
