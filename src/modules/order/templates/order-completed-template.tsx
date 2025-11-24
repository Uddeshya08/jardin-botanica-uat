import { Heading, Button } from "@medusajs/ui"
import Link from "next/link"
import { cookies as nextCookies } from "next/headers"

import CartTotals from "@modules/common/components/cart-totals"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OnboardingCta from "@modules/order/components/onboarding-cta"
import OrderDetails from "@modules/order/components/order-details"
import ShippingDetails from "@modules/order/components/shipping-details"
import PaymentDetails from "@modules/order/components/payment-details"
import { HttpTypes } from "@medusajs/types"

type OrderCompletedTemplateProps = {
  order: HttpTypes.StoreOrder
}

export default async function OrderCompletedTemplate({ order }: OrderCompletedTemplateProps) {
  const cookies = await nextCookies()
  const isOnboarding = cookies.get("_medusa_onboarding")?.value === "true"

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      <div className="content-container flex flex-col justify-start items-center gap-y-10 max-w-4xl h-full w-full py-12">

        {isOnboarding && <OnboardingCta orderId={order.id} />}

        <div
          className="flex flex-col gap-6 max-w-4xl h-full bg-white shadow-sm rounded-lg w-full p-10"
          data-testid="order-complete-container"
        >
          {/* Success Message */}
          <div className="text-center mb-4">
            <Heading level="h1" className="text-3xl font-semibold font-din-arabic text-sm text-black/70 tracking-wide">
              🎉 Thank you!
            </Heading>
            <p className="text-ui-fg-subtle text-lg mt-2">
              Your order has been placed successfully.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex justify-center gap-4 mt-4">
            <Link href="/">
              <Button variant="secondary" className="px-6 py-3 text-base">
                Continue Shopping
              </Button>
            </Link>

            <Link href="/account/orders">
              <Button variant="primary" className="px-6 py-3 text-base">
                View Order Details
              </Button>
            </Link>
          </div>

          {/* Order Info */}
          <OrderDetails order={order} />

          <Heading level="h2" className="text-2xl font-medium mt-4">
            Order Summary
          </Heading>

          <Items order={order} />
          <CartTotals totals={order} />
          <ShippingDetails order={order} />
          <PaymentDetails order={order} />

          <Help />
        </div>
      </div>
    </div>
  )
}
