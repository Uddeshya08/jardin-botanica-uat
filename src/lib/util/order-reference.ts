export function getOrderReference(order: {
  display_id?: number | null
  metadata?: Record<string, unknown> | null
}): string {
  const saved = order.metadata?.order_reference
  if (order.display_id == null) return ""

  const expected = `JB-2600${String(order.display_id).padStart(2, "0")}`
  return saved === expected ? saved : expected
}
