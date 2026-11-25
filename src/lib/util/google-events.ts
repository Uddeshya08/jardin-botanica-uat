"use client"

import { GOOGLE_MEASUREMENT_ID } from "./google-purchase"
import type { GoogleEcommerce } from "./google-event-data"

type GoogleEvents = {
  view_item: GoogleEcommerce
  add_to_cart: GoogleEcommerce
  begin_checkout: GoogleEcommerce
  add_shipping_info: GoogleEcommerce & { shipping_tier: string }
  add_payment_info: GoogleEcommerce & { payment_type: string }
  search: { search_term: string }
  generate_lead: { lead_source: "newsletter" | "early-access" }
  sign_up: { method: "email" | "google" }
}

const sent = new Set<string>()
const pending = new Set<string>()
let waiting = 0

function allowed(): boolean {
  try { return localStorage.getItem("jardinBotanica_cookieConsent") !== "declined" }
  catch { return false }
}

// Queue briefly for Next Script initialization. No Meta configuration or CAPI calls are used.
export function trackGoogleEvent<N extends keyof GoogleEvents>(name: N, data: GoogleEvents[N] | undefined, receiptKey?: string): boolean {
  try {
    if (typeof window === "undefined" || !data || !allowed()) return false
    const key = receiptKey ? `jardinBotanica_ga_${GOOGLE_MEASUREMENT_ID}_${name}_${receiptKey}` : undefined
    if (key) {
      if (sent.has(key) || pending.has(key)) return true
      try { if (sessionStorage.getItem(key)) return true } catch { /* Memory receipts remain available. */ }
    }
    if (waiting >= 100) return false
    const location = new URL(window.location.href)
    const pageLocation = location.origin + location.pathname
    // Freeze the successful action's payload and URL while waiting for the Google tag.
    const payload = JSON.parse(JSON.stringify({ ...data, send_to: GOOGLE_MEASUREMENT_ID, page_location: pageLocation }))
    if (key) pending.add(key)
    waiting++
    let attempts = 0
    const finish = () => { waiting--; if (key) pending.delete(key) }
    const send = () => {
      try {
        if (!allowed()) { finish(); return }
        if (typeof window.gtag !== "function") {
          if (++attempts < 60) { setTimeout(send, 500); return }
          finish(); return
        }
        window.gtag("event", name, payload)
        if (key) {
          sent.add(key)
          try { sessionStorage.setItem(key, "1") } catch { /* Memory receipt still covers replays. */ }
        }
        finish()
      } catch { finish() }
    }
    send()
    return true
  } catch { return false }
}
