import React from "react"
import UnderlineLink from "@modules/common/components/interactive-link"
import AccountNav from "../components/account-nav"
import { HttpTypes } from "@medusajs/types"

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
}

/**
 * New UI Design:
 * - Background: #e3e3d8
 * - Sidebar on left (desktop) / tabs on top (mobile)
 * - Content area on right with scroll
 * - Typography: font-american-typewriter, font-din-arabic
 */
const AccountLayout: React.FC<AccountLayoutProps> = ({ customer, children }) => {
  const toTitleCase = (text: string) => {
    return text
      .toLowerCase()
      .split(" ")
      .filter(Boolean)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }
  
  return (
    <div
      className="min-h-screen flex flex-col lg:flex-row pt-32"
      style={{ backgroundColor: "#e3e3d8" }}
      data-testid="account-page"
    >
      {/* Mobile Header - Only show on mobile */}
      {customer && (
        <div className="lg:hidden mx-8 px-4 md:px-6 py-6 md:py-8 border-b" style={{ borderColor: "#D8D2C7" }}>
          <div className="text-center mb-4 md:mb-6">
          <h2 className="font-american-typewriter text-2xl md:text-3xl text-black tracking-wide">
  Hello, {toTitleCase(customer.first_name || "there")}
</h2>

            <p className="font-din-arabic text-sm text-black/50 tracking-wide mt-1">
              Manage your account and preferences
            </p>
          </div>
        </div>
      )}

      {/* Sidebar - Hidden on mobile, shown as horizontal tabs */}
      {customer && (
        <aside className="hidden lg:block lg:w-96 border-r pr-12 pl-16 py-8" style={{ borderColor: "#D8D2C7" }}>
          <AccountNav customer={customer} />
        </aside>
      )}

      {/* Mobile Tab Navigation */}
      {customer && (
        <div className="lg:hidden mx-8 px-4 py-4 border-b overflow-x-auto" style={{ borderColor: "#D8D2C7" }}>
          <AccountNav customer={customer} />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 py-8 lg:py-12 px-6 lg:pl-16 lg:pr-6 account-content overflow-y-auto">
        {children}
      </main>
    </div>
  )
}

export default AccountLayout
