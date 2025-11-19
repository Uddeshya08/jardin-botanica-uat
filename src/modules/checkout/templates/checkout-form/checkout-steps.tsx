"use client"
import { MapPin, Truck, CreditCard, CheckCircle2, Check } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"

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
              <motion.div
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all border-2 ${
                  isActive
                    ? "bg-white text-black border-gray-300"
                    : isCompleted
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-400 border-gray-300"
                }`}
                initial={false}
                animate={{
                  scale: isActive ? 1.1 : 1,
                  boxShadow: isActive
                    ? "0 4px 12px rgba(0, 0, 0, 0.15)"
                    : "0 0 0 rgba(0, 0, 0, 0)",
                }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut",
                }}
              >
                <motion.div
                  key={isCompleted ? "check" : "icon"}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isCompleted ? (
                    <Check className="w-6 h-6 stroke-[3]" />
                  ) : (
                    <StepIcon className="w-5 h-5" />
                  )}
                </motion.div>
              </motion.div>
              <motion.span
                className={`text-xs mt-2 whitespace-nowrap ${
                  isActive || isCompleted
                    ? "font-medium text-black"
                    : "text-gray-400"
                }`}
                initial={false}
                animate={{
                  y: isActive ? -2 : 0,
                }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut",
                }}
              >
                {CHECKOUT_STEPS[step].label}
              </motion.span>
            </div>
            {index < STEP_ORDER.length - 1 && (
              <div className="relative w-16 h-[2px] mx-2 mb-6">
                <div className="absolute inset-0 bg-gray-300" />
                <motion.div
                  className="absolute inset-0 bg-black origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{
                    scaleX: isCompleted ? 1 : 0,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: "easeInOut",
                    delay: 0.1,
                  }}
                  style={{ transformOrigin: "left" }}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
