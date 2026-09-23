"use client"

import { MaterialArchivePage } from "app/components/MaterialArchivePage"
import { Navigation } from "app/components/Navigation"
import { RippleEffect } from "app/components/RippleEffect"
import { useCartItems } from "app/context/cart-items-context"
import { useEffect, useState } from "react"

export default function MaterialArchiveRoutePage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const { cartItems, handleCartUpdate } = useCartItems()

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="min-h-screen">
      <RippleEffect />
      <Navigation
        isScrolled={isScrolled}
        cartItems={cartItems}
        onCartUpdate={handleCartUpdate}
        forceWhiteText
      />
      <div className="h-4" />
      <MaterialArchivePage />
    </div>
  )
}
