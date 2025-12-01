"use server"

import { sdk } from "@lib/config"
import { getAuthHeaders } from "./cookies"

export async function checkPincodeServiceability(pincode: string) {
  const headers = {
    ...(await getAuthHeaders()),
  }

  return await sdk.client.fetch(
    `/store/custom/delhivery/serviceability?pincode=${pincode}`,
    {
      method: "GET",
      headers,
    }
  )
}
