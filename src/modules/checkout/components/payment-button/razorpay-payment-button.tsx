"use client"

import { placeOrder, updateCart } from "@lib/data/cart"
import { getRazorpayKeyId } from "@lib/data/payment"
import { normalizeCheckoutPhone } from "@lib/util/checkout-phone"
import type { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import { useGiftContextSafe } from "app/context/gift-context"
import { Lock, Sparkles } from "lucide-react"
import { useSearchParams } from "next/navigation"
import React, { useCallback, useEffect, useState } from "react"
import { type RazorpayOrderOptions, useRazorpay } from "react-razorpay"
import type { CurrencyCode } from "react-razorpay/dist/constants/currency"
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
  const [orderData, setOrderData] = useState<{
    razorpayOrder: { id: string; amount: number; currency: string }
  }>({ razorpayOrder: { id: "", amount: 0, currency: "" } })

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
    setOrderData(session.data as {
      razorpayOrder: { id: string; amount: number; currency: string }
    })
  }, [session.data])

  // Map payment type to Razorpay config
  const getPaymentMethodConfig = (type: string) => {
    switch (type) {
      case "upi":
        return {
          method: {
            upi: true,
            card: false,
            netbanking: false,
            wallet: false,
            emi: false,
            paylater: false,
          },
        }
      case "card":
        return {
          method: {
            card: true,
            upi: false,
            netbanking: false,
            wallet: false,
            emi: false,
            paylater: false,
          },
        }
      case "netbanking":
        return {
          method: {
            netbanking: true,
            card: false,
            upi: false,
            wallet: false,
            emi: false,
            paylater: false,
          },
        }
      default:
        return {}
    }
  }

  const giftContext = useGiftContextSafe()

  const handlePayment = useCallback(async () => {
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
    const onPaymentCancelled = async () => {
      setErrorMessage("Payment Cancelled")
      setSubmitting(false)
    }

    const paymentMethodConfig = getPaymentMethodConfig(paymentType)

    const razorpayOrder = orderData.razorpayOrder
    if (!razorpayOrder?.id || !Number.isFinite(Number(razorpayOrder.amount)) || Number(razorpayOrder.amount) <= 0) {
      setErrorMessage("Payment details are unavailable. Please refresh checkout and try again.")
      setSubmitting(false)
      return
    }

    let keyId: string
    try {
      keyId = await getRazorpayKeyId()
    } catch {
      setErrorMessage("Payment is temporarily unavailable. Please try again shortly.")
      setSubmitting(false)
      return
    }

    const options: RazorpayOrderOptions = {
      key: keyId,
      amount: Number(razorpayOrder.amount),
      order_id: orderData.razorpayOrder.id,
      currency: razorpayOrder.currency as CurrencyCode,
      name: "Jardin Botanica",
      description: `Order number ${orderData.razorpayOrder.id}`,
      remember_customer: true,
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
        email: cart.email?.trim() || undefined,
        contact: normalizeCheckoutPhone(cart.shipping_address?.phone || ""),
      },
    }

    const razorpay = new Razorpay(options)
    if (orderData.razorpayOrder.id) razorpay.open()

    razorpay.on("payment.failed", (response: any) => {
      setErrorMessage(JSON.stringify(response.error))
      setSubmitting(false)
    })
  }, [
    Razorpay,
    cart.billing_address?.first_name,
    cart.billing_address?.last_name,
    cart?.email,
    cart?.shipping_address?.phone,
    orderData.razorpayOrder.id,
    orderData.razorpayOrder.amount,
    orderData.razorpayOrder.currency,
    paymentType,
    giftContext,
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
        <span>{submitting ? "Processing..." : "Place order"}</span>
        <Sparkles className="w-5 h-5" />
      </Button>
      <ErrorMessage error={errorMessage} data-testid="razorpay-payment-error-message" />
    </>
  )
}
