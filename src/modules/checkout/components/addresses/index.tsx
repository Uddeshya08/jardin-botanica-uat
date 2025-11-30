"use client"

import { listCartOptions, setAddresses } from "@lib/data/cart"
import { setShippingMethod } from "@lib/data/cart"
import compareAddresses from "@lib/util/compare-addresses"
import { ArrowLeftMini, CheckCircleSolid } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Button, Heading, Text, useToggleState } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"
import Spinner from "@modules/common/icons/spinner"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useActionState, useEffect, useState } from "react"
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

  const { state: sameAsBilling, toggle: toggleSameAsBilling } = useToggleState(
    cart?.shipping_address && cart?.billing_address
      ? compareAddresses(cart?.shipping_address, cart?.billing_address)
      : true
  )

  const handleEdit = () => {
    router.push(pathname + "?step=address")
  }

  const [message, formAction] = useActionState(setAddresses, null)

  const handleFormSubmit = async (formData: FormData) => {
    setIsSubmitting(true)

    try {
      // First, set the addresses
      await formAction(formData)

      const pincode = formData.get("shipping_address.postal_code") as string

      const serviceability = await checkPincodeServiceability(pincode)

      if (
        !serviceability.delivery_codes ||
        serviceability.delivery_codes.length === 0
      ) {
        console.error("Not service able to the provided pincode")
      }

      // Then automatically set the shipping method to the specific ID
      // const shippingMethodId = "so_01KAP297BN403YN2DSTJW966YJ"

      if (cart?.id) {
        const response = await listCartOptions()

        const isCODAvailable =
          serviceability.delivery_codes[0].postal_code.cod ?? true
        const isPrepaidAvailable =
          serviceability.delivery_codes[0].postal_code.pre_paid ?? true

        const surfaceShipping = response.shipping_options.find(
          (option) => option.data?.shipping_mode === "Surface"
        )

        if (!surfaceShipping) {
          throw new Error("No surface shipping option found")
        }

        await setShippingMethod({
          cartId: cart.id,
          shippingMethodId: surfaceShipping?.id,
          paymentMethod: "PREPAID",
          cod_available: isCODAvailable,
          prepaid_available: isPrepaidAvailable,
        })

        // Skip delivery step and go directly to payment
        router.push(pathname + "?step=payment")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {}, [cart?.shipping_address?.postal_code])

  return (
    <div>
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
      {isOpen ? (
        <form action={handleFormSubmit}>
          <div className="pb-8">
            <ShippingAddress
              customer={customer}
              checked={sameAsBilling}
              onChange={toggleSameAsBilling}
              cart={cart}
            />

            {!sameAsBilling && (
              <div>
                <Heading
                  level="h2"
                  className="text-3xl-regular gap-x-4 pb-6 pt-8"
                >
                  Billing address
                </Heading>

                <BillingAddress cart={cart} />
              </div>
            )}
            <SubmitButton
              className="mt-6 ml-auto px-8 py-3 bg-black text-white rounded-xl font-din-arabic transition-all shadow-lg hover:shadow-xl flex items-center space-x-2"
              data-testid="submit-address-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Continue"}
              <ChevronLeft className="w-4 h-4 rotate-180" />
            </SubmitButton>
            <ErrorMessage error={message} data-testid="address-error-message" />
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
                    <Text className="txt-medium-plus font-din-arabic text-sm text-black/70 tracking-wide mb-1">
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
