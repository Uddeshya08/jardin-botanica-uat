"use client"

import { Button } from "@medusajs/ui"
import Spinner from "@modules/common/icons/spinner"
import React, { useCallback, useEffect, useState } from "react"
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay"
import { HttpTypes } from "@medusajs/types"
import { placeOrder } from "@lib/data/cart"
import { CurrencyCode } from "react-razorpay/dist/constants/currency"
import { useRouter, usePathname, useSearchParams } from "next/navigation"

export const RazorpayPaymentButton = ({
  session,
  notReady,
  cart,
}: {
  session: HttpTypes.StorePaymentSession
  notReady: boolean
  cart: HttpTypes.StoreCart
}) => {
  const [disabled, setDisabled] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
  const { Razorpay } = useRazorpay()
  const [orderData, setOrderData] = useState({ razorpayOrder: { id: "" } })

  // Navigation
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Payment type param
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
      <div className="p-6 bg-white/50 rounded-2xl border border-black/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-din-arabic-bold flex items-center space-x-2">
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
              className="lucide lucide-credit-card w-4 h-4"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <line x1="2" x2="22" y1="10" y2="10" />
            </svg>
            <span>Payment Method</span>
          </h3>

          <button className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-black/10 text-black/60 hover:text-black hover:bg-black/5 transition-all">
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
              className="lucide lucide-square-pen w-4 h-4"
              onClick={() => {
                const params = new URLSearchParams(searchParams)
                params.set("step", "payment")
                router.push(`${pathname}?${params.toString()}`, { scroll: false })
              }}
            >
              <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
            </svg>
            <span className="font-din-arabic text-xs">Edit</span>
          </button>
        </div>

        {errorMessage && (
          <div className="text-red-500 text-small-regular mt-2">{errorMessage}</div>
        )}

        {paymentType && (
          <div className="font-din-arabic text-xs text-black/60">{paymentType.toUpperCase()}</div>
        )}

        <p className="font-din-arabic text-xs text-black/60 flex items-center space-x-1.5 mt-3">
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
            className="lucide lucide-shield w-3.5 h-3.5"
            style={{ color: "rgb(4, 120, 87)" }}
          >
            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
          </svg>
          <span>Payment will be processed securely via Razorpay</span>
        </p>
      </div>

      {/* ✅ Previous Button */}
      <div className="flex justify-between items-center mt-6 mb-2">
        <button
          onClick={() => {
            const params = new URLSearchParams(searchParams)
            params.set("step", "payment")
            router.push(`${pathname}?${params.toString()}`, { scroll: false })
          }}
          className="px-8 py-3 bg-white/60 backdrop-blur-sm border-2 border-black/10 hover:border-black/20 rounded-xl font-din-arabic transition-all shadow-sm hover:shadow-md flex items-center space-x-2"
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
            className="w-4 h-4"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          <span>Previous</span>
        </button>
        {/* PLACE ORDER BUTTON */}
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
          className="mt-4 ml-auto px-8 py-4 bg-gradient-to-r from-black to-gray-800 text-white rounded-xl font-din-arabic disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl hover:shadow-2xl flex items-center space-x-3"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock w-5 h-5"><rect width="18" height="11" x="3" y="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>

          {submitting ? <Spinner /> : "Place Order"}

          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles w-5 h-5"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" /><path d="M20 3v4"></path><path d="M22 5h-4"></path><path d="M4 17v2"></path><path d="M5 18H3"></path></svg>
        </Button>
      </div>
    </>
  )
}
