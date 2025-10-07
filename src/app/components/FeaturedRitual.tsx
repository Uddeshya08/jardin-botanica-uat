import React from 'react'
import { motion } from 'motion/react'
import { ImageWithFallback } from './figma/ImageWithFallback'

// const ritualOptions = [
//   {
//     id: 1,
//     title: "Polish and Veil",
//     subtitle: "The Complete Hand Care Ritual",
//     description: "Two steps. One secret. A ritual hidden in plain sight.",
//     features: [
//       "Black Tea Hand Wash - Purifying botanical cleanse",
//       "Soft Orris Hand Lotion - Protective daily nourishment",
//       "Complete ritual packaging with instruction card"
//     ],
//     price: "$85",
//     imageUrl: handwashImage,
//     imagePosition: "right"
//   },
//   {
//     id: 2,
//     title: "Botanical Candles",
//     subtitle: "Ambient Aromatherapy Collection",
//     description: "Wax, flame, and something unseen. A sanctuary revealed only in glow.",
//     features: [
//       "Garden Mint & Wild Bergamot - Energizing morning blend",
//       "Evening Jasmine & Cedar - Calming nighttime ritual",
//       "Clean burning botanical wax with 60-hour burn time"
//     ],
//     price: "$95",
//     imageUrl: candleImage,
//     imagePosition: "left"
//   }
// ];

export function FeaturedRitual() {
  return (
    <section className="py-12 lg:py-20" style={{ backgroundColor: '#e3e3d8' }}>
      <div className="flex">
        {/* Content - Left Side (40% width) */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="w-2/5 flex flex-col justify-center px-16 py-17"
        >
          {/* Main Title - The Botanist's Hand Ritual */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="font-american-typewriter text-3xl lg:text-4xl tracking-tight mb-8 text-black leading-tight"
          >
            The Botanist's Hand Ritual
          </motion.h2>

          {/* Main Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="font-din-arabic text-lg text-black/70 leading-relaxed mb-12"
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
            className="flex flex-col sm:flex-row gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="font-din-arabic px-8 py-3 bg-transparent border border-black/30 text-black hover:bg-black hover:text-white transition-all duration-300 tracking-wide"
            >
              Build Your Ritual
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="font-din-arabic px-8 py-3 bg-transparent border border-black/30 text-black hover:bg-black hover:text-white transition-all duration-300 tracking-wide"
            >
              Shop the Set
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Image - Right Side (60% width) */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative"
          style={{width: "60%"}}
        >
          {/* Fixed-size container */}
          <div className="h-[60vh] overflow-hidden">
            {/* Image zooms inside container */}
            <motion.img
              src="/assets/handwashImg.png"
              alt="Jardin Botanica handwash with natural bristle brush"
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
