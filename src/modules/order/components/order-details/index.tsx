import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"

type OrderDetailsProps = {
  order: HttpTypes.StoreOrder
  showStatus?: boolean
}

const OrderDetails = ({ order, showStatus }: OrderDetailsProps) => {
  const formatStatus = (str: string) => {
    const formatted = str.split("_").join(" ")

    return formatted.slice(0, 1).toUpperCase() + formatted.slice(1)
  }

  return (
    <div className="flex flex-col gap-2">
      <Text className="text-ui-fg-base">
        We have sent the order confirmation details to{" "}
        <span
          className="text-ui-fg-medium-plus font-semibold"
          data-testid="order-email"
        >
          {order.email}
        </span>
        .
      </Text>
      <Text className="text-ui-fg-subtle">
        <span className="uppercase tracking-wide text-compact-xsmall mr-1">
          Order date:
        </span>
        <span data-testid="order-date">
          {new Date(order.created_at).toDateString()}
        </span>
      </Text>
      <Text className="text-ui-fg-base">
        <span className="uppercase tracking-wide text-compact-xsmall mr-1">
          Order number:
        </span>
        <span className="text-ui-fg-interactive font-medium" data-testid="order-id">
          {order.display_id}
        </span>
      </Text>

      <div className="flex items-center text-compact-small gap-x-6 mt-3">
        {showStatus && (
          <>
            <Text className="text-ui-fg-base">
              <span className="uppercase tracking-wide text-compact-xsmall mr-1">
                Order status:
              </span>
              <span
                className="font-medium"
                data-testid="order-status"
              >
                <span
                  className={
                    order.fulfillment_status === "fulfilled"
                      ? "text-green-600"
                      : order.fulfillment_status === "shipped" ||
                        order.fulfillment_status === "partially_shipped"
                      ? "text-blue-600"
                      : order.fulfillment_status === "canceled"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }
                >
                  {formatStatus(order.fulfillment_status)}
                </span>
              </span>
            </Text>
            <Text className="text-ui-fg-base">
              <span className="uppercase tracking-wide text-compact-xsmall mr-1">
                Payment status:
              </span>
              <span className="text-ui-fg-subtle" sata-testid="order-payment-status">
                {formatStatus(order.payment_status)}
              </span>
            </Text>
          </>
        )}
      </div>
    </div>
  )
}

export default OrderDetails
