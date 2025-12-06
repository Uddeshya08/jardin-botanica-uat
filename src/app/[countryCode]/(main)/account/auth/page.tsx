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
import { DatePicker } from "app/components/ui/date-picker"

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
  const [dateValue, setDateValue] = useState<Date | undefined>(undefined)

  useEffect(() => {
    if (signupMessage === null) return
    if (signupMessage === "") {
      router.replace(redirectTo)
      router.refresh()
    }
  }, [signupMessage, redirectTo, router])

  // ----- TAB STATE FOR MOBILE -----
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin")

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
        <div className="container mx-auto px-2 lg:px-12">
          {/* Mobile Tabs - Only visible on mobile */}
          <div className="lg:hidden mb-8">
            <div className="flex border-b border-black/20" style={{ borderColor: "#D8D2C7" }}>
              <button
                type="button"
                onClick={() => setActiveTab("signin")}
                className={`font-din-arabic flex-1 py-4 text-center transition-all duration-300 ${
                  activeTab === "signin"
                    ? "text-black border-b-2 border-black font-medium"
                    : "text-black/50"
                }`}
                style={{
                  borderBottomColor: activeTab === "signin" ? "#000" : "transparent",
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("signup")}
                className={`font-din-arabic flex-1 py-4 text-center transition-all duration-300 ${
                  activeTab === "signup"
                    ? "text-black border-b-2 border-black font-medium"
                    : "text-black/50"
                }`}
                style={{
                  borderBottomColor: activeTab === "signup" ? "#000" : "transparent",
                }}
              >
                Create Account
              </button>
            </div>
          </div>

          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Sign In */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className={`p-8 lg:p-10 ${activeTab !== "signin" ? "hidden lg:block" : ""}`}
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
                    Forgot Your Password?
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
                      Or Sign In With
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    type="button"
                    className="font-din-arabic w-full flex items-center px-4 py-3.5 border bg-transparent text-black hover:bg-black/5 transition-all duration-300"
                    style={{ borderColor: "#D8D2C7" }}
                  >
                    <svg
                      className="w-5 h-5 mr-3 flex-shrink-0"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                    <span className="text-left">Continue with Apple</span>
                  </button>
                  <button
                    type="button"
                    className="font-din-arabic w-full flex items-center px-4 py-3.5 border bg-transparent text-black hover:bg-black/5 transition-all duration-300"
                    style={{ borderColor: "#D8D2C7" }}
                  >
                    <svg
                      className="w-5 h-5 mr-3 flex-shrink-0"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
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
              className={`p-8 lg:p-10 ${activeTab !== "signup" ? "hidden lg:block" : ""}`}
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
                    Date of Birth
                  </label>
                  <DatePicker
                    value={dateValue}
                    onChange={setDateValue}
                    placeholder="Select date of birth"
                  />
                  {/* Hidden input for form submission */}
                  <input
                    type="hidden"
                    name="dob"
                    value={dateValue ? dateValue.toISOString().split('T')[0] : ''}
                    autoComplete="bday"
                  />
                </div>
                <div>
                  <label className="font-din-arabic block text-sm text-black mb-2 tracking-wide">
                    Phone
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
