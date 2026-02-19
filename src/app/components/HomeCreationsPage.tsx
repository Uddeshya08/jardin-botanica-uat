"use client"

import { addToCartAction } from "@lib/data/cart-actions"
import { useCartItems } from "app/context/cart-items-context"
import { type LedgerItem, useLedger } from "app/context/ledger-context"
import { Heart } from "lucide-react"
import { motion } from "motion/react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import React, { useEffect, useMemo, useState, useTransition } from "react"
import { toast } from "sonner"
import { ImageWithFallback } from "./figma/ImageWithFallback"

export interface Product {
  id: string
  name: string
  subCategoryName: string // From Contentful subCategory name (e.g., "Candles", "Diffusers")
  price: number
  size: string
  description: string
  subtitle?: string
  image: string | null
  hoverImage?: string
  botanical: string
  property: string
  variants: Array<{
    id: string
    size: string
    price: number
  }>
}

interface HomeCreationsPageProps {
  products: Product[]
  filterOptions: string[] // Dynamic filter names from Contentful (e.g., ["Candles", "Diffusers"])
  isLoading?: boolean
  countryCode?: string
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

const EDITORIAL_IMAGE = "/assets/99b7e68b7e2b2dbbfbf85a52e8237ce212b58258.png"

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

// Helper function to convert product name to URL slug
function getProductSlug(productName: string): string {
  return productName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
}

export function HomeCreationsPage({
  products,
  filterOptions,
  isLoading = false,
  countryCode,
}: HomeCreationsPageProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>("all")
  const [recentlyAddedProducts, setRecentlyAddedProducts] = useState<Set<string>>(new Set())
  const searchParams = useSearchParams()
  const { toggleLedgerItem, isInLedger } = useLedger()
  const { cartItems, handleCartUpdate } = useCartItems()
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const filter = searchParams?.get("filter")
    console.log(filterOptions)
    if (filter && filterOptions.includes(filter)) {
      setSelectedFilter(filter)
    } else {
      setSelectedFilter("all")
    }
  }, [searchParams, filterOptions])

  const filteredProducts = useMemo(() => {
    if (selectedFilter === "all") {
      return products
    }
    return products.filter((product) => product.subCategoryName === selectedFilter)
  }, [selectedFilter, products])

  const categoryProductCounts = useMemo(() => {
    const counts: Record<string, number> = { all: products.length }
    filterOptions.forEach((category) => {
      counts[category] = products.filter((p) => p.subCategoryName === category).length
    })
    return counts
  }, [products, filterOptions])

  const handleToggleLedger = (product: Product) => {
    const alreadyInLedger = isInLedger(product.id)
    const ledgerItem: LedgerItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image || "",
      description: product.description,
      category: product.subCategoryName,
      size: product.size,
      botanical: product.botanical,
      property: product.property,
    }
    toggleLedgerItem(ledgerItem)
    toast.success(`${product.name} ${alreadyInLedger ? "removed from" : "added to"} Ledger`, {
      duration: 2000,
    })
  }

  const handleAddToCart = (product: Product) => {
    const itemId = product.id

    // Find the first variant (HomeCreations products have single size, use first variant)
    const variant = product.variants[0]
    const variantId = variant?.id

    // Check if item already exists in cart
    const existingItem = cartItems.find((cartItem) => cartItem.id === itemId)

    let item
    if (existingItem) {
      // Increase quantity of existing item
      item = {
        id: itemId,
        name: product.name,
        price: product.price,
        quantity: existingItem.quantity + 1,
        image: product.image,
        variant_id: variantId,
        metadata: { size: product.size, category: product.subCategoryName },
      }
      toast.success(`Quantity updated — ${product.name}`, {
        duration: 2000,
      })
    } else {
      // Add new item
      item = {
        id: itemId,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
        variant_id: variantId,
        metadata: { size: product.size, category: product.subCategoryName },
      }
      toast.success(`${product.name} added to cart`, {
        duration: 2000,
      })
    }

    // Add to recently added products for UI state
    setRecentlyAddedProducts((prev) => new Set(prev).add(itemId))

    // Reset the button state after 2 seconds
    setTimeout(() => {
      setRecentlyAddedProducts((prev) => {
        const newSet = new Set(prev)
        newSet.delete(itemId)
        return newSet
      })
    }, 2000)

    handleCartUpdate(item)

    // Server Action - persist cart to backend
    if (variantId) {
      startTransition(async () => {
        try {
          await addToCartAction({
            variantId,
            quantity: existingItem ? existingItem.quantity + 1 : 1,
            countryCode: countryCode || "in",
          })
        } catch (error) {
          console.error("Failed to add to cart on server:", error)
          toast.error("Failed to save to cart. Please try again.")
        }
      })
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#e3e3d8" }}>
      {/* Hero Banner */}
      <section className="relative h-screen sm:h-[65vh] lg:h-[75vh] overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full z-0"
        >
          <ImageWithFallback
            src={HERO_IMAGE}
            alt="Home Creations Collection"
            className="w-full h-full object-cover"
          />
        </motion.div>
        {/* Background Overlay - smooth natural gradient from top extending below center */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.65) 15%, rgba(0,0,0,0.50) 30%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.30) 55%, rgba(0,0,0,0.18) 65%, rgba(0,0,0,0.08) 75%, rgba(0,0,0,0.02) 85%, transparent 95%)",
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
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="font-din-arabic text-white/80 text-xs sm:text-sm mb-4 sm:mb-6 tracking-widest"
                style={{ letterSpacing: "0.2em" }}
              >
                BOTANICAL HOME FRAGRANCES
              </motion.p>
              <h1
                className="font-american-typewriter text-white text-3xl sm:text-4xl md:text-5xl lg:text-7xl mb-4 sm:mb-6"
                style={{ letterSpacing: "0.05em" }}
              >
                Home Creations
              </h1>
              <p
                className="font-din-arabic text-white/95 max-w-2xl mx-auto text-base sm:text-base lg:text-lg leading-relaxed px-4"
                style={{ letterSpacing: "0.1em" }}
              >
                Hand-poured candles and artisanal diffusers to create atmosphere, warmth, and an
                enduring sense of ease.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="py-6 sm:py-8 px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-20 border-b border-black/10">
        <div className="max-w-[90rem] mx-auto">
          <div className="flex justify-start">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-wrap gap-4 sm:gap-6"
            >
              {[
                { label: "All Products", value: "all" },
                ...filterOptions.map((name) => ({
                  label: name.charAt(0).toUpperCase() + name.slice(1),
                  value: name,
                })),
              ].map((filter) => {
                const productCount = categoryProductCounts[filter.value] || 0
                const isDisabled = filter.value !== "all" && productCount === 0
                return (
                  <button
                    key={filter.value}
                    onClick={() => !isDisabled && setSelectedFilter(filter.value)}
                    disabled={isDisabled}
                    className={`font-din-arabic text-sm transition-colors duration-300 ${isDisabled
                        ? "text-black/20"
                        : selectedFilter === filter.value
                          ? "text-black border-b border-black"
                          : "text-black/40 hover:text-black/70"
                      }`}
                    style={{ letterSpacing: "0.15em" }}
                  >
                    {filter.label}
                  </button>
                )
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Products Grid - First Set */}
      <section className="py-10 sm:py-14 lg:py-20">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 sm:gap-y-16 lg:gap-y-20  justify-items-center">
            {filteredProducts.slice(0, 3).map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                isInLedger={isInLedger}
                handleToggleLedger={handleToggleLedger}
                handleAddToCart={handleAddToCart}
                recentlyAddedProducts={recentlyAddedProducts}
                cartItems={cartItems}
              />
            ))}

            {filteredProducts.slice(3, 6).map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index + 3}
                isInLedger={isInLedger}
                handleToggleLedger={handleToggleLedger}
                handleAddToCart={handleAddToCart}
                recentlyAddedProducts={recentlyAddedProducts}
                cartItems={cartItems}
              />
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 sm:gap-y-16 lg:gap-y-20 mb-5 justify-items-center"></div>

            {/* First Feature Section */}
            {fullWidthFeatures[0] && filteredProducts.length > 6 && (
              <FullWidthFeatureSection feature={fullWidthFeatures[0]} />
            )}

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
                    recentlyAddedProducts={recentlyAddedProducts}
                    cartItems={cartItems}
                  />
                ))}
              </div>
            )}

            {/* Second Feature Section */}
            {fullWidthFeatures[1] && filteredProducts.length > 6 && (
              <FullWidthFeatureSection feature={fullWidthFeatures[1]} />
            )}

            {/* Home Fragrance Ritual Section */}
            <HomeFragranceRitualSection />
          </div>
        </section>
      )}
    </div>
  )
}

interface ProductCardProps {
  product: Product
  index: number
  isInLedger: (id: string) => boolean
  handleToggleLedger: (product: Product) => void
  handleAddToCart: (product: Product) => void
  recentlyAddedProducts: Set<string>
  cartItems: any[]
}

function ProductCard({
  product,
  index,
  isInLedger,
  handleToggleLedger,
  handleAddToCart,
  recentlyAddedProducts,
  cartItems,
}: ProductCardProps) {
  const [isImageHovered, setIsImageHovered] = useState(false)
  const isRecentlyAdded = recentlyAddedProducts.has(product.id)
  const [isButtonHovered, setIsButtonHovered] = useState(false)
  const productSlug = getProductSlug(product.name)

  // Check if item is in cart
  // Check both variant ID and product ID
  const itemId = product.id
  const variantId = product.variants[0]?.id
  const isInCart = cartItems.some(
    (item) => item.id === itemId || (variantId && item.variant_id === variantId)
  )

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
      <Link href={`/products/${productSlug}`}>
        <div
          className="relative w-full overflow-hidden cursor-pointer"
          style={{ aspectRatio: "3/4", marginBottom: "1.5rem" }}
          onMouseEnter={() => setIsImageHovered(true)}
          onMouseLeave={() => setIsImageHovered(false)}
        >
          {/* Hover Image - Behind */}
          <div
            className="absolute inset-0 transition-opacity duration-700 ease-in-out"
            style={{ opacity: isImageHovered ? 1 : 0 }}
          >
            {product.hoverImage && (
              <ImageWithFallback
                src={product.hoverImage}
                alt={`${product.name} alternate view`}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Main Image - On Top */}
          <div
            className="absolute inset-0 transition-opacity duration-700 ease-in-out"
            style={{ opacity: isImageHovered && product.hoverImage ? 0 : 1 }}
          >
            <ImageWithFallback
              src={product.image || ""}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Ledger Icon - Always Visible */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleToggleLedger(product)
            }}
            className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 z-10 ${isInLedger(product.id)
                ? "bg-white/20 border border-white/30"
                : "bg-white/20 border border-white/30 hover:bg-white/30"
              }`}
            aria-label={`${isInLedger(product.id) ? "Remove from" : "Add to"} ledger`}
          >
            <Heart
              size={18}
              className={`transition-colors duration-300 ${isInLedger(product.id) ? "fill-[#e58a4d] stroke-[#e58a4d]" : "stroke-white fill-none"}`}
            />
          </motion.button>
        </div>
      </Link>

      {/* Product Info */}
      <div className="flex flex-col flex-grow">
        <Link href={`/products/${productSlug}`}>
          <div>
            <h3
              className="font-american-typewriter text-xl mb-1 hover:opacity-70 transition-opacity cursor-pointer"
              style={{ letterSpacing: "0.05em" }}
            >
              {product.name}
            </h3>
            <p
              className="font-din-arabic text-black/60 text-sm mb-2"
              style={{ letterSpacing: "0.1em" }}
            >
              {product.size}
            </p>
          </div>
        </Link>

        {product.description ? (
          <p
            className="font-din-arabic text-black/70 leading-relaxed mt-3"
            style={{ letterSpacing: "0.1em" }}
          >
            {product.description.split(".")[0]}.
          </p>
        ) : product.subtitle ? (
          <p
            className="font-din-arabic text-black/70 leading-relaxed mt-3"
            style={{ letterSpacing: "0.1em" }}
          >
            {product.subtitle}
          </p>
        ) : null}

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
              className="group/btn relative inline-flex items-center gap-2 pb-0.5 cursor-pointer"
            >
              <span
                className="font-din-arabic text-black text-base sm:text-sm"
                style={{ letterSpacing: "0.12em" }}
              >
                {isRecentlyAdded ? "In cart" : "Add to cart"}
              </span>
              <span className="text-black text-base sm:text-sm">{isRecentlyAdded ? "✓" : "→"}</span>

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
        <motion.div
          initial={{ scale: 1.05 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full z-0"
        >
          <ImageWithFallback
            src={EDITORIAL_IMAGE}
            alt="Creating atmosphere through fragrance"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Background Overlay - smooth natural gradient from top extending below center */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.65) 15%, rgba(0,0,0,0.50) 30%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.30) 55%, rgba(0,0,0,0.18) 65%, rgba(0,0,0,0.08) 75%, rgba(0,0,0,0.02) 85%, transparent 95%)",
          }}
        />

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
              className="font-din-arabic text-white/95 text-sm sm:text-base md:text-lg leading-relaxed mb-8 sm:mb-12"
              style={{ letterSpacing: "0.1em" }}
            >
              Each scent tells a story — of sandalwood in summer light, oud drifting through mist
              and rain, and saffron fields at dusk. These memories of places and seasons shape
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
              <span
                className="font-din-arabic text-white text-sm"
                style={{ letterSpacing: "0.15em" }}
              >
                Read the guide
              </span>
              <motion.span
                className="text-white"
                animate={{ x: [0, 5, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
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
      <div
        className={`grid grid-cols-1 lg:grid-cols-2 ${feature.imagePosition === "right" ? "" : "lg:grid-flow-dense"}`}
      >
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={`relative aspect-[4/3] sm:aspect-[3/2] lg:aspect-auto lg:min-h-[500px] overflow-hidden ${feature.imagePosition === "left" ? "lg:col-start-1" : "lg:col-start-2"
            }`}
        >
          <ImageWithFallback
            src={feature.image}
            alt={feature.title}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{
            opacity: 0,
            x: feature.imagePosition === "left" ? 40 : -40,
          }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className={`flex items-center bg-white/10 p-8 sm:p-12 lg:p-20 ${feature.imagePosition === "left" ? "lg:col-start-2 lg:row-start-1" : "lg:col-start-1 lg:row-start-1"}`}
        >
          <div className="max-w-md">
            <p
              className="font-din-arabic text-black/50 text-xs mb-3 sm:mb-4"
              style={{ letterSpacing: "0.2em" }}
            >
              {feature.subtitle.toUpperCase()}
            </p>

            <h2
              className="font-american-typewriter text-2xl sm:text-3xl lg:text-4xl mb-4 sm:mb-6"
              style={{ letterSpacing: "0.05em" }}
            >
              {feature.title}
            </h2>

            <p
              className="font-din-arabic text-black/70 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8"
              style={{ letterSpacing: "0.1em" }}
            >
              {feature.description}
            </p>

            <motion.button
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
              className="group inline-flex items-center gap-3"
            >
              <span
                className="font-din-arabic text-black text-sm border-b border-black/30 group-hover:border-black transition-colors pb-0.5"
                style={{ letterSpacing: "0.15em" }}
              >
                {feature.ctaText}
              </span>
              <motion.span
                className="text-black"
                animate={{ x: [0, 5, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
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
          <p
            className="font-din-arabic text-black/50 text-xs mb-4"
            style={{ letterSpacing: "0.2em" }}
          >
            THE RITUAL
          </p>

          <h1
            className="font-american-typewriter text-2xl sm:text-3xl lg:text-4xl mb-6"
            style={{ letterSpacing: "0.05em" }}
          >
            A home fragrance ritual
          </h1>

          <p
            className="font-din-arabic text-black/70 leading-relaxed max-w-2xl mx-auto"
            style={{ letterSpacing: "0.1em" }}
          >
            A mindful approach to scenting your sanctuary, designed to create atmosphere, evoke
            emotion, and transform spaces.
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
              {index < ritualSteps.length - 1 && (
                <div
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(96, 95, 95, 0.15), rgba(186, 181, 181, 0.1))",
                  }}
                  className="absolute left-5 top-14 w-px h-full bg-gradient-to-b from-black/10 to-transparent hidden sm:block"
                />
              )}

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
                    <span
                      className="font-american-typewriter text-sm text-black/40 group-hover:text-black/60 transition-colors duration-300"
                      style={{ letterSpacing: "0.05em" }}
                    >
                      {step.step}
                    </span>
                  </div>
                </motion.div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <h3
                    className="font-american-typewriter text-xl lg:text-2xl mb-4"
                    style={{ letterSpacing: "0.05em" }}
                  >
                    {step.title}
                  </h3>

                  <p
                    className="font-din-arabic text-black/70 leading-relaxed max-w-2xl"
                    style={{ letterSpacing: "0.1em" }}
                  >
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
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 lg:mt-20 relative"
        >
          <div className="relative aspect-[16/9] lg:aspect-[21/9] overflow-hidden">
            <motion.div
              initial={{ scale: 1.1 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              <ImageWithFallback
                src={EDITORIAL_IMAGE}
                alt="Home fragrance ritual"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Overlay Text */}
            <div
              className="absolute inset-0 z-10 p-8 lg:p-12"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.65) 15%, rgba(0,0,0,0.50) 30%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.22) 55%, rgba(0,0,0,0.12) 65%, rgba(0,0,0,0.05) 75%, transparent 85%)",
              }}
            >
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 1.1 }}
                className="font-din-arabic text-white/80 text-xs absolute top-8 right-8 lg:top-12 lg:right-12 z-20"
                style={{ letterSpacing: "0.2em" }}
              >
                NOTE FROM THE BOTANIST'S LAB
              </motion.p>
              <div className="flex items-center justify-center h-full">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 1.2 }}
                  className="font-american-typewriter text-white/95 text-xl lg:text-3xl text-center max-w-3xl z-20"
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
