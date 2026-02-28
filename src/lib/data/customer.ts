"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import type { HttpTypes } from "@medusajs/types"
import { revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import {
  getAuthHeaders,
  getCacheOptions,
  getCacheTag,
  getCartId,
  removeAuthToken,
  removeCartId,
  setAuthToken,
} from "./cookies"

const mapErrorMessage = (error: any): string => {
  const msg = error?.toString() || ""
  if (
    msg.includes("Invalid email or password") ||
    msg.includes("401") ||
    msg.includes("Unauthorized") ||
    msg.includes("Wrong password")
  ) {
    return "Couldn’t sign you in. Please check your email and password."
  }
  if (
    msg.includes("already exists") ||
    msg.includes("Identity with email") ||
    msg.includes("Duplicate entry")
  ) {
    return "You’re already on file. Use “Sign in” or reset your password."
  }
  if (msg.includes("400") || msg.includes("Invalid request")) {
    // Basic form validation catch-all
    return "Almost there. Some fields need a quick check."
  }
  return msg
}

export const retrieveCustomer = async (): Promise<HttpTypes.StoreCustomer | null> => {
  const authHeaders = await getAuthHeaders()

  if (!authHeaders) return null

  const headers = {
    ...authHeaders,
  }

  const next = {
    ...(await getCacheOptions("customers")),
  }

  return await sdk.client
    .fetch<{ customer: HttpTypes.StoreCustomer }>(`/store/customers/me`, {
      method: "GET",
      query: {
        fields: "*orders",
      },
      headers,
      next,
      cache: "force-cache",
    })
    .then(({ customer }) => customer)
    .catch(() => null)
}

export const updateCustomer = async (body: HttpTypes.StoreUpdateCustomer) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const updateRes = await sdk.store.customer
    .update(body, {}, headers)
    .then(({ customer }) => customer)
    .catch(medusaError)

  const cacheTag = await getCacheTag("customers")
  revalidateTag(cacheTag)

  return updateRes
}

export async function signup(_currentState: unknown, formData: FormData) {
  const password = formData.get("password") as string
  const customerForm = {
    email: formData.get("email") as string,
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    phone: formData.get("phone") as string,
  }

  try {
    const token = await sdk.auth.register("customer", "emailpass", {
      email: customerForm.email,
      password: password,
    })

    await setAuthToken(token as string)

    const headers = {
      ...(await getAuthHeaders()),
    }

    const { customer: createdCustomer } = await sdk.store.customer.create(customerForm, {}, headers)

    const loginToken = await sdk.auth.login("customer", "emailpass", {
      email: customerForm.email,
      password,
    })

    await setAuthToken(loginToken as string)

    const customerCacheTag = await getCacheTag("customers")
    revalidateTag(customerCacheTag)

    await transferCart()

    return createdCustomer
  } catch (error: any) {
    return mapErrorMessage(error)
  }
}

/**
 * Verify Google reCAPTCHA v3 token (works for v2 as well)
 */
async function verifyRecaptchaToken(token: string): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY || ""

  if (!secretKey) {
    console.warn("RECAPTCHA_SECRET_KEY not set, skipping verification")
    return true // Allow login if secret key is not configured
  }

  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
      }),
    })

    const data = await response.json()
    return data.success === true
  } catch (error) {
    console.error("reCAPTCHA verification error:", error)
    return false
  }
}

export async function login(_currentState: unknown, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const recaptchaToken = formData.get("g-recaptcha-response") as string | null

  // If reCAPTCHA token is provided, verify it
  if (recaptchaToken && recaptchaToken.trim() !== "") {
    const isValid = await verifyRecaptchaToken(recaptchaToken)
    if (!isValid) {
      return "Verification failed. Please complete the security check and try again."
    }
  }

  try {
    await sdk.auth.login("customer", "emailpass", { email, password }).then(async (token) => {
      await setAuthToken(token as string)
      const customerCacheTag = await getCacheTag("customers")
      revalidateTag(customerCacheTag)
    })
  } catch (error: any) {
    return mapErrorMessage(error)
  }

  try {
    await transferCart()
  } catch (error: any) {
    return mapErrorMessage(error)
  }
}

export async function signout(countryCode: string) {
  await sdk.auth.logout()

  await removeAuthToken()

  const customerCacheTag = await getCacheTag("customers")
  revalidateTag(customerCacheTag)

  await removeCartId()

  const cartCacheTag = await getCacheTag("carts")
  revalidateTag(cartCacheTag)

  redirect(`/${countryCode}/account`)
}

export async function requestPasswordReset(_currentState: unknown, formData: FormData) {
  const email = formData.get("email") as string

  if (!email) {
    return { success: false, error: "Email is required" }
  }

  try {
    // Use Medusa SDK to request password reset
    // This will trigger the auth.password_reset event that our subscriber handles
    await sdk.auth.resetPassword("customer", "emailpass", {
      identifier: email,
    })

    // The API returns a successful response always, even if the customer's email doesn't exist
    // This ensures that customer emails that don't exist are not exposed
    return { success: true, error: null }
  } catch (error: any) {
    console.error("Password reset request error:", error)
    return { success: false, error: mapErrorMessage(error) }
  }
}

export async function resetPassword(_currentState: unknown, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const token = formData.get("token") as string

  if (!email || !password || !token) {
    return {
      success: false,
      message: "Email, password, and token are required",
    }
  }

  try {
    // Use Medusa SDK to update the password with the reset token
    // The token is passed in the Authorization: Bearer header by the SDK
    await sdk.auth.updateProvider(
      "customer",
      "emailpass",
      {
        email,
        password,
      },
      token
    )

    // Automatically login after successful password reset
    const loginToken = await sdk.auth.login("customer", "emailpass", {
      email,
      password,
    })

    // Set the auth token in cookies
    await setAuthToken(loginToken as string)

    // Revalidate customer cache
    const customerCacheTag = await getCacheTag("customers")
    revalidateTag(customerCacheTag)

    // Transfer cart if exists
    try {
      await transferCart()
    } catch (cartError) {
      console.error("Cart transfer error:", cartError)
      // Don't fail password reset if cart transfer fails
    }

    return { success: true, message: "" }
  } catch (error: any) {
    console.error("Password reset error:", error)
    return { success: false, message: mapErrorMessage(error) }
  }
}

export async function transferCart() {
  const cartId = await getCartId()

  if (!cartId) {
    return
  }

  const headers = await getAuthHeaders()

  await sdk.store.cart.transferCart(cartId, {}, headers)

  const cartCacheTag = await getCacheTag("carts")
  revalidateTag(cartCacheTag)
}

export const addCustomerAddress = async (
  currentState: Record<string, unknown>,
  formData: FormData
): Promise<any> => {
  const isDefaultBilling = (currentState.isDefaultBilling as boolean) || false
  const isDefaultShipping = (currentState.isDefaultShipping as boolean) || false

  const address = {
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    company: (formData.get("company") as string) || "",
    address_1: formData.get("address_1") as string,
    address_2: formData.get("address_2") as string,
    city: formData.get("city") as string,
    postal_code: formData.get("postal_code") as string,
    province: formData.get("province") as string,
    country_code: formData.get("country_code") as string,
    phone: formData.get("phone") as string,
    is_default_billing: isDefaultBilling,
    is_default_shipping: isDefaultShipping,
    metadata: {
      address_type: (formData.get("address_type") as string) || "Home",
    },
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.customer
    .createAddress(address, {}, headers)
    .then(async ({ customer }) => {
      const customerCacheTag = await getCacheTag("customers")
      revalidateTag(customerCacheTag)
      return { success: true, error: null }
    })
    .catch((err) => {
      return { success: false, error: mapErrorMessage(err) }
    })
}

export const deleteCustomerAddress = async (addressId: string): Promise<void> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  await sdk.store.customer
    .deleteAddress(addressId, headers)
    .then(async () => {
      const customerCacheTag = await getCacheTag("customers")
      revalidateTag(customerCacheTag)
      return { success: true, error: null }
    })
    .catch((err) => {
      return { success: false, error: mapErrorMessage(err) }
    })
}

export const updateCustomerAddress = async (
  currentState: Record<string, unknown>,
  formData: FormData
): Promise<any> => {
  const addressId = (currentState.addressId as string) || (formData.get("addressId") as string)

  if (!addressId) {
    return { success: false, error: "Address ID is required" }
  }

  const address = {
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    company: (formData.get("company") as string) || "",
    address_1: formData.get("address_1") as string,
    address_2: formData.get("address_2") as string,
    city: formData.get("city") as string,
    postal_code: formData.get("postal_code") as string,
    province: formData.get("province") as string,
    country_code: formData.get("country_code") as string,
    metadata: {
      address_type: (formData.get("address_type") as string) || "Home",
    },
  } as HttpTypes.StoreUpdateCustomerAddress

  const phone = formData.get("phone") as string

  if (phone) {
    address.phone = phone
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.customer
    .updateAddress(addressId, address, {}, headers)
    .then(async () => {
      const customerCacheTag = await getCacheTag("customers")
      revalidateTag(customerCacheTag)
      return { success: true, error: null }
    })
    .catch((err) => {
      return { success: false, error: mapErrorMessage(err) }
    })
}

/**
 * Request email update - sends verification email with password reset link
 */
export const requestEmailUpdate = async (data: {
  current_password: string
  new_email: string
}): Promise<{ success: boolean; message: string; error?: string }> => {
  try {
    const authHeaders = await getAuthHeaders()

    if (!authHeaders || !("authorization" in authHeaders)) {
      return {
        success: false,
        message: "Not authenticated",
        error: "NOT_AUTHENTICATED",
      }
    }

    const headers = {
      "Content-Type": "application/json",
      "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
      ...authHeaders,
    }

    // Call Medusa backend to request email update
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/store/custom/email/req-email`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          current_password: data.current_password,
          new_email: data.new_email,
        }),
      }
    )

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to send verification email",
        error: result.type || "REQUEST_FAILED",
      }
    }

    return {
      success: true,
      message: result.message || "Verification email sent successfully",
    }
  } catch (error: any) {
    console.error("Email update request error:", error)
    return {
      success: false,
      message: error.message || "An error occurred",
      error: "UNKNOWN_ERROR",
    }
  }
}

/**
 * Verify email and set new password
 */
export const verifyEmailAndSetPassword = async (data: {
  token: string
  new_password: string
  new_email?: string
}): Promise<{
  success: boolean
  message: string
  new_email?: string
}> => {
  try {
    const headers = {
      "Content-Type": "application/json",
      "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
    }

    // Call Medusa backend to verify and update
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/store/custom/email/verify`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        token: data.token,
        new_password: data.new_password,
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Verification failed",
      }
    }

    // Revalidate customer cache
    const customerCacheTag = await getCacheTag("customers")
    revalidateTag(customerCacheTag)

    return {
      success: true,
      message: result.message || "Email and password updated successfully",
      new_email: result.new_email,
    }
  } catch (error: any) {
    console.error("Email verification error:", error)
    return {
      success: false,
      message: error.message || "Verification failed",
    }
  }
}

/**
 * Update customer password - requires current password for security
 */
export const updateCustomerPassword = async (data: {
  current_password: string
  new_password: string
}): Promise<{ success: boolean; message: string; error?: string }> => {
  try {
    const authHeaders = await getAuthHeaders()

    if (!authHeaders || !("authorization" in authHeaders)) {
      return {
        success: false,
        message: "Not authenticated",
        error: "NOT_AUTHENTICATED",
      }
    }

    const headers = {
      "Content-Type": "application/json",
      "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
      ...authHeaders,
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/store/custom/password/change`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          current_password: data.current_password,
          new_password: data.new_password,
        }),
      }
    )

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to update password",
        error: result.type || "REQUEST_FAILED",
      }
    }

    return {
      success: true,
      message: result.message || "Password updated successfully",
    }
  } catch (error: any) {
    console.error("Password update error:", error)
    return {
      success: false,
      message: error.message || "An error occurred",
      error: "UNKNOWN_ERROR",
    }
  }
}
