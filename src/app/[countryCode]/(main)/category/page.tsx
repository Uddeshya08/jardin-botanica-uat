// HERO COMPONENT with Motion Animations (Updated with PeopleAlsoBought effects)
"use client"
import { Github } from "@medusajs/icons"
import { Heading } from "@medusajs/ui"
import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { RippleEffect } from "app/components/RippleEffect"
import { Navigation } from "app/components/Navigation"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

const Category = () => {
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
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "soft-orris-hand-veil",
      name: "Soft Orris Hand Veil",
      price: 1800,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop",
    },
  ])

  const handleCartUpdate = (item: CartItem | null) => {
    if (item && item.quantity > 0) {
      setCartItems((prevItems) => {
        const existingIndex = prevItems.findIndex((cartItem) => cartItem.id === item.id)
        if (existingIndex >= 0) {
          const updatedItems = [...prevItems]
          updatedItems[existingIndex] = item
          return updatedItems
        } else {
          return [...prevItems, item]
        }
      })
    } else if (item && item.quantity === 0) {
      setCartItems((prevItems) => prevItems.filter((cartItem) => cartItem.id !== item.id))
    }
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

  const products = [
    { src: "/Images/SoftFloral.jpg", label: "FLORAL SPICE", hoverSrc: "/Images/SoftFloral.jpg" },
    { src: "/Images/Crushedpine.jpg", label: "CEDAR BLOOM", hoverSrc: "/Images/Crushedpine.jpg" },
    { src: "/Images/warmroots.jpg", label: "FOREST FLOOR", hoverSrc: "/Images/warmroots.jpg" },
    { src: "/Images/AquaVeil1.jpg", label: "WATER & WOOD", hoverSrc: "/Images/AquaVeil1.jpg" },
  ]

  return (
    <div className="bg-[#e2e2d8]">
      <RippleEffect />
      <Navigation
        isScrolled={isScrolled}
        cartItems={cartItems}
        onCartUpdate={handleCartUpdate}
      />
      
      {/* first section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative w-full md:h-[570px] h-[300px]"
      >
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2 }}
          viewport={{ once: true }}
          src="/Images/TopBanner.jpg"
          alt="Topbanner"
          className="w-full h-full object-cover"
        />
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="absolute top-6 left-4 md:top-28 md:left-[63px] max-w-xs md:max-w-md"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-lg md:text-[42px] text-[#4f5864] font-medium mb-2 md:mb-10 tracking-[5px] font-typewriter"
          >
            CANDLES
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="text-sm md:text-[16px] text-[#626262] font-din tracking-[1px]"
          >
            Inspired by ancient stargazers, these candles fill your space with soft, lingering scent bringing calm, beauty, and a touch of the cosmos to your everyday moments.
          </motion.h3>
        </motion.div>
      </motion.div>

      {/* second section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-4 md:py-12 text-left"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-lg md:px-12 md:text-[30px] font-sm tracking-[4px] opacity-[50%] font-typewriter"
        >
          A STORY IN SCENT
        </motion.p>
      </motion.div>

      {/* mid section - product grid with PAB hover effects */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="flex flex-col md:flex-row w-full gap-4 px-4 md:px-8"
      >
        {products.map(({ src, label, hoverSrc }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            viewport={{ once: true }}
            className="relative w-full md:w-1/4 group cursor-pointer mb-4 md:mb-0"
            onMouseEnter={() => setHoveredProductIndex(i)}
            onMouseLeave={() => setHoveredProductIndex(null)}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="aspect-square overflow-hidden rounded-lg shadow-lg relative"
            >
              {/* Base Image */}
              <motion.img
                src={src}
                alt={label}
                className="w-full h-full object-cover absolute inset-0"
                initial={{ opacity: 1 }}
                animate={{ opacity: hoveredProductIndex === i ? 0 : 1 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              />
              {/* Hover Image */}
              <motion.img
                src={hoverSrc}
                alt={`${label} hover`}
                className="w-full h-full object-cover absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredProductIndex === i ? 1 : 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              />
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredProductIndex === i ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-black bg-opacity-20 rounded-lg flex items-center justify-center"
              >
                <motion.p
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: hoveredProductIndex === i ? 0 : 10, opacity: hoveredProductIndex === i ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-white text-[28px] md:text-[28px] font-bold tracking-widest font-din"
                >
                  {label}
                </motion.p>
              </motion.div>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      {/* Need a Hand Choosing Section */}
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
            className="text-[24px] font-normal opacity-[50%] mb-2 md:mb-4 tracking-wider font-typewriter"
          >
            NEED A HAND CHOOSING?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-base md:text-[16px] text-[#626262] leading-relaxed max-w-2xl mx-auto mb-2 md:mb-4 font-dinRegular px-4 md:px-0 tracking-[1px]"
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
            className="bg-transparent border border-black/30 text-black hover:bg-black hover:text-white transition-all duration-300 px-8 md:px-[88px] py-3 md:py-[9px] text-sm md:text-[20px] font-normal tracking-wide rounded-none font-dinRegular"
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
        className="py-8 md:py-16"
      >
        <div className="flex flex-col md:flex-row">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full md:w-[68%] h-[300px] md:h-[600px] overflow-hidden mb-6 md:mb-0 object-cover"
          >
            <motion.img
              whileHover={{ scale: 1.02 }}
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
            className="w-full md:w-[45%] relative md:-ml-44 z-10 md:mt-10"
          >
            <div className="">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="text-[24px] font-normal opacity-[50%] mb-4 md:mb-6 tracking-wide leading-tight font-typewriter"
              >
                SOFT ORRIS - THE SCENT OF STILLNESS
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="text-base md:text-[16px] text-[#626262] leading-relaxed mb-6 md:mb-4 pr-4 font-din tracking-[2px]"
              >
                Powdery, elegant, and quietly floral-Soft Orris wraps your space in a gentle hug. Perfect for slow mornings, self-care rituals, or unwinding at dusk. It's calm, bottled in wax.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
                className="text-center pl-[370px]"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-transparent border border-black/30 text-black hover:bg-black hover:text-white transition-all duration-300 px-8 md:px-[14px] py-3 md:py-[9px] text-sm md:text-[20px] font-normal tracking-wide rounded-none font-dinRegular"
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
        className="py-12 md:py-10 px-4 md:px-12 bg-[#c5c7b2]"
      >
        <div className="">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="w-full relative md:w-1/2 md:pr-12 mt-[4%]"
            >
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="text-[22px] md:text-[24px] font-normal opacity-[50%] mb-4 tracking-wide font-typewriter"
              >
                LET'S STAY IN TOUCH
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="text-base md:text-[16px] text-[#626262] leading-[1.4] font-din tracking-widest"
              >
                Follow us on Instagram and Facebook for moments of calm,
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
                className="text-base md:text-[16px] text-[#626262] leading-[1.4] font-din tracking-widest"
              >
                candlelight rituals, and a peek behind the scenes{" "}
                <span className="text-orange-500 font-din">@</span>
                <span className="text-orange-500 font-din border-b-[1px] border-orange-500">
                  JardinBotanica.
                </span>
              </motion.p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full md:w-[60%] relative"
            >
              <div className="flex gap-2 md:gap-4 overflow-hidden">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={prevImages}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-80 rounded-full p-1 md:p-2 shadow-lg hover:bg-opacity-100 transition-all"
                  disabled={carouselImages.length <= 3}
                >
                  <svg
                    className="w-4 h-4 md:w-6 md:h-6 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </motion.button>
                <div className="flex gap-2 md:gap-4 w-full transition-all duration-300 ease-in-out">
                  {getVisibleImages().map((imageSrc, index) => (
                    <motion.div
                      key={`${currentImageIndex}-${index}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="w-full h-auto aspect-square overflow-hidden rounded-lg"
                    >
                      <motion.img
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                        src={imageSrc}
                        alt={`Instagram post ${index + 1}`}
                        className="w-[300px] h-full object-cover"
                      />
                    </motion.div>
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={nextImages}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-80 rounded-full p-1 md:p-2 shadow-lg hover:bg-opacity-100 transition-all"
                  disabled={carouselImages.length <= 3}
                >
                  <svg
                    className="w-4 h-4 md:w-6 md:h-6 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </motion.button>
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
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="font-american-typewriter text-3xl lg:text-4xl tracking-tight mb-6 text-black"
            >
              Join the Circle
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="font-din-arabic text-black/70 mb-8 leading-relaxed text-lg"
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

export default Category