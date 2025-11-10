"use client"

import React, { useMemo, useState, useEffect } from "react"
import { motion } from "motion/react"
import { Heart } from "lucide-react"
import { toast } from "sonner"
import { useSearchParams } from "next/navigation"

import { ImageWithFallback } from "./figma/ImageWithFallback"
import { Footer } from "./Footer"
import { useLedger, LedgerItem } from "app/context/ledger-context"

interface Product {
  id: string
  name: string
  category: "candle" | "diffuser"
  price: number
  size: string
  description: string
  image: string
  hoverImage?: string
  botanical: string
  property: string
}

interface HomeCreationsPageProps {
  onAddToCart: (item: {
    id: string
    name: string
    price: number
    size: string
    quantity: number
    image: string
    category: string
  }) => void
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

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1632118588340-c4c7a674c707?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbmhvdXNlJTIwYm90YW5pY2FsJTIwdmludGFnZXxlbnwxfHx8fDE3NjIwMDk0Mjh8MA&ixlib=rb-4.1.0&q=80&w=1920&utm_source=figma&utm_medium=referral"

const EDITORIAL_IMAGE =
  "https://images.unsplash.com/photo-1696391267294-103e9c210c6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwY3JlYXRpb25zJTIwaW50ZXJpb3IlMjBib3RhbmljYWx8ZW58MXx8fHwxNzYyMDA5NDI3fDA&ixlib=rb-4.1.0&q=80&w=1920&utm_source=figma&utm_medium=referral"

const products: Product[] = [
  {
    id: "atmos-01-saffron-jasmine",
    name: "Atmos_01 Saffron Jasmine Amberwood",
    category: "candle",
    price: 3200,
    size: "250g",
    description: "Hand-poured soy candle with saffron, jasmine and amberwood",
    image:
      "https://images.unsplash.com/photo-1696391267294-103e9c210c6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwY3JlYXRpb25zJTIwaW50ZXJpb3IlMjBib3RhbmljYWx8ZW58MXx8fHwxNzYyMDA5NDI3fDA&ixlib=rb-4.1.0&q=80&w=1920&utm_source=figma&utm_medium=referral",
    hoverImage:
      "https://images.unsplash.com/photo-1576260735040-0161203bab23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2VudGVkJTIwY2FuZGxlJTIwdmludGFnZXxlbnwxfHx8fDE3NjIwMDk0Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    botanical: "Crocus Sativus",
    property: "Exotic & Luxurious",
  },
  {
    id: "atmos-02-oud-waters",
    name: "Atmos_02 Oud Waters",
    category: "candle",
    price: 3400,
    size: "250g",
    description: "Hand-poured soy candle with rare oud and aquatic notes",
    image:
      "https://images.unsplash.com/photo-1580584126903-c17d41830450?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdWQlMjBjYW5kbGV8ZW58MXx8fHwxNzYyMDIzNDY5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    hoverImage:
      "https://images.unsplash.com/photo-1621494042364-e0e6ba89c21d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwYm90YW5pY2FsJTIwY2FuZGxlfGVufDF8fHx8MTc2MjAwOTQyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    botanical: "Aquilaria Malaccensis",
    property: "Deep & Mysterious",
  },
  {
    id: "atmos-03-cedarwood-rose",
    name: "Atmos_03 Cedarwood Rose",
    category: "candle",
    price: 3400,
    size: "300g",
    description: "Hand-poured soy candle with cedarwood and damask rose",
    image:
      "https://images.unsplash.com/photo-1696391267294-103e9c210c6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwY3JlYXRpb25zJTIwaW50ZXJpb3IlMjBib3RhbmljYWx8ZW58MXx8fHwxNzYyMDA5NDI3fDA&ixlib=rb-4.1.0&q=80&w=1920&utm_source=figma&utm_medium=referral",
    hoverImage:
      "https://images.unsplash.com/photo-1621494042364-e0e6ba89c21d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwYm90YW5pY2FsJTIwY2FuZGxlfGVufDF8fHx8MTc2MjAwOTQyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    botanical: "Cedrus Atlantica",
    property: "Woody & Romantic",
  },
  {
    id: "atmos-04-santal-pepper",
    name: "Atmos_04 Santal Pepper",
    category: "candle",
    price: 3500,
    size: "300g",
    description: "Hand-poured soy candle with sandalwood and black pepper",
    image:
      "https://images.unsplash.com/photo-1696391267294-103e9c210c6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwY3JlYXRpb25zJTIwaW50ZXJpb3IlMjBib3RhbmljYWx8ZW58MXx8fHwxNzYyMDA5NDI3fDA&ixlib=rb-4.1.0&q=80&w=1920&utm_source=figma&utm_medium=referral",
    hoverImage:
      "https://images.unsplash.com/photo-1621494042364-e0e6ba89c21d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwYm90YW5pY2FsJTIwY2FuZGxlfGVufDF8fHx8MTc2MjAwOTQyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    botanical: "Santalum Album",
    property: "Spicy & Grounding",
  },
  {
    id: "lava-rock-diffuser",
    name: "Lava Rock Diffuser",
    category: "diffuser",
    price: 2850,
    size: "Set",
    description: "Natural lava stone diffuser with essential oil blend",
    image:
      "https://images.unsplash.com/photo-1597239164203-0b0b9fec6040?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXZhJTIwcm9jayUyMGRpZmZ1c2VyJTIwaG9tZXxlbnwxfHx8fDE3NjIwMDk0MjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    hoverImage:
      "https://images.unsplash.com/photo-1747198919508-a7657e63d4f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXZhJTIwcm9jayUyMGRpZmZ1c2VyJTIwYXJvbWF0aGVyYXB5fGVufDF8fHx8MTc1OTc2ODkyMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    botanical: "Volcanic Stone",
    property: "Aromatic & Purifying",
  },
]

const fullWidthFeatures: FullWidthFeature[] = [
  {
    id: "fragrance-guide",
    subtitle: "Scenting your space",
    title: "A guide to home fragrance",
    description:
      "Carefully crafted scents to transform your living spaces, from hand-poured candles to artisanal diffusers, each designed to evoke the essence of a botanical garden.",
    ctaText: "Explore the collection",
    image:
      "https://images.unsplash.com/photo-1696391267294-103e9c210c6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwY3JlYXRpb25zJTIwaW50ZXJpb3IlMjBib3RhbmljYWx8ZW58MXx8fHwxNzYyMDA5NDI3fDA&ixlib=rb-4.1.0&q=80&w=1600&utm_source=figma&utm_medium=referral",
    imagePosition: "right",
  },
  {
    id: "sustainable-wax",
    subtitle: "Our craft",
    title: "Sustainable sourcing & hand-crafted excellence",
    description:
      "Our candles are hand-poured using sustainable soy wax and cotton wicks, infused with pure botanical essences. Each diffuser is carefully assembled using ethically sourced materials and natural lava stones.",
    ctaText: "Learn more",
    image:
      "https://images.unsplash.com/photo-1632118588340-c4c7a674c707?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbmhvdXNlJTIwYm90YW5pY2FsJTIwdmludGFnZXxlbnwxfHx8fDE3NjIwMDk0Mjh8MA&ixlib=rb-4.1.0&q=80&w=1600&utm_source=figma&utm_medium=referral",
    imagePosition: "left",
  },
]

export function HomeCreationsPage({ onAddToCart }: HomeCreationsPageProps) {
  const [selectedFilter, setSelectedFilter] = useState<"all" | "candle" | "diffuser">("all")
  const searchParams = useSearchParams()
  const { toggleLedgerItem, isInLedger } = useLedger()

  useEffect(() => {
    const filter = searchParams?.get("filter")
    if (filter === "candle" || filter === "diffuser") {
      setSelectedFilter(filter)
    } else {
      setSelectedFilter("all")
    }
  }, [searchParams])

  const filteredProducts = useMemo(() => {
    if (selectedFilter === "all") {
      return products
    }
    return products.filter((product) => product.category === selectedFilter)
  }, [selectedFilter])

  const handleToggleLedger = (product: Product) => {
    const alreadyInLedger = isInLedger(product.id)
    const ledgerItem: LedgerItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      description: product.description,
      category: product.category,
      size: product.size,
      botanical: product.botanical,
      property: product.property,
    }
    toggleLedgerItem(ledgerItem)
    toast.success(`${product.name} ${alreadyInLedger ? "Removed From" : "Added To"} Ledger`, {
      duration: 2000,
    })
  }

  const handleAddToCart = (product: Product) => {
    const item = {
      id: product.id,
      name: product.name,
      price: product.price,
      size: product.size,
      quantity: 1,
      image: product.image,
      category: product.category,
    }
    onAddToCart(item)
    toast.success(`${product.name} Added To Cart`, {
      duration: 2000,
    })
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#e3e3d8" }}>
      {/* Hero Banner */}
      <section className="relative h-[60vh] sm:h-[65vh] lg:h-[75vh] overflow-hidden">
        <motion.div initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 1.5, ease: "easeOut" }} className="w-full h-full">
          <ImageWithFallback src={HERO_IMAGE} alt="Home Creations Collection" className="w-full h-full object-cover" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/10" />

        {/* Hero Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4 sm:px-6">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2 }}>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="font-din-arabic text-white/80 text-xs mb-4 sm:mb-6 tracking-widest"
                style={{ letterSpacing: "0.2em" }}
              >
                BOTANICAL HOME FRAGRANCE
              </motion.p>
              <h1 className="font-american-typewriter text-white text-3xl sm:text-4xl md:text-5xl lg:text-7xl mb-4 sm:mb-6" style={{ letterSpacing: "0.05em" }}>
                Home Creations
              </h1>
              <p
                className="font-din-arabic text-white/95 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg leading-relaxed px-4"
                style={{ letterSpacing: "0.1em" }}
              >
                Hand-poured candles and artisanal diffusers to create atmosphere, warmth, and an enduring sense of ease.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="py-6 sm:py-8 px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-20 border-b border-black/10">
        <div className="max-w-[90rem] mx-auto">
          <div className="flex justify-start">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }} className="flex flex-wrap gap-4 sm:gap-6">
              {[
                { label: "All products", value: "all" as const },
                { label: "Candles", value: "candle" as const },
                { label: "Diffusers", value: "diffuser" as const },
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

      {/* Products Grid - First Set */}
      <section className="py-12 sm:py-16 lg:py-24">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 sm:gap-y-16 lg:gap-y-20 mb-16 sm:mb-24 lg:mb-32 justify-items-center">
            {filteredProducts.slice(0, 3).map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} isInLedger={isInLedger} handleToggleLedger={handleToggleLedger} handleAddToCart={handleAddToCart} />
            ))}
          </div>
        </div>
      </section>

      {/* Editorial Blog Section - Full Width */}
      {filteredProducts.length > 3 && <EditorialBlogSection />}

      {/* Products Grid - Second Set */}
      {filteredProducts.length > 3 && (
        <section className="py-0">
          <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 sm:gap-y-16 lg:gap-y-20 mb-16 sm:mb-24 lg:mb-32 justify-items-center">
              {filteredProducts.slice(3, 6).map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index + 3}
                  isInLedger={isInLedger}
                  handleToggleLedger={handleToggleLedger}
                  handleAddToCart={handleAddToCart}
                />
              ))}
            </div>

            {/* First Feature Section */}
            {fullWidthFeatures[0] && filteredProducts.length > 6 && <FullWidthFeatureSection feature={fullWidthFeatures[0]} />}

            {/* Remaining Products */}
            {filteredProducts.length > 6 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 sm:gap-y-16 lg:gap-y-20 mb-16 sm:mb-24 lg:mb-32 justify-items-center">
                {filteredProducts.slice(6).map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index + 6}
                    isInLedger={isInLedger}
                    handleToggleLedger={handleToggleLedger}
                    handleAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}

            {/* Second Feature Section */}
            {fullWidthFeatures[1] && filteredProducts.length > 6 && <FullWidthFeatureSection feature={fullWidthFeatures[1]} />}

            {/* Home Fragrance Ritual Section */}
            <HomeFragranceRitualSection />
          </div>
        </section>
      )}

      {/* Footer */}
      <Footer />
    </div>
  )
}

interface ProductCardProps {
  product: Product
  index: number
  isInLedger: (id: string) => boolean
  handleToggleLedger: (product: Product) => void
  handleAddToCart: (product: Product) => void
}

function ProductCard({ product, index, isInLedger, handleToggleLedger, handleAddToCart }: ProductCardProps) {
  const [isImageHovered, setIsImageHovered] = useState(false)
  const [isButtonHovered, setIsButtonHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group flex flex-col w-full mx-auto"
      style={{ minHeight: "600px", maxWidth: "420px" }}
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
          aria-label={`${isInLedger(product.id) ? "Remove from" : "Add to"} ledger`}
        >
          <Heart size={18} className={`transition-colors duration-300 ${isInLedger(product.id) ? "fill-[#e58a4d] stroke-[#e58a4d]" : "stroke-white fill-none"}`} />
        </motion.button>
      </div>

      {/* Product Info */}
      <div className="flex flex-col flex-grow">
        <div>
          <h3 className="font-american-typewriter text-xl mb-1" style={{ letterSpacing: "0.05em" }}>
            {product.name}
          </h3>
          <p className="font-din-arabic text-black/60 text-sm mb-2" style={{ letterSpacing: "0.1em" }}>
            {product.size}
          </p>
        </div>

        <p className="font-din-arabic text-black/70 leading-relaxed mt-3" style={{ letterSpacing: "0.1em" }}>
          {product.description}
        </p>

        <div className="mt-auto pt-4">
          <p className="font-din-arabic text-black text-sm mb-4" style={{ letterSpacing: "0.1em" }}>
            ₹{product.price.toLocaleString()}
          </p>

          {/* Minimal Add to Cart Button - Aesop Style */}
          <div className="flex items-center justify-end">
            <button
              onClick={() => handleAddToCart(product)}
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
        <motion.div initial={{ scale: 1.05 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: "easeOut" }} className="absolute inset-0">
          <ImageWithFallback src={EDITORIAL_IMAGE} alt="Creating atmosphere through fragrance" className="w-full h-full object-cover" />
        </motion.div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative z-10 flex items-center h-[60vh] sm:h-[65vh] lg:h-[75vh] px-6 sm:px-12 lg:px-20 py-12 sm:py-16"
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
              SCENTING YOUR SANCTUARY
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="font-american-typewriter text-white text-2xl sm:text-3xl lg:text-4xl mb-5 sm:mb-7"
              style={{ letterSpacing: "0.05em" }}
            >
              Creating atmosphere through fragrance
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="font-din-arabic text-white/95 text-sm sm:text-base leading-relaxed mb-8 sm:mb-12"
              style={{ letterSpacing: "0.1em" }}
            >
              Each scent tells a story — of sandalwood in summer light, oud drifting through mist and rain, and saffron fields at dusk. These memories of places and seasons shape
              familiar rooms into spaces that feel entirely your own.
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
                Read the guide
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

function FullWidthFeatureSection({ feature }: { feature: FullWidthFeature }) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="mb-16 sm:mb-24 lg:mb-32"
    >
      <div className={`grid grid-cols-1 lg:grid-cols-2 ${feature.imagePosition === "right" ? "" : "lg:grid-flow-dense"}`}>
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={`relative aspect-[4/3] sm:aspect-[3/2] lg:aspect-auto lg:min-h-[500px] overflow-hidden ${
            feature.imagePosition === "left" ? "lg:col-start-1" : "lg:col-start-2"
          }`}
        >
          <ImageWithFallback src={feature.image} alt={feature.title} className="w-full h-full object-cover" />
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: feature.imagePosition === "left" ? 40 : -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className={`flex items-center bg-white/10 p-8 sm:p-12 lg:p-20 ${feature.imagePosition === "left" ? "lg:col-start-2 lg:row-start-1" : "lg:col-start-1 lg:row-start-1"}`}
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

function HomeFragranceRitualSection() {
  const ritualSteps = [
    {
      step: "01",
      title: "Choose Your Space",
      description:
        "Each room invites a different scent. Calming floral and woody notes suit bedrooms, while citrus or herbal accords brighten shared spaces.",
      fragrance: "Space-specific scenting",
    },
    {
      step: "02",
      title: "Select Mindfully",
      description:
        "Choose fragrances that resonate with your personal sanctuary. Let each scent reflect your mood, memory, or the way you wish to feel.",
      fragrance: "Intentional selection",
    },
    {
      step: "03",
      title: "Care with Intention",
      description:
        "Trim candle wicks before each use and rotate diffuser rocks every few days to ensure an even, lasting fragrance experience.",
      fragrance: "Lasting performance",
    },
  ]

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="mb-24 lg:mb-32"
    >
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16 lg:mb-20"
        >
          <p className="font-din-arabic text-black/50 text-xs mb-4" style={{ letterSpacing: "0.2em" }}>
            THE RITUAL
          </p>

          <h1 className="font-american-typewriter text-2xl sm:text-3xl lg:text-4xl mb-6" style={{ letterSpacing: "0.05em" }}>
            A home fragrance ritual
          </h1>

          <p className="font-din-arabic text-black/70 leading-relaxed max-w-2xl mx-auto" style={{ letterSpacing: "0.1em" }}>
            A mindful approach to scenting your sanctuary, designed to create atmosphere, evoke emotion, and transform spaces.
          </p>
        </motion.div>

        {/* Ritual Steps - Vertical Layout */}
        <div className="space-y-12 lg:space-y-16">
          {ritualSteps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              {/* Connector Line - Not for last item */}
              {index < ritualSteps.length - 1 && <div style={{ background: "linear-gradient(to bottom, rgba(96, 95, 95, 0.15), rgba(186, 181, 181, 0.1))" }}  className="absolute left-5 top-14 w-px h-full bg-gradient-to-b from-black/10 to-transparent hidden sm:block" />}

              <div className="flex items-start gap-8 lg:gap-12">
                {/* Step Number with Circle */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                  className="flex-shrink-0 relative z-10"
                >
                  <div className="w-10 h-10 rounded-full border-2 border-black/10 bg-[#e3e3d8] flex items-center justify-center group-hover:border-black/30 transition-colors duration-300">
                    <span className="font-american-typewriter text-sm text-black/40 group-hover:text-black/60 transition-colors duration-300" style={{ letterSpacing: "0.05em" }}>
                      {step.step}
                    </span>
                  </div>
                </motion.div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <h3 className="font-american-typewriter text-xl lg:text-2xl mb-4" style={{ letterSpacing: "0.05em" }}>
                    {step.title}
                  </h3>

                  <p className="font-din-arabic text-black/70 leading-relaxed max-w-2xl" style={{ letterSpacing: "0.1em" }}>
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Image Feature */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 lg:mt-20 relative"
        >
          <div className="relative aspect-[16/9] lg:aspect-[21/9] overflow-hidden">
            <motion.div initial={{ scale: 1.1 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: "easeOut" }}>
              <ImageWithFallback src={EDITORIAL_IMAGE} alt="Home fragrance ritual" className="w-full h-full object-cover" />
            </motion.div>

            {/* Overlay Text */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent p-8 lg:p-12">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="font-din-arabic text-white/80 text-xs absolute top-8 right-8 lg:top-12 lg:right-12"
                style={{ letterSpacing: "0.2em" }}
              >
                NOTE FROM THE BOTANIST'S LAB
              </motion.p>
              <div className="flex items-center justify-center h-full">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.5 }}
                  className="font-american-typewriter text-white text-xl lg:text-3xl text-center max-w-3xl"
                  style={{ letterSpacing: "0.05em" }}
                >
                  "Fragrance is the invisible architecture of memory and emotion."
                </motion.p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}


