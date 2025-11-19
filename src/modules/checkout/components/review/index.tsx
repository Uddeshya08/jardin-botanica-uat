"use client"

import { ArrowLeftMini } from "@medusajs/icons"
import { Button, Heading, Text, clx } from "@medusajs/ui"

import PaymentButton from "../payment-button"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

const Review = ({ cart }: { cart: any }) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "review"

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const previousStepsCompleted =
    cart.shipping_address &&
    cart.shipping_methods.length > 0 &&
    (cart.payment_collection || paidByGiftcard)

  return (
    <div>
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

      {isOpen && previousStepsCompleted && (
        <>
          <PaymentButton cart={cart} data-testid="submit-order-button" />
        </>
      )}
    </div>
  )
}

export default Review
