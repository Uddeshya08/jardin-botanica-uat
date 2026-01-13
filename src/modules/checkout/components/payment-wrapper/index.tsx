"use client"

import { isStripe } from "@lib/constants"
import type { HttpTypes } from "@medusajs/types"
import { loadStripe } from "@stripe/stripe-js"
import type React from "react"
import StripeWrapper from "./stripe-wrapper"

type PaymentWrapperProps = {
  cart: HttpTypes.StoreCart
  children: React.ReactNode
}

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_KEY
const stripePromise = stripeKey ? loadStripe(stripeKey) : null

const PaymentWrapper: React.FC<PaymentWrapperProps> = ({ cart, children }) => {
  const paymentSession = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  )

  if (isStripe(paymentSession?.provider_id) && paymentSession && stripePromise) {
    return (
      <StripeWrapper
        paymentSession={paymentSession}
        stripeKey={stripeKey}
        stripePromise={stripePromise}
      >
        {children}
      </StripeWrapper>
    )
  }

  return <div className="lg:col-span-2 space-y-4 lg:space-y-6">{children}</div>
}

export default PaymentWrapper
