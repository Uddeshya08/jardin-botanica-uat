"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { PageBanner as PageBannerType } from "../../types/contentful"
import { getPageBanner } from "@lib/data/contentful"

interface PageBannerProps {
  pageKey: string
  className?: string
  titleClassName?: string
  descriptionClassName?: string
  containerClassName?: string
}

export function PageBanner({
  pageKey,
  className = "relative w-full h-screen md:h-[570px] overflow-hidden",
  titleClassName = "text-white font-medium mb-6 md:mb-8 tracking-tight font-american-typewriter text-5xl md:text-6xl lg:text-7xl",
  descriptionClassName = "font-din-arabic text-base md:text-lg text-white/70 leading-relaxed max-w-2xl mx-auto mb-2 md:mb-4 px-4 md:px-0",
  containerClassName = "absolute top-[37%] md:top-1/2 left-8 md:left-[63px] md:-translate-y-1/2 max-w-xs md:max-w-md",
}: PageBannerProps) {
  const [bannerData, setBannerData] = useState<PageBannerType | null>(null)
  const [videoError, setVideoError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch banner data from Contentful
  useEffect(() => {
    const fetchBannerData = async () => {
      setIsLoading(true)
      try {
        console.log(`[PageBanner] Fetching banner for pageKey: "${pageKey}"`)
        const data = await getPageBanner(pageKey)
        console.log(`[PageBanner] Received data:`, data)
        setBannerData(data)
        // Reset video error when new banner data is loaded
        setVideoError(false)
      } catch (error) {
        console.error(`[PageBanner] Error fetching banner data for pageKey "${pageKey}":`, error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchBannerData()
  }, [pageKey])

  // Default banner data for fallback (for candles page)
  const defaultBanner: PageBannerType | null = pageKey === "candles" ? {
    title: "Candlesss",
    description: "Inspired by ancient stargazers, these candles fill your space with soft, lingering scent bringing calm, beauty, and a touch of the cosmos to your everyday moments.",
    mediaType: "video",
    videoUrl: "/assets/video-banner.mp4",
    imageUrl: "/Images/TopBanner.jpg",
    fallbackImageUrl: "/Images/TopBanner.jpg",
    isActive: true,
    pageKey: "candles",
  } : null

  // Use default banner if Contentful data is not available
  const displayBanner = bannerData || defaultBanner

  // Show loading state or nothing if no data
  if (isLoading) {
    return (
      <div className={className}>
        <div className="w-full h-full bg-gray-200 animate-pulse" />
      </div>
    )
  }

  // Don't render anything if no banner data (and no default)
  if (!displayBanner) {
    console.log(`[PageBanner] No banner data available for pageKey: "${pageKey}"`)
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className={className}
    >
      {/* Render video if mediaType is video and videoUrl exists, otherwise render image */}
      {displayBanner.mediaType === "video" && displayBanner.videoUrl && !videoError ? (
        <motion.video
          initial={{ scale: 1.1, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2 }}
          viewport={{ once: true }}
          src={displayBanner.videoUrl}
          autoPlay
          loop
          muted
          playsInline
          onError={() => setVideoError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2 }}
          viewport={{ once: true }}
          src={
            (videoError && displayBanner.fallbackImageUrl) ||
            displayBanner.imageUrl
          }
          alt={displayBanner.title || "Banner"}
          className="w-full h-full object-cover"
          onError={(e) => {
            console.error(`[PageBanner] Image failed to load:`, e)
            // If image fails, try to show fallback or default
            if (!videoError && displayBanner.fallbackImageUrl) {
              setVideoError(true)
            }
          }}
        />
      )}
      
      {/* Text Overlay */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        viewport={{ once: true }}
        className={containerClassName}
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className={titleClassName}
        >
          {displayBanner.title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className={descriptionClassName}
        >
          {displayBanner.description}
        </motion.p>
      </motion.div>
    </motion.div>
  )
}

