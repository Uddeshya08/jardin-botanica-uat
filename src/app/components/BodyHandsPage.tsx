"use client"

import React, { useMemo, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { ImageWithFallback } from "./figma/ImageWithFallback"
import { Heart, ShoppingBag, X } from "lucide-react"
import { toast } from "sonner"
import { HandCareRitualSection } from "./HandCareRitual"
import { useLedger } from "app/context/ledger-context"

const HERO_IMAGE =
  "/assets/body-hand-banner.png"
const SKIN_CARE_IMAGE =
  "/assets/body-hand-girl-feel.png"

interface Product {
  id: string
  name: string
  category: "lotion" | "wash"
  price: number
  price250ml?: number
  price500ml?: number
  size: string
  availableSizes?: string[]
  description: string
  image: string
  hoverImage?: string
  botanical: string
  property: string
}

interface BodyHandsPageProps {
  onAddToCart: (item: any) => void
}

interface FullWidthFeature {
  id: string
  subtitle: string
  title: string
  description: string
  ctaText: string
  image: string
  imagePosition: "left" | "right"
}
const products: Product[] = [
  {
    id: "1",
    name: "Soft Orris Hand Lotion",
    category: "lotion",
    price: 2850,
    price250ml: 1850,
    price500ml: 2850,
    size: "500ml",
    availableSizes: ["250ml", "500ml"],
    description: "A soothing blend enriched with lavender and chamomile extract",
    image:
      "https://images.unsplash.com/photo-1522033048162-a492b7a1bead?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXZlbmRlciUyMGZpZWxkJTIwYm90YW5pY2FsfGVufDF8fHx8MTc2MTk5MTU3OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    hoverImage:
      "https://images.unsplash.com/photo-1631292621942-de5582ec1604?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXZlbmRlciUyMGJvdHRsZSUyMHNraW5jYXJlfGVufDF8fHx8MTc2MjAwODQzMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    botanical: "Lavandula Angustifolia",
    property: "Calming & Restorative",
  },
  {
    id: "2",
    name: "Black Tea Hand Wash",
    category: "wash",
    price: 2650,
    price250ml: 1750,
    price500ml: 2650,
    size: "500ml",
    availableSizes: ["250ml", "500ml"],
    description: "Gentle cleansing with rose geranium and aloe vera",
    image:
      "https://images.unsplash.com/photo-1584283626804-30ba59e636fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb3NlJTIwc2tpbmNhcmUlMjBib3RhbmljYWx8ZW58MXx8fHwxNzYxOTkwNjgzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    hoverImage:
      "https://images.unsplash.com/photo-1697652440819-32ae57842e4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb3NlJTIwc2tpbmNhcmUlMjBwcm9kdWN0fGVufDF8fHx8MTc2MjAwODQzMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    botanical: "Pelargonium Graveolens",
    property: "Balancing & Purifying",
  },
]

export function BodyHandsPage({ onAddToCart }: BodyHandsPageProps) {
  const [selectedFilter, setSelectedFilter] = useState<"all" | "lotion" | "wash">("all")
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)
  const [isLedgerOpen, setIsLedgerOpen] = useState(false)
  const { ledger, toggleLedgerItem, isInLedger, removeFromLedger } = useLedger()

  const filteredProducts = useMemo(() => {
    return selectedFilter === "all" ? products : products.filter((p) => p.category === selectedFilter)
  }, [selectedFilter])

  const handleToggleLedger = (product: Product) => {
    const alreadyInLedger = isInLedger(product.id)
    const ledgerItem: any = {
      ...product,
      price: product.price,
      image: product.image,
    }
    toggleLedgerItem(ledgerItem)
    toast.success(`${product.name} ${alreadyInLedger ? "Removed From" : "Added To"} Ledger`, {
      duration: 2000,
    })
  }

  const handleAddToCart = (product: Product, size: string, price: number) => {
    const item = {
      id: `${product.id}-${size}`,
      name: product.name,
      price,
      size,
      quantity: 1,
      image: product.image,
    }
    onAddToCart(item)
    toast.success(`${product.name} Added To Cart`, { duration: 2000 })
  }

  const ledgerCount = ledger.length

  const closeLedger = () => {
    setIsLedgerOpen(false)
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#e3e3d8" }}>
      {/* Hero Banner */}
      <section className="relative h-[60vh] sm:h-[65vh] lg:h-[75vh] overflow-hidden">
        <motion.div initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 1.5, ease: "easeOut" }} className="absolute inset-0 w-full h-full z-0">
          <ImageWithFallback src={HERO_IMAGE} alt="Body & Hands Collection" className="w-full h-full object-cover" />
        </motion.div>
        {/* Background Overlay - smooth natural gradient from top extending below center */}
        <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.55) 15%, rgba(0,0,0,0.4) 30%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0.15) 55%, rgba(0,0,0,0.08) 65%, rgba(0,0,0,0.03) 75%, transparent 85%)' }} />

        {/* Hero Text */}
        <div className="absolute inset-0 flex items-center justify-center py-10 z-20">
          <div className="text-center px-4 sm:px-6">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2 }}>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="font-din-arabic text-white/80 text-xs mb-4 sm:mb-6 tracking-widest"
                style={{ letterSpacing: "0.2em" }}
              >
                BOTANICAL CARE ESSENTIALS
              </motion.p>
              <h1
                className="font-american-typewriter text-white text-3xl sm:text-4xl md:text-5xl lg:text-7xl mb-4 sm:mb-6"
                style={{ letterSpacing: "0.05em" }}
              >
                Body & Hands
              </h1>
              <p
                className="font-din-arabic text-white/95 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg leading-relaxed px-4"
                style={{ letterSpacing: "0.1em" }}
              >
                Formulations for the body and hands created to cleanse, exfoliate, hydrate and nourish.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="py-6 sm:py-8 px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-20 border-b border-black/10">
        <div className="max-w-[90rem] mx-auto">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }} className="flex flex-wrap gap-4 sm:gap-6">
              {[
                { label: "All Products", value: "all" as const },
                { label: "Hand Wash", value: "wash" as const },
                { label: "Hand Lotion", value: "lotion" as const },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setSelectedFilter(filter.value)}
                  className={`font-din-arabic text-sm transition-colors duration-300 ${
                    selectedFilter === filter.value ? "text-black border-b border-black" : "text-black/40 hover:text-black/70"
                  }`}
                  style={{ letterSpacing: "0.15em" }}
                >
                  {filter.label}
                </button>
              ))}
            </motion.div>
           
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 sm:py-16 lg:py-24">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-20">
          <div className="mb-16 sm:mb-24 lg:mb-32">
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 sm:gap-y-16 lg:gap-y-20 ${filteredProducts.length === 2 ? "justify-items-center" : "justify-items-center"}`}>
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  hoveredProduct={hoveredProduct}
                  setHoveredProduct={setHoveredProduct}
                  isInLedger={isInLedger}
                  handleToggleLedger={handleToggleLedger}
                  handleAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Blog Section - Understanding your skin - Full Width */}
      <EditorialBlogSection />

      {/* Hand Care Ritual Section */}
      <section className="py-0">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-20">
          <HandCareRitualSection />
        </div>
      </section>


      {/* Ledger Drawer */}
      <AnimatePresence>
        {isLedgerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm px-4 sm:px-6 lg:px-8"
          >
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
              className="w-full max-w-xl rounded-t-3xl bg-[#f0f0e4] p-6 shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-din-arabic text-xs tracking-[0.3em] text-black/60 uppercase">Ledger</p>
                  <h3 className="font-american-typewriter text-2xl text-black" style={{ letterSpacing: "0.05em" }}>
                    Your saved botanicals
                  </h3>
                </div>
                <button onClick={closeLedger} className="rounded-full border border-black/20 p-2 hover:bg-black/5">
                  <X className="h-4 w-4 text-black" />
                </button>
              </div>

              <div className="mt-6 space-y-4 max-h-[40vh] overflow-y-auto pr-2">
                {ledgerCount === 0 && (
                  <p className="font-din-arabic text-sm text-black/60" style={{ letterSpacing: "0.08em" }}>
                    Nothing in your ledger yet. Explore the collection and tap the heart to curate your ritual.
                  </p>
                )}
                {ledger?.map((item: any) => (
                  <div key={item.id} className="flex items-start gap-4 rounded-2xl bg-white/70 p-4">
                    <div className="h-16 w-16 overflow-hidden rounded-xl bg-black/5">
                      <ImageWithFallback src={item.image ?? HERO_IMAGE} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="font-din-arabic text-xs uppercase tracking-[0.3em] text-black/50">{item.botanical}</p>
                      <h4 className="font-american-typewriter text-lg text-black" style={{ letterSpacing: "0.04em" }}>
                        {item.name}
                      </h4>
                      <p className="font-din-arabic text-sm text-black/70" style={{ letterSpacing: "0.08em" }}>
                        {item.property}
                      </p>
                    </div>
                    <button onClick={() => removeFromLedger(item.id)} className="rounded-full border border-black/20 px-3 py-1 font-din-arabic text-xs tracking-[0.2em] uppercase hover:bg-black hover:text-white transition">
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Product Card Component - Aesop Style with Minimal Add to Cart
function ProductCard({
  product,
  index,
  hoveredProduct,
  setHoveredProduct,
  isInLedger,
  handleToggleLedger,
  handleAddToCart,
}: {
  product: Product
  index: number
  hoveredProduct: string | null
  setHoveredProduct: (id: string | null) => void
  isInLedger: (id: string) => boolean
  handleToggleLedger: (product: Product) => void
  handleAddToCart: (product: Product, size: string, price: number) => void
}) {
  const [isImageHovered, setIsImageHovered] = useState(false)
  const [isButtonHovered, setIsButtonHovered] = useState(false)
  const [selectedSize, setSelectedSize] = useState(product.size)
  const isHovered = hoveredProduct === product.id

  const getCurrentPrice = () => {
    if (selectedSize === "250ml" && product.price250ml) {
      return product.price250ml
    }
    if (selectedSize === "500ml" && product.price500ml) {
      return product.price500ml
    }
    return product.price
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className="group flex flex-col w-full mx-auto"
      style={{ minHeight: "600px", maxWidth: "420px" }}
      onMouseEnter={() => setHoveredProduct(product.id)}
      onMouseLeave={() => setHoveredProduct(null)}
    >
      {/* Product Image */}
      <div
        className="relative w-full overflow-hidden cursor-pointer"
        style={{ aspectRatio: "4/5", marginBottom: "1.5rem" }}
        onMouseEnter={() => setIsImageHovered(true)}
        onMouseLeave={() => setIsImageHovered(false)}
      >
        {/* Hover Image - Behind */}
        {product.hoverImage && (
          <div className="absolute inset-0">
            <ImageWithFallback src={product.hoverImage} alt={`${product.name} alternate view`} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Main Image - On Top */}
        <div className="absolute inset-0 transition-opacity duration-700 ease-in-out" style={{ opacity: isImageHovered ? 0 : 1 }}>
          <ImageWithFallback src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>

        {/* Ledger Icon - Always Visible */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleToggleLedger(product)}
          className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 ${
            isInLedger(product.id) ? "bg-white/20 border border-white/30" : "bg-white/20 border border-white/30 hover:bg-white/30"
          }`}
        >
          <Heart
            size={18}
            className={`transition-colors duration-300 ${isInLedger(product.id) ? "fill-[#e58a4d] stroke-[#e58a4d]" : "stroke-white fill-none"}`}
          />
        </motion.button>
      </div>

      {/* Product Info */}
      <div className="flex flex-col flex-grow">
        <div>
          <h3 className="font-american-typewriter text-xl mb-1" style={{ letterSpacing: "0.05em" }}>
            {product.name}
          </h3>
          <p className="font-din-arabic text-black/60 text-sm mb-2" style={{ letterSpacing: "0.1em" }}>
            {product.botanical}
          </p>
        </div>

        <p className="font-din-arabic text-black/70 leading-relaxed mt-3 mb-4" style={{ letterSpacing: "0.1em" }}>
          {product.description}
        </p>

        {/* Size Selection Radio Buttons */}
        {product.availableSizes && product.availableSizes.length > 0 && (
          <div className="mb-4">
            <div className="flex gap-3">
              {product.availableSizes.map((size) => (
                <label key={size} className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      type="radio"
                      name={`size-${product.id}`}
                      value={size}
                      checked={selectedSize === size}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      className="sr-only"
                    />
                    <div
                      className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                        selectedSize === size ? "border-black bg-black" : "border-black/30 group-hover:border-black/50"
                      }`}
                    >
                      {selectedSize === size && <div className="w-full h-full rounded-full bg-white scale-[0.4]"></div>}
                    </div>
                  </div>
                  <span
                    className={`font-din-arabic text-sm transition-colors ${
                      selectedSize === size ? "text-black" : "text-black/60 group-hover:text-black/80"
                    }`}
                    style={{ letterSpacing: "0.1em" }}
                  >
                    {size}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto pt-4">
          <p className="font-din-arabic text-black text-sm mb-4" style={{ letterSpacing: "0.1em" }}>
            ₹{getCurrentPrice().toLocaleString()}
          </p>

          {/* Minimal Add to Cart Button - Aesop Style */}
          <div className="flex items-center justify-end">
            <button
              onClick={() => handleAddToCart(product, selectedSize, getCurrentPrice())}
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
              className="group/btn relative inline-flex items-center gap-2 pb-0.5"
            >
              <span className="font-din-arabic text-black text-xs" style={{ letterSpacing: "0.12em" }}>
                Add to cart
              </span>
              <span className="text-black text-xs">→</span>

              {/* Animated underline */}
              <motion.span
                className="absolute bottom-0 left-0 h-[1px] bg-black"
                initial={{ width: "0%" }}
                animate={{ width: isButtonHovered ? "100%" : "0%" }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Full-Width Feature Section Component
function FullWidthFeatureSection({ feature }: { feature: FullWidthFeature }) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="mb-16 sm:mb-24 lg:mb-32 -mx-4 sm:-mx-6 lg:-mx-16"
    >
      <div className={`grid grid-cols-1 lg:grid-cols-2 ${feature.imagePosition === "right" ? "" : "lg:grid-flow-dense"}`}>
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={`relative aspect-[4/3] sm:aspect-[3/2] lg:aspect-auto lg:min-h-[650px] overflow-hidden ${
            feature.imagePosition === "left" ? "lg:col-start-1" : "lg:col-start-2"
          }`}
        >
          <ImageWithFallback
            src={feature.image}
            alt={feature.title}
            className="w-full h-full object-cover px-[-1px] py-[0px]"
            style={{ objectPosition: "20% center" }}
          />
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: feature.imagePosition === "left" ? 40 : -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className={`flex items-center bg-white/10 p-8 sm:p-12 lg:p-20 ${
            feature.imagePosition === "left" ? "lg:col-start-2 lg:row-start-1" : "lg:col-start-1 lg:row-start-1"
          }`}
        >
          <div className="max-w-md">
            <p className="font-din-arabic text-black/50 text-xs mb-3 sm:mb-4" style={{ letterSpacing: "0.2em" }}>
              {feature.subtitle.toUpperCase()}
            </p>

            <h2 className="font-american-typewriter text-2xl sm:text-3xl lg:text-4xl mb-4 sm:mb-6" style={{ letterSpacing: "0.05em" }}>
              {feature.title}
            </h2>

            <p className="font-din-arabic text-black/70 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8" style={{ letterSpacing: "0.1em" }}>
              {feature.description}
            </p>

            <motion.button whileHover={{ x: 5 }} whileTap={{ scale: 0.98 }} className="group inline-flex items-center gap-3">
              <span className="font-din-arabic text-black text-sm border-b border-black/30 group-hover:border-black transition-colors pb-0.5" style={{ letterSpacing: "0.15em" }}>
                {feature.ctaText}
              </span>
              <motion.span className="text-black" animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
                →
              </motion.span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}

// Editorial Blog Section - Aesop Style
function EditorialBlogSection() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="w-full mb-16 sm:mb-24 lg:mb-32"
    >
      <div className="relative h-[60vh] sm:h-[65vh] lg:h-[75vh] overflow-hidden">
        {/* Background Image */}
        <motion.div
          initial={{ scale: 1.05 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full z-0"
        >
          <ImageWithFallback src={SKIN_CARE_IMAGE} alt="Understanding your skin" className="w-full h-full object-cover" />
        </motion.div>

        {/* Background Overlay - smooth natural gradient from top extending below center */}
        <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.55) 15%, rgba(0,0,0,0.4) 30%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0.15) 55%, rgba(0,0,0,0.08) 65%, rgba(0,0,0,0.03) 75%, transparent 85%)' }} />

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative z-20 flex items-center h-[60vh] sm:h-[65vh] lg:h-[75vh] px-6 sm:px-12 lg:px-20 py-12 sm:py-16"
        >
          <div className="max-w-lg">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="font-din-arabic text-white/80 text-xs mb-4 sm:mb-5"
              style={{ letterSpacing: "0.2em" }}
            >
              FIND AN IDEAL REGIMEN
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="font-american-typewriter text-white text-2xl sm:text-3xl lg:text-4xl mb-5 sm:mb-7"
              style={{ letterSpacing: "0.05em" }}
            >
              Understanding your skin
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="font-din-arabic text-white/95 text-sm sm:text-base leading-relaxed mb-8 sm:mb-12"
              style={{ letterSpacing: "0.1em" }}
            >
              By identifying the characteristics of your skin, we can recommend the formulations best suited to you.
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.7 }}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
              className="group inline-flex items-center gap-3 border border-white/40 hover:border-white hover:bg-white/5 px-10 py-3.5 transition-all duration-300"
            >
              <span className="font-din-arabic text-white text-sm" style={{ letterSpacing: "0.15em" }}>
                Begin the process
              </span>
              <motion.span className="text-white" animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
                →
              </motion.span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}