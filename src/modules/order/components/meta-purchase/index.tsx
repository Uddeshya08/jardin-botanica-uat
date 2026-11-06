"use client"

import { useEffect } from "react"
import { trackMetaPurchase } from "@lib/util/meta-pixel"
import type { MetaPurchasePlan } from "@lib/util/meta-pixel"

export default function MetaPurchase({ orderId }: { orderId: string }) {
  useEffect(() => {
    const controller = new AbortController()
    let timer: ReturnType<typeof setTimeout> | undefined
    let attempts = 0
    const check = async () => {
      if (controller.signal.aborted || ++attempts > 12) return
      try {
        const response = await fetch("/api/meta/events", {
          method: "POST", headers: { "Content-Type": "application/json" },
          credentials: "same-origin", cache: "no-store", signal: controller.signal,
          body: JSON.stringify({ event_name: "Purchase", order_id: orderId }),
        })
        if (controller.signal.aborted) return
        if (response.ok) {
          const plan: MetaPurchasePlan = await response.json()
          if (controller.signal.aborted) return
          if (plan.state === "ready") { trackMetaPurchase(plan); return }
          if (plan.state !== "waiting" && plan.state !== "unavailable") return
        }
      } catch { if (controller.signal.aborted) return }
      timer = setTimeout(() => { void check() }, 5000)
    }
    void check()
    return () => { controller.abort(); if (timer) clearTimeout(timer) }
  }, [orderId])
  return null
}
