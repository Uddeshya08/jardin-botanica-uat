'use client'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type ProductLike = { metadata?: Record<string, any> }

type Card = {
  id?: string | number
  name: string
  price?: number           // can be rupees or paise (auto-detected)
  currency?: string        // e.g., "INR"
  image?: string
  hoverImage?: string
  description?: string
  badge?: string
  url?: string
}

type MetaShape = {
  heading?: string
  subheading?: string
  bg?: string
  products?: Card[]
}

function stripJsonComments(str: string) {
  return str
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1')
}
function parseMaybe(v: any) {
  if (typeof v !== 'string') return v
  try { return JSON.parse(stripJsonComments(v.trim())) } catch { return v }
}
function parseTwice(v: any) {
  const once = parseMaybe(v)
  return typeof once === 'string' ? parseMaybe(once) : once
}

// Auto-detect units:
// - if currency provided => assume MINOR units and format via Intl
// - else if price >= 1000 and divisible by 100 => treat as paise -> ₹(price/100)
// - else treat as rupees
function formatPrice(price?: number, currency?: string) {
  if (typeof price !== 'number') return ''
  if (currency) {
    // assume minor units when currency is present
    const value = price / 100
    try {
      return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(value)
    } catch {
      return `$${Math.round(value)}`
    }
  }
  if (price >= 1000 && price % 100 === 0) return `$${Math.round(price / 100)}`
  return `$${Math.round(price)}`
}

const products = [
  {
    id: 1,
    name: "Body Floral",
    price: 1800,
    image: '/assets/handLotion.png',
    hoverImage: "https://images.unsplash.com/photo-1729603370129-4816f7021a8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBoYW5kJTIwY3JlYW0lMjBib3RhbmljYWx8ZW58MXx8fHwxNzU3NjE0NDk2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Delicate blooms, lingering scents",
    badge: "BEST SELLER"
  },
  {
    id: 2,
    name: "Warm Roots",
    price: 2200,
    image: '/assets/crushedPineCandle.png',
    hoverImage: "https://images.unsplash.com/photo-1611643380829-8f9b66da7e6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3RhbmljYWwlMjBjYW5kbGUlMjBuYXR1cmFsfGVufDF8fHx8MTc1NzYxNDQ5OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Grounded in earth, rooted warmth",
    badge: "NEW"
  },
  {
    id: 3,
    name: "Aqua Vitei",
    price: 1900,
    image: '/assets/scentedCandle.png',
    hoverImage: "https://images.unsplash.com/photo-1596642748852-5596416147ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwc2tpbmNhcmUlMjBib3R0bGV8ZW58MXx8fHwxNzU3NjE0NTAzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Fresh as the tide, crisp notes",
    badge: "POPULAR"
  },
  {
    id: 4,
    name: "Rose Garden",
    price: 2100,
    image: '/assets/handLotion.png',
    hoverImage: "https://images.unsplash.com/photo-1624372635277-283042097f31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmFsJTIwc29hcCUyMGJvdGFuaWNhbHxlbnwxfHx8fDE3NTc2MTQ1MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Petals and morning dew",
    badge: "LIMITED"
  }
];

export function PeopleAlsoBought({ product }: { product?: ProductLike }) {
  const [hoveredId, setHoveredId] = useState<string | number | null>(null)
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const [addedToCart, setAddedToCart] = useState<string | number | null>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [isDragging, setIsDragging] = useState(false)

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const scrollBarRef = useRef<HTMLDivElement>(null)

  // ------- READ METADATA (key: peopleAlsoBought) -------
  const meta: Required<MetaShape> = useMemo(() => {
    const defaults: Required<MetaShape> = {
      heading: 'From the Lab',
      subheading: 'Formulations most often paired in practice.',
      bg: '#e3e3d8',
      products: [],
    }
    const raw = product?.metadata?.peopleAlsoBought
    // console.log("raw = ", raw)
    if (!raw) return defaults
    const parsed: any = parseTwice(raw)
    if (!parsed || typeof parsed !== 'object') return defaults

    const products: Card[] = Array.isArray(parsed.products)
      ? parsed.products.map((p: any, i: number): Card => ({
          id: p?.id ?? i + 1,
          name: String(p?.name ?? ''),
          price: typeof p?.price === 'number' ? p.price : undefined,
          currency: typeof p?.currency === 'string' ? p.currency : undefined,
          image: typeof p?.image === 'string' ? p.image : undefined,
          hoverImage: typeof p?.hoverImage === 'string' ? p.hoverImage : undefined,
          description: typeof p?.description === 'string' ? p.description : undefined,
          badge: typeof p?.badge === 'string' ? p.badge : undefined,
          url: typeof p?.url === 'string' ? p.url : undefined,
        }))
      : defaults.products

    return {
      heading: typeof parsed.heading === 'string' ? parsed.heading : defaults.heading,
      subheading: typeof parsed.subheading === 'string' ? parsed.subheading : defaults.subheading,
      bg: typeof parsed.bg === 'string' ? parsed.bg : defaults.bg,
      products,
    }
  }, [product])

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
  const scroll = (dir: 'left' | 'right') => {
    const sc = scrollContainerRef.current
    if (!sc) return
    // Use full viewport width on mobile to scroll exactly one product, fixed width on desktop
    const isMobile = window.innerWidth < 768
    const scrollAmount = isMobile ? window.innerWidth : 300
    const target = dir === 'left' ? Math.max(0, sc.scrollLeft - scrollAmount) : sc.scrollLeft + scrollAmount
    sc.scrollTo({ left: target, behavior: 'smooth' })
  }
  const handleScrollBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollBarRef.current || !scrollContainerRef.current) return
    const rect = scrollBarRef.current.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    const { scrollWidth, clientWidth } = scrollContainerRef.current
    scrollContainerRef.current.scrollTo({ left: ratio * (scrollWidth - clientWidth), behavior: 'smooth' })
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
    sc.addEventListener('scroll', updateScrollProgress)
    updateScrollProgress()
    return () => sc.removeEventListener('scroll', updateScrollProgress)
  }, [])
  useEffect(() => {
    const up = () => setIsDragging(false)
    const move = (e: MouseEvent) => handleScrollBarDrag(e as any)
    if (isDragging) {
      document.addEventListener('mouseup', up)
      document.addEventListener('mousemove', move)
    }
    return () => {
      document.removeEventListener('mouseup', up)
      document.removeEventListener('mousemove', move)
    }
  }, [isDragging])

  const handleAddToCart = (id: string | number) => {
    setAddedToCart(id)
    setTimeout(() => setAddedToCart(null), 2000)
  }

  return (
    <section className="pt-8 lg:pt-12 relative" style={{ backgroundColor: bg }}>
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
          scrollSnapType: 'x mandatory', 
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* Left intro column - Hidden on Mobile, Visible on Desktop */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="hidden lg:flex flex-shrink-0 w-2/5 flex-col px-8 lg:px-16"
          style={{ scrollSnapAlign: 'start', paddingTop: '60px' }}
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
       
       {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              viewport={{ once: true }}
              className="flex-shrink-0 group cursor-pointer relative w-screen px-6 md:w-[280px] md:px-0 md:mr-8"
              style={{ 
                scrollSnapAlign: 'center',
              }}
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <div className="max-w-[340px] mx-auto md:max-w-none md:w-full">
                  {/* Product Image */}
                  <div className="relative mb-4 md:mb-6 overflow-hidden bg-white/20 rounded-sm">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="relative h-[280px] md:h-[320px]"
                    >
                      {/* Base Image */}
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-opacity duration-300"
                        style={{
                          opacity: hoveredProduct === product.id ? 0 : 1
                        }}
                      />
                      
                      {/* Hover Image */}
                      <img
                        src={product.hoverImage}
                        alt={`${product.name} alternative view`}
                        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                        style={{
                          opacity: hoveredProduct === product.id ? 1 : 0
                        }}
                      />

                      {/* Badge */}
                      {product.badge && (
                        <div className="absolute top-3 md:top-4 left-3 md:left-4">
                          <span 
                            className="px-2 md:px-3 py-1 text-xs font-din-arabic tracking-wide font-medium"
                            style={{
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              color: '#000',
                              borderRadius: '12px'
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
                        style={{ lineHeight: '1.3', letterSpacing: '0.05em' }}
                      >
                        {product.name}
                      </h3>
                      
                      <span 
                        className="font-din-arabic text-black flex-shrink-0 group-hover:text-black/80 transition-colors duration-200 text-sm md:text-base"
                        style={{ lineHeight: '1.3', letterSpacing: '0.1em' }}
                      >
                        ${(product.price / 100).toFixed(0)}
                      </span>
                    </div>

                    {/* Product Description */}
                    <p 
                      className="font-din-arabic text-black/70 group-hover:text-black/60 transition-colors duration-200 text-xs md:text-sm"
                      style={{ lineHeight: '1.4', letterSpacing: '0.1em' }}
                    >
                      {product.description}
                    </p>

                    {/* Quick Add Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product.id);
                      }}
                      className="w-full mt-3 md:mt-4 px-3 md:px-4 py-2 bg-transparent border border-black/20 text-black hover:bg-black hover:text-white transition-all duration-300 font-din-arabic text-xs md:text-sm tracking-wide opacity-0 md:group-hover:opacity-100 text-center"
                    >
                      {addedToCart === product.id ? '✓ Added' : 'Quick Add'}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
      </div>

      {/* Arrows - Always Visible on Mobile, Conditional on Desktop */}
      <div className="absolute left-2 md:hidden z-20" style={{ top: 'calc(50% + 40px)', transform: 'translateY(-50%)' }}>
        <motion.button 
          whileHover={{ scale: 1.05, x: -2 }} 
          whileTap={{ scale: 0.95 }} 
          onClick={() => scroll('left')}
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
      
      <div className="absolute right-2 md:hidden z-20" style={{ top: 'calc(50% + 40px)', transform: 'translateY(-50%)' }}>
        <motion.button 
          whileHover={{ scale: 1.05, x: 2 }} 
          whileTap={{ scale: 0.95 }} 
          onClick={() => scroll('right')}
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
        <div className="hidden md:block absolute left-4 lg:left-6 z-20" style={{ top: 'calc(50% - 40px)', transform: 'translateY(-50%)' }}>
          <motion.button whileHover={{ scale: 1.05, x: -2 }} whileTap={{ scale: 0.95 }} onClick={() => scroll('left')}
            className="group relative w-12 h-12 lg:w-14 lg:h-14 rounded-full backdrop-blur-md transition-all duration-500 bg-black/5 hover:bg-black/10 border border-black/10 hover:border-black/20 shadow-2xl hover:shadow-3xl overflow-hidden" aria-label="Scroll left">
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 flex items-center justify-center">
              <ChevronLeft className="w-6 h-6 text-black/70 group-hover:text-black transition-all duration-300" />
            </div>
            <div className="absolute inset-0 rounded-full ring-1 ring-black/5 group-hover:ring-black/15 transition-all duration-300" />
          </motion.button>
        </div>
      )}
      {canScrollRight && (
        <div className="hidden md:block absolute right-4 lg:right-6 z-20" style={{ top: 'calc(50% - 40px)', transform: 'translateY(-50%)' }}>
          <motion.button whileHover={{ scale: 1.05, x: 2 }} whileTap={{ scale: 0.95 }} onClick={() => scroll('right')}
            className="group relative w-12 h-12 lg:w-14 lg:h-14 rounded-full backdrop-blur-md transition-all duration-500 bg-black/5 hover:bg-black/10 border border-black/10 hover:border-black/20 shadow-2xl hover:shadow-3xl overflow-hidden" aria-label="Scroll right">
            <div className="absolute inset-0 bg-gradient-to-l from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 flex items-center justify-center">
              <ChevronRight className="w-6 h-6 text-black/70 group-hover:text-black transition-all duration-300" />
            </div>
            <div className="absolute inset-0 rounded-full ring-1 ring-black/5 group-hover:ring-black/15 transition-all duration-300" />
          </motion.button>
        </div>
      )}

      {/* Scroll bar */}
      <div className="px-4 md:px-6 lg:px-12 relative" style={{ paddingTop: '24px', paddingBottom: "20px" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} viewport={{ once: true }} className="w-full space-y-3">
          <div ref={scrollBarRef} className="relative w-1/2 md:w-2/5 lg:w-1/3 h-0.5 bg-black/10 rounded-full overflow-hidden cursor-pointer group select-none mx-auto"
               onClick={handleScrollBarClick} onMouseMove={handleScrollBarDrag} onMouseDown={(e) => e.preventDefault()}>
            <motion.div className="h-full rounded-full cursor-grab active:cursor-grabbing transition-all duration-200 group-hover:h-1 select-none absolute"
                        style={{ background: '#a28b6f', width: '20%', left: `${scrollProgress * 0.8}%` }}
                        onMouseDown={(e) => { e.preventDefault(); setIsDragging(true) }}
                        transition={{ duration: 0.1, ease: 'easeOut' }} />
          </div>
        </motion.div>
      </div>
    </section>
  )
}