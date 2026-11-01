import { getOrderStatus } from "@lib/util/order-status"
import type { HttpTypes } from "@medusajs/types"
import { getOrderReference } from "@lib/util/order-reference"

type OrderDetailsProps = {
  order: HttpTypes.StoreOrder
  showStatus?: boolean
}

const OrderDetails = ({ order, showStatus }: OrderDetailsProps) => {
  const status = getOrderStatus(order.fulfillment_status)

  const formattedDate = new Date(order.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="flex flex-col gap-y-4 font-din-arabic">
      {/* <p className="text-sm text-black tracking-wide">
        We have sent the order confirmation details to{" "}
        <span
          className="font-semibold text-black"
          data-testid="order-email"
        >
          {order.email}
        </span>
        .
      </p> */}

      <div className="flex flex-col gap-y-3 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
          <span className="text-xs uppercase tracking-wide text-black/60">Order date:</span>
          <span className="text-sm text-black tracking-wide" data-testid="order-date">
            {formattedDate}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
          <span className="text-xs uppercase tracking-wide text-black/60">Order number:</span>
          <span className="text-sm text-black font-medium tracking-wide" data-testid="order-id">
            {getOrderReference(order)}
          </span>
        </div>

        {showStatus && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <span className="text-xs uppercase tracking-wide text-black/60">Order status:</span>
            <span
              className={`text-sm font-medium tracking-wide ${status.className}`}
              data-testid="order-status"
            >
              {status.label}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderDetails
