"use server"

import { sdk } from "@lib/config"

type CheckoutOtpResult = {
  success: boolean
  message: string
  retryAfterSeconds?: number
}

function failure(error: unknown): CheckoutOtpResult {
  const details = error as {
    status?: number
    statusCode?: number
    message?: string
    response?: { status?: number; data?: { message?: string; retry_after_seconds?: number } }
    body?: { message?: string; retry_after_seconds?: number }
  }
  const data = details?.response?.data || details?.body

  if (details?.status === 404 || details?.statusCode === 404 || details?.response?.status === 404) {
    return {
      success: false,
      message:
        "COD phone verification is not available yet. Please choose an online payment method.",
    }
  }

  return {
    success: false,
    message: data?.message || details?.message || "Verification failed. Please try again.",
    retryAfterSeconds: data?.retry_after_seconds,
  }
}

export async function requestCheckoutOtp(
  cartId: string,
  phone: string
): Promise<CheckoutOtpResult> {
  try {
    const response = await sdk.client.fetch<{
      message?: string
      retry_after_seconds?: number
    }>("/store/custom/checkout/phone-otp/request", {
      method: "POST",
      body: { cart_id: cartId, phone },
      cache: "no-store",
    })

    return {
      success: true,
      message: response.message || "Verification code sent.",
      retryAfterSeconds: response.retry_after_seconds || 60,
    }
  } catch (error) {
    return failure(error)
  }
}

export async function verifyCheckoutOtp(
  cartId: string,
  phone: string,
  otp: string
): Promise<CheckoutOtpResult> {
  try {
    const response = await sdk.client.fetch<{ verified?: boolean; message?: string }>(
      "/store/custom/checkout/phone-otp/verify",
      {
        method: "POST",
        body: { cart_id: cartId, phone, otp },
        cache: "no-store",
      }
    )

    if (response.verified !== true) {
      return { success: false, message: response.message || "The code could not be verified." }
    }

    return { success: true, message: "Phone number verified." }
  } catch (error) {
    return failure(error)
  }
}
