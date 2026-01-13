"use client"

import { Navigation } from "app/components/Navigation"
import { useAuth } from "app/context/auth-context"
import { useCartItems } from "app/context/cart-items-context"
import { useEffect, useState } from "react"

export default function CheckoutNavigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const { cartItems, handleCartUpdate } = useCartItems()
  const { isLoggedIn } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setIsScrolled(scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <Navigation
      isScrolled={isScrolled}
      cartItems={cartItems}
      onCartUpdate={handleCartUpdate}
      isLoggedIn={isLoggedIn}
      disableSticky={false}
    />
  )
}
