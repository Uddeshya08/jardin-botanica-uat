"use client"
import React, { useState, useEffect } from "react"
import { motion } from "motion/react"
import { Navigation } from "app/components/Navigation"
import { ProductHero } from "app/components/ProductHero"
import { StickyCartBar } from "app/components/StickyCartBar"
import { Afterlife } from "app/components/Afterlife"
import { PeopleAlsoBought } from "app/components/PeopleAlsoBought"
import { FeaturedRitual } from "app/components/FeaturedRitual"

import { CustomerTestimonials } from "app/components/CustomerTestimonials"
import { RippleEffect } from "app/components/RippleEffect"
import { PeopleAlsoBoughtTwo } from "app/components/PeopleAlsoBoughtTwo"
import { FeaturedRitualTwo } from "app/components/FeaturedRitualTwo"
import { ProductHeroHands } from "app/components/ProductHeroHands"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [showStickyCart, setShowStickyCart] = useState(false)
  const [heroCartItem, setHeroCartItem] = useState<CartItem | null>(null)
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "soft-orris-hand-veil",
      name: "Soft Orris Hand Veil",
      price: 1800,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop",
    },
  ])

  const handleCartUpdate = (item: CartItem | null) => {
    setHeroCartItem(item)

    // Update cartItems array for navigation
    if (item && item.quantity > 0) {
      setCartItems((prevItems) => {
        const existingIndex = prevItems.findIndex(
          (cartItem) => cartItem.id === item.id
        )
        if (existingIndex >= 0) {
          // Update existing item
          const updatedItems = [...prevItems]
          updatedItems[existingIndex] = item
          return updatedItems
        } else {
          // Add new item
          return [...prevItems, item]
        }
      })
    } else if (item && item.quantity === 0) {
      // Remove item if quantity is 0
      setCartItems((prevItems) =>
        prevItems.filter((cartItem) => cartItem.id !== item.id)
      )
    }
  }

  const handleHeroQuantityUpdate = (quantity: number) => {
    if (heroCartItem) {
      setHeroCartItem({
        ...heroCartItem,
        quantity: quantity,
      })
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setIsScrolled(scrollY > 50)

      // Show sticky cart after scrolling past the ProductHero section (approximately 450px for compact height)
      // Show by default, hide only when heroCartItem exists and quantity is explicitly 0
      const shouldShowCart =
        scrollY > 450 && (heroCartItem === null || heroCartItem.quantity > 0)

      // Hide sticky cart when footer copyright is visible
      const footerElement = document.querySelector("footer")
      const copyrightElement = footerElement?.querySelector("p")

      if (
        copyrightElement &&
        copyrightElement.textContent?.includes("© 2025 Jardin Botanica")
      ) {
        const copyrightRect = copyrightElement.getBoundingClientRect()
        const isFooterVisible =
          copyrightRect.top < window.innerHeight && copyrightRect.bottom > 0

        setShowStickyCart(shouldShowCart && !isFooterVisible)
      } else {
        setShowStickyCart(shouldShowCart)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen">
      <RippleEffect />
      <Navigation
        isScrolled={isScrolled}
        cartItems={cartItems}
        onCartUpdate={handleCartUpdate}
      />
      <div className="h-4"></div>
      <ProductHeroHands onCartUpdate={handleCartUpdate} />
      <StickyCartBar
        isVisible={showStickyCart}
        heroCartItem={heroCartItem}
        onUpdateHeroQuantity={handleHeroQuantityUpdate}
        onCartUpdate={handleCartUpdate}
      />
      {/* Bottom Fold Sections */}
      <Afterlife />
      <PeopleAlsoBought />/{/* <FeaturedRitual /> */}
      <FeaturedRitualTwo />
      <CustomerTestimonials />
      {/* Newsletter/Contact Section */}
      <section
        className="py-20 relative overflow-hidden"
        style={{ backgroundColor: "#e3e3d8" }}
      >
        {/* Smooth Animated Gradient Background */}
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

        {/* Secondary Smooth Layer */}
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
              className="font-american-typewriter text-3xl tracking-tight mb-6 text-black"
            >
              Cultivate Your Ritual
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="font-din-arabic text-black/70 mb-8 leading-relaxed text-lg"
            >
              Subscribe to receive hand care wisdom, botanical insights, and
              early access to our latest concoctions.
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
