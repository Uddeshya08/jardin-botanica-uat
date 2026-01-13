"use client"
import { BodyHandsPage } from "app/components/BodyHandsPage"
import { Navigation } from "app/components/Navigation"
import { RippleEffect } from "app/components/RippleEffect"
import { useCartItems } from "app/context/cart-items-context"
import React, { useEffect, useState } from "react"

type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  size?: string
}

export default function BodyHandsRoutePage() {
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
        forceWhiteText={true}
      />
      <div className="h-4" />
      <BodyHandsPage onAddToCart={handleCartUpdate} />
    </div>
  )
}
