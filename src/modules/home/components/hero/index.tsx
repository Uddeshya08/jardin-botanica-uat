"use client"
import React, { useState, useEffect } from "react"
import { Navigation } from "app/components/Navigation"
import { HeroSection } from "app/components/HeroSection"
import { DesignPhilosophy } from "app/components/DesignPhilosophy"
import { FeaturedRitual } from "app/components/FeaturedRitual"
import { BespokeGifting } from "app/components/BespokeGifting"
import { JournalSection } from "app/components/JournalSection"
import { RippleEffect } from "app/components/RippleEffect"
import Newsletter from "app/components/Newsletter"

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
      <FeaturedRitual />
      <BespokeGifting />
      <JournalSection />
     <Newsletter />
    </div>
  )
}
