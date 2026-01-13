import { motion } from "motion/react"
import { useRouter } from "next/navigation"
import React, { useState } from "react"

export function FeaturedRitual() {
  const router = useRouter()
  const [isPressed, setIsPressed] = useState(false)

  const handleBuildRitual = () => {
    router.push("/in/body-hands")
  }

  const handleShopSet = () => {
    router.push("in/gift-sets")
  }

  return (
    <section className="relative h-[85vh] md:h-auto md:py-12 lg:py-20 bg-black md:bg-[#e3e3d8] mb-1 md:mb-0">
      <div className="flex flex-col md:flex-row h-full">
        {/* Image - Background on mobile, Right Side on desktop */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="absolute inset-0 z-0 h-full w-full md:relative md:w-[60%] md:order-2"
        >
          {/* Mobile Image Container - Full Screen */}
          <div className="h-full w-full md:hidden">
            <img
              src="/assets/handwashImg.png"
              alt="Jardin Botanica handwash with natural bristle brush"
              className="w-full h-full object-cover opacity-80"
              style={{ objectPosition: "center" }}
            />
            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          </div>

          {/* Desktop Image Container - Original Layout */}
          <div className="hidden md:block h-[40vh] md:h-[60vh] overflow-hidden relative">
            <motion.img
              src="/assets/handwashImg.png"
              alt="Jardin Botanica handwash with natural bristle brush"
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.03 }}
              animate={{ scale: isPressed ? 1.03 : 1 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              onTouchStart={() => setIsPressed(true)}
              onTouchEnd={() => setIsPressed(false)}
              onTouchCancel={() => setIsPressed(false)}
            />
          </div>
        </motion.div>

        {/* Content - Overlay on mobile, Left Side on desktop */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="absolute bottom-0 left-0 right-0 z-10 w-full px-6 pb-12 md:relative md:w-2/5 md:flex md:flex-col md:justify-center md:px-6 md:pl-20 md:pr-16 md:py-17 md:bg-transparent"
        >
          {/* Main Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="font-american-typewriter text-3xl md:text-3xl lg:text-4xl tracking-tight mb-4 text-white md:text-black leading-tight"
          >
            The Botanist's Hand Ritual
          </motion.h2>

          {/* Main Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="font-din-arabic text-base md:text-lg text-white/90 md:text-black/70 leading-relaxed mb-8 md:mb-12 max-w-md"
          >
            Clean that isn't squeaky; softness that isn't sticky.
            <br />
            Our signature hand care ritual combines purifying botanicals with protective
            nourishment.
          </motion.p>

          {/* Dual CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-3 md:gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBuildRitual}
              className="font-din-arabic px-6 py-4 md:py-3 md:px-8 bg-transparent border border-white/60 md:border-black/30 text-white md:text-black hover:bg-white hover:text-black md:hover:bg-black md:hover:text-white transition-all duration-300 tracking-wide text-sm md:text-base backdrop-blur-sm md:backdrop-blur-none"
            >
              Build Your Ritual
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleShopSet}
              className="font-din-arabic px-6 py-4 md:py-3 md:px-8 bg-transparent border border-white/60 md:border-black/30 text-white md:text-black hover:bg-white hover:text-black md:hover:bg-black md:hover:text-white transition-all duration-300 tracking-wide text-sm md:text-base backdrop-blur-sm md:backdrop-blur-none"
            >
              Shop the Set
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
