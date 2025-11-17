"use client"

import React, { useEffect, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react"

import { ImageWithFallback } from "./figma/ImageWithFallback"
import { BotanicalCollections } from "./BotanicalCollections"

const ICON_IMAGE =
  "/assets/b-labs-logo.png"
const FOUNDER_WORKSPACE_IMAGE =
  "/assets/founder-pic.png"

const questionText = "Every formula begins as a question."
const answerPart1 = "We observe, formulate, and reiterate until there's proof."
const answerPart2 = "The result:\nformulas shaped by climate, chemistry, and care."
const fullAnswerText =
  "We observe, formulate, and reiterate until there's proof. The result: formulas shaped by climate, chemistry, and care."

const OVERLAY_GRADIENT =
  "absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-black/70 pointer-events-none"

const useTypewriter = (
  text: string,
  baseSpeed = 100,
  pauseAt?: number,
  isActive = true
) => {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [hasPaused, setHasPaused] = useState(false)

  useEffect(() => {
    if (isActive) {
      setDisplayedText("")
      setCurrentIndex(0)
      setIsPaused(false)
      setIsComplete(false)
      setHasPaused(false)
    }
  }, [isActive])

  useEffect(() => {
    if (!isActive) return

    if (currentIndex < text.length) {
      if (!isPaused) {
        const char = text[currentIndex]
        const prevChar = currentIndex > 0 ? text[currentIndex - 1] : ""
        let typingDelay = baseSpeed

        if (char === ".") {
          typingDelay = baseSpeed + 800
        } else if (char === ",") {
          typingDelay = baseSpeed + 500
        } else if (char === ":") {
          typingDelay = baseSpeed + 600
        } else if (char === " " && prevChar === ".") {
          typingDelay = baseSpeed + 300
        } else if (char === " ") {
          typingDelay = baseSpeed + Math.random() * 60
        } else {
          typingDelay = baseSpeed + Math.random() * 40
        }

        const timer = setTimeout(() => {
          setDisplayedText((prev) => prev + text[currentIndex])
          setCurrentIndex((prev) => prev + 1)

          if (pauseAt !== undefined && currentIndex + 1 === pauseAt && !hasPaused) {
            setIsPaused(true)
            setHasPaused(true)
            setTimeout(() => {
              setIsPaused(false)
            }, 1600)
          }
        }, typingDelay)
        return () => clearTimeout(timer)
      }
    } else if (isActive) {
      setIsComplete(true)
    }
  }, [currentIndex, text, baseSpeed, pauseAt, isPaused, hasPaused, isActive])

  return { displayedText, isComplete }
}

function InteractiveLabImage() {
  const [activePoint, setActivePoint] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handlePointClick = (id: number) => {
    if (isMobile) {
      setActivePoint(activePoint === id ? null : id)
    }
  }

  const handleMouseEnter = (id: number) => {
    if (!isMobile) {
      setActivePoint(id)
    }
  }

  const handleMouseLeave = () => {
    if (!isMobile) {
      setActivePoint(null)
    }
  }

  const hotspots = [
    {
      id: 1,
      position: { top: "25%", left: "15%" },
      number: "01",
      title: "Study",
      description:
        "We trace each ingredient back to its environment — its soil, climate, and season.",
      detail: "A plant's survival strategy often reveals its skincare secret.",
    },
    {
      id: 2,
      position: { top: "35%", right: "20%" },
      number: "02",
      title: "Design",
      description: "Science informs every ratio, but design completes the equation.",
      detail: "A formula must feel resolved — texture, scent, and finish in perfect balance.",
    },
    {
      id: 3,
      position: { bottom: "28%", left: "35%" },
      number: "03",
      title: "Materials",
      description: "Packaging is treated as part of the formula.",
      detail: "Amber glass and recycled materials protect product and planet alike.",
    },
    {
      id: 4,
      position: { bottom: "35%", right: "15%" },
      number: "04",
      title: "Refinement",
      description: "Each batch is observed, logged, and tested for stability and delight.",
      detail: "Nothing leaves without proof in data — and pleasure in use.",
    },
  ]

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative w-full h-[500px] sm:h-[600px] lg:h-[700px]"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setActivePoint(null)
          }
        }}
      >
        <motion.div
          className="absolute inset-0 overflow-hidden"
          animate={{
            filter: activePoint ? "blur(4px)" : "blur(0px)",
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1578988247672-da7397b0b2d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1600&utm_source=figma&utm_medium=referral"
            alt="Botanical Laboratory"
            className="w-full h-full object-cover"
          />
          <div className={OVERLAY_GRADIENT} />
        </motion.div>

        <div className="absolute top-0 left-0 right-0 pt-8 sm:pt-12 lg:pt-24 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-16 text-center z-10 relative">
          <div className={OVERLAY_GRADIENT} />
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-10"
          >
            <h1
              className="font-american-typewriter text-white mb-4 sm:mb-6 text-xl sm:text-2xl lg:text-3xl"
              style={{
                letterSpacing: "0.05em",
                textShadow: "0 4px 30px rgba(0, 0, 0, 0.7)",
              }}
            >
              Our Work
            </h1>

            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "80px" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="h-px mx-auto mb-4 sm:mb-6 sm:w-[120px] bg-gradient-to-r from-black/80 via-white/60 to-black/80 shadow-[0_0_16px_rgba(0,0,0,0.55)]"
            />

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="font-din-arabic text-white/90 text-sm sm:text-base lg:text-xl max-w-2xl mx-auto px-4"
              style={{
                letterSpacing: "0.1em",
                textShadow: "0 2px 20px rgba(0, 0, 0, 0.7)",
              }}
            >
              Four principles guide every formula
            </motion.p>
          </motion.div>
        </div>

        {hotspots.map((hotspot) => (
          <div key={hotspot.id} className="absolute" style={hotspot.position}>
            <div className="relative w-12 h-12">
              <motion.div
                className="absolute inset-0 w-full h-full rounded-full pointer-events-none"
                style={{
                  backgroundColor: "rgba(162, 139, 111, 0.4)",
                  filter: "blur(10px)",
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0.9, 0.5],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: [0.4, 0, 0.6, 1],
                }}
              />

              {activePoint === hotspot.id && (
                <motion.div
                  className="absolute inset-0 w-full h-full rounded-full pointer-events-none"
                  style={{
                    backgroundColor: "rgba(162, 139, 111, 0.6)",
                    filter: "blur(15px)",
                  }}
                  initial={{ scale: 1, opacity: 0 }}
                  animate={{
                    scale: [1, 1.8, 1],
                    opacity: [0.6, 1, 0.6],
                  }}
                  exit={{ scale: 1, opacity: 0 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: [0.4, 0, 0.6, 1],
                  }}
                />
              )}

              <motion.div
                className="relative z-10 w-full h-full rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center cursor-pointer shadow-lg"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
                transition={{
                  scale: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                }}
                onMouseEnter={() => handleMouseEnter(hotspot.id)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handlePointClick(hotspot.id)}
              >
                <span
                  className="font-american-typewriter text-black"
                  style={{ letterSpacing: "0.05em" }}
                >
                  {hotspot.number}
                </span>
              </motion.div>
            </div>

            <AnimatePresence>
              {activePoint === hotspot.id && (
                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 0.95,
                    y: hotspot.id === 3 || hotspot.id === 4 ? -8 : 8,
                  }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    scale: 0.95,
                    y: hotspot.id === 3 || hotspot.id === 4 ? -8 : 8,
                  }}
                  transition={{ duration: 0.9, type: "spring", stiffness: 100, damping: 28 }}
                  className={`absolute ${
                    hotspot.id === 3 || hotspot.id === 4 ? "bottom-full mb-4" : "top-full mt-4"
                  } w-72 sm:w-80 bg-white/95 backdrop-blur-md rounded-sm shadow-2xl p-5 sm:p-6 z-20 max-w-[calc(100vw-2rem)] pointer-events-none`}
                  style={{
                    left: hotspot.id === 3 ? "0" : hotspot.position.left ? "0" : "auto",
                    right: hotspot.id === 4 ? "0" : hotspot.position.right ? "0" : "auto",
                    transform:
                      hotspot.id === 4
                        ? "translateX(calc(-100% + 48px))"
                        : hotspot.position.right && hotspot.id !== 3
                        ? "translateX(calc(-100% + 48px))"
                        : "translateX(-24px)",
                  }}
                >
                  <div
                    className={`absolute ${
                      hotspot.id === 3 || hotspot.id === 4 ? "-bottom-2" : "-top-2"
                    } w-4 h-4 bg-white/95 rotate-45`}
                    style={{
                      left: hotspot.id === 3 ? "24px" : hotspot.position.left ? "24px" : "auto",
                      right: hotspot.id === 4 ? "24px" : hotspot.position.right ? "24px" : "auto",
                    }}
                  />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: "#a28b6f" }}
                      >
                        <span
                          className="font-american-typewriter text-white text-sm"
                          style={{ letterSpacing: "0.05em" }}
                        >
                          {hotspot.number}
                        </span>
                      </div>
                      <h1
                        className="font-american-typewriter text-2xl lg:text-3xl"
                        style={{ letterSpacing: "0.05em" }}
                      >
                        {hotspot.title}
                      </h1>
                    </div>
                    <div className="space-y-3">
                      <p
                        className="font-din-arabic text-black/80 leading-relaxed"
                        style={{ letterSpacing: "0.1em" }}
                      >
                        {hotspot.description}
                      </p>
                      <p
                        className="font-din-arabic text-black/60 leading-relaxed"
                        style={{ letterSpacing: "0.1em" }}
                      >
                        {hotspot.detail}
                      </p>
                    </div>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="h-px bg-gradient-to-r from-transparent via-[#a28b6f] to-transparent mt-4"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        <AnimatePresence>
          {!activePoint && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-x-0 bottom-16 sm:bottom-24 lg:bottom-32 px-4 sm:px-6 flex justify-center"
            >
              <div className="bg-white/90 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg">
                <p
                  className="font-din-arabic text-black/70 text-xs sm:text-sm text-center"
                  style={{ letterSpacing: "0.1em" }}
                >
                  <span className="hidden sm:inline">Hover over</span>
                  <span className="sm:hidden">Tap</span> the points to explore
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

function OurWorkSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 0])

  return (
    <motion.section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ backgroundColor: "#d8d2c7", opacity }}
    >
      <InteractiveLabImage />
    </motion.section>
  )
}

function OriginStorySection() {
  const [isInView, setIsInView] = useState(false)
  const { displayedText, isComplete } = useTypewriter("The Idea of a Lab", 80, undefined, isInView)

  return (
    <section className="py-16 sm:py-20 lg:py-32 px-4 sm:px-6 lg:px-16 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            onViewportEnter={() => setIsInView(true)}
          >
            <div className="mb-8">
              <span
                className="font-din-arabic text-sm tracking-widest uppercase"
                style={{ color: "#a28b6f", letterSpacing: "0.15em" }}
              >
                Est. 2025
              </span>
            </div>
            <h1
              className="font-american-typewriter mb-4 sm:mb-6 text-xl sm:text-2xl lg:text-3xl min-h-[2.5rem] sm:min-h-[3rem]"
              style={{ letterSpacing: "0.05em" }}
            >
              {displayedText}
              {!isComplete && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
                  className="inline-block ml-1"
                >
                  |
                </motion.span>
              )}
            </h1>
            <div
              className="space-y-4 font-din-arabic text-black/70 leading-relaxed"
              style={{ letterSpacing: "0.1em" }}
            >
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Jardin Botanica began as a curiosity. Could the serenity of a garden be translated
                into something tactile: a lotion, a scent, a texture that remembers its origin?
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                The Botanist&apos;s Lab was built to find out.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                It&apos;s not white coats and microscopes but notebooks, glassware, temperature logs,
                and the patience to observe what each botanical chooses to do in its own time.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Here, formulas are drafted the way architects draft light — measured, iterative, and
                quietly obsessive.
              </motion.p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative h-[300px] sm:h-[400px] lg:h-[600px]"
          >
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1680260257306-18f13a2d7863?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1600&utm_source=figma&utm_medium=referral"
              alt="Botanical Laboratory"
              className="w-full h-full object-cover shadow-2xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function LivingStudySection() {
  const [isInView, setIsInView] = useState(false)
  const { displayedText, isComplete } = useTypewriter("A Living Study", 80, undefined, isInView)

  return (
    <section className="py-16 sm:py-20 lg:py-32 px-4 sm:px-6 lg:px-16 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-5 gap-8 sm:gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-2"
            onViewportEnter={() => setIsInView(true)}
          >
            <h1
              className="font-american-typewriter mb-6 sm:mb-8 text-xl sm:text-2xl lg:text-3xl min-h-[2.5rem] sm:min-h-[3rem]"
              style={{ letterSpacing: "0.05em" }}
            >
              {displayedText}
              {!isComplete && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
                  className="inline-block ml-1"
                >
                  |
                </motion.span>
              )}
            </h1>
            <div
              className="font-din-arabic text-black/70 leading-relaxed space-y-4"
              style={{ letterSpacing: "0.1em" }}
            >
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                The Botanist&apos;s Lab is not a place of arrivals; it&apos;s a place of ongoing
                experiments.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Every collection extends a study: tea and oat for resilience, orris for memory,
                hinoki for calm.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Each creation is archived like a specimen: labeled, dated, revisited.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                There&apos;s no final version — only the version that exists now, informed by
                everything learned before.
              </motion.p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-3 relative h-[300px] sm:h-[400px] lg:h-[500px]"
          >
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1760034746619-f922049bc2a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1600&utm_source=figma&utm_medium=referral"
              alt="Living Study"
              className="w-full h-full object-cover shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#e3e3d8] to-transparent opacity-30" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function FounderSection({
  closingRef,
  founderWorkspaceImage,
}: {
  closingRef: React.RefObject<HTMLElement>
  founderWorkspaceImage: string
}) {
  const [isInView, setIsInView] = useState(false)
  const { displayedText, isComplete } = useTypewriter(
    "A Note from the Founder",
    80,
    undefined,
    isInView
  )

  return (
    <section
      ref={closingRef}
      className="relative pt-12 pb-16 sm:pb-20 lg:pt-16 lg:pb-32 overflow-hidden"
      style={{ backgroundColor: "#e3e3d8" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-12 lg:mb-16"
          onViewportEnter={() => setIsInView(true)}
        >
          <h1
            className="font-american-typewriter text-xl sm:text-2xl lg:text-3xl min-h-[2.5rem] sm:min-h-[3rem]"
            style={{ letterSpacing: "0.05em" }}
          >
            {displayedText}
            {!isComplete && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
                className="inline-block ml-1"
              >
                |
              </motion.span>
            )}
          </h1>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5"
          >
            <div className="relative aspect-[3/4] lg:sticky lg:top-24">
              <ImageWithFallback
                src={founderWorkspaceImage}
                alt="The Founder's Workspace"
                className="w-full h-full object-cover shadow-xl"
                style={{ objectPosition: "center 20%" }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/15 to-transparent" />
              <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-white/40" />
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-white/40" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-7 flex flex-col justify-center"
          >
            <div className="border-l-2 border-[#a28b6f]/20 pl-6 sm:pl-8 lg:pl-12 py-4">
              <div className="mb-6 sm:mb-8">
                <svg className="w-8 h-6 sm:w-10 sm:h-8" viewBox="0 0 40 32" fill="none">
                  <path
                    d="M0 32V16.8C0 7.46667 3.73333 1.06667 11.2 0L13.6 4.8C9.06667 6.13333 6.8 9.6 6.8 14.4H16V32H0ZM24 32V16.8C24 7.46667 27.7333 1.06667 35.2 0L37.6 4.8C33.0667 6.13333 30.8 9.6 30.8 14.4H40V32H24Z"
                    fill="#a28b6f"
                    fillOpacity="0.2"
                  />
                </svg>
              </div>

              <blockquote
                className="space-y-4 sm:space-y-6 font-din-arabic text-black/75 leading-relaxed mb-8 sm:mb-12"
                style={{ letterSpacing: "0.1em" }}
              >
                <p className="text-sm sm:text-base lg:text-lg">
                  With Jardin Botanica, I wanted to create something deliberate — functional yet
                  quietly alive. Each idea that leaves my desk and becomes a formula on your shelf is
                  a practice of equal parts craft and chemistry.
                </p>
                <p className="text-sm sm:text-base lg:text-lg">
                  The Botanist&apos;s Lab stands for that promise. It&apos;s where curiosity meets
                  precision, where tradition informs innovation, and where nature reveals its secrets
                  one formula at a time.
                </p>
              </blockquote>

              <div className="space-y-1 sm:space-y-2">
                <div className="h-px w-16 sm:w-20 bg-[#a28b6f]/30 mb-3 sm:mb-4" />
                <p
                  className="font-american-typewriter text-black text-base sm:text-lg"
                  style={{ letterSpacing: "0.05em" }}
                >
                  Rahul Raghuvanshi
                </p>
                <p
                  className="font-din-arabic text-[#a28b6f]/60 text-xs uppercase"
                  style={{ letterSpacing: "0.15em" }}
                >
                  Founder &amp; Chief Botanist
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export function BotanistLabPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const closingRef = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState(0)

  const { countryCode } = useParams() as { countryCode?: string }
  const router = useRouter()
  const resolvedCountryCode = countryCode ?? "in"

  const pausePosition = "The result:".length

  const { displayedText: displayedQuestion, isComplete: questionComplete } = useTypewriter(
    questionText,
    90,
    undefined,
    phase === 1
  )
  const { displayedText: displayedPart1, isComplete: part1Complete } = useTypewriter(
    answerPart1,
    90,
    undefined,
    phase === 2
  )
  const { displayedText: displayedPart2, isComplete: part2Complete } = useTypewriter(
    answerPart2,
    90,
    pausePosition,
    phase === 3
  )

  useEffect(() => {
    const startTimer = setTimeout(() => {
      setPhase(1)
    }, 1000)

    return () => clearTimeout(startTimer)
  }, [])

  useEffect(() => {
    if (questionComplete && phase === 1) {
      const timer = setTimeout(() => {
        setPhase(2)
      }, 1800)
      return () => clearTimeout(timer)
    }
  }, [questionComplete, phase])

  useEffect(() => {
    if (part1Complete && phase === 2) {
      const timer = setTimeout(() => {
        setPhase(3)
      }, 1200)
      return () => clearTimeout(timer)
    }
  }, [part1Complete, phase])

  useEffect(() => {
    if (part2Complete && phase === 3) {
      const timer = setTimeout(() => {
        setPhase(4)
      }, 2500)
      return () => clearTimeout(timer)
    }
  }, [part2Complete, phase])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95])

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className="min-h-screen"
      style={{ backgroundColor: "#e3e3d8" }}
    >
      <motion.div
        className="relative h-screen flex items-center justify-center overflow-hidden"
        style={{ opacity, scale }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            y: useTransform(scrollYProgress, [0, 0.5], [0, 100]),
          }}
        >
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1706043402272-af4a2a35aaad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1600&utm_source=figma&utm_medium=referral"
            alt="Botanical Greenhouse"
            className="w-full h-full object-cover"
          />
          <div className={OVERLAY_GRADIENT} />
        </motion.div>

        <div className="relative z-10 text-center px-6 max-w-6xl w-full">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <AnimatePresence mode="wait">
              {phase === 1 && (
                <motion.div
                  key="question"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
                  className="w-full"
                >
                  <h1
                    className="font-american-typewriter text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl px-4"
                    style={{ letterSpacing: "0.05em" }}
                  >
                    {displayedQuestion}
                    {!questionComplete && (
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
                        className="inline-block ml-1"
                      >
                        |
                      </motion.span>
                    )}
                  </h1>
                </motion.div>
              )}

              {phase === 2 && (
                <motion.div
                  key="part1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
                  className="w-full max-w-4xl px-4"
                >
                  <h1
                    className="font-american-typewriter text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl"
                    style={{ letterSpacing: "0.05em" }}
                  >
                    {displayedPart1}
                    {!part1Complete && (
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
                        className="inline-block ml-1"
                      >
                        |
                      </motion.span>
                    )}
                  </h1>
                </motion.div>
              )}

              {phase === 3 && (
                <motion.div
                  key="part2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
                  className="w-full max-w-4xl px-4"
                >
                  <h1
                    className="font-american-typewriter text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl text-center whitespace-pre-line"
                    style={{ letterSpacing: "0.05em" }}
                  >
                    {displayedPart2}
                    {!part2Complete && (
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
                        className="inline-block ml-1"
                      >
                        |
                      </motion.span>
                    )}
                  </h1>
                </motion.div>
              )}

              {phase === 4 && (
                <motion.div
                  key="final"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
                  className="flex flex-col items-center gap-8"
                >
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="font-american-typewriter text-white text-3xl sm:text-4xl md:text-5xl lg:text-7xl px-4"
                    style={{ letterSpacing: "0.05em" }}
                  >
                    {questionText}
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="font-din-arabic text-white/90 text-base sm:text-lg lg:text-xl max-w-2xl px-4"
                    style={{ letterSpacing: "0.1em" }}
                  >
                    {fullAnswerText}
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <AnimatePresence>
          {phase === 4 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 1, duration: 1 }}
              className="absolute bottom-12 left-1/2 -translate-x-1/2"
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-px h-16 bg-white/50"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <OriginStorySection />
      <OurWorkSection />
      <LivingStudySection />
      {/* <BotanicalCollections /> */}
      <FounderSection closingRef={closingRef} founderWorkspaceImage={FOUNDER_WORKSPACE_IMAGE} />

      <section className="relative py-20 lg:py-20" style={{ backgroundColor: "#d8d2c7" }}>
        <div className="max-w-4xl mx-auto px-6 lg:px-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-0"
          >
            <ImageWithFallback
              src={ICON_IMAGE}
              alt="Jardin Botanica Icon"
              className="w-48 h-48 mx-auto object-contain"
              style={{ filter: "brightness(0) saturate(100%)" }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-16"
          >
            <p
              className="font-din-arabic text-black/70 leading-relaxed max-w-2xl mx-auto"
              style={{ letterSpacing: "0.1em" }}
            >
              When you explore our creations, you become part of a tradition that honors patience,
              craft, and the quiet wisdom of the natural world.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto"
          >
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: "rgba(0, 0, 0, 0.95)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push(`/${resolvedCountryCode}/blogs`)}
              className="px-8 py-4 bg-black text-white font-din-arabic transition-all duration-300"
              style={{ letterSpacing: "0.1em" }}
            >
              Explore the Journal
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: "rgba(0, 0, 0, 0.05)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push(`/${resolvedCountryCode}/home-creations`)}
              className="px-8 py-4 bg-transparent text-black font-din-arabic transition-all duration-300 border border-black/20"
              style={{ letterSpacing: "0.1em" }}
            >
              View Current Studies
            </motion.button>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}

