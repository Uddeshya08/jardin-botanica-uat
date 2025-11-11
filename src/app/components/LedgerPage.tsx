"use client"

import React, { useMemo, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Heart, ShoppingBag, X, ChevronLeft } from "lucide-react"
import { toast } from "sonner"

import { useLedger, LedgerItem } from "app/context/ledger-context"
import { ImageWithFallback } from "./figma/ImageWithFallback"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Label } from "./ui/label"

interface LedgerPageProps {
  onAddToCart?: (item: any) => void
  onBack: () => void
}

const getPriceForSize = (item: LedgerItem, size: string) => {
  if (size === "250ml" && typeof (item as any).price250ml === "number") {
    return (item as any).price250ml
  }
  if (size === "500ml" && typeof (item as any).price500ml === "number") {
    return (item as any).price500ml
  }
  return item.price
}

export function LedgerPage({ onAddToCart, onBack }: LedgerPageProps) {
  const { ledger, removeFromLedger } = useLedger()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [selectedItem, setSelectedItem] = useState<LedgerItem | null>(null)

  const sortedLedger = useMemo(
    () =>
      [...ledger].sort((a, b) => a.name.localeCompare(b.name)),
    [ledger]
  )

  const handleAddToCart = (item: LedgerItem) => {
    const sizeOptions: string[] | undefined = (item as any).availableSizes

    if (sizeOptions && sizeOptions.length > 0) {
      setSelectedItem(item)
      setSelectedSize(sizeOptions[0])
      setIsDialogOpen(true)
      return
    }

    processAddToCart(item, (item as any).size)
  }

  const processAddToCart = (item: LedgerItem, size?: string) => {
    if (!onAddToCart) {
      return
    }

    const finalSize = size ?? (item as any).size
    const price = finalSize ? getPriceForSize(item, finalSize) : item.price

    const cartItem = {
      id: finalSize ? `${item.id}-${finalSize}` : item.id,
      name: finalSize ? `${item.name} (${finalSize})` : item.name,
      price,
      size: finalSize,
      quantity: 1,
      image: item.image,
    }

    onAddToCart(cartItem)
    toast.success(`${item.name} Added To Cart`, { duration: 2000 })
  }

  const handleConfirmAddToCart = () => {
    if (selectedItem && selectedSize) {
      processAddToCart(selectedItem, selectedSize)
    }
    setIsDialogOpen(false)
    setSelectedItem(null)
  }

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: "#e3e3d8" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-24 sm:pt-32 mb-8 sm:mb-12"
        >
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={onBack}
            className="flex items-center space-x-2 mb-6 sm:mb-8 group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-din-arabic text-sm sm:text-base">Continue Shopping</span>
          </motion.button>
          <div className="flex items-center space-x-3 sm:space-x-4 mb-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 flex items-center justify-center"
            >
              <Heart className="w-6 h-6 sm:w-8 sm:h-8 fill-current" style={{ color: "#e58a4d" }} />
            </motion.div>
            <div>
              <h1 className="font-american-typewriter text-xl sm:text-2xl" style={{ letterSpacing: "0.05em" }}>
                Your Ledger
              </h1>
              <p className="font-din-arabic text-xs sm:text-sm text-black/60" style={{ letterSpacing: "0.1em" }}>
                {sortedLedger.length} {sortedLedger.length === 1 ? "item" : "items"} saved
              </p>
            </div>
          </div>
        </motion.div>

        {/* Ledger Grid */}
        {sortedLedger.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 sm:py-20 px-4"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 rounded-full bg-gradient-to-br from-black/5 to-black/10 flex items-center justify-center"
            >
              <Heart className="w-10 h-10 sm:w-12 sm:h-12 text-black/30" />
            </motion.div>
            <p
              className="font-din-arabic text-sm sm:text-base text-black/60 mb-6 sm:mb-8 max-w-md mx-auto"
              style={{ letterSpacing: "0.1em" }}
            >
              Nothing here yet. Your Ledger will appear as you wander the Botanist&apos;s Lab.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onBack}
              className="px-6 sm:px-8 py-2.5 sm:py-3 bg-black text-white font-din-arabic text-sm sm:text-base tracking-wide hover:bg-black/90 transition-colors"
              style={{ letterSpacing: "0.1em" }}
            >
              Browse the Collection →
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <AnimatePresence mode="popLayout">
              {sortedLedger.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative bg-white/40 backdrop-blur-sm rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  {/* Remove Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeFromLedger(item.id)}
                    className="absolute top-3 right-3 z-10 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove from ledger"
                  >
                    <Heart className="w-4 h-4 fill-current" style={{ color: "#e58a4d" }} />
                  </motion.button>

                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.4 }}>
                      <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </motion.div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Product Details */}
                  <div className="p-3 sm:p-4">
                    <h3 className="font-american-typewriter text-base sm:text-lg mb-1" style={{ letterSpacing: "0.05em" }}>
                      {item.name}
                    </h3>
                    {item.description && (
                      <p
                        className="font-din-arabic text-xs sm:text-sm text-black/60 mb-2 sm:mb-3 line-clamp-1"
                        style={{ letterSpacing: "0.1em" }}
                      >
                        {item.description}
                      </p>
                    )}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
                      <span className="font-din-arabic text-sm sm:text-base whitespace-nowrap" style={{ letterSpacing: "0.1em" }}>
                        ₹{item.price.toLocaleString()}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAddToCart(item)}
                        className="flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-black text-white rounded-lg font-din-arabic text-xs sm:text-sm hover:bg-black/90 transition-colors whitespace-nowrap w-full sm:w-auto justify-center"
                        style={{ letterSpacing: "0.1em" }}
                      >
                        <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>Add to Cart</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Summary Section */}
        {sortedLedger.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 sm:mt-12 p-6 sm:p-8 bg-white/40 backdrop-blur-sm rounded-2xl"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
              <div className="flex-1">
                <h3 className="font-american-typewriter text-lg sm:text-xl mb-1 sm:mb-2" style={{ letterSpacing: "0.05em" }}>
                  Continue Exploring
                </h3>
                <p className="font-din-arabic text-xs sm:text-sm text-black/60" style={{ letterSpacing: "0.1em" }}>
                  Discover more botanical treasures to add to your collection
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onBack}
                className="px-6 sm:px-8 py-2.5 sm:py-3 bg-black text-white font-din-arabic text-sm sm:text-base tracking-wide hover:bg-black/90 transition-colors w-full sm:w-auto"
                style={{ letterSpacing: "0.1em" }}
              >
                Browse Products
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Size Selection Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] border-black/20" style={{ backgroundColor: "#e3e3d8" }}>
          <DialogHeader>
            <DialogTitle className="font-american-typewriter tracking-tight text-black" style={{ letterSpacing: "0.05em" }}>
              {selectedItem?.name}
            </DialogTitle>
            {selectedItem?.description && (
              <DialogDescription className="font-din-arabic text-black/70 leading-relaxed pt-2" style={{ letterSpacing: "0.1em" }}>
                {selectedItem.description}
              </DialogDescription>
            )}
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Size Selection */}
            <div className="space-y-3">
              <h3 className="font-din-arabic text-sm tracking-wider uppercase" style={{ color: "#a28b6f", letterSpacing: "0.15em" }}>
                Select Size
              </h3>
              <RadioGroup value={selectedSize} onValueChange={setSelectedSize} className="flex flex-col gap-3">
                {(selectedItem as any)?.availableSizes?.map((size: string) => (
                  <div
                    key={size}
                    className="flex items-center space-x-3 p-4 border border-black/20 hover:border-black/40 transition-colors cursor-pointer rounded-sm bg-white/30"
                  >
                    <RadioGroupItem value={size} id={`size-${size}`} className="border-black/30 text-black" />
                    <Label
                      htmlFor={`size-${size}`}
                      className="flex-1 font-din-arabic text-black cursor-pointer flex justify-between items-center"
                      style={{ letterSpacing: "0.1em" }}
                    >
                      <span>{size}</span>
                      <span>₹{getPriceForSize(selectedItem!, size).toLocaleString()}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsDialogOpen(false)}
              className="font-din-arabic px-6 py-3 border border-black/30 text-black hover:bg-black/5 transition-all duration-300 tracking-wide flex-1 sm:flex-initial"
              style={{ letterSpacing: "0.1em" }}
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleConfirmAddToCart}
              className="font-din-arabic px-6 py-3 bg-black text-white hover:bg-black/90 transition-all duration-300 tracking-wide flex-1 sm:flex-initial"
              style={{ letterSpacing: "0.1em" }}
            >
              Add to Cart
            </motion.button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}



