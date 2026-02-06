import { retrieveCustomer } from "@lib/data/customer"
import { notFound, redirect } from "next/navigation"
import PaymentTemplate from "./components/payment-template"

export default async function PaymentPage(props: { params: Promise<{ countryCode: string }> }) {
  const params = await props.params
  const { countryCode } = params
  const customer = await retrieveCustomer()

  if (!customer) {
    redirect(`/${countryCode}/accounts`)
  }

  return <PaymentTemplate />
}
