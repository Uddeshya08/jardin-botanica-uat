"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

type ProductTitleTooltipProps = {
  title: string
  children: React.ReactNode
}

export const ProductTitleTooltip = ({ title, children }: ProductTitleTooltipProps) => {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="relative inline-block">
      <div onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)}>
        {children}
      </div>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: -4 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-0 mb-2 z-50 pointer-events-none"
          >
            <div className="bg-black/90 backdrop-blur-sm text-white text-xs font-din-arabic px-3 py-2 rounded-lg shadow-xl whitespace-nowrap border border-white/10">
              {title}
              {/* Arrow */}
              <div className="absolute top-full left-4 w-2 h-2 bg-black/90 border-r border-b border-white/10 transform rotate-45 -translate-y-1/2" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
