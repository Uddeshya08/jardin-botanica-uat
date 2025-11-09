"use client"

import React, { useTransition, useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { ChevronLeft, ChevronRight, Star, Heart, Share2, Plus, Minus, Home, ChevronRight as BreadcrumbChevron } from 'lucide-react';

import { IoIosArrowDown } from "react-icons/io";
import { InfoPanel } from "./InfoPanel"
import { addToCartAction } from "@lib/data/cart-actions"
import { useRouter } from "next/navigation"
import { emitCartUpdated } from "@lib/util/cart-client"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Label } from "./ui/label"
import { useLedger, LedgerItem } from "app/context/ledger-context"
import { toast } from "sonner"

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";

interface CartItem {
  id: string
  name: string
  price: number // minor units
  quantity: number
  image?: string
  isRitualProduct?: boolean
}

interface ProductHeroProps {
  product: {
    id: string
    title: string
    subtitle?: string
    description?: string
    thumbnail?: string
    images?: { url: string }[]
    options?: Array<{
      id: string
      title?: string
    }>
    variants: Array<{
      id: string
      title?: string
      calculated_price?: { calculated_amount?: number; currency_code?: string }
      options?: Array<{
        option_id: string
        value: string
      }>
    }>
  }
  countryCode: string
  onCartUpdate?: (item: CartItem | null) => void
}

const extractNumericSize = (label: string) => {
  const match = label?.toLowerCase().match(/([\d.]+)\s*(ml|l|g|kg|oz)?/)
  if (!match) {
    return Number.MAX_SAFE_INTEGER
  }

  const value = parseFloat(match[1])
  const unit = match[2]

  if (!unit || unit === "ml" || unit === "g" || unit === "oz") {
    return value
  }

  if (unit === "l") {
    return value * 1000
  }

  if (unit === "kg") {
    return value * 1000
  }

  return value
}

const buildSizeOptions = (
  product: ProductHeroProps["product"],
  sizeOptionId?: string
) => {
  return (product.variants || [])
    .map((variant) => {
      const label = sizeOptionId
        ? variant?.options?.find((opt) => opt.option_id === sizeOptionId)?.value ??
          variant?.title ??
          ""
        : variant?.title ??
          variant?.options?.[0]?.value ??
          ""

      return label
        ? {
            id: variant.id,
            label,
          }
        : null
    })
    .filter((option): option is { id: string; label: string } => Boolean(option))
    .sort((a, b) => extractNumericSize(a.label) - extractNumericSize(b.label))
}

const isRecognizedSizeLabel = (label: string) =>
  extractNumericSize(label) !== Number.MAX_SAFE_INTEGER

export function ProductHero({
  product,
  countryCode,
  onCartUpdate,
}: ProductHeroProps) {
  const [isRitualPanelOpen, setIsRitualPanelOpen] = useState(false)
  const [isActivesPanelOpen, setIsActivesPanelOpen] = useState(false)
  const [isFragranceNotesOpen, setIsFragranceNotesOpen] = useState(false)
  const [isIngredientsPanelOpen, setIsIngredientsPanelOpen] = useState(false)

  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isAddedToCart, setIsAddedToCart] = useState(false)
  const [adding, setAdding] = useState(false)
  const [uiError, setUiError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const { toggleLedgerItem, isInLedger } = useLedger()
  const sizeOptionId = product.options?.find(
    (option) => (option?.title || "").toLowerCase() === "size"
  )?.id
  const sizeOptions = useMemo(
    () => buildSizeOptions(product, sizeOptionId),
    [product, sizeOptionId]
  )
  const visibleSizeOptions = useMemo(() => {
    const seen = new Map<string, { id: string; label: string }>()

    sizeOptions.forEach((option) => {
      const key = option.label.trim().toLowerCase()
      if (!seen.has(key)) {
        seen.set(key, option)
      }
    })

    return Array.from(seen.values())
  }, [sizeOptions])
  const defaultVariantId = useMemo(() => {
    if (!product.variants?.length) {
      return null
    }

    if (!visibleSizeOptions.length) {
      return product.variants[0]?.id ?? null
    }

    const preferredOption =
      visibleSizeOptions.find((option) =>
        option.label.replace(/\s+/g, "").toLowerCase().includes("500ml")
      ) ?? visibleSizeOptions[visibleSizeOptions.length - 1]

    return preferredOption?.id ?? product.variants[0]?.id ?? null
  }, [product, visibleSizeOptions])
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    defaultVariantId
  )
  useEffect(() => {
    setSelectedVariantId(defaultVariantId)
  }, [defaultVariantId])
  const selectedVariant = product.variants?.find((v) => v.id === selectedVariantId) ?? product.variants?.[0]
  const minorAmount = selectedVariant?.calculated_price?.calculated_amount ?? 0

  const fallbackImg = product.thumbnail ?? "/assets/productImage.png"
  const imgs = product.images?.map((i) => i.url).filter(Boolean) ?? []
  const productImages = imgs.length ? imgs : [fallbackImg]

  const selectedSizeLabel = visibleSizeOptions.find((opt) => opt.id === selectedVariantId)?.label
  const uniqueSizeLabels = useMemo(
    () => Array.from(new Set(visibleSizeOptions.map((option) => option.label.toLowerCase()))),
    [visibleSizeOptions]
  )
  const shouldShowSizeOptions =
    visibleSizeOptions.length > 1 &&
    uniqueSizeLabels.every(isRecognizedSizeLabel)

  // Check if the product is a cleanser or exfoliant
  const isCleanserOrExfoliant = () => {
    const title = product.title?.toLowerCase() || ""
    const handle = (product as any).handle?.toLowerCase() || ""

    // Check for cleanser/exfoliant keywords
    const keywords = ["cleanser", "exfoliant", "hand wash", "handwash", "scrub", "cleansing"]
    const canSeeActives = keywords.some(keyword =>
      title.includes(keyword) || handle.includes(keyword)
    )

    // Exclude candles and fragrances
    const excludeKeywords = ["candle", "fragrance", "scent", "bloom", "cedar"]
    const isExcluded = excludeKeywords.some(keyword =>
      title.includes(keyword) || handle.includes(keyword)
    )

    return canSeeActives && !isExcluded
  }

  // Dynamic breadcrumb label based on product type
  const breadcrumbLeafLabel = isCleanserOrExfoliant()
    ? "Cleansers & Exfoliants"
    : "Lotions & Moisturisers"

  const handleAddToCart = () => {
    if (!selectedVariantId || adding || isPending) return

    // instant UI — don’t block on network
    setAdding(true)
    setUiError(null)
    setIsAddedToCart(true)

    // optimistic nav/sticky updates if parent listens (regular product - no image in nav)
    onCartUpdate?.({
      id: selectedVariantId,
      name: product.title,
      price: minorAmount,
      quantity,
      image: fallbackImg,
      isRitualProduct: false,
    })
    emitCartUpdated({ quantityDelta: quantity })

    // network in the background
    startTransition(async () => {
      try {
        await addToCartAction({
          variantId: selectedVariantId,
          quantity,
          countryCode: (countryCode || "in").toLowerCase(),
        })
      } catch (e: any) {
        // roll back optimistic message
        setIsAddedToCart(false)
        setUiError(e?.message || "Could not add to cart")
        console.error(e)
      } finally {
        // keep the checkmark visible briefly, then clear
        setTimeout(() => {
          setAdding(false)
          setIsAddedToCart(false)
        }, 900)
      }
    })
  }

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity)
    // keep parent UI synced while changing qty (optional)
    if (selectedVariantId) {
      onCartUpdate?.({
        id: selectedVariantId,
        name: product.title,
        price: minorAmount,
        quantity: newQuantity,
        image: fallbackImg,
        isRitualProduct: false,
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

  const handleToggleLedger = () => {
    const alreadyInLedger = isInLedger(product.id)
    const ledgerItem: LedgerItem = {
      id: product.id,
      name: product.title,
      price: minorAmount,
      image: productImages[0] ?? fallbackImg,
      description: product.subtitle ?? product.description ?? "",
      size: selectedSizeLabel,
      availableSizes: visibleSizeOptions.map((opt) => opt.label),
      selectedVariantId,
      variants: product.variants,
      countryCode,
    }

    toggleLedgerItem(ledgerItem)
    toast.success(`${product.title} ${alreadyInLedger ? "Removed From" : "Added To"} Ledger`, {
      duration: 2000,
    })
  }

  const isProductInLedger = isInLedger(product.id)


  return (
    <div className="flex flex-col-reverse lg:flex-row pl-0 md:pl-8 lg:pl-16 xl:pl-15 relative overflow-hidden" style={{ paddingTop: "80px", minHeight: "35vh" }}>
      {/* LEFT: (content) */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full lg:w-[40%] flex items-center py-8 md:py-12 px-4 md:px-0 relative overflow-hidden"
        style={{ backgroundColor: "#e3e3d8" }}
      >
        <div className="space-y-6 max-w-lg relative z-10">
          {/* Breadcrumbs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/${countryCode}`} className="font-din-arabic text-xs tracking-wide flex items-center" style={{ color: '#a28b6f' }}>
                    <Home className="w-3 h-3 mr-1" />
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <BreadcrumbChevron className="w-3 h-3" style={{ color: '#a28b6f' }} />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#" className="font-din-arabic text-xs tracking-wide" style={{ color: '#a28b6f' }}>
                    Body & Hands
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <BreadcrumbChevron className="w-3 h-3" style={{ color: '#a28b6f' }} />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-din-arabic text-xs tracking-wide text-black/80">
                    {breadcrumbLeafLabel}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </motion.div>
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-american-typewriter text-2xl md:text-3xl tracking-tight text-black relative"
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
              className="font-din-arabic text-black leading-relaxed mb-4"
            >
              {product.subtitle}
            </motion.p>
          )}

          {/* Size Selection with Radio Buttons */}
          {shouldShowSizeOptions && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="space-y-3 pb-0 pt-3"
            >
              <h3 className="font-din-arabic text-sm tracking-wider uppercase" style={{ color: '#a28b6f' }}>
                SIZE
              </h3>
              <RadioGroup 
                value={selectedVariantId ?? ""}
                onValueChange={(value) => setSelectedVariantId(value)}
                className="!flex flex-row gap-6"
              >
                {visibleSizeOptions.map((opt) => (
                  <div key={opt.id} className="flex items-center gap-2">
                    <RadioGroupItem
                      value={opt.id}
                      id={`size-${opt.id}`}
                      className="peer size-4 border-2 border-black/40 data-[state=checked]:border-[#00000066]"
                    />
                    <Label
                      htmlFor={`size-${opt.id}`}
                      className="font-din-arabic text-black cursor-pointer"
                    >
                      {opt.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </motion.div>
          )}

          {/* Price */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="space-y-2 pb-4 pt-2"
          >
            <p className="font-din-arabic-bold text-2xl md:text-3xl text-black mt-4">
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
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <div className="relative w-full sm:w-auto">
                <select
                  value={quantity.toString()}
                  onChange={(e) =>
                    handleQuantityChange(parseInt(e.target.value))
                  }
                  className="font-din-arabic appearance-none bg-transparent border border-black/30 px-4 py-3 pr-8 text-black focus:outline-none focus:border-black transition-colors w-full sm:min-w-[80px]"
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={(i + 1).toString()}>
                      {(i + 1).toString()}
                    </option>
                  ))}
                </select>
                <IoIosArrowDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-black/60 pointer-events-none" />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className="font-din-arabic px-6 md:px-8 py-3 bg-black text-white hover:bg-black/90 transition-all duration-300 tracking-wide relative overflow-hidden w-full sm:w-auto"
                disabled={!selectedVariantId || adding || isPending}
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
              {uiError && (
                <p className="text-xs mt-2" style={{ color: "#b42318" }}>
                  {uiError}
                </p>
              )}
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
              <p className="font-din-arabic text-sm md:text-base text-black/80 leading-relaxed py-4">
                {product.description}
              </p>
            </motion.div>
          )}

          {/* Separator line before Ritual in Practice */}
          {isCleanserOrExfoliant() && (<motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="w-full h-px origin-left"
            style={{ backgroundColor: "rgba(185, 168, 147, 0.22)" }}
          />)}

          {/* Collapsible Ritual in Practice */}
          {isCleanserOrExfoliant() && (<motion.div
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
                Ritual in Practice
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
          </motion.div>)}

          {/* Separator line before Actives & Key Botanicals */}
          {isCleanserOrExfoliant() && (
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="w-full h-px origin-left"
              style={{ backgroundColor: "rgba(185, 168, 147, 0.22)" }}
            />)}

          {/* Collapsible Actives & Key Botanicals - Only show for cleansers and exfoliants */}
          {isCleanserOrExfoliant() && (
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
                  Actives & Key Botanicals
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
          )}

          {/* Separator line before Fragrance Notes */}
          {isCleanserOrExfoliant() && (<motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            className="w-full h-px origin-left"
            style={{ backgroundColor: "rgba(185, 168, 147, 0.22)" }}
          />)}

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
                Fragrance Profile
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
          {isCleanserOrExfoliant() && (<motion.div
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
                Full Ingredients
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
          </motion.div>)}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full lg:w-[60%] relative flex items-center justify-center py-6 overflow-hidden"
        style={{ backgroundColor: '#d6d6c6' }}
      >
        {/* Botanical Blend Badge - Top Left */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="absolute top-8 left-8 z-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
            <Star className="w-3 h-3" style={{ color: '#a28b6f' }} />
            <span className="font-din-arabic text-xs tracking-wide" style={{ color: '#a28b6f' }}>BOTANICAL BLEND</span>
          </div>
        </motion.div>

        {/* Action Icons - Positioned at top-right above product image */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="absolute top-8 right-8 flex items-center gap-4 z-20"
        >
          {/* Favorite/Wishlist Icon */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleLedger}
            className={`p-2 transition-all bg-white/20 backdrop-blur-sm rounded-full border border-white/30 hover:bg-white/30 ${isProductInLedger ? "text-[#e58a4d]" : "text-black/60 hover:text-black"}`}
            aria-label={isProductInLedger ? "Remove from ledger" : "Add to ledger"}
          >
            <Heart className={`w-5 h-5 transition-colors ${isProductInLedger ? "fill-[#e58a4d] stroke-[#e58a4d]" : "stroke-current"}`} />
          </motion.button>

          {/* Share Icon */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 text-black/60 hover:text-black transition-colors bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30"
          >
            <Share2 className="w-5 h-5" />
          </motion.button>
        </motion.div>


        {/* Enhanced Previous Arrow */}
        <motion.button
          whileHover={{
            scale: 1.1,
            backgroundColor: 'rgba(162, 139, 111, 0.1)'
          }}
          whileTap={{ scale: 0.9 }}
          onClick={handlePrevImage}
          className="absolute left-8 top-1/2 transform -translate-y-1/2 z-10 p-4 rounded-full text-black/60 hover:text-black transition-all backdrop-blur-sm"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>

        {/* Product Image - Static & Bigger */}
        <div className="relative max-w-4xl mx-auto">
          <img
            src={productImages[currentImageIndex]}
            alt="Jardin Botanica Tea Exfoliant Rinse"
            className="w-full h-auto object-contain mx-auto relative z-10"
            style={{
              maxHeight: '500px', // Reduced for more compact hero section
              filter: 'drop-shadow(0 20px 45px rgba(0, 0, 0, 0.15))'
            }}
          />

          {/* Enhanced shadow for bigger image */}
          <div
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-8 w-3/4 h-10 rounded-full blur-2xl"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.18)',
              background: 'radial-gradient(ellipse, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, 0.12) 50%, transparent 100%)'
            }}
          />
        </div>

        {/* Enhanced Next Arrow */}
        <motion.button
          whileHover={{
            scale: 1.1,
            backgroundColor: 'rgba(162, 139, 111, 0.1)'
          }}
          whileTap={{ scale: 0.9 }}
          onClick={handleNextImage}
          className="absolute right-8 top-1/2 transform -translate-y-1/2 z-10 p-4 rounded-full text-black/60 hover:text-black transition-all backdrop-blur-sm"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6" />
        </motion.button>

        {/* Enhanced Image Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {productImages.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${currentImageIndex === index ? 'w-8' : ''
                }`}
              style={{
                backgroundColor: currentImageIndex === index ? '#a28b6f' : 'rgba(0, 0, 0, 0.3)'
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
        title="Ritual in Practice"
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
        title="Actives & Key Botanicals"
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
        title="Fragrance Profile"
      >
        <div className="space-y-4">
          <div className="group">
            <span className="font-din-arabic text-black inline">
              Top Notes —{" "}
            </span>
            <span className="font-din-arabic text-black/70 group-hover:text-black transition-colors">
              Fresh Pine
            </span>
          </div>
          <div className="group">
            <span className="font-din-arabic text-black inline">
              Heart Notes —{" "}
            </span>
            <span className="font-din-arabic text-black/70 group-hover:text-black transition-colors">
              Resinous Balsam
            </span>
          </div>
          <div className="group">
            <span className="font-din-arabic text-black inline">
              Base Notes —{" "}
            </span>
            <span className="font-din-arabic text-black/70 group-hover:text-black transition-colors">
              Grounded Cedarwood
            </span>
          </div>
        </div>
      </InfoPanel>
      <InfoPanel
        isOpen={isIngredientsPanelOpen}
        onClose={() => setIsIngredientsPanelOpen(false)}
        title="Full Ingredients"
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
