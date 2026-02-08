"use client"
import { AnimatePresence, motion } from "motion/react"
import { useRouter } from "next/navigation"
import type React from "react"
import { useEffect, useRef, useState, useTransition } from "react"
import { toast } from "sonner"
import { ImageWithFallback } from "./figma/ImageWithFallback"

interface HeroPanel {
  id: number
  title: string
  subtitle: string
  description: string
  imageUrl: string
  videoUrl?: string
  cta: string
  isSpecial?: boolean
}

const heroPanels: HeroPanel[] = [
  {
    id: 1,
    title: "Rituals",
    subtitle: "Little acts of care that change the day.",
    description: "",
    imageUrl: "https://images.unsplash.com/photo-1674620305515-1394fe40c634",
    videoUrl: "/assets/video-banner.mp4",
    cta: "Build your set",
  },
  {
    id: 2,
    title: "Atmosphere",
    subtitle: "Evenings that hold you a little longer.",
    description: "A gentle glow, a scent that stays close.",
    imageUrl: "https://images.unsplash.com/photo-1650482713537-8de547ea7a16",
    cta: "Shop candles",
  },
  {
    id: 3,
    title: "The Lab",
    subtitle: "The garden is our brief; the lab is our proof.",
    description:
      "Formulas with measured actives and climate-smart bases—finished with design you can feel.",
    imageUrl: "https://images.unsplash.com/photo-1720275273886-89966091ce4d",
    cta: "Enter the lab",
  },
  {
    id: 4,
    title: "Circle",
    subtitle: "The Botanist's Circle",
    description:
      "An invitation to the inner world.\nEarly access. Limited blends. Private gatherings.",
    imageUrl: "https://images.unsplash.com/photo-1740513348123-72148a7dbf5b",
    cta: "Join the Circle",
  },
]

export function HeroSection() {
  const router = useRouter()
  const [activePanel, setActivePanel] = useState(1)
  const [videoError, setVideoError] = useState<Record<number, boolean>>({})
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({})
  const [swipeOffset, setSwipeOffset] = useState(0)
  const [isSwiping, setIsSwiping] = useState(false)
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [email, setEmail] = useState("")

  useEffect(() => {
    setActivePanel(1)
  }, [])

  const currentPanel = heroPanels.find((p) => p.id === activePanel) || heroPanels[0]

  // Play video when panel becomes active
  useEffect(() => {
    const panel = heroPanels.find((p) => p.id === activePanel)
    if (videoRefs.current[activePanel] && panel?.videoUrl) {
      videoRefs.current[activePanel]!.currentTime = 0
      videoRefs.current[activePanel]!.play().catch(() => {
        setVideoError((prev) => ({ ...prev, [activePanel]: true }))
      })
    }
  }, [activePanel])

  // Function to transition to next panel
  const goToNextPanel = () => {
    const currentIndex = heroPanels.findIndex((p) => p.id === activePanel)
    const nextIndex = (currentIndex + 1) % heroPanels.length
    setActivePanel(heroPanels[nextIndex].id)
  }

  // Handle video end - pause on last frame
  const handleVideoEnd = (panelId: number) => () => {
    if (videoRefs.current[panelId]) {
      videoRefs.current[panelId]!.pause()
    }
  }

  // Minimum swipe distance
  const minSwipeDistance = 80

  // Handle CTA button clicks
  const handleCTAClick = (panelId: number) => {
    switch (panelId) {
      case 1:
        router.push("/body-hands")
        break
      case 2:
        router.push("/candles")
        break
      case 3:
        router.push("/the-lab")
        break
      case 4:
        setShowEmailForm(true)
        break
    }
  }

  // Handle email subscription
  const [, startTransition] = useTransition()
  const handleEmailSubscription = () => {
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address")
      return
    }

    startTransition(async () => {
      const { subscribeToNewsletter } = await import("@lib/data/brevo")
      const result = await subscribeToNewsletter(email)

      if (result.success) {
        toast.success(result.message)
        setEmail("")
        setShowEmailForm(false)
      } else {
        toast.error(result.message)
      }
    })
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null
    touchStartX.current = e.targetTouches[0].clientX
    setIsSwiping(true)
    setSwipeOffset(0)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartX.current) return

    const currentX = e.targetTouches[0].clientX
    touchEndX.current = currentX
    const offset = currentX - touchStartX.current
    setSwipeOffset(offset)
  }

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) {
      setIsSwiping(false)
      setSwipeOffset(0)
      return
    }

    const distance = touchStartX.current - touchEndX.current
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      goToNextPanel()
    } else if (isRightSwipe) {
      const currentIndex = heroPanels.findIndex((p) => p.id === activePanel)
      const prevIndex = (currentIndex - 1 + heroPanels.length) % heroPanels.length
      setActivePanel(heroPanels[prevIndex].id)
    }

    setIsSwiping(false)
    setSwipeOffset(0)
    touchStartX.current = null
    touchEndX.current = null
  }

  // Spring transition config for smooth motion
  const springTransition = {
    type: "spring" as const,
    stiffness: 300,
    damping: 30,
  }

  return (
    <div
      className="relative w-full h-screen bg-black overflow-hidden"
      style={{ paddingTop: "40px" }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Disable hover effects on touch devices */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @media (hover: none) and (pointer: coarse) {
            .hero-cta-button:hover,
            .hero-nav-dot:hover {
              background-color: inherit !important;
              color: inherit !important;
            }
          }
        `,
        }}
      />

      {/* ✅ Preloaded Background Layers - All panels rendered, opacity controls visibility */}
      <div className="absolute inset-0 z-0">
        {heroPanels.map((panel) => (
          <motion.div
            key={panel.id}
            initial={false}
            animate={{
              opacity: activePanel === panel.id ? 1 : 0,
              scale: activePanel === panel.id ? 1 : 1.05,
            }}
            transition={{
              opacity: { duration: 0.5, ease: "easeInOut" },
              scale: { duration: 0.6, ease: "easeOut" },
            }}
            className="absolute inset-0"
            style={{ pointerEvents: activePanel === panel.id ? "auto" : "none" }}
          >
            <div className="w-full h-full relative overflow-hidden">
              {!videoError[panel.id] && panel.videoUrl ? (
                <video
                  ref={(el) => {
                    videoRefs.current[panel.id] = el
                  }}
                  src={panel.videoUrl}
                  muted
                  playsInline
                  preload="auto"
                  onEnded={handleVideoEnd(panel.id)}
                  onError={() => setVideoError((prev) => ({ ...prev, [panel.id]: true }))}
                  onLoadedData={() => {
                    if (activePanel === panel.id && videoRefs.current[panel.id]) {
                      videoRefs.current[panel.id]!.currentTime = 0
                      videoRefs.current[panel.id]!.play()
                    }
                  }}
                  className="w-full h-full object-cover"
                  style={{ minHeight: "100vh" }}
                />
              ) : (
                <ImageWithFallback
                  src={panel.imageUrl}
                  alt={panel.title}
                  className="w-full h-full object-cover"
                  style={{ minHeight: "100vh" }}
                />
              )}
            </div>
            <div className="absolute inset-0 bg-black/50" />
          </motion.div>
        ))}
      </div>

      {/* ✅ Content Overlay with Spring Physics */}
      <div className="absolute inset-0 z-20">
        <div className="px-6 md:pl-20 h-full flex items-center">
          <motion.div
            className="max-w-2xl text-white"
            animate={{
              x: isSwiping ? swipeOffset * 0.2 : 0,
              opacity: isSwiping ? 1 - Math.abs(swipeOffset) / 500 : 1,
            }}
            transition={springTransition}
          >
            <div className="min-h-[200px] md:min-h-[250px] lg:min-h-[300px]">
              <AnimatePresence mode="wait">
                <motion.h1
                  key={`title-${activePanel}`}
                  className="font-american-typewriter text-5xl md:text-6xl lg:text-7xl mb-6 tracking-tight"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    ...springTransition,
                    stiffness: 250,
                    damping: 25,
                  }}
                >
                  {currentPanel.subtitle}
                </motion.h1>
              </AnimatePresence>

              {/* Description */}
              <div className="min-h-[80px] md:min-h-[100px] mb-8">
                <AnimatePresence mode="wait">
                  {currentPanel.description && (
                    <motion.div
                      key={`description-${activePanel}`}
                      className="font-din-arabic text-xl md:text-2xl text-white/90 leading-relaxed"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{
                        ...springTransition,
                        stiffness: 250,
                        damping: 25,
                        delay: 0.08,
                      }}
                    >
                      {currentPanel.description.split("\n").map((line, i) => (
                        <span key={i}>
                          {line}
                          {i < currentPanel.description.split("\n").length - 1 && <br />}
                        </span>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* CTA Button with Email Form */}
            <div className="mt-4">
              <AnimatePresence mode="wait">
                {activePanel === 4 && showEmailForm ? (
                  /* Email Form - Shows after clicking Join the Circle */
                  <motion.div
                    key="email-form"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={springTransition}
                    className="flex items-center gap-4"
                  >
                    <motion.input
                      initial={{ x: -30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ ...springTransition, delay: 0.1 }}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="font-din-arabic px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 text-white placeholder-white/60 focus:outline-none focus:border-white focus:bg-white/20 transition-all duration-300 rounded-none"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && email.trim()) {
                          handleEmailSubscription()
                        }
                      }}
                      autoFocus
                    />
                    <motion.button
                      initial={{ x: 30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ ...springTransition, delay: 0.15 }}
                      className="font-din-arabic inline-flex items-center px-8 py-3 bg-white text-black hover:bg-white/90 transition-all duration-300 tracking-wide"
                      onClick={handleEmailSubscription}
                      disabled={!email.trim()}
                    >
                      Subscribe
                    </motion.button>
                  </motion.div>
                ) : (
                  /* Regular CTA Button */
                  <motion.button
                    key={`cta-${activePanel}`}
                    className={`font-din-arabic inline-flex items-center px-8 py-3 transition-all duration-300 tracking-wide touch-manipulation ${
                      currentPanel.isSpecial
                        ? "bg-white text-black"
                        : "text-white border border-white/30"
                    }`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ ...springTransition, delay: 0.15 }}
                    onClick={() => handleCTAClick(activePanel)}
                    style={{
                      WebkitTapHighlightColor: "transparent",
                      WebkitTouchCallout: "none",
                      WebkitUserSelect: "none",
                      userSelect: "none",
                    }}
                  >
                    {currentPanel.cta}
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ✅ Bottom Navigation */}
      <div className="absolute bottom-[6rem] sm:bottom-6 left-0 right-0 z-30">
        <div className="container mx-auto px-2 sm:px-4 md:px-6 lg:px-12">
          <div className="flex justify-center">
            <div className="flex bg-black/20 backdrop-blur-md rounded-full px-1 sm:px-1.5 md:px-2 py-1 sm:py-1.5 md:py-2 gap-0.5 sm:gap-1">
              {heroPanels.map((panel) => (
                <button
                  key={panel.id}
                  className={`relative px-2.5 sm:px-4 md:px-5 lg:px-6 py-2 sm:py-2.5 md:py-3 text-[10px] sm:text-xs font-din-arabic tracking-wide sm:tracking-wider transition-all duration-300 rounded-full whitespace-nowrap touch-manipulation ${
                    activePanel === panel.id ? "bg-white/20 text-white" : "text-white/60"
                  }`}
                  style={{
                    WebkitTapHighlightColor: "transparent",
                  }}
                  type="button"
                  onMouseEnter={() => {
                    setActivePanel(panel.id)
                  }}
                  onClick={() => {
                    setActivePanel(panel.id)
                  }}
                >
                  {panel.title.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
