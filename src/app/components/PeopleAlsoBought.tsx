"use client"
import { addToCartAction } from "@lib/data/cart-actions"
import { emitCartUpdated } from "@lib/util/cart-client"
import { useCartItemsSafe } from "app/context/cart-items-context"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "motion/react"
import { useRouter } from "next/navigation"
import type React from "react"
import { useEffect, useMemo, useRef, useState, useTransition } from "react"
import { toast } from "sonner"
import type { FromTheLabSection } from "../../types/contentful"

type ProductLike = { metadata?: Record<string, any> }

type Card = {
  id?: string | number
  name: string
  price?: number // can be rupees or paise (auto-detected)
  currency?: string // e.g., "INR"
  image?: string
  hoverImage?: string
  description?: string
  badge?: string
  url?: string
  variantId?: string // Optional: For direct cart addition
}

type MetaShape = {
  heading?: string
  subheading?: string
  bg?: string
  products?: Card[]
}

function stripJsonComments(str: string) {
  return str.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1")
}
function parseMaybe(v: any) {
  if (typeof v !== "string") return v
  try {
    return JSON.parse(stripJsonComments(v.trim()))
  } catch {
    return v
  }
}
function parseTwice(v: any) {
  const once = parseMaybe(v)
  return typeof once === "string" ? parseMaybe(once) : once
}

// Auto-detect units:
// - if currency provided:
//   - if price < 10000 => treat as rupees (direct value)
//   - else => treat as paise (divide by 100)
// - else if price >= 1000 and divisible by 100 => treat as paise -> ₹(price/100)
// - else treat as rupees
function formatPrice(price?: number, currency?: string) {
  if (typeof price !== "number") return ""
  if (currency) {
    // Smart detection: if price is less than 10000, treat as rupees (direct value)
    // Otherwise, treat as paise (divide by 100)
    // This handles both cases: 1800 (rupees) and 180000 (paise)
    const value = price < 10000 ? price : price / 100
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency,
      }).format(value)
    } catch {
      // Fallback formatting
      const formattedValue = Math.round(value).toLocaleString()
      return currency === "INR" ? `₹${formattedValue}` : `${currency} ${formattedValue}`
    }
  }
  if (price >= 1000 && price % 100 === 0) return `$${Math.round(price / 100)}`
  return `$${Math.round(price)}`
}

const products: Card[] = []

export function PeopleAlsoBought({
  product,
  fromTheLabContent,
}: {
  product?: ProductLike
  fromTheLabContent?: FromTheLabSection | null
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const cartContext = useCartItemsSafe()
  const handleCartUpdate = cartContext?.handleCartUpdate
  const [hoveredId, setHoveredId] = useState<string | number | null>(null)
  const [hoveredProduct, setHoveredProduct] = useState<string | number | null>(null)
  const [addedToCart, setAddedToCart] = useState<string | number | null>(null)
  const [adding, setAdding] = useState<string | number | null>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [isDragging, setIsDragging] = useState(false)

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const scrollBarRef = useRef<HTMLDivElement>(null)

  // Get country code from current path or default to 'in'
  const getCountryCode = () => {
    if (typeof window !== "undefined") {
      const pathParts = window.location.pathname.split("/")
      const countryCode = pathParts[1]
      return countryCode && countryCode.length === 2 ? countryCode : "in"
    }
    return "in"
  }

  // ------- READ CONTENT FROM CONTENTFUL OR METADATA -------
  const meta: Required<MetaShape> = useMemo(() => {
    const defaults: Required<MetaShape> = {
      heading: "From the Lab",
      subheading: "Formulations most often paired in practice.",
      bg: "#e3e3d8",
      products: [],
    }

    // Priority 1: Use Contentful content if available
    if (fromTheLabContent && fromTheLabContent.isActive) {
      const products: Card[] = fromTheLabContent.products.map(
        (p): Card => ({
          id: p.id ?? undefined,
          name: p.name,
          price: p.price,
          currency: p.currency,
          image: p.image,
          hoverImage: p.hoverImage,
          description: p.description,
          badge: p.badge,
          url: p.url,
          variantId: p.variantId,
        })
      )

      return {
        heading: fromTheLabContent.heading || defaults.heading,
        subheading: fromTheLabContent.subheading || defaults.subheading,
        bg: fromTheLabContent.backgroundColor || defaults.bg,
        products: products.length > 0 ? products : defaults.products,
      }
    }

    // Priority 2: Fall back to product metadata
    const raw = product?.metadata?.peopleAlsoBought
    if (raw) {
      const parsed: any = parseTwice(raw)
      if (parsed && typeof parsed === "object") {
        const products: Card[] = Array.isArray(parsed.products)
          ? parsed.products.map(
              (p: any, i: number): Card => ({
                id: p?.id ?? i + 1,
                name: String(p?.name ?? ""),
                price: typeof p?.price === "number" ? p.price : undefined,
                currency: typeof p?.currency === "string" ? p.currency : undefined,
                image: typeof p?.image === "string" ? p.image : undefined,
                hoverImage: typeof p?.hoverImage === "string" ? p.hoverImage : undefined,
                description: typeof p?.description === "string" ? p.description : undefined,
                badge: typeof p?.badge === "string" ? p.badge : undefined,
                url: typeof p?.url === "string" ? p.url : undefined,
                variantId: typeof p?.variantId === "string" ? p.variantId : undefined,
              })
            )
          : defaults.products

        return {
          heading: typeof parsed.heading === "string" ? parsed.heading : defaults.heading,
          subheading:
            typeof parsed.subheading === "string" ? parsed.subheading : defaults.subheading,
          bg: typeof parsed.bg === "string" ? parsed.bg : defaults.bg,
          products,
        }
      }
    }

    // Priority 3: Use hardcoded products as final fallback
    return {
      ...defaults,
      products: products.map(
        (p): Card => ({
          id: p.id,
          name: p.name,
          price: p.price,
          image: p.image,
          hoverImage: p.hoverImage,
          description: p.description,
          badge: p.badge,
        })
      ),
    }
  }, [product, fromTheLabContent])

  const { heading, subheading, bg, products: cards } = meta

  // ------- SCROLL / DRAG logic (unchanged) -------
  const updateScrollProgress = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      const maxScroll = scrollWidth - clientWidth
      const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0
      setScrollProgress(progress)
      setCanScrollLeft(scrollLeft > 10)
      setCanScrollRight(scrollLeft < maxScroll - 10)
    }
  }
  const scroll = (dir: "left" | "right") => {
    const sc = scrollContainerRef.current
    if (!sc) return
    // Use full viewport width on mobile to scroll exactly one product, fixed width on desktop
    const isMobile = window.innerWidth < 768
    const scrollAmount = isMobile ? window.innerWidth : 300
    const target =
      dir === "left" ? Math.max(0, sc.scrollLeft - scrollAmount) : sc.scrollLeft + scrollAmount
    sc.scrollTo({ left: target, behavior: "smooth" })
  }
  const handleScrollBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollBarRef.current || !scrollContainerRef.current) return
    const rect = scrollBarRef.current.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    const { scrollWidth, clientWidth } = scrollContainerRef.current
    scrollContainerRef.current.scrollTo({
      left: ratio * (scrollWidth - clientWidth),
      behavior: "smooth",
    })
  }
  const handleScrollBarDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollBarRef.current || !scrollContainerRef.current) return
    const rect = scrollBarRef.current.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const { scrollWidth, clientWidth } = scrollContainerRef.current
    scrollContainerRef.current.scrollLeft = ratio * (scrollWidth - clientWidth)
  }

  useEffect(() => {
    const sc = scrollContainerRef.current
    if (!sc) return

    const handleScroll = (e: Event) => {
      e.stopPropagation() // Prevent scroll event from bubbling up
      updateScrollProgress()
    }

    sc.addEventListener("scroll", handleScroll, { passive: true })
    updateScrollProgress()

    return () => {
      sc.removeEventListener("scroll", handleScroll)
    }
  }, [])
  useEffect(() => {
    const up = () => setIsDragging(false)
    const move = (e: MouseEvent) => handleScrollBarDrag(e as any)
    if (isDragging) {
      document.addEventListener("mouseup", up)
      document.addEventListener("mousemove", move)
    }
    return () => {
      document.removeEventListener("mouseup", up)
      document.removeEventListener("mousemove", move)
    }
  }, [isDragging])

  const handleAddToCart = async (productCard: Card) => {
    // Check if product has variantId (if added to Contentful ProductCard)
    const variantId = productCard.variantId || (productCard as any).variant_id

    // Prevent duplicate clicks
    if (!variantId || adding === productCard.id || isPending) {
      return
    }

    if (variantId) {
      // Set loading state
      setAdding(productCard.id ?? null)
      setAddedToCart(productCard.id ?? null)

      // Calculate price in minor units (paise) for cart
      // If price < 10000, it's already in rupees, convert to paise
      // Otherwise, it's already in paise
      const priceInPaise =
        productCard.price && productCard.price < 10000
          ? Math.round(productCard.price * 100)
          : productCard.price || 0

      // Optimistic UI update - update cart context immediately (like ProductHero)
      if (handleCartUpdate) {
        handleCartUpdate({
          id: String(variantId),
          name: productCard.name,
          price: priceInPaise,
          quantity: 1,
          image: productCard.image,
          variant_id: String(variantId),
        } as any)
      }

      // Emit cart updated event for other components
      emitCartUpdated({ quantityDelta: 1 })

      // Add to server cart in background (like ProductHero)
      startTransition(async () => {
        try {
          const countryCode = getCountryCode()
          console.log("Adding to cart:", {
            variantId,
            countryCode,
            productName: productCard.name,
          })

          await addToCartAction({
            variantId: String(variantId),
            quantity: 1,
            countryCode,
          })

          console.log("Successfully added to cart")
          toast.success(`${productCard.name} added to cart`, { duration: 2000 })

          // Keep feedback visible briefly, then clear
          setTimeout(() => {
            setAdding(null)
            setAddedToCart(null)
          }, 900)
        } catch (error: any) {
          console.error("Error adding to cart:", error)
          setAdding(null)
          setAddedToCart(null)

          // Remove from cart context on error
          if (handleCartUpdate) {
            handleCartUpdate({
              id: String(variantId),
              quantity: 0,
            } as any)
          }

          // Show toast notification for error (like ProductHero)
          const errorMessage = error?.message || "Unable to add to cart. Please try again."
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
            toast.error("Failed to add to cart", {
              description: errorMessage,
              duration: 4000,
            })
          }
        }
      })
    } else if (productCard.url && productCard.url.trim() !== "" && productCard.url !== "/") {
      // If no variantId, navigate to product page (only if URL is valid)
      if (productCard.id !== undefined) {
        setAddedToCart(productCard.id)
        setTimeout(() => setAddedToCart(null), 2000)
      }

      try {
        const urlPath = productCard.url.startsWith("/")
          ? productCard.url
          : productCard.url.startsWith("http://") || productCard.url.startsWith("https://")
            ? new URL(productCard.url).pathname
            : `/${productCard.url}` // If it's just a path without leading slash

        // Only redirect if path is not empty or "/"
        if (urlPath && urlPath.trim() !== "" && urlPath !== "/") {
          router.push(urlPath)
        } else {
          alert(
            "Product URL is invalid. Please add variantId in Contentful to enable direct cart addition."
          )
        }
      } catch (urlError) {
        console.error("Invalid URL:", productCard.url, urlError)
        alert(
          "Product URL is invalid. Please add variantId in Contentful to enable direct cart addition."
        )
      }
    } else {
      // If no URL and no variantId, show error
      console.warn("Product has no URL or variantId, cannot add to cart")
      alert("This product is not available. Please contact support.")
      if (productCard.id !== undefined) {
        setAddedToCart(productCard.id)
        setTimeout(() => setAddedToCart(null), 2000)
      }
    }
  }

  return (
    <section
      className="pt-8 lg:pt-12 relative"
      style={{
        backgroundColor: bg,
        overflow: "visible", // Ensure section doesn't create scroll container
      }}
    >
      {/* Heading and Subheading - Centered on Mobile, Part of Scroll on Desktop */}
      <div className="lg:hidden px-4 md:px-8 text-center py-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="font-american-typewriter text-2xl tracking-tight mb-4 text-black"
        >
          {heading}
        </motion.h2>
        {subheading && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="font-din-arabic text-base text-black/70 leading-relaxed"
          >
            {subheading}
          </motion.p>
        )}
      </div>

      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto scrollbar-hide py-8 relative"
        style={{
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          overscrollBehaviorX: "contain", // Prevent horizontal scroll chaining
          overscrollBehaviorY: "auto", // Allow vertical scroll to pass through to page
          overflowY: "hidden", // Explicitly prevent vertical scroll in this container
        }}
      >
        {/* Left intro column - Hidden on Mobile, Visible on Desktop */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="hidden lg:flex flex-shrink-0 w-2/5 flex-col px-8 lg:pl-20 lg:pr-16"
          style={{ scrollSnapAlign: "start", paddingTop: "60px" }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="font-american-typewriter text-3xl tracking-tight mb-6 lg:mb-8 text-black"
          >
            {heading}
          </motion.h2>
          {subheading && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="font-din-arabic text-lg text-black/70 leading-relaxed"
            >
              {subheading}
            </motion.p>
          )}
        </motion.div>

        {cards.map((product, index) => (
          <motion.div
            key={`product-${product.id ?? index}-${index}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.08 }}
            viewport={{ once: true }}
            className="flex-shrink-0 group cursor-pointer relative w-full px-6 md:w-[280px] md:px-0 md:mr-8"
            style={{
              scrollSnapAlign: "center",
            }}
            onMouseEnter={() => setHoveredProduct(product.id ?? null)}
            onMouseLeave={() => setHoveredProduct(null)}
          >
            <div className="max-w-[340px] mx-auto md:max-w-none md:w-full">
              {/* Product Image */}
              <div
                className="relative mb-4 md:mb-6 overflow-hidden bg-white/20 rounded-sm"
                style={{ paddingBottom: "125%" }}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  {/* Base Image */}
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-opacity duration-300"
                      style={{
                        opacity: hoveredProduct === product.id ? 0 : 1,
                        userSelect: "none", // Prevent text selection
                        WebkitUserSelect: "none",
                      }}
                      draggable={false} // Prevent image dragging
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">No image</span>
                    </div>
                  )}

                  {/* Hover Image */}
                  {product.hoverImage && (
                    <img
                      src={product.hoverImage}
                      alt={`${product.name} alternative view`}
                      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                      style={{
                        opacity: hoveredProduct === product.id ? 1 : 0,
                        userSelect: "none",
                        WebkitUserSelect: "none",
                      }}
                      draggable={false} // Prevent image dragging
                    />
                  )}

                  {/* Badge */}
                  {product.badge && (
                    <div className="absolute top-3 md:top-4 left-3 md:left-4">
                      <span
                        className="px-2 md:px-3 py-1 text-xs font-din-arabic tracking-wide font-medium"
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          color: "#000",
                          borderRadius: "12px",
                        }}
                      >
                        {product.badge}
                      </span>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Product Details */}
              <div className="space-y-3">
                {/* Product Name and Price */}
                <div className="flex items-start justify-between gap-2">
                  <h3
                    className="font-american-typewriter text-black group-hover:text-black/80 transition-colors duration-200 flex-1 text-base md:text-lg"
                    style={{ lineHeight: "1.3", letterSpacing: "0.05em" }}
                  >
                    {product.name}
                  </h3>

                  {product.price && (
                    <span
                      className="font-din-arabic text-black flex-shrink-0 group-hover:text-black/80 transition-colors duration-200 text-sm md:text-base"
                      style={{ lineHeight: "1.3", letterSpacing: "0.1em" }}
                    >
                      {formatPrice(product.price, product.currency)}
                    </span>
                  )}
                </div>

                {/* Product Description */}
                <p
                  className="font-din-arabic text-black/70 group-hover:text-black/60 transition-colors duration-200 text-xs md:text-sm"
                  style={{ lineHeight: "1.4", letterSpacing: "0.1em" }}
                >
                  {product.description}
                </p>

                {/* Quick Add Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleAddToCart(product)
                  }}
                  className="w-full mt-3 md:mt-4 px-3 md:px-4 py-2 bg-transparent border border-black/20 text-black hover:bg-black hover:text-white transition-all duration-300 font-din-arabic text-xs md:text-sm tracking-wide opacity-0 md:group-hover:opacity-100 text-center disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={(adding === product.id || isPending) && !product.variantId}
                >
                  {adding === product.id || (isPending && addedToCart === product.id)
                    ? "Adding..."
                    : addedToCart === product.id
                      ? "✓ Added"
                      : "Quick Add"}
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Arrows - Always Visible on Mobile, Conditional on Desktop */}
      <div
        className="absolute left-2 md:hidden z-20"
        style={{ top: "calc(50% + 40px)", transform: "translateY(-50%)" }}
      >
        <motion.button
          whileHover={{ scale: 1.05, x: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          className="group relative w-10 h-10 rounded-full backdrop-blur-md transition-all duration-500 bg-black/5 hover:bg-black/10 border border-black/10 hover:border-black/20 shadow-2xl hover:shadow-3xl overflow-hidden disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Scroll left"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute inset-0 flex items-center justify-center">
            <ChevronLeft className="w-5 h-5 text-black/70 group-hover:text-black transition-all duration-300" />
          </div>
          <div className="absolute inset-0 rounded-full ring-1 ring-black/5 group-hover:ring-black/15 transition-all duration-300" />
        </motion.button>
      </div>

      <div
        className="absolute right-2 md:hidden z-20"
        style={{ top: "calc(50% + 40px)", transform: "translateY(-50%)" }}
      >
        <motion.button
          whileHover={{ scale: 1.05, x: 2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          className="group relative w-10 h-10 rounded-full backdrop-blur-md transition-all duration-500 bg-black/5 hover:bg-black/10 border border-black/10 hover:border-black/20 shadow-2xl hover:shadow-3xl overflow-hidden disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Scroll right"
        >
          <div className="absolute inset-0 bg-gradient-to-l from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute inset-0 flex items-center justify-center">
            <ChevronRight className="w-5 h-5 text-black/70 group-hover:text-black transition-all duration-300" />
          </div>
          <div className="absolute inset-0 rounded-full ring-1 ring-black/5 group-hover:ring-black/15 transition-all duration-300" />
        </motion.button>
      </div>

      {/* Desktop Arrows */}
      {canScrollLeft && (
        <div
          className="hidden md:block absolute left-4 lg:left-6 z-20"
          style={{ top: "calc(50% - 40px)", transform: "translateY(-50%)" }}
        >
          <motion.button
            whileHover={{ scale: 1.05, x: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scroll("left")}
            className="group relative w-12 h-12 lg:w-14 lg:h-14 rounded-full backdrop-blur-md transition-all duration-500 bg-black/5 hover:bg-black/10 border border-black/10 hover:border-black/20 shadow-2xl hover:shadow-3xl overflow-hidden"
            aria-label="Scroll left"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 flex items-center justify-center">
              <ChevronLeft className="w-6 h-6 text-black/70 group-hover:text-black transition-all duration-300" />
            </div>
            <div className="absolute inset-0 rounded-full ring-1 ring-black/5 group-hover:ring-black/15 transition-all duration-300" />
          </motion.button>
        </div>
      )}
      {canScrollRight && (
        <div
          className="hidden md:block absolute right-4 lg:right-6 z-20"
          style={{ top: "calc(50% - 40px)", transform: "translateY(-50%)" }}
        >
          <motion.button
            whileHover={{ scale: 1.05, x: 2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scroll("right")}
            className="group relative w-12 h-12 lg:w-14 lg:h-14 rounded-full backdrop-blur-md transition-all duration-500 bg-black/5 hover:bg-black/10 border border-black/10 hover:border-black/20 shadow-2xl hover:shadow-3xl overflow-hidden"
            aria-label="Scroll right"
          >
            <div className="absolute inset-0 bg-gradient-to-l from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 flex items-center justify-center">
              <ChevronRight className="w-6 h-6 text-black/70 group-hover:text-black transition-all duration-300" />
            </div>
            <div className="absolute inset-0 rounded-full ring-1 ring-black/5 group-hover:ring-black/15 transition-all duration-300" />
          </motion.button>
        </div>
      )}

      {/* Scroll bar */}
      <div
        className="px-4 md:px-6 lg:px-12 relative"
        style={{ paddingTop: "24px", paddingBottom: "20px" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="w-full space-y-3"
        >
          <div
            ref={scrollBarRef}
            className="relative w-1/2 md:w-2/5 lg:w-1/3 h-0.5 bg-black/10 rounded-full overflow-hidden cursor-pointer group select-none mx-auto"
            onClick={handleScrollBarClick}
            onMouseMove={handleScrollBarDrag}
            onMouseDown={(e) => e.preventDefault()}
          >
            <motion.div
              className="h-full rounded-full cursor-grab active:cursor-grabbing transition-all duration-200 group-hover:h-1 select-none absolute"
              style={{
                background: "#a28b6f",
                width: "20%",
                left: `${scrollProgress * 0.8}%`,
              }}
              onMouseDown={(e) => {
                e.preventDefault()
                setIsDragging(true)
              }}
              transition={{ duration: 0.1, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
