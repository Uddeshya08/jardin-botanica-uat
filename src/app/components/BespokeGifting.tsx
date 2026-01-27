"use client"
import { motion } from "motion/react"
import React, { useState } from "react"

export function BespokeGifting() {
  const [isPressed, setIsPressed] = useState(false)

  const handleBeginConsultation = () => {
    const email = "hello@jardinbotanica.com"
    const subject = "Business Enquiry"
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}`
  }

  return (
    <section className="relative h-[85vh] md:h-auto md:pb-0 bg-black md:bg-[#edede2]">
      <div className="flex flex-col-reverse md:flex-row h-full">
        {/* Image - Background on mobile, Left Side on desktop */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="absolute inset-0 z-0 h-full w-full md:relative md:w-3/5 md:pb-12 md:order-1"
        >
          {/* Mobile Image Container - Full Screen */}
          <div className="relative h-full w-full md:hidden">
            <div className="absolute inset-0 bg-black/60 z-10" />
            <img
              src="/assets/first.png"
              alt="Hands holding botanical book with oranges and plants"
              className="w-full h-full object-cover"
              style={{ objectPosition: "center" }}
            />
            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-20" />
          </div>

          {/* Desktop Image Container */}
          <div className="hidden md:block h-[40vh] md:h-[60vh] lg:h-[70vh] overflow-hidden relative">
            <motion.div
              whileHover={{ scale: 1.03 }}
              animate={{ scale: isPressed ? 1.03 : 1 }}
              transition={{ duration: 0.9 }}
              onTouchStart={() => setIsPressed(true)}
              onTouchEnd={() => setIsPressed(false)}
              onTouchCancel={() => setIsPressed(false)}
            >
              <img
                src="/assets/first.png"
                alt="Hands holding botanical book with oranges and plants"
                className="w-full h-full object-contain"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Content - Overlay on mobile, Right Side on desktop */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="absolute bottom-0 left-0 right-0 z-10 w-full px-6 pb-12 md:relative md:w-2/5 md:flex md:flex-col md:justify-center md:px-12 md:py-16 md:bg-transparent md:order-2"
        >
          {/* Main Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="font-american-typewriter text-2xl md:text-3xl lg:text-4xl tracking-tight mb-4 text-white md:text-black leading-tight"
          >
            Bespoke Experiences
          </motion.h2>

          {/* Main Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="font-din-arabic text-base md:text-lg text-white/90 md:text-black/70 leading-relaxed mb-6 md:mb-8"
          >
            Every detail leaves an impression. We help you create tailored offerings with curated
            selections and artisan finishing.
          </motion.p>

          {/* Personal Consultation Text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="font-din-arabic text-base md:text-lg text-white/90 md:text-black/70 leading-relaxed mb-8 md:mb-12"
          >
            Our specialists design solutions aligned with your brand, your ideas, and the moments
            you want to elevate.
          </motion.p>

          {/* Bottom Link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBeginConsultation}
              className="font-din-arabic w-full md:w-auto px-6 py-4 md:py-3 md:px-8 bg-transparent border border-white/60 md:border-black/30 text-white md:text-black hover:bg-white hover:text-black md:hover:bg-black md:hover:text-white transition-all duration-300 tracking-wide text-sm md:text-base backdrop-blur-sm md:backdrop-blur-none"
            >
              Begin Consultation
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}