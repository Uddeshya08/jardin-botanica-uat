"use client"

import { useEffect } from "react"
import { trackGooglePurchase } from "@lib/util/google-purchase"
import type { GooglePurchase as Purchase } from "@lib/util/google-purchase"

export default function GooglePurchase({ purchase }: { purchase: Purchase | undefined }) {
  useEffect(() => {
    if (!purchase) return
    let timer: ReturnType<typeof setTimeout> | undefined
    let attempts = 0
    const send = () => {
      if (timer) clearTimeout(timer)
      // The confirmation component can mount before Next's afterInteractive scripts.
      if (!trackGooglePurchase(purchase) && ++attempts < 60) timer = setTimeout(send, 500)
    }
    send()
    window.addEventListener("jardinBotanica:cookie-consent", send)
    return () => {
      if (timer) clearTimeout(timer)
      window.removeEventListener("jardinBotanica:cookie-consent", send)
    }
  }, [purchase])
  return null
}
