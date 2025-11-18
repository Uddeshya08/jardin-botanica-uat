"use client"
import React, { useEffect, useState } from 'react'
import { Navigation } from 'app/components/Navigation'
import { RippleEffect } from 'app/components/RippleEffect'
import { BodyHandsPage } from 'app/components/BodyHandsPage'

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
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleCartUpdate = (item: CartItem | null) => {
    if (!item) return
  }

  return (
    <div className="min-h-screen">
      <RippleEffect />
      <Navigation
        isScrolled={isScrolled} cartItems={cartItems} onCartUpdate={handleCartUpdate} forceWhiteText={true} />
      <div className="h-4" />
      <BodyHandsPage onAddToCart={handleCartUpdate} />
    </div>
  )
}