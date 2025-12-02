"use client"

import { listCartOptions, setAddresses, updateCart } from "@lib/data/cart"
import { setShippingMethod } from "@lib/data/cart"
import compareAddresses from "@lib/util/compare-addresses"
import { ArrowLeftMini, CheckCircleSolid } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Button, Heading, Text, useToggleState } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"
import Spinner from "@modules/common/icons/spinner"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import BillingAddress from "../billing_address"
import ErrorMessage from "../error-message"
import ShippingAddress from "../shipping-address"
import { SubmitButton } from "../submit-button"
import { ChevronLeft } from "lucide-react"
import { checkPincodeServiceability } from "@lib/data/delhivery"

const Addresses = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "address"
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEmailValid, setIsEmailValid] = useState(true)

  const { state: sameAsBilling, toggle: toggleSameAsBilling } = useToggleState(
    cart?.shipping_address && cart?.billing_address
      ? compareAddresses(cart?.shipping_address, cart?.billing_address)
      : true
  )

  const handleEdit = () => {
    router.push(pathname + "?step=address")
  }

  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const formData = new FormData(e.currentTarget)

      // Validate email before submission
      const email = formData.get("email") as string
      if (!email || !email.trim()) {
        setSubmitError("Email is required")
        setIsSubmitting(false)
        return
      }

      const trimmedEmail = email.trim()

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(trimmedEmail)) {
        setSubmitError("Please enter a valid email address")
        setIsSubmitting(false)
        return
      }

      // Step 1: Set addresses first using updateCart (without redirect)
      const addressData = {
        shipping_address: {
          first_name: formData.get("shipping_address.first_name")?.toString() || "",
          last_name: formData.get("shipping_address.last_name")?.toString() || "",
          address_1: formData.get("shipping_address.address_1")?.toString() || "",
          address_2: "",
          company: formData.get("shipping_address.company")?.toString() || "",
          postal_code: formData.get("shipping_address.postal_code")?.toString() || "",
          city: formData.get("shipping_address.city")?.toString() || "",
          country_code: formData.get("shipping_address.country_code")?.toString() || "",
          province: formData.get("shipping_address.province")?.toString() || "",
          phone: formData.get("shipping_address.phone")?.toString() || "",
        },
        email: trimmedEmail,
      } as any

      const sameAsBilling = formData.get("same_as_billing")
      if (sameAsBilling === "on") {
        addressData.billing_address = addressData.shipping_address
      } else {
        addressData.billing_address = {
          first_name: formData.get("billing_address.first_name")?.toString() || "",
          last_name: formData.get("billing_address.last_name")?.toString() || "",
          address_1: formData.get("billing_address.address_1")?.toString() || "",
          address_2: "",
          company: formData.get("billing_address.company")?.toString() || "",
          postal_code: formData.get("billing_address.postal_code")?.toString() || "",
          city: formData.get("billing_address.city")?.toString() || "",
          country_code: formData.get("billing_address.country_code")?.toString() || "",
          province: formData.get("billing_address.province")?.toString() || "",
          phone: formData.get("billing_address.phone")?.toString() || "",
        }
      }

      await updateCart(addressData)

      // Step 2: Check serviceability
      const pincode = formData.get("shipping_address.postal_code") as string

      if (!pincode) {
        setSubmitError("Postal code is required")
        setIsSubmitting(false)
        return
      }

      const serviceability = await checkPincodeServiceability(pincode) as any

      if (
        !serviceability ||
        !serviceability.delivery_codes ||
        serviceability.delivery_codes.length === 0
      ) {
        console.error("Not serviceable to the provided pincode")
        setSubmitError("Not serviceable to the provided pincode")
        setIsSubmitting(false)
        return
      }

      // Step 3: Set shipping method
      if (cart?.id) {
        const response = await listCartOptions()

        // Add proper null checks for serviceability response
        const deliveryCode = serviceability.delivery_codes?.[0]
        const postalCodeData = deliveryCode?.postal_code
        
        const isCODAvailable =
          postalCodeData?.cod ?? true
        const isPrepaidAvailable =
          postalCodeData?.pre_paid ?? true

        const surfaceShipping = response.shipping_options.find(
          (option) => option.data?.shipping_mode === "Surface"
        )

        if (!surfaceShipping) {
          setSubmitError("No surface shipping option found")
          setIsSubmitting(false)
          return
        }

        await setShippingMethod({
          cartId: cart.id,
          shippingMethodId: surfaceShipping?.id,
          paymentMethod: "PREPAID",
          cod_available: isCODAvailable,
          prepaid_available: isPrepaidAvailable,
        })

        // Step 4: Redirect to payment step
        router.push(pathname + "?step=payment")
        setIsSubmitting(false)
      }
    } catch (error: any) {
      console.error("Error submitting form:", error)
      const errorMessage = error?.message || error?.toString() || "An error occurred. Please try again."
      setSubmitError(errorMessage)
      setIsSubmitting(false)
    }
  }

  useEffect(() => {}, [cart?.shipping_address?.postal_code])

  return (
    <div>
      {isOpen ? (
        <form onSubmit={handleFormSubmit}>
          <div className="pb-8 lg:col-span-2 space-y-4 lg:space-y-6 bg-white/60 backdrop-blur-md rounded-2xl md:rounded-3xl p-4 md:p-8 border border-white/80 shadow-xl">
            <div className="flex-row items-center justify-between mb-6">
              <p className="font-din-arabic text-xs text-black/40 mb-2 tracking-wider uppercase">
                Shipping Information
              </p>
              <Heading
                level="h2"
                className="flex flex-row text-3xl-regular gap-x-2 items-baseline font-american-typewriter text-xl sm:text-2xl md:text-3xl tracking-wide"
              >
                Where Shall We Send Your Order?
                {!isOpen && <CheckCircleSolid />}
              </Heading>
              {!isOpen && cart?.shipping_address && (
                <Text>
                  <button
                    onClick={handleEdit}
                    className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
                    data-testid="edit-address-button"
                  >
                    Edit
                  </button>
                </Text>
              )}
            </div>

            <ShippingAddress
              customer={customer}
              checked={sameAsBilling}
              onChange={toggleSameAsBilling}
              cart={cart}
              onEmailValidationChange={setIsEmailValid}
            />

            {!sameAsBilling && (
              <div className="pt-6">
                <BillingAddress cart={cart} />
              </div>
            )}
            {/* Hidden input to indicate if billing address is same as shipping */}
            <input
              type="hidden"
              name="same_as_billing"
              value={sameAsBilling ? "on" : ""}
            />
            <ErrorMessage error={submitError} data-testid="address-error-message" />
          </div>
          <div className="flex items-center justify-between pt-4">
            <SubmitButton
              data-testid="submit-address-button"
              disabled={!isEmailValid}
            >
              {isSubmitting ? "Processing..." : "Continue"}
              <ChevronLeft className="w-4 h-4 rotate-180" />
            </SubmitButton>
          </div>

        </form>
      ) : (
        <div>
          <div className="text-small-regular">
            {cart && cart.shipping_address ? (
              <div className="flex items-start gap-x-8">
                <div className="flex items-start gap-x-1 w-full">
                  <div
                    className="flex flex-col w-1/3"
                    data-testid="shipping-address-summary"
                  >
                    <Text className="txt-medium-plus font-din-arabic text-sm text-black/70 tracking-wide mb-1">
                      Shipping Address
                    </Text>
                    <Text className="txt-medium text-ui-fg-subtle">
                      {cart.shipping_address.first_name}{" "}
                      {cart.shipping_address.last_name}
                    </Text>
                    <Text className="txt-medium text-ui-fg-subtle">
                      {cart.shipping_address.address_1}{" "}
                      {cart.shipping_address.address_2}
                    </Text>
                    <Text className="txt-medium text-ui-fg-subtle">
                      {cart.shipping_address.postal_code},{" "}
                      {cart.shipping_address.city}
                    </Text>
                    <Text className="txt-medium text-ui-fg-subtle">
                      {cart.shipping_address.country_code?.toUpperCase()}
                    </Text>
                  </div>

                  <div
                    className="flex flex-col w-1/3 "
                    data-testid="shipping-contact-summary"
                  >
                    <Text className="txt-medium-plus font-din-arabic text-sm text-black/70 tracking-wide mb-1">
                      Contact
                    </Text>
                    <Text className="txt-medium text-ui-fg-subtle">
                      {cart.shipping_address.phone}
                    </Text>
                    <Text className="txt-medium text-ui-fg-subtle">
                      {cart.email}
                    </Text>
                  </div>

                  <div
                    className="flex flex-col w-1/3"
                    data-testid="billing-address-summary"
                  >
                    <Text style={{padding:'2rem 0'}} className="font-medium h2-core flex flex-row text-3xl-regular gap-x-2 items-baseline font-american-typewriter text-xl sm:text-2xl md:text-3xl tracking-wide">
                      Billing Address
                    </Text>

                    {sameAsBilling ? (
                      <Text className="txt-medium text-ui-fg-subtle">
                        Billing- and delivery address are the same.
                      </Text>
                    ) : (
                      <>
                        <Text className="txt-medium text-ui-fg-subtle">
                          {cart.billing_address?.first_name}{" "}
                          {cart.billing_address?.last_name}
                        </Text>
                        <Text className="txt-medium text-ui-fg-subtle">
                          {cart.billing_address?.address_1}{" "}
                          {cart.billing_address?.address_2}
                        </Text>
                        <Text className="txt-medium text-ui-fg-subtle">
                          {cart.billing_address?.postal_code},{" "}
                          {cart.billing_address?.city}
                        </Text>
                        <Text className="txt-medium text-ui-fg-subtle">
                          {cart.billing_address?.country_code?.toUpperCase()}
                        </Text>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <Spinner />
              </div>
            )}
          </div>
        </div>
      )}
      <Divider className="mt-8" />
    </div>
  )
}

export default Addresses
