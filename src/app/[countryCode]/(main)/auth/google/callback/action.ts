"use server"

import { sdk } from "@lib/config"
import { getCacheTag, setAuthToken } from "@lib/data/cookies"
import { transferCart } from "@lib/data/customer"
import { revalidateTag } from "next/cache"

export async function handleGoogleCallback(queryParams: Record<string, string>) {
  try {
    const backendUrl = process.env.MEDUSA_BACKEND_URL
    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

    // Validate callback with Medusa — returns a registration token (empty
    // actor_id) on first Google sign-in, or a full token if already linked.
    let token = (await sdk.auth.callback("customer", "google", queryParams)) as string

    const tokenPayload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString())
    const needsSetup = !tokenPayload.actor_id || tokenPayload.actor_id === ""

    if (needsSetup) {
      const headers = {
        authorization: `Bearer ${token}`,
        "x-publishable-api-key": publishableKey,
      }

      // Resolve the Google email + link this identity to an existing customer
      // if one already has that email. Google's profile isn't in the JWT, so
      // this must happen server-side against the auth identity record.
      const resolveRes = await fetch(`${backendUrl}/store/custom/auth/google-resolve`, {
        method: "POST",
        headers,
      })

      if (!resolveRes.ok) {
        throw new Error(`Failed to resolve Google account (${resolveRes.status})`)
      }

      const { email, existed } = (await resolveRes.json()) as {
        email: string | null
        existed: boolean
      }

      if (!email) {
        throw new Error("Could not retrieve email from Google account")
      }

      // No existing customer for this email — create one (also links the
      // auth identity to the new customer).
      if (!existed) {
        await sdk.store.customer.create({ email }, {}, { authorization: `Bearer ${token}` })
      }

      // The current token predates the link — refresh it so the new token
      // carries actor_id and actually authenticates the customer.
      const refreshRes = await fetch(`${backendUrl}/auth/token/refresh`, {
        method: "POST",
        headers,
      })

      if (!refreshRes.ok) {
        throw new Error(`Failed to refresh auth token (${refreshRes.status})`)
      }

      const refreshed = (await refreshRes.json()) as { token: string }
      token = refreshed.token
    }

    // Store the final, actor-bearing token.
    await setAuthToken(token)

    // Revalidate customer cache
    const customerCacheTag = await getCacheTag("customers")
    revalidateTag(customerCacheTag)

    // Link the guest cart to the now-authenticated customer, matching the
    // email/password login flows. A transfer failure shouldn't fail sign-in —
    // the cart-mismatch banner offers a manual retry.
    try {
      await transferCart()
    } catch (transferError) {
      console.error("Cart transfer after Google sign-in failed:", transferError)
    }

    return { success: true }
  } catch (error: any) {
    console.error("Google callback error:", error)
    return {
      success: false,
      error: error.message || error.toString(),
    }
  }
}
