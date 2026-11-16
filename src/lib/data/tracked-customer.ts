"use client"

import { signup as signupServer } from "./customer"
import { trackGoogleEvent } from "@lib/util/google-events"

export async function signup(...args: Parameters<typeof signupServer>) {
  const result = await signupServer(...args)
  if (result && typeof result === "object" && typeof result.id === "string") {
    trackGoogleEvent("sign_up", { method: "email" }, result.id)
  }
  return result
}
