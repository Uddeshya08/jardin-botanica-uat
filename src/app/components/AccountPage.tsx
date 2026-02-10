"use client"

import { clsx } from "clsx"
import { login, signup } from "@lib/data/customer"
import { DatePicker } from "app/components/ui/date-picker"
import { Eye, EyeOff, Smartphone } from "lucide-react"
import { motion } from "motion/react"
import { useParams, useRouter } from "next/navigation"
import type React from "react"
import { useActionState, useEffect, useState } from "react"

export function AccountPage() {
  const router = useRouter()
  const routeParams = useParams()
  const countryCode = (routeParams?.countryCode as string) || "us"

  const [signinMessage, signinAction, isSigninPending] = useActionState(login, null)
  const [signupMessage, signupAction, isSignupPending] = useActionState(signup, null)

  const [showSignInPassword, setShowSignInPassword] = useState(false)
  const [showCreatePassword, setShowCreatePassword] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [createPassword, setCreatePassword] = useState("")
  const [currentView, setCurrentView] = useState<"sign-in" | "register">("sign-in")
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>()

  const handleCreateAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === "password") {
      setCreatePassword(value)
      if (passwordError && value.length >= 15) {
        setPasswordError(null)
      }
    }
  }

  const handleCreateAccountSubmit = (e: React.FormEvent) => {
    if (createPassword.length < 15) {
      e.preventDefault()
      setPasswordError("Password must be at least 15 characters long")
      return
    }
    setPasswordError(null)
  }

  useEffect(() => {
    if (signinMessage === null) return
    if (signinMessage === "" || signinMessage === undefined) {
      router.replace(`/${countryCode}/account`)
      router.refresh()
    }
  }, [countryCode, router, signinMessage])

  useEffect(() => {
    if (signupMessage === null) return
    if (typeof signupMessage !== "string") {
      router.replace(`/${countryCode}/account`)
      router.refresh()
    }
  }, [countryCode, router, signupMessage])

  return (
    <div className="min-h-screen pt-32 pb-12" style={{ backgroundColor: "#e3e3d8" }}>
      <div className="mx-auto px-6 lg:px-12">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Mobile Tabs */}
          <div className="lg:hidden col-span-1 flex w-full border-b border-black/10 mb-8">
            <button
              onClick={() => setCurrentView("sign-in")}
              className={clsx(
                "flex-1 pb-4 text-center font-din-arabic text-base tracking-widest transition-colors relative whitespace-nowrap",
                currentView === "sign-in" ? "text-black" : "text-black/40"
              )}
            >
              Sign In
              {currentView === "sign-in" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"
                />
              )}
            </button>
            <button
              onClick={() => setCurrentView("register")}
              className={clsx(
                "flex-1 pb-4 text-center font-din-arabic text-base tracking-widest transition-colors relative whitespace-nowrap",
                currentView === "register" ? "text-black" : "text-black/40"
              )}
            >
              Create Account
              {currentView === "register" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"
                />
              )}
            </button>
          </div>

          {/* Sign In Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className={clsx(
              "p-0 lg:p-10 w-full",
              currentView === "register" ? "hidden lg:block" : "block"
            )}
          >
            <h2 className="font-american-typewriter text-2xl mb-8 text-black text-center">
              Sign in
            </h2>

            <form action={signinAction} className="space-y-5 w-full">
              {/* Email Address */}
              <div>
                <label className="font-din-arabic block text-sm text-black mb-2 tracking-wide">
                  Email Address*
                </label>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  className="font-din-arabic w-full px-4 py-3.5 border border-[#D8D2C7] bg-[#EBEBE8] text-black placeholder-black/50 focus:outline-none focus:border-black transition-all duration-300"
                  style={{ borderColor: "#D8D2C7" }}
                  placeholder="Enter your email address"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="font-din-arabic block text-sm text-black mb-2 tracking-wide">
                  Password*
                </label>
                <div className="relative">
                  <input
                    type={showSignInPassword ? "text" : "password"}
                    name="password"
                    autoComplete="current-password"
                    className="font-din-arabic w-full px-4 py-3.5 pr-12 border border-[#D8D2C7] bg-[#EBEBE8] text-black placeholder-black/50 focus:outline-none focus:border-black transition-all duration-300"
                    style={{ borderColor: "#D8D2C7" }}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignInPassword(!showSignInPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black/40 hover:text-black transition-colors"
                  >
                    {showSignInPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {typeof signinMessage === "string" && (
                  <p className="mt-2 text-sm text-rose-600 font-din-arabic">{signinMessage}</p>
                )}
              </div>

              {/* Forgot password */}
              <div className="text-right">
                <button
                  type="button"
                  className="font-din-arabic text-sm text-black/70 hover:text-black transition-colors"
                >
                  Forgot your Password?
                </button>
              </div>

              {/* Sign In Button */}
              <motion.button
                whileHover={{ scale: isSigninPending ? 1 : 1.01 }}
                whileTap={{ scale: isSigninPending ? 1 : 0.99 }}
                type="submit"
                disabled={isSigninPending}
                className="font-din-arabic w-full py-4 bg-black text-white hover:bg-black/90 transition-all duration-300 text-center flex items-center justify-center gap-2"
              >
                {isSigninPending ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </motion.button>

              {/* Divider */}
              <div className="relative py-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-black/20"></div>
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

              {/* SSO Options */}
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="button"
                  className="font-din-arabic w-full flex items-center px-4 py-3.5 border bg-transparent text-black hover:bg-black/5 transition-all duration-300"
                  style={{ borderColor: '#D8D2C7' }}
                >
                  <svg className="w-5 h-5 mr-3 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  <span className="text-left">Continue with Apple</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="button"
                  className="font-din-arabic w-full flex items-center px-4 py-3.5 border bg-transparent text-black hover:bg-black/5 transition-all duration-300"
                  style={{ borderColor: "#D8D2C7" }}
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
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="button"
                  className="font-din-arabic w-full flex items-center px-4 py-3.5 border bg-transparent text-black hover:bg-black/5 transition-all duration-300"
                  style={{ borderColor: "#D8D2C7" }}
                >
                  <Smartphone className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span className="text-left">Continue with Phone</span>
                </motion.button>
              </div>
            </form>
          </motion.div>

          {/* Create Account Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={clsx(
              "p-0 lg:p-10 w-full",
              currentView === "sign-in" ? "hidden lg:block" : "block"
            )}
          >
            <h2 className="font-american-typewriter text-2xl mb-8 text-black text-center">
              Create account
            </h2>

            <form action={signupAction} onSubmit={handleCreateAccountSubmit} className="space-y-5 w-full">
              {/* First Name and Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-din-arabic block text-sm text-black mb-2 tracking-wide">
                    First Name*
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    autoComplete="given-name"
                    className="font-din-arabic w-full px-4 py-3.5 border border-[#D8D2C7] bg-[#EBEBE8] text-black placeholder-black/50 focus:outline-none focus:border-black transition-all duration-300"
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
                    className="font-din-arabic w-full px-4 py-3.5 border border-[#D8D2C7] bg-[#EBEBE8] text-black placeholder-black/50 focus:outline-none focus:border-black transition-all duration-300"
                    style={{ borderColor: "#D8D2C7" }}
                    placeholder="Last name"
                    required
                  />
                </div>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="font-din-arabic block text-sm text-black mb-2 tracking-wide whitespace-nowrap">
                  Date of Birth{" "}
                  <span className="normal-case text-xs text-black/70 ml-2">
                    — for birthday treats and quiet surprises.
                  </span>
                </label>
                <DatePicker
                  value={dateOfBirth}
                  onChange={setDateOfBirth}
                  placeholder="dd/mm/yyyy"
                  className="font-din-arabic w-full px-4 py-3.5 border border-[#D8D2C7] bg-[#EBEBE8] focus:outline-none focus:border-black transition-all duration-300"
                />
                <input
                  type="hidden"
                  name="dateOfBirth"
                  value={
                    dateOfBirth
                      ? `${dateOfBirth.getFullYear()}-${String(
                        dateOfBirth.getMonth() + 1
                      ).padStart(2, "0")}-${String(dateOfBirth.getDate()).padStart(2, "0")}`
                      : ""
                  }
                />
              </div>

              {/* Email */}
              <div>
                <label className="font-din-arabic block text-sm text-black mb-2 tracking-wide">
                  Email Address*
                </label>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  className="font-din-arabic w-full px-4 py-3.5 border border-[#D8D2C7] bg-[#EBEBE8] text-black placeholder-black/50 focus:outline-none focus:border-black transition-all duration-300"
                  style={{ borderColor: "#D8D2C7" }}
                  placeholder="Enter your email address"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="font-din-arabic block text-sm text-black mb-2 tracking-wide">
                  Password*
                </label>
                <div className="relative">
                  <input
                    type={showCreatePassword ? "text" : "password"}
                    name="password"
                    value={createPassword}
                    onChange={handleCreateAccountChange}
                    onBlur={() => {
                      if (createPassword.length > 0 && createPassword.length < 15) {
                        setPasswordError("Password must be at least 15 characters long")
                      }
                    }}
                    autoComplete="new-password"
                    className="font-din-arabic w-full px-4 py-3.5 pr-12 border border-[#D8D2C7] bg-[#EBEBE8] text-black placeholder-black/50 focus:outline-none focus:border-black transition-all duration-300"
                    style={{
                      borderColor: passwordError ? "#ef4444" : "#D8D2C7",
                    }}
                    placeholder="Create a secure password (15+)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCreatePassword(!showCreatePassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black/40 hover:text-black transition-colors"
                  >
                    {showCreatePassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {createPassword.length > 0 && (
                  <p className="mt-1 text-xs font-din-arabic text-black/60 text-right">
                    {createPassword.length >= 15 ? (
                      <span className="text-green-600">15+ ✓</span>
                    ) : (
                      `${createPassword.length}/15`
                    )}
                  </p>
                )}
                {passwordError && (
                  <p className="mt-2 text-sm text-rose-600 font-din-arabic">{passwordError}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="font-din-arabic block text-sm text-black mb-2 tracking-wide">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  onChange={handleCreateAccountChange}
                  className="font-din-arabic w-full px-4 py-3.5 border border-[#D8D2C7] bg-[#EBEBE8] text-black placeholder-black/50 focus:outline-none focus:border-black transition-all duration-300"
                  style={{ borderColor: "#D8D2C7" }}
                  placeholder="Enter your phone number"
                />
              </div>

              {typeof signupMessage === "string" && (
                <p className="text-sm text-rose-600 font-din-arabic">{signupMessage}</p>
              )}

              {/* Spacer to align with SSO buttons from left column */}
              <div className="pt-6">
                {/* Create Account Button */}
                <motion.button
                  whileHover={{ scale: isSignupPending ? 1 : 1.01 }}
                  whileTap={{ scale: isSignupPending ? 1 : 0.99 }}
                  type="submit"
                  disabled={isSignupPending}
                  className="font-din-arabic w-full py-4 bg-black text-white hover:bg-black/90 transition-all duration-300 text-center flex items-center justify-center gap-2"
                >
                  {isSignupPending ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating account...
                    </>
                  ) : (
                    "Create account"
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
