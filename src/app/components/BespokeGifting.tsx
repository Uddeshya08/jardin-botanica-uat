"use client"
import React from "react"
import { motion } from "motion/react"

export function BespokeGifting() {
  return (
    <section className="pt-20 pb-0" style={{ backgroundColor: "#e3e3d8" }}>
      <div className="flex">
        {/* Image - Left Side (60% width) */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="w-3/5 relative"
        >
          <motion.div className="h-[70vh] overflow-hidden">
            <motion.div
              whileHover={{ scale: 1.05 }}
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

        {/* Content - Right Side (40% width) */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="w-2/5 flex flex-col justify-center px-12 py-12"
        >
          {/* Main Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="font-american-typewriter text-3xl lg:text-4xl tracking-tight mb-8 text-black leading-tight"
          >
            Bespoke Experiences
          </motion.h2>

          {/* Main Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="font-din-arabic text-lg text-black/70 leading-relaxed mb-8"
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
            className="font-din-arabic text-lg text-black/70 leading-relaxed mb-12"
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
              className="font-din-arabic px-8 py-3 bg-transparent border border-black/30 text-black hover:bg-black hover:text-white transition-all duration-300 tracking-wide"
            >
              Begin Consultation
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
