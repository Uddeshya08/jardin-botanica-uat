"use client"
import { useEffect } from "react"
import { getMetaCheckoutEvent } from "@lib/util/meta-event-data"
import { trackMetaFunnelEvent } from "@lib/util/meta-pixel"
import { trackGoogleEvent } from "@lib/util/google-events"
import { buildGoogleCartEvent } from "@lib/util/google-event-data"
import type { HttpTypes } from "@medusajs/types"
import Addresses from "@modules/checkout/components/addresses"
import Payment from "@modules/checkout/components/payment"
import Review from "@modules/checkout/components/review"
import Shipping from "@modules/checkout/components/shipping"
import { useSearchParams } from "next/navigation"
import CheckoutSteps from "./checkout-steps"

type CheckoutStep = "address" | "payment" | "review"

interface CheckoutFormClientProps {
  cart: HttpTypes.StoreCart
  customer: HttpTypes.StoreCustomer | null
  shippingMethods: any[]
  paymentMethods: any[]
}

const STEP_ORDER: CheckoutStep[] = ["address", "payment", "review"]

export default function CheckoutFormClient({
  cart,
  customer,
  shippingMethods,
  paymentMethods,
}: CheckoutFormClientProps) {
  const searchParams = useSearchParams()

  useEffect(() => {
    const track = () => {
      const event = getMetaCheckoutEvent(cart)
      if (event) trackMetaFunnelEvent("InitiateCheckout", event, cart.id)
      trackGoogleEvent("begin_checkout", buildGoogleCartEvent(cart), cart.id)
    }
    track()
    window.addEventListener("jardinBotanica:cookie-consent", track)
    return () => window.removeEventListener("jardinBotanica:cookie-consent", track)
  }, [cart])

  const currentStep = (searchParams.get("step") as CheckoutStep) || "address"

  return (
    <div className="lg:col-span-2 space-y-4 lg:space-y-6">
      <div>
        {currentStep === "address" && <Addresses cart={cart} customer={customer} />}

        {/*{currentStep === "delivery" && (
          <Shipping cart={cart} availableShippingMethods={shippingMethods} />
        )}*/}

        {currentStep === "payment" && (
          <Payment cart={cart} availablePaymentMethods={paymentMethods} />
        )}

        {currentStep === "review" && <Review cart={cart} />}
      </div>
    </div>
  )
}
