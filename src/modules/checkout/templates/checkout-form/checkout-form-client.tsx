"use client"

import { HttpTypes } from "@medusajs/types"
import Addresses from "@modules/checkout/components/addresses"
import Payment from "@modules/checkout/components/payment"
import Review from "@modules/checkout/components/review"
import Shipping from "@modules/checkout/components/shipping"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useMemo } from "react"
import { Button } from "@medusajs/ui"
import { ArrowLeftMini } from "@medusajs/icons"

type CheckoutStep = "address" | "delivery" | "payment" | "review"

interface CheckoutFormClientProps {
  cart: HttpTypes.StoreCart
  customer: HttpTypes.StoreCustomer | null
  shippingMethods: any[]
  paymentMethods: any[]
}

const STEP_ORDER: CheckoutStep[] = ["address", "delivery", "payment", "review"]

const STEP_LABELS: Record<CheckoutStep, string> = {
  address: "Shipping",
  delivery: "Delivery",
  payment: "Payment",
  review: "Review",
}

export default function CheckoutFormClient({
  cart,
  customer,
  shippingMethods,
  paymentMethods,
}: CheckoutFormClientProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const currentStep = (searchParams.get("step") as CheckoutStep) || null

  // Get current step index
  const currentStepIndex = useMemo(() => {
    if (!currentStep) return -1
    return STEP_ORDER.indexOf(currentStep)
  }, [currentStep])

  // Get previous step
  const previousStep = useMemo(() => {
    if (currentStepIndex <= 0) return null
    return STEP_ORDER[currentStepIndex - 1]
  }, [currentStepIndex])

  // Navigate to previous step
  const goToPreviousStep = useCallback(() => {
    if (!previousStep) return

    const params = new URLSearchParams(searchParams)
    params.set("step", previousStep)
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }, [previousStep, pathname, searchParams, router])

  // Determine which steps to show based on current step
  const visibleSteps = useMemo(() => {
    if (!currentStep) {
      // No step specified, show all steps
      return {
        address: true,
        delivery: true,
        payment: true,
        review: true,
      }
    }

    // Only show the current step
    return {
      address: currentStep === "address",
      delivery: currentStep === "delivery",
      payment: currentStep === "payment",
      review: currentStep === "review",
    }
  }, [currentStep])

  return (
    <div className="w-full">
      {/* Step Navigation */}
      {currentStep && (
        <div className="mb-8">
          {/* Back Button */}
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

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-4 mb-6">
            {STEP_ORDER.map((step, index) => {
              const isActive = step === currentStep
              const isCompleted = index < currentStepIndex

              return (
                <div key={step} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all ${
                        isActive
                          ? "bg-black text-white"
                          : isCompleted
                          ? "bg-green-600 text-white"
                          : "bg-gray-300 text-gray-600"
                      }`}
                    >
                      {isCompleted ? (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span
                      className={`text-xs mt-2 ${
                        isActive ? "font-medium" : "text-gray-600"
                      }`}
                    >
                      {STEP_LABELS[step]}
                    </span>
                  </div>
                  {index < STEP_ORDER.length - 1 && (
                    <div
                      className={`w-16 h-0.5 mx-2 mb-6 transition-all ${
                        isCompleted ? "bg-green-600" : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Checkout Steps */}
      <div className="grid grid-cols-1 gap-y-8">
        {visibleSteps.address && (
          <div data-step="address" className="animate-in fade-in duration-300">
            <Addresses cart={cart} customer={customer} />
          </div>
        )}

        {visibleSteps.delivery && (
          <div data-step="delivery" className="animate-in fade-in duration-300">
            <Shipping cart={cart} availableShippingMethods={shippingMethods} />
          </div>
        )}

        {visibleSteps.payment && (
          <div data-step="payment" className="animate-in fade-in duration-300">
            <Payment cart={cart} availablePaymentMethods={paymentMethods} />
          </div>
        )}

        {visibleSteps.review && (
          <div data-step="review" className="animate-in fade-in duration-300">
            <Review cart={cart} />
          </div>
        )}
      </div>
    </div>
  )
}
