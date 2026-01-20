"use client"
import { motion } from "motion/react"
import React from "react"
import type { FeaturedSection } from "../../types/contentful"

type FeaturedProps = {
  featuredContent?: FeaturedSection | null
}

export default function Featured({ featuredContent }: FeaturedProps) {
  // Default values if no Contentful data is provided
  const defaults = {
    heading: "Cultivate Your Ritu",
    subheading:
      "Subscribe to receive hand care wisdom, botanical insights, and early access to our latest concoctions.",
    backgroundColor: "#e3e3d8",
    inputPlaceholder: "Enter your email",
    ctaLabel: "Subscribe",
    ctaLink: "#",
  }

  const meta = featuredContent || defaults
  const [email, setEmail] = React.useState("")
  const [message, setMessage] = React.useState("")
  const [isSuccess, setIsSuccess] = React.useState(false)
  const [isPending, startTransition] = React.useTransition()

  // Don't render if Contentful data exists but is inactive
  if (featuredContent && !featuredContent.isActive) {
    return null
  }

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()

    // If there's a link, allow navigation (skip subscription logic)
    if (meta.ctaLink && meta.ctaLink !== "#") {
      return
    }

    if (!email || !email.includes("@")) {
      setIsSuccess(false)
      setMessage("Please enter a valid email address")
      return
    }

    startTransition(async () => {
      const { subscribeToNewsletter } = await import("@lib/data/brevo")
      const result = await subscribeToNewsletter(email)

      setIsSuccess(result.success)
      setMessage(result.message)

      if (result.success) {
        setEmail("")
        setTimeout(() => {
          setMessage("")
        }, 5000)
      }
    })
  }

  return (
    <section
      className="py-20 relative overflow-hidden"
      style={{ backgroundColor: meta.backgroundColor }}
    >
      {/* animated background layers (unchanged) */}
      <motion.div
        className="absolute inset-0 opacity-15"
        style={{
          background: "linear-gradient(45deg, #e58a4d, #545d4a, #e58a4d, #545d4a, #e58a4d)",
          backgroundSize: "600% 600%",
        }}
        animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
        transition={{ duration: 15, ease: [0.4, 0, 0.6, 1], repeat: Infinity }}
      />
      <motion.div
        className="absolute inset-0 opacity-10"
        style={{
          background: "linear-gradient(-45deg, #545d4a, #e58a4d, #545d4a, #e58a4d)",
          backgroundSize: "800% 800%",
        }}
        animate={{ backgroundPosition: ["100% 0%", "0% 100%", "100% 0%"] }}
        transition={{
          duration: 20,
          ease: [0.25, 0.46, 0.45, 0.94],
          repeat: Infinity,
        }}
      />

      <div className="container mx-auto px-4 md:px-6 lg:px-12 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="font-american-typewriter text-2xl md:text-3xl tracking-tight mb-4 md:mb-6 text-black"
          >
            {meta.heading}
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="font-din-arabic text-black/70 mb-6 md:mb-8 leading-relaxed text-base md:text-lg"
          >
            {meta.subheading}
          </motion.p>

          <motion.form
            onSubmit={handleSubscribe}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col gap-4 max-w-md mx-auto"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="email"
                placeholder={meta.inputPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isPending}
                className="font-din-arabic flex-1 px-4 py-3 bg-transparent border border-black/30 text-black placeholder-black/60 focus:outline-none focus:border-black transition-all duration-300"
              />
              {/* If ctaLink is provided, render as a link; otherwise plain button */}
              {meta.ctaLink && meta.ctaLink !== "#" ? (
                <a href={meta.ctaLink} aria-label={meta.ctaLabel}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    className="font-din-arabic px-8 py-3 bg-black text-white hover:bg-black/90 transition-colors tracking-wide w-full sm:w-auto"
                  >
                    {meta.ctaLabel}
                  </motion.button>
                </a>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isPending}
                  className="font-din-arabic px-8 py-3 bg-black text-white hover:bg-black/90 transition-colors tracking-wide w-full sm:w-auto"
                >
                  {isPending ? "Subscribing..." : meta.ctaLabel}
                </motion.button>
              )}
            </div>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`font-din-arabic text-sm px-4 py-2 rounded ${isSuccess
                    ? "bg-green-100 text-green-800 border border-green-300"
                    : "bg-red-100 text-red-800 border border-red-300"
                  }`}
              >
                {message}
              </motion.div>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  )
}

