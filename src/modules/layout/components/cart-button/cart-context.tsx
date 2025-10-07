'use client'

import { createContext, useContext } from 'react'
import { HttpTypes } from "@medusajs/types"

type CartContextType = HttpTypes.StoreCart | null

const CartContext = createContext<CartContextType>(null)

export function CartProvider({ cart, children }: { 
  cart: HttpTypes.StoreCart | null
  children: React.ReactNode 
}) {
  return (
    <CartContext.Provider value={cart}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}