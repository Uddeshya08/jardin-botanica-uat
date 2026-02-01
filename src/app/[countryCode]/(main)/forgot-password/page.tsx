"use client"

import { requestPasswordReset } from "@lib/data/customer"
import { Navigation } from "app/components/Navigation"
import { RippleEffect } from "app/components/RippleEffect"
import { ArrowLeft, CheckCircle, Mail } from "lucide-react"
import { motion } from "motion/react"
import { useParams, useRouter } from "next/navigation"
import React, { useActionState, useEffect, useState } from "react"

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

export default function ForgotPasswordPage() {
  const router = useRouter()
  const params = useParams()
  const countryCode = (params?.countryCode as string) || "us"

  const [isScrolled, setIsScrolled] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [emailSent, setEmailSent] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState("")

  const [formState, formAction] = useActionState(requestPasswordReset, null)

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
      setEmailSent(true)
    }
  }, [formState])

  const handleSubmit = (formData: FormData) => {
    const email = formData.get("email") as string
    setSubmittedEmail(email)
    formAction(formData)
  }

  return (
    <div>
      <RippleEffect />
      <Navigation isScrolled={isScrolled} cartItems={cartItems} onCartUpdate={handleCartUpdate} />

      <div className="min-h-screen pt-44 pb-12" style={{ backgroundColor: "#e3e3d8" }}>
        <div className="container mx-auto px-4 lg:px-12">
          <div className="max-w-md mx-auto">
            {!emailSent ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="p-8 lg:p-10"
              >
                {/* Back button */}
                <button
                  onClick={() => router.push(`/${countryCode}/account`)}
                  className="flex items-center gap-2 text-black/60 hover:text-black mb-8 font-din-arabic transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to sign in</span>
                </button>

                {/* Header */}
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-full bg-black/5 flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-black/70" />
                  </div>
                  <h1 className="font-american-typewriter text-2xl mb-3 text-black">
                    Forgot Your Password?
                  </h1>
                  <p className="font-din-arabic text-sm text-black/70 leading-relaxed">
                    No worries! Enter your email address and we'll send you instructions to reset
                    your password.
                  </p>
                </div>

                {/* Form */}
                <form action={handleSubmit} className="space-y-5">
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
                    {formState && !formState.success && <ErrorText error={formState.message} />}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    className="font-din-arabic w-full py-4 bg-black text-white hover:bg-black/90 transition-all duration-300 text-center"
                  >
                    Send reset instructions
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
                  Check Your Email
                </h2>

                <p className="font-din-arabic text-sm text-black/70 leading-relaxed mb-6">
                  We've sent password reset instructions to:
                </p>

                <p className="font-din-arabic text-base text-black font-medium mb-8">
                  {submittedEmail}
                </p>

                <div className="space-y-4">
                  <p className="font-din-arabic text-sm text-black/60 leading-relaxed">
                    Didn't receive the email? Check your spam folder or try again.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setEmailSent(false)
                        setSubmittedEmail("")
                      }}
                      className="flex-1 px-6 py-3 border text-black font-din-arabic tracking-wide hover:bg-black/5 transition-all duration-300"
                      style={{ borderColor: "#D8D2C7" }}
                    >
                      Try again
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => router.push(`/${countryCode}/account`)}
                      className="flex-1 px-6 py-3 bg-black text-white font-din-arabic tracking-wide hover:bg-black/90 transition-all duration-300"
                    >
                      Back to sign in
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
