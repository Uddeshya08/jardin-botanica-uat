"use client"

import { isManual, isRazorpay, isStripe } from "@lib/constants"
import { placeOrder } from "@lib/data/cart"
import type { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import { useElements, useStripe } from "@stripe/react-stripe-js"
import { Lock, Sparkles } from "lucide-react"
import type React from "react"
import { useState } from "react"
import ErrorMessage from "../error-message"
import { RazorpayPaymentButton } from "./razorpay-payment-button"
import { useGiftContextSafe } from "app/context/gift-context"
import { updateCart } from "@lib/data/cart"

type PaymentButtonProps = {
  cart: HttpTypes.StoreCart
  "data-testid": string
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ cart, "data-testid": dataTestId }) => {
  const notReady =
    !cart ||
    !cart.shipping_address ||
    !cart.billing_address ||
    !cart.email ||
    (cart.shipping_methods?.length ?? 0) < 1

  const paymentSession = cart.payment_collection?.payment_sessions?.[0]

  switch (true) {
    case isStripe(paymentSession?.provider_id):
      return <StripePaymentButton notReady={notReady} cart={cart} data-testid={dataTestId} />
    case isRazorpay(paymentSession?.provider_id):
      if (!paymentSession) {
        return (
          <Button
            disabled
            className="w-full px-8 py-4 bg-black text-white rounded-xl font-din-arabic disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl flex items-center justify-center space-x-3"
          >
            <Lock className="w-5 h-5" />
            <span>Select a payment method</span>
          </Button>
        )
      }
      return (
        <RazorpayPaymentButton
          session={paymentSession}
          notReady={notReady}
          cart={cart}
          data-testid={dataTestId}
        />
      )
    case isManual(paymentSession?.provider_id):
      return <ManualTestPaymentButton notReady={notReady} data-testid={dataTestId} />
    default:
      return (
        <Button
          disabled
          className="w-full px-8 py-4 bg-black text-white rounded-xl font-din-arabic disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl flex items-center justify-center space-x-3"
        >
          <Lock className="w-5 h-5" />
          <span>Select a payment method</span>
        </Button>
      )
  }
}

const StripePaymentButton = ({
  cart,
  notReady,
  "data-testid": dataTestId,
}: {
  cart: HttpTypes.StoreCart
  notReady: boolean
  "data-testid"?: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    await placeOrder()
      .catch((err) => {
        setErrorMessage(err.message)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const stripe = useStripe()
  const elements = useElements()
  const card = elements?.getElement("card")

  const session = cart.payment_collection?.payment_sessions?.find((s) => s.status === "pending")

  const disabled = !stripe || !elements ? true : false

  const giftContext = useGiftContextSafe()

  const handlePayment = async () => {
    setSubmitting(true)

    // Sync gift data if present
    if (giftContext) {
      const giftData = giftContext.giftQuantities
      if (Object.keys(giftData).length > 0) {
        try {
          await updateCart({ metadata: { gift_items: giftData } })
        } catch (e) {
          console.error("Failed to sync gift data", e)
          // Continue anyway or block? Continuing for now.
        }
      }
    }

    if (!stripe || !elements || !card || !cart) {
      setSubmitting(false)
      return
    }

    await stripe
      .confirmCardPayment(session?.data.client_secret as string, {
        payment_method: {
          card: card,
          billing_details: {
            name: cart.billing_address?.first_name + " " + cart.billing_address?.last_name,
            address: {
              city: cart.billing_address?.city ?? undefined,
              country: cart.billing_address?.country_code ?? undefined,
              line1: cart.billing_address?.address_1 ?? undefined,
              line2: cart.billing_address?.address_2 ?? undefined,
              postal_code: cart.billing_address?.postal_code ?? undefined,
              state: cart.billing_address?.province ?? undefined,
            },
            email: cart.email,
            phone: cart.billing_address?.phone ?? undefined,
          },
        },
      })
      .then(({ error, paymentIntent }) => {
        if (error) {
          const pi = error.payment_intent

          if ((pi && pi.status === "requires_capture") || (pi && pi.status === "succeeded")) {
            onPaymentCompleted()
          }

          setErrorMessage(error.message || null)
          return
        }

        if (
          (paymentIntent && paymentIntent.status === "requires_capture") ||
          paymentIntent.status === "succeeded"
        ) {
          return onPaymentCompleted()
        }

        return
      })
  }

  return (
    <>
      <Button
        disabled={disabled || notReady}
        onClick={handlePayment}
        size="large"
        isLoading={submitting}
        data-testid={dataTestId}
        className="w-full px-8 py-4 bg-black text-white rounded-xl font-din-arabic disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl hover:shadow-2xl flex items-center justify-center space-x-3"
      >
        <Lock className="w-5 h-5" />
        <span>{submitting ? "Processing..." : "Place Order"}</span>
        <Sparkles className="w-5 h-5" />
      </Button>
      <ErrorMessage error={errorMessage} data-testid="stripe-payment-error-message" />
    </>
  )
}

const ManualTestPaymentButton = ({
  notReady,
  "data-testid": dataTestId,
}: {
  notReady: boolean
  "data-testid"?: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    await placeOrder()
      .catch((err) => {
        setErrorMessage(err.message)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const giftContext = useGiftContextSafe()

  const handlePayment = async () => {
    setSubmitting(true)

    // Sync gift data if present
    if (giftContext) {
      const giftData = giftContext.giftQuantities
      if (Object.keys(giftData).length > 0) {
        try {
          await updateCart({ metadata: { gift_items: giftData } })
        } catch (e) {
          console.error("Failed to sync gift data", e)
        }
      }
    }

    onPaymentCompleted()
  }

  return (
    <>
      <Button
        className="w-full px-8 py-4 bg-black text-white rounded-xl font-din-arabic disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl hover:shadow-2xl flex items-center justify-center space-x-3"
        disabled={notReady}
        isLoading={submitting}
        onClick={handlePayment}
        size="large"
        data-testid={dataTestId || "submit-order-button"}
      >
        <Lock className="w-5 h-5" />
        <span>{submitting ? "Processing..." : "Place Order"}</span>
        <Sparkles className="w-5 h-5" />
      </Button>
      <ErrorMessage error={errorMessage} data-testid="manual-payment-error-message" />
    </>
  )
}

export default PaymentButton
