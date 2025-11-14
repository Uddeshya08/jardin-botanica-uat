import React from 'react';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function DesignPhilosophy() {
  return (
    <section 
      className="py-20 lg:py-32"
      style={{ backgroundColor: '#edede2' }}
    >
      <div className="container mx-auto px-8 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image on Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative group cursor-pointer"
          >
            <div className="aspect-[4/3] overflow-hidden relative rounded-sm">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
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

          {/* Content on Right */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
            {/* Small Label */}
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

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h2 className="font-american-typewriter text-3xl lg:text-4xl tracking-tight text-black leading-tight">
                From Kyoto's moss gardens to Kew's glasshouses
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
              <p className="font-din-arabic text-lg text-black/75 leading-relaxed max-w-lg">
                We study living collections and translate them into disciplined blends measured actives, climate-smart bases. Design carries it home the weight in your palm, the arc of a pump, the soft dry-down turning daily gestures into deliberate pleasure.
              </p>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.button 
                className="font-din-arabic inline-flex items-center px-8 py-3 bg-transparent border border-black/30 text-black hover:bg-black hover:text-white transition-all duration-300 tracking-wide group"
              >
                Explore more
                <motion.span 
                  className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </motion.span>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}