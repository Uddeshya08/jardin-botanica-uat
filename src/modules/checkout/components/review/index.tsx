"use client"

import { paymentInfoMap } from "@lib/constants"
import { ArrowLeftMini } from "@medusajs/icons"
import { Button, clx, Heading, Text } from "@medusajs/ui"
import { ChevronLeft, CreditCard, Edit, MapPin, Shield } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import PaymentButton from "../payment-button"

// Payment type options - matching the ones in payment component
const PAYMENT_TYPES = [
  {
    id: "card",
    label: "Credit / Debit Card",
    description: "Visa, Mastercard, Amex, Rupay",
  },
  {
    id: "upi",
    label: "UPI",
    description: "Google Pay, PhonePe, Paytm & more",
  },
  {
    id: "netbanking",
    label: "Net Banking",
    description: "All major banks supported",
  },
  {
    id: "wallet",
    label: "Wallets",
    description: "Paytm, Mobikwik, Amazon Pay",
  },
  {
    id: "cod",
    label: "Cash on Delivery",
    description: "Pay when you receive",
  },
] as const

const Review = ({ cart }: { cart: any }) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "review"

  const paidByGiftcard = cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const previousStepsCompleted =
    cart.shipping_address &&
    cart.shipping_methods.length > 0 &&
    (cart.payment_collection || paidByGiftcard)

  const activeSession = cart.payment_collection?.payment_sessions?.find(
    (paymentSession: any) => paymentSession.status === "pending"
  )

  // Get payment type from URL or default to 'card'
  const paymentType = searchParams.get("paymenttype") || "card"
  const selectedPaymentType = PAYMENT_TYPES.find((pt) => pt.id === paymentType)

  const handleEditShipping = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("step", "address")
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleEditPayment = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("step", "payment")
    router.push(`${pathname}?${params.toString()}`)
  }

  const handlePrevious = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("step", "payment")
    router.push(`${pathname}?${params.toString()}`)
  }

  const formatAddress = () => {
    if (!cart?.shipping_address) return ""
    const addr = cart.shipping_address
    const parts = []

    if (addr.address_1) parts.push(addr.address_1)
    if (addr.company) parts.push(addr.company)
    if (addr.city) {
      const cityParts = [addr.city]
      if (addr.province) cityParts.push(addr.province)
      if (addr.postal_code) cityParts.push(`- ${addr.postal_code}`)
      parts.push(cityParts.join(", "))
    }

    return parts.join(", ")
  }

  const getPaymentMethodDisplay = () => {
    if (paidByGiftcard) {
      return "Gift Card"
    }
    // Use the selected payment type label if available
    if (selectedPaymentType) {
      return selectedPaymentType.label
    }
    // Fallback to provider title or default
    if (activeSession) {
      return paymentInfoMap[activeSession.provider_id]?.title || "Credit / Debit Card"
    }
    return "Credit / Debit Card"
  }

  return (
    <div>
      {isOpen && previousStepsCompleted && (
        <>
          <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 border border-white/80 shadow-xl">
            <div className="flex items-center space-x-3 mb-6 md:mb-8">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, rgba(4,120,87,0.2), rgba(4,120,87,0.1))",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-check w-6 h-6"
                  style={{ color: "rgb(4, 120, 87)" }}
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>

              <div>
                <h2 className="font-american-typewriter text-xl sm:text-2xl md:text-3xl tracking-wide">
                  Review Your Order
                </h2>

                <p className="font-din-arabic text-xs sm:text-sm text-black/60">
                  Verify Details Before Parcel Dispatch.
                </p>
              </div>
            </div>
            {/* Shipping Details Section */}
            {cart?.shipping_address && (
              <div className="p-6 mb-6 bg-white/50 rounded-2xl border border-black/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-black/70" />
                    <h3 className="font-din-arabic font-semibold text-base md:text-lg">
                      Shipping Details
                    </h3>
                  </div>
                  <button
                    onClick={handleEditShipping}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-white/80 hover:bg-white border border-black/10 hover:border-black/20 transition-all text-sm font-din-arabic text-black/60 hover:text-black"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                </div>

                <div className="space-y-2 font-din-arabic text-sm md:text-base text-black/80">
                  <p className="font-medium">
                    {cart.shipping_address.first_name} {cart.shipping_address.last_name}
                  </p>
                  <p className="text-black/70">{formatAddress()}</p>
                  {cart.shipping_address.phone && (
                    <p className="text-black/70">{cart.shipping_address.phone}</p>
                  )}
                  {cart.email && <p className="text-black/70">{cart.email}</p>}
                </div>
              </div>
            )}

            {/* Payment Method Section */}
            {(activeSession || paidByGiftcard) && (
              <div className="p-6 bg-white/50 rounded-2xl border border-black/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-5 h-5 text-black/70" />
                    <h3 className="font-din-arabic font-semibold text-base md:text-lg">
                      Payment Method
                    </h3>
                  </div>
                  <button
                    onClick={handleEditPayment}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-white/80 hover:bg-white border border-black/10 hover:border-black/20 transition-all text-sm font-din-arabic text-black/60 hover:text-black"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                </div>

                <div className="space-y-3">
                  <p className="font-din-arabic text-sm md:text-base text-black/80 font-medium">
                    {getPaymentMethodDisplay()}
                  </p>
                  <div className="flex items-center space-x-2 text-sm font-din-arabic text-black/60">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    <span>Payment will be processed securely via Razorpay</span>
                  </div>
                </div>
              </div>
            )}

            {/* Previous and Place Order Buttons */}
          </div>
          <div className="flex justify-between items-center gap-4 mt-6 mb-6">
            <button
              onClick={handlePrevious}
              className="px-6 py-3 bg-white/60 backdrop-blur-sm border-2 border-black/10 hover:border-black/20 rounded-xl font-din-arabic transition-all shadow-sm hover:shadow-md flex items-center space-x-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            <div className="flex-shrink-0">
              <div className="[&_button]:!w-auto [&_button]:!min-w-fit">
                <PaymentButton cart={cart} data-testid="submit-order-button" />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Review
