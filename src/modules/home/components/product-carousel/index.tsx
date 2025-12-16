"use client"

import React, { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { ImageWithFallback } from "app/components/figma/ImageWithFallback"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "app/components/ui/carousel"
import { motion } from "framer-motion"

interface Product {
  id: string
  name: string
  size: string
  description: string
  price: number
  image: string
  hoverImage: string
}

const products: Product[] = [
  {
    id: "1",
    name: "Saffron Jasmine Amberwood",
    size: "250g",
    description: "Hand-poured soy candle with saffron, jasmine and amberwood",
    price: 3200,
    image:
      "https://images.unsplash.com/photo-1696391267294-103e9c210c6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwY3JlYXRpb25zJTIwaW50ZXJpb3IlMjBib3RhbmljYWx8ZW58MXx8fHwxNzYyMDA5NDI3fDA&ixlib=rb-4.1.0&q=80&w=1920&utm_source=figma&utm_medium=referral",
    hoverImage:
      "https://images.unsplash.com/photo-1576260735040-0161203bab23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2VudGVkJTIwY2FuZGxlJTIwdmludGFnZXxlbnwxfHx8fDE3NjIwMDk0Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: "2",
    name: "Oud Waters",
    size: "250g",
    description: "Hand-poured soy candle with rare oud and aquatic notes",
    price: 3400,
    image:
      "https://images.unsplash.com/photo-1580584126903-c17d41830450?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdWQlMjBjYW5kbGV8ZW58MXx8fHwxNzYyMDIzNDY5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    hoverImage:
      "https://images.unsplash.com/photo-1621494042364-e0e6ba89c21d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwYm90YW5pY2FsJTIwY2FuZGxlfGVufDF8fHx8MTc2MjAwOTQyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: "3",
    name: "Cedarwood Rose",
    size: "300g",
    description: "Hand-poured soy candle with cedarwood and damask rose",
    price: 3400,
    image:
      "https://images.unsplash.com/photo-1621494042364-e0e6ba89c21d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwYm90YW5pY2FsJTIwY2FuZGxlfGVufDF8fHx8MTc2MjAwOTQyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    hoverImage:
      "https://images.unsplash.com/photo-1696391267294-103e9c210c6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwY3JlYXRpb25zJTIwaW50ZXJpb3IlMjBib3RhbmljYWx8ZW58MXx8fHwxNzYyMDA5NDI3fDA&ixlib=rb-4.1.0&q=80&w=1920&utm_source=figma&utm_medium=referral",
  },
  {
    id: "4",
    name: "Saffron Jasmine Amberwood",
    size: "250g",
    description: "Hand-poured soy candle with saffron, jasmine and amberwood",
    price: 3200,
    image:
    "https://images.unsplash.com/photo-1601601319316-bace8ae2b548?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3RhbmljYWwlMjBwcm9kdWN0cyUyMGxhYm9yYXRvcnklMjBncmVlbnxlbnwxfHx8fDE3NTY4OTUxMjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
       ,hoverImage:
      "https://images.unsplash.com/photo-1576260735040-0161203bab23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2VudGVkJTIwY2FuZGxlJTIwdmludGFnZXxlbnwxfHx8fDE3NjIwMDk0Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: "5",
    name: "Oud Waters",
    size: "250g",
    description: "Hand-poured soy candle with rare oud and aquatic notes",
    price: 3400,
    image:
      "https://images.unsplash.com/photo-1522033048162-a492b7a1bead?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXZlbmRlciUyMGZpZWxkJTIwYm90YW5pY2FsfGVufDF8fHx8MTc2MTk5MTU3OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    hoverImage:
      "https://images.unsplash.com/photo-1621494042364-e0e6ba89c21d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwYm90YW5pY2FsJTIwY2FuZGxlfGVufDF8fHx8MTc2MjAwOTQyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: "6",
    name: "Cedarwood Rose",
    size: "300g",
    description: "Hand-poured soy candle with cedarwood and damask rose",
    price: 3400,
    image:
      "https://images.unsplash.com/photo-1584283626804-30ba59e636fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb3NlJTIwc2tpbmNhcmUlMjBib3RhbmljYWx8ZW58MXx8fHwxNzYxOTkwNjgzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    hoverImage:
      "https://images.unsplash.com/photo-1621494042364-e0e6ba89c21d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwYm90YW5pY2FsJTIwY2FuZGxlfGVufDF8fHx8MTc2MjAwOTQyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
]

function ProductCard({ product }: { product: Product }) {
  const [isImageHovered, setIsImageHovered] = useState(false)
  const [isButtonHovered, setIsButtonHovered] = useState(false)
  const [isInLedger, setIsInLedger] = useState(false)

  return (
    <div
      className="group flex flex-col w-full mx-auto h-full"
      style={{ minHeight: "500px", maxWidth: "480px" }}
    >
      {/* Product Image */}
      <div
        className="relative w-full overflow-hidden cursor-pointer aspect-[3/5] md:aspect-[3/4]"
        style={{ marginBottom: "1.5rem" }}
        onMouseEnter={() => setIsImageHovered(true)}
        onMouseLeave={() => setIsImageHovered(false)}
      >
        {/* Hover Image - Behind */}
        <div className="absolute inset-0">
          <ImageWithFallback
            src={product.hoverImage}
            alt={`${product.name} alternate view`}
            className="w-full h-full object-cover"
          />
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
          aria-label="Add to ledger"
          onClick={() => setIsInLedger(!isInLedger)}
        >
          <Heart
            size={18}
            className={`transition-colors duration-300 ${
              isInLedger ? "fill-[#e58a4d] stroke-[#e58a4d]" : "stroke-white fill-none"
            }`}
          />
        </button>
      </div>

      {/* Product Info */}
      <div className="flex flex-col flex-grow min-h-0 md:justify-between">
        <div>
          <div className="flex justify-start items-center py-1 md:py-2">
            <h3
              className="font-american-typewriter text-xl mb-0.5 md:mb-1"
              style={{ letterSpacing: "0.05em" }}
            >
              {product.name}
            </h3>
          </div>

        
        </div>
        {/* Price, Size and Add to Cart Button - Combined for better mobile spacing */}
        <div className="flex flex-col gap-2 md:gap-4 flex-grow justify-end">
          <div className="flex justify-between items-center">
            <p
              className="font-din-arabic text-black text-sm"
              style={{ letterSpacing: "0.1em" }}
            >
              ₹{product.price.toLocaleString()}
            </p>
            <p
              className="font-din-arabic text-black/60 text-sm"
              style={{ letterSpacing: "0.1em" }}
            >
              {product.size}
            </p>
          </div>
          {/* Add to Cart Button */}
          <div className="group/btn-wrapper flex items-center justify-center font-din-arabic px-6 py-3 md:px-8 bg-transparent border border-black/30 hover:bg-black transition-all duration-300 tracking-wide text-sm md:text-base">
            <button
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
              className="relative inline-flex items-center gap-2 pb-0.5"
            >
              <span
                className="font-din-arabic text-black group-hover/btn-wrapper:text-white text-base transition-colors duration-300"
                style={{ letterSpacing: "0.12em" }}
              >
                Add to cart
              </span>
              <span className="text-black group-hover/btn-wrapper:text-white text-xs transition-colors duration-300">→</span>
              <span
                className="absolute bottom-0 left-0 h-[1px] bg-black group-hover/btn-wrapper:bg-white transition-all duration-300"
                style={{ width: isButtonHovered ? "100%" : "0%" }}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ProductCarousel() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const sliderRef = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 750)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
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
  }, [api])

  const scrollTo = (index: number) => {
    api?.scrollTo(index)
  }

  // Calculate slider position based on current slide position
  const totalSlides = products.length
  const normalizedIndex = totalSlides > 0 ? ((current % totalSlides) + totalSlides) % totalSlides : 0
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
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }

    document.addEventListener('touchmove', handleTouchMove)
    document.addEventListener('touchend', handleTouchEnd)
  }

  return (
    <>
     <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h2 className="pt-16 text-center font-american-typewriter text-3xl lg:text-4xl tracking-tight text-black leading-tight">
                From the lab
              </h2>
            </motion.div>
      <style dangerouslySetInnerHTML={{
        __html: `
          .product-carousel-item {
            width: calc((100vw - 64px) * 0.80) !important;
            flex-basis: calc((100vw - 64px) * 0.80) !important;
            flex-grow: 0 !important;
            flex-shrink: 0 !important;
            box-sizing: border-box !important;
          }
          [data-slot="carousel-content"] {
            cursor: grab !important;
          }
          [data-slot="carousel-content"]:active {
            cursor: grabbing !important;
          }
          .product-carousel-content {
            user-select: none !important;
            -webkit-user-select: none !important;
            padding-left: calc((100vw - 64px) * 0.10) !important;
            padding-right: calc((100vw - 64px) * 0.10) !important;
          }
          @media (min-width: 750px) {
            .product-carousel-item {
              width: calc((100vw - 100px) * 1 / 2.5) !important;
              flex-basis: calc((100vw - 100px) * 1 / 2.5) !important;
            }
            .product-carousel-content {
              padding-left: 0 !important;
              padding-right: 0 !important;
            }
          }
          @media (min-width: 990px) {
            .product-carousel-item {
              width: calc((100vw - 124px) * 1 / 3) !important;
              flex-basis: calc((100vw - 124px) * 1 / 3) !important;
            }
          }
          @media (min-width: 1200px) {
            .product-carousel-item {
              width: calc((min(1440px, 100vw) - 148px) * 1 / 4) !important;
              flex-basis: calc((min(1440px, 100vw) - 148px) * 1 / 4) !important;
            }
          }
        `
      }} />
      <div className="py-16 sm:py-16 lg:py-16">
        <div className="m-w-[180rem] mx-auto px-4 sm:px-6 lg:px-12 xl:px-10 2xl:px-15">
          <Carousel
            setApi={setApi}
            opts={{
              align: isMobile ? "center" : "start",
              loop: true,
              dragFree: false,
              containScroll: "trimSnaps",
            }}
            className="w-full"
          >
            <CarouselContent className="product-carousel-content">
              {products.map((product) => (
                <CarouselItem
                  key={product.id}
                  className="pl-2 pr-2 md:pl-5 md:pr-4 product-carousel-item"
                >
                  <ProductCard product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
        
        {/* Slider Bar - Web and Mobile - Centered */}
        <div className="flex justify-center items-center w-full pt-3" style={{ paddingTop: "1.5rem", paddingBottom: "20px" }}>
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
    </>
  )
}

