"use client"
import { BespokeGifting } from "app/components/BespokeGifting"
import { DesignPhilosophy } from "app/components/DesignPhilosophy"
import { FeaturedRitual } from "app/components/FeaturedRitual"
import { HeroSection } from "app/components/HeroSection"
import { JournalSection } from "app/components/JournalSection"
import { Navigation } from "app/components/Navigation"
import Newsletter from "app/components/Newsletter"
import { RippleEffect } from "app/components/RippleEffect"
import React, { useEffect, useState } from "react"
import { ProductCarousel } from "../product-carousel"

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false)

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
      <Navigation isScrolled={isScrolled} />
      <HeroSection />

      {/* Bottom Fold Sections */}
      <DesignPhilosophy />
      <ProductCarousel />
      <FeaturedRitual />
      <BespokeGifting />
      <JournalSection />
      <Newsletter />
    </div>
  )
}
