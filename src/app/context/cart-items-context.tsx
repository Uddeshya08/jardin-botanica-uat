"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
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
    // Update cartItems array for navigation
    if (item && item.quantity > 0) {
      setCartItems((prevItems) => {
        const existingIndex = prevItems.findIndex(
          (cartItem) => cartItem.id === item.id
        )
        if (existingIndex >= 0) {
          // Update existing item
          const updatedItems = [...prevItems]
          updatedItems[existingIndex] = item
          return updatedItems
        } else {
          // Add new item
          return [...prevItems, item]
        }
      })
    } else if (item && item.quantity === 0) {
      // Remove item if quantity is 0
      setCartItems((prevItems) =>
        prevItems.filter((cartItem) => cartItem.id !== item.id)
      )
    }
  }

  const value = useMemo(
    () => ({
      cartItems,
      handleCartUpdate,
    }),
    [cartItems]
  )

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

