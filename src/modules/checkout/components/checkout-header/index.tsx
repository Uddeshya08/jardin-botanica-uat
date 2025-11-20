"use client"

import { Package } from "lucide-react"
import { motion } from "framer-motion"

export default function CheckoutHeader() {
  return (
    <div className="text-center mb-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-black/10 backdrop-blur-sm mb-4"
      >
        <Package className="w-8 h-8" />
      </motion.div>
      <h1 className="font-american-typewriter text-xl sm:text-2xl md:text-3xl mb-2">
        Complete Your Order
      </h1>
      <p className="font-din-arabic text-xs sm:text-sm text-black/60">
        A few steps away from botanical bliss
      </p>
    </div>
  )
}

