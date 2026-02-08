import { motion } from "motion/react"
import Link from "next/link"
import React, { useState } from "react"
import { ImageWithFallback } from "./figma/ImageWithFallback"

export function DesignPhilosophy() {
  const [isPressed, setIsPressed] = useState(false)

  return (
    <section className="pt-12 lg:pt-16 pb-0" style={{ backgroundColor: "#edede2" }}>
      <div className="w-full md:container md:mx-auto px-0 md:px-8 lg:px-16">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Heading Section - First on mobile */}
          <div className="space-y-6 md:space-y-8 px-8 md:px-0 order-1 lg:hidden pb-4 md:pb-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <p className="font-din-arabic text-sm tracking-widest text-black/50 uppercase">
                Design Philosophy
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h2 className="font-american-typewriter text-2xl md:text-3xl lg:text-4xl tracking-tight mb-6 md:mb-8 text-black leading-tight">
                From Kyoto’s Moss Gardens to Kew’s Glasshouses
              </h2>
            </motion.div>
          </div>

          {/* Image - Second on mobile (between heading and description), First column on desktop */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative group cursor-pointer order-2 lg:order-1 w-full"
          >
            <div className="aspect-[4/3] overflow-hidden relative rounded-none md:rounded-sm">
              <motion.div
                whileHover={{ scale: 1.05 }}
                animate={{ scale: isPressed ? 1.05 : 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                onTouchStart={() => setIsPressed(true)}
                onTouchEnd={() => setIsPressed(false)}
                onTouchCancel={() => setIsPressed(false)}
                className="w-full h-full"
              >
                <img
                  src="/assets/second.png"
                  alt="Botanical glass greenhouse with palm fronds"
                  className="w-full h-full object-cover transition-all duration-600 group-hover:brightness-110"
                />
              </motion.div>

              {/* Subtle overlay that appears on hover */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 bg-black/10 pointer-events-none"
              />

              {/* Elegant corner accent */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="absolute top-4 right-4 w-3 h-3 border-t-2 border-r-2 border-white/60"
              />
            </div>
          </motion.div>

          {/* Content Section - Third on mobile (description + button), Second column on desktop (heading + description + button) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-8 px-8 md:px-0 order-3 lg:order-2"
          >
            {/* Small Label - Hidden on mobile, shown on desktop */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="hidden lg:block"
            >
              <p className="font-din-arabic text-sm tracking-widest text-black/50 uppercase">
                Design Philosophy
              </p>
            </motion.div>

            {/* Main Heading - Hidden on mobile, shown on desktop */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="hidden lg:block"
            >
              <h2 className="font-american-typewriter text-2xl md:text-3xl lg:text-4xl tracking-tight mb-4 text-black leading-tight">
                From Kyoto’s Moss Gardens to Kew’s Glasshouses
              </h2>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <p className="font-american-typewriter text-lg text-black/75 leading-relaxed max-w-lg">
                We study living collections and translate them into disciplined blends measured
                actives, climate-smart bases. Design carries it home the weight in your palm, the
                arc of a pump, the soft dry-down turning daily gestures into deliberate pleasure.
              </p>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <Link href="/the-lab" passHref>
                <motion.button className="font-din-arabic inline-flex items-center px-8 py-3 bg-transparent border border-black/30 text-black hover:bg-black hover:text-white transition-all duration-300 tracking-wide group">
                  Explore more
                  <motion.span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </motion.span>
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
