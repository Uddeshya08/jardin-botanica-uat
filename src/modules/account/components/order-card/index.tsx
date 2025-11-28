import { Button } from "@medusajs/ui"
import { useMemo } from "react"

import Thumbnail from "@modules/products/components/thumbnail"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type OrderCardProps = {
  order: HttpTypes.StoreOrder
}

const OrderCard = ({ order }: OrderCardProps) => {
  const numberOfLines = useMemo(() => {
    return (
      order.items?.reduce((acc, item) => {
        return acc + item.quantity
      }, 0) ?? 0
    )
  }, [order])

  const numberOfProducts = useMemo(() => {
    return order.items?.length ?? 0
  }, [order])

  const firstItemTitle = useMemo(() => {
    return order.items && order.items.length > 0 ? order.items[0].title : ""
  }, [order])

  const fulfillmentBadge = useMemo(() => {
    const status = order.fulfillment_status

    console.log("status", status)
    console.log("order", order)
    if (!status) return { label: "", className: "", buttonText: "View Details" }

    // Map Medusa fulfillment statuses to UI labels/colors
    switch (status) {
      case "fulfilled":
      case "delivered":
        return { label: "DELIVERED", className: "text-green-600", buttonText: "View Details" }
      case "shipped":
      case "partially_shipped":
        return { label: "IN TRANSIT", className: "text-blue-600", buttonText: "Track order" }
      case "canceled":
        return { label: "CANCELLED", className: "text-red-600", buttonText: "View Details" }
      case "not_fulfilled":
      default:
        return { label: "PROCESSING", className: "text-yellow-600", buttonText: "View Details" }
    }
  }, [order])

  const formattedDate = useMemo(() => {
    const date = new Date(order.created_at)
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
    return date.toLocaleDateString('en-US', options)
  }, [order.created_at])

  return (
    <div className="bg-transparent flex flex-col py-5 w-full relative" data-testid="order-card">
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ backgroundColor: 'rgba(139, 69, 19, 0.15)' }}></div>
      <div className="flex items-start justify-between gap-4 w-full sm:w-[60%]">
        <div className="flex flex-col">
          <div className="font-din-arabic text-base text-black tracking-wide mb-2">
            #<span data-testid="order-display-id">{order.display_id}</span>
          </div>
          <span className="font-din-arabic text-sm text-black/50 tracking-wide" data-testid="order-created-at">
            {formattedDate}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="font-din-arabic text-base text-black tracking-wide mb-2" data-testid="order-amount">
            {convertToLocale({
              amount: order.total,
              currency_code: order.currency_code,
            })}
          </span>
          {fulfillmentBadge.label && (
            <span className={`text-small-regular mt-1 ${fulfillmentBadge.className}`}>
              {fulfillmentBadge.label}
            </span>
          )}
        </div>
      </div>

      <div className="mt-6 font-din-arabic text-sm text-black/70 tracking-wide w-full md:w-[50%]">
        {firstItemTitle && (
          <span className="font-din-arabic text-sm text-black/70 tracking-wide">
            {firstItemTitle} × {numberOfLines}
          </span>
        )}
      </div>

      <div className="mt-4 flex justify-end md:justify-start xs:w-full sm:w-[50%]">
        <LocalizedClientLink href={`/account/orders/details/${order.id}`}>
          <button
            data-testid="order-details-link"
            style={{ borderColor: 'rgb(216, 210, 199)', transform: 'none' }} 
            className="font-din-arabic text-sm text-black/60 hover:text-black transition-colors md:px-8 md:py-4 md:border md:text-black md:tracking-wide md:hover:bg-black md:hover:text-white md:transition-all md:duration-300 md:shadow-sm md:hover:shadow-md md:text-center"
          >
            <span className="md:hidden">[{fulfillmentBadge.buttonText}]</span>
            <span className="hidden sm:inline">{fulfillmentBadge.buttonText}</span>
          </button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default OrderCard
