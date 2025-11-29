"use client"

import { Button } from "@medusajs/ui"

import OrderCard from "../order-card"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

const OrderOverview = ({ orders }: { orders: HttpTypes.StoreOrder[] }) => {
  if (orders?.length) {
    return (
      <div className="flex flex-col gap-y-8 w-full">
        {orders.map((o) => (
          <div
            key={o.id}
            className="w-full"
          >
            <OrderCard order={o} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      className="w-full flex flex-col items-center gap-y-4"
      data-testid="no-orders-container"
    >
      <p className="font-din-arabic text-sm sm:text-base text-black/60 mb-10 max-w-md mx-auto">
        You don&apos;t have any orders yet, let us change that {":)"}
      </p>
      <div className="mt-1">
        <LocalizedClientLink href="/" passHref>
          <button className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-black text-white font-din-arabic tracking-wide text-xs sm:text-sm hover:bg-black/90 transition-colors">
            Continue shopping
          </button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default OrderOverview
