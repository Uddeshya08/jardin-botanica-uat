// app/[countryCode]/account/(main)/account/_client-account-shell.tsx
"use client"

import { useEffect, useState } from "react"
import AccountLayout from "@modules/account/templates/account-layout"
import { Navigation } from "app/components/Navigation"
import { RippleEffect } from "app/components/RippleEffect"
import { upsertCartItems } from "lib/util/cart-helpers"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

export default function ClientAccountShell({
  customer,
  dashboard,
  login,
}: {
  customer: any
  dashboard?: React.ReactNode
  login?: React.ReactNode
}) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [showStickyCart, setShowStickyCart] = useState(false)
  const [heroCartItem, setHeroCartItem] = useState<CartItem | null>(null)
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  const handleCartUpdate = (item: CartItem | null) => {
    setHeroCartItem(item)

    if (!item) return
    setCartItems((prev) => upsertCartItems(prev, item))
  }

  const handleHeroQuantityUpdate = (quantity: number) => {
    if (heroCartItem) {
      setHeroCartItem({ ...heroCartItem, quantity })
    }
  }

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY
      setIsScrolled(scrollY > 50)

      const shouldShowCart =
        scrollY > 450 && (heroCartItem === null || heroCartItem.quantity > 0)

      const footerElement = document.querySelector("footer")
      const copyrightElement = footerElement?.querySelector("p")
      if (
        copyrightElement &&
        copyrightElement.textContent?.includes("© 2025 Jardin Botanica")
      ) {
        const rect = copyrightElement.getBoundingClientRect()
        const footerVisible = rect.top < window.innerHeight && rect.bottom > 0
        setShowStickyCart(shouldShowCart && !footerVisible)
      } else {
        setShowStickyCart(shouldShowCart)
      }
    }

    onScroll() // set initial state
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [heroCartItem])

  // Signed-in view
  if (customer) {
    return (
      <>
        <RippleEffect />
        <Navigation
          isScrolled={isScrolled}
          cartItems={cartItems}
          onCartUpdate={handleCartUpdate}
        />
        <AccountLayout customer={customer}>{dashboard}</AccountLayout>
        {/* If you render StickyCartBar here, pass showStickyCart/heroCartItem/handlers as props */}
        {/* <StickyCartBar
             isVisible={showStickyCart}
             heroCartItem={heroCartItem}
             onUpdateHeroQuantity={handleHeroQuantityUpdate}
             onCartUpdate={handleCartUpdate}
           /> */}
      </>
    )
  }

  // Not signed in → show login slot
  return <>{login}</>
}
