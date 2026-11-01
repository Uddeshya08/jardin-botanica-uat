"use client"

import { type SyntheticEvent, useEffect, useRef, useState } from "react"

export function useProductMediaState(image?: string, video?: string) {
  const source = video || image || ""
  const [loadedSource, setLoadedSource] = useState("")
  const [failedSource, setFailedSource] = useState("")
  const imageRef = useRef<HTMLImageElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const state = !source || failedSource === source ? "unavailable" : loadedSource === source ? "ready" : "loading"

  const decodeImage = async (element: HTMLImageElement) => {
    const requestedSource = element.currentSrc
    try {
      await element.decode()
      if (element.currentSrc === requestedSource && element.naturalWidth > 0) setLoadedSource(source)
    } catch {
      if (element.currentSrc === requestedSource) setFailedSource(source)
    }
  }

  useEffect(() => {
    // Cached media can finish loading before hydration attaches the event handlers.
    if (video) {
      if (videoRef.current && videoRef.current.readyState >= 2) setLoadedSource(source)
    } else if (imageRef.current?.complete) {
      if (imageRef.current.naturalWidth > 0) void decodeImage(imageRef.current)
      else if (source) setFailedSource(source)
    }
  }, [source, video])

  return {
    state,
    imageRef,
    videoRef,
    onImageLoad: (event: SyntheticEvent<HTMLImageElement>) => decodeImage(event.currentTarget),
    onVideoLoaded: () => setLoadedSource(source),
    onError: () => setFailedSource(source),
  }
}
