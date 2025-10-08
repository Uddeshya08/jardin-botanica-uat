'use client'

import React from 'react'
import { motion } from 'motion/react'

export function ReturnsAndExchanges() {
  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 lg:px-20" style={{ backgroundColor: '#f8f8f8' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          className="pt-8 mb-16 text-center flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-american-typewriter text-4xl md:text-5xl mb-6 text-black">
            Returns & Exchanges
          </h1>
          <div className="h-px w-24 bg-black/20 mb-6"></div>
          <p className="font-din-arabic text-black/60 tracking-wide text-sm">
            Last updated: October 8, 2025
          </p>
        </motion.div>

        {/* Introduction */}
        <motion.div
          className="mb-12 max-w-3xl mx-auto bg-white shadow-sm p-8 md:p-10"
          style={{ border: '1px solid rgba(0,0,0,0.06)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p className="font-din-arabic text-black/70 leading-relaxed text-center text-base">
            At Jardin Botanica, each product is crafted and packaged with care. For reasons of safety, hygiene, and quality assurance, we cannot accept returns or exchanges once a product has been opened or used.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-12">
          {/* Damaged or Defective Items */}
          <motion.div
            className="p-8 md:p-10 bg-white shadow-sm"
            style={{ border: '1px solid rgba(0,0,0,0.06)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="mb-6">
              <h2 className="font-american-typewriter text-xl md:text-2xl text-black mb-3">
                Damaged or Defective Items
              </h2>
              <div className="h-px w-16 bg-black/20"></div>
            </div>
            <p className="font-din-arabic text-black/70 leading-relaxed mb-8 text-base">
              We only accept returns in the rare case that an item arrives damaged or defective.
            </p>
            <div className="space-y-5 pt-2">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-black/20 flex items-center justify-center mt-0.5">
                  <span className="font-din-arabic text-black/60 text-sm font-medium">1</span>
                </div>
                <p className="font-din-arabic text-black/70 leading-relaxed pt-1">
                  Contact us within <span className="text-black font-medium">7 days</span> of delivery
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-black/20 flex items-center justify-center mt-0.5">
                  <span className="font-din-arabic text-black/60 text-sm font-medium">2</span>
                </div>
                <p className="font-din-arabic text-black/70 leading-relaxed pt-1">
                  Include order details and photographs
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-black/20 flex items-center justify-center mt-0.5">
                  <span className="font-din-arabic text-black/60 text-sm font-medium">3</span>
                </div>
                <p className="font-din-arabic text-black/70 leading-relaxed pt-1">
                  We'll arrange replacement or refund
                </p>
              </div>
            </div>
          </motion.div>

          {/* Non-Returnable Items */}
          <motion.div
            className="p-8 md:p-10 bg-white shadow-sm"
            style={{ border: '1px solid rgba(0,0,0,0.06)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="mb-6">
              <h2 className="font-american-typewriter text-xl md:text-2xl text-black mb-3">
                Non-Returnable Items
              </h2>
              <div className="h-px w-16 bg-black/20"></div>
            </div>
            <p className="font-din-arabic text-black/70 leading-relaxed mb-8 text-base">
              We do not accept returns for reasons of personal preference or change of mind.
            </p>
            <div className="space-y-0 pt-2">
              <div className="flex items-center gap-4 py-4 border-b border-black/8">
                <div className="w-2 h-2 rounded-full bg-black/30"></div>
                <p className="font-din-arabic text-black/70 leading-relaxed">
                  Candles
                </p>
              </div>
              <div className="flex items-center gap-4 py-4 border-b border-black/8">
                <div className="w-2 h-2 rounded-full bg-black/30"></div>
                <p className="font-din-arabic text-black/70 leading-relaxed">
                  Hand washes & lotions
                </p>
              </div>
              <div className="flex items-center gap-4 py-4 border-b border-black/8">
                <div className="w-2 h-2 rounded-full bg-black/30"></div>
                <p className="font-din-arabic text-black/70 leading-relaxed">
                  Body washes
                </p>
              </div>
              <div className="flex items-center gap-4 py-4">
                <div className="w-2 h-2 rounded-full bg-black/30"></div>
                <p className="font-din-arabic text-black/70 leading-relaxed">
                  Fragrance diffusers
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quality Note */}
        <motion.div
          className="max-w-3xl mx-auto mb-12 bg-white shadow-sm p-8 md:p-10"
          style={{ border: '1px solid rgba(0,0,0,0.06)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p className="font-din-arabic text-black/60 leading-relaxed italic text-center">
            While candles may seem returnable if unused, their delicate packaging often does not withstand transit twice, and we want every customer to experience their product in perfect condition.
          </p>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          className="max-w-3xl mx-auto bg-white shadow-sm p-10 md:p-12"
          style={{ border: '1px solid rgba(0,0,0,0.06)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="text-center">
            <div className="mb-6">
              <h2 className="font-american-typewriter text-2xl md:text-3xl text-black mb-3">
                Questions or Concerns?
              </h2>
              <div className="h-px w-16 bg-black/20 mx-auto"></div>
            </div>
            <p className="font-din-arabic text-black/70 leading-relaxed mb-8 max-w-2xl mx-auto text-base">
              If you ever have a concern about your order — whether or not it falls within this policy — please write to us.
            </p>
            <a 
              href="mailto:hello@jardinbotanica.com" 
              className="inline-block font-din-arabic text-black border-2 border-black/20 px-8 py-3 hover:bg-black hover:text-white hover:border-black transition-all duration-300"
            >
              hello@jardinbotanica.com
            </a>
            <p className="font-din-arabic text-black/50 leading-relaxed mt-8">
              We will always do what we can to ensure your experience with Jardin Botanica is a happy one.
            </p>
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.div 
          className="mt-20 md:mt-32"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <div className="text-center space-y-6 py-12 bg-white shadow-sm" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-12 bg-black/10"></div>
              <span className="font-din-arabic text-black/30 text-xs">●</span>
              <div className="h-px w-12 bg-black/10"></div>
            </div>
            <p className="font-din-arabic text-black/50 tracking-wide text-sm">
              Thank you for choosing Jardin Botanica
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

