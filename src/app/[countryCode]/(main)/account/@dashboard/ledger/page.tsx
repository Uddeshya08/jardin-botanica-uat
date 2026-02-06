import { retrieveCustomer } from "@lib/data/customer"
import { notFound, redirect } from "next/navigation"
import LedgerTemplate from "./components/ledger-template"

export default async function LedgerPage(props: { params: Promise<{ countryCode: string }> }) {
  const params = await props.params
  const { countryCode } = params
  const customer = await retrieveCustomer()

  if (!customer) {
    redirect(`/${countryCode}/accounts`)
  }

  return <LedgerTemplate />
}
