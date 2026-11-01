import type { HttpTypes } from "@medusajs/types"
import OnboardingCta from "@modules/order/components/onboarding-cta"
import { OrderConfirmationUI } from "@modules/order/components/order-confirmation-ui"
import { cookies as nextCookies } from "next/headers"
import { getOrderReference } from "@lib/util/order-reference"

type OrderCompletedTemplateProps = {
  order: HttpTypes.StoreOrder
  customer: HttpTypes.StoreCustomer | null
}

export default async function OrderCompletedTemplate({
  order,
  customer,
}: OrderCompletedTemplateProps) {
  const cookies = await nextCookies()
  const isOnboarding = cookies.get("_medusa_onboarding")?.value === "true"
  const orderNumber = getOrderReference(order)

  return (
    <div data-testid="order-complete-container">
      {isOnboarding && <OnboardingCta orderId={order.id} />}
      <OrderConfirmationUI
        orderNumber={orderNumber}
        isAuthenticated={!!customer}
        orderEmail={order.email ?? undefined}
      />
    </div>
  )
}
