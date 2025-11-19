'use client'

import React, { useEffect, useState } from 'react'
import { Navigation } from '../../../components/Navigation'
import { RippleEffect } from '../../../components/RippleEffect'
import { GiftSetsPage } from '../../../components/GiftSetsPage'
import { useLedger } from 'app/context/ledger-context'

type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  size?: string
  category?: string
}

export default function GiftSetsRoutePage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const { ledger, toggleLedgerItem } = useLedger()

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleCartUpdate = (item: CartItem | null) => {
    if (!item) return
    // Handle cart update logic here if needed
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((cartItem) => cartItem.id === item.id)
      if (existingIndex >= 0) {
        const updatedItems = [...prev]
        updatedItems[existingIndex] = item
        return updatedItems
      } else {
        return [...prev, item]
      }
    })
  }

  const handleToggleLedger = (item: any) => {
    toggleLedgerItem(item)
  }

  const handleAddToCart = (item: any) => {
    const cartItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
      size: item.size,
      category: item.category,
      ...item
    }
    handleCartUpdate(cartItem)
  }

  return (
    <div className="min-h-screen">
      <RippleEffect />
      <Navigation isScrolled={isScrolled} cartItems={cartItems} onCartUpdate={handleCartUpdate} forceWhiteText />
      <div className="h-4" />
      <GiftSetsPage
        onClose={() => {
          // Navigate back or close modal if needed
          if (typeof window !== 'undefined') {
            window.history.back()
          }
        }}
        onToggleLedger={handleToggleLedger}
        ledger={ledger}
        onAddToCart={handleAddToCart}
      />
    </div>
  )
}

