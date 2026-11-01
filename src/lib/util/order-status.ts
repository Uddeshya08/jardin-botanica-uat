/** Shared customer-facing fulfillment status for order lists and details. */
export function getOrderStatus(status?: string | null) {
  const statuses: Record<string, { label: string; className: string; buttonText: string }> = {
    fulfilled: { label: "Fulfilled", className: "text-blue-600", buttonText: "View details" },
    partially_fulfilled: { label: "Partially fulfilled", className: "text-yellow-600", buttonText: "View details" },
    shipped: { label: "Shipped", className: "text-blue-600", buttonText: "Track order" },
    partially_shipped: { label: "Partially shipped", className: "text-blue-600", buttonText: "Track order" },
    delivered: { label: "Delivered", className: "text-green-600", buttonText: "View details" },
    partially_delivered: { label: "Partially delivered", className: "text-blue-600", buttonText: "Track order" },
    canceled: { label: "Cancelled", className: "text-red-600", buttonText: "View details" },
  }
  return statuses[status || ""] || { label: "Processing", className: "text-yellow-600", buttonText: "View details" }
}
