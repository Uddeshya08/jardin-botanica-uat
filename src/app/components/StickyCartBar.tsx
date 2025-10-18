"use client"

import React, { useMemo, useState, useTransition } from "react"
import { motion, AnimatePresence } from "motion/react"
import { ShoppingBag, Plus, Minus } from "lucide-react"
import type { HttpTypes } from "@medusajs/types"
import { useParams } from "next/navigation"
import { addToCartAction } from "@lib/data/cart-actions"
import { emitCartUpdated } from "@lib/util/cart-client"

type ProductLike = Partial<HttpTypes.StoreProduct> & { metadata?: Record<string, any> }

interface RitualProduct {
  variantId: string
  name: string
  price: number
  currency: string
  image?: string
  isRitualProduct?: boolean
}

interface StickyCartBarProps {
  isVisible: boolean
  product?: ProductLike | null
  heroCartItem?: any
  onUpdateHeroQuantity?: (quantity: number) => void
  onCartUpdate?: (item: any | null) => void
  cartItems?: any[]
  ritualProduct?: RitualProduct | null
}

/* ————— helpers ————— */
function pickVariant(p?: ProductLike) {
  return Array.isArray(p?.variants) && p!.variants[0] ? p!.variants[0] : undefined
}
function getMinorPrice(v: any): number {
  const calc = v?.calculated_price?.calculated_amount
  if (typeof calc === "number") return calc
  const amt =
    Array.isArray(v?.prices) && typeof v.prices[0]?.amount === "number"
      ? v.prices[0].amount
      : 0
  return amt
}
function formatMinor(minor: number, currencyCode: string) {
  try {
    // Medusa uses minor units already; if you store major units, adjust here.
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currencyCode,
      maximumFractionDigits: 0,
    }).format(minor)
  } catch {
    const sym = currencyCode.toUpperCase() === "INR" ? "₹" : ""
    return `${sym}${Math.round(minor)}`
  }
}

export function StickyCartBar({
  isVisible,
  product,
  heroCartItem,
  onUpdateHeroQuantity,
  onCartUpdate,
  cartItems = [],
  ritualProduct,
}: StickyCartBarProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAddedToCart, setIsAddedToCart] = useState(false)
  const [adding, setAdding] = useState(false)
  const [uiError, setUiError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [previouslyQualified, setPreviouslyQualified] = useState(false)
  const [justUnlocked, setJustUnlocked] = useState(false)
  const [ritualCompleted, setRitualCompleted] = useState(false)
  const [showGoToCart, setShowGoToCart] = useState(false)

  // read /[countryCode]/... from route, fallback to "in"
  const params = useParams() as any
  const countryCode: string = (params?.countryCode ?? "in").toString().toLowerCase()

  const variant = useMemo(() => pickVariant(product ?? undefined), [product])
  const minor = useMemo(() => getMinorPrice(variant), [variant])
  const currency =
    (variant?.calculated_price?.currency_code ??
      (variant as any)?.prices?.[0]?.currency_code ??
      "inr").toUpperCase()

  const name = product?.title ?? "Product"
  const image =
    (Array.isArray(product?.images) && product!.images[0]?.url) || product?.thumbnail

  const shippingThresholdMinor = 2500 // you appear to treat prices as whole rupees already
  const currentTotalMinor = minor * quantity
  const qualifiesShipping = currentTotalMinor >= shippingThresholdMinor

  // Debug logging
  // console.log("=== StickyCartBar Debug ===")
  // console.log("Ritual Product:", ritualProduct)
  // console.log("Current Total:", currentTotalMinor)
  // console.log("Qualifies Shipping:", qualifiesShipping)
  // console.log("Ritual Completed:", ritualCompleted)
  // console.log("Show Go To Cart:", showGoToCart)

  const handleQuantityChange = (delta: number) => {
    const next = Math.min(10, Math.max(1, quantity + delta))
    setQuantity(next)
    onUpdateHeroQuantity?.(next)
    
    // Check if this change unlocks shipping
    const nextTotal = minor * next
    const willQualify = nextTotal >= shippingThresholdMinor
    
    if (!previouslyQualified && willQualify) {
      setJustUnlocked(true)
      setTimeout(() => setJustUnlocked(false), 3000)
    }
    
    setPreviouslyQualified(willQualify)
  }

  const addFromSticky = () => {
    if (!variant?.id || adding || isPending) return

    setAdding(true)
    setUiError(null)
    setIsAddedToCart(true)

    // Check if item already exists in cart
    const productId = product?.id ?? variant.id
    const existingItem = cartItems.find((item) => item.id === productId || item.variant_id === variant.id)
    
    // optimistic updates for nav / other UIs
    if (existingItem) {
      // If item exists, update quantity
      onCartUpdate?.({
        ...existingItem,
        quantity: existingItem.quantity + quantity,
      })
    } else {
      // If item doesn't exist, add as new (regular product - no image in nav)
      onCartUpdate?.({
        id: productId,
        variant_id: variant.id,
        name,
        price: minor,
        quantity,
        image,
        isRitualProduct: false,
      })
    }
    
    emitCartUpdated({ quantityDelta: quantity })

    // background network
    startTransition(async () => {
      try {
        await addToCartAction({ variantId: variant.id, quantity, countryCode })
      } catch (e: any) {
        // rollback visual success
        setIsAddedToCart(false)
        setUiError(e?.message || "Could not add to cart")
        console.error("Add to cart failed:", e)
      } finally {
        // brief hold to show "Added" then reset visuals
        setTimeout(() => {
          setAdding(false)
          setIsAddedToCart(false)
        }, 800)
      }
    })
  }

  const completeRitual = () => {
    if (!ritualProduct?.variantId || !variant?.id || adding || isPending || ritualCompleted) return

    setAdding(true)
    setUiError(null)
    setRitualCompleted(true)

    const productId = product?.id ?? variant.id

    // Add main product to cart first (no image in nav)
    onCartUpdate?.({
      id: productId,
      variant_id: variant.id,
      name,
      price: minor,
      quantity,
      image,
      isRitualProduct: false,
    })

    // Then add ritual product to cart (with image in nav)
    onCartUpdate?.({
      id: ritualProduct.variantId,
      variant_id: ritualProduct.variantId,
      name: ritualProduct.name,
      price: ritualProduct.price,
      quantity: 1,
      image: ritualProduct.image,
      isRitualProduct: true,
    })
    
    emitCartUpdated({ quantityDelta: quantity + 1 })

    // background network - add both products
    startTransition(async () => {
      try {
        // Add main product first
        await addToCartAction({ 
          variantId: variant.id, 
          quantity, 
          countryCode 
        })
        
        // Then add ritual product
        try {
          await addToCartAction({ 
            variantId: ritualProduct.variantId, 
            quantity: 1, 
            countryCode 
          })
          
          // Show "Go to Cart" button after successful addition
          setShowGoToCart(true)
          setJustUnlocked(true)
          setTimeout(() => setJustUnlocked(false), 3000)
        } catch (ritualError: any) {
          // If ritual product fails, still show success for main product but inform user
          console.error("Ritual product add failed:", ritualError)
          const errorMsg = ritualError?.message || "Could not add ritual product"
          
          if (errorMsg.includes("do not have a price")) {
            setUiError("Ritual product price not configured. Main product added to cart.")
          } else {
            setUiError(`Main product added. Ritual: ${errorMsg}`)
          }
          
          // Still show success since main product was added
          setShowGoToCart(true)
          setJustUnlocked(true)
          setTimeout(() => setJustUnlocked(false), 3000)
        }
      } catch (e: any) {
        // rollback visual success - main product failed
        setRitualCompleted(false)
        setUiError(e?.message || "Could not add to cart")
        console.error("Add to cart failed:", e)
      } finally {
        setTimeout(() => {
          setAdding(false)
        }, 800)
      }
    })
  }

  // no variant to add
  if (!variant?.id) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 bg-white/50 backdrop-blur-3xl border border-white/30 rounded-3xl shadow-2xl shadow-black/10 max-w-4xl w-full mx-6"
          style={{ pointerEvents: 'auto' }}
        >
          <div className="px-6 py-3 relative">
            <div className="flex items-center justify-between">
              {/* Product Info */}
              <div className="flex items-center space-x-3 flex-shrink-0">
                <div className="w-10 h-10 bg-black/10 backdrop-blur-sm rounded-xl flex items-center justify-center overflow-hidden">
                  {(ritualProduct && qualifiesShipping && !showGoToCart) ? (
                    ritualProduct.image ? (
                      <img src={ritualProduct.image} alt={ritualProduct.name} className="w-10 h-10 object-cover rounded-xl" />
                    ) : (
                      <ShoppingBag className="w-5 h-5 text-black/70" />
                    )
                  ) : image ? (
                    <img src={image} alt={name} className="w-10 h-10 object-cover rounded-xl" />
                  ) : (
                    <ShoppingBag className="w-5 h-5 text-black/70" />
                  )}
                </div>
                <div>
                  <h3 className="font-american-typewriter text-black/90 whitespace-nowrap text-sm">
                    {(ritualProduct && qualifiesShipping && !showGoToCart) 
                      ? ritualProduct.name 
                      : `${name}${variant?.title ? ` • ${variant.title}` : ""}`}
                  </h3>
                  <div className="flex items-center space-x-1">
                    <p className="font-din-arabic-bold text-sm text-black/70">
                      {(ritualProduct && qualifiesShipping && !showGoToCart)
                        ? formatMinor(ritualProduct.price, ritualProduct.currency)
                        : formatMinor(minor, currency)}
                    </p>
                    {qualifiesShipping && (
                      <motion.p
                        key={justUnlocked ? "unlocked" : "qualifies"}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="font-din-arabic text-xs whitespace-nowrap"
                        style={{ color: "#545d4a" }}
                      >
                        {justUnlocked 
                          ? "Complimentary Shipping Unlocked!" 
                          : "Order Qualifies For Complimentary Shipping"}
                      </motion.p>
                    )}
                  </div>
                </div>
              </div>

              {/* Controls + Add to Cart */}
              <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                {/* Qty */}
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <span className="font-din-arabic text-xs text-black/60 uppercase hidden sm:block">
                    QTY
                  </span>
                  <div className="flex items-center bg-black/10 backdrop-blur-sm rounded-lg">
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleQuantityChange(-1)}
                      className="p-1.5 hover:bg-black/10 transition-colors rounded-l-lg"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-3 h-3 text-black/70" />
                    </motion.button>
                    <span className="font-din-arabic px-2 sm:px-3 py-1.5 text-black text-sm min-w-[30px] sm:min-w-[35px] text-center">
                      {quantity}
                    </span>
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleQuantityChange(1)}
                      className="p-1.5 hover:bg-black/10 transition-colors rounded-r-lg"
                      disabled={quantity >= 10}
                    >
                      <Plus className="w-3 h-3 text-black/70" />
                    </motion.button>
                  </div>
                </div>

                {/* Total */}
                <div className="hidden md:block text-center">
                  <p className="font-din-arabic text-xs text-black/60 uppercase whitespace-nowrap">
                    TOTAL
                  </p>
                  <p className="font-din-arabic-bold text-black/90 whitespace-nowrap">
                    {(ritualProduct && qualifiesShipping && !showGoToCart)
                      ? formatMinor(ritualProduct.price, ritualProduct.currency)
                      : formatMinor(currentTotalMinor, currency)}
                  </p>
                </div>

                {/* Action buttons: Add to Cart, Complete Ritual, or Go to Cart */}
                {showGoToCart ? (
                  <motion.a
                    href={`/${countryCode}/cart`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="font-din-arabic px-3 sm:px-5 py-2.5 bg-black/90 backdrop-blur-sm text-white hover:bg-black transition-all duration-300 rounded-xl relative overflow-hidden flex items-center space-x-1 sm:space-x-2 whitespace-nowrap text-xs sm:text-sm"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Go to Cart</span>
                  </motion.a>
                ) : ritualProduct && qualifiesShipping ? (
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={completeRitual}
                    disabled={adding || isPending || ritualCompleted}
                    className="font-din-arabic px-3 sm:px-5 py-2.5 bg-black/90 backdrop-blur-sm text-white hover:bg-black transition-all duration-300 rounded-xl relative overflow-hidden flex items-center space-x-1 sm:space-x-2 whitespace-nowrap text-xs sm:text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <AnimatePresence mode="wait">
                      {ritualCompleted ? (
                        <motion.span
                          key="ritual-completed"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -20, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          Adding...
                        </motion.span>
                      ) : (
                        <motion.span
                          key="complete-ritual"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -20, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          Complete the Ritual
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                ) : (
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={addFromSticky}
                    disabled={!variant?.id || adding || isPending}
                    className="font-din-arabic px-3 sm:px-5 py-2.5 bg-black/90 backdrop-blur-sm text-white hover:bg-black transition-all duration-300 rounded-xl relative overflow-hidden flex items-center space-x-1 sm:space-x-2 whitespace-nowrap text-xs sm:text-sm"
                  >
                    <ShoppingBag className="w-4 h-4" />
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
                )}
              </div>
            </div>

            {uiError && (
              <p className="mt-2 text-xs" style={{ color: "#b42318" }}>
                {uiError}
              </p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default StickyCartBar
