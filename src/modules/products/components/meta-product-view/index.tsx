"use client"

import type { HttpTypes } from "@medusajs/types"
import { trackMetaProductEvent } from "@lib/util/meta-pixel"
import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"

export default function MetaProductView({ product }: { product: HttpTypes.StoreProduct }) {
  const pathname = usePathname()
  const lastView = useRef<string | undefined>(undefined)
  useEffect(() => {
    const key = `${pathname}:${product.id}`
    if (!product.id || lastView.current === key) return
    lastView.current = key
    const prices = (product.variants || []).flatMap((variant) => {
      const amount = variant.calculated_price?.calculated_amount
      if (typeof amount !== "number" || !Number.isFinite(amount) || amount < 0) return []
      return [{ value: amount, currency: variant.calculated_price?.currency_code?.toUpperCase() }]
    }).sort((a, b) => a.value - b.value)
    const price = prices[0]
    trackMetaProductEvent("ViewContent", {
      productId: product.id, quantity: 1,
      ...(price || {}),
    })
  }, [pathname, product])
  return null
}
