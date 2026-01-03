// HERO COMPONENT with Motion Animations (Updated with PeopleAlsoBought effects)
"use client"
import { Github } from "@medusajs/icons"
import { Heading } from "@medusajs/ui"
import { useEffect, useState, useRef } from "react"
import { motion, useScroll, useTransform, useSpring } from "motion/react"
import { ChevronLeft, ChevronRight, Heart } from "lucide-react"
import { RippleEffect } from "app/components/RippleEffect"
import { Navigation } from "app/components/Navigation"
import { PageBanner } from "app/components/PageBanner"
import { getCandlesCollection } from "@lib/data/contentful"
import { CandlesCollectionItem } from "../../../../types/contentful"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ImageWithFallback } from "app/components/figma/ImageWithFallback"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "app/components/ui/carousel"
import { useLedger, LedgerItem } from "app/context/ledger-context"
import { useCartItems } from "app/context/cart-items-context"
import { toast } from "sonner"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
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
  const [productScrollPosition, setProductScrollPosition] = useState(0)
  const [maxProductScroll, setMaxProductScroll] = useState(0)
  const [candlesCollection, setCandlesCollection] = useState<CandlesCollectionItem[]>([])
  const [isLoadingCollection, setIsLoadingCollection] = useState(true)
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [isMobile, setIsMobile] = useState(false)
  const [current, setCurrent] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)
  const mobileSliderRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { toggleLedgerItem, isInLedger } = useLedger()
  const { cartItems, handleCartUpdate } = useCartItems()
  const [mobileCarouselApi, setMobileCarouselApi] = useState<CarouselApi>()
  const [mobileCurrent, setMobileCurrent] = useState(0)
  const [mobileScrollProgress, setMobileScrollProgress] = useState(0)
  const [isMobileDragging, setIsMobileDragging] = useState(false)
  const [addedToCartMessage, setAddedToCartMessage] = useState<string | null>(null)

  // Smooth scroll animations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })
  
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
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
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (!carouselApi) return

    setCurrent(carouselApi.selectedScrollSnap())
    setScrollProgress(carouselApi.scrollProgress())

    carouselApi.on("select", () => {
      setCurrent(carouselApi.selectedScrollSnap())
    })

    carouselApi.on("scroll", () => {
      setScrollProgress(carouselApi.scrollProgress())
      setCurrent(carouselApi.selectedScrollSnap())
    })
  }, [carouselApi])

  useEffect(() => {
    if (!mobileCarouselApi) return

    setMobileCurrent(mobileCarouselApi.selectedScrollSnap())
    setMobileScrollProgress(mobileCarouselApi.scrollProgress())

    mobileCarouselApi.on("select", () => {
      setMobileCurrent(mobileCarouselApi.selectedScrollSnap())
    })

    mobileCarouselApi.on("scroll", () => {
      setMobileScrollProgress(mobileCarouselApi.scrollProgress())
      setMobileCurrent(mobileCarouselApi.selectedScrollSnap())
    })
  }, [mobileCarouselApi])

  const handleSliderClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) return
    e.stopPropagation()
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percentage = Math.min(Math.max(clickX / rect.width, 0), 1)
    
    if (carouselApi) {
      const scrollSnaps = carouselApi.scrollSnapList()
      if (scrollSnaps.length > 0) {
        const targetIndex = Math.round(percentage * (scrollSnaps.length - 1))
        carouselApi.scrollTo(targetIndex)
      }
    }
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!sliderRef.current || !carouselApi) return
      const rect = sliderRef.current.getBoundingClientRect()
      const clickX = e.clientX - rect.left
      const percentage = Math.min(Math.max(clickX / rect.width, 0), 1)
      
      const scrollSnaps = carouselApi.scrollSnapList()
      if (scrollSnaps.length > 0) {
        const targetIndex = Math.round(percentage * (scrollSnaps.length - 1))
        carouselApi.scrollTo(targetIndex)
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!sliderRef.current || !carouselApi) return
      const rect = sliderRef.current.getBoundingClientRect()
      const touch = e.touches[0]
      const clickX = touch.clientX - rect.left
      const percentage = Math.min(Math.max(clickX / rect.width, 0), 1)
      
      const scrollSnaps = carouselApi.scrollSnapList()
      if (scrollSnaps.length > 0) {
        const targetIndex = Math.round(percentage * (scrollSnaps.length - 1))
        carouselApi.scrollTo(targetIndex)
      }
    }

    const handleTouchEnd = () => {
      setIsDragging(false)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }

    document.addEventListener('touchmove', handleTouchMove)
    document.addEventListener('touchend', handleTouchEnd)
  }

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

  // Fetch candles collection from Contentful
  useEffect(() => {
    const fetchCandlesCollection = async () => {
      setIsLoadingCollection(true)
      try {
        const collection = await getCandlesCollection()
        setCandlesCollection(collection)
      } catch (error) {
        console.error("Error fetching candles collection:", error)
      } finally {
        setIsLoadingCollection(false)
      }
    }
    fetchCandlesCollection()
  }, [])

  // Transform collection items for desktop products view (with hover images)
  const products = candlesCollection.map((item) => ({
    src: item.src,
    label: item.label,
    hoverSrc: item.hoverSrc || item.src, // Fallback to main image if no hover image
    url: item.url,
  }))

  // Calculate slider position based on scroll progress
  const sliderPercentage = scrollProgress * 100

  // Helper function to convert product name to URL slug
  function getProductSlug(productName: string): string {
    return productName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
  }

  // Mobile Product Card Component - ProductCarousel Style
  function MobileProductCard({ item, productId }: { item: CandlesCollectionItem; productId: string }) {
    const [isImageHovered, setIsImageHovered] = useState(false)
    const isItemInLedger = isInLedger(productId)

    const handleProductClick = () => {
      if (item.url) {
        const normalizedUrl = item.url.startsWith('/') ? item.url : `/${item.url}`
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
        price: 0, // Price not available in CandlesCollectionItem
        image: item.src,
        description: item.label,
        category: "Candles"
      }

      toggleLedgerItem(ledgerItem)
      toast.success(`${item.label} ${alreadyInLedger ? "Removed From" : "Added To"} Ledger`, {
        duration: 2000
      })
    }

    return (
      <div
        className="group flex flex-col w-full mx-auto h-full"
        style={{
          minHeight: "460px",
          maxWidth: "480px",
          paddingLeft: "1.5rem",
        }}
      >
        {/* Product Image */}
        <div
          className="relative w-full overflow-hidden cursor-pointer aspect-[3/4] sm:aspect-[3/4]"
          style={{ marginBottom: "2.5rem" }}
          onMouseEnter={() => setIsImageHovered(true)}
          onMouseLeave={() => setIsImageHovered(false)}
          onClick={handleProductClick}
        >
          {/* Hover Image - Behind */}
          {item.hoverSrc && (
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
            onClick={handleToggleLedger}
          >
            <Heart
              size={18}
              className={`transition-colors duration-300 ${
                isItemInLedger ? "fill-[#e58a4d] stroke-[#e58a4d]" : "stroke-white fill-none"
              }`}
            />
          </button>
        </div>

        {/* Product Info */}
        <div className="flex flex-col flex-grow min-h-0 md:justify-between">
          <div>
            <div className="flex justify-start items-center py-1 md:py-2">
              <h3
                className="font-american-typewriter text-xl mb-0.5 md:mb-1 cursor-pointer hover:opacity-70 transition-opacity"
                style={{ letterSpacing: "0.05em" }}
                onClick={handleProductClick}
              >
                {item.label}
              </h3>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Product Card Component - HomeCreationsPage Style
  function ProductCard({ src, label, hoverSrc, url, index, productId }: { src: string; label: string; hoverSrc: string; url?: string; index: number; productId: string }) {
    const [isImageHovered, setIsImageHovered] = useState(false)
    const isItemInLedger = isInLedger(productId)

    const handleToggleLedger = (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      
      const alreadyInLedger = isItemInLedger
      const ledgerItem: LedgerItem = {
        id: productId,
        name: label,
        price: 0, // You may want to get actual price from your data
        image: src,
        description: label,
        category: "Candles"
      }

      toggleLedgerItem(ledgerItem)
      toast.success(`${label} ${alreadyInLedger ? "Removed From" : "Added To"} Ledger`, {
        duration: 2000
      })
    }
    
    return (
      <div
        className="group flex flex-col w-full mx-auto"
        style={{ minHeight: "600px", maxWidth: "420px" }}
      >
        {/* Product Image */}
        {url ? (
          <Link href={url.startsWith('/') ? url : `/${url}`}>
            <div
              className="relative w-full overflow-hidden cursor-pointer"
              style={{ aspectRatio: "4/5", marginBottom: "1.5rem" }}
              onMouseEnter={() => setIsImageHovered(true)}
              onMouseLeave={() => setIsImageHovered(false)}
            >
              {/* Hover Image - Behind */}
              {hoverSrc && (
                <div className="absolute inset-0">
                  <ImageWithFallback src={hoverSrc} alt={`${label} alternate view`} className="w-full h-full object-cover" />
                </div>
              )}

              {/* Main Image - On Top */}
              <div className="absolute inset-0 transition-opacity duration-700 ease-in-out" style={{ opacity: isImageHovered ? 0 : 1 }}>
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
                <Heart size={18} className={`transition-colors duration-300 ${isItemInLedger ? "fill-[#e58a4d] stroke-[#e58a4d]" : "stroke-white fill-none"}`} />
              </button>
            </div>
          </Link>
        ) : (
          <div
            className="relative w-full overflow-hidden cursor-pointer"
            style={{ aspectRatio: "4/5", marginBottom: "1.5rem" }}
            onMouseEnter={() => setIsImageHovered(true)}
            onMouseLeave={() => setIsImageHovered(false)}
          >
            {/* Hover Image - Behind */}
            {hoverSrc && (
              <div className="absolute inset-0">
                <ImageWithFallback src={hoverSrc} alt={`${label} alternate view`} className="w-full h-full object-cover" />
              </div>
            )}

            {/* Main Image - On Top */}
            <div className="absolute inset-0 transition-opacity duration-700 ease-in-out" style={{ opacity: isImageHovered ? 0 : 1 }}>
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
                <Heart size={18} className={`transition-colors duration-300 ${isItemInLedger ? "fill-[#e58a4d] stroke-[#e58a4d]" : "stroke-white fill-none"}`} />
              </button>
          </div>
        )}

        {/* Product Info */}
        <div className="flex flex-col flex-grow">
          {url ? (
            <Link href={url.startsWith('/') ? url : `/${url}`}>
              <div>
                <h3 className="font-american-typewriter text-xl mb-1 hover:opacity-70 transition-opacity cursor-pointer" style={{ letterSpacing: "0.05em" }}>
                  {label && label.trim() ? label : "Product Name"}
                </h3>
              </div>
            </Link>
          ) : (
            <div>
              <h3 className="font-american-typewriter text-xl mb-1" style={{ letterSpacing: "0.05em" }}>
                {label && label.trim() ? label : "Product Name"}
              </h3>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Handler for navigation
  const handleItemClick = (url?: string) => {
    if (url && url.trim() !== '') {
      // Handle both relative and absolute URLs
      const urlPath = url.startsWith('/') 
        ? url 
        : (url.startsWith('http://') || url.startsWith('https://'))
          ? new URL(url).pathname
          : `/${url}`
      
      if (urlPath && urlPath.trim() !== '' && urlPath !== '/') {
        router.push(urlPath)
      }
    }
  }

  const scrollProducts = (direction: 'left' | 'right') => {
    const scrollContainer = document.getElementById('product-slider')
    if (scrollContainer) {
      // Calculate scroll amount: 2 items + gap
      // Item width: (100vw - 2rem) / 2 - 0.5rem
      // Gap: 1rem = 16px
      const containerWidth = scrollContainer.clientWidth
      const itemWidth = (containerWidth - 32 - 16) / 2 // Account for px-4 (32px) and gap
      const scrollAmount = (itemWidth * 2) + 16 // Two images + gap
      
      const currentScroll = scrollContainer.scrollLeft
      const newPosition = direction === 'right' 
        ? currentScroll + scrollAmount 
        : Math.max(0, currentScroll - scrollAmount)
      
      scrollContainer.scrollTo({ 
        left: newPosition, 
        behavior: 'smooth' 
      })
      setProductScrollPosition(newPosition)
    }
  }

  useEffect(() => {
    const scrollContainer = document.getElementById('product-slider')
    if (!scrollContainer) return

    const updateScrollInfo = () => {
      setProductScrollPosition(scrollContainer.scrollLeft)
      setMaxProductScroll(scrollContainer.scrollWidth - scrollContainer.clientWidth)
    }

    updateScrollInfo()
    scrollContainer.addEventListener('scroll', updateScrollInfo)
    
    // Recalculate on resize
    window.addEventListener('resize', updateScrollInfo)
    
    return () => {
      scrollContainer.removeEventListener('scroll', updateScrollInfo)
      window.removeEventListener('resize', updateScrollInfo)
    }
  }, [])

  const canScrollLeft = productScrollPosition > 0
  const canScrollRight = productScrollPosition < maxProductScroll - 10 // Small buffer for smooth scrolling

  // Mobile slider handlers
  const handleMobileSliderClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobileDragging) return
    e.stopPropagation()
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percentage = Math.min(Math.max(clickX / rect.width, 0), 1)
    
    if (mobileCarouselApi) {
      const scrollSnaps = mobileCarouselApi.scrollSnapList()
      if (scrollSnaps.length > 0) {
        const targetIndex = Math.round(percentage * (scrollSnaps.length - 1))
        mobileCarouselApi.scrollTo(targetIndex)
      }
    }
  }

  const handleMobileMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsMobileDragging(true)
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!mobileSliderRef.current || !mobileCarouselApi) return
      const rect = mobileSliderRef.current.getBoundingClientRect()
      const clickX = e.clientX - rect.left
      const percentage = Math.min(Math.max(clickX / rect.width, 0), 1)
      
      const scrollSnaps = mobileCarouselApi.scrollSnapList()
      if (scrollSnaps.length > 0) {
        const targetIndex = Math.round(percentage * (scrollSnaps.length - 1))
        mobileCarouselApi.scrollTo(targetIndex)
      }
    }

    const handleMouseUp = () => {
      setIsMobileDragging(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleMobileTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsMobileDragging(true)
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!mobileSliderRef.current || !mobileCarouselApi) return
      const rect = mobileSliderRef.current.getBoundingClientRect()
      const touch = e.touches[0]
      const clickX = touch.clientX - rect.left
      const percentage = Math.min(Math.max(clickX / rect.width, 0), 1)
      
      const scrollSnaps = mobileCarouselApi.scrollSnapList()
      if (scrollSnaps.length > 0) {
        const targetIndex = Math.round(percentage * (scrollSnaps.length - 1))
        mobileCarouselApi.scrollTo(targetIndex)
      }
    }

    const handleTouchEnd = () => {
      setIsMobileDragging(false)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }

    document.addEventListener('touchmove', handleTouchMove)
    document.addEventListener('touchend', handleTouchEnd)
  }

  // Calculate mobile slider position
  const mobileSliderPercentage = candlesCollection.length > 0 
    ? (mobileCurrent / (candlesCollection.length - 1)) * 100 
    : 0


  return (
    <div ref={containerRef} className="bg-[#e2e2d8]">
      <style dangerouslySetInnerHTML={{
        __html: `
          html {
            scroll-behavior: smooth;
          }
          @media (prefers-reduced-motion: no-preference) {
            html {
              scroll-behavior: smooth;
            }
          }
        `
      }} />
      <RippleEffect />
      <Navigation
        isScrolled={isScrolled}
        cartItems={cartItems}
        onCartUpdate={handleCartUpdate}
        forceWhiteText={true}
      />
      
      <PageBanner pageKey="candles" />

      {/* Mobile Product Carousel Section - Mobile Only */}
      {!isLoadingCollection && candlesCollection.length > 0 && (
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: smoothEase }}
        viewport={{ once: true, amount: 0.2 }}
        className="md:hidden relative w-full py-12 overflow-hidden bg-[#e2e2d8]"
      >
        <motion.h2
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: smoothEase }}
          viewport={{ once: true }}
          style={{ 
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontWeight: 300,
            letterSpacing: '-0.02em'
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
          </div>
          
          {/* Mobile Carousel */}
          <style dangerouslySetInnerHTML={{
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
              .mobile-candles-carousel-content {
                user-select: none !important;
                -webkit-user-select: none !important;
                padding-left: 0 !important;
                padding-right: 0 !important;
              }
              .mobile-candles-carousel-content > div {
                margin-left: 0 !important;
                gap: 0 !important;
              }
              .mobile-candles-carousel-wrapper [data-slot="carousel-content"] {
                cursor: grab !important;
                -webkit-overflow-scrolling: touch !important;
                scroll-behavior: smooth !important;
                scrollbar-width: none !important;
                -ms-overflow-style: none !important;
                overflow-x: auto !important;
              }
              .mobile-candles-carousel-wrapper [data-slot="carousel-content"]::-webkit-scrollbar {
                display: none !important;
              }
              .mobile-candles-carousel-wrapper [data-slot="carousel-content"]:active {
                cursor: grabbing !important;
              }
            `
          }} />
          <div className="pt-10 pb-0">
            <div className="px-4 mobile-candles-carousel-wrapper">
              <Carousel
                setApi={setMobileCarouselApi}
                opts={{
                  align: "center",
                  loop: false,
                  dragFree: true,
                  containScroll: "trimSnaps",
                  watchDrag: true,
                  duration: 40,
                }}
                className="w-full"
              >
                <CarouselContent className="mobile-candles-carousel-content">
                  {candlesCollection.map((item, i) => {
                    const productId = item.url || item.label.toLowerCase().replace(/\s+/g, '-')
                    return (
                      <CarouselItem
                        key={i}
                        className="mobile-candles-carousel-item"
                      >
                        <MobileProductCard
                          item={item}
                          productId={productId}
                        />
                      </CarouselItem>
                    )
                  })}
                </CarouselContent>
              </Carousel>
            </div>
            
            {/* Mobile Slider Bar */}
            <div className="flex justify-center items-center w-full pt-3" style={{ paddingTop: "1.5rem", paddingBottom: "20px" }}>
              <div 
                ref={mobileSliderRef}
                className="relative w-1/2 h-0.5 bg-black/10 rounded-full cursor-pointer select-none group"
                onClick={handleMobileSliderClick}
              >
                <div
                  className="absolute top-1/2 h-0.5 w-8 rounded-full bg-black/30 transition-all duration-200 group-hover:w-10 group-hover:bg-black/40 cursor-grab active:cursor-grabbing"
                  style={{
                    left: `calc(${Math.max(0, Math.min(100, mobileSliderPercentage))}% - 16px)`,
                    transform: 'translateY(-50%)'
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleMobileMouseDown(e)
                  }}
                  onTouchStart={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleMobileTouchStart(e)
                  }}
                />
              </div>
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
         </div>
        {/* Desktop view - HomeCreationsPage Style Carousel */}
        <style dangerouslySetInnerHTML={{
          __html: `
            .candles-carousel-item {
              width: calc((100vw - 8rem - 4rem) / 3) !important;
              max-width: 420px !important;
              flex-basis: calc((100vw - 8rem - 4rem) / 3) !important;
              flex-grow: 0 !important;
              flex-shrink: 0 !important;
              box-sizing: border-box !important;
              padding-left: 0 !important;
              padding-right: 0 !important;
              margin-right: 2rem !important;
            }
            .candles-carousel-item:last-child {
              margin-right: 0 !important;
            }
            @media (min-width: 1440px) {
              .candles-carousel-item {
                width: 420px !important;
                flex-basis: 420px !important;
              }
            }
            .candles-carousel-content {
              user-select: none !important;
              -webkit-user-select: none !important;
              padding-left: 0 !important;
              padding-right: 0 !important;
            }
            .candles-carousel-content > div {
              margin-left: 0 !important;
              gap: 0 !important;
            }
            .candles-carousel-wrapper [data-slot="carousel-content"] {
              cursor: grab !important;
              -webkit-overflow-scrolling: touch !important;
              scroll-behavior: smooth !important;
              scrollbar-width: none !important;
              -ms-overflow-style: none !important;
              overflow-x: auto !important;
            }
            .candles-carousel-wrapper [data-slot="carousel-content"]::-webkit-scrollbar {
              display: none !important;
            }
            .candles-carousel-wrapper [data-slot="carousel-content"]:active {
              cursor: grabbing !important;
            }
            .candles-carousel-wrapper [data-slot="carousel-content"] * {
              -webkit-transform: translateZ(0) !important;
              transform: translateZ(0) !important;
              will-change: transform !important;
            }
          `
        }} />
        <div className="pt-10 pb-0 sm:py-10 lg:py-10">
          <div className="pl-[5rem] pr-[4rem] candles-carousel-wrapper">
            <Carousel
              setApi={setCarouselApi}
              opts={{
                align: "start",
                loop: false,
                dragFree: true,
                containScroll: "trimSnaps",
                watchDrag: true,
                duration: 50,
                slidesToScroll: 1,
              }}
              className="w-full"
            >
              <CarouselContent className="candles-carousel-content -ml-0">
                {products.map(({ src, label, hoverSrc, url }, i) => {
                  const productId = url || label.toLowerCase().replace(/\s+/g, '-')
                  return (
                    <CarouselItem
                      key={i}
                      className="candles-carousel-item pl-0"
                    >
                      <ProductCard
                        index={i}
                        src={src}
                        label={label}
                        hoverSrc={hoverSrc}
                        url={url}
                        productId={productId}
                      />
                    </CarouselItem>
                  )
                })}
              </CarouselContent>
            </Carousel>
          </div>
          
          {/* Progress Scroll Bar - Slider Style */}
          <div className="flex justify-center items-center w-full pt-3" style={{ paddingTop: "1.5rem", paddingBottom: "20px" }}>
            <div 
              ref={sliderRef}
              className="relative w-1/2 md:w-2/5 lg:w-1/3 h-0.5 bg-black/10 rounded-full cursor-pointer select-none group"
              onClick={handleSliderClick}
            >
              {/* Slider Thumb - Moves left/right based on scroll */}
              <div
                className="absolute top-1/2 h-0.5 w-8 rounded-full bg-black/30 transition-all duration-200 group-hover:w-10 group-hover:bg-black/40 cursor-grab active:cursor-grabbing"
                style={{
                  left: `calc(${Math.max(0, Math.min(100, sliderPercentage))}% - 16px)`,
                  transform: 'translateY(-50%)'
                }}
                onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleMouseDown(e)
                }}
                onTouchStart={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleTouchStart(e)
                }}
              />
            </div>
          </div>
        </div>
      </motion.div>
      )}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: smoothEase }}
        viewport={{ once: true, amount: 0.2 }}
        className="py-2 pb-12 md:py-20 px-4 md:px-12"
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
            className="font-din-arabic text-base md:text-lg text-black/70 leading-relaxed max-w-2xl mx-auto mb-2 md:mb-4 px-4 md:px-0"
          >
            Connect with one of our experts for personalized guidance and thoughtful product recommendations-crafted just for your skin, your rituals, your glow.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.8, delay: 0.5, ease: smoothEase }}
            viewport={{ once: true, amount: 0.3 }}
            className="bg-transparent border border-black/30 text-black hover:bg-black hover:text-white transition-all duration-300 px-6 py-3 md:px-8 font-normal tracking-wide rounded-none font-din-arabic text-sm md:text-base"
          >
            Speak With Us
          </motion.button>
        </div>
      </motion.div>

      {/* Soft Orris Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1, ease: smoothEase }}
        viewport={{ once: true, amount: 0.1 }}
        className="py-4 md:py-8"
      >
        <div className="flex flex-col md:flex-row px-0 md:px-0">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: smoothEase }}
            viewport={{ once: true, amount: 0.2 }}
            className="w-full md:w-[68%] h-[300px] md:h-[600px] overflow-hidden mb-6 md:mb-0 object-cover"
          >
            <motion.img
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.6, ease: smoothEase }}
              src="/Images/Blog.jpg"
              alt="Soft Orris"
              className="w-full h-full object-cover"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: smoothEase }}
            viewport={{ once: true, amount: 0.2 }}
            className="w-full md:w-[45%] relative md:-ml-44 z-10 md:mt-10 px-6 md:px-0"
          >
            <div className="">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: smoothEase }}
                viewport={{ once: true, amount: 0.3 }}
                className="text-2xl md:text-3xl lg:text-4xl font-normal opacity-[50%] mb-4 md:mb-6 tracking-tight leading-tight font-american-typewriter"
              >
                Soft Orris - The Scent of Stillness
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: smoothEase }}
                viewport={{ once: true, amount: 0.3 }}
                className="font-din-arabic text-base md:text-lg text-black/70 leading-relaxed mb-6 md:mb-4 pr-4 line-clamp-2 md:line-clamp-none"
              >
                Powdery, elegant, and quietly floral-Soft Orris wraps your space in a gentle hug. Perfect for slow mornings, self-care rituals, or unwinding at dusk. It's calm, bottled in wax.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5, ease: smoothEase }}
                viewport={{ once: true, amount: 0.3 }}
                className="text-center md:text-right md:mr-12"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.3, ease: smoothEase }}
                  className="bg-transparent border border-black/30 text-black hover:bg-black hover:text-white transition-all duration-300 px-6 py-3 md:px-8 font-normal tracking-wide rounded-none font-din-arabic text-sm md:text-base"
                >
                  Read More
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
                  JardinBotanica.
                </span>
              </motion.p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: smoothEase }}
              viewport={{ once: true, amount: 0.2 }}
              className="w-full md:w-[60%] relative mt-8 md:mt-0"
            >
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
                      transition={{ duration: 0.6, delay: index * 0.1, ease: smoothEase }}
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
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Newsletter Section */}
      <section
        className="py-20 relative overflow-hidden"
        style={{ backgroundColor: "#e3e3d8" }}
      >
        <motion.div
          className="absolute inset-0 opacity-15"
          style={{
            background:
              "linear-gradient(45deg, #e58a4d, #545d4a, #e58a4d, #545d4a, #e58a4d)",
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
            background:
              "linear-gradient(-45deg, #545d4a, #e58a4d, #545d4a, #e58a4d)",
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
              Be the first to discover new blends, exclusive rituals, and
              stories from our botanical laboratory.
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

