"use client"

import type { HttpTypes } from "@medusajs/types"
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
import type { SanityJournalListItem as Blog } from "types/sanity-blog"
import type { SanityHomePage } from "types/sanity-home"
import { ProductCarousel } from "../product-carousel"

interface HeroProps {
  products?: HttpTypes.StoreProduct[]
  blogs?: Blog[]
  countryCode?: string
  content?: SanityHomePage | null
}

export default function Home({ products, blogs, countryCode, content }: HeroProps) {
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
      <Navigation isScrolled={isScrolled} cartItems={cartItems} onCartUpdate={handleCartUpdate} />
      <HeroSection slides={content?.heroSlides} />

      {/* Bottom Fold Sections */}
      <DesignPhilosophy content={content?.philosophy} />
      <ProductCarousel products={products} countryCode={countryCode} heading={content?.products?.heading} />
      <FeaturedRitual content={content?.ritual} />
      <BespokeGifting content={content?.gifting} />
      <JournalSection blogs={blogs} countryCode={countryCode} content={content?.journal} />
      <Newsletter content={content?.newsletter} />
    </div>
  )
}
