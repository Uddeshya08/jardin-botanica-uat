"use client"
import React from "react"
import { motion } from "motion/react"

export function BespokeGifting() {
  return (
    <section className="pt-8 md:pt-12 lg:pt-20 pb-0" style={{ backgroundColor: "#e3e3d8" }}>
      <div className="flex flex-col-reverse md:flex-row">
        {/* Image - Left Side (60% width on desktop, full width on mobile) */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="w-full md:w-3/5 relative"
        >
          <motion.div className="h-[40vh] md:h-[60vh] lg:h-[70vh] overflow-hidden">
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.9 }}
            >
              <img
                src="/assets/first.png"
                alt="Hands holding botanical book with oranges and plants"
                className="w-full h-full object-contain"
              />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Content - Right Side (40% width on desktop, full width on mobile) */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="w-full md:w-2/5 flex flex-col justify-center px-6 py-8 md:px-12 md:py-12"
        >
          {/* Main Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="font-american-typewriter text-2xl md:text-3xl lg:text-4xl tracking-tight mb-6 md:mb-8 text-black leading-tight"
          >
            Bespoke Experiences
          </motion.h2>

          {/* Main Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="font-din-arabic text-base md:text-lg text-black/70 leading-relaxed mb-6 md:mb-8"
          >
            Every detail leaves an impression. We help you create tailored
            offerings with curated selections and artisan finishing.
          </motion.p>

          {/* Personal Consultation Text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="font-din-arabic text-base md:text-lg text-black/70 leading-relaxed mb-8 md:mb-12"
          >
            Our specialists design solutions aligned with your brand, your
            ideas, and the moments you want to elevate.
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
              className="font-din-arabic px-6 py-3 md:px-8 bg-transparent border border-black/30 text-black hover:bg-black hover:text-white transition-all duration-300 tracking-wide text-sm md:text-base"
            >
              Begin Consultation
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}