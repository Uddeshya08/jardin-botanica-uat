"use client"

import React, { useEffect, useState } from "react"

import { Navigation } from "app/components/Navigation"
import { RippleEffect } from "app/components/RippleEffect"
import { HomeCreationsPage } from "app/components/HomeCreationsPage"
import { upsertCartItems } from "lib/util/cart-helpers"

type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  size?: string
  category?: string
}

export default function HomeCreationsRoutePage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const handleCartUpdate = (item: CartItem | null) => {
    if (!item) return
    setCartItems((prev) => upsertCartItems(prev, item))
  }

  return (
    <div className="min-h-screen">
      <RippleEffect />
      <Navigation isScrolled={isScrolled} cartItems={cartItems} onCartUpdate={handleCartUpdate} forceWhiteText />
      <div className="h-4" />
      <HomeCreationsPage
        onAddToCart={(item) => {
          handleCartUpdate(item)
        }}
      />
    </div>
  )
}



