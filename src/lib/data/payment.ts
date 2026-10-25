"use server"

import { sdk } from "@lib/config"
import type { HttpTypes } from "@medusajs/types"
import { getAuthHeaders, getCacheOptions } from "./cookies"

export const getRazorpayKeyId = async () => {
  const { key_id } = await sdk.client.fetch<{ key_id?: unknown }>(
    "/store/custom/razorpay/checkout",
    { method: "GET", cache: "no-store" }
  )

  if (typeof key_id !== "string" || !/^rzp_(test|live)_[A-Za-z0-9]+$/.test(key_id)) {
    throw new Error("Razorpay is not configured correctly")
  }

  return key_id
}

export const listCartPaymentMethods = async (regionId: string) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("payment_providers")),
  }

  return sdk.client
    .fetch<HttpTypes.StorePaymentProviderListResponse>(`/store/payment-providers`, {
      method: "GET",
      query: { region_id: regionId },
      headers,
      next,
      cache: "force-cache",
    })
    .then(({ payment_providers }) =>
      payment_providers.sort((a, b) => {
        return a.id > b.id ? 1 : -1
      })
    )
    .catch(() => {
      return null
    })
}
