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
// import { Footer } from './components/Footer';
interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}
export default function Home() {
  // const [isScrolled, setIsScrolled] = useState(false);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     setIsScrolled(window.scrollY > 50);
  //   };

  //   window.addEventListener('scroll', handleScroll);
  //   return () => window.removeEventListener('scroll', handleScroll);
  // }, []);

  const [isScrolled, setIsScrolled] = useState(false)
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

      {/* Bottom Fold Sections */}
      <DesignPhilosophy />
      <FeaturedRitual />
      <BespokeGifting />
      <JournalSection />

      {/* Newsletter/Contact Section */}
     <Newsletter />
    </div>
  )
}
