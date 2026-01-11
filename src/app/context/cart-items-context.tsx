"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  product_id?: string
  variant_id?: string
}

interface CartItemsContextValue {
  cartItems: CartItem[]
  handleCartUpdate: (item: CartItem | null) => void
}

const CartItemsContext = createContext<CartItemsContextValue | undefined>(
  undefined
)

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
    setCartItems(initialCartItems)
  }, [initialCartItems])

  const handleCartUpdate = (item: CartItem | null) => {
    // Debug: Log price value when item is added/updated
    if (item) {
      console.log('🔍 Cart Item Update - Price Debug:', {
        itemId: item.id,
        itemName: item.name,
        price: item.price,
        priceType: typeof item.price,
        quantity: item.quantity,
        fullItem: item
      })
    }

    // Update cartItems array for navigation
    if (item && item.quantity > 0) {
      setCartItems((prevItems) => {
        // Improved matching: check by ID, variant_id, or name to prevent duplicates
        const existingIndex = prevItems.findIndex((cartItem) => {
          const itemVariantId = (item as any).variant_id
          const cartItemVariantId = (cartItem as any).variant_id
          const itemIsRitual = (item as any).isRitualProduct
          const cartItemIsRitual = (cartItem as any).isRitualProduct

          // Match by exact ID
          if (cartItem.id === item.id) return true

          // Match by variant_id if present (for main products)
          if (!itemIsRitual && !cartItemIsRitual && itemVariantId && cartItemVariantId) {
            if (itemVariantId === cartItemVariantId || cartItem.id === itemVariantId || item.id === cartItemVariantId) {
              return true
            }
          }

          // Match by name for ritual products
          if (itemIsRitual && cartItemIsRitual && cartItem.name === item.name) {
            return true
          }

          // Match by name for main products (fallback)
          if (!itemIsRitual && !cartItemIsRitual && cartItem.name === item.name && !itemVariantId && !cartItemVariantId) {
            return true
          }

          return false
        })

        if (existingIndex >= 0) {
          // Update existing item
          const updatedItems = [...prevItems]
          updatedItems[existingIndex] = item
          console.log('✅ Updated existing cart item:', {
            old: prevItems[existingIndex],
            new: item,
            index: existingIndex
          })
          return updatedItems
        } else {
          // Add new item
          console.log('➕ Added new cart item:', item)
          console.log('📦 Current cart before add:', prevItems.map(i => ({ id: i.id, name: i.name })))
          return [...prevItems, item]
        }
      })
    } else if (item && item.quantity === 0) {
      // Remove item if quantity is 0 - improved matching
      console.log('🗑️ Removing cart item:', item.id)
      setCartItems((prevItems) => {
        const itemVariantId = (item as any).variant_id
        return prevItems.filter((cartItem) => {
          // Remove by exact ID or variant_id match
          if (cartItem.id === item.id) return false
          const cartItemVariantId = (cartItem as any).variant_id
          if (itemVariantId && (cartItem.id === itemVariantId || cartItemVariantId === item.id || cartItemVariantId === itemVariantId)) {
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

  console.log('🔍 Current cart items:', cartItems)
  console.log('🔍 Cart Items Context Value:', value)

  return (
    <CartItemsContext.Provider value={value}>
      {children}
    </CartItemsContext.Provider>
  )
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
