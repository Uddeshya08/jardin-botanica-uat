"use client"

import { RadioGroup } from "@headlessui/react"
import { isStripe as isStripeFunc, paymentInfoMap } from "@lib/constants"
import { initiatePaymentSession } from "@lib/data/cart"
import { CheckCircleSolid, CreditCard } from "@medusajs/icons"
import { Button, Container, Heading, Text, clx } from "@medusajs/ui"
import ErrorMessage from "@modules/checkout/components/error-message"
import Divider from "@modules/common/components/divider"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import {
  CreditCard as CreditCardIcon,
  Smartphone,
  Building2,
  Wallet,
  Banknote,
} from "lucide-react"

// Payment type options with icons and descriptions
const PAYMENT_TYPES = [
  {
    id: "card",
    label: "Credit / Debit Card",
    description: "Visa, Mastercard, Amex, Rupay",
    icon: CreditCardIcon,
  },
  {
    id: "upi",
    label: "UPI",
    description: "Google Pay, PhonePe, Paytm & more",
    icon: Smartphone,
  },
  {
    id: "netbanking",
    label: "Net Banking",
    description: "All major banks supported",
    icon: Building2,
  },
  {
    id: "wallet",
    label: "Wallets",
    description: "Paytm, Mobikwik, Amazon Pay",
    icon: Wallet,
  },
  {
    id: "cod",
    label: "Cash on Delivery",
    description: "Pay when you receive",
    icon: Banknote,
  },
] as const

type PaymentType = (typeof PAYMENT_TYPES)[number]["id"]

const PAYMENT_PROVIDER_ID = "pp_razorpay_razorpay"

const Payment = ({
  cart,
  availablePaymentMethods,
}: {
  cart: any
  availablePaymentMethods: any[]
}) => {
  const activeSession = cart.payment_collection?.payment_sessions?.find(
    (paymentSession: any) => paymentSession.status === "pending"
  )

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardBrand, setCardBrand] = useState<string | null>(null)
  const [cardComplete, setCardComplete] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState(PAYMENT_PROVIDER_ID)

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "payment"

  // Get payment type from URL or default to 'card'
  const [selectedPaymentType, setSelectedPaymentType] = useState<PaymentType>(
    (searchParams.get("paymenttype") as PaymentType) || "card"
  )

  const isStripe = isStripeFunc(selectedPaymentMethod)

  const setPaymentMethod = async (method: string) => {
    setError(null)
    setSelectedPaymentMethod(method)
    if (isStripeFunc(method)) {
      await initiatePaymentSession(cart, {
        provider_id: method,
      })
    }
  }

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const paymentReady =
    (activeSession && cart?.shipping_methods.length !== 0) || paidByGiftcard

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const updateQueryParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams)
      Object.entries(updates).forEach(([key, value]) => {
        params.set(key, value)
      })
      return params.toString()
    },
    [searchParams]
  )

  const handleEdit = () => {
    router.push(pathname + "?" + createQueryString("step", "payment"), {
      scroll: false,
    })
  }

  const handlePaymentTypeChange = (type: PaymentType) => {
    setSelectedPaymentType(type)
    router.push(
      pathname +
        "?" +
        updateQueryParams({ step: "payment", paymenttype: type }),
      { scroll: false }
    )
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const shouldInputCard =
        isStripeFunc(selectedPaymentMethod) && !activeSession

      const checkActiveSession =
        activeSession?.provider_id === selectedPaymentMethod

      if (!checkActiveSession) {
        await initiatePaymentSession(cart, {
          provider_id: selectedPaymentMethod,
        })
      }

      if (!shouldInputCard) {
        return router.push(
          pathname +
            "?" +
            updateQueryParams({
              step: "review",
              paymenttype: selectedPaymentType,
            }),
          {
            scroll: false,
          }
        )
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setError(null)
  }, [isOpen])

  // Sync payment type from URL
  useEffect(() => {
    const urlPaymentType = searchParams.get("paymenttype") as PaymentType
    if (
      urlPaymentType &&
      PAYMENT_TYPES.some((pt) => pt.id === urlPaymentType)
    ) {
      setSelectedPaymentType(urlPaymentType)
    }
  }, [searchParams])

  // Auto-set payment provider on mount
  useEffect(() => {
    setPaymentMethod(PAYMENT_PROVIDER_ID)
  }, [])

  return (
    <div className="bg-[#e3e3d8]">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row text-3xl-regular gap-x-2 items-baseline",
            {
              "opacity-50 pointer-events-none select-none":
                !isOpen && !paymentReady,
            }
          )}
        >
          Payment
          {!isOpen && paymentReady && <CheckCircleSolid />}
        </Heading>
        {!isOpen && paymentReady && (
          <Text>
            <button
              onClick={handleEdit}
              className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
              data-testid="edit-payment-button"
            >
              Edit
            </button>
          </Text>
        )}
      </div>
      <div>
        <div className={isOpen ? "block" : "hidden"}>
          {!paidByGiftcard && (
            <>
              {/* Payment Type Selection */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                    <CreditCardIcon className="w-5 h-5 text-gray-700" />
                  </div>
                  <div>
                    <Text className="text-lg font-semibold text-gray-900">
                      Payment Method
                    </Text>
                    <Text className="text-sm text-gray-500">
                      Choose Your Preferred Payment Option
                    </Text>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {PAYMENT_TYPES.map((type) => {
                    const Icon = type.icon
                    return (
                      <button
                        key={type.id}
                        onClick={() => handlePaymentTypeChange(type.id)}
                        className={clx(
                          "flex items-center gap-4 py-4 px-5 rounded-xl border-2 transition-all text-left",
                          "hover:scale-105",
                          {
                            " bg-green-50/50 shadow-sm":
                              selectedPaymentType === type.id,
                            " bg-white": selectedPaymentType !== type.id,
                          }
                        )}
                        data-testid={`payment-type-${type.id}`}
                      >
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-green-700" />
                        </div>

                        <div className="flex-1">
                          <Text className="font-semibold text-gray-900 mb-0.5">
                            {type.label}
                          </Text>
                          <Text className="text-sm text-gray-500">
                            {type.description}
                          </Text>
                        </div>

                        {selectedPaymentType === type.id && (
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg
                              className="w-4 h-4 text-white"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2.5"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path d="M5 13l4 4L19 7"></path>
                            </svg>
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Payment Provider Selection - REMOVED UI, auto-set to pp_razorpay_razorpay */}
            </>
          )}

          {paidByGiftcard && (
            <div className="flex flex-col w-1/3">
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                Payment method
              </Text>
              <Text
                className="txt-medium text-ui-fg-subtle"
                data-testid="payment-method-summary"
              >
                Gift card
              </Text>
            </div>
          )}

          <ErrorMessage
            error={error}
            data-testid="payment-method-error-message"
          />

          <Button
            size="large"
            className="mt-6"
            onClick={handleSubmit}
            isLoading={isLoading}
            disabled={
              (isStripe && !cardComplete) ||
              (!selectedPaymentMethod && !paidByGiftcard)
            }
            data-testid="submit-payment-button"
          >
            Continue to review
          </Button>
        </div>

        <div className={isOpen ? "hidden" : "block"}>
          {cart && paymentReady && activeSession ? (
            <div className="flex items-start gap-x-1 w-full">
              <div className="flex flex-col w-1/3">
                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  Payment method
                </Text>
                <Text
                  className="txt-medium text-ui-fg-subtle"
                  data-testid="payment-method-summary"
                >
                  {paymentInfoMap[activeSession?.provider_id]?.title ||
                    activeSession?.provider_id}
                </Text>
              </div>
              <div className="flex flex-col w-1/3">
                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  Payment type
                </Text>
                <Text className="txt-medium text-ui-fg-subtle">
                  {PAYMENT_TYPES.find((pt) => pt.id === selectedPaymentType)
                    ?.label || selectedPaymentType}
                </Text>
              </div>
              <div className="flex flex-col w-1/3">
                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  Payment details
                </Text>
                <div
                  className="flex gap-2 txt-medium text-ui-fg-subtle items-center"
                  data-testid="payment-details-summary"
                >
                  <Container className="flex items-center h-7 w-fit p-2 bg-ui-button-neutral-hover">
                    {paymentInfoMap[selectedPaymentMethod]?.icon || (
                      <CreditCard />
                    )}
                  </Container>
                  <Text>
                    {isStripeFunc(selectedPaymentMethod) && cardBrand
                      ? cardBrand
                      : "Another step will appear"}
                  </Text>
                </div>
              </div>
            </div>
          ) : paidByGiftcard ? (
            <div className="flex flex-col w-1/3">
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                Payment method
              </Text>
              <Text
                className="txt-medium text-ui-fg-subtle"
                data-testid="payment-method-summary"
              >
                Gift card
              </Text>
            </div>
          ) : null}
        </div>
      </div>
      <Divider className="mt-8" />
    </div>
  )
}

export default Payment
