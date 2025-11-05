"use client"

import { CheckoutPage } from "../../../components/CheckoutPage"
import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { getLocalCart } from "@lib/util/local-cart"

export default function ProductCheckout() {
  const router = useRouter()
  const params = useParams()
  const countryCode = params.countryCode as string
  const [cartItems, setCartItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load cart items from localStorage
    const localCart = getLocalCart()
    console.log('Loaded cart from localStorage:', localCart)
    
    // Transform cart items to match the CheckoutPage expected format
    const transformedItems = localCart.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.thumbnail || item.image,
    }))
    
    console.log('Transformed cart items:', transformedItems)
    setCartItems(transformedItems)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    // Listen for cart updates from localStorage
    const handleCartUpdate = (event: CustomEvent) => {
      const items = event.detail.items || []
      console.log('Cart updated event received:', items)
      const transformedItems = items.map((item: any) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.thumbnail || item.image,
      }))
      setCartItems(transformedItems)
    }

    window.addEventListener('localCartUpdated', handleCartUpdate as EventListener)
    
    // Also listen to 'storage' event for changes from other tabs/windows
    const handleStorageChange = () => {
      const localCart = getLocalCart()
      const transformedItems = localCart.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.thumbnail || item.image,
      }))
      setCartItems(transformedItems)
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('localCartUpdated', handleCartUpdate as EventListener)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const handleBack = () => {
    router.push(`/${countryCode}/profile`)
  }

  const handleCartUpdate = (item: any) => {
    if (!item) return
    // Update cart in local state
    if (item.quantity === 0) {
      // Remove item
      setCartItems(prevItems => prevItems.filter(cartItem => cartItem.id !== item.id))
      // Also update localStorage
      if (typeof window !== 'undefined') {
        import("@lib/util/local-cart").then(({ removeFromLocalCart }) => {
          removeFromLocalCart(item.id)
        })
      }
    } else {
      // Update quantity
      setCartItems(prevItems => {
        return prevItems.map(cartItem => 
          cartItem.id === item.id ? { ...cartItem, quantity: item.quantity } : cartItem
        )
      })
      // Also update localStorage
      if (typeof window !== 'undefined') {
        import("@lib/util/local-cart").then(({ updateLocalCartItem }) => {
          updateLocalCartItem(item.id, item.quantity)
        })
      }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#e3e3d8' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="font-din-arabic text-black/60">Loading checkout...</p>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#e3e3d8' }}>
        <div className="text-center max-w-md px-6">
          <h2 className="font-american-typewriter text-2xl mb-4">Your cart is empty</h2>
          <p className="font-din-arabic text-black/60 mb-6">
            Add some items to your cart before checking out
          </p>
          <button
            onClick={handleBack}
            className="px-8 py-3 bg-black text-white rounded-xl font-din-arabic hover:bg-gray-900 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  return <CheckoutPage cartItems={cartItems} onBack={handleBack} onCartUpdate={handleCartUpdate} />
}

