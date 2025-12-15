// HERO COMPONENT with Motion Animations (Updated with PeopleAlsoBought effects)
"use client"
import { Github } from "@medusajs/icons"
import { Heading } from "@medusajs/ui"
import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { RippleEffect } from "app/components/RippleEffect"
import { Navigation } from "app/components/Navigation"
import { PageBanner } from "app/components/PageBanner"
import { getCandlesCollection } from "@lib/data/contentful"
import { CandlesCollectionItem } from "../../../../types/contentful"
import { useRouter } from "next/navigation"

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
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [productScrollPosition, setProductScrollPosition] = useState(0)
  const [maxProductScroll, setMaxProductScroll] = useState(0)
  const [garageSliderIndex, setGarageSliderIndex] = useState(2)
  const [centerCardIndex, setCenterCardIndex] = useState(2)
  const [candlesCollection, setCandlesCollection] = useState<CandlesCollectionItem[]>([])
  const [isLoadingCollection, setIsLoadingCollection] = useState(true)

  const handleCartUpdate = (item: CartItem | null) => {
    if (!item) return
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setIsScrolled(scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
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

  // Fetch candles collection from Contentful
  useEffect(() => {
    const fetchCandlesCollection = async () => {
      setIsLoadingCollection(true)
      try {
        const collection = await getCandlesCollection()
        setCandlesCollection(collection)
        // Set initial center index based on collection length (middle item, or second item if < 3)
        if (collection.length > 0) {
          const initialIndex = Math.min(2, Math.floor(collection.length / 2))
          setGarageSliderIndex(initialIndex)
          setCenterCardIndex(initialIndex)
        }
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

  // Garage slider items - use Contentful data
  const garageSliderItems = candlesCollection.map((item) => ({
    src: item.src,
    label: item.label,
    url: item.url,
    bgColor: "bg-amber-900/20", // Optional styling, can be removed or made dynamic
  }))

  // Track garage slider scroll position
  useEffect(() => {
    if (garageSliderItems.length === 0) return
    
    const garageSlider = document.getElementById('garage-slider')
    if (!garageSlider) return

    const updateGarageSliderIndex = () => {
      const scrollLeft = garageSlider.scrollLeft
      const viewportWidth = window.innerWidth
      const avgCardWidth = viewportWidth * 0.68
      const gap = 16 
      const paddingLeft = viewportWidth * 0.19
      const adjustedScroll = scrollLeft + paddingLeft
      const scrollPosition = adjustedScroll / (avgCardWidth + gap)
      const currentIndex = Math.round(scrollPosition)
      const newIndex = Math.min(Math.max(currentIndex, 0), garageSliderItems.length - 1)
      setGarageSliderIndex(newIndex)
      setCenterCardIndex(newIndex)
    }

    // Initial scroll to center card
    const centerInitialCard = () => {
      const viewportWidth = window.innerWidth
      const avgCardWidth = viewportWidth * 0.68
      const gap = 16
      const paddingLeft = viewportWidth * 0.19
      // Use the current centerCardIndex state
      const currentCenterIndex = Math.min(centerCardIndex, garageSliderItems.length - 1)
      const scrollPosition = (avgCardWidth + gap) * currentCenterIndex - paddingLeft
      garageSlider.scrollLeft = Math.max(0, scrollPosition)
    }

    // Wait for layout to settle
    setTimeout(() => {
      centerInitialCard()
      updateGarageSliderIndex()
    }, 100)

    updateGarageSliderIndex()
    garageSlider.addEventListener('scroll', updateGarageSliderIndex)
    
    const handleResize = () => {
      centerInitialCard()
      updateGarageSliderIndex()
    }
    window.addEventListener('resize', handleResize)
    
    return () => {
      garageSlider.removeEventListener('scroll', updateGarageSliderIndex)
      window.removeEventListener('resize', handleResize)
    }
  }, [garageSliderItems.length])

  // Function to scroll garage slider to specific index
  const goToGarageSlide = (index: number) => {
    const garageSlider = document.getElementById('garage-slider')
    if (!garageSlider) return

    const viewportWidth = window.innerWidth
    const avgCardWidth = viewportWidth * 0.68
    const gap = 16
    const paddingLeft = viewportWidth * 0.19
    // Calculate scroll position to center the selected card
    const scrollPosition = (avgCardWidth + gap) * index - paddingLeft
    
    garageSlider.scrollTo({ 
      left: Math.max(0, scrollPosition), 
      behavior: 'smooth' 
    })
  }


  return (
    <div className="bg-[#e2e2d8]">
      <RippleEffect />
      <Navigation
        isScrolled={isScrolled}
        cartItems={cartItems}
        onCartUpdate={handleCartUpdate}
        forceWhiteText={true}
      />
      
      <PageBanner pageKey="candles" />

      {/* Garage-style Slider Section - Mobile Only */}
      {!isLoadingCollection && garageSliderItems.length > 0 && (
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="md:hidden relative w-full py-12 overflow-hidden bg-[#e2e2d8]"
      >
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[120px] md:text-[200px] lg:text-[280px] font-light text-gray-300/30 select-none pointer-events-none z-0 tracking-tight"
          style={{ 
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontWeight: 300,
            letterSpacing: '-0.02em'
          }}
        >
          Botanica
        </motion.h2>

        <div className="relative z-10">
          <div 
            id="garage-slider"
            className="overflow-x-auto overflow-y-hidden scrollbar-hide scroll-smooth snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div 
              className="flex gap-4 items-center h-full" 
              style={{ 
                width: 'max-content',
                paddingLeft: '19vw',
                paddingRight: '19vw'
              }}
            >
              {garageSliderItems.map((item, index) => {
                const isCenter = index === centerCardIndex
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: 1,
                      scale: isCenter ? 1 : 0.85
                    }}
                    transition={{ duration: 0.4 }}
                    className="relative flex-shrink-0 snap-center"
                    style={{ 
                      width: isCenter ? '75vw' : '62vw',
                      minWidth: isCenter ? '75vw' : '62vw'
                    }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                      onClick={() => handleItemClick(item.url)}
                      className={`relative aspect-[4/3] rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-lg cursor-pointer ${
                        isCenter ? 'mx-2' : 'mx-1'
                      } ${item.url ? 'hover:shadow-xl transition-shadow duration-300' : ''}`}
                    >
                      <motion.img
                        src={item.src}
                        alt={item.label}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                    {/* Product Name below image */}
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                      className="text-black text-lg font-bold tracking-wide font-din-arabic text-center mt-3"
                    >
                      {item.label && item.label.trim() ? item.label : "Product Name"}
                    </motion.p>
                  </motion.div>
                )
              })}
            </div>
          </div>
{/* 
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12 md:mt-16 px-4"
          >
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-1 font-din-arabic tracking-tight"
            >
              your product collection
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="text-xl md:text-2xl font-bold text-black mb-1 font-din-arabic tracking-tight"
            >
              is ready
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              viewport={{ once: true }}
              className="text-sm md:text-base text-black/60 font-din-arabic font-normal"
            >
              explore our botanical collection now
            </motion.p>
          </motion.div> */}

          <div className="flex justify-center items-center gap-2 mt-8">
            {garageSliderItems.map((_, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                viewport={{ once: true }}
                onClick={() => goToGarageSlide(index)}
                className={`rounded-full transition-all duration-300 cursor-pointer ${
                  index === garageSliderIndex 
                    ? 'bg-gray-800 w-3 h-2' 
                    : 'bg-gray-300 hover:bg-gray-400 w-2 h-2'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </motion.div>
      )}

      {/* mid section - product grid with PAB hover effects - Desktop Only */}
      {!isLoadingCollection && products.length > 0 && (
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="hidden md:block w-full md:pt-12 lg:pt-16"
      >
         <div className="pl-[4rem] pb-8">
         <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl lg:text-4xl font-normal opacity-[50%] mb-2 md:mb-4 tracking-tight font-american-typewriter"
          >
            A story in every scent.
          </motion.h2>
          {/* <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="font-din-arabic text-base md:text-lg text-black/70 leading-relaxed max-w-2xl  mb-2 md:mb-4 px-4 md:px-0"
          >
            Choose yours
          </motion.p> */}
         </div>
        {/* Desktop view - original layout */}
        <div className="flex flex-row w-full gap-4 px-10 lg:px-16">
          {products.map(({ src, label, hoverSrc, url }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="relative w-1/4 group cursor-pointer"
              onMouseEnter={() => setHoveredProductIndex(i)}
              onMouseLeave={() => setHoveredProductIndex(null)}
              onClick={() => handleItemClick(url)}
            >
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="aspect-square overflow-hidden rounded-lg shadow-lg relative"
              >
                {/* Base Image */}
                <img
                  src={src}
                  alt={label}
                  className="w-full h-full object-cover"
                />
                {/* Black Overlay - Only on hover with gradient from top to bottom */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredProductIndex === i ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 rounded-lg"
                  style={{
                    background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.45) 100%)'
                  }}
                />
                
                {/* Text - Always visible with opacity change on hover */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <motion.p
                    className="text-white text-2xl tracking-wide font-din-arabic drop-shadow-lg"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: hoveredProductIndex === i ? 1 : 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {label && label.trim() ? label : "Product Name"}
                  </motion.p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>
      )}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-12 md:py-20 px-4 md:px-12"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl lg:text-4xl font-normal opacity-[50%] mb-2 md:mb-4 tracking-tight font-american-typewriter"
          >
            Need a Hand Choosing?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="font-din-arabic text-base md:text-lg text-black/70 leading-relaxed max-w-2xl mx-auto mb-2 md:mb-4 px-4 md:px-0"
          >
            Connect with one of our experts for personalized guidance and thoughtful product recommendations-crafted just for your skin, your rituals, your glow.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 0 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
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
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-4 md:py-8"
      >
        <div className="flex flex-col md:flex-row px-0 md:px-0">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full md:w-[68%] h-[300px] md:h-[600px] overflow-hidden mb-6 md:mb-0 object-cover"
          >
            <motion.img
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.6 }}
              src="/Images/Blog.jpg"
              alt="Soft Orris"
              className="w-full h-full object-cover"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="w-full md:w-[45%] relative md:-ml-44 z-10 md:mt-10 px-6 md:px-0"
          >
            <div className="">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="text-2xl md:text-3xl lg:text-4xl font-normal opacity-[50%] mb-4 md:mb-6 tracking-tight leading-tight font-american-typewriter"
              >
                Soft Orris - The Scent of Stillness
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="font-din-arabic text-base md:text-lg text-black/70 leading-relaxed mb-6 md:mb-4 pr-4 line-clamp-2 md:line-clamp-none"
              >
                Powdery, elegant, and quietly floral-Soft Orris wraps your space in a gentle hug. Perfect for slow mornings, self-care rituals, or unwinding at dusk. It's calm, bottled in wax.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
                className="text-center md:text-right md:mr-12"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
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
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-12 md:py-10 px-4 md:px-12"
      >
        <div className="pb-4">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="w-full relative md:w-1/2 md:pr-12 mt-[4%] pl-4 md:pl-0"
            >
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="text-2xl md:text-3xl lg:text-4xl font-normal opacity-[50%] mb-4 tracking-tight font-american-typewriter"
              >
                Let's Stay in Touch
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="font-din-arabic text-base md:text-lg text-black/70 leading-relaxed"
              >
                Follow us on Instagram and Facebook for moments of calm,
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
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
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full md:w-[60%] relative mt-8 md:mt-0"
            >
              <div className="flex gap-2 md:gap-4 overflow-hidden relative px-2 md:px-12">
                {/* Left Navigation Button */}
                <div className="absolute left-0 md:left-4 top-1/2 -translate-y-1/2 mt-8 z-20">
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
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="w-full h-auto aspect-square overflow-hidden rounded-lg relative"
                    >
                      <motion.img
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
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
                <div className="absolute right-0 md:right-4 top-1/2 -translate-y-1/2 mt-8 z-20">
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
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="font-american-typewriter text-2xl md:text-3xl lg:text-4xl tracking-tight mb-6 text-black"
            >
              Join the Circle
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="font-din-arabic text-base md:text-lg text-black/70 leading-relaxed mb-8"
            >
              Be the first to discover new blends, exclusive rituals, and
              stories from our botanical laboratory.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            >
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="email"
                placeholder="Enter your email"
                className="font-din-arabic flex-1 px-4 py-3 bg-transparent border border-black/30 text-black placeholder-black/60 focus:outline-none focus:border-black transition-all duration-300"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
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

