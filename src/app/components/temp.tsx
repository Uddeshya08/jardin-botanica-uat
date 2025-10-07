"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Plus,
  Home,
  ChevronRight as BreadcrumbChevron,
} from "lucide-react"
import { InfoPanel } from "./InfoPanel"
import { addToCartAction } from "@lib/actions/cart-actions" // <-- Server Action

interface CartItem {
  id: string
  name: string
  price: number // minor units
  quantity: number
  image?: string
}

interface ProductHeroProps {
  product: {
    id: string
    title: string
    subtitle?: string
    description?: string
    thumbnail?: string
    images?: { url: string }[]
    variants: Array<{
      id: string
      calculated_price?: { calculated_amount?: number; currency_code?: string }
    }>
  }
  countryCode: string
  onCartUpdate?: (item: CartItem | null) => void
}

export function ProductHero({
  product,
  countryCode,
  onCartUpdate,
}: ProductHeroProps) {
  const [quantity, setQuantity] = useState(1)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isAddedToCart, setIsAddedToCart] = useState(false)
  const [isRitualPanelOpen, setIsRitualPanelOpen] = useState(false)
  const [isActivesPanelOpen, setIsActivesPanelOpen] = useState(false)
  const [isFragranceNotesOpen, setIsFragranceNotesOpen] = useState(false)
  const [isIngredientsPanelOpen, setIsIngredientsPanelOpen] = useState(false)

  const variant = product.variants?.[0]
  const variantId = variant?.id
  const minorAmount = variant?.calculated_price?.calculated_amount ?? 0

  const fallbackImg = product.thumbnail ?? "/assets/productImage.png"
  const imgs = product.images?.map((i) => i.url).filter(Boolean) ?? []
  const productImages = imgs.length ? imgs : [fallbackImg]

  const handleAddToCart = async () => {
    if (!variantId) return

    try {
      await addToCartAction({
        variantId,
        quantity,
        countryCode, // e.g. "in" from your route segment
      })

      setIsAddedToCart(true)

      // inform parent (for nav badge / sticky cart UI)
      onCartUpdate?.({
        id: variantId,
        name: product.title,
        price: minorAmount,
        quantity,
        image: fallbackImg,
      })

      setTimeout(() => setIsAddedToCart(false), 1600)
    } catch (e) {
      console.error("Add to cart failed:", e)
    }
  }

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity)
    // keep parent UI synced while changing qty (optional)
    if (variantId) {
      onCartUpdate?.({
        id: variantId,
        name: product.title,
        price: minorAmount,
        quantity: newQuantity,
        image: fallbackImg,
      })
    }
  }

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? productImages.length - 1 : prev - 1
    )
  }
  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === productImages.length - 1 ? 0 : prev + 1
    )
  }

  return (
    <div className="flex" style={{ paddingTop: "80px", minHeight: "35vh" }}>
      {/* LEFT: (content) */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full lg:w-[40%] flex items-center justify-center py-12 px-8 lg:px-16 xl:px-20 relative overflow-hidden"
        style={{ backgroundColor: "#e3e3d8" }}
      >
        <div className="space-y-6 max-w-lg relative z-10">
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-american-typewriter text-3xl tracking-tight text-black relative"
            style={{ paddingTop: "8px", paddingBottom: "8px" }}
          >
            <span className="relative">
              {product.title}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="absolute -bottom-2 left-0 h-px w-full origin-left"
                style={{ backgroundColor: "#a28b6f" }}
              />
            </span>
          </motion.h1>

          {/* Subtitle */}
          {product.subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="font-din-arabic text-lg text-black leading-relaxed mb-4"
            >
              {product.subtitle}
            </motion.p>
          )}

          {/* Price */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="space-y-2 pb-4 pt-3"
          >
            <p className="font-din-arabic-bold text-3xl text-black mt-4">
              ₹{minorAmount}
            </p>
          </motion.div>

          {/* QTY + Add */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="space-y-4"
          >
            <h3
              className="font-din-arabic text-sm tracking-wider uppercase"
              style={{ color: "#a28b6f" }}
            >
              QUANTITY
            </h3>
            <div className="flex items-center gap-4">
              <div className="relative">
                <select
                  value={quantity.toString()}
                  onChange={(e) =>
                    handleQuantityChange(parseInt(e.target.value))
                  }
                  className="font-din-arabic appearance-none bg-transparent border border-black/30 px-4 py-3 pr-8 text-black focus:outline-none focus:border-black transition-colors min-w-[80px]"
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={(i + 1).toString()}>
                      {(i + 1).toString()}
                    </option>
                  ))}
                </select>
                <ChevronRight className="absolute right-2 top-1/2 -translate-y-1/2 rotate-90 w-4 h-4 text-black/60 pointer-events-none" />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className="font-din-arabic px-8 py-3 bg-black text-white hover:bg-black/90 transition-all duration-300 tracking-wide relative overflow-hidden"
                disabled={!variantId}
              >
                <AnimatePresence mode="wait">
                  {isAddedToCart ? (
                    <motion.span
                      key="added"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      Added to Cart
                    </motion.span>
                  ) : (
                    <motion.span
                      key="add"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      Add to Cart
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </motion.div>

          {/* Description */}
          {product.description && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="space-y-2 mt-6 mb-6"
            >
              <p className="font-din-arabic text-black/80 leading-relaxed py-4">
                {product.description}
              </p>
            </motion.div>
          )}

          {/* Separator line before Ritual in Practice */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="w-full h-px origin-left"
            style={{ backgroundColor: "rgba(185, 168, 147, 0.22)" }}
          />

          {/* Collapsible Ritual in Practice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="space-y-1"
          >
            <button
              onClick={() => setIsRitualPanelOpen(true)}
              className="flex items-center justify-between w-full py-1 text-left group"
            >
              <span
                className="font-din-arabic text-sm tracking-wider uppercase transition-colors duration-300"
                style={{ color: "#a28b6f" }}
              >
                RITUAL IN PRACTICE
              </span>
              <motion.div
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <Plus
                  className="w-4 h-4 transition-colors duration-300"
                  style={{ color: "#a28b6f" }}
                />
              </motion.div>
            </button>
          </motion.div>

          {/* Separator line before Actives & Key Botanicals */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="w-full h-px origin-left"
            style={{ backgroundColor: "rgba(185, 168, 147, 0.22)" }}
          />

          {/* Collapsible Actives & Key Botanicals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="space-y-1"
          >
            <button
              onClick={() => setIsActivesPanelOpen(true)}
              className="flex items-center justify-between w-full py-1 text-left group"
            >
              <span
                className="font-din-arabic text-sm tracking-wider uppercase transition-colors duration-300"
                style={{ color: "#a28b6f" }}
              >
                ACTIVES & KEY BOTANICALS
              </span>
              <motion.div
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <Plus
                  className="w-4 h-4 transition-colors duration-300"
                  style={{ color: "#a28b6f" }}
                />
              </motion.div>
            </button>
          </motion.div>

          {/* Separator line before Fragrance Notes */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            className="w-full h-px origin-left"
            style={{ backgroundColor: "rgba(185, 168, 147, 0.22)" }}
          />

          {/* Collapsible Fragrance Notes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="space-y-1"
          >
            <button
              onClick={() => setIsFragranceNotesOpen(true)}
              className="flex items-center justify-between w-full py-1 text-left group"
            >
              <span
                className="font-din-arabic text-sm tracking-wider uppercase transition-colors duration-300"
                style={{ color: "#a28b6f" }}
              >
                FRAGRANCE NOTES
              </span>
              <motion.div
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <Plus
                  className="w-4 h-4 transition-colors duration-300"
                  style={{ color: "#a28b6f" }}
                />
              </motion.div>
            </button>
          </motion.div>

          {/* Separator line before Full Ingredients */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.6, delay: 1.5 }}
            className="w-full h-px origin-left"
            style={{ backgroundColor: "rgba(185, 168, 147, 0.22)" }}
          />

          {/* Collapsible Full Ingredients */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.6 }}
            className="space-y-1"
          >
            <button
              onClick={() => setIsIngredientsPanelOpen(true)}
              className="flex items-center justify-between w-full py-1 text-left group"
            >
              <span
                className="font-din-arabic text-sm tracking-wider uppercase transition-colors duration-300"
                style={{ color: "#a28b6f" }}
              >
                FULL INGREDIENTS
              </span>
              <motion.div
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <Plus
                  className="w-4 h-4 transition-colors duration-300"
                  style={{ color: "#a28b6f" }}
                />
              </motion.div>
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* RIGHT: image area */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full lg:w-[60%] relative flex items-center justify-center py-6 overflow-hidden"
        style={{ backgroundColor: "#d6d6c6" }}
      >
        <motion.button
          onClick={handlePrevImage}
          className="absolute left-8 top-1/2 -translate-y-1/2 z-10 p-4 rounded-full text-black/60 hover:text-black transition-all backdrop-blur-sm"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>

        <div className="relative max-w-4xl mx-auto">
          <img
            src={productImages[currentImageIndex]}
            alt={product.title}
            className="w-full h-auto object-contain mx-auto relative z-10"
            style={{
              maxHeight: "500px",
              filter: "drop-shadow(0 20px 45px rgba(0, 0, 0, 0.15))",
            }}
          />
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-8 w-3/4 h-10 rounded-full blur-2xl"
            style={{
              background:
                "radial-gradient(ellipse, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.12) 50%, transparent 100%)",
            }}
          />
        </div>

        <motion.button
          onClick={handleNextImage}
          className="absolute right-8 top-1/2 -translate-y-1/2 z-10 p-4 rounded-full text-black/60 hover:text-black transition-all backdrop-blur-sm"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6" />
        </motion.button>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
          {productImages.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentImageIndex === index ? "w-8" : ""
              }`}
              style={{
                backgroundColor:
                  currentImageIndex === index ? "#a28b6f" : "rgba(0,0,0,0.3)",
              }}
              aria-label={`View image ${index + 1}`}
            />
          ))}
        </div>
      </motion.div>

      {/* Panels */}
      <InfoPanel
        isOpen={isRitualPanelOpen}
        onClose={() => setIsRitualPanelOpen(false)}
        title="RITUAL IN PRACTICE"
      >
        <p className="font-din-arabic text-black/80 leading-relaxed">
          Dispense a measured amount. Work slowly into damp hands, letting the
          exfoliating texture and black tea notes awaken the senses. Rinse away
          — hands refreshed, reset, and primed.
        </p>
      </InfoPanel>
      <InfoPanel
        isOpen={isActivesPanelOpen}
        onClose={() => setIsActivesPanelOpen(false)}
        title="ACTIVES & KEY BOTANICALS"
      >
        <div className="space-y-4">
          <div className="group">
            <span className="font-din-arabic text-black inline">
              Black Tea Extract —{" "}
            </span>
            <span className="font-din-arabic text-black/70 group-hover:text-black transition-colors">
              antioxidant-rich, energizing.
            </span>
          </div>
          <div className="group">
            <span className="font-din-arabic text-black inline">
              Colloidal Oats —{" "}
            </span>
            <span className="font-din-arabic text-black/70 group-hover:text-black transition-colors">
              natural scrubbing agent that lifts impurities gently.
            </span>
          </div>
          <div className="group">
            <span className="font-din-arabic text-black inline">
              Panthenol (Pro-Vitamin B5) —{" "}
            </span>
            <span className="font-din-arabic text-black/70 group-hover:text-black transition-colors">
              hydrates and supports skin barrier.
            </span>
          </div>
          <div className="group">
            <span className="font-din-arabic text-black inline">
              Aloe Leaf Water —{" "}
            </span>
            <span className="font-din-arabic text-black/70 group-hover:text-black transition-colors">
              refreshing, helps soothe after exfoliation.
            </span>
          </div>
          <div className="group">
            <span className="font-din-arabic text-black inline">
              Glycerin —{" "}
            </span>
            <span className="font-din-arabic text-black/70 group-hover:text-black transition-colors">
              draws in and holds moisture.
            </span>
          </div>
        </div>
      </InfoPanel>
      <InfoPanel
        isOpen={isFragranceNotesOpen}
        onClose={() => setIsFragranceNotesOpen(false)}
        title="FRAGRANCE NOTES"
      >
        <div className="space-y-4">
          <div className="group">
            <span className="font-din-arabic text-black inline">
              Top Notes —{" "}
            </span>
            <span className="font-din-arabic text-black/70 group-hover:text-black transition-colors">
              Fresh bergamot, green tea leaves, crisp cucumber.
            </span>
          </div>
          <div className="group">
            <span className="font-din-arabic text-black inline">
              Heart Notes —{" "}
            </span>
            <span className="font-din-arabic text-black/70 group-hover:text-black transition-colors">
              Black tea concentrate, white jasmine, subtle mint.
            </span>
          </div>
          <div className="group">
            <span className="font-din-arabic text-black inline">
              Base Notes —{" "}
            </span>
            <span className="font-din-arabic text-black/70 group-hover:text-black transition-colors">
              Cedarwood, soft musk, clean linen.
            </span>
          </div>
        </div>
      </InfoPanel>
      <InfoPanel
        isOpen={isIngredientsPanelOpen}
        onClose={() => setIsIngredientsPanelOpen(false)}
        title="FULL INGREDIENTS"
      >
        <p className="font-din-arabic text-black/70 text-sm leading-relaxed">
          Water, Sodium Laureth Sulfate, Cocamidopropyl Betaine, Black Tea
          Extract (Camellia Sinensis), Colloidal Oatmeal, Panthenol (Pro-Vitamin
          B5), Aloe Barbadensis Leaf Juice, Glycerin, Sodium Chloride, Citric
          Acid, Phenoxyethanol, Ethylhexylglycerin, Natural Fragrance,
          Tocopherol (Vitamin E).
        </p>
      </InfoPanel>
    </div>
  )
}
