// src/app/[countryCode]/account/auth/page.tsx
"use client"

import React, { useEffect, useState } from "react"
import { useActionState } from "react"
import { useRouter, useSearchParams, useParams } from "next/navigation"
import { motion } from "motion/react"
import { Eye, EyeOff, Smartphone } from "lucide-react"

import { login, signup } from "@lib/data/customer"
import { RippleEffect } from "app/components/RippleEffect"
import { Navigation } from "app/components/Navigation"
import { DatePicker } from "app/components/ui/date-picker"
import { sdk } from "@lib/config"

// Google reCAPTCHA v2 types
declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void
      render: (container: HTMLElement, options: {
        sitekey: string
        callback: (token: string) => void
        'expired-callback': () => void
        'error-callback': () => void
        size?: string
        theme?: string
      }) => number
      reset: (widgetId?: number) => void
      getResponse: (widgetId?: number) => string
    }
  }
}

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

  // "Error:" prefix remove
  const cleanError = error
    .replace(/^Error:\s*/i, "")
    .replace(/^Invalid request:\s*/i, "")

  return <p className="mt-2 text-sm text-rose-600">{cleanError}</p>
}

export default function AuthPage() {
  const router = useRouter()
  const params = useSearchParams()
  const routeParams = useParams()
  const countryCode = (routeParams?.countryCode as string) || "us"
  const redirectTo = params.get("redirect") || "/account"

  // Check for stored order email and redirect path
  const [orderEmail, setOrderEmail] = useState("")
  const [actualRedirectPath, setActualRedirectPath] = useState(redirectTo)

  useEffect(() => {
    // Check if there's a stored email and redirect path from order confirmation
    const storedEmail = sessionStorage.getItem("jardinBotanica_orderEmail")
    const storedRedirect = sessionStorage.getItem(
      "jardinBotanica_redirectAfterLogin"
    )

    if (storedEmail) {
      setOrderEmail(storedEmail)
    }

    if (storedRedirect) {
      setActualRedirectPath(storedRedirect)
    }
  }, [])

  // ----- SIGN IN -----
  const [signinMessage, signinAction] = useActionState(login, null)
  const [showSignInPassword, setShowSignInPassword] = useState(false)
  const [failedAttempts, setFailedAttempts] = useState(0)
  const [isLockedOut, setIsLockedOut] = useState(false)
  const [delaySeconds, setDelaySeconds] = useState(0)
  const [isDelaying, setIsDelaying] = useState(false)
  const [showCaptcha, setShowCaptcha] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const recaptchaRef = React.useRef<HTMLDivElement>(null)
  const recaptchaWidgetId = React.useRef<number | null>(null)

  // Load Google reCAPTCHA v2 script
  useEffect(() => {
    // Check if script already exists
    const existingScript = document.querySelector('script[src*="google.com/recaptcha"]')
    if (existingScript) {
      return // Script already loaded
    }

    const script = document.createElement('script')
    script.src = 'https://www.google.com/recaptcha/api.js?render=explicit'
    script.async = true
    script.defer = true
    script.onerror = () => {
      console.error('Failed to load reCAPTCHA script')
    }
    
    document.body.appendChild(script)

    return () => {
      // Cleanup: remove script when component unmounts
      const scriptToRemove = document.querySelector('script[src*="google.com/recaptcha"]')
      if (scriptToRemove && scriptToRemove.parentNode) {
        scriptToRemove.parentNode.removeChild(scriptToRemove)
      }
    }
  }, [])

  // Render Google reCAPTCHA v2 widget when showCaptcha is true
  useEffect(() => {
    if (!showCaptcha) {
      // Cleanup when captcha is hidden
      if (recaptchaWidgetId.current !== null && window.grecaptcha) {
        try {
          if (recaptchaRef.current) {
            recaptchaRef.current.innerHTML = ''
          }
          recaptchaWidgetId.current = null
        } catch (e) {
          // Ignore errors
        }
      }
      setCaptchaToken(null)
      return
    }

    // Wait for DOM to be ready and reCAPTCHA script to load
    const renderWidget = () => {
      if (!recaptchaRef.current) return

      // Clear container first
      recaptchaRef.current.innerHTML = ''

      if (window.grecaptcha && window.grecaptcha.render) {
        const grecaptcha = window.grecaptcha
        
        // Render new widget
        const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LdcOz4sAAAAALhObDF_LXr0dea8zYCfFOoi3qX8';
        if (siteKey) {
          try {
            recaptchaWidgetId.current = grecaptcha.render(recaptchaRef.current, {
              sitekey: siteKey,
              callback: (token: string) => {
                console.log('reCAPTCHA token received')
                setCaptchaToken(token)
              },
              'expired-callback': () => {
                console.log('reCAPTCHA token expired')
                setCaptchaToken(null)
                // Reset widget when expired
                if (recaptchaWidgetId.current !== null && window.grecaptcha) {
                  window.grecaptcha.reset(recaptchaWidgetId.current)
                }
              },
              'error-callback': () => {
                console.error('reCAPTCHA error occurred')
                setCaptchaToken(null)
              },
              size: 'normal',
              theme: 'light',
            })
            console.log('reCAPTCHA widget rendered successfully')
          } catch (error) {
            console.error('Failed to render reCAPTCHA widget:', error)
            // Show user-friendly error
            if (recaptchaRef.current) {
              recaptchaRef.current.innerHTML = '<p class="text-red-600 text-sm font-din-arabic">reCAPTCHA failed to load. Please refresh the page.</p>'
            }
          }
        } else {
          console.warn('NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not set')
        }
      }
    }

    // Wait for grecaptcha to be ready
    const checkAndRender = () => {
      if (window.grecaptcha && typeof window.grecaptcha.render === 'function') {
        // Use ready callback if available
        if (window.grecaptcha.ready) {
          window.grecaptcha.ready(() => {
            setTimeout(renderWidget, 200)
          })
        } else {
          setTimeout(renderWidget, 200)
        }
      } else {
        // Retry after 200ms
        setTimeout(checkAndRender, 200)
      }
    }

    const timer = setTimeout(() => {
      checkAndRender()
    }, 1000)

    return () => {
      clearTimeout(timer)
      // Cleanup widget on unmount
      if (recaptchaWidgetId.current !== null && window.grecaptcha) {
        try {
          if (recaptchaRef.current) {
            recaptchaRef.current.innerHTML = ''
          }
          recaptchaWidgetId.current = null
        } catch (e) {
          // Ignore errors
        }
      }
    }
  }, [showCaptcha])

  // Load failed attempts from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("jardinBotanica_failedLoginAttempts")
    const attempts = stored ? parseInt(stored, 10) : 0
    setFailedAttempts(attempts)
    setIsLockedOut(attempts >= 10)
    setShowCaptcha(attempts >= 3)
  }, [])

  // Handle delay countdown
  useEffect(() => {
    if (delaySeconds > 0) {
      const timer = setTimeout(() => {
        setDelaySeconds(delaySeconds - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (isDelaying && delaySeconds === 0) {
      setIsDelaying(false)
    }
  }, [delaySeconds, isDelaying])

  useEffect(() => {
    // In the starter, a *truthy* message is usually an error string.
    // If your login action returns structured state, adjust accordingly.
    if (signinMessage === null) return
    
    if (signinMessage === "") {
      // Success - reset failed attempts
      localStorage.removeItem("jardinBotanica_failedLoginAttempts")
      setFailedAttempts(0)
      setIsLockedOut(false)
      setIsDelaying(false)
      setDelaySeconds(0)
      setShowCaptcha(false)
      setCaptchaToken(null)
      
      // Cleanup reCAPTCHA widget
      if (recaptchaWidgetId.current !== null && window.grecaptcha) {
        try {
          window.grecaptcha.reset(recaptchaWidgetId.current)
          recaptchaWidgetId.current = null
        } catch (e) {
          // Ignore errors
        }
      }
      
      // Clear session storage after successful login
      sessionStorage.removeItem("jardinBotanica_orderEmail")
      sessionStorage.removeItem("jardinBotanica_redirectAfterLogin")

      router.replace(actualRedirectPath)
      router.refresh()
    } else {
      // Failed login - increment attempts immediately
      const stored = localStorage.getItem("jardinBotanica_failedLoginAttempts")
      const currentAttempts = stored ? parseInt(stored, 10) : 0
      const newAttempts = currentAttempts + 1
      
      // Update localStorage immediately
      localStorage.setItem("jardinBotanica_failedLoginAttempts", newAttempts.toString())
      
      // Update state immediately
      setFailedAttempts(newAttempts)
      
      if (newAttempts >= 10) {
        setIsLockedOut(true)
        setShowCaptcha(false)
        setCaptchaToken(null)
      } else if (newAttempts >= 3) {
        // Show captcha after 3 failed attempts
        setShowCaptcha(true)
        setCaptchaToken(null) // Reset captcha token
        
        // Start 5-second delay
        const delay = 5
        setDelaySeconds(delay)
        setIsDelaying(true)
      }
    }
  }, [signinMessage, actualRedirectPath, router])

  // ----- SIGN UP -----
  const [signupMessage, signupAction] = useActionState(signup, null)
  const [showCreatePassword, setShowCreatePassword] = useState(false)
  const [createPassword, setCreatePassword] = useState("")
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [dateValue, setDateValue] = useState<Date | undefined>(undefined)

  useEffect(() => {
    if (signupMessage === null) return
    if (signupMessage === "") {
      // Clear session storage after successful signup
      sessionStorage.removeItem("jardinBotanica_orderEmail")
      sessionStorage.removeItem("jardinBotanica_redirectAfterLogin")

      router.replace(actualRedirectPath)
      router.refresh()
    }
  }, [signupMessage, actualRedirectPath, router])

  // ----- TAB STATE FOR MOBILE -----
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin")

  // Set initial tab based on URL parameter
  useEffect(() => {
    const tabParam = params.get("tab")
    if (tabParam === "signup") {
      setActiveTab("signup")
    } else if (tabParam === "signin") {
      setActiveTab("signin")
    }
  }, [params])

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

  const loginWithGoogle = async () => {
    const result = await sdk.auth.login("customer", "google", {})
    if (typeof result === "object" && result.location) {
      window.location.href = result.location
      return
    }

    if (typeof result !== "string") {
      alert("Authentication failed")
      return
    }

    const { customer } = await sdk.store.customer.retrieve()
    console.log(customer)
  }

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
            <div
              className="flex border-b border-black/20"
              style={{ borderColor: "#D8D2C7" }}
            >
              <button
                type="button"
                onClick={() => setActiveTab("signin")}
                className={`font-din-arabic flex-1 py-4 text-center transition-all duration-300 ${
                  activeTab === "signin"
                    ? "text-black border-b-2 border-black font-medium"
                    : "text-black/50"
                }`}
                style={{
                  borderBottomColor:
                    activeTab === "signin" ? "#000" : "transparent",
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
                  borderBottomColor:
                    activeTab === "signup" ? "#000" : "transparent",
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
              className={`p-8 lg:p-10 ${
                activeTab !== "signin" ? "hidden lg:block" : ""
              }`}
            >
              <h2 className="font-american-typewriter text-2xl mb-8 text-black text-center">
                Sign In
              </h2>

              {isLockedOut ? (
                <div className="space-y-5">
                  <div className="p-4 border border-rose-600 bg-rose-50 rounded">
                    <p className="font-din-arabic text-sm text-rose-600 text-center">
                      We can't sign you in right now. Reset your password to continue.
                    </p>
                  </div>
                  <a
                    href={`/${countryCode}/forgot-password`}
                    className="block"
                  >
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      type="button"
                      className="font-din-arabic w-full py-4 bg-black text-white hover:bg-black/90 transition-all duration-300 text-center"
                    >
                      Reset Password
                    </motion.button>
                  </a>
                </div>
              ) : (
                <form 
                  action={signinAction} 
                  className="space-y-5"
                  onSubmit={(e) => {
                    if (isDelaying || delaySeconds > 0 || (showCaptcha && !captchaToken)) {
                      e.preventDefault()
                      return false
                    }
                  }}
                >
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
                      defaultValue={orderEmail}
                      required
                      disabled={isDelaying || delaySeconds > 0 || (showCaptcha && !captchaToken)}
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
                        disabled={isDelaying || delaySeconds > 0 || (showCaptcha && !captchaToken)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignInPassword((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-black"
                        aria-label="Toggle password visibility"
                        disabled={isDelaying || delaySeconds > 0 || (showCaptcha && !captchaToken)}
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
                    {isDelaying && delaySeconds > 0 && (
                      <p className="mt-2 text-sm text-rose-600 font-din-arabic">
                        Please wait {delaySeconds} second{delaySeconds !== 1 ? 's' : ''} before trying again.
                      </p>
                    )}
                  </div>

                  {showCaptcha && (
                    <div className="mt-4 space-y-3">
                      <div className="border border-black/20 rounded p-4 bg-white/50">
                        <p className="font-din-arabic text-sm text-black/80 mb-3 text-center">
                          Security Verification Required
                        </p>
                        <div className="flex justify-center py-2">
                          <div ref={recaptchaRef} className="min-h-[78px] w-full flex justify-center"></div>
                        </div>
                      </div>
                      {captchaToken && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 bg-green-50 border border-green-200 rounded"
                        >
                          <p className="font-din-arabic text-sm text-green-700 text-center">
                            ✓ Verification complete! You can now sign in.
                          </p>
                        </motion.div>
                      )}
                      {!captchaToken && (
                        <p className="text-center font-din-arabic text-sm text-black/70">
                          Please complete the verification above to continue
                        </p>
                      )}
                    </div>
                  )}

                  <input type="hidden" name="g-recaptcha-response" value={captchaToken || ""} />

                  <div className="text-right">
                    {/* Optional: route this to your reset flow */}
                    <a
                      href={`/${countryCode}/forgot-password`}
                      className="font-din-arabic text-sm text-black/70 hover:text-black"
                    >
                      Forgot Your Password?
                    </a>
                  </div>

                  <motion.button
                    whileHover={!isDelaying && delaySeconds === 0 && (!showCaptcha || captchaToken) ? { scale: 1.01 } : {}}
                    whileTap={!isDelaying && delaySeconds === 0 && (!showCaptcha || captchaToken) ? { scale: 0.99 } : {}}
                    type="submit"
                    disabled={isDelaying || delaySeconds > 0 || (showCaptcha && !captchaToken)}
                    className="font-din-arabic w-full py-4 bg-black text-white hover:bg-black/90 transition-all duration-300 text-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDelaying && delaySeconds > 0 
                      ? `Please wait ${delaySeconds}s...` 
                      : showCaptcha && !captchaToken
                      ? 'Complete verification to continue'
                      : 'Sign In'}
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
                    {/* <button
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
                    </button> */}
                    <button
                      type="button"
                      className="font-din-arabic w-full flex items-center px-4 py-3.5 border bg-transparent text-black hover:bg-black/5 transition-all duration-300"
                      style={{ borderColor: "#D8D2C7" }}
                      onClick={loginWithGoogle}
                    >
                      <svg
                        className="w-5 h-5 mr-3 flex-shrink-0"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
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
              )}
            </motion.div>

            {/* Create Account */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`p-8 lg:p-10 ${
                activeTab !== "signup" ? "hidden lg:block" : ""
              }`}
            >
              <h2 className="font-american-typewriter text-2xl mb-8 text-black text-center">
                Create Account
              </h2>

              <form 
                action={signupAction} 
                className="space-y-5"
                onSubmit={(e) => {
                  if (createPassword.length < 15) {
                    e.preventDefault()
                    setPasswordError("Password must be at least 15 characters long")
                  } else {
                    setPasswordError(null)
                  }
                }}
              >
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
                    value={
                      dateValue ? dateValue.toISOString().split("T")[0] : ""
                    }
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
                    defaultValue={orderEmail}
                    required
                  />
                  {orderEmail && (
                    <p className="mt-2 text-sm text-black/60 font-din-arabic">
                      Using email from your recent order. Create an account to
                      view your order history.
                    </p>
                  )}
                </div>

                <div>
                  <label className="font-din-arabic block text-sm text-black mb-2 tracking-wide">
                    Password*
                  </label>
                  <div className="relative">
                    <input
                      type={showCreatePassword ? "text" : "password"}
                      name="password"
                      value={createPassword}
                      onChange={(e) => {
                        setCreatePassword(e.target.value)
                        if (passwordError && e.target.value.length >= 15) {
                          setPasswordError(null)
                        }
                      }}
                      onBlur={() => {
                        if (createPassword.length > 0 && createPassword.length < 15) {
                          setPasswordError("Password must be at least 15 characters long")
                        }
                      }}
                      autoComplete="new-password"
                      className="font-din-arabic w-full px-4 py-3.5 pr-12 border bg-transparent text-black placeholder-black/50 focus:outline-none focus:border-black transition-all duration-300"
                      style={{ borderColor: passwordError ? "#ef4444" : "#D8D2C7" }}
                      placeholder="Create a secure password (15+)"
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
                    {createPassword.length > 0 && (
                      <span className="absolute right-3 top-1/2 translate-y-2 font-din-arabic text-xs text-black/60">
                        {createPassword.length >= 15 ? (
                          <span className="text-green-600">15+ ✓</span>
                        ) : (
                          `${createPassword.length}/15`
                        )}
                      </span>
                    )}
                  </div>
                  {passwordError && (
                    <p className="mt-2 text-sm text-rose-600 font-din-arabic">
                      {passwordError}
                    </p>
                  )}
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
