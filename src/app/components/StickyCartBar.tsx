"use client"

import { addToCartAction } from "@lib/data/cart-actions"
import { updateLineItemGift } from "@lib/data/cart"
import { emitCartUpdated } from "@lib/util/cart-client"
import type { HttpTypes } from "@medusajs/types"
import { useCartItemsSafe } from "app/context/cart-items-context"
import { Gift, Minus, Plus, ShoppingBag } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useParams, useRouter } from "next/navigation"
import React, { useEffect, useMemo, useState, useTransition } from "react"
import { toast } from "sonner"

type ProductLike = Partial<HttpTypes.StoreProduct> & {
  metadata?: Record<string, any>
}

interface RitualProduct {
  variantId: string
  name: string
  price: number
  currency: string
  image?: string
  isRitualProduct?: boolean
}

interface GiftOption {
  enabled: boolean
}

interface StickyCartBarProps {
  isVisible: boolean
  product?: ProductLike | null
  heroCartItem?: any
  selectedVariantId?: string | null
  onUpdateHeroQuantity?: (quantity: number) => void
  onCartUpdate?: (item: any | null) => void
  cartItems?: any[]
  ritualProduct?: RitualProduct | null
  giftOption?: GiftOption | null
}

/* ————— helpers ————— */
function pickVariant(p?: ProductLike) {
  return Array.isArray(p?.variants) && p!.variants[0] ? p!.variants[0] : undefined
}
function getMinorPrice(v: any): number {
  const calc = v?.calculated_price?.calculated_amount
  if (typeof calc === "number") return calc
  const amt =
    Array.isArray(v?.prices) && typeof v.prices[0]?.amount === "number" ? v.prices[0].amount : 0
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
  selectedVariantId: selectedVariantIdProp,
  onUpdateHeroQuantity,
  onCartUpdate: onCartUpdateProp,
  cartItems: cartItemsProp = [],
  ritualProduct,
  giftOption,
}: StickyCartBarProps) {
  // Use cart context if available, otherwise fall back to props
  const cartContext = useCartItemsSafe()
  const cartItems = cartContext?.cartItems ?? cartItemsProp ?? []
  const onCartUpdate = cartContext?.handleCartUpdate ?? onCartUpdateProp
  const [quantity, setQuantity] = useState(1)
  const [isAddedToCart, setIsAddedToCart] = useState(false)
  const [adding, setAdding] = useState(false)
  const [uiError, setUiError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [previouslyQualified, setPreviouslyQualified] = useState(false)
  const [justUnlocked, setJustUnlocked] = useState(false)
  const [ritualCompleted, setRitualCompleted] = useState(false)
  const [showGoToCart, setShowGoToCart] = useState(false)
  const [showRitualSuggestion, setShowRitualSuggestion] = useState(false)
  const [ritualQuantity, setRitualQuantity] = useState(1)
  const [ritualJustCompleted, setRitualJustCompleted] = useState(false)

  // Gift option state
  const [showGiftOption, setShowGiftOption] = useState(false)
  const [giftSelected, setGiftSelected] = useState(false)

  // read /[countryCode]/... from route, fallback to "in"
  const params = useParams() as any
  const countryCode: string = (params?.countryCode ?? "in").toString().toLowerCase()
  const router = useRouter()

  // Use selected variant from hero section if provided, otherwise pick default variant
  const variant = useMemo(() => {
    if (selectedVariantIdProp && product?.variants) {
      const selectedVariant = product.variants.find((v: any) => v.id === selectedVariantIdProp)
      if (selectedVariant) return selectedVariant
    }
    return pickVariant(product ?? undefined)
  }, [product, selectedVariantIdProp])

  // Monitor cart changes and update sticky cart bar state accordingly
  useEffect(() => {
    if (!product || !variant?.id) return

    const productId = product.id ?? variant.id
    // Match main product: check by product ID, variant ID, or item.id (which might be variant ID from ProductHero)
    const mainProductInCart = cartItems.find((item) => {
      const itemVariantId = (item as any).variant_id || item.id
      const isNotRitual = !(item as any).isRitualProduct
      // Match if: item.id matches productId, item.id matches variant.id, or variant_id matches variant.id
      // Also check if item name matches product title (fallback for edge cases)
      const nameMatch = item.name === product.title || item.name === (product as any).title
      return (
        (item.id === productId ||
          item.id === variant.id ||
          itemVariantId === variant.id ||
          nameMatch) &&
        isNotRitual
      )
    })
    // Match ritual product by variant_id or id - don't require isRitualProduct flag
    // since that's only set on optimistic local state, not on server-loaded cart data
    const ritualProductInCart = cartItems.find((item) => {
      if (!ritualProduct) return false
      const itemVariantId = (item as any).variant_id || item.id
      return itemVariantId === ritualProduct.variantId || item.id === ritualProduct.variantId
    })

    console.log("🔍 StickyCartBar - Cart sync check:", {
      productId,
      variantId: variant.id,
      cartItemsCount: cartItems.length,
      cartItems: cartItems.map((i) => ({
        id: i.id,
        name: i.name,
        isRitual: (i as any).isRitualProduct,
      })),
      mainProductInCart: mainProductInCart
        ? { id: mainProductInCart.id, name: mainProductInCart.name }
        : null,
      ritualProduct: ritualProduct
        ? { variantId: ritualProduct.variantId, name: ritualProduct.name }
        : null,
      ritualProductInCart: ritualProductInCart
        ? { id: ritualProductInCart.id, name: ritualProductInCart.name }
        : null,
    })

    // Update ritual completion state based on cart contents
    // Don't override states if ritual was just completed (to allow cart sync)
    if (ritualJustCompleted) return

    const cartItemsCount = cartItems.length

    // Logic:
    // 1. No product in cart → "Add to Cart"
    // 2. 1 product in cart (main) + gift option enabled → "This is a Gift"
    // 3. 1 product in cart (main) + ritual product exists → "Complete the Ritual"
    // 4. Gift selected OR Ritual completed → "Checkout"
    // 5. 2+ products but no valid pair → "Add to Cart"

    if (cartItemsCount === 0) {
      // Cart is empty - show "Add to Cart"
      console.log("🛒 Cart is empty - showing Add to Cart")
      setRitualCompleted(false)
      setShowGoToCart(false)
      setShowRitualSuggestion(false)
      setShowGiftOption(false)
      setGiftSelected(false)
    } else if (cartItemsCount >= 1 && mainProductInCart && giftOption?.enabled && !giftSelected) {
      // Product in cart AND gift option is enabled - show "This is a Gift" button
      console.log("🎁 Product in cart with gift option - showing This is a Gift")
      setRitualCompleted(false)
      setShowGoToCart(false)
      setShowRitualSuggestion(false)
      setShowGiftOption(true)
    } else if (giftSelected) {
      // Gift was selected - show checkout
      console.log("✅ Gift selected - showing Checkout")
      setShowGoToCart(true)
      setShowGiftOption(false)
      setShowRitualSuggestion(false)
    } else if (cartItemsCount === 1 && mainProductInCart && ritualProduct && !ritualProductInCart) {
      // Only 1 product (the main one) in cart AND a ritual product exists for it
      console.log(
        "💡 Single main product in cart with ritual available - showing Complete the Ritual"
      )
      setRitualCompleted(false)
      setShowGoToCart(false)
      setShowRitualSuggestion(true)
      setShowGiftOption(false)
    } else if (cartItemsCount >= 2 && ritualProduct && mainProductInCart && ritualProductInCart) {
      // 2+ products AND they form a ritual pair (main + ritual both present)
      console.log("✅ Ritual pair completed - showing Checkout")
      setRitualCompleted(true)
      setShowGoToCart(true)
      setShowRitualSuggestion(false)
      setShowGiftOption(false)
    } else {
      // Any other case: cart has items but no valid ritual pair
      // (e.g., 2+ products without ritual pair, or only ritual product without main)
      console.log("🔄 Cart has items but no valid ritual pair - showing Add to Cart")
      setRitualCompleted(false)
      setShowGoToCart(false)
      setShowRitualSuggestion(false)
      setShowGiftOption(false)
    }

    // Sync quantity state with cart if main product is in cart
    if (mainProductInCart) {
      setQuantity(mainProductInCart.quantity)
    }

    // Sync ritual quantity state with cart if ritual product is in cart
    if (ritualProductInCart) {
      setRitualQuantity(ritualProductInCart.quantity)
    }
  }, [cartItems, product, variant, ritualProduct])
  const minor = useMemo(() => {
    const price = getMinorPrice(variant)
    return price
  }, [variant])
  const currency = (
    variant?.calculated_price?.currency_code ??
    (variant as any)?.prices?.[0]?.currency_code ??
    "inr"
  ).toUpperCase()

  const name = product?.title ?? "Product"
  const image = (Array.isArray(product?.images) && product!.images[0]?.url) || product?.thumbnail

  const shippingThresholdMinor = 2500 // you appear to treat prices as whole rupees already

  // Calculate total based on current state:
  // - If showing ritual suggestion: show only ritual product total
  // - If ritual completed: show combined total (main + ritual)
  // - Otherwise: show only main product total
  const mainProductTotal = minor * quantity
  const ritualProductTotal = ritualProduct ? ritualProduct.price * ritualQuantity : 0

  let currentTotalMinor: number
  if (showRitualSuggestion && !ritualCompleted) {
    // Show only ritual product total when suggesting ritual
    currentTotalMinor = ritualProductTotal
  } else if (ritualCompleted) {
    // Show combined total when ritual is completed
    currentTotalMinor = mainProductTotal + ritualProductTotal
  } else {
    // Show only main product total
    currentTotalMinor = mainProductTotal
  }

  // Shipping qualification logic:
  // - If showing ritual suggestion: check if ritual product alone qualifies
  // - If ritual completed: check if combined total qualifies
  // - Otherwise: check if main product alone qualifies
  const qualifiesShipping = currentTotalMinor >= shippingThresholdMinor

  const handleQuantityChange = (delta: number) => {
    const next = Math.min(10, Math.max(1, quantity + delta))
    setQuantity(next)
    onUpdateHeroQuantity?.(next)

    // Check if this change unlocks shipping (including ritual product)
    const nextMainTotal = minor * next
    const nextRitualTotal = ritualProduct ? ritualProduct.price * ritualQuantity : 0

    let nextTotal: number
    if (showRitualSuggestion && !ritualCompleted) {
      nextTotal = nextRitualTotal
    } else if (ritualCompleted) {
      nextTotal = nextMainTotal + nextRitualTotal
    } else {
      nextTotal = nextMainTotal
    }
    const willQualify = nextTotal >= shippingThresholdMinor

    if (!previouslyQualified && willQualify) {
      setJustUnlocked(true)
      setTimeout(() => setJustUnlocked(false), 3000)
    }

    setPreviouslyQualified(willQualify)
  }

  const handleRitualQuantityChange = (delta: number) => {
    const next = Math.min(10, Math.max(1, ritualQuantity + delta))
    setRitualQuantity(next)

    // Check if this change unlocks shipping (including ritual product)
    const nextMainTotal = minor * quantity
    const nextRitualTotal = ritualProduct ? ritualProduct.price * next : 0

    let nextTotal: number
    if (showRitualSuggestion && !ritualCompleted) {
      nextTotal = nextRitualTotal
    } else if (ritualCompleted) {
      nextTotal = nextMainTotal + nextRitualTotal
    } else {
      nextTotal = nextMainTotal
    }
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
    const existingItem = cartItems.find(
      (item) => item.id === productId || item.variant_id === variant.id
    )

    // optimistic updates for nav / other UIs
    if (existingItem) {
      // If item exists, update quantity
      onCartUpdate?.({
        ...existingItem,
        quantity: existingItem.quantity + quantity,
      })
    } else {
      // If item doesn't exist, add as new (regular product - no image in nav)
      // calculated_amount is already in major units (rupees), no conversion needed
      console.log("🔍 StickyCartBar - Adding item with price:", {
        minor,
        calculated_amount: variant?.calculated_price?.calculated_amount,
        variantId: variant.id,
      })
      onCartUpdate?.({
        id: productId,
        name,
        price: minor,
        quantity,
        image: image ?? undefined,
      } as any)
    }

    emitCartUpdated({ quantityDelta: quantity })

    // background network
    startTransition(async () => {
      try {
        await addToCartAction({
          variantId: variant.id,
          quantity,
          countryCode,
          canBeGifted: giftOption?.enabled,
        })

        // After successful add to cart, show ritual suggestion if available
        if (ritualProduct && !ritualCompleted) {
          setTimeout(() => {
            setShowRitualSuggestion(true)
          }, 1000) // Show ritual suggestion after 1 second
        }
      } catch (e: any) {
        console.error(e)
        // rollback visual success
        setIsAddedToCart(false)
        const errorMessage = e?.message || "Could not add to cart"
        setUiError(errorMessage)
        console.error("Add to cart failed:", e)

        // Show toast notification for error
        // Check for inventory-related errors
        const errorMsg = String(errorMessage || "").toLowerCase()
        if (
          errorMsg.includes("inventory") ||
          errorMsg.includes("required inventory") ||
          errorMsg.includes("stock")
        ) {
          toast.error("Inventory Error", {
            description:
              "This product is currently out of stock or unavailable. Please try again later.",
            duration: 5000,
          })
        } else {
          toast.error("Failed to add to cart", {
            description: errorMessage,
            duration: 4000,
          })
        }
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

    // Check if main product already exists in cart by checking both id and variant_id
    const existingMainProduct = cartItems.find((item) => {
      const itemVariantId = (item as any).variant_id || item.id
      const matchesId = item?.product_id === productId || item?.variant_id === variant.id
      const matchesVariantId = itemVariantId === variant.id
      const isNotRitual = !(item as any).isRitualProduct
      return (matchesId || matchesVariantId) && isNotRitual
    })

    // DO NOT add main product if it already exists - only add ritual product
    // The main product was already added when user clicked "Add to Cart" initially
    if (!existingMainProduct) {
      console.log("⚠️ Main product not found in cart, adding it")
      // Only add main product if it somehow doesn't exist (shouldn't happen in normal flow)
      onCartUpdate?.({
        id: productId ?? "",
        name,
        price: minor,
        quantity,
        image: image ?? undefined,
      } as any)
    } else {
      console.log("✅ Main product already in cart, skipping addition")
    }

    // Check if ritual product already exists in cart
    const existingRitualProduct = cartItems.find(
      (item) => item.id === ritualProduct.variantId && (item as any).isRitualProduct
    )

    console.log("🔍 completeRitual - Checking ritual product:", {
      ritualProductId: ritualProduct.variantId,
      existingRitualProduct: existingRitualProduct
        ? {
          id: existingRitualProduct.id,
          quantity: existingRitualProduct.quantity,
        }
        : null,
    })

    // DO NOT add to cart context optimistically - wait for Medusa cart success
    // Only emit cart updated event, actual cart context update will happen after server success

    emitCartUpdated({ quantityDelta: ritualQuantity })

    // background network - add ritual product to Medusa cart
    startTransition(async () => {
      try {
        // Add ritual product to Medusa cart first
        await addToCartAction({
          variantId: ritualProduct.variantId,
          quantity: ritualQuantity,
          countryCode,
        })

        // If main product is not already in cart, add it too
        if (!existingMainProduct) {
          await addToCartAction({
            variantId: variant.id,
            quantity: quantity,
            countryCode,
          })
        }

        // ONLY after successful Medusa cart addition, update cart context
        // Add or update ritual product to cart (with image in nav)
        if (existingRitualProduct) {
          console.log("✅ Updating existing ritual product quantity in context")
          // Update existing ritual product quantity
          onCartUpdate?.({
            ...existingRitualProduct,
            quantity: ritualQuantity,
          } as any)
        } else {
          console.log("➕ Adding new ritual product to context after Medusa success")
          // Add new ritual product
          onCartUpdate?.({
            id: ritualProduct.variantId,
            name: ritualProduct.name,
            price: ritualProduct.price,
            quantity: ritualQuantity,
            image: ritualProduct.image ?? undefined,
          } as any)
        }

        // Show "Go to Cart" button after successful addition
        setShowGoToCart(true)
        setShowRitualSuggestion(false) // Hide ritual suggestion
        setRitualJustCompleted(true)
        setJustUnlocked(true)
        setTimeout(() => setJustUnlocked(false), 3000)
        setTimeout(() => setRitualJustCompleted(false), 5000) // Reset after 5 seconds to allow cart sync
      } catch (e: any) {
        // rollback visual success
        setRitualCompleted(false)
        const errorMessage = e?.message || "Could not add ritual to cart"
        setUiError(errorMessage)
        console.error("Ritual cart addition failed:", e)

        // Show toast notification for error
        // Check for inventory-related errors
        const errorMsg = String(errorMessage || "").toLowerCase()
        if (
          errorMsg.includes("inventory") ||
          errorMsg.includes("required inventory") ||
          errorMsg.includes("stock") ||
          errorMsg.includes("variant does not have")
        ) {
          toast.error("Inventory Error", {
            description:
              "This product is currently out of stock or unavailable. Please try again later.",
            duration: 5000,
          })
        } else {
          toast.error("Failed to add ritual product", {
            description: errorMessage,
            duration: 4000,
          })
        }
      } finally {
        setTimeout(() => {
          setAdding(false)
        }, 800)
      }
    })
  }

  // Handle "This is a Gift" selection
  const selectGift = () => {
    if (!variant?.id || adding || isPending || giftSelected) return

    setAdding(true)
    setUiError(null)
    setGiftSelected(true)

    const productId = product?.id ?? variant.id

    // Find existing item in cart (need the line item ID for API call)
    const existingItem = cartItems.find((item) => {
      const itemVariantId = (item as any).variant_id || item.id
      return item.id === productId || item.id === variant.id || itemVariantId === variant.id
    })

    // Update cart item with gift flag - optimistic UI update
    if (existingItem) {
      console.log("🎁 Marking item as gift in cart")
      onCartUpdate?.({
        ...existingItem,
        isGift: true,
      } as any)

      // Persist gift selection to database via server action
      const itemQuantity = existingItem.quantity || quantity
      startTransition(async () => {
        try {
          await updateLineItemGift({
            lineId: existingItem.id,
            quantity: itemQuantity,
            isGift: true,
            giftQuantity: itemQuantity, // All items marked as gift
          })
          console.log("🎁 Persisted gift selection to database:", existingItem.id, itemQuantity)
        } catch (e) {
          console.error("Failed to persist gift selection:", e)
          // Don't rollback UI, the optimistic update is good enough
        }
      })
    }

    // Show toast with gift confirmation
    toast.success("Gift Option Selected", {
      description: "Your item has been marked as a gift.",
      duration: 3000,
    })

    // Show "Go to Cart" button
    setShowGoToCart(true)
    setShowGiftOption(false)

    setTimeout(() => {
      setAdding(false)
    }, 800)
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
          className="fixed bottom-3 md:bottom-6 left-1/2 transform -translate-x-1/2 z-40 bg-white/50 backdrop-blur-3xl border border-white/30 rounded-2xl md:rounded-3xl shadow-2xl shadow-black/10 max-w-4xl w-[calc(100%-32px)] md:w-full md:mx-6"
          style={{ pointerEvents: "auto" }}
        >
          <div className="px-3 md:px-6 py-3 md:py-3 relative">
            <div className="flex items-center justify-between">
              {/* Product Info */}
              {!showGoToCart ? (
                <div className="flex items-center space-x-2 md:space-x-3 flex-shrink min-w-0">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-black/10 backdrop-blur-sm rounded-lg md:rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                    {ritualProduct && showRitualSuggestion && !showGoToCart ? (
                      ritualProduct.image ? (
                        <img
                          src={ritualProduct.image}
                          alt={ritualProduct.name}
                          className="w-8 h-8 md:w-10 md:h-10 object-cover rounded-lg md:rounded-xl"
                        />
                      ) : (
                        <ShoppingBag className="w-4 h-4 md:w-5 md:h-5 text-black/70" />
                      )
                    ) : image ? (
                      <img
                        src={image}
                        alt={name}
                        className="w-8 h-8 md:w-10 md:h-10 object-cover rounded-lg md:rounded-xl"
                      />
                    ) : (
                      <ShoppingBag className="w-4 h-4 md:w-5 md:h-5 text-black/70" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-american-typewriter text-black/90 text-xs md:text-sm truncate">
                      {ritualProduct && showRitualSuggestion && !showGoToCart
                        ? ritualProduct.name
                        : `${name}${variant?.title ? ` • ${variant.title}` : ""}`}
                    </h3>
                    <div className="flex items-center space-x-1 overflow-hidden">
                      <p className="font-din-arabic-bold text-xs md:text-sm text-black/70 whitespace-nowrap">
                        {ritualProduct && showRitualSuggestion && !showGoToCart
                          ? formatMinor(ritualProduct.price, ritualProduct.currency)
                          : formatMinor(minor, currency)}
                      </p>
                      {qualifiesShipping && (
                        <motion.p
                          key="qualifies"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                          className="font-din-arabic text-[10px] md:text-xs truncate"
                          style={{
                            color: showGoToCart ? "#f97316" : "#545d4a",
                          }}
                        >
                          {showRitualSuggestion && !ritualCompleted
                            ? "Complete Your Ritual"
                            : showGoToCart
                              ? "Order Qualifies For Complimentary Shipping"
                              : "Order Qualifies For Complimentary Shipping"}
                        </motion.p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="flex items-center space-x-2 text-[#545d4a]">
                    <div className="bg-[#545d4a]/10 p-1 rounded-full">
                      {giftSelected ? (
                        <Gift className="w-4 h-4" />
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      )}
                    </div>
                    <span className="font-din-arabic text-sm text-black/80">
                      {giftSelected
                        ? "Gift Selected & Ready to Checkout"
                        : "Ritual Completed & Added to Cart"}
                    </span>
                  </div>
                </div>
              )}

              {/* Controls + Add to Cart */}
              <div className="flex items-center space-x-1.5 md:space-x-3 flex-shrink-0">
                {/* Qty */}
                {!showGoToCart && !showGiftOption && (
                  <div className="flex items-center space-x-0.5 md:space-x-2">
                    <span className="font-din-arabic text-xs text-black/60 uppercase hidden md:block">
                      QTY
                    </span>
                    <div className="flex items-center bg-black/10 backdrop-blur-sm rounded-lg">
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          if (ritualProduct && showRitualSuggestion && !showGoToCart) {
                            handleRitualQuantityChange(-1)
                          } else {
                            handleQuantityChange(-1)
                          }
                        }}
                        className="p-1 md:p-1.5 hover:bg-black/10 transition-colors rounded-l-lg"
                        disabled={
                          ritualProduct && showRitualSuggestion && !showGoToCart
                            ? ritualQuantity <= 1
                            : quantity <= 1
                        }
                      >
                        <Minus className="w-3 h-3 text-black/70" />
                      </motion.button>
                      <span className="font-din-arabic px-1.5 md:px-3 py-1 md:py-1.5 text-black text-xs md:text-sm min-w-[25px] md:min-w-[35px] text-center">
                        {ritualProduct && showRitualSuggestion && !showGoToCart
                          ? ritualQuantity
                          : quantity}
                      </span>
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          if (ritualProduct && showRitualSuggestion && !showGoToCart) {
                            handleRitualQuantityChange(1)
                          } else {
                            handleQuantityChange(1)
                          }
                        }}
                        className="p-1 md:p-1.5 hover:bg-black/10 transition-colors rounded-r-lg"
                        disabled={
                          ritualProduct && showRitualSuggestion && !showGoToCart
                            ? ritualQuantity >= 10
                            : quantity >= 10
                        }
                      >
                        <Plus className="w-3 h-3 text-black/70" />
                      </motion.button>
                    </div>
                  </div>
                )}

                {/* Total */}
                {!showGoToCart && !showGiftOption && (
                  <div className="hidden lg:block text-center">
                    <p className="font-din-arabic text-xs text-black/60 uppercase whitespace-nowrap">
                      TOTAL
                    </p>
                    <p className="font-din-arabic-bold text-black/90 whitespace-nowrap">
                      {formatMinor(currentTotalMinor, currency)}
                    </p>
                  </div>
                )}

                {/* Action buttons: Add to Cart, Complete Ritual, or Go to Cart */}
                {showGoToCart ? (
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      router.push(`/${countryCode}/checkout?step=address`)
                    }}
                    className="font-din-arabic px-2.5 md:px-5 py-2 md:py-2.5 bg-black/90 backdrop-blur-sm text-white hover:bg-black transition-all duration-300 rounded-lg md:rounded-xl relative overflow-hidden flex items-center space-x-1 md:space-x-2 whitespace-nowrap text-xs md:text-sm"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    <span className="hidden sm:inline">Checkout</span>
                    <span className="sm:hidden">Checkout</span>
                  </motion.button>
                ) : ritualProduct && showRitualSuggestion ? (
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={completeRitual}
                    disabled={adding || isPending || ritualCompleted}
                    className="font-din-arabic px-2.5 md:px-5 py-2 md:py-2.5 bg-black/90 backdrop-blur-sm text-white hover:bg-black transition-all duration-300 rounded-lg md:rounded-xl relative overflow-hidden flex items-center space-x-1 md:space-x-2 whitespace-nowrap text-xs md:text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    <AnimatePresence mode="wait">
                      {ritualCompleted ? (
                        <motion.span
                          key="ritual-completed"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -20, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <span className="hidden sm:inline">Adding...</span>
                          <span className="sm:hidden">Add...</span>
                        </motion.span>
                      ) : (
                        <motion.span
                          key="complete-ritual"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -20, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <span className="hidden sm:inline">Complete the Ritual</span>
                          <span className="sm:hidden">Ritual</span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                ) : showGiftOption ? (
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={selectGift}
                    disabled={adding || isPending || giftSelected}
                    className="font-din-arabic px-2.5 md:px-5 py-2 md:py-2.5 bg-black/90 backdrop-blur-sm text-white hover:bg-black transition-all duration-300 rounded-lg md:rounded-xl relative overflow-hidden flex items-center space-x-1 md:space-x-2 whitespace-nowrap text-xs md:text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <Gift className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    <AnimatePresence mode="wait">
                      {giftSelected ? (
                        <motion.span
                          key="gift-selected"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -20, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <span className="hidden sm:inline">Marked as Gift</span>
                          <span className="sm:hidden">Gift ✓</span>
                        </motion.span>
                      ) : (
                        <motion.span
                          key="select-gift"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -20, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <span className="hidden sm:inline">This is a Gift</span>
                          <span className="sm:hidden">Gift</span>
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
                    className="font-din-arabic px-2.5 md:px-5 py-2 md:py-2.5 bg-black/90 backdrop-blur-sm text-white hover:bg-black transition-all duration-300 rounded-lg md:rounded-xl relative overflow-hidden flex items-center space-x-1 md:space-x-2 whitespace-nowrap text-xs md:text-sm"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    <AnimatePresence mode="wait">
                      {isAddedToCart ? (
                        <motion.span
                          key="added"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -20, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <span className="hidden sm:inline">Added to Cart</span>
                          <span className="sm:hidden">Added</span>
                        </motion.span>
                      ) : (
                        <motion.span
                          key="add"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -20, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <span className="hidden sm:inline">Add to Cart</span>
                          <span className="sm:hidden">Add</span>
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
