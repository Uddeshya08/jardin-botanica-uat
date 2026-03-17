"use client"

import { addOrUpdateLineItem } from "@lib/data/cart"
import { emitCartUpdated } from "@lib/util/cart-client"
import { useLedger } from "app/context/ledger-context"
import { useParams } from "next/navigation"
import React, { useEffect, useState } from "react"
import { toast } from "sonner"
import { GiftSetsPage } from "../../../components/GiftSetsPage"
import { Navigation } from "../../../components/Navigation"
import { RippleEffect } from "../../../components/RippleEffect"

type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
  image?: string | null
  size?: string
  category?: string
  metadata?: Record<string, unknown> | null
}

type GiftSetProduct = {
  id: string
  name: string
  price: number
  image: string
  medusaVariantId?: string
  selectedCandleVariantId?: string
  personalMessage?: string
  choiceSlots?: { id: string; slotName: string }[]
  candleOptions?: { name: string; size: string; variantId: string }[]
}

export default function GiftSetsRoutePage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const { ledger, toggleLedgerItem } = useLedger()
  const params = useParams()
  const countryCode = params.countryCode as string

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
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

  const handleAddToCart = async (item: GiftSetProduct) => {
    if (!item.medusaVariantId) {
      toast.error("Unable to add to cart", {
        duration: 2000,
      })
      return
    }

    const selections: Record<string, string[]> = {}
    if (item.choiceSlots && item.choiceSlots.length > 0 && item.selectedCandleVariantId) {
      selections[item.choiceSlots[0].id] = [item.selectedCandleVariantId]
    }

    const bundleMetadata: Record<string, unknown> = {
      _bundle_id: item.id,
      _bundle_title: item.name,
      _bundle_price: item.price,
      _bundle_image: item.image,
      _bundle_selections: selections,
    }

    if (item.personalMessage) {
      bundleMetadata._bundle_personalized_note = item.personalMessage
    }

    try {
      await addOrUpdateLineItem({
        variantId: item.medusaVariantId,
        quantity: 1,
        countryCode,
        metadata: bundleMetadata,
      })

      const cartItem: CartItem = {
        id: item.medusaVariantId,
        name: item.name,
        price: item.price,
        quantity: 1,
        image: item.image,
        metadata: bundleMetadata,
      }
      handleCartUpdate(cartItem)

      emitCartUpdated({ quantityDelta: 1 })

      toast.success(`${item.name} added to cart`, {
        duration: 2000,
      })
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast.error("Failed to add to cart", {
        duration: 2000,
      })
    }
  }

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
      <GiftSetsPage
        onClose={() => {
          // Navigate back or close modal if needed
          if (typeof window !== "undefined") {
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
