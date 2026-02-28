"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { CarouselApi } from "./carousel"
import { cn } from "./utils"

interface CarouselSliderProps {
  api?: CarouselApi
  className?: string
  thumbClassName?: string
  trackClassName?: string
}

export function CarouselSlider({
  api,
  className,
  thumbClassName,
  trackClassName,
}: CarouselSliderProps) {
  const [progress, setProgress] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)
  const dragStartX = useRef(0)
  const dragStartProgress = useRef(0)

  const updateProgress = useCallback(() => {
    if (!api) return
    const scrollProgress = api.scrollProgress()
    setProgress(Math.max(0, Math.min(100, scrollProgress * 100)))
  }, [api])

  useEffect(() => {
    if (!api) return

    updateProgress()
    api.on("scroll", updateProgress)
    api.on("select", updateProgress)
    api.on("reInit", updateProgress)

    return () => {
      api.off("scroll", updateProgress)
      api.off("select", updateProgress)
      api.off("reInit", updateProgress)
    }
  }, [api, updateProgress])

  const scrollToProgress = useCallback(
    (clientX: number) => {
      if (!api || !trackRef.current) return

      const rect = trackRef.current.getBoundingClientRect()
      const x = clientX - rect.left
      const percentage = Math.max(0, Math.min(1, x / rect.width))
      const scrollSnapList = api.scrollSnapList()

      if (scrollSnapList.length <= 1) return

      const targetIndex = Math.round(percentage * (scrollSnapList.length - 1))
      api.scrollTo(targetIndex)
    },
    [api]
  )

  const handleTrackClick = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) return
      scrollToProgress(e.clientX)
    },
    [isDragging, scrollToProgress]
  )

  const handleTrackKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!api) return
      const scrollSnapList = api.scrollSnapList()
      const currentIndex = api.selectedScrollSnap()

      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault()
        if (currentIndex > 0) api.scrollTo(currentIndex - 1)
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault()
        if (currentIndex < scrollSnapList.length - 1) api.scrollTo(currentIndex + 1)
      } else if (e.key === "Home") {
        e.preventDefault()
        api.scrollTo(0)
      } else if (e.key === "End") {
        e.preventDefault()
        api.scrollTo(scrollSnapList.length - 1)
      }
    },
    [api]
  )

  const handleThumbMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(true)
      dragStartX.current = e.clientX
      dragStartProgress.current = progress
    },
    [progress]
  )

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!trackRef.current) return

      const rect = trackRef.current.getBoundingClientRect()
      const deltaX = e.clientX - dragStartX.current
      const maxDelta = rect.width
      const deltaProgress = (deltaX / maxDelta) * 100
      const newProgress = Math.max(0, Math.min(100, dragStartProgress.current + deltaProgress))

      const scrollSnapList = api?.scrollSnapList()
      if (!scrollSnapList || scrollSnapList.length <= 1) return

      const targetIndex = Math.round((newProgress / 100) * (scrollSnapList.length - 1))
      api?.scrollTo(targetIndex)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, api])

  const thumbStyle = {
    left: `${progress}%`,
    transform: "translateX(-50%)",
  }

  return (
    <div
      className={cn("relative h-1 w-full max-w-[40%] mx-auto select-none", className)}
      ref={trackRef}
    >
      <button
        type="button"
        className={cn(
          "absolute inset-0 rounded-full bg-black/10 cursor-pointer transition-colors",
          isDragging && "bg-black/20",
          trackClassName
        )}
        onClick={handleTrackClick}
        onKeyDown={handleTrackKeyDown}
        aria-label="Carousel position slider"
      />
      <div
        className={cn(
          "absolute top-1/2 -translate-y-1/2 w-8 h-1 rounded-full bg-black/30 cursor-grab transition-all",
          "hover:bg-black/40 hover:scale-110",
          isDragging ? "cursor-grabbing bg-black/80 scale-110 duration-75" : "duration-500 ease-out",
          thumbClassName
        )}
        style={thumbStyle}
        onMouseDown={handleThumbMouseDown}
        aria-hidden="true"
      />
    </div>
  )
}
