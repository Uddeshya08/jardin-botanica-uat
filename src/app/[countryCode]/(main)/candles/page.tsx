// HERO COMPONENT with Motion Animations (Updated with PeopleAlsoBought effects)
"use client"
import { addToCartAction } from "@lib/data/cart-actions"
import { getProductCategoryByHandle } from "@lib/data/contentful"
import { getProductByHandle } from "@lib/data/products"
import { ImageWithFallback } from "app/components/figma/ImageWithFallback"
import { Navigation } from "app/components/Navigation"
import { PageBanner } from "app/components/PageBanner"
import { RippleEffect } from "app/components/RippleEffect"
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "app/components/ui/carousel"
import { CarouselSlider } from "app/components/ui/carousel-slider"
import { useCartItems } from "app/context/cart-items-context"
import { type LedgerItem, useLedger } from "app/context/ledger-context"
import { ChevronLeft, ChevronRight, Heart } from "lucide-react"
import { motion, useScroll, useSpring } from "motion/react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useRef, useState, useTransition } from "react"
import { toast } from "sonner"
import type { CandlesCollectionItem } from "../../../../types/contentful"
import InstagramEmbed2 from "./test"

const MobileProductCard = ({
  item,
  productId,
  countryCode,
}: {
  item: CandlesCollectionItem
  productId: string
  countryCode: string
}) => {
  const router = useRouter()
  const { toggleLedgerItem, isInLedger } = useLedger()
  const { cartItems, handleCartUpdate } = useCartItems()
  const isItemInLedger = isInLedger(productId)
  const [isPending, startTransition] = useTransition()

  const [isImageHovered, setIsImageHovered] = useState(false)
  const [isRecentlyAdded, setIsRecentlyAdded] = useState(false)
  const [isButtonHovered, setIsButtonHovered] = useState(false)

  const itemId = productId
  const variantId = item.variantId
  const isInCart = cartItems.some(
    (cartItem) => cartItem.id === itemId || (variantId && cartItem.variant_id === variantId)
  )

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const itemId = productId
    const variantId = item.variantId

    if (!variantId) {
      console.error("No variantId found for product:", item.label)
      toast.error("Could not add to cart — variant not found")
      return
    }

    // Check if item already exists in cart
    const existingItem = cartItems.find((cartItem) => cartItem.id === itemId)

    let cartItem
    if (existingItem) {
      // Increase quantity of existing item
      cartItem = {
        id: itemId,
        name: item.label,
        price: item.price || 0,
        quantity: existingItem.quantity + 1,
        image: item.src,
        variant_id: variantId,
      }
      toast.success(`Quantity updated — ${item.label}`, {
        duration: 2000,
      })
    } else {
      // Add new item
      cartItem = {
        id: itemId,
        name: item.label,
        price: item.price || 0,
        quantity: 1,
        image: item.src,
        variant_id: variantId,
      }
      toast.success(`${item.label} added to cart`, {
        duration: 2000,
      })
    }

    // Add to recently added products for UI state
    setIsRecentlyAdded(true)

    // Reset the button state after 2 seconds
    setTimeout(() => {
      setIsRecentlyAdded(false)
    }, 2000)

    handleCartUpdate(cartItem)

    // Server Action - persist cart to backend
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

  const handleProductClick = () => {
    if (item.url) {
      const normalizedUrl = item.url.startsWith("/") ? item.url : `/${item.url}`
      router.push(normalizedUrl)
    }
  }

  const handleToggleLedger = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const alreadyInLedger = isItemInLedger
    const ledgerItem: LedgerItem = {
      id: productId,
      name: item.label,
      price: item.price || 0,
      image: item.src,
      description: item.label,
      category: "Candles",
    }

    toggleLedgerItem(ledgerItem)
    toast.success(`${item.label} ${alreadyInLedger ? "removed from" : "added to"} Ledger`, {
      duration: 2000,
    })
  }

  return (
    <div
      className="group flex flex-col w-full mx-auto h-full"
      style={{
        minHeight: "460px",
        maxWidth: "480px",
      }}
    >
      {/* Product Image */}
      <Link
        href={item.url && item.url.startsWith("/") ? item.url : `/${item.url || "#"}`}
        className="block"
      >
        <div
          className="relative w-full overflow-hidden cursor-pointer aspect-[3/4] sm:aspect-[3/4]"
          style={{ marginBottom: "2.5rem" }}
          onMouseEnter={() => setIsImageHovered(true)}
          onMouseLeave={() => setIsImageHovered(false)}
        >
          {/* Hover Image - Behind */}
          {item.hoverSrc && isImageHovered && (
            <div className="absolute inset-0">
              <ImageWithFallback
                src={item.hoverSrc}
                alt={`${item.label} alternate view`}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Main Image - On Top */}
          <div
            className="absolute inset-0 transition-opacity duration-700 ease-in-out"
            style={{ opacity: isImageHovered && item.hoverSrc ? 0 : 1 }}
          >
            <ImageWithFallback
              src={item.src}
              alt={item.label}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Ledger Icon */}
          <button
            className="absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 bg-white/20 border border-white/30 hover:bg-white/30"
            aria-label={`${isItemInLedger ? "Remove from" : "Add to"} ledger`}
            onClick={(e) => {
              e.preventDefault() // maintain e.preventDefault() for the button inside Link
              handleToggleLedger(e)
            }}
          >
            <Heart
              size={18}
              className={`transition-colors duration-300 ${
                isItemInLedger ? "fill-[#e58a4d] stroke-[#e58a4d]" : "stroke-white fill-none"
              }`}
            />
          </button>
        </div>
      </Link>

      {/* Product Info */}
      <div className="flex flex-col flex-grow min-h-0 md:justify-between">
        <div>
          <div className="flex justify-center items-center py-1 md:py-2">
            <Link href={item.url && item.url.startsWith("/") ? item.url : `/${item.url || "#"}`}>
              <h3
                className="font-american-typewriter text-xl mb-0.5 md:mb-1 cursor-pointer hover:opacity-70 transition-opacity text-center"
                style={{ letterSpacing: "0.05em" }}
              >
                {item.label}
              </h3>
            </Link>
          </div>
        </div>

        {/* Actions Row */}
        <div className="flex items-center justify-end mt-auto pt-4">
          {/* Add to Cart Button (Right) */}
          <button
            onClick={(e) => handleAddToCart(e)}
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
  )
}

const ProductCard = ({
  src,
  label,
  hoverSrc,
  url,
  index,
  productId,
  price,
  variantId,
  countryCode,
}: {
  src: string
  label: string
  hoverSrc?: string
  url?: string
  index: number
  productId: string
  price: number
  variantId?: string
  countryCode: string
}) => {
  const { toggleLedgerItem, isInLedger } = useLedger()
  const { cartItems, handleCartUpdate } = useCartItems()
  const [isImageHovered, setIsImageHovered] = useState(false)
  const [isRecentlyAdded, setIsRecentlyAdded] = useState(false)
  const [isButtonHovered, setIsButtonHovered] = useState(false)
  const isItemInLedger = isInLedger(productId)
  const [isPending, startTransition] = useTransition()

  const itemId = productId
  const isInCart = cartItems.some(
    (cartItem) => cartItem.id === itemId || (variantId && cartItem.variant_id === variantId)
  )

  const handleToggleLedger = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const alreadyInLedger = isItemInLedger
    const ledgerItem: LedgerItem = {
      id: productId,
      name: label,
      price: price,
      image: src,
      description: label,
      category: "Candles",
    }

    toggleLedgerItem(ledgerItem)
    toast.success(`${label} ${alreadyInLedger ? "removed from" : "added to"} Ledger`, {
      duration: 2000,
    })
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const itemId = productId

    if (!variantId) {
      console.error("No variantId found for product:", label)
      toast.error("Could not add to cart — variant not found")
      return
    }

    // Check if item already exists in cart
    const existingItem = cartItems.find((cartItem) => cartItem.id === itemId)

    let cartItem
    if (existingItem) {
      // Increase quantity of existing item
      cartItem = {
        id: itemId,
        name: label,
        price: price,
        quantity: existingItem.quantity + 1,
        image: src,
        variant_id: variantId,
      }
      toast.success(`Quantity updated — ${label}`, {
        duration: 2000,
      })
    } else {
      // Add new item
      cartItem = {
        id: itemId,
        name: label,
        price: price,
        quantity: 1,
        image: src,
        variant_id: variantId,
      }
      toast.success(`${label} added to cart`, {
        duration: 2000,
      })
    }

    // Add to recently added products for UI state
    setIsRecentlyAdded(true)

    // Reset the button state after 2 seconds
    setTimeout(() => {
      setIsRecentlyAdded(false)
    }, 2000)

    handleCartUpdate(cartItem)

    // Server Action - persist cart to backend
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

  return (
    <div
      className="group flex flex-col w-full mx-auto"
      style={{ width: "364px", minHeight: "455px" }}
    >
      {/* Product Image */}
      {url ? (
        <Link href={url.startsWith("/") ? url : `/${url}`}>
          <div
            className="relative w-full overflow-hidden cursor-pointer"
            style={{ aspectRatio: "4/5", marginBottom: "1.5rem" }}
            onMouseEnter={() => setIsImageHovered(true)}
            onMouseLeave={() => setIsImageHovered(false)}
          >
            {/* Hover Image - Behind */}
            {hoverSrc && isImageHovered && (
              <div className="absolute inset-0">
                <ImageWithFallback
                  src={hoverSrc}
                  alt={`${label} alternate view`}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Main Image - On Top */}
            <div
              className="absolute inset-0 transition-opacity duration-700 ease-in-out"
              style={{ opacity: isImageHovered && hoverSrc ? 0 : 1 }}
            >
              <ImageWithFallback
                src={src}
                alt={label || "Product"}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Heart Icon - Always Visible */}
            <button
              onClick={handleToggleLedger}
              className="absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 z-10 bg-white/20 border border-white/30 hover:bg-white/30"
              aria-label={`${isItemInLedger ? "Remove from" : "Add to"} ledger`}
            >
              <Heart
                size={18}
                className={`transition-colors duration-300 ${
                  isItemInLedger ? "fill-[#e58a4d] stroke-[#e58a4d]" : "stroke-white fill-none"
                }`}
              />
            </button>
          </div>
        </Link>
      ) : (
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
            {hoverSrc && (
              <ImageWithFallback
                src={hoverSrc}
                alt={`${label} alternate view`}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Main Image - On Top */}
          <div
            className="absolute inset-0 transition-opacity duration-700 ease-in-out"
            style={{ opacity: isImageHovered && hoverSrc ? 0 : 1 }}
          >
            <ImageWithFallback
              src={src}
              alt={label || "Product"}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Heart Icon - Always Visible */}
          <button
            onClick={handleToggleLedger}
            className="absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 z-10 bg-white/20 border border-white/30 hover:bg-white/30"
            aria-label={`${isItemInLedger ? "Remove from" : "Add to"} ledger`}
          >
            <Heart
              size={18}
              className={`transition-colors duration-300 ${
                isItemInLedger ? "fill-[#e58a4d] stroke-[#e58a4d]" : "stroke-white fill-none"
              }`}
            />
          </button>
        </div>
      )}

      {/* Product Info */}
      <div className="flex flex-col flex-grow">
        {url ? (
          <Link href={url.startsWith("/") ? url : `/${url}`}>
            <div className="text-center">
              <h3
                className="font-american-typewriter text-lg mb-1 hover:opacity-70 transition-opacity cursor-pointer text-center"
                style={{ letterSpacing: "0.05em" }}
              >
                {label && label.trim() ? label : "Product Name"}
              </h3>
            </div>
          </Link>
        ) : (
          <div className="text-center">
            <h3
              className="font-american-typewriter text-lg mb-1 text-center"
              style={{ letterSpacing: "0.05em" }}
            >
              {label && label.trim() ? label : "Product Name"}
            </h3>
          </div>
        )}

        {/* Actions Row */}
        <div className="flex items-center justify-end mt-auto pt-4">
          {/* Add to Cart Button (Right) */}
          <button
            onClick={(e) => handleAddToCart(e)}
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
  )
}

const BannerProductCard = ({
  item,
  index,
  countryCode,
}: {
  item: CandlesCollectionItem
  index: number
  countryCode: string
}) => {
  const router = useRouter()
  const { cartItems, handleCartUpdate } = useCartItems() // Added useCartItems
  const [isHovered, setIsHovered] = useState(false)
  const [isRecentlyAdded, setIsRecentlyAdded] = useState(false) // Added state
  const [isButtonHovered, setIsButtonHovered] = useState(false) // Added state
  const [isPending, startTransition] = useTransition()

  const itemId = item.url || item.label.toLowerCase().replace(/\s+/g, "-")
  const variantId = item.variantId
  const isInCart = cartItems.some(
    (cartItem) => cartItem.id === itemId || (variantId && cartItem.variant_id === variantId)
  )

  const handleProductClick = () => {
    if (item.url) {
      const normalizedUrl = item.url.startsWith("/") ? item.url : `/${item.url}`
      router.push(normalizedUrl)
    }
  }

  // Added handleAddToCart function
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Generate a simple ID if none exists (fallback)
    const itemId = item.url || item.label.toLowerCase().replace(/\s+/g, "-")
    const variantId = item.variantId

    if (!variantId) {
      console.error("No variantId found for product:", item.label)
      toast.error("Could not add to cart — variant not found")
      return
    }

    // Check if item already exists in cart
    const existingItem = cartItems.find((cartItem) => cartItem.id === itemId)

    let cartItem
    if (existingItem) {
      // Increase quantity of existing item
      cartItem = {
        id: itemId,
        name: item.label,
        price: item.price || 0,
        quantity: existingItem.quantity + 1,
        image: item.src,
        variant_id: variantId,
      }
      toast.success(`Quantity updated — ${item.label}`, {
        duration: 2000,
      })
    } else {
      // Add new item
      cartItem = {
        id: itemId,
        name: item.label,
        price: item.price || 0,
        quantity: 1,
        image: item.src,
        variant_id: variantId,
      }
      toast.success(`${item.label} added to cart`, {
        duration: 2000,
      })
    }

    // Add to recently added products for UI state
    setIsRecentlyAdded(true)

    // Reset the button state after 2 seconds
    setTimeout(() => {
      setIsRecentlyAdded(false)
    }, 2000)

    handleCartUpdate(cartItem)

    // Server Action - persist cart to backend
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

  // Group products into sets of 3 for banner display
  const bannerIndex = Math.floor(index / 3)
  const positionInGroup = index % 3

  // Background colors/styles for each position (optional)
  const backgroundStyles = [
    {
      background: "linear-gradient(135deg, rgba(0,0,0,0.3), rgba(0,0,0,0.5))",
    }, // Dark
    {
      background: "linear-gradient(135deg, rgba(200,150,150,0.2), rgba(180,100,100,0.3))",
    }, // Warm pinkish
    {
      background: "linear-gradient(135deg, rgba(150,150,150,0.3), rgba(100,100,100,0.4))",
    }, // Grey
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="relative flex flex-col justify-between w-full h-full min-h-[400px] md:min-h-[450px] lg:min-h-[550px] cursor-pointer group overflow-hidden"
      onClick={handleProductClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="w-full h-full"
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{ willChange: "transform" }}
        >
          <ImageWithFallback
            src={item.src}
            alt={item.label}
            className="w-full h-full object-cover"
          />
        </motion.div>
        <div
          className="absolute inset-0 opacity-80 transition-opacity duration-700 ease-in-out group-hover:opacity-70 pointer-events-none"
          style={backgroundStyles[positionInGroup]}
        />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col justify-between h-full p-6 md:p-8 lg:p-12 text-white">
        {/* Top Text Section */}
        <div className="mt-auto mb-6 md:mb-8">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xs md:text-sm font-normal mb-2 md:mb-3 tracking-wide opacity-90 uppercase"
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: "0.05em",
              fontSize: "8px",
            }}
          >
            {positionInGroup === 0
              ? "MODERN LIGHTING"
              : positionInGroup === 1
                ? "CANDLES & REED DIFFUSERS"
                : "GLOBALLY AWARDED"}
          </motion.p>

          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ fontSize: "1.5rem" }}
            className="text-xl md:text-2xl lg:text-3xl font-normal tracking-tight leading-tight font-american-typewriter"
          >
            {item.label}
          </motion.h3>
        </div>

        {/* Replaced Explore Button with Add to Cart Button */}
        <div className="flex justify-end mt-4">
          <button
            onClick={(e) => handleAddToCart(e)}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
            className="group/btn relative inline-flex items-center gap-2 pb-0.5 text-white cursor-pointer"
          >
            <span
              className="font-din-arabic text-white text-base sm:text-sm shadow-black drop-shadow-md"
              style={{ letterSpacing: "0.12em" }}
            >
              {isRecentlyAdded ? "In cart" : "Add to cart"}
            </span>
            <span className="text-white text-base sm:text-sm drop-shadow-md">
              {isRecentlyAdded ? "✓" : "→"}
            </span>

            {/* Animated underline */}
            <motion.span
              className="absolute bottom-0 left-0 h-[1px] bg-white"
              initial={{ width: "0%" }}
              animate={{ width: isButtonHovered ? "100%" : "0%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

const Candles = () => {
  const router = useRouter()

  const carouselImages = [
    "/Images/Insta1.jpg",
    "/Images/Insta2.jpg",
    "/Images/Insta3.jpg",
    "/Images/AquaVeil1.jpg",
    "/Images/Pineraw.jpg",
    "/Images/SoftFloralraw.jpg",
  ]

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)
  const [hoveredProductIndex, setHoveredProductIndex] = useState<number | null>(null)
  const [candlesCollection, setCandlesCollection] = useState<CandlesCollectionItem[]>([])
  const [isLoadingCollection, setIsLoadingCollection] = useState(true)
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [isMobile, setIsMobile] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const { toggleLedgerItem, isInLedger } = useLedger()
  const { cartItems, handleCartUpdate } = useCartItems()
  const [mobileCarouselApi, setMobileCarouselApi] = useState<CarouselApi>()

  const [addedToCartMessage, setAddedToCartMessage] = useState<string | null>(null)
  const [bannerCarouselApi, setBannerCarouselApi] = useState<CarouselApi>()
  const [bannerCurrent, setBannerCurrent] = useState(0)

  // Smooth scroll animations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  // Smooth easing function for all animations
  const smoothEase = [0.25, 0.46, 0.45, 0.94] as const

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setIsScrolled(scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const nextImages = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex + 3 >= carouselImages.length ? 0 : prevIndex + 1
    )
  }

  const prevImages = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex <= 0 ? Math.max(0, carouselImages.length - 3) : prevIndex - 1
    )
  }

  const getVisibleImages = () => {
    const visible = []
    for (let i = 0; i < 3; i++) {
      const imageIndex = (currentImageIndex + i) % carouselImages.length
      visible.push(carouselImages[imageIndex])
    }
    return visible
  }

  // Fetch candles collection from Medusa via Contentful category
  const params = useParams()
  const countryCode = (params?.countryCode as string) || "us"

  useEffect(() => {
    const fetchCandlesCollection = async () => {
      setIsLoadingCollection(true)
      try {
        const category = await getProductCategoryByHandle("candles")
        if (!category?.productHandles?.length) {
          setCandlesCollection([])
          return
        }

        const productHandles = category.productHandles
        const products = await Promise.all(
          productHandles.map((handle) => getProductByHandle({ handle, countryCode }))
        )

        const collection: CandlesCollectionItem[] = products
          .filter((product): product is NonNullable<typeof product> => !!product)
          .map((product, index) => {
            const cheapestVariant = product.variants?.reduce((cheapest, variant) => {
              const price = variant.calculated_price?.calculated_amount || 0
              const cheapestPrice = cheapest?.calculated_price?.calculated_amount || 0
              return price < cheapestPrice ? variant : cheapest
            }, product.variants?.[0])

            return {
              label: product.title,
              src: product.images?.[0]?.url || product.thumbnail || "",
              hoverSrc: product.images?.[1]?.url || undefined,
              url: `/products/${product.handle}`,
              order: index,
              isActive: true,
              price: cheapestVariant?.calculated_price?.calculated_amount || undefined,
              variantId: cheapestVariant?.id,
            }
          })

        setCandlesCollection(collection)
      } catch (error) {
        console.error("Error fetching candles collection:", error)
      } finally {
        setIsLoadingCollection(false)
      }
    }
    fetchCandlesCollection()
  }, [countryCode])

  // Transform collection items for desktop products view (with hover images)
  const products = candlesCollection.map((item) => ({
    src: item.src,
    label: item.label,
    hoverSrc: item.hoverSrc,
    url: item.url,
    price: item.price,
    variantId: item.variantId,
  }))

  // Helper function to convert product name to URL slug
  function getProductSlug(productName: string): string {
    return productName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
  }

  // Handler for navigation
  const handleItemClick = (url?: string) => {
    if (url && url.trim() !== "") {
      // Handle both relative and absolute URLs
      const urlPath = url.startsWith("/")
        ? url
        : url.startsWith("http://") || url.startsWith("https://")
          ? new URL(url).pathname
          : `/${url}`

      if (urlPath && urlPath.trim() !== "" && urlPath !== "/") {
        router.push(urlPath)
      }
    }
  }

  // Banner carousel handlers
  useEffect(() => {
    if (!bannerCarouselApi) return

    setBannerCurrent(bannerCarouselApi.selectedScrollSnap())

    bannerCarouselApi.on("select", () => {
      setBannerCurrent(bannerCarouselApi.selectedScrollSnap())
    })

    bannerCarouselApi.on("scroll", () => {
      setBannerCurrent(bannerCarouselApi.selectedScrollSnap())
    })
  }, [bannerCarouselApi])

  // Group products for banner display (3 per banner)
  const bannerGroups: CandlesCollectionItem[][] = []
  for (let i = 0; i < candlesCollection.length; i += 3) {
    bannerGroups.push(candlesCollection.slice(i, i + 3))
  }

  return (
    <div ref={containerRef} className="bg-[#e2e2d8]">
      <style
        dangerouslySetInnerHTML={{
          __html: `
          html {
            scroll-behavior: smooth;
          }
          @media (prefers-reduced-motion: no-preference) {
            html {
              scroll-behavior: smooth;
            }
          }
        `,
        }}
      />
      <RippleEffect />
      <Navigation
        isScrolled={isScrolled}
        cartItems={cartItems}
        onCartUpdate={handleCartUpdate}
        forceWhiteText={true}
      />
      <PageBanner
        pageKey="candles"
        containerClassName="absolute top-[37%] md:top-1/2 ps-6 md:ps-0 md:left-9 lg:left-[4.5rem] md:-translate-y-1/2 max-w-xs md:max-w-md"
      />
      {/* Mobile Product Carousel Section - Mobile Only */}
      {!isLoadingCollection && candlesCollection.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: smoothEase }}
          viewport={{ once: true, amount: 0.2 }}
          className="hidden relative w-full py-12 overflow-hidden bg-[#e2e2d8]"
        >
          <motion.h2
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: smoothEase }}
            viewport={{ once: true }}
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontWeight: 300,
              letterSpacing: "-0.02em",
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[120px] md:text-[200px] lg:text-[280px] font-light text-gray-300/30 select-none pointer-events-none z-0 tracking-tight"
          >
            Botanica
          </motion.h2>

          <div className="relative z-10">
            {/* Mobile Heading */}
            <div className="pl-6 pb-6">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: smoothEase }}
                viewport={{ once: true, amount: 0.3 }}
                className="text-2xl md:text-3xl lg:text-4xl font-normal opacity-[50%] mb-2 md:mb-4 tracking-tight font-american-typewriter text-center"
              >
                A story in every scent.
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: smoothEase }}
                viewport={{ once: true, amount: 0.3 }}
                className="font-din-arabic text-base md:text-lg text-black/60 tracking-wide text-center"
              >
                Choose a mood to light.
              </motion.p>
            </div>

            {/* Mobile Carousel */}
            <style
              dangerouslySetInnerHTML={{
                __html: `
              .mobile-candles-carousel-item {
                width: calc((100vw - 64px) * 0.90) !important;
                flex-basis: calc((100vw - 64px) * 0.90) !important;
                flex-grow: 0 !important;
                flex-shrink: 0 !important;
                box-sizing: border-box !important;
                padding-left: 0 !important;
                padding-right: 0 !important;
                margin-left: 1rem !important;
                margin-right: 1rem !important;
              }
              .mobile-candles-carousel-item:first-child {
                margin-left: 14px !important;
              }
              .mobile-candles-carousel-content {
                user-select: none !important;
                -webkit-user-select: none !important;
                padding-left: 0 !important;
                padding-right: 1rem !important;
              }
              .mobile-candles-carousel-content > div {
                margin-left: 0 !important;
                gap: 0 !important;
              }
              [data-slot="carousel-content"] {
                cursor: grab !important;
                -webkit-overflow-scrolling: touch !important;
                scroll-behavior: smooth !important;
                scrollbar-width: none !important;
                -ms-overflow-style: none !important;
                overflow-x: auto !important;
                scroll-padding-left: 0 !important;
              }
              [data-slot="carousel-content"]::-webkit-scrollbar {
                display: none !important;
              }
              [data-slot="carousel-content"]:active {
                cursor: grabbing !important;
              }
            `,
              }}
            />
            <div className="pt-10 pb-0">
              <div className="px-4 mobile-candles-carousel-wrapper">
                <Carousel
                  setApi={setMobileCarouselApi}
                  opts={{
                    align: "center",
                    loop: false,
                    dragFree: false,
                    skipSnaps: false,
                    containScroll: "trimSnaps",
                    watchDrag: true,
                    duration: 60,
                  }}
                  className="w-full"
                >
                  <CarouselContent className="mobile-candles-carousel-content">
                    {candlesCollection.map((item, i) => {
                      const productId = item.url || item.label.toLowerCase().replace(/\s+/g, "-")
                      return (
                        <CarouselItem key={i} className="mobile-candles-carousel-item">
                          <MobileProductCard
                            item={item}
                            productId={productId}
                            countryCode={countryCode}
                          />
                        </CarouselItem>
                      )
                    })}
                  </CarouselContent>
                </Carousel>
              </div>

              <div className="px-6 mt-12">
                <CarouselSlider api={mobileCarouselApi} />
              </div>
            </div>
          </div>
        </motion.div>
      )}
      {/* mid section - product grid with PAB hover effects - Desktop Only */}
      {!isLoadingCollection && products.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: smoothEase }}
          viewport={{ once: true, amount: 0.1 }}
          className="hidden md:block w-full md:pt-12 lg:pt-16"
        >
          <div className="pl-[5rem] pb-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: smoothEase }}
              viewport={{ once: true, amount: 0.3 }}
              className="text-2xl md:text-3xl lg:text-4xl font-normal opacity-[50%] mb-2 md:mb-4 tracking-tight font-american-typewriter"
            >
              A story in every scent.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: smoothEase }}
              viewport={{ once: true, amount: 0.3 }}
              className="font-din-arabic text-base md:text-lg text-black/60 tracking-wide mt-[-0.5rem] mb-4"
            >
              Choose a mood to light.
            </motion.p>
          </div>
          {/* Desktop view - HomeCreationsPage Style Carousel */}
          <style
            dangerouslySetInnerHTML={{
              __html: `
            .candles-carousel-item {
              width: 364px !important;
              min-width: 364px !important;
              flex-basis: 364px !important;
              flex-grow: 0 !important;
              flex-shrink: 0 !important;
              box-sizing: border-box !important;
              padding-left: 0 !important;
              padding-right: 0 !important;
              margin-left: 1rem !important;
              margin-right: 1rem !important;
            }
            .candles-carousel-item:first-child {
              margin-left: 0 !important;
            }
            .candles-carousel-content {
              user-select: none !important;
              -webkit-user-select: none !important;
              padding-left: 0 !important;
              padding-right: 2rem !important;
            }
            .candles-carousel-content > div {
              margin-left: 0 !important;
              gap: 0 !important;
            }
            @media (min-width: 990px) {
              .candles-carousel-item {
                width: 364px !important;
                min-width: 364px !important;
                flex-basis: 364px !important;
                margin-left: 1rem !important;
                margin-right: 1rem !important;
              }
              .candles-carousel-content {
                padding-left: 0 !important;
                padding-right: 2rem !important;
              }
            }
            @media (min-width: 1200px) {
              .candles-carousel-item {
                width: 364px !important;
                min-width: 364px !important;
                flex-basis: 364px !important;
                margin-left: 1rem !important;
                margin-right: 1rem !important;
              }
              .candles-carousel-content {
                padding-left: 0 !important;
                padding-right: 2rem !important;
              }
            }
            [data-slot="carousel-content"] {
              cursor: grab !important;
              -webkit-overflow-scrolling: touch !important;
              scroll-behavior: smooth !important;
            }
            [data-slot="carousel-content"]:active {
              cursor: grabbing !important;
            }
          `,
            }}
          />
          <div className="pt-10 pb-0 sm:py-10 lg:py-10">
            <div className="pl-[5rem] pr-[4rem] candles-carousel-wrapper">
              <Carousel
                setApi={setCarouselApi}
                opts={{
                  align: "start",
                  loop: false,
                  dragFree: false,
                  skipSnaps: false,
                  containScroll: "trimSnaps",
                  watchDrag: true,
                  duration: 60,
                }}
                className="w-full"
              >
                <CarouselContent className="candles-carousel-content -ml-0">
                  {products.map(({ src, label, hoverSrc, url, price, variantId }, i) => {
                    const productId = url || label.toLowerCase().replace(/\s+/g, "-")
                    return (
                      <CarouselItem key={i} className="candles-carousel-item pl-0">
                        <ProductCard
                          index={i}
                          src={src}
                          label={label}
                          hoverSrc={hoverSrc}
                          url={url}
                          productId={productId}
                          price={price || 0}
                          variantId={variantId}
                          countryCode={countryCode}
                        />
                      </CarouselItem>
                    )
                  })}
                </CarouselContent>
              </Carousel>
            </div>
            <div className="pl-[5rem] pr-[4rem] mt-12">
              <CarouselSlider api={carouselApi} />
            </div>
          </div>
        </motion.div>
      )}
      {/* Banner Carousel Section - Shows 3 products side by side */}
      {!isLoadingCollection && candlesCollection.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: smoothEase }}
          viewport={{ once: true, amount: 0.1 }}
          className="md:hidden w-full py-8 overflow-hidden"
        >
          <div className="relative">
            {/* Mobile Heading for Banner Carousel */}
            <div className="pl-6 pb-6">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: smoothEase }}
                viewport={{ once: true, amount: 0.3 }}
                className="text-2xl md:text-3xl lg:text-4xl font-normal opacity-[50%] mb-2 md:mb-4 tracking-tight font-american-typewriter text-center"
              >
                A story in every scent.
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: smoothEase }}
                viewport={{ once: true, amount: 0.3 }}
                className="font-din-arabic text-base md:text-lg text-black/60 tracking-wide text-center"
              >
                Choose a mood to light.
              </motion.p>
            </div>
            {/* Banner Carousel */}
            <style
              dangerouslySetInnerHTML={{
                __html: `
              .banner-carousel-item {
                width: 100% !important;
                min-width: 100% !important;
                flex-basis: 100% !important;
                flex-grow: 0 !important;
                flex-shrink: 0 !important;
                padding-left: 0 !important;
                padding-right: 0 !important;
              }
              .banner-carousel-content {
                user-select: none !important;
                -webkit-user-select: none !important;
                padding-left: 0 !important;
                padding-right: 0 !important;
              }
              [data-slot="carousel-content"] {
                cursor: grab !important;
                scroll-behavior: smooth !important;
                scrollbar-width: none !important;
                -ms-overflow-style: none !important;
                overflow-x: auto !important;
              }
              [data-slot="carousel-content"]::-webkit-scrollbar {
                display: none !important;
              }
              [data-slot="carousel-content"]:active {
                cursor: grabbing !important;
              }
              @media (max-width: 767px) {
                .banner-carousel-item {
                  width: calc(100vw - 20px) !important;
                  min-width: calc(100vw - 20px) !important;
                  flex-basis: calc(100vw - 32px) !important;
                  padding-left: 0px !important;
                }
                .banner-carousel-content {
                  padding-left: 0 !important;
                  padding-right: 16px !important;
                }
                .banner-carousel-content > div {
                  margin-left: 0 !important;
                  gap: 0 !important;
                }
              }
            `,
              }}
            />

            <div className="banner-carousel-wrapper">
              <Carousel
                setApi={setBannerCarouselApi}
                opts={{
                  align: "start",
                  loop: false,
                  dragFree: false,
                  skipSnaps: false,
                  containScroll: "trimSnaps",
                  watchDrag: true,
                  duration: 60,
                }}
                className="w-full"
              >
                <CarouselContent className="banner-carousel-content">
                  {/* Mobile: Show individual products, Desktop: Show groups of 3 */}
                  {isMobile
                    ? // Mobile: One product per slide
                      candlesCollection.map((item, index) => (
                        <CarouselItem key={index} className="banner-carousel-item">
                          <BannerProductCard item={item} index={index} countryCode={countryCode} />
                        </CarouselItem>
                      ))
                    : // Desktop: Groups of 3 products
                      bannerGroups.map((group, groupIndex) => (
                        <CarouselItem key={groupIndex} className="banner-carousel-item">
                          <div className="flex flex-row gap-0 w-full h-auto">
                            {group.map((item, itemIndex) => {
                              const globalIndex = groupIndex * 3 + itemIndex
                              return (
                                <div key={globalIndex} className="flex-1 w-1/3">
                                  <BannerProductCard
                                    item={item}
                                    index={globalIndex}
                                    countryCode={countryCode}
                                  />
                                </div>
                              )
                            })}

                            {/* Fill remaining slots if group has less than 3 items */}
                            {group.length < 3 &&
                              Array.from({ length: 3 - group.length }).map((_, fillIndex) => (
                                <div key={`fill-${fillIndex}`} className="flex-1 w-1/3" />
                              ))}
                          </div>
                        </CarouselItem>
                      ))}
                </CarouselContent>
              </Carousel>
              <div className="px-6 mt-6">
                <CarouselSlider api={bannerCarouselApi} />
              </div>
            </div>

            {/* Navigation Arrows Removed for Mobile - Gesture Only */}
          </div>
        </motion.div>
      )}
      ;
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: smoothEase }}
        viewport={{ once: true, amount: 0.2 }}
        className="py-2 pb-6 md:py-6 px-4 md:px-12"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: smoothEase }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-2xl md:text-3xl lg:text-4xl font-normal opacity-[50%] mb-2 md:mb-4 tracking-tight font-american-typewriter"
          >
            Need a Hand Choosing?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: smoothEase }}
            viewport={{ once: true, amount: 0.3 }}
            className="font-din-arabic text-base md:text-lg text-black/70 leading-relaxed max-w-2xl mx-auto mb-6 md:mb-10 px-4 md:px-0"
          >
            Connect with one of our experts for personalized guidance and thoughtful product
            recommendations-crafted just for your skin, your rituals, your glow.
          </motion.p>
          <motion.a
            href="mailto:hello@jardinbotanica.com"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.8, delay: 0.5, ease: smoothEase }}
            viewport={{ once: true, amount: 0.3 }}
            className="bg-transparent border border-black/30 text-black hover:bg-black hover:text-white transition-all duration-300 px-6 py-3 md:px-8 font-normal tracking-wide rounded-none font-din-arabic text-sm md:text-base inline-block"
          >
            Speak with us
          </motion.a>
        </div>
      </motion.div>
      {/* Soft Orris Section */};
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1, ease: smoothEase }}
        viewport={{ once: true, amount: 0.1 }}
        className="py-12 lg:py-16"
      >
        <div className="flex flex-col md:flex-row items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: smoothEase }}
            viewport={{ once: true, amount: 0.2 }}
            className="w-full md:w-[55%] h-[300px] md:h-[500px] overflow-hidden"
          >
            <video autoPlay loop muted playsInline className="w-full h-full object-cover">
              <source
                src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: smoothEase }}
            viewport={{ once: true, amount: 0.2 }}
            className="w-full md:w-[45%] flex flex-col justify-center px-4 pt-12 md:pt-0 md:pl-12 md:pr-12"
          >
            <div className="max-w-xl">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: smoothEase }}
                viewport={{ once: true, amount: 0.3 }}
                className="text-2xl md:text-3xl lg:text-4xl font-normal opacity-[50%] mb-6 tracking-tight leading-tight font-american-typewriter"
              >
                Soft Orris - The Scent of Stillness
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: smoothEase }}
                viewport={{ once: true, amount: 0.3 }}
                className="font-din-arabic text-base md:text-lg text-black/70 leading-relaxed mb-8"
              >
                Powdery, elegant, and quietly floral-Soft Orris wraps your space in a gentle hug.
                Perfect for slow mornings, self-care rituals, or unwinding at dusk. It's calm,
                bottled in wax.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5, ease: smoothEase }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: "#000", color: "#fff" }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.3, ease: smoothEase }}
                  className="bg-transparent border border-black/30 text-black px-8 py-3 font-normal tracking-wide rounded-none font-din-arabic text-base transition-colors duration-300"
                >
                  Read more
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
      {/* Let's Stay in Touch Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: smoothEase }}
        viewport={{ once: true, amount: 0.2 }}
        className="py-12 md:py-10 px-4 md:px-12"
      >
        <div className="pb-4">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: smoothEase }}
              viewport={{ once: true, amount: 0.2 }}
              className="w-full relative md:w-1/2 md:pr-12 mt-[4%] pl-4 md:pl-0"
            >
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: smoothEase }}
                viewport={{ once: true, amount: 0.3 }}
                className="text-2xl md:text-3xl lg:text-4xl font-normal opacity-[50%] mb-4 tracking-tight font-american-typewriter"
              >
                Let's Stay in Touch
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: smoothEase }}
                viewport={{ once: true, amount: 0.3 }}
                className="font-din-arabic text-base md:text-lg text-black/70 leading-relaxed"
              >
                Follow us on Instagram and Facebook for moments of calm,
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5, ease: smoothEase }}
                viewport={{ once: true, amount: 0.3 }}
                className="font-din-arabic text-base md:text-lg text-black/70 leading-relaxed"
              >
                candlelight rituals, and a peek behind the scenes{" "}
                <span className="text-orange-500 font-din-arabic">@</span>
                <span className="text-orange-500 font-din-arabic border-b-[1px] border-orange-500">
                  JardinBotanica
                </span>
                .
              </motion.p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: smoothEase }}
              viewport={{ once: true, amount: 0.2 }}
              className="w-full md:w-[60%] relative mt-8 md:mt-0"
            >
              {isMobile ? (
                // Mobile View - Carousel
                <>
                  <style
                    dangerouslySetInnerHTML={{
                      __html: `
                        .stay-in-touch-carousel-item {
                          flex-basis: 40% !important;
                          padding-left: 0 !important;
                          margin-right: 0.5rem !important;
                        }
                        .stay-in-touch-carousel-content {
                          margin-left: 0 !important;
                          gap: 0 !important;
                        }
                      `,
                    }}
                  />
                  <Carousel
                    opts={{
                      align: "start",
                      loop: false,
                      dragFree: true,
                      containScroll: "trimSnaps",
                    }}
                    className="w-full"
                  >
                    <CarouselContent className="stay-in-touch-carousel-content">
                      {carouselImages.map((imageSrc, index) => (
                        <CarouselItem key={index} className="stay-in-touch-carousel-item pl-0">
                          <div className="w-full h-auto aspect-square overflow-hidden rounded-lg relative">
                            <img
                              src={imageSrc}
                              alt={`Instagram post ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                </>
              ) : (
                // Desktop View - Existing Slider
                <div className="flex gap-2 md:gap-4 overflow-hidden relative px-2 md:px-12">
                  {/* Left Navigation Button */}
                  <div className="hidden md:block absolute left-0 md:left-4 top-1/2 -translate-y-1/2 mt-8 z-20">
                    <motion.button
                      whileHover={{ scale: 1.05, x: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={prevImages}
                      className="group relative w-12 h-12 md:w-14 md:h-14 rounded-full backdrop-blur-md transition-all duration-500 bg-white/10 hover:bg-white/20 border border-white/30 hover:border-white/50 shadow-2xl hover:shadow-3xl overflow-hidden"
                      aria-label="Scroll left"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:text-white transition-all duration-300" />
                      </div>
                      <div className="absolute inset-0 rounded-full ring-1 ring-white/30 group-hover:ring-white/50 transition-all duration-300" />
                    </motion.button>
                  </div>
                  <div className="flex gap-2 md:gap-4 w-full transition-all duration-300 ease-in-out">
                    {getVisibleImages().map((imageSrc, index) => (
                      <motion.div
                        key={`${currentImageIndex}-${index}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.6,
                          delay: index * 0.1,
                          ease: smoothEase,
                        }}
                        viewport={{ once: true, amount: 0.2 }}
                        className="w-full h-auto aspect-square overflow-hidden rounded-lg relative"
                      >
                        <motion.img
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.4, ease: smoothEase }}
                          src={imageSrc}
                          alt={`Instagram post ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {/* Vertical Divider - only between 2nd and 3rd images */}
                        {index === 1 && (
                          <div className="absolute right-0 top-0 bottom-0 w-px bg-gray-300 z-10"></div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                  {/* Right Navigation Button */}
                  <div className="hidden md:block absolute right-0 md:right-4 top-1/2 -translate-y-1/2 mt-8 z-20">
                    <motion.button
                      whileHover={{ scale: 1.05, x: 2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={nextImages}
                      className="group relative w-12 h-12 md:w-14 md:h-14 rounded-full backdrop-blur-md transition-all duration-500 bg-white/10 hover:bg-white/20 border border-white/30 hover:border-white/50 shadow-2xl hover:shadow-3xl overflow-hidden"
                      aria-label="Scroll right"
                    >
                      <div className="absolute inset-0 bg-gradient-to-l from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:text-white transition-all duration-300" />
                      </div>
                      <div className="absolute inset-0 rounded-full ring-1 ring-white/30 group-hover:ring-white/50 transition-all duration-300" />
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
      {/* Newsletter Section */}; ;
      <section className="py-20 relative overflow-hiddenen" style={{ backgroundColor: "#e3e3d8" }}>
        <motion.div
          className="absolute inset-0 opacity-15"
          style={{
            background: "linear-gradient(45deg, #e58a4d, #545d4a, #e58a4d, #545d4a, #e58a4d)",
            backgroundSize: "600% 600%",
          }}
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
          }}
          transition={{
            duration: 15,
            ease: [0.4, 0, 0.6, 1],
            repeat: Infinity,
          }}
        />
        <motion.div
          className="absolute inset-0 opacity-10"
          style={{
            background: "linear-gradient(-45deg, #545d4a, #e58a4d, #545d4a, #e58a4d)",
            backgroundSize: "800% 800%",
          }}
          animate={{
            backgroundPosition: ["100% 0%", "0% 100%", "100% 0%"],
          }}
          transition={{
            duration: 20,
            ease: [0.25, 0.46, 0.45, 0.94],
            repeat: Infinity,
          }}
        />
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: smoothEase }}
              viewport={{ once: true, amount: 0.3 }}
              className="font-american-typewriter text-2xl md:text-3xl lg:text-4xl tracking-tight mb-6 text-black"
            >
              Join the Circle
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: smoothEase }}
              viewport={{ once: true, amount: 0.3 }}
              className="font-din-arabic text-base md:text-lg text-black/70 leading-relaxed mb-8"
            >
              Be the first to discover new blends, exclusive rituals, and stories from our botanical
              laboratory.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: smoothEase }}
              viewport={{ once: true, amount: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            >
              <motion.input
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.3, ease: smoothEase }}
                type="email"
                placeholder="Enter your email"
                className="font-din-arabic flex-1 px-4 py-3 bg-transparent border border-black/30 text-black placeholder-black/60 focus:outline-none focus:border-black transition-all duration-300"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3, ease: smoothEase }}
                className="font-din-arabic px-8 py-3 bg-black text-white hover:bg-black/90 transition-colors tracking-wide"
              >
                Subscribe
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Candles
