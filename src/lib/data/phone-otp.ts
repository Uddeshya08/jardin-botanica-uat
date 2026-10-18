"use server"

import { sdk } from "@lib/config"
import { revalidateTag } from "next/cache"
import { getCacheTag, setAuthToken } from "./cookies"
import { transferCart } from "./customer"

export type PhoneOtpResult = {
  success: boolean
  message: string
  retryAfterSeconds?: number
}

function getErrorDetails(error: unknown): { message: string; retryAfterSeconds?: number } {
  const candidate = error as {
    message?: string
    status?: number
    response?: { data?: { message?: string; retry_after_seconds?: number } }
    body?: { message?: string; retry_after_seconds?: number }
  }
  const data = candidate?.response?.data || candidate?.body

  return {
    message: data?.message || candidate?.message || "Something went wrong. Please try again.",
    retryAfterSeconds: data?.retry_after_seconds ?? (candidate?.status === 429 ? 60 : undefined),
  }
}

export async function requestPhoneOtp(phone: string): Promise<PhoneOtpResult> {
  try {
    const response = await sdk.client.fetch<{
      message: string
      retry_after_seconds?: number
    }>("/store/custom/auth/phone-otp/request", {
      method: "POST",
      body: { phone },
      cache: "no-store",
    })

    return {
      success: true,
      message: response.message,
      retryAfterSeconds: response.retry_after_seconds || 60,
    }
  } catch (error) {
    const details = getErrorDetails(error)
    return { success: false, ...details }
  }
}

export async function loginWithPhoneOtp(phone: string, otp: string): Promise<PhoneOtpResult> {
  try {
    const token = await sdk.auth.login("customer", "phoneotp", { phone, otp })

    if (typeof token !== "string") {
      return { success: false, message: "We could not complete sign in. Please try again." }
    }

    await setAuthToken(token)
    const customerCacheTag = await getCacheTag("customers")
    if (customerCacheTag) revalidateTag(customerCacheTag)
    try {
      await transferCart()
    } catch (error) {
      console.error("Phone OTP sign in succeeded, but cart transfer failed:", error)
    }

    return { success: true, message: "Signed in successfully." }
  } catch (error) {
    const details = getErrorDetails(error)
    return {
      success: false,
      message: /invalid|expired|otp/i.test(details.message)
        ? "The code is incorrect or expired. Please try again."
        : details.message,
    }
  }
}
