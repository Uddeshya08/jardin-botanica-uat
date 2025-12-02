import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import PaymentWrapper from "@modules/checkout/components/payment-wrapper"
import CheckoutHeader from "@modules/checkout/components/checkout-header"
import CheckoutForm from "@modules/checkout/templates/checkout-form"
import CheckoutSteps from "@modules/checkout/templates/checkout-form/checkout-steps"
import CheckoutSummary from "@modules/checkout/templates/checkout-summary"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Checkout",
}

export default async function Checkout() {
  const cart = await retrieveCart()

  if (!cart) {
    return notFound()
  }

  const customer = await retrieveCustomer()

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6">
      <div className="pt-20 mb-8 lg:mb-12">
        <CheckoutHeader />
        <CheckoutSteps />
      </div>
      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        <PaymentWrapper cart={cart}>
          <CheckoutForm cart={cart} customer={customer} />
        </PaymentWrapper>
        <CheckoutSummary cart={cart} />
      </div>
    </div>
  )
}
