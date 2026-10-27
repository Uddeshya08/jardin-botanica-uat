"use client"

import { type RefObject, useEffect, useState } from "react"
import type { ProductSequenceApi } from "./use-sequential-carousel"

/** Adapt the existing desktop grid/mobile scroll strip without changing its layout. */
export function useNativeProductCarousel(ref: RefObject<HTMLDivElement | null>, itemCount: number, contentKey = "") {
  const [api, setApi] = useState<ProductSequenceApi>()

  useEffect(() => {
    const root = ref.current
    if (!root || !itemCount) {
      setApi(undefined)
      return
    }
    const listeners = new Map<string, Set<() => void>>()
    let timer: ReturnType<typeof setTimeout> | undefined
    let selected = 0
    const emit = (event: string) => listeners.get(event)?.forEach((callback) => callback())
    const slides = () => Array.from(root.children) as HTMLElement[]
    const snaps = () => {
      if (window.innerWidth >= 768 || root.scrollWidth <= root.clientWidth + 1) return [0]
      const first = slides()[0]
      if (!first) return [0]
      const gap = parseFloat(getComputedStyle(root).columnGap) || 0
      const stride = first.getBoundingClientRect().width + gap
      const count = Math.max(1, Math.round((root.clientWidth + gap) / stride))
      const end = root.scrollWidth - root.clientWidth
      const positions = [0]
      for (let offset = stride * count; offset < end; offset += stride * count) positions.push(offset)
      positions.push(end)
      return positions
    }
    const current = () => {
      const points = snaps()
      return points.reduce((nearest, point, index) =>
        Math.abs(point - root.scrollLeft) < Math.abs(points[nearest] - root.scrollLeft) ? index : nearest, 0)
    }
    const onScroll = () => {
      const next = current()
      if (next !== selected) {
        selected = next
        emit("select")
      }
      if (timer !== undefined) clearTimeout(timer)
      timer = setTimeout(() => emit("settle"), 180)
    }
    const onResize = () => {
      selected = current()
      emit("reInit")
    }
    const adapter: ProductSequenceApi = {
      rootNode: () => root,
      slideNodes: slides,
      selectedScrollSnap: current,
      scrollSnapList: snaps,
      canScrollNext: () => current() < snaps().length - 1,
      scrollTo: (index) => {
        const left = snaps()[index] ?? 0
        if (Math.abs(root.scrollLeft - left) < 1) {
          emit("settle")
          return
        }
        emit("select")
        root.scrollTo({ left, behavior: "smooth" })
      },
      on: (event, callback) => {
        if (!listeners.has(event)) listeners.set(event, new Set())
        listeners.get(event)!.add(callback)
      },
      off: (event, callback) => listeners.get(event)?.delete(callback),
    }
    const observer = new ResizeObserver(onResize)
    observer.observe(root)
    root.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onResize)
    setApi(adapter)
    return () => {
      if (timer !== undefined) clearTimeout(timer)
      observer.disconnect()
      root.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onResize)
      listeners.clear()
    }
  }, [ref, itemCount, contentKey])

  return api
}
