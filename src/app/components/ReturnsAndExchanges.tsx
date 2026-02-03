"use client"

import { motion } from "motion/react"
import React from "react"

export function ReturnsAndExchanges() {
  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 lg:px-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="pt-8 mb-16 text-center flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-american-typewriter text-3xl mb-6 text-black">Returns & Exchanges</h1>
          <div className="h-px w-20 bg-black/15"></div>
        </motion.div>

        {/* Introduction */}
        <motion.div
          className="mb-16 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p className="font-din-arabic text-black/65 leading-relaxed text-center">
            At Jardin Botanica, each product is crafted and packaged with care. For reasons of
            safety, hygiene, and quality assurance, we cannot accept returns or exchanges once a
            product has been opened or used.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-10 mb-16">
          {/* Damaged or Defective Items */}
          <motion.div
            className="p-8 border border-black/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="mb-6">
              <h2 className="font-american-typewriter text-lg text-black font-bold mb-2">
                Damaged or Defective Items
              </h2>
              <div className="h-px w-12 bg-black/20"></div>
            </div>
            <p className="font-din-arabic text-black/70 leading-relaxed mb-6">
              We only accept returns in the rare case that an item arrives damaged or defective.
            </p>
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full border border-black/20 flex items-center justify-center mt-0.5">
                  <span className="font-din-arabic text-black/60 text-xs">1</span>
                </div>
                <p className="font-din-arabic text-black/70 leading-relaxed">
                  Contact us within <span className="text-black font-din-arabic-bold">7 days</span>{" "}
                  of delivery
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full border border-black/20 flex items-center justify-center mt-0.5">
                  <span className="font-din-arabic text-black/60 text-xs">2</span>
                </div>
                <p className="font-din-arabic text-black/70 leading-relaxed">
                  Include order details and photographs
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full border border-black/20 flex items-center justify-center mt-0.5">
                  <span className="font-din-arabic text-black/60 text-xs">3</span>
                </div>
                <p className="font-din-arabic text-black/70 leading-relaxed">
                  We'll arrange replacement or refund
                </p>
              </div>
            </div>
          </motion.div>

          {/* Non-Returnable Items */}
          <motion.div
            className="p-8 border border-black/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="mb-6">
              <h2 className="font-american-typewriter text-lg text-black font-bold mb-2">
                Non-Returnable Items
              </h2>
              <div className="h-px w-12 bg-black/20"></div>
            </div>
            <p className="font-din-arabic text-black/70 leading-relaxed mb-6">
              We do not accept returns for reasons of personal preference or change of mind.
            </p>
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 py-2 border-b border-black/6">
                <div className="w-1.5 h-1.5 rounded-full bg-black/30"></div>
                <p className="font-din-arabic text-black/70 leading-relaxed">Candles</p>
              </div>
              <div className="flex items-center gap-3 py-2 border-b border-black/6">
                <div className="w-1.5 h-1.5 rounded-full bg-black/30"></div>
                <p className="font-din-arabic text-black/70 leading-relaxed">
                  Hand washes & lotions
                </p>
              </div>
              <div className="flex items-center gap-3 py-2 border-b border-black/6">
                <div className="w-1.5 h-1.5 rounded-full bg-black/30"></div>
                <p className="font-din-arabic text-black/70 leading-relaxed">Body washes</p>
              </div>
              <div className="flex items-center gap-3 py-2">
                <div className="w-1.5 h-1.5 rounded-full bg-black/30"></div>
                <p className="font-din-arabic text-black/70 leading-relaxed">Fragrance diffusers</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quality Note */}
        <motion.div
          className="max-w-3xl mx-auto mb-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p className="font-din-arabic text-black/55 leading-relaxed italic">
            While candles may seem returnable if unused, their delicate packaging often does not
            withstand transit twice, and we want every customer to experience their product in
            perfect condition.
          </p>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          className="max-w-3xl mx-auto text-center pt-12 pb-12 border-t border-b border-black/8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="mb-5">
            <h2 className="font-american-typewriter text-lg text-black font-bold">
              Questions or Concerns?
            </h2>
          </div>
          <p className="font-din-arabic text-black/65 leading-relaxed mb-8 max-w-2xl mx-auto">
            If you ever have a concern about your order — whether or not it falls within this policy
            — please write to us.
          </p>
          <a
            href="mailto:hello@jardinbotanica.com"
            className="inline-block font-din-arabic text-black border border-black/20 px-8 py-3 hover:bg-black hover:text-white transition-all duration-300"
          >
            hello@jardinbotanica.com
          </a>
          <p className="font-din-arabic text-black/50 leading-relaxed mt-6">
            We will always do what we can to ensure your experience with Jardin Botanica is a happy
            one.
          </p>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <div className="text-center">
            <p className="font-din-arabic text-black/40">Thank you for choosing us</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
