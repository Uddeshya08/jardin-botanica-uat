"use client"

import { Leaf, Package, Truck } from "lucide-react"
import { motion } from "motion/react"
import { useParams, useRouter } from "next/navigation"
import React from "react"

interface OrderConfirmationUIProps {
  orderNumber: string
  isAuthenticated: boolean
  orderEmail?: string
  onContinueShopping?: () => void
  onViewOrders?: () => void
}

export function OrderConfirmationUI({
  orderNumber,
  isAuthenticated,
  orderEmail,
  onContinueShopping,
  onViewOrders,
}: OrderConfirmationUIProps) {
  const router = useRouter()
  const params = useParams()
  const countryCode = (params?.countryCode as string) || "us"

  const handleContinueShopping = () => {
    if (onContinueShopping) {
      onContinueShopping()
    } else {
      router.push(`/${countryCode}`)
    }
  }

  const handleViewOrders = () => {
    if (onViewOrders) {
      onViewOrders()
    } else {
      if (isAuthenticated) {
        // User is logged in, redirect to orders page
        router.push(`/${countryCode}/account/orders`)
      } else {
        // User is not logged in, redirect to account page (login/register)
        // Store the order email in session storage to help with account creation
        if (orderEmail) {
          sessionStorage.setItem("jardinBotanica_orderEmail", orderEmail)
          sessionStorage.setItem(
            "jardinBotanica_redirectAfterLogin",
            `/${countryCode}/account/orders`
          )
        }
        router.push(`/${countryCode}/account`)
      }
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-start px-4 py-8 relative overflow-hidden"
      style={{ backgroundColor: "#e3e3d8" }}
    >
      {/* Decorative Background Elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.06, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div className="w-[800px] h-[800px] rounded-full border-2 border-black/10" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 0.04, scale: 1 }}
        transition={{ duration: 2.5, ease: "easeOut", delay: 0.2 }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div className="w-[600px] h-[600px] rounded-full border-2 border-black/10" />
      </motion.div>

      {/* Right Side Image */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
        className="hidden lg:block absolute right-0 top-0 bottom-0 w-[45%] pointer-events-none"
      >
        <div className="relative h-full">
          <div
            className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent"
            style={{
              backgroundImage: `linear-gradient(to left, rgba(227, 227, 216, 0) 0%, rgba(227, 227, 216, 0.1) 50%, rgba(227, 227, 216, 1) 100%)`,
            }}
          />
          <img
            src="https://images.unsplash.com/photo-1659431246416-d7cd144f03a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXNoJTIwZ3JlZW5ob3VzZSUyMGZlcm5zJTIwcGxhbnRzfGVufDF8fHx8MTc2NDE3NjA3NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Botanical greenhouse"
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-2xl w-full relative z-10 ml-0 sm:ml-12 md:ml-24"
      >
        {/* Order Confirmed Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-6"
        >
          <h1
            className="font-american-typewriter text-3xl sm:text-4xl mb-4 text-black"
            style={{ letterSpacing: "0.05em" }}
          >
            Order Confirmed
          </h1>
          <motion.div
            className="flex items-center gap-5"
            initial={{ width: 0 }}
            animate={{ width: "auto" }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <motion.div
              className="h-px bg-black/20 w-32"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              style={{ transformOrigin: "left" }}
            />
            <Leaf className="w-4 h-4" style={{ color: "#e58a4d" }} />
            <motion.div
              className="h-px bg-black/20 w-32"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              style={{ transformOrigin: "left" }}
            />
          </motion.div>
        </motion.div>

        {/* Order Number Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex mb-10"
        >
          <motion.div
            className="relative px-5 py-2.5"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 bg-black/5 backdrop-blur-sm rounded-sm border border-black/10" />
            <span
              className="relative font-american-typewriter text-lg text-black"
              style={{ letterSpacing: "0.15em" }}
            >
              {orderNumber}
            </span>
          </motion.div>
        </motion.div>

        {/* Confirmation Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="font-din-arabic text-sm sm:text-base text-black/70 mb-10 leading-relaxed"
          style={{
            letterSpacing: "0.1em",
            maxWidth: "1100px",
            fontSize: "16px",
          }}
        >
          <span style={{ whiteSpace: "nowrap" }}>
            Your order is being prepared with quiet care and intention. A full summary has been
          </span>{" "}
          <br />
          sent to your inbox.
        </motion.p>

        {/* Delivery Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-8">
            {/* Dispatch */}
            <motion.div
              className="flex items-start gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <div
                className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center border transition-colors duration-300"
                style={{
                  borderColor: "#e58a4d",
                  backgroundColor: "rgba(229, 138, 77, 0.1)",
                }}
              >
                <Package className="w-3 h-3" style={{ color: "#e58a4d" }} />
              </div>
              <div className="flex flex-col gap-1">
                <span
                  className="font-american-typewriter text-base text-black"
                  style={{ letterSpacing: "0.05em", fontSize: "14px" }}
                >
                  Dispatch
                </span>
                <span
                  className="font-din-arabic text-sm text-black/60"
                  style={{ letterSpacing: "0.1em" }}
                >
                  1–2 days
                </span>
              </div>
            </motion.div>

            {/* Delivery */}
            <motion.div
              className="flex items-start gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <div
                className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center border transition-colors duration-300"
                style={{
                  borderColor: "#e58a4d",
                  backgroundColor: "rgba(229, 138, 77, 0.1)",
                }}
              >
                <Truck className="w-3 h-3" style={{ color: "#e58a4d" }} />
              </div>
              <div className="flex flex-col gap-1">
                <span
                  className="font-american-typewriter text-base text-black"
                  style={{ letterSpacing: "0.05em", fontSize: "14px" }}
                >
                  Delivery
                </span>
                <div className="flex flex-col gap-0.5">
                  <span
                    className="font-din-arabic text-sm text-black/60"
                    style={{ letterSpacing: "0.1em" }}
                  >
                    2–3 days (expedited)
                  </span>
                  <span
                    className="font-din-arabic text-sm text-black/60"
                    style={{ letterSpacing: "0.1em" }}
                  >
                    3–5 days (standard)
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Notification Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="font-din-arabic text-sm sm:text-base text-black/70 mb-12 leading-relaxed max-w-xl"
          style={{ letterSpacing: "0.1em", fontSize: "16px" }}
        >
          We'll notify you the moment your parcel leaves the studio.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-6"
        >
          <motion.button
            onClick={handleContinueShopping}
            className="px-8 py-4 bg-black font-din-arabic tracking-wide text-white hover:bg-black/80 transition-all duration-300 shadow-sm hover:shadow-md text-center w-full sm:w-auto"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Continue shopping
          </motion.button>

          <motion.button
            onClick={handleViewOrders}
            className="font-din-arabic text-sm text-black/60 hover:!text-black transition-colors duration-300"
            style={{ letterSpacing: "0.1em", fontSize: "14px" }}
            whileHover={{ x: 4 }}
          >
            View Orders →
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  )
}
