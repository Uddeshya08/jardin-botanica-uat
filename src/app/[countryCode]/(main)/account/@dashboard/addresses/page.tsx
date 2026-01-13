import { retrieveCustomer } from "@lib/data/customer"
import { getRegion } from "@lib/data/regions"

import AddressBook from "@modules/account/components/address-book"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Addresses",
  description: "View your addresses",
}

export default async function Addresses(props: { params: Promise<{ countryCode: string }> }) {
  const params = await props.params
  const { countryCode } = params
  const customer = await retrieveCustomer()
  const region = await getRegion(countryCode)

  if (!customer || !region) {
    notFound()
  }

  return (
    <div className="w-full" data-testid="addresses-page-wrapper">
      <h1 className="font-american-typewriter text-2xl lg:text-3xl mb-8 lg:mb-16 text-black ">
        Saved Addresses
      </h1>
      <AddressBook customer={customer} region={region} />
    </div>
  )
}
