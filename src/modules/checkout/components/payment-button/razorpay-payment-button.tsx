import { Button } from "@medusajs/ui"
import Spinner from "@modules/common/icons/spinner"
import React, { useCallback, useEffect, useState } from "react"
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay"
import { HttpTypes } from "@medusajs/types"
import { placeOrder } from "@lib/data/cart"
import { CurrencyCode } from "react-razorpay/dist/constants/currency"
import { useSearchParams } from "next/navigation"

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
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  )
  const { Razorpay } = useRazorpay()
  const [orderData, setOrderData] = useState({ razorpayOrder: { id: "" } })
  const searchParams = useSearchParams()

  // Get payment type from query params
  const paymentType = searchParams.get("paymenttype") || "card"

  console.log("session_data: " + JSON.stringify(session))

  const onPaymentCompleted = async () => {
    await placeOrder().catch(() => {
      setErrorMessage("An error occurred, please try again.")
      setSubmitting(false)
    })
  }

  useEffect(() => {
    setOrderData(session.data as { razorpayOrder: { id: string } })
  }, [session.data])

  // Map payment type to Razorpay method configuration
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
        // If no specific type, show all methods
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
      ...paymentMethodConfig, // Apply the payment method filter
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
        name:
          cart.billing_address?.first_name +
          " " +
          cart?.billing_address?.last_name,
        email: cart?.email,
        contact: cart?.shipping_address?.phone ?? undefined,
      },
    }

    console.log("Payment options:", JSON.stringify(options))
    console.log("Selected payment type:", paymentType)

    const razorpay = new Razorpay(options)
    if (orderData.razorpayOrder.id) razorpay.open()

    razorpay.on("payment.failed", function (response: any) {
      setErrorMessage(JSON.stringify(response.error))
    })

    razorpay.on("payment.authorized" as any, function (response: any) {
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
    paymentType, // Add paymentType to dependencies
  ])

  console.log("orderData: " + JSON.stringify(orderData))

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
          console.log(`Processing order id: ${orderData.razorpayOrder.id}`)
          console.log(`Using payment type: ${paymentType}`)
          setSubmitting(true)
          handlePayment()
        }}
      >
        {submitting ? <Spinner /> : "Checkout"}
      </Button>
      {errorMessage && (
        <div className="text-red-500 text-small-regular mt-2">
          {errorMessage}
        </div>
      )}
      {paymentType && (
        <div className="text-ui-fg-subtle text-xs mt-2">
          Payment method: {paymentType.toUpperCase()}
        </div>
      )}
    </>
  )
}
