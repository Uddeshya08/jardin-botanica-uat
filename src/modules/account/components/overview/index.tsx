import { Container } from "@medusajs/ui"
import ChevronDown from "@modules/common/icons/chevron-down"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import React, { useMemo } from "react"

type OverviewProps = {
  customer: HttpTypes.StoreCustomer | null
  orders: HttpTypes.StoreOrder[] | null
}

const Overview: React.FC<OverviewProps> = ({ customer, orders }) => {
  const profileCompletion = useMemo(() => getProfileCompletion(customer), [customer])
  const addressesCount = customer?.addresses?.length || 0

  return (
    <div data-testid="overview-page-wrapper" className="min-h-[70vh]">
      {/* Top hero card — aligns with login-style centered card */}
      <section className="content-container max-w-5xl mx-auto px-4 small:px-6 py-6 small:py-10">
        <Container className="rounded-2xl border border-gray-200 bg-white/90 shadow-sm p-5 small:p-7">
          <div className="flex flex-col small:flex-row small:items-center small:justify-between gap-4">
            <div className="space-y-1.5">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Welcome back
              </p>
              <h1 className="text-2xl small:text-3xl font-semibold leading-tight">
                <span data-testid="welcome-message" data-value={customer?.first_name}>
                  Hello {customer?.first_name || "there"}
                </span>
              </h1>
              <p className="text-sm text-ui-fg-base">
                Signed in as:{" "}
                <span
                  className="font-semibold"
                  data-testid="customer-email"
                  data-value={customer?.email}
                >
                  {customer?.email}
                </span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full small:w-auto">
              {/* Metric: Profile completion */}
              <div className="rounded-xl border border-gray-200 bg-white p-4 min-w-[160px]">
                <p className="text-xs text-gray-500 mb-1">Profile</p>
                <div className="flex items-end gap-2">
                  <span
                    className="text-3xl-semi leading-none"
                    data-testid="customer-profile-completion"
                    data-value={profileCompletion}
                  >
                    {profileCompletion}%
                  </span>
                  <span className="uppercase text-[11px] tracking-wide text-ui-fg-subtle">
                    Completed
                  </span>
                </div>
                <ProgressBar value={profileCompletion} className="mt-3" />
                <LocalizedClientLink
                  href="/account/profile"
                  className="inline-block text-[12px] font-medium mt-3 text-ui-fg-interactive hover:underline"
                >
                  Complete profile →
                </LocalizedClientLink>
              </div>

              {/* Metric: Addresses */}
              <div className="rounded-xl border border-gray-200 bg-white p-4 min-w-[160px]">
                <p className="text-xs text-gray-500 mb-1">Addresses</p>
                <div className="flex items-end gap-2">
                  <span
                    className="text-3xl-semi leading-none"
                    data-testid="addresses-count"
                    data-value={addressesCount}
                  >
                    {addressesCount}
                  </span>
                  <span className="uppercase text-[11px] tracking-wide text-ui-fg-subtle">
                    Saved
                  </span>
                </div>
                <LocalizedClientLink
                  href="/account/addresses"
                  className="inline-block text-[12px] font-medium mt-5 text-ui-fg-interactive hover:underline"
                >
                  Manage addresses →
                </LocalizedClientLink>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Recent orders section — card list matches the same visual language */}
      <section className="content-container max-w-5xl mx-auto px-4 small:px-6 pb-12">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-large-semi">Recent orders</h3>
          {!!orders?.length && (
            <LocalizedClientLink
              href="/account/orders"
              className="text-sm font-medium text-ui-fg-interactive hover:underline"
            >
              View all orders
            </LocalizedClientLink>
          )}
        </div>

        <ul className="flex flex-col gap-y-4" data-testid="orders-wrapper">
          {orders && orders.length > 0 ? (
            orders.slice(0, 5).map((order) => (
              <li key={order.id} data-testid="order-wrapper" data-value={order.id}>
                <LocalizedClientLink href={`/account/orders/details/${order.id}`}>
                  <Container className="rounded-xl border border-gray-200 bg-white hover:shadow-sm transition-shadow p-4 small:p-5 flex items-center justify-between">
                    <div className="grid grid-cols-3 grid-rows-2 gap-x-4 gap-y-1 text-small-regular flex-1">
                      <span className="font-semibold">Date placed</span>
                      <span className="font-semibold">Order number</span>
                      <span className="font-semibold">Total amount</span>

                      <span data-testid="order-created-date">
                        {new Date(order.created_at).toDateString()}
                      </span>

                      <span data-testid="order-id" data-value={order.display_id}>
                        #{order.display_id}
                      </span>

                      <span data-testid="order-amount">
                        {convertToLocale({
                          amount: order.total,
                          currency_code: order.currency_code,
                        })}
                      </span>
                    </div>

                    <button
                      className="ml-4 shrink-0 rounded-lg border border-gray-200 p-2 hover:bg-gray-50"
                      data-testid="open-order-button"
                    >
                      <span className="sr-only">Go to order #{order.display_id}</span>
                      <ChevronDown className="-rotate-90" />
                    </button>
                  </Container>
                </LocalizedClientLink>
              </li>
            ))
          ) : (
            <EmptyOrders />
          )}
        </ul>
      </section>
    </div>
  )
}

/** Simple, dependency-free progress bar that works with Tailwind only */
const ProgressBar: React.FC<{ value: number; className?: string }> = ({ value, className }) => {
  const clamped = Math.max(0, Math.min(100, Math.round(value)))
  return (
    <div className={`h-2 w-full rounded-full bg-gray-200 overflow-hidden ${className || ""}`}>
      <div
        className="h-full bg-black/80 transition-[width] duration-500 ease-out"
        style={{ width: `${clamped}%` }}
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        role="progressbar"
      />
    </div>
  )
}

const EmptyOrders: React.FC = () => (
  <Container className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
    <p className="text-base text-ui-fg-subtle" data-testid="no-orders-message">
      No recent orders
    </p>
    <LocalizedClientLink
      href="/store"
      className="inline-block mt-2 text-sm font-medium text-ui-fg-interactive hover:underline"
    >
      Start shopping →
    </LocalizedClientLink>
  </Container>
)

/** Same logic you had — kept for test parity */
const getProfileCompletion = (customer: HttpTypes.StoreCustomer | null) => {
  let count = 0
  if (!customer) return 0
  if (customer.email) count++
  if (customer.first_name && customer.last_name) count++
  if (customer.phone) count++
  const billingAddress = customer.addresses?.find((a) => a.is_default_billing)
  if (billingAddress) count++
  return (count / 4) * 100
}

export default Overview
