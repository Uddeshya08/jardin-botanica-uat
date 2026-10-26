"use client"

import type { CarouselApi } from "app/components/ui/carousel"
import { useEffect, useState } from "react"

export const PRODUCT_FADE_MS = 2500
const IMAGE_HOLD_MS = 1000

/** One clock sequences visible cards, then advances to the next group. */
export function useSequentialCarousel(api: CarouselApi, itemCount: number, enabled = true) {
  const [alternateImages, setAlternateImages] = useState<Set<number>>(new Set())

  useEffect(() => {
    if (!api || !itemCount || !enabled) return

    let timer: ReturnType<typeof setTimeout> | undefined
    let visible = false
    let moving = false
    let disposed = false
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const clear = () => {
      if (timer !== undefined) clearTimeout(timer)
      timer = undefined
    }
    const active = () => !disposed && visible && !document.hidden && !moving && !reducedMotion.matches
    const schedule = (callback: () => void, delay: number) => {
      clear()
      if (active()) timer = setTimeout(callback, delay)
    }
    const visibleCards = () => {
      const viewport = api.rootNode().getBoundingClientRect()
      return api.slideNodes().flatMap((slide, index) => {
        const rect = slide.getBoundingClientRect()
        const overlap = Math.min(rect.right, viewport.right) - Math.max(rect.left, viewport.left)
        return rect.width > 0 && overlap >= rect.width * 0.9 ? [index] : []
      })
    }
    const begin = () => {
      const cards = visibleCards()
      if (!active() || !cards.length) return
      const step = (cursor: number) => {
        if (!active()) return
        if (cursor < cards.length) {
          setAlternateImages((previous) => {
            const next = new Set(previous)
            const index = cards[cursor]
            if (next.has(index)) next.delete(index)
            else next.add(index)
            return next
          })
          schedule(() => step(cursor + 1), PRODUCT_FADE_MS + IMAGE_HOLD_MS)
        } else if (api.scrollSnapList().length > 1) {
          moving = true
          api.scrollTo(api.canScrollNext() ? api.selectedScrollSnap() + 1 : 0)
        } else {
          // All products already fit: keep changing them individually in order.
          schedule(begin, IMAGE_HOLD_MS)
        }
      }
      schedule(() => step(0), IMAGE_HOLD_MS)
    }
    const onSelect = () => {
      moving = true
      clear()
      setAlternateImages(new Set())
    }
    const onSettle = () => {
      moving = false
      begin()
    }
    const onReInit = () => {
      moving = false
      clear()
      setAlternateImages(new Set())
      begin()
    }
    const onVisibilityChange = () => {
      clear()
      if (active()) begin()
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      onVisibilityChange()
    }, { threshold: 0.25 })

    setAlternateImages(new Set())
    observer.observe(api.rootNode())
    api.on("select", onSelect)
    api.on("settle", onSettle)
    api.on("reInit", onReInit)
    document.addEventListener("visibilitychange", onVisibilityChange)
    reducedMotion.addEventListener("change", onVisibilityChange)
    return () => {
      disposed = true
      clear()
      observer.disconnect()
      api.off("select", onSelect)
      api.off("settle", onSettle)
      api.off("reInit", onReInit)
      document.removeEventListener("visibilitychange", onVisibilityChange)
      reducedMotion.removeEventListener("change", onVisibilityChange)
    }
  }, [api, itemCount, enabled])

  return alternateImages
}
