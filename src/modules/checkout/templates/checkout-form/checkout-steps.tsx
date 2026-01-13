"use client"
import { motion } from "framer-motion"
import { Check, CreditCard, MapPin } from "lucide-react"
import { useSearchParams } from "next/navigation"
import React from "react"

type CheckoutStep = "address" | "payment" | "review"

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
  payment: {
    label: "Payment",
    icon: CreditCard,
  },
  review: {
    label: "Review",
    icon: Check,
  },
}

const STEP_ORDER: CheckoutStep[] = ["address", "payment", "review"]

export default function CheckoutSteps() {
  const searchParams = useSearchParams()
  const currentStep = (searchParams.get("step") as CheckoutStep) || "address"
  const currentStepIndex = STEP_ORDER.indexOf(currentStep)

  // Convert step to numeric index for comparison (0, 1, 2)
  const currentStepNumeric = currentStepIndex

  const steps = STEP_ORDER.map((stepId, index) => ({
    id: index,
    stepId,
    name: CHECKOUT_STEPS[stepId].label,
    icon: CHECKOUT_STEPS[stepId].icon,
  }))

  return (
    <div className="max-w-2xl mx-auto px-2 mb-8">
      <div className="flex items-center justify-between mb-4 relative">
        {steps.map((step, index) => (
          <React.Fragment key={step.stepId}>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center flex-1 relative z-10"
            >
              <motion.div
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                {/* Pulsing Glow Effect - Only for current step */}
                {currentStepNumeric === step.id && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: "radial-gradient(circle, rgba(0, 0, 0, 0.3) 0%, transparent 70%)",
                      filter: "blur(8px)",
                    }}
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                )}

                <motion.div
                  className={`relative w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                    currentStepNumeric > step.id
                      ? "bg-black text-white"
                      : currentStepNumeric === step.id
                        ? "bg-white/80 backdrop-blur-sm shadow-lg"
                        : "bg-white/40 backdrop-blur-sm"
                  }`}
                >
                  {currentStepNumeric > step.id ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Check className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <step.icon className="w-4 h-4 md:w-5 md:h-5" />
                  )}
                </motion.div>
              </motion.div>
              <span
                className={`font-din-arabic text-xs mt-2 transition-colors duration-300 hidden sm:block ${
                  currentStepNumeric >= step.id ? "text-black" : "text-black/40"
                }`}
              >
                {step.name}
              </span>
            </motion.div>

            {index < steps.length - 1 && (
              <div
                className="flex-1 h-px bg-black/10 mx-auto relative overflow-hidden"
                style={{
                  marginTop: "-20px",
                  zIndex: 1,
                }}
              >
                {/* Background line - always visible */}
                <div className="flex-1 h-px bg-black/10 mx-20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black" style={{ width: "100%" }}></div>
                </div>

                <motion.div
                  className="absolute inset-0 bg-black h-full"
                  initial={{ width: "0%" }}
                  animate={{
                    width: currentStepNumeric > step.id ? "100%" : "0%",
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
