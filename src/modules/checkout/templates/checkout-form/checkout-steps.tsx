"use client"

import { MapPin, Truck, CreditCard, CheckCircle2, Check } from "lucide-react"
import { useSearchParams } from "next/navigation"

type CheckoutStep = "address" | "delivery" | "payment" | "review"

const CHECKOUT_STEPS: Record<
  CheckoutStep,
  {
    label: string
    icon: any
  }
> = {
  address: {
    label: "Shipping",
    icon: MapPin,
  },
  delivery: {
    label: "Delivery",
    icon: Truck,
  },
  payment: {
    label: "Payment",
    icon: CreditCard,
  },
  review: {
    label: "Review",
    icon: CheckCircle2,
  },
}

const STEP_ORDER: CheckoutStep[] = ["address", "delivery", "payment", "review"]

export default function CheckoutSteps() {
  const searchParams = useSearchParams()
  const currentStep = (searchParams.get("step") as CheckoutStep) || "address"
  const currentStepIndex = STEP_ORDER.indexOf(currentStep)

  return (
    <div className="flex items-center justify-center gap-4 mb-8">
      {STEP_ORDER.map((step, index) => {
        const isActive = step === currentStep
        const isCompleted = index < currentStepIndex
        const StepIcon = CHECKOUT_STEPS[step].icon

        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all border-2 ${
                  isActive
                    ? "bg-white text-black border-gray-300"
                    : isCompleted
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-400 border-gray-300"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-6 h-6 stroke-[3]" />
                ) : (
                  <StepIcon className="w-5 h-5" />
                )}
              </div>
              <span
                className={`text-xs mt-2 whitespace-nowrap ${
                  isActive || isCompleted
                    ? "font-medium text-black"
                    : "text-gray-400"
                }`}
              >
                {CHECKOUT_STEPS[step].label}
              </span>
            </div>

            {index < STEP_ORDER.length - 1 && (
              <div
                className={`w-16 h-[2px] mx-2 mb-6 transition-all ${
                  isCompleted ? "bg-black" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
