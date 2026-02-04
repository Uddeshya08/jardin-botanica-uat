"use client"

import { ImageWithFallback } from "app/components/figma/ImageWithFallback"
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "app/components/ui/carousel"
import { useCartItems } from "app/context/cart-items-context"
import { type LedgerItem, useLedger } from "app/context/ledger-context"
import { motion } from "framer-motion"
import { Heart } from "lucide-react"
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"
import { toast } from "sonner"

interface Product {
  id: string
  name: string
  slug: string
  size: string
  description: string
  price: number
  image: string
  hoverImage: string
  video?: string
  variantId?: string
  medusaId?: string
}

const products: Product[] = []

function ProductCard({
  product,
  onAddToCart,
  onToggleLedger,
  isAddedToCart,
  isInLedger,
  isMobile,
}: {
  product: Product
  onAddToCart: () => void
  onToggleLedger: () => void
  isAddedToCart: boolean
  isInLedger: boolean
  isMobile: boolean
}) {
  const router = useRouter()
  const [isImageHovered, setIsImageHovered] = useState(false)
  const [isButtonHovered, setIsButtonHovered] = useState(false)
  const videoRef = React.useRef<HTMLVideoElement>(null)

  const handleProductClick = () => {
    // Normalize slug to ensure it starts with /
    const normalizedSlug = product.slug.startsWith("/") ? product.slug : `/${product.slug}`
    router.push(normalizedSlug)
  }

  const handleMouseEnter = () => {
    setIsImageHovered(true)
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch((e) => {
        // Auto-play was prevented
        console.warn("Video autoplay prevented:", e)
      })
    }
  }

  const handleMouseLeave = () => {
    setIsImageHovered(false)
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  // Visibility-based auto-rotate effect for mobile
  const cardRef = React.useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!isMobile || !cardRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.5 }
    )

    observer.observe(cardRef.current)
    return () => observer.disconnect()
  }, [isMobile])

  useEffect(() => {
    if (!isMobile || !isVisible) {
      // Reset to main image when not visible
      setIsImageHovered(false)
      if (videoRef.current) {
        videoRef.current.pause()
        videoRef.current.currentTime = 0
      }
      return
    }

    // Start with main image when becoming visible
    setIsImageHovered(false)
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }

    const interval = setInterval(() => {
      setIsImageHovered((prev) => {
        const next = !prev
        if (videoRef.current) {
          if (next) {
            // Show hover media - play video
            videoRef.current.currentTime = 0
            videoRef.current.play().catch((e) => {
              console.warn("Video autoplay prevented:", e)
            })
          } else {
            // Show main image - pause and reset video
            videoRef.current.pause()
            videoRef.current.currentTime = 0
          }
        }
        return next
      })
    }, 2500)

    return () => clearInterval(interval)
  }, [isMobile, isVisible])

  return (
    <div
      ref={cardRef}
      className="group flex flex-col w-full mx-auto h-full"
      style={{
        minHeight: "480px",
        maxWidth: "480px",
        paddingLeft: "1.5rem",
      }}
    >
      {/* Product Image */}
      <div
        className="relative w-full overflow-hidden cursor-pointer aspect-[3/4] sm:aspect-[3/4]"
        style={{ marginBottom: "2.5rem" }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleProductClick}
      >
        {/* Hover Media - Video or Image - Behind */}
        <div className="absolute inset-0">
          {product.video ? (
            <video
              ref={videoRef}
              src={product.video}
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
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
          style={{ opacity: isImageHovered ? 0 : 1 }}
        >
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Ledger Icon */}
        <button
          className="absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 bg-white/20 border border-white/30 hover:bg-white/30"
          aria-label={`${isInLedger ? "Remove from" : "Add to"} ledger`}
          onClick={(e) => {
            e.stopPropagation()
            onToggleLedger()
          }}
        >
          <Heart
            size={18}
            className={`transition-colors duration-300 ${isInLedger ? "fill-[#e58a4d] stroke-[#e58a4d]" : "stroke-white fill-none"
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
              {product.name}
            </h3>
          </div>
        </div>
        {/* Price, Size and Add to Cart Button - Combined for better mobile spacing */}
        <div className="flex flex-col gap-2 md:gap-4 flex-grow justify-end">
          <div className="flex justify-between items-center">
            <p className="font-din-arabic text-black text-sm" style={{ letterSpacing: "0.1em" }}>
              ₹{product.price.toLocaleString()}
            </p>
            <p className="font-din-arabic text-black/60 text-sm" style={{ letterSpacing: "0.1em" }}>
              {product.size}
            </p>
          </div>
          {/* Add to Cart Button */}
          <button
            className={`group/btn-wrapper flex items-center justify-center font-din-arabic px-6 py-3 md:px-8 bg-transparent border border-black/30 transition-all duration-300 tracking-wide text-sm md:text-base relative ${isAddedToCart ? "cursor-default opacity-60" : "cursor-pointer hover:bg-black"
              }`}
            onClick={(e) => {
              e.stopPropagation()
              onAddToCart()
            }}
            disabled={isAddedToCart}
            aria-label={isAddedToCart ? "In cart" : "Add to cart"}
          >
            <div className="relative inline-flex items-center gap-2 pb-0.5 z-10 pointer-events-none">
              <span
                className={`font-din-arabic text-base transition-colors duration-300 ${isAddedToCart ? "text-black" : "text-black group-hover/btn-wrapper:text-white"
                  }`}
                style={{ letterSpacing: "0.12em" }}
              >
                {isAddedToCart ? "In cart" : "Add to cart"}
              </span>
              <span
                className={`text-xs transition-colors duration-300 ${isAddedToCart ? "text-black" : "text-black group-hover/btn-wrapper:text-white"
                  }`}
              >
                {isAddedToCart ? "" : "→"}
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export function ProductCarousel({
  products: sourceProducts,
  countryCode,
}: {
  products?: any[]
  countryCode?: string
}) {
  const router = useRouter()
  const { cartItems, handleCartUpdate } = useCartItems()
  const { toggleLedgerItem, isInLedger } = useLedger()
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [addedToCartMessage, setAddedToCartMessage] = useState<string | null>(null)
  const sliderRef = React.useRef<HTMLDivElement>(null)
  const [isPending, startTransition] = React.useTransition()

  // Transform Medusa products to carousel format
  const mergedProducts: Product[] = React.useMemo(() => {
    if (!sourceProducts?.length) return []

    return sourceProducts.map((p) => {
      const variant = p.variants?.[0]
      const calculatedPrice = variant?.calculated_price?.calculated_amount

      return {
        id: p.id,
        name: p.title || "",
        slug: `/${countryCode || "in"}/products/${p.handle}`,
        size: variant?.title || "Default",
        description: p.description || "",
        price: calculatedPrice || 0,
        image: p.thumbnail || "",
        hoverImage: p.images?.[1]?.url || p.thumbnail || "",
        variantId: variant?.id,
        medusaId: p.id,
      }
    })
  }, [sourceProducts, countryCode])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 750)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    if (!api) return

    setCurrent(api.selectedScrollSnap())
    setScrollProgress(api.scrollProgress())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })

    api.on("scroll", () => {
      setScrollProgress(api.scrollProgress())
    })

    // Ensure carousel starts at the beginning on mount (especially for mobile)
    const isMobileCheck = typeof window !== "undefined" && window.innerWidth < 750
    if (isMobileCheck) {
      // Multiple attempts to ensure proper scroll position on mobile
      const scrollToStart = () => {
        api.scrollTo(0, true)
        // Force scroll to start position
        const content = document.querySelector('[data-slot="carousel-content"]') as HTMLElement
        if (content) {
          content.scrollLeft = 0
        }
      }
      // Initial scroll
      setTimeout(scrollToStart, 100)
      // Additional scroll after layout settles
      setTimeout(scrollToStart, 300)
      // Final scroll after everything is rendered
      requestAnimationFrame(() => {
        setTimeout(scrollToStart, 100)
      })
    } else {
      setTimeout(() => {
        api.scrollTo(0, true)
      }, 100)
    }
  }, [api])

  // Auto-scroll effect for mobile view
  useEffect(() => {
    if (!api || !isMobile || hasInteracted) return

    // Don't auto-scroll while user is dragging
    if (isDragging) return

    const autoScrollInterval = setInterval(() => {
      const currentIndex = api.selectedScrollSnap()
      const totalSnaps = api.scrollSnapList().length
      const nextIndex = (currentIndex + 1) % totalSnaps
      api.scrollTo(nextIndex)
    }, 5000) // 5 second interval

    return () => clearInterval(autoScrollInterval)
  }, [api, isMobile, isDragging, hasInteracted])

  const scrollTo = (index: number) => {
    api?.scrollTo(index)
  }

  const handleAddToCart = (product: Product) => {
    // Optimistic Update
    // Use variantId for identification if available (real product), else id (fallback)
    const targetId = product.variantId || product.id

    const existingItem = cartItems.find((item) => item.id === targetId)
    const isExisting = !!existingItem

    const cartItem = {
      id: targetId,
      name: product.name,
      price: product.price,
      quantity: isExisting ? existingItem!.quantity + 1 : 1,
      image: product.image,
      size: product.size,
      variant_id: targetId, // important for cart cleanup/matching
    }

    handleCartUpdate(cartItem)

    // Show appropriate message
    const message = isExisting
      ? `Quantity increased — ${product.name}`
      : `Added to cart — ${product.name}`

    toast.success(message, { duration: 2000 })

    // Show temporary message on the button
    setAddedToCartMessage(product.id) // This matches the key/id used in render
    setTimeout(() => setAddedToCartMessage(null), 2000)

    // Server Action
    startTransition(async () => {
      try {
        // Import dynamically or if imported at top, use it.
        // importing here to avoid server-action-in-client issues depending on build setup,
        // but standard is importing at top if "use server" is in file.
        // Actually, server actions can be imported in client components.
        const { addToCartAction } = await import("@lib/data/cart-actions")
        const { emitCartUpdated } = await import("@lib/util/cart-client")

        if (product.variantId) {
          await addToCartAction({
            variantId: product.variantId,
            quantity: 1,
            countryCode: countryCode || "in",
          })
          emitCartUpdated({ quantityDelta: 1 })
        }
      } catch (error) {
        console.error("Failed to add to cart on server:", error)
        toast.error("Failed to save to cart. Please try again.")
        // Optionally rollback optimistic update here if needed
      }
    })
  }

  const handleToggleLedger = (product: Product) => {
    // Use medusaId (Product ID) for ledger if available, else static ID
    const targetId = product.medusaId || product.id
    const alreadyInLedger = isInLedger(targetId)

    const ledgerItem: LedgerItem = {
      id: targetId,
      name: product.name,
      // ...
      price: product.price,
      image: product.image,
      description: product.description,
      category: "From the Lab",
    }

    toggleLedgerItem(ledgerItem)
    toast.success(`${product.name} ${alreadyInLedger ? "removed from" : "added to"} Ledger`, {
      duration: 2000,
    })
  }

  // Calculate slider position based on current slide position
  const totalSlides = mergedProducts.length

  console.log(products, "products----")
  console.log(totalSlides, "totalSlides----")

  const normalizedIndex =
    totalSlides > 0 ? ((current % totalSlides) + totalSlides) % totalSlides : 0
  const sliderPercentage = totalSlides > 0 ? (normalizedIndex / (totalSlides - 1)) * 100 : 0

  const handleSliderClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) return
    e.stopPropagation()
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percentage = Math.min(Math.max(clickX / rect.width, 0), 1)

    if (api) {
      const scrollSnaps = api.scrollSnapList()
      if (scrollSnaps.length > 0) {
        const targetIndex = Math.round(percentage * (scrollSnaps.length - 1))
        api.scrollTo(targetIndex)
      }
    }
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)

    const handleMouseMove = (e: MouseEvent) => {
      if (!sliderRef.current || !api) return
      const rect = sliderRef.current.getBoundingClientRect()
      const clickX = e.clientX - rect.left
      const percentage = Math.min(Math.max(clickX / rect.width, 0), 1)

      const scrollSnaps = api.scrollSnapList()
      if (scrollSnaps.length > 0) {
        const targetIndex = Math.round(percentage * (scrollSnaps.length - 1))
        api.scrollTo(targetIndex)
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)

    const handleTouchMove = (e: TouchEvent) => {
      if (!sliderRef.current || !api) return
      const rect = sliderRef.current.getBoundingClientRect()
      const touch = e.touches[0]
      const clickX = touch.clientX - rect.left
      const percentage = Math.min(Math.max(clickX / rect.width, 0), 1)

      const scrollSnaps = api.scrollSnapList()
      if (scrollSnaps.length > 0) {
        const targetIndex = Math.round(percentage * (scrollSnaps.length - 1))
        api.scrollTo(targetIndex)
      }
    }

    const handleTouchEnd = () => {
      setIsDragging(false)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
    }

    document.addEventListener("touchmove", handleTouchMove)
    document.addEventListener("touchend", handleTouchEnd)
  }

  return (
    <section
      className="py-12 lg:py-16"
      style={{ backgroundColor: "#edede2" }}
      onMouseDownCapture={() => setHasInteracted(true)}
      onTouchStartCapture={() => setHasInteracted(true)}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
      >
        <h2 className="text-center font-american-typewriter text-2xl md:text-3xl lg:text-4xl tracking-tight mb-4 text-black leading-tight">
          From the Botanist’s Lab<span className="font-normal text-2xl align-super">™</span>
        </h2>
      </motion.div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .product-carousel-item {
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
          .product-carousel-item:first-child {
            margin-left: 0 !important;
          }
          [data-slot="carousel-content"] {
            cursor: grab !important;
            -webkit-overflow-scrolling: touch !important;
            scroll-behavior: smooth !important;
            scroll-snap-type: x mandatory !important;
          }
          [data-slot="carousel-content"]:active {
            cursor: grabbing !important;
          }
          .product-carousel-content {
            user-select: none !important;
            -webkit-user-select: none !important;
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }
          .product-carousel-content > div {
            margin-left: 0 !important;
            gap: 0 !important;
          }
          @media (max-width: 749px) {
            .product-carousel-item {
              width: calc(100vw - 3rem) !important;
              flex-basis: calc(100vw - 3rem) !important;
              padding-left: 0 !important;
              padding-right: 0 !important;
              margin-left: 1.5rem !important;
              margin-right: 1.5rem !important;
            }
            .product-carousel-content {
              padding-left: 0 !important;
              padding-right: 1.5rem !important;
            }
            [data-slot="carousel-content"] {
              scroll-padding-left: 0 !important;
            }
            .product-carousel-content > div {
              margin-left: 0 !important;
            }
            .product-carousel-item:first-child {
              margin-left: 1.5rem !important;
            }
          }
          .product-carousel-item:first-child {
            margin-left: 0 !important;
          }
          @media (min-width: 750px) {
            .product-carousel-item {
              width: calc((100vw - 100px) * 1 / 2.5) !important;
              flex-basis: calc((100vw - 100px) * 1 / 2.5) !important;
              margin-left: 1rem !important;
              margin-right: 1rem !important;
            }
            .product-carousel-content {
              padding-left: 2rem !important;
              padding-right: 0 !important;
            }
          }
          @media (min-width: 990px) {
            .product-carousel-item {
              width: calc((100vw - 124px) * 1 / 3) !important;
              flex-basis: calc((100vw - 124px) * 1 / 3) !important;
              margin-left: 1rem !important;
              margin-right: 1rem !important;
            }
            .product-carousel-content {
              padding-left: 2rem !important;
              padding-right: 0 !important;
            }
          }
          @media (min-width: 1200px) {
            .product-carousel-item {
              width: calc((100vw - 148px) * 1 / 4) !important;
              flex-basis: calc((100vw - 148px) * 1 / 4) !important;
              margin-left: 1rem !important;
              margin-right: 1rem !important;
            }
            .product-carousel-content {
              padding-left: 2rem !important;
              padding-right: 0 !important;
            }
          }
          @media (min-width: 1600px) {
            .product-carousel-item {
              width: calc((100vw - 180px) * 1 / 5) !important;
              flex-basis: calc((100vw - 180px) * 1 / 5) !important;
              margin-left: 1rem !important;
              margin-right: 1rem !important;
            }
            .product-carousel-content {
              padding-left: 2rem !important;
              padding-right: 0 !important;
            }
          }
        `,
        }}
      />
      <div className="pt-10 pb-0">
        <div className="m-w-[180rem] mx-auto px-4 sm:px-6 lg:px-12 xl:px-10 2xl:px-15">
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: true,
              dragFree: true,
              containScroll: "trimSnaps",
              watchDrag: true,
              duration: 40, // Slow down scroll speed (milliseconds)
              startIndex: 0,
            }}
            className="w-full"
          >
            <CarouselContent className="product-carousel-content">
              {mergedProducts.map((product) => (
                <CarouselItem key={product.id} className="product-carousel-item">
                  <ProductCard
                    product={product}
                    onAddToCart={() => handleAddToCart(product)}
                    onToggleLedger={() => handleToggleLedger(product)}
                    isAddedToCart={cartItems.some(
                      (item) =>
                        item.id === (product.variantId || product.id) ||
                        (product.variantId && item.variant_id === product.variantId)
                    )}
                    isInLedger={isInLedger(product.medusaId || product.id)}
                    isMobile={isMobile}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        {/* Slider Bar - Web and Mobile - Centered */}
        <div
          className="flex justify-center items-center w-full pt-3"
          style={{ paddingTop: "3rem" }}
        >
          <div
            ref={sliderRef}
            className="relative w-1/2 md:w-2/5 lg:w-1/3 h-0.5 bg-black/10 rounded-full cursor-pointer select-none group"
            onClick={handleSliderClick}
          >
            {/* Slider Thumb */}
            <div
              className="absolute top-1/2 h-0.5 w-8 rounded-full bg-black/30 transition-all duration-200 group-hover:w-10 group-hover:bg-black/40 cursor-grab active:cursor-grabbing"
              style={{
                left: `calc(${sliderPercentage}% - 16px)`,
                transform: "translateY(-50%)",
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
    </section>
  )
}
