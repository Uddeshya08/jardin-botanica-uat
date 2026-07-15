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

    if (shouldCreateCustomer) {
      const headers = {
        authorization: `Bearer ${token}`,
      }

      // The callback JWT only carries actor_id/auth_identity_id — Google's
      // profile lives on the provider identity record, fetched separately.
      const identityRes = await fetch(
        `${process.env.MEDUSA_BACKEND_URL}/store/custom/auth/google-identity`,
        {
          headers: {
            ...headers,
            "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
          },
        }
      )
      const { email } = (await identityRes.json()) as { email: string | null }

      if (!email) {
        throw new Error("Could not retrieve email from Google account")
      }

      await sdk.store.customer.create({ email }, {}, headers)
    }

    // Revalidate customer cache
    const customerCacheTag = await getCacheTag("customers")
    revalidateTag(customerCacheTag)

    return { success: true }
  } catch (error: any) {
    console.error("Google callback error:", error)
    return {
      success: false,
      error: error.message || error.toString(),
    }
  }
}
