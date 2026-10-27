"use client"

import { useEffect, useRef, useState } from "react"
import { ImageWithFallback } from "./figma/ImageWithFallback"

/** Keep the poster visible until the browser actually starts video playback. */
export function HeroBackground({ videoUrl, imageUrl, alt }: {
  videoUrl?: string
  imageUrl?: string
  alt: string
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !videoUrl) return
    let disposed = false
    const play = () => {
      if (disposed || video.error || video.ended || document.hidden) return
      // Set properties before play(), including on Safari's hydration path.
      video.muted = true
      video.defaultMuted = true
      video.playsInline = true
      void video.play().then(() => {
        // Cached autoplay can start before React attaches onPlaying.
        if (!disposed && !video.paused && video.readyState >= 2) setPlaying(true)
      }).catch(() => {
        // Policy rejection / interrupted play is not a broken asset. Keep the
        // video mounted and retry when the visitor interacts or returns.
      })
    }
    play()
    video.addEventListener("canplay", play)
    document.addEventListener("visibilitychange", play)
    document.addEventListener("pointerdown", play)
    document.addEventListener("touchend", play)
    document.addEventListener("keydown", play)
    return () => {
      disposed = true
      video.removeEventListener("canplay", play)
      document.removeEventListener("visibilitychange", play)
      document.removeEventListener("pointerdown", play)
      document.removeEventListener("touchend", play)
      document.removeEventListener("keydown", play)
      video.pause()
    }
  }, [videoUrl])

  return (
    <div className="absolute inset-0 overflow-hidden" data-testid="hero-background">
      {imageUrl && (
        <ImageWithFallback
          src={imageUrl}
          alt={alt}
          loading="eager"
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      {videoUrl && (
        <video
          ref={videoRef}
          src={videoUrl}
          poster={imageUrl}
          muted
          playsInline
          preload="auto"
          autoPlay
          aria-hidden="true"
          onPlaying={() => setPlaying(true)}
          onError={() => setPlaying(false)}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: playing ? 1 : 0 }}
        />
      )}
    </div>
  )
}
