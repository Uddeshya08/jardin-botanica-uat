import React, { useState } from 'react'
import { motion } from 'motion/react'

export function FeaturedRitual() {
  const [isPressed, setIsPressed] = useState(false);
  
  return (
    <section className="py-8 md:py-12 lg:py-20" style={{ backgroundColor: '#e3e3d8' }}>
      <div className="flex flex-col md:flex-row">
        {/* Content - Left Side (40% width on desktop, full width on mobile) */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="w-full md:w-2/5 flex flex-col justify-center px-6 py-8 md:px-16 md:py-17"
        >
          {/* Main Title - The Botanist's Hand Ritual */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="font-american-typewriter text-2xl md:text-3xl lg:text-4xl tracking-tight mb-6 md:mb-8 text-black leading-tight"
          >
            The Botanist's Hand Ritual
          </motion.h2>

          {/* Main Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="font-din-arabic text-base md:text-lg text-black/70 leading-relaxed mb-8 md:mb-12"
          >
            Clean that isn't squeaky; softness that isn't sticky.
            <br />
            Our signature hand care ritual combines purifying botanicals with
            protective nourishment.
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
              className="font-din-arabic px-6 py-3 md:px-8 bg-transparent border border-black/30 text-black hover:bg-black hover:text-white transition-all duration-300 tracking-wide text-sm md:text-base"
            >
              Build Your Ritual
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="font-din-arabic px-6 py-3 md:px-8 bg-transparent border border-black/30 text-black hover:bg-black hover:text-white transition-all duration-300 tracking-wide text-sm md:text-base"
            >
              Shop the Set
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Image - Right Side (60% width on desktop, full width on mobile) */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative w-full md:w-[60%]"
        >
          {/* Fixed-size container */}
          <div className="h-[40vh] md:h-[60vh] overflow-hidden">
            {/* Image zooms inside container */}
            <motion.img
              src="/assets/handwashImg.png"
              alt="Jardin Botanica handwash with natural bristle brush"
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.03 }}
              animate={{ scale: isPressed ? 1.03 : 1 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              onTouchStart={() => setIsPressed(true)}
              onTouchEnd={() => setIsPressed(false)}
              onTouchCancel={() => setIsPressed(false)}
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}