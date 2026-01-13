"use client"

import { Cookie, X } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const pathname = usePathname()

  // Get country code from pathname
  const getCountryCode = () => {
    if (pathname) {
      const pathParts = pathname.split("/")
      return pathParts[1] || "in"
    }
    return "in"
  }

  const countryCode = getCountryCode()

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem("jardinBotanica_cookieConsent")
    if (!consent) {
      // Delay showing the banner for 10 seconds for better UX
      setTimeout(() => {
        setShowBanner(true)
        setTimeout(() => setIsVisible(true), 100)
      }, 10000)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("jardinBotanica_cookieConsent", "accepted")
    setIsVisible(false)
    setTimeout(() => setShowBanner(false), 300)
  }

  const handleDecline = () => {
    localStorage.setItem("jardinBotanica_cookieConsent", "declined")
    setIsVisible(false)
    setTimeout(() => setShowBanner(false), 300)
  }

  if (!showBanner) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9998]"
            onClick={handleDecline}
          />

          {/* Cookie Banner */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6"
          >
            <div className="max-w-6xl mx-auto">
              <div
                className="relative bg-white/40 backdrop-blur-2xl rounded-2xl md:rounded-3xl shadow-2xl border border-white/20 p-6 md:p-8"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
              >
                {/* Close button */}
                <button
                  onClick={handleDecline}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-black/60" />
                </button>

                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-full bg-black/5 flex items-center justify-center">
                      <Cookie className="w-7 h-7 text-black/70" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pr-8 md:pr-0">
                    <h3 className="font-american-typewriter text-xl md:text-2xl text-black mb-3 tracking-wide">
                      We Value Your Privacy
                    </h3>
                    <p className="font-din-arabic text-sm md:text-base text-black/70 leading-relaxed tracking-wide">
                      We use cookies to enhance your browsing experience, serve personalized
                      content, and analyze our traffic. By clicking "Accept All", you consent to our
                      use of cookies. You can manage your preferences or learn more in our{" "}
                      <a
                        href={`/${countryCode}/privacy-policy`}
                        className="underline hover:text-black transition-colors"
                      >
                        Privacy Policy
                      </a>
                      .
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleDecline}
                      className="px-6 py-3 rounded-xl border border-black/20 text-black font-din-arabic tracking-wide hover:bg-black/5 transition-all duration-300 whitespace-nowrap"
                    >
                      Decline
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAccept}
                      className="px-6 py-3 rounded-xl bg-black text-white font-din-arabic tracking-wide hover:bg-black/90 transition-all duration-300 shadow-lg hover:shadow-xl whitespace-nowrap"
                    >
                      Accept All
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
