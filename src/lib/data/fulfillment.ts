"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getAuthHeaders, getCacheOptions } from "./cookies"

export interface DelhiveryServiceabilityResult {
  delivery_codes: Array<{
    postal_code: {
      max_weight: number
      city: string
      cod: string
      inc: string
      district: string
      pin: number
      max_amount: number
      pre_paid: string
      cash: string
      state_code: string
      remarks: string
      pickup: string
      repl: string
      covid_zone: string
      country_code: string
      is_oda: string
      protect_blacklist: boolean
      sort_code: string
      sun_tat: boolean
      center: Array<{
        code: string
        e: string
        cn: string
        s: string
        u: string
        ud: string
        sort_code: string
      }>
    }
  }>
}

export const checkDelhiveryPincodeServiceability = async (pincode: string) => {
  try {
    const BACKEND_URL = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
    
    const response = await fetch(
      `${BACKEND_URL}/store/custom/delhivery/serviceability?pincode=${pincode}`,
      {
        method: "GET",
        cache: "no-store",
      }
    )

    if (!response.ok) {
      throw new Error("Failed to check serviceability")
    }

    const data = await response.json()
    return data as DelhiveryServiceabilityResult
  } catch (error) {
    console.error("Error checking Delhivery serviceability:", error)
    return null
  }
}

export const listCartShippingMethods = async (cartId: string) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("fulfillment")),
  }

  return sdk.client
    .fetch<HttpTypes.StoreShippingOptionListResponse>(
      `/store/shipping-options`,
      {
        method: "GET",
        query: {
          cart_id: cartId,
          fields:
            "+service_zone.fulfllment_set.type,*service_zone.fulfillment_set.location.address",
        },
        headers,
        next,
        cache: "force-cache",
      }
    )
    .then(({ shipping_options }) => shipping_options)
    .catch(() => {
      return null
    })
}

export const calculatePriceForShippingOption = async (
  optionId: string,
  cartId: string,
  data?: Record<string, unknown>
) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("fulfillment")),
  }

  const body = { cart_id: cartId, data }

  if (data) {
    body.data = data
  }

  return sdk.client
    .fetch<{ shipping_option: HttpTypes.StoreCartShippingOption }>(
      `/store/shipping-options/${optionId}/calculate`,
      {
        method: "POST",
        body,
        headers,
        next,
      }
    )
    .then(({ shipping_option }) => shipping_option)
    .catch((e) => {
      return null
    })
}
