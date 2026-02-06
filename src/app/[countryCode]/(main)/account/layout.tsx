import { retrieveCustomer } from "@lib/data/customer"
import { Toaster } from "@medusajs/ui"
import { redirect } from "next/navigation"
import ClientAccountShell from "./_client-account-shell" // <-- new client wrapper

export default async function AccountPageLayout({
  dashboard,
  login,
  params,
}: {
  dashboard?: React.ReactNode
  login?: React.ReactNode
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params
  // It's OK to be async here (server component)
  const customer = await retrieveCustomer().catch(() => null)

  if (!customer) {
    redirect(`/${countryCode}/accounts`)
  }

  return (
    <>
      {/* Hydrate a client component with the fetched data */}
      <ClientAccountShell customer={customer} dashboard={dashboard} login={login} />
      <Toaster />
    </>
  )
}
