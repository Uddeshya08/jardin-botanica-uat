"use client"

import { type SyntheticEvent, useState } from "react"

export function useProductMediaState(image?: string, video?: string) {
  const source = video || image || ""
  const [loadedSource, setLoadedSource] = useState("")
  const [failedSource, setFailedSource] = useState("")
  const state = !source || failedSource === source ? "unavailable" : loadedSource === source ? "ready" : "loading"

  const onImageLoad = async (event: SyntheticEvent<HTMLImageElement>) => {
    const element = event.currentTarget
    const requestedSource = element.currentSrc
    try {
      await element.decode()
      if (element.currentSrc === requestedSource && element.naturalWidth > 0) setLoadedSource(source)
    } catch {
      if (element.currentSrc === requestedSource) setFailedSource(source)
    }
  }

  return {
    state,
    onImageLoad,
    onVideoLoaded: () => setLoadedSource(source),
    onError: () => setFailedSource(source),
  }
}
