'use client'

import { Navigation } from "../../../components/Navigation"
import { ReturnsAndExchanges } from "../../../components/ReturnsAndExchanges"
import { useEffect, useState } from "react"

export default function ReturnsAndExchangesPage() {
  const [isScrolled, setIsScrolled] = useState(false)

  // Set page metadata on client side
  useEffect(() => {
    document.title = "Returns & Exchanges | Jardin Botanica"
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Learn about our returns and exchanges policy at Jardin Botanica. We accept returns for damaged or defective items within 7 days of delivery."
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
        <ReturnsAndExchanges />
      </main>
    </>
  )
}

