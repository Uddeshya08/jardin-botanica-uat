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
    if (!status) return { label: "", className: "" }

    // Map Medusa fulfillment statuses to UI labels/colors
    switch (status) {
      case "fulfilled":
        return { label: "DELIVERED", className: "text-green-600" }
      case "shipped":
      case "partially_shipped":
        return { label: "IN TRANSIT", className: "text-blue-600" }
      case "canceled":
        return { label: "CANCELLED", className: "text-red-600" }
      case "not_fulfilled":
      default:
        return { label: "PROCESSING", className: "text-yellow-600" }
    }
  }, [order])

  return (
    <div className="bg-transparent flex flex-col py-5 border-b border-gray-200" data-testid="order-card">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col">
          <div className="uppercase text-large-semi tracking-wide text-ui-fg-base">
            #<span data-testid="order-display-id">{order.display_id}</span>
          </div>
          <span className="text-small-regular text-ui-fg-subtle mt-1" data-testid="order-created-at">
            {new Date(order.created_at).toDateString()}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-large-semi" data-testid="order-amount">
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

      <div className="mt-6 text-small-regular text-ui-fg-base">
        {firstItemTitle && (
          <span className="text-ui-fg-base">
            {firstItemTitle} × {numberOfLines}
          </span>
        )}
      </div>

      <div className="mt-4">
        <LocalizedClientLink href={`/account/orders/details/${order.id}`}>
          <Button
            data-testid="order-details-link"
            variant="secondary"
            className="rounded-md px-4 py-2 border text-black font-din-arabic tracking-wide hover:bg-black hover:text-white transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2"
          >
            View details
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default OrderCard
