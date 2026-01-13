"use client"
import { updateLineItemAction } from "@lib/data/cart-actions"
import { useRouter } from "next/navigation"

// inside component:
const router = useRouter()

const changeQuantity = async (quantity: number) => {
  setError(null)
  setUpdating(true)
  await updateLineItemAction({ lineId: item.id, quantity })
    .then(() => {
      // ensure server components re-fetch fresh cart
      router.refresh()
    })
    .catch((err) => setError(err.message))
    .finally(() => setUpdating(false))
}
