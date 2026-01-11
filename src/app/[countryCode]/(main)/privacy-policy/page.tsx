'use client'

import { Navigation } from "../../../components/Navigation"
import { PrivacyPolicy } from "../../../components/PrivacyPolicy"
import { useEffect, useState } from "react"

export default function PrivacyPolicyPage() {
  const [isScrolled, setIsScrolled] = useState(false)

  // Set page metadata on client side
  useEffect(() => {
    document.title = "Privacy Policy | Jardin Botanica"
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Learn how Jardin Botanica collects, uses, shares, and protects your personal data. Read our comprehensive privacy policy."
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
        <PrivacyPolicy />
      </main>
    </>
  )
}





