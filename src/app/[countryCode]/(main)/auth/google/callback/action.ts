"use server"

import { sdk } from "@lib/config"
import { getCacheTag, setAuthToken } from "@lib/data/cookies"
import { revalidateTag } from "next/cache"

export async function handleGoogleCallback(queryParams: Record<string, string>) {
  try {
    // Validate callback with Medusa
    const token = await sdk.auth.callback("customer", "google", queryParams)

    // Store token using the centralized function
    await setAuthToken(token as string)

    // Decode token to check if customer exists
    const tokenPayload = JSON.parse(
      Buffer.from((token as string).split(".")[1], "base64").toString()
    )

    const shouldCreateCustomer = !tokenPayload.actor_id || tokenPayload.actor_id === ""

    console.log("Token payload:", tokenPayload)

    if (shouldCreateCustomer) {
      const email = tokenPayload.user_metadata?.email as string

      const headers = {
        authorization: `Bearer ${token}`,
      }

      await sdk.store.customer.create({ email }, {}, headers)
    }

    // Revalidate customer cache
    const customerCacheTag = await getCacheTag("customers")
    revalidateTag(customerCacheTag)

    return { success: true }
  } catch (error: any) {
    console.error("Google callback error:", error)

    if (error.message == "Email is required to create a customer") {
      return {
        success: false,
        error:
          "No account found for the email please Sign up or create account first.",
      }
    }

    return {
      success: false,
      error: error.message || error.toString(),
    }
  }
}
