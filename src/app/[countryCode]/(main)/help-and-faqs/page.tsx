'use client'

import { Navigation } from "../../../components/Navigation"
import { HelpFAQ } from "../../../components/HelpFAQ"
import { useEffect, useState } from "react"

export default function HelpAndFAQsPage() {
  const [isScrolled, setIsScrolled] = useState(false)

  // Set page metadata on client side
  useEffect(() => {
    document.title = "Help & FAQs | Jardin Botanica"
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Find answers to frequently asked questions about Jardin Botanica. Learn about shipping, returns, product care, and more."
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
        <HelpFAQ />
      </main>
    </>
  )
}

