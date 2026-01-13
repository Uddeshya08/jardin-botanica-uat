"use client"

import { BotanistLabPage } from "app/components/BotanistLabPage"

import { Navigation } from "app/components/Navigation"
import { RippleEffect } from "app/components/RippleEffect"
import React, { useEffect, useState } from "react"

type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  size?: string
  category?: string
}

export default function TheLabRoutePage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const handleCartUpdate = (item: CartItem | null) => {
    if (!item) return
  }

  return (
    <div className="min-h-screen bg-white">
      <RippleEffect />
      <Navigation
        isScrolled={isScrolled}
        cartItems={cartItems}
        onCartUpdate={handleCartUpdate}
        forceWhiteText
      />
      <div className="h-4" />
      <BotanistLabPage />
    </div>
  )
}
