"use client"

import { XMark } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OrderDetails from "@modules/order/components/order-details"
import OrderSummary from "@modules/order/components/order-summary"
import ShippingDetails from "@modules/order/components/shipping-details"
import React from "react"

type OrderDetailsTemplateProps = {
  order: HttpTypes.StoreOrder
}

const OrderDetailsTemplate: React.FC<OrderDetailsTemplateProps> = ({
  order,
}) => {
  return (
    <div className="flex flex-col justify-center gap-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl-semi tracking-tight">Order Details</h1>
        <LocalizedClientLink
          href="/account/orders"
          aria-label="Back to orders overview"
          className="px-4 py-2 border text-black font-din-arabic tracking-wide hover:bg-black hover:text-white transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2"
          data-testid="back-to-overview-button"
        >
          <XMark /> Back to overview
        </LocalizedClientLink>
      </div>
      <div
        className="flex h-full w-full flex-col divide-y divide-ui-border-base rounded-xl border border-ui-border-base bg-[#e3e3d8] p-4 md:p-6"
        data-testid="order-details-container"
      >
        <div className="pb-4 md:pb-6">
          <OrderDetails order={order} showStatus />
        </div>
        <div className="py-4 md:py-6">
          <Items order={order} />
        </div>
        <div className="py-4 md:py-6">
          <ShippingDetails order={order} />
        </div>
        <div className="py-4 md:py-6">
          <OrderSummary order={order} />
        </div>
        <div className="pt-4 md:pt-6">
          <Help />
        </div>
      </div>
    </div>
  )
}

export default OrderDetailsTemplate
