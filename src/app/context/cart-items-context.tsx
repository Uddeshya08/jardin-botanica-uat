"use client"

import type React from "react"
import { createContext, useContext, useEffect, useMemo, useState } from "react"

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string | null
  product_id?: string
  variant_id?: string
  handle?: string
  metadata?: Record<string, unknown> | null
  line_item_id?: string // Medusa line item ID for server operations
}

interface CartItemsContextValue {
  cartItems: CartItem[]
  handleCartUpdate: (item: CartItem | null) => void
}

const CartItemsContext = createContext<CartItemsContextValue | undefined>(undefined)

export function CartItemsProvider({
  children,
  initialCartItems = [],
}: {
  children: React.ReactNode
  initialCartItems?: CartItem[]
}) {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems)

  // Sync with server cart items when they change
  useEffect(() => {
    console.log("🔍 Initial cart items:", initialCartItems)
    setCartItems(initialCartItems)
  }, [initialCartItems])

  const handleCartUpdate = (item: CartItem | null) => {
    // Debug: Log price value when item is added/updated
    if (item) {
      console.log("🔍 Cart Item Update - Price Debug:", {
        itemId: item.id,
        itemName: item.name,
        price: item.price,
        priceType: typeof item.price,
        quantity: item.quantity,
        fullItem: item,
      })
    }

    // Update cartItems array for navigation
    if (item && item.quantity > 0) {
      setCartItems((prevItems) => {
        // Match by exact ID only - different variants should be separate cart items
        const existingIndex = prevItems.findIndex((cartItem) => {
          // Exact ID match (includes productId-variantId format)
          if (cartItem.id === item.id) return true

          // If both have variant_id, match only if they are the same variant
          const itemVariantId = item.variant_id
          const cartItemVariantId = cartItem.variant_id
          if (itemVariantId && cartItemVariantId && itemVariantId === cartItemVariantId) {
            return true
          }

          return false
        })

        if (existingIndex >= 0) {
          // Update existing item
          const updatedItems = [...prevItems]
          updatedItems[existingIndex] = item
          console.log("✅ Updated existing cart item:", {
            old: prevItems[existingIndex],
            new: item,
            index: existingIndex,
          })
          return updatedItems
        } else {
          // Add new item
          console.log("➕ Added new cart item:", item)
          console.log(
            "📦 Current cart before add:",
            prevItems.map((i) => ({ id: i.id, name: i.name }))
          )
          return [...prevItems, item]
        }
      })
    } else if (item && item.quantity === 0) {
      // Remove item if quantity is 0 - match by exact ID only
      console.log("🗑️ Removing cart item:", item.id)
      setCartItems((prevItems) => {
        return prevItems.filter((cartItem) => {
          // Remove only exact ID match
          if (cartItem.id === item.id) return false
          // Also remove if same variant_id
          if (item.variant_id && cartItem.variant_id && cartItem.variant_id === item.variant_id) {
            return false
          }
          return true
        })
      })
    }
  }

  const value = useMemo(
    () => ({
      cartItems,
      handleCartUpdate,
    }),
    [cartItems]
  )

  console.log("🔍 Current cart items:", cartItems)
  console.log("🔍 Cart Items Context Value:", value)

  return <CartItemsContext.Provider value={value}>{children}</CartItemsContext.Provider>
}

export function useCartItems() {
  const context = useContext(CartItemsContext)
  if (!context) {
    throw new Error("useCartItems must be used within a CartItemsProvider")
  }
  return context
}

// Safe version that returns null if not in provider
export function useCartItemsSafe() {
  return useContext(CartItemsContext)
}
