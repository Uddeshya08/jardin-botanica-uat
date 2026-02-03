"use client"

import { resetPassword } from "@lib/data/customer"
import { Navigation } from "app/components/Navigation"
import { RippleEffect } from "app/components/RippleEffect"
import { CheckCircle, Eye, EyeOff, Lock } from "lucide-react"
import { motion } from "motion/react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import type React from "react"
import { useActionState, useEffect, useState } from "react"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

function ErrorText({ error }: { error: string | null }) {
  if (!error) return null
  const cleanError = error.replace(/^Error:\s*/i, "").replace(/^Invalid request:\s*/i, "")
  return <p className="mt-2 text-sm text-rose-600">{cleanError}</p>
}

export default function ResetPasswordPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const countryCode = (params?.countryCode as string) || "us"

  const email = searchParams.get("email") || ""
  const token = searchParams.get("token") || ""

  const [isScrolled, setIsScrolled] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordsMatch, setPasswordsMatch] = useState(true)
  const [resetSuccess, setResetSuccess] = useState(false)

  const [formState, formAction] = useActionState(resetPassword, null)

  const handleCartUpdate = (item: CartItem | null) => {
    if (item && item.quantity > 0) {
      setCartItems((prevItems) => {
        const existingIndex = prevItems.findIndex((cartItem) => cartItem.id === item.id)
        if (existingIndex >= 0) {
          const updatedItems = [...prevItems]
          updatedItems[existingIndex] = item
          return updatedItems
        } else {
          return [...prevItems, item]
        }
      })
    } else if (item && item.quantity === 0) {
      setCartItems((prevItems) => prevItems.filter((cartItem) => cartItem.id !== item.id))
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (formState?.success) {
      setResetSuccess(true)
      // Hard redirect after 2 seconds to properly load auth state
      setTimeout(() => {
        window.location.href = `/${countryCode}/account`
      }, 2000)
    }
  }, [formState, countryCode])

  // Redirect if no email or token
  useEffect(() => {
    if (!email || !token) {
      router.push(`/${countryCode}/forgot-password`)
    }
  }, [email, token, router, countryCode])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirm_password") as string

    if (password !== confirmPassword) {
      setPasswordsMatch(false)
      return
    }

    setPasswordsMatch(true)
    formAction(formData)
  }

  if (!email || !token) {
    return null
  }

  return (
    <div>
      <RippleEffect />
      <Navigation isScrolled={isScrolled} cartItems={cartItems} onCartUpdate={handleCartUpdate} />

      <div className="min-h-screen pt-44 pb-12" style={{ backgroundColor: "#e3e3d8" }}>
        <div className="container mx-auto px-4 lg:px-12">
          <div className="max-w-md mx-auto">
            {!resetSuccess ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="p-8 lg:p-10"
              >
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-full bg-black/5 flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8 text-black/70" />
                  </div>
                  <h1 className="font-american-typewriter text-2xl mb-3 text-black">
                    Reset Your Password
                  </h1>
                  <p className="font-din-arabic text-sm text-black/70 leading-relaxed">
                    Enter your new password below. Make sure it's strong and secure.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <input type="hidden" name="email" value={email} />
                  <input type="hidden" name="token" value={token} />

                  <div>
                    <label className="font-din-arabic block text-sm text-black mb-2 tracking-wide">
                      New Password*
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        autoComplete="new-password"
                        className="font-din-arabic w-full px-4 py-3.5 pr-12 border bg-transparent text-black placeholder-black/50 focus:outline-none focus:border-black transition-all duration-300"
                        style={{ borderColor: "#D8D2C7" }}
                        placeholder="Enter new password"
                        required
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-black"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="font-din-arabic block text-sm text-black mb-2 tracking-wide">
                      Confirm New Password*
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirm_password"
                        autoComplete="new-password"
                        className="font-din-arabic w-full px-4 py-3.5 pr-12 border bg-transparent text-black placeholder-black/50 focus:outline-none focus:border-black transition-all duration-300"
                        style={{ borderColor: "#D8D2C7" }}
                        placeholder="Confirm new password"
                        required
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-black"
                        aria-label="Toggle password visibility"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {!passwordsMatch && <ErrorText error="Passwords do not match" />}
                    {formState && !formState.success && <ErrorText error={formState.message} />}
                  </div>

                  <div className="bg-black/5 rounded-lg p-4">
                    <p className="font-din-arabic text-xs text-black/70 leading-relaxed">
                      Password requirements:
                    </p>
                    <ul className="font-din-arabic text-xs text-black/60 mt-2 space-y-1 list-disc list-inside">
                      <li>At least 8 characters long</li>
                      <li>Mix of letters and numbers recommended</li>
                    </ul>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    className="font-din-arabic w-full py-4 bg-black text-white hover:bg-black/90 transition-all duration-300 text-center"
                  >
                    Reset password
                  </motion.button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="p-8 lg:p-10 text-center"
              >
                {/* Success Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </motion.div>

                <h2 className="font-american-typewriter text-2xl mb-4 text-black">
                  Password Reset Successfully
                </h2>

                <p className="font-din-arabic text-sm text-black/70 leading-relaxed mb-8">
                  Your password has been updated. You can now sign in with your new password.
                </p>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push(`/${countryCode}/account`)}
                  className="px-8 py-3 bg-black text-white font-din-arabic tracking-wide hover:bg-black/90 transition-all duration-300"
                >
                  Go to sign in
                </motion.button>

                <p className="font-din-arabic text-xs text-black/50 mt-4">
                  Redirecting automatically in 2 seconds...
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
