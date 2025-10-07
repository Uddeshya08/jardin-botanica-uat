import React from "react"
import UnderlineLink from "@modules/common/components/interactive-link"
import AccountNav from "../components/account-nav"
import { HttpTypes } from "@medusajs/types"

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
}

/**
 * Matches the Auth (Sign In / Create Account) page visuals:
 * - Background: #e3e3d8
 * - Container: mx-auto with px-6 / lg:px-12
 * - Max width: 6xl
 * - Grid: 2 columns on large screens (nav | content)
 * - Content card: white background, subtle border, generous padding
 * - Typography: use your font utility classes (font-din-arabic / american-typewriter)
 */
const AccountLayout: React.FC<AccountLayoutProps> = ({ customer, children }) => {
  return (
    <div
      className="min-h-screen pt-32 pb-12"
      style={{ backgroundColor: "#e3e3d8" }}
      data-testid="account-page"
    >
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[280px_1fr] gap-12 lg:gap-16">
          {/* Left: Account Nav (only when logged in) */}
          <aside className="hidden lg:block">
            {customer && <AccountNav customer={customer} />}
          </aside>

          {/* Right: Main content */}
          <main>
            <div
              className="bg-white border"
              style={{ borderColor: "#D8D2C7" }}
            >
              <div className="p-6 lg:p-10">{children}</div>
            </div>

            {/* Footer help bar */}
            <div className="mt-10 pt-8 border-t" style={{ borderColor: "#D8D2C7" }}>
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div>
                  <h3 className="font-american-typewriter text-xl mb-2 text-black">
                    Got questions?
                  </h3>
                  <p className="font-din-arabic text-sm text-black/80">
                    You can find frequently asked questions and answers on our
                    customer service page.
                  </p>
                </div>
                <div>
                  <UnderlineLink href="/customer-service" className="font-din-arabic underline">
                    Customer Service
                  </UnderlineLink>
                </div>
              </div>
            </div>
          </main>
        </div>

        {/* Mobile nav below content (when logged in) */}
        {customer && (
          <div className="lg:hidden mt-10">
            <AccountNav customer={customer} />
          </div>
        )}
      </div>
    </div>
  )
}

export default AccountLayout
