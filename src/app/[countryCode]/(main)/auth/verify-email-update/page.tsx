"use client"

import { motion } from "motion/react"
import React, { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { verifyEmailAndSetPassword } from "@lib/data/customer"
import { Eye, EyeOff, CheckCircle2, AlertTriangle } from "lucide-react"
import { Input, Label } from "@medusajs/ui"

const VerifyEmailUpdate = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [success, setSuccess] = useState(false)

  const isPasswordValid = newPassword.length >= 8

  useEffect(() => {
    const tokenParam = searchParams?.get("token")
    if (tokenParam) {
      setToken(tokenParam)
    } else {
      toast.error("Invalid verification link")
      setTimeout(() => router.push("/account"), 2000)
    }
  }, [searchParams, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token) {
      toast.error("Invalid verification link")
      return
    }

    if (!newPassword) {
      toast.error("Please enter a new password")
      return
    }

    if (!isPasswordValid) {
      toast.error("Password must be at least 8 characters")
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    setLoading(true)

    try {
      const result = await verifyEmailAndSetPassword({
        token,
        new_password: newPassword,
      })

      if (result.success) {
        setSuccess(true)
        toast.success(
          `Email updated to ${result.new_email}. Please log in with your new credentials.`,
          { duration: 5000 }
        )
        setTimeout(() => router.push("/account"), 3000)
      } else {
        toast.error(result.message || "Verification failed")
      }
    } catch (error: any) {
      toast.error(error?.message || "An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: "#e3e3d8" }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div
            className="bg-white/50 backdrop-blur-sm p-8 rounded-lg shadow-lg border"
            style={{ borderColor: "#D8D2C7" }}
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4"
              >
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </motion.div>
              <h1 className="font-american-typewriter text-2xl mb-2 text-black">
                Success!
              </h1>
              <p className="font-din-arabic text-black/60 tracking-wide">
                Your email and password have been updated successfully.
                Redirecting to login...
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "#e3e3d8" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div
          className="bg-white/50 backdrop-blur-sm p-8 rounded-lg shadow-lg border"
          style={{ borderColor: "#D8D2C7" }}
        >
          <h1 className="font-american-typewriter text-2xl lg:text-3xl mb-2 text-black">
            Set New Password
          </h1>
          <p className="font-din-arabic text-sm text-black/60 tracking-wide mb-8">
            Create a strong password for your new email address
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label className="font-din-arabic text-sm text-black/60 tracking-wide">
                New Password
              </Label>
              <div className="relative mt-2">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-transparent border font-din-arabic tracking-wide transition-all duration-200 focus:ring-2 focus:ring-black/10 pr-10"
                  style={{ borderColor: "#D8D2C7" }}
                  placeholder="Enter new password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-black/60 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Password length indicator */}
              {newPassword && (
                <p
                  className={`font-din-arabic text-xs mt-2 tracking-wide ${
                    isPasswordValid ? "text-green-600" : "text-black/40"
                  }`}
                >
                  {isPasswordValid ? "✓" : "○"} Password must be at least 8
                  characters
                </p>
              )}
            </div>

            <div>
              <Label className="font-din-arabic text-sm text-black/60 tracking-wide">
                Confirm New Password
              </Label>
              <div className="relative mt-2">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-transparent border font-din-arabic tracking-wide transition-all duration-200 focus:ring-2 focus:ring-black/10 pr-10"
                  style={{ borderColor: "#D8D2C7" }}
                  placeholder="Confirm new password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-black/60 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="font-din-arabic text-xs text-red-600 mt-2 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Passwords do not match
                </p>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={
                loading ||
                !newPassword ||
                !confirmPassword ||
                !isPasswordValid ||
                newPassword !== confirmPassword
              }
              className="w-full px-6 py-4 border text-black font-din-arabic tracking-wide hover:bg-black hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ borderColor: "#D8D2C7" }}
            >
              {loading ? "Updating..." : "Update Email & Password"}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => router.push("/account")}
              className="font-din-arabic text-sm text-black/60 hover:text-black underline transition-colors"
            >
              Back to Account
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default VerifyEmailUpdate
