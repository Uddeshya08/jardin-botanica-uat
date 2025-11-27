import { cookies as nextCookies } from "next/headers"
import { HttpTypes } from "@medusajs/types"

import OnboardingCta from "@modules/order/components/onboarding-cta"
import { OrderConfirmationUI } from "@modules/order/components/order-confirmation-ui"

type OrderCompletedTemplateProps = {
  order: HttpTypes.StoreOrder
}

export default async function OrderCompletedTemplate({ order }: OrderCompletedTemplateProps) {
  const cookies = await nextCookies()
  const isOnboarding = cookies.get("_medusa_onboarding")?.value === "true"
  const orderNumber = `#JB${order.display_id}`

  return (
    <div data-testid="order-complete-container">
      {isOnboarding && <OnboardingCta orderId={order.id} />}
      <OrderConfirmationUI orderNumber={orderNumber} />
    </div>
  )
}
