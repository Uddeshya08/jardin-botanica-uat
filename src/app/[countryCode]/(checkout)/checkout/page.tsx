import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import PaymentWrapper from "@modules/checkout/components/payment-wrapper"
import CheckoutForm from "@modules/checkout/templates/checkout-form"
import CheckoutSteps from "@modules/checkout/templates/checkout-form/checkout-steps"
import CheckoutSummary from "@modules/checkout/templates/checkout-summary"
import { Package } from "lucide-react"
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
    <div className="flex flex-col mt-8">
      <div className="flex flex-col justify-center items-center gap-8">
        <div className="flex flex-col items-center">
          <div className="bg-stone-300 rounded-full p-2">
            <Package className="w-10 h-10" />
          </div>
          <h1>Complete Your Order</h1>
          <p>A few steps away from botanical bliss</p>
        </div>
        <CheckoutSteps />
      </div>
      <div className="grid grid-cols-1 small:grid-cols-[1fr_416px] content-container gap-x-20 py-4">
        <PaymentWrapper cart={cart}>
          <CheckoutForm cart={cart} customer={customer} />
        </PaymentWrapper>
        <CheckoutSummary cart={cart} />
      </div>
    </div>
  )
}
