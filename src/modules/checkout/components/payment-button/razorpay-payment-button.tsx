"use client"

import { Button } from "@medusajs/ui"
import React, { useCallback, useEffect, useState } from "react"
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay"
import { HttpTypes } from "@medusajs/types"
import { placeOrder } from "@lib/data/cart"
import { CurrencyCode } from "react-razorpay/dist/constants/currency"
import { useSearchParams } from "next/navigation"
import { Lock, Sparkles } from "lucide-react"
import ErrorMessage from "../error-message"

export const RazorpayPaymentButton = ({
  session,
  notReady,
  cart,
  "data-testid": dataTestId,
}: {
  session: HttpTypes.StorePaymentSession
  notReady: boolean
  cart: HttpTypes.StoreCart
  "data-testid"?: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
  const { Razorpay } = useRazorpay()
  const [orderData, setOrderData] = useState({ razorpayOrder: { id: "" } })

  // Payment type param
  const searchParams = useSearchParams()
  const paymentType = searchParams.get("paymenttype") || "card"

  const onPaymentCompleted = async () => {
    await placeOrder().catch(() => {
      setErrorMessage("An error occurred, please try again.")
      setSubmitting(false)
    })
  }

  useEffect(() => {
    setOrderData(session.data as { razorpayOrder: { id: string } })
  }, [session.data])

  // Map payment type to Razorpay config
  const getPaymentMethodConfig = (type: string) => {
    switch (type) {
      case "upi":
        return {
          method: { upi: true, card: false, netbanking: false, wallet: false, emi: false, paylater: false },
        }
      case "card":
        return {
          method: { card: true, upi: false, netbanking: false, wallet: false, emi: false, paylater: false },
        }
      case "netbanking":
        return {
          method: { netbanking: true, card: false, upi: false, wallet: false, emi: false, paylater: false },
        }
      default:
        return {}
    }
  }

  const handlePayment = useCallback(async () => {
    const onPaymentCancelled = async () => {
      setErrorMessage("Payment Cancelled")
      setSubmitting(false)
    }

    const paymentMethodConfig = getPaymentMethodConfig(paymentType)

    const options: RazorpayOrderOptions = {
      key: "rzp_test_KZp3v4sgtPHTJI",
      callback_url: `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/razorpay/hooks`,
      amount: session.amount * 100 * 100,
      order_id: orderData.razorpayOrder.id,
      currency: cart.currency_code.toUpperCase() as CurrencyCode,
      name: process.env.COMPANY_NAME ?? "your company name",
      description: `Order number ${orderData.razorpayOrder.id}`,
      remember_customer: true,
      image: "https://example.com/your_logo",
      ...paymentMethodConfig,
      modal: {
        backdropclose: true,
        escape: true,
        handleback: true,
        confirm_close: true,
        ondismiss: async () => {
          setSubmitting(false)
          setErrorMessage("Payment cancelled")
          await onPaymentCancelled()
        },
        animation: true,
      },
      handler: async () => {
        onPaymentCompleted()
      },
      prefill: {
        name: `${cart.billing_address?.first_name} ${cart.billing_address?.last_name}`,
        email: cart?.email,
        contact: cart?.shipping_address?.phone ?? undefined,
      },
    }

    const razorpay = new Razorpay(options)
    if (orderData.razorpayOrder.id) razorpay.open()

    razorpay.on("payment.failed", (response: any) => {
      setErrorMessage(JSON.stringify(response.error))
    })

    razorpay.on("payment.authorized" as any, () => {
      placeOrder().then((authorizedCart) => {
        console.log("authorized:", authorizedCart)
      })
    })
  }, [
    Razorpay,
    cart.billing_address?.first_name,
    cart.billing_address?.last_name,
    cart.currency_code,
    cart?.email,
    cart?.shipping_address?.phone,
    orderData.razorpayOrder.id,
    session.amount,
    paymentType,
  ])

  return (
    <>
      <Button
        disabled={
          submitting ||
          notReady ||
          !orderData?.razorpayOrder?.id ||
          orderData?.razorpayOrder?.id === ""
        }
        onClick={() => {
          setSubmitting(true)
          handlePayment()
        }}
        className="w-full px-8 py-4 bg-black text-white rounded-xl font-din-arabic disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl hover:shadow-2xl flex items-center justify-center space-x-3"
        data-testid={dataTestId}
      >
        <Lock className="w-5 h-5" />
        <span>{submitting ? "Processing..." : "Place Order"}</span>
        <Sparkles className="w-5 h-5" />
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="razorpay-payment-error-message"
      />
    </>
  )
}
