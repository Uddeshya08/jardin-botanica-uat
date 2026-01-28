"use client"
import { BespokeGifting } from "app/components/BespokeGifting"
import { DesignPhilosophy } from "app/components/DesignPhilosophy"
import { FeaturedRitual } from "app/components/FeaturedRitual"
import { HeroSection } from "app/components/HeroSection"
import { JournalSection } from "app/components/JournalSection"
import { Navigation } from "app/components/Navigation"
import Newsletter from "app/components/Newsletter"
import { RippleEffect } from "app/components/RippleEffect"
import { useCartItems } from "app/context/cart-items-context"
import React, { useEffect, useState } from "react"
import { ProductCarousel } from "../product-carousel"

import type { HttpTypes } from "@medusajs/types"

interface HeroProps {
  products?: HttpTypes.StoreProduct[]
  countryCode?: string
}

export default function Home({ products, countryCode }: HeroProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const { cartItems, handleCartUpdate } = useCartItems()

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
      <ProductCarousel products={products} countryCode={countryCode} />
      <FeaturedRitual />
      <BespokeGifting />
      <JournalSection />
      <Newsletter />
    </div>
  )
}
