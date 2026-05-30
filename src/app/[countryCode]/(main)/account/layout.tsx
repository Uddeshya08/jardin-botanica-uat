import { retrieveCustomer } from "@lib/data/customer"
import { Toaster } from "@medusajs/ui"
import { headers } from "next/headers"
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
    const requestHeaders = await headers()
    const currentPath = requestHeaders.get("x-current-path")
    const redirectPath =
      currentPath?.startsWith(`/${countryCode}/account`)
        ? currentPath
        : `/${countryCode}/account`

    redirect(`/${countryCode}/accounts?redirect=${encodeURIComponent(redirectPath)}`)
  }

  return (
    <>
      {/* Hydrate a client component with the fetched data */}
      <ClientAccountShell customer={customer} dashboard={dashboard} login={login} />
      <Toaster />
    </>
  )
}
