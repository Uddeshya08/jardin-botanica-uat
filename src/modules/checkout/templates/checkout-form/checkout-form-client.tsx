"use client"
import { HttpTypes } from "@medusajs/types"
import Addresses from "@modules/checkout/components/addresses"
import Payment from "@modules/checkout/components/payment"
import Review from "@modules/checkout/components/review"
import Shipping from "@modules/checkout/components/shipping"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@medusajs/ui"
import { ArrowLeftMini } from "@medusajs/icons"
import CheckoutSteps from "./checkout-steps"

type CheckoutStep = "address" | "delivery" | "payment" | "review"

interface CheckoutFormClientProps {
  cart: HttpTypes.StoreCart
  customer: HttpTypes.StoreCustomer | null
  shippingMethods: any[]
  paymentMethods: any[]
}

const STEP_ORDER: CheckoutStep[] = ["address", "delivery", "payment", "review"]

export default function CheckoutFormClient({
  cart,
  customer,
  shippingMethods,
  paymentMethods,
}: CheckoutFormClientProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const currentStep = (searchParams.get("step") as CheckoutStep) || "address"
  const currentStepIndex = STEP_ORDER.indexOf(currentStep)
  const previousStep =
    currentStepIndex > 0 ? STEP_ORDER[currentStepIndex - 1] : null

  const goToPreviousStep = () => {
    if (!previousStep) return
    const params = new URLSearchParams(searchParams)
    params.set("step", previousStep)
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="w-full">
      {previousStep && (
        <Button
          variant="transparent"
          onClick={goToPreviousStep}
          className="mb-4 text-ui-fg-subtle hover:text-ui-fg-base"
        >
          <ArrowLeftMini className="mr-2" />
          Previous
        </Button>
      )}

      <div className="animate-in fade-in duration-300">
        {currentStep === "address" && (
          <Addresses cart={cart} customer={customer} />
        )}

        {currentStep === "delivery" && (
          <Shipping cart={cart} availableShippingMethods={shippingMethods} />
        )}

        {currentStep === "payment" && (
          <Payment cart={cart} availablePaymentMethods={paymentMethods} />
        )}

        {currentStep === "review" && <Review cart={cart} />}
      </div>
    </div>
  )
}
