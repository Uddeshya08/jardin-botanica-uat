"use client"
import React, { useState, useEffect } from "react"
import { motion } from "motion/react"
import { Navigation } from "app/components/Navigation"
import { HeroSection } from "app/components/HeroSection"
import { DesignPhilosophy } from "app/components/DesignPhilosophy"
import { FeaturedRitual } from "app/components/FeaturedRitual"
import { BespokeGifting } from "app/components/BespokeGifting"
import { JournalSection } from "app/components/JournalSection"
import { RippleEffect } from "app/components/RippleEffect"
import Newsletter from "app/components/Newsletter"
import { upsertCartItems } from "lib/util/cart-helpers"
interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}
export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  const handleCartUpdate = (item: CartItem | null) => {
    if (!item) return
    setCartItems((prevItems) => upsertCartItems(prevItems, item))
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setIsScrolled(scrollY > 50)
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
      <HeroSection />
      <DesignPhilosophy />
      <FeaturedRitual />
      <BespokeGifting />
      <JournalSection />
      <Newsletter />
    </div>
  )
}
