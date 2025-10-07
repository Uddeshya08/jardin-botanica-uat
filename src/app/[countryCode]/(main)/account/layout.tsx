// app/[countryCode]/account/(main)/account/layout.tsx
import { retrieveCustomer } from "@lib/data/customer"
import { Toaster } from "@medusajs/ui"
import ClientAccountShell from "./_client-account-shell" // <-- new client wrapper

export default async function AccountPageLayout({
  dashboard,
  login,
}: {
  dashboard?: React.ReactNode
  login?: React.ReactNode
}) {
  // It's OK to be async here (server component)
  const customer = await retrieveCustomer().catch(() => null)

  return (
    <>
      {/* Hydrate a client component with the fetched data */}
      <ClientAccountShell customer={customer} dashboard={dashboard} login={login} />
      <Toaster />
    </>
  )
}
