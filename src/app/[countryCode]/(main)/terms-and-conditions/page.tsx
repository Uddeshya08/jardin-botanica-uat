'use client'

import { Navigation } from "../../../components/Navigation"
import { TermsAndConditions } from "../../../components/TermsAndConditions"
import { useEffect, useState } from "react"

export default function TermsAndConditionsPage() {
  const [isScrolled, setIsScrolled] = useState(false)

  // Set page metadata on client side
  useEffect(() => {
    document.title = "Terms & Conditions | Jardin Botanica"
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Read our terms and conditions for purchasing from Jardin Botanica. Learn about our policies, shipping, returns, and more."
      )
    }
  }, [])

  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 50)
    }

    window.addEventListener('scroll', handleScroll)
    
    // Check initial scroll position
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <>
      <Navigation isScrolled={isScrolled} />
      <main>
        <TermsAndConditions />
      </main>
    </>
  )
}