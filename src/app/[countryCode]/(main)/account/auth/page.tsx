// src/app/[countryCode]/account/auth/page.tsx
"use client"

import React, { useEffect, useState } from "react"
import { useActionState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "motion/react"
import { Eye, EyeOff, Smartphone } from "lucide-react"

import { login, signup } from "@lib/data/customer"
import { RippleEffect } from "app/components/RippleEffect"
import { Navigation } from "app/components/Navigation"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

// Simple error renderer (or reuse @modules/checkout/components/error-message)
function ErrorText({ error }: { error: string | null }) {
  if (!error) return null
  return <p className="mt-2 text-sm text-rose-600">{error}</p>
}

export default function AuthPage() {
  const router = useRouter()
  const params = useSearchParams()
  const redirectTo = params.get("redirect") || "/account"

  // ----- SIGN IN -----
  const [signinMessage, signinAction] = useActionState(login, null)
  const [showSignInPassword, setShowSignInPassword] = useState(false)

  useEffect(() => {
    // In the starter, a *truthy* message is usually an error string.
    // If your login action returns structured state, adjust accordingly.
    if (signinMessage === null) return
    if (signinMessage === "") {
      // Convention: empty string => success (adjust to your action’s return)
      router.replace(redirectTo)
      router.refresh()
    }
  }, [signinMessage, redirectTo, router])

  // ----- SIGN UP -----
  const [signupMessage, signupAction] = useActionState(signup, null)
  const [showCreatePassword, setShowCreatePassword] = useState(false)

  useEffect(() => {
    if (signupMessage === null) return
    if (signupMessage === "") {
      router.replace(redirectTo)
      router.refresh()
    }
  }, [signupMessage, redirectTo, router])

  const [isScrolled, setIsScrolled] = useState(false)
  const [showStickyCart, setShowStickyCart] = useState(false)
  const [heroCartItem, setHeroCartItem] = useState<CartItem | null>(null)
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  const handleCartUpdate = (item: CartItem | null) => {
    setHeroCartItem(item)

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

  const handleHeroQuantityUpdate = (quantity: number) => {
    if (heroCartItem) {
      setHeroCartItem({
        ...heroCartItem,
        quantity: quantity,
      })
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setIsScrolled(scrollY > 50)

      // Show sticky cart after scrolling past the ProductHero section (approximately 450px for compact height)
      // Show by default, hide only when heroCartItem exists and quantity is explicitly 0
      const shouldShowCart =
        scrollY > 450 && (heroCartItem === null || heroCartItem.quantity > 0)

      // Hide sticky cart when footer copyright is visible
      const footerElement = document.querySelector("footer")
      const copyrightElement = footerElement?.querySelector("p")

      if (
        copyrightElement &&
        copyrightElement.textContent?.includes("© 2025 Jardin Botanica")
      ) {
        const copyrightRect = copyrightElement.getBoundingClientRect()
        const isFooterVisible =
          copyrightRect.top < window.innerHeight && copyrightRect.bottom > 0

        setShowStickyCart(shouldShowCart && !isFooterVisible)
      } else {
        setShowStickyCart(shouldShowCart)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div>
      <RippleEffect />
      <Navigation
        isScrolled={isScrolled}
        cartItems={cartItems}
        onCartUpdate={handleCartUpdate}
      />

      <div
        className="min-h-screen pt-44 pb-12"
        style={{ backgroundColor: "#e3e3d8" }}
      >
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Sign In */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="p-8 lg:p-10"
            >
              <h2 className="font-american-typewriter text-2xl mb-8 text-black text-center">
                Sign In
              </h2>

              <form action={signinAction} className="space-y-5">
                <div>
                  <label className="font-din-arabic block text-sm text-black mb-2 tracking-wide">
                    Email Address*
                  </label>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    className="font-din-arabic w-full px-4 py-3.5 border bg-transparent text-black placeholder-black/50 focus:outline-none focus:border-black transition-all duration-300"
                    style={{ borderColor: "#D8D2C7" }}
                    placeholder="Enter your email address"
                    required
                  />
                </div>

                <div>
                  <label className="font-din-arabic block text-sm text-black mb-2 tracking-wide">
                    Password*
                  </label>
                  <div className="relative">
                    <input
                      type={showSignInPassword ? "text" : "password"}
                      name="password"
                      autoComplete="current-password"
                      className="font-din-arabic w-full px-4 py-3.5 pr-12 border bg-transparent text-black placeholder-black/50 focus:outline-none focus:border-black transition-all duration-300"
                      style={{ borderColor: "#D8D2C7" }}
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignInPassword((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-black"
                      aria-label="Toggle password visibility"
                    >
                      {showSignInPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <ErrorText
                    error={
                      typeof signinMessage === "string" ? signinMessage : null
                    }
                  />
                </div>

                <div className="text-right">
                  {/* Optional: route this to your reset flow */}
                  <a
                    href="/account/forgot-password"
                    className="font-din-arabic text-sm text-black/70 hover:text-black"
                  >
                    Forgot your password?
                  </a>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  className="font-din-arabic w-full py-4 bg-black text-white hover:bg-black/90 transition-all duration-300 text-center"
                >
                  Sign In
                </motion.button>

                {/* Divider + SSO (stub) */}
                <div className="relative py-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-black/20" />
                  </div>
                  <div className="relative flex justify-center">
                    <span
                      className="font-din-arabic text-sm text-black/70 px-4"
                      style={{ backgroundColor: "#e3e3d8" }}
                    >
                      Or Sign in with
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    type="button"
                    className="font-din-arabic w-full flex items-center px-4 py-3.5 border bg-transparent text-black hover:bg-black/5 transition-all duration-300"
                    style={{ borderColor: "#D8D2C7" }}
                  >
                    {/* Replace with real Apple SSO */}
                    <span className="text-left">Continue with Apple</span>
                  </button>
                  <button
                    type="button"
                    className="font-din-arabic w-full flex items-center px-4 py-3.5 border bg-transparent text-black hover:bg-black/5 transition-all duration-300"
                    style={{ borderColor: "#D8D2C7" }}
                  >
                    {/* Replace with real Google SSO */}
                    <span className="text-left">Continue with Google</span>
                  </button>
                  <button
                    type="button"
                    className="font-din-arabic w-full flex items-center px-4 py-3.5 border bg-transparent text-black hover:bg-black/5 transition-all duration-300"
                    style={{ borderColor: "#D8D2C7" }}
                  >
                    <Smartphone className="w-5 h-5 mr-3" />
                    <span className="text-left">Continue with Phone</span>
                  </button>
                </div>
              </form>
            </motion.div>

            {/* Create Account */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="p-8 lg:p-10"
            >
              <h2 className="font-american-typewriter text-2xl mb-8 text-black text-center">
                Create Account
              </h2>

              <form action={signupAction} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-din-arabic block text-sm text-black mb-2 tracking-wide">
                      First Name*
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      autoComplete="given-name"
                      className="font-din-arabic w-full px-4 py-3.5 border bg-transparent text-black placeholder-black/50 focus:outline-none focus:border-black transition-all duration-300"
                      style={{ borderColor: "#D8D2C7" }}
                      placeholder="First name"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-din-arabic block text-sm text-black mb-2 tracking-wide">
                      Last Name*
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      autoComplete="family-name"
                      className="font-din-arabic w-full px-4 py-3.5 border bg-transparent text-black placeholder-black/50 focus:outline-none focus:border-black transition-all duration-300"
                      style={{ borderColor: "#D8D2C7" }}
                      placeholder="Last name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="font-din-arabic block text-sm text-black mb-2 tracking-wide">
                    Email Address*
                  </label>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    className="font-din-arabic w-full px-4 py-3.5 border bg-transparent text-black placeholder-black/50 focus:outline-none focus:border-black transition-all duration-300"
                    style={{ borderColor: "#D8D2C7" }}
                    placeholder="Enter your email address"
                    required
                  />
                </div>

                <div>
                  <label className="font-din-arabic block text-sm text-black mb-2 tracking-wide">
                    Password*
                  </label>
                  <div className="relative">
                    <input
                      type={showCreatePassword ? "text" : "password"}
                      name="password"
                      autoComplete="new-password"
                      className="font-din-arabic w-full px-4 py-3.5 pr-12 border bg-transparent text-black placeholder-black/50 focus:outline-none focus:border-black transition-all duration-300"
                      style={{ borderColor: "#D8D2C7" }}
                      placeholder="Create a secure password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCreatePassword((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-black"
                      aria-label="Toggle password visibility"
                    >
                      {showCreatePassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="font-din-arabic block text-sm text-black mb-2 tracking-wide">
                    Phone (optional)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    className="font-din-arabic w-full px-4 py-3.5 border bg-transparent text-black placeholder-black/50 focus:outline-none focus:border-black transition-all duration-300"
                    style={{ borderColor: "#D8D2C7" }}
                    placeholder="Enter your phone number"
                  />
                </div>

                <ErrorText
                  error={
                    typeof signupMessage === "string" ? signupMessage : null
                  }
                />

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  className="font-din-arabic w-full py-4 bg-black text-white hover:bg-black/90 transition-all duration-300 text-center"
                >
                  Create Account
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
