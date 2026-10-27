"use client"

import { useEffect, useRef, useState } from "react"

export const PRODUCT_FADE_MS = 700
const IMAGE_HOLD_MS = 2000
const INITIAL_HOLD_MS = 1000

type SequenceEvent = "select" | "settle" | "reInit"
export type ProductSequenceApi = {
  rootNode: () => HTMLElement
  slideNodes: () => HTMLElement[]
  selectedScrollSnap: () => number
  scrollSnapList: () => number[]
  canScrollNext: () => boolean
  scrollTo: (index: number) => void
  on: (event: SequenceEvent, callback: () => void) => unknown
  off: (event: SequenceEvent, callback: () => void) => unknown
}

/** One sequence for ready, visible cards. Pauses and reinitialization retain the cursor. */
export function useSequentialCarousel(api: ProductSequenceApi | undefined, itemCount: number, enabled = true, paused = false) {
  const [alternateImages, setAlternateImages] = useState<Set<number>>(new Set())
  const pausedRef = useRef(paused)
  const resumeRef = useRef<(() => void) | undefined>(undefined)

  useEffect(() => {
    pausedRef.current = paused
    resumeRef.current?.()
  }, [paused])

  useEffect(() => {
    if (!api || !itemCount || !enabled) return
    let timer: ReturnType<typeof setTimeout> | undefined
    let visible = false
    let moving = false
    let disposed = false
    let cards: number[] = []
    let cursor = 0
    let targetAlternate = true
    let selectedSnap = api.selectedScrollSnap()
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const clear = () => {
      if (timer !== undefined) clearTimeout(timer)
      timer = undefined
    }
    const active = () => !disposed && visible && !document.hidden && !moving &&
      !pausedRef.current && !reducedMotion.matches
    const schedule = (callback: () => void, delay: number) => {
      clear()
      if (active()) timer = setTimeout(callback, delay)
    }
    const visibleCards = () => {
      const viewport = api.rootNode().getBoundingClientRect()
      return api.slideNodes().flatMap((slide, index) => {
        const rect = slide.getBoundingClientRect()
        const overlap = Math.min(rect.right, viewport.right) - Math.max(rect.left, viewport.left)
        const media = slide.querySelector<HTMLElement>("[data-carousel-media-state]")
        const image = media?.getBoundingClientRect() || rect
        const verticalOverlap = Math.min(image.bottom, window.innerHeight) - Math.max(image.top, 0)
        return rect.width > 0 && overlap >= rect.width * 0.9 && verticalOverlap >= image.height * 0.5 ? [index] : []
      })
    }
    const syncGroup = () => {
      const next = visibleCards()
      const snap = api.selectedScrollSnap()
      if (snap === selectedSnap && next.join(",") === cards.join(",")) return
      cards = next
      selectedSnap = snap
      cursor = 0
      targetAlternate = true
      // Keep visible cards stable; reset only offscreen cards after a move settles.
      setAlternateImages((previous) => new Set(Array.from(previous).filter((index) => cards.includes(index))))
    }
    const step = () => {
      if (!active()) return
      syncGroup()
      if (!cards.length) {
        schedule(step, 200)
        return
      }
      while (cursor < cards.length) {
        const index = cards[cursor]
        const media = api.slideNodes()[index]?.querySelector<HTMLElement>("[data-carousel-media-state]")
        const state = media?.dataset.carouselMediaState
        if (state === "loading") {
          schedule(step, 200)
          return
        }
        cursor += 1
        if (state === "unavailable") continue
        const nextValue = targetAlternate
        setAlternateImages((previous) => {
          const next = new Set(previous)
          if (nextValue) next.add(index)
          else next.delete(index)
          return next
        })
        schedule(step, PRODUCT_FADE_MS + IMAGE_HOLD_MS)
        return
      }
      if (api.scrollSnapList().length > 1) {
        moving = true
        api.scrollTo(api.canScrollNext() ? api.selectedScrollSnap() + 1 : 0)
      } else {
        cursor = 0
        targetAlternate = !targetAlternate
        schedule(step, INITIAL_HOLD_MS)
      }
    }
    const resume = () => {
      clear()
      if (active()) schedule(step, INITIAL_HOLD_MS)
    }
    const onSelect = () => {
      moving = true
      clear()
    }
    const onSettle = () => {
      moving = false
      syncGroup()
      resume()
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      resume()
    }, { threshold: 0 })

    setAlternateImages(new Set())
    resumeRef.current = resume
    observer.observe(api.rootNode())
    api.on("select", onSelect)
    api.on("settle", onSettle)
    api.on("reInit", onSettle)
    document.addEventListener("visibilitychange", resume)
    window.addEventListener("scroll", resume, { passive: true })
    reducedMotion.addEventListener("change", resume)
    return () => {
      disposed = true
      resumeRef.current = undefined
      clear()
      observer.disconnect()
      api.off("select", onSelect)
      api.off("settle", onSettle)
      api.off("reInit", onSettle)
      document.removeEventListener("visibilitychange", resume)
      window.removeEventListener("scroll", resume)
      reducedMotion.removeEventListener("change", resume)
    }
  }, [api, itemCount, enabled])

  return alternateImages
}
