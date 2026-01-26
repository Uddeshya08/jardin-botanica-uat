"use client"

import { ChevronDown, ChevronRight, Star } from "lucide-react"

import { AnimatePresence, motion } from "motion/react"
import React, { useEffect, useState } from "react"
import { toast } from "sonner"
import { ImageWithFallback } from "./figma/ImageWithFallback"

// Placeholder images - replace with actual images when available
const giftSetHeroImage = "/assets/19c9ec6b99a1b843de4b2694678c1ef92c6d81ad.png"

const videoPlaceholderImage = "/assets/0b086e0ac201459f6375d219ed3caa1e230994d6.png"

interface Product {
  id: string

  name: string

  category: string

  price: number

  size: string

  description: string

  image: string

  images?: string[] // For multi-image slider

  hoverImage?: string

  botanical: string

  property: string

  items?: string[]

  savings?: number

  featured?: boolean

  priceRange?: string

  bestFor?: string

  layout?: "large" | "standard"

  hasCandles?: boolean
}

interface GiftSetsPageProps {
  onClose: () => void

  onToggleLedger: (item: any) => void

  ledger: any[]

  onAddToCart: (item: any) => void
}

const candleOptions = [
  { id: "candle-1", name: "Saffron Jasmine Amberwood", size: "250g" },

  { id: "candle-2", name: "Oud Waters", size: "250g" },

  { id: "candle-3", name: "Cedarwood Rose", size: "300g" },

  { id: "candle-4", name: "Santal Pepper", size: "300g" },
]

const products: Product[] = [
  {
    id: "gift-set-discovery",

    name: "Discovery Set",

    category: "discovery",

    price: 5200,

    size: "Hand Care + Candle",

    description:
      "A complete hand care ritual featuring cleansing and nourishing botanical formulations with your choice of signature candle",

    image:
      "https://images.unsplash.com/photo-1603561128891-a78e0f61a52b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBnaWZ0JTIwc2V0JTIwY2FuZGxlcyUyMGJvdGFuaWNhbHxlbnwxfHx8fDE3NjI4NDYyMzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",

    images: [
      "https://images.unsplash.com/photo-1603561128891-a78e0f61a52b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBnaWZ0JTIwc2V0JTIwY2FuZGxlcyUyMGJvdGFuaWNhbHxlbnwxfHx8fDE3NjI4NDYyMzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",

      "https://images.unsplash.com/photo-1706884597675-c79067fec450?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBnaWZ0JTIwc2V0JTIwY2FuZGxlcyUyMGJvdGFuaWNhbHxlbnwxfHx8fDE3NjI4NDYyMzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",

      "https://images.unsplash.com/photo-1713100585019-16f2132c7828?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3RhbmljYWwlMjBkaXNjb3ZlcnklMjBzZXQlMjBib3R0bGVzfGVufDF8fHx8MTc2MzM3MDEyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],

    hoverImage:
      "https://images.unsplash.com/photo-1580680849668-45d32df32e67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW5kbGUlMjBnaWZ0JTIwc2V0JTIwbHV4dXJ5JTIwcGFja2FnaW5nfGVufDF8fHx8MTc2Mjg4MTI3MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",

    botanical: "Discovery Collection",

    property: "Curated & Personal",

    featured: true,

    savings: 700,

    priceRange: "premium",

    bestFor: "Thoughtful gifting",

    layout: "large",

    hasCandles: true,

    items: [
      "Black Tea Hand Wash (250ml)",

      "Soft Orris Hand Lotion (500ml)",

      "One signature candle of your choice",
    ],
  },

  {
    id: "gift-set-hand-care-ritual",

    name: "Silk Wrap",

    category: "silk-wrap",

    price: 5200,

    size: "Luxurious Silk Scarf",

    description:
      "An artisan silk scarf handcrafted to elegantly wrap your gift, transforming presentation into an unforgettable experience",

    image:
      "https://images.unsplash.com/photo-1759563874745-47e35c0a9572?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnaWZ0JTIwYm94JTIwaGFuZCUyMGNhcmUlMjBsdXh1cnl8ZW58MXx8fHwxNzYyODQ2MjM5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",

    images: [
      "https://images.unsplash.com/photo-1759563874745-47e35c0a9572?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnaWZ0JTIwYm94JTIwaGFuZCUyMGNhcmUlMjBsdXh1cnl8ZW58MXx8fHwxNzYyODQ2MjM5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",

      "https://images.unsplash.com/photo-1591176134674-87e8f7c73ce9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWxrJTIwc2NhcmYlMjBsdXh1cnklMjB3cmFwcGluZ3xlbnwxfHx8fDE3NjMzNzAxMjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",

      "https://images.unsplash.com/photo-1652385748879-cd7a0cdf466c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxKYXBhbmVzZSUyMGZ1cm9zaGlraSUyMHNpbGslMjB3cmFwfGVufDF8fHx8MTc2MzM3MDEyNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],

    hoverImage:
      "https://images.unsplash.com/photo-1761479258387-9542d09a5f47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnaWZ0JTIwYm94JTIwYm90YW5pY2FsJTIwbWluaW1hbGlzdHxlbnwxfHx8fDE3NjI4ODEyNzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",

    botanical: "Japanese Silk Tradition",

    property: "Elegant & Artisanal",

    savings: 300,

    priceRange: "mid",

    bestFor: "Memorable gifting",

    items: [
      "Limited-edition Jardin Botanica silk scarf",

      "Traditional furoshiki wrapping technique",

      "Botanical-inspired patterns",

      "Our silk scarf can wrap most items from your order. If an item is too large, we'll present the scarf-wrapped gift alongside the remaining pieces inside your Jardin Botanica box.",
    ],
  },

  {
    id: "gift-set-travel-essentials",

    name: "Botanical Traveler Set",

    category: "travel",

    price: 3800,

    size: "Five 50ml Bottles",

    description:
      "Essential botanical formulations for the mindful traveler, perfectly sized for journeys near and far",

    image:
      "https://images.unsplash.com/photo-1753071921478-6c160645579f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3RhbmljYWwlMjBnaWZ0JTIwdHJhdmVsJTIwc2V0fGVufDF8fHx8MTc2MzIyNzIwNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",

    hoverImage:
      "https://images.unsplash.com/photo-1566977806197-b52b166f231f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBza2luY2FyZSUyMGdpZnQlMjBzZXR8ZW58MXx8fHwxNzYzMTYzODM1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",

    botanical: "Nomadic Botanicals",

    property: "Travel-Ready & Essential",

    priceRange: "accessible",

    bestFor: "Frequent travelers",

    items: [
      "Geranium Body Cleanser (50ml)",

      "Resurrection Hand Balm (50ml)",

      "Facial Hydrating Cream (50ml)",

      "Protective Body Lotion (50ml)",

      "Herbal Hair Treatment (50ml)",
    ],
  },

  {
    id: "gift-set-botanical-discovery",

    name: "Botanical Discovery Collection",

    category: "seasonal",

    price: 6500,

    size: "Eight 30ml Bottles",

    description:
      "An exploratory journey through our most celebrated botanical formulations, ideal for the curious mind",

    image:
      "https://images.unsplash.com/photo-1760373071711-960143464e34?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBnaWZ0JTIwYm90YW5pY2FsJTIwZmVzdGl2ZXxlbnwxfHx8fDE3NjMyMjcyMDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",

    botanical: "Botanical Anthology",

    property: "Explorative & Diverse",

    featured: true,

    priceRange: "mid",

    bestFor: "The curious explorer",

    layout: "large",

    items: [
      "Discovery fragrance collection (8 x 30ml)",

      "Botanical identification cards",

      "Aromatic journey guide",
    ],
  },

  {
    id: "gift-set-festive-duo",

    name: "Festive Duo Collection",

    category: "seasonal",

    price: 4200,

    size: "Two 300g Candles",

    description:
      "A seasonal pairing of warming spice and winter botanicals, celebrating the spirit of togetherness",

    image:
      "https://images.unsplash.com/photo-1603561128891-a78e0f61a52b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBnaWZ0JTIwc2V0JTIwY2FuZGxlcyUyMGJvdGFuaWNhbHxlbnwxfHx8fDE3NjI4NDYyMzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",

    botanical: "Winter Anthology",

    property: "Warming & Festive",

    savings: 400,

    priceRange: "mid",

    bestFor: "Festive gatherings",

    items: [
      "Cinnamon Cedar Candle (300g)",

      "Frankincense Myrrh Candle (300g)",
    ],
  },

  {
    id: "gift-set-luxury-skincare",

    name: "Luxury Skin Ritual Set",

    category: "skincare",

    price: 8900,

    size: "Four Full-Size Products",

    description:
      "A comprehensive skincare ritual featuring our most revered botanical formulations for radiant skin",

    image:
      "https://images.unsplash.com/photo-1566977806197-b52b166f231f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBza2luY2FyZSUyMGdpZnQlMjBzZXR8ZW58MXx8fHwxNzYzMTYzODM1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",

    botanical: "Complexion Botanicals",

    property: "Nourishing & Transformative",

    priceRange: "premium",

    bestFor: "Skincare aficionados",

    items: [
      "Parsley Seed Facial Cleanser (200ml)",

      "B & Tea Balancing Toner (200ml)",

      "Damascan Rose Treatment (60ml)",

      "Vitamin C Facial Serum (50ml)",
    ],
  },
]

export function GiftSetsPage({ onClose, onToggleLedger, ledger, onAddToCart }: GiftSetsPageProps) {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)

  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const [expandedItems, setExpandedItems] = useState<{
    [key: string]: boolean
  }>({})

  const [selectedCandles, setSelectedCandles] = useState<{
    [key: string]: string
  }>({})

  const [personalMessages, setPersonalMessages] = useState<{
    [key: string]: string
  }>({})

  const [currentImageIndex, setCurrentImageIndex] = useState<{
    [key: string]: number
  }>({})

  // Auto-scroll images on mobile every 2 seconds

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => {
        const newIndex: { [key: string]: number } = {}

        products.forEach((product, productIndex) => {
          if (product.images && product.images.length > 1) {
            const currentIdx = prev[product.id] || 0

            // Add offset based on product index to make them out of sync

            // Only update if the current second matches the product's offset

            const timeOffset = productIndex * 2 // 2 second offset between products

            const currentTime = Math.floor(Date.now() / 1000)

            if (currentTime % 5 === timeOffset % 5) {
              newIndex[product.id] = (currentIdx + 1) % product.images.length
            }
          }
        })

        return { ...prev, ...newIndex }
      })
    }, 1000) // Check every second for smoother transitions

    return () => clearInterval(interval)
  }, [])

  const isInLedger = (productId: string) => {
    return ledger.some((item) => item.id === productId)
  }

  const handleToggleLedger = (product: Product) => {
    onToggleLedger(product)

    if (!isInLedger(product.id)) {
      toast.success(`${product.name} Added To Ledger`, {
        duration: 2000,
      })
    } else {
      toast.success(`${product.name} Removed From Ledger`, {
        duration: 2000,
      })
    }
  }

  const handleAddToCart = (product: Product) => {
    const cartItem = {
      ...product,

      selectedCandle: selectedCandles[product.id],

      personalMessage: personalMessages[product.id],
    }

    onAddToCart(cartItem)

    toast.success(`${product.name} Added To Cart`, {
      duration: 2000,
    })
  }

  const toggleItemsExpanded = (productId: string) => {
    setExpandedItems((prev) => ({
      ...prev,

      [productId]: !prev[productId],
    }))
  }

  const handleCandleSelect = (productId: string, candleId: string) => {
    setSelectedCandles((prev) => ({
      ...prev,

      [productId]: candleId,
    }))
  }

  const handleMessageChange = (productId: string, message: string) => {
    // Silk wrap has 500 char limit, discovery has 250

    const maxLength = productId === "gift-set-hand-care-ritual" ? 500 : 250

    if (message.length <= maxLength) {
      setPersonalMessages((prev) => ({
        ...prev,

        [productId]: message,
      }))
    }
  }

  const handleImageChange = (productId: string, index: number) => {
    setCurrentImageIndex((prev) => ({
      ...prev,

      [productId]: index,
    }))
  }

  const filteredProducts =
    selectedCategory === "all" ? products : products.filter((p) => p.category === selectedCategory)

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#e3e3d8" }}>
      {/* Hero Banner */}

      <section className="relative h-[100vh] lg:h-[85vh] overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full z-0"
        >
          <ImageWithFallback
            src={giftSetHeroImage}
            alt="Gift Sets Collection"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Background Overlay - smooth natural gradient from top extending below center */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.55) 15%, rgba(0,0,0,0.4) 30%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0.15) 55%, rgba(0,0,0,0.08) 65%, rgba(0,0,0,0.03) 75%, transparent 85%)",
          }}
        />

        {/* Hero Text */}

        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-center px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex items-center justify-center gap-3 mb-3 sm:mb-4 md:mb-6"
              >
                <p
                  className="font-din-arabic text-white/90 text-[10px] sm:text-xs tracking-widest"
                  style={{ letterSpacing: "0.2em" }}
                >
                  SEASONAL GIFTING
                </p>
              </motion.div>

              <h1
                className="font-american-typewriter text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-3 sm:mb-4 md:mb-6 lg:mb-8"
                style={{ letterSpacing: "0.05em" }}
              >
                The Art of Giving
              </h1>

              <p
                className="font-din-arabic text-white/95 max-w-3xl mx-auto text-xs sm:text-sm lg:text-base leading-relaxed px-4"
                style={{ letterSpacing: "0.1em" }}
              >
                Thoughtfully curated botanical collections for moments that matter
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Filter Bar */}

      <section className="py-6 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-12 border-b border-black/10">
        <div className="max-w-[90rem] mx-auto">
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-12">
            {[
              { id: "all", label: "All Gifts" },

              { id: "discovery", label: "Discovery" },

              { id: "silk-wrap", label: "Silk Wrap" },
            ].map((filter) => (
              <motion.button
                key={filter.id}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(filter.id)}
                className={`font-din-arabic text-xs sm:text-sm transition-all duration-300 pb-1 ${selectedCategory === filter.id
                  ? "text-black border-b-2 border-[#e58a4d]"
                  : "text-black/50 border-b border-transparent hover:text-black hover:border-black/30"
                  }`}
                style={{ letterSpacing: "0.15em" }}
              >
                {filter.label}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Split Hero - Two Products Side by Side */}

      <section
        className={
          filteredProducts.length === 1
            ? "flex flex-col items-center"
            : "grid grid-cols-1 lg:grid-cols-2"
        }
      >
        {filteredProducts.slice(0, 2).map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            className={`relative group overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${filteredProducts.length === 1
              ? expandedItems[product.id]
                ? "w-full lg:w-[96vw] lg:max-w-[1920px] lg:flex lg:flex-row shadow-md"
                : "w-full lg:w-[60vw] lg:flex lg:flex-row shadow-md" // Changed from w-1/2 to flex-row with strip
              : ""
              }`}
            onMouseEnter={() => setHoveredProduct(product.id)}
            onMouseLeave={() => setHoveredProduct(null)}
          >
            {/* Image Section */}

            <div
              className={`relative bg-black overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${filteredProducts.length === 1
                ? expandedItems[product.id]
                  ? "h-[50vh] lg:h-[80vh] w-full lg:w-1/2"
                  : "h-[60vh] lg:h-[80vh] w-full lg:flex-1" // Fill available space minus strip
                : "h-[60vh] lg:h-[70vh] w-full"
                }`}
            >
              {/* Background Image */}

              <AnimatePresence initial={false}>
                <motion.div
                  key={currentImageIndex[product.id] || 0}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: hoveredProduct === product.id ? 1 : 0.75,
                    scale: hoveredProduct === product.id ? 1.1 : 1,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    opacity: { duration: 0.8, ease: "easeInOut" },

                    scale: { duration: 0.8 },
                  }}
                  className="absolute inset-0"
                >
                  <ImageWithFallback
                    src={
                      product.images
                        ? product.images[currentImageIndex[product.id] || 0]
                        : product.image
                    }
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Overlay */}

              <div
                className={`absolute inset-0 transition-all duration-500 ${hoveredProduct === product.id
                  ? "bg-black/50"
                  : "bg-gradient-to-t from-black/70 via-black/40 to-transparent"
                  }`}
              />

              {/* Image Slider Dots - Show on both mobile and desktop if product has images array */}

              {product.images && product.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 hidden sm:flex items-center gap-0.5 sm:gap-1">
                  {product.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation()

                        handleImageChange(product.id, idx)
                      }}
                      className={`rounded-full transition-all duration-300 ${(currentImageIndex[product.id] || 0) === idx
                        ? "bg-white w-1 h-1 sm:w-3 sm:h-0.5"
                        : "bg-white/50 hover:bg-white/75 w-0.5 h-0.5 sm:w-0.5 sm:h-0.5"
                        }`}
                      aria-label={`View image ${idx + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Content */}

              <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-8 md:p-12 pointer-events-none">
                {product.featured && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 bg-[#e58a4d] px-3 py-1.5 sm:px-4 sm:py-2 mb-3 sm:mb-4 self-start"
                  >
                    <Star size={12} className="text-white fill-white sm:w-[14px] sm:h-[14px]" />

                    <span
                      className="font-din-arabic text-white text-[10px] sm:text-xs"
                      style={{ letterSpacing: "0.15em" }}
                    >
                      FEATURED
                    </span>
                  </motion.div>
                )}

                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="font-american-typewriter text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-2 sm:mb-3"
                  style={{ letterSpacing: "0.05em" }}
                >
                  {product.name}
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="font-din-arabic text-white/90 text-xs sm:text-sm mb-3 sm:mb-4 max-w-md"
                  style={{ letterSpacing: "0.1em" }}
                >
                  {product.description}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-3 sm:gap-4"
                >
                  <span
                    className="font-din-arabic text-white text-base sm:text-lg"
                    style={{ letterSpacing: "0.1em" }}
                  >
                    ₹{product.price.toLocaleString()}
                  </span>

                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation()

                      toggleItemsExpanded(product.id)
                    }}
                    whileHover={{ x: 5 }}
                    className="inline-flex items-center gap-1.5 sm:gap-2 text-white border-b border-white/50 hover:border-white pb-1 transition-all pointer-events-auto"
                  >
                    <span
                      className="font-din-arabic text-xs sm:text-sm"
                      style={{ letterSpacing: "0.12em" }}
                    >
                      View Details
                    </span>

                    <ChevronRight size={14} className="sm:w-4 sm:h-4" />
                  </motion.button>
                </motion.div>
              </div>
            </div>

            {/* Collapsible What's Inside Section */}
            <div
              className={`bg-white/30 backdrop-blur-md border-[#e58a4d] transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${filteredProducts.length === 1
                ? expandedItems[product.id]
                  ? "border-t-2 lg:border-t-0 lg:border-l-2 w-full lg:w-1/2 flex flex-col max-h-[80vh] lg:h-auto"
                  : "border-t-2 lg:border-t-0 lg:border-l-2 w-full lg:w-[60px] flex flex-col lg:items-center lg:justify-center cursor-pointer hover:bg-white/40"
                : "border-t-2 w-full"
                }`}
              onClick={(e) => {
                if (filteredProducts.length === 1 && !expandedItems[product.id]) {
                  e.stopPropagation()
                  toggleItemsExpanded(product.id)
                }
              }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation()

                  toggleItemsExpanded(product.id)
                }}
                className={`w-full flex items-center justify-between py-4 sm:py-5 px-5 sm:px-8 md:px-12 transition-all duration-300 ${filteredProducts.length === 1 && !expandedItems[product.id]
                  ? "lg:p-0 lg:h-full lg:flex-col lg:items-center lg:justify-between lg:py-8 lg:w-full hover:bg-transparent" // Changed flow to col for arrow placement
                  : "hover:bg-white/40"
                  }`}
              >
                {/* Vertical Strip Arrow */}
                {filteredProducts.length === 1 && !expandedItems[product.id] && (
                  <div className="hidden lg:block mb-4 text-[#e58a4d]">
                    <ChevronRight size={16} strokeWidth={3} />
                  </div>
                )}

                <span
                  className={`font-din-arabic text-black text-xs sm:text-sm whitespace-nowrap transition-all duration-300 ${filteredProducts.length === 1 && !expandedItems[product.id]
                    ? "lg:-rotate-90 lg:text-base lg:tracking-[0.3em] lg:flex lg:items-center lg:mb-24"
                    : ""
                    }`}
                  style={{ letterSpacing: filteredProducts.length === 1 && !expandedItems[product.id] ? "0.3em" : "0.2em" }}
                >
                  WHAT'S INSIDE
                </span>

                <motion.div
                  animate={{ rotate: expandedItems[product.id] ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className={filteredProducts.length === 1 && !expandedItems[product.id] ? "lg:hidden" : ""}
                >
                  <ChevronDown size={18} className="sm:w-5 sm:h-5" />
                </motion.div>
              </button>

              <AnimatePresence>
                {expandedItems[product.id] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className={`overflow-hidden ${filteredProducts.length === 1 && expandedItems[product.id]
                      ? "lg:h-full lg:overflow-y-auto custom-scrollbar"
                      : ""
                      }`}
                  >
                    <div className="px-5 sm:px-8 md:px-12 pb-6 sm:pb-8 space-y-5 sm:space-y-6">
                      {/* Items List */}

                      {product.items && product.items.length > 0 && (
                        <ul className="space-y-2">
                          {product.items.map((item, idx) => (
                            <motion.li
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              className="font-din-arabic text-black/70 text-xs sm:text-sm flex items-start gap-2"
                              style={{ letterSpacing: "0.1em" }}
                            >
                              <span className="text-[#e58a4d] mt-1">•</span>

                              <span>{item}</span>
                            </motion.li>
                          ))}
                        </ul>
                      )}

                      {/* Candle Selection */}

                      {product.hasCandles && (
                        <div className="space-y-3 pt-4 border-t border-black/10">
                          <p
                            className="font-din-arabic text-black/70 text-[10px] sm:text-xs"
                            style={{ letterSpacing: "0.15em" }}
                          >
                            CHOOSE YOUR CANDLE
                          </p>

                          <div className="space-y-2">
                            {candleOptions.map((candle) => (
                              <label
                                key={candle.id}
                                className={`flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded cursor-pointer transition-all duration-200 ${selectedCandles[product.id] === candle.id
                                  ? "border border-[#e58a4d]"
                                  : "border border-transparent"
                                  }`}
                              >
                                <input
                                  type="radio"
                                  name={`candle-${product.id}`}
                                  value={candle.id}
                                  checked={selectedCandles[product.id] === candle.id}
                                  onChange={() => handleCandleSelect(product.id, candle.id)}
                                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 accent-[#e58a4d]"
                                />

                                <span
                                  className="font-din-arabic text-black/80 text-xs sm:text-sm"
                                  style={{ letterSpacing: "0.1em" }}
                                >
                                  {candle.name} ({candle.size})
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Personalized Notes */}

                      <div className="space-y-3 pt-4 border-t border-black/10">
                        <div className="flex items-center justify-between">
                          <p
                            className="font-din-arabic text-black/70 text-[10px] sm:text-xs"
                            style={{ letterSpacing: "0.15em" }}
                          >
                            PERSONALIZED NOTES
                          </p>

                          <p className="font-din-arabic text-black/50 text-[10px] sm:text-xs">
                            {personalMessages[product.id]?.length || 0}/
                            {product.id === "gift-set-hand-care-ritual" ? "500" : "250"}
                          </p>
                        </div>

                        <textarea
                          value={personalMessages[product.id] || ""}
                          onChange={(e) => handleMessageChange(product.id, e.target.value)}
                          placeholder={
                            product.id === "gift-set-hand-care-ritual"
                              ? "Add a message for your recipient, or tell us which items you would like wrapped"
                              : "Add a personal message to your gift..."
                          }
                          className="w-full p-3 sm:p-4 bg-white/30 border border-black/10 rounded resize-none font-din-arabic text-xs sm:text-sm text-black/80 placeholder:text-black/40 focus:outline-none focus:border-[#e58a4d] focus:bg-white/40 transition-all"
                          style={{ letterSpacing: "0.1em" }}
                          rows={3}
                          maxLength={product.id === "gift-set-hand-care-ritual" ? 500 : 250}
                        />
                      </div>

                      {/* Submit Button */}

                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation()

                          handleAddToCart(product)
                        }}
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-black text-white py-3.5 sm:py-4 px-5 sm:px-6 flex items-center justify-center gap-2 hover:bg-black/90 transition-all duration-300"
                      >
                        <span
                          className="font-din-arabic text-xs sm:text-sm"
                          style={{ letterSpacing: "0.15em" }}
                        >
                          ADD TO CART
                        </span>

                        <ChevronRight size={16} className="sm:w-[18px] sm:h-[18px]" />
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Value Proposition Ribbon */}

      <section className="py-2 bg-[#e58a4d] text-white mb-8 overflow-hidden">
        <div className="max-w-[90rem] mx-auto px-4">
          {/* Desktop: Static centered layout */}

          <div className="hidden sm:flex flex-wrap justify-center items-center gap-x-16 gap-y-2 text-center">
            {[
              { text: "Artisanal Gifting" },

              { text: "Personalized Notes" },

              { text: "Swift Delivery" },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <p className="font-din-arabic text-xs" style={{ letterSpacing: "0.2em" }}>
                  {item.text.toUpperCase()}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Mobile: Scrolling marquee effect */}

          <div className="sm:hidden relative">
            <motion.div
              animate={{ x: [0, -100] }}
              transition={{
                x: {
                  repeat: Infinity,

                  repeatType: "loop",

                  duration: 8,

                  ease: "linear",
                },
              }}
              className="flex gap-12 whitespace-nowrap"
            >
              {/* Repeat items 4 times for seamless loop */}

              {[...Array(4)].map((_, repeatIndex) => (
                <React.Fragment key={repeatIndex}>
                  {[
                    { text: "Artisanal Gifting" },

                    { text: "Personalized Notes" },

                    { text: "Swift Delivery" },
                  ].map((item, index) => (
                    <p
                      key={`${repeatIndex}-${index}`}
                      className="font-din-arabic text-xs"
                      style={{ letterSpacing: "0.2em" }}
                    >
                      {item.text.toUpperCase()}
                    </p>
                  ))}
                </React.Fragment>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Video Placeholder Section */}

      <VideoPlaceholderSection />
    </div>
  )
}

// Video Placeholder Section

function VideoPlaceholderSection() {
  return (
    <section className="relative min-h-[70vh] lg:min-h-[80vh] overflow-hidden py-20 sm:py-24 lg:py-32">
      {/* Video Placeholder Image */}

      <motion.div
        initial={{ scale: 1.1 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0"
      >
        <ImageWithFallback
          src={videoPlaceholderImage}
          alt="Gift presentation"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Gradient Overlay */}

      <div className="absolute inset-0 bg-black/60" />

      {/* Fragrance Library Content */}

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: 0.3 }}
        className="relative z-10 flex items-center justify-center px-8 sm:px-16 lg:px-24 pt-2 sm:pt-4 lg:pt-6"
      >
        <div className="max-w-6xl w-full">
          {/* Heading */}

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-american-typewriter text-white text-2xl sm:text-3xl lg:text-4xl mb-8 text-center"
            style={{ letterSpacing: "0.05em" }}
          >
            Need help picking the right fragrance?
          </motion.h2>

          {/* Subtitle */}

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="font-din-arabic text-white/90 text-sm sm:text-base mb-20 sm:mb-24 lg:mb-28 text-center max-w-3xl mx-auto"
            style={{ letterSpacing: "0.1em" }}
          >
            Explore our Fragrance Library — a quiet study of warm woods, resinous spices, and
            botanical notes.
          </motion.p>

          {/* Fragrance Grid */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16 lg:gap-20">
            {[
              {
                name: "Santal Pepper",

                description:
                  "Warm, spicy, and quietly intoxicating — a blend of cracked pepper, dry sandalwood, and soft resin.",
              },

              {
                name: "Oud Waters",

                description:
                  "Smoky oud meets cool mineral notes for a contemplative, almost meditative mood.",
              },

              {
                name: "Cedarwood Rose",

                description:
                  "Airy rose petals wrapped in dry cedar and a touch of resin — neither too sweet nor too crisp.",
              },

              {
                name: "Saffron Jasmine Amberwood",

                description:
                  "Luminous jasmine infused with warm amberwood and a soft thread of saffron  Bright, warm, and quietly opulent.",
              },
            ].map((fragrance, index) => (
              <motion.div
                key={fragrance.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                className="space-y-3"
              >
                <h3
                  className="font-american-typewriter text-white text-base sm:text-lg"
                  style={{ letterSpacing: "0.05em" }}
                >
                  {fragrance.name}
                </h3>

                <p
                  className="font-din-arabic text-white/80 text-sm leading-relaxed"
                  style={{ letterSpacing: "0.1em" }}
                >
                  {fragrance.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
