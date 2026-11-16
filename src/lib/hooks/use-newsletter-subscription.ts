"use client"

import type { FormEvent } from "react"
import { useState, useTransition } from "react"
import { trackGoogleEvent } from "@lib/util/google-events"

type NewsletterResult = {
  success: boolean
  message: string
}

export function useNewsletterSubscription(audience: "newsletter" | "early-access" = "newsletter") {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  const subscribe = () => {
    const trimmedEmail = email.trim()

    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setIsSuccess(false)
      setMessage("Please enter a valid email address")
      return
    }

    startTransition(async () => {
      const { subscribeToNewsletter, subscribeToEarlyAccess } = await import("@lib/data/brevo")
      const result: NewsletterResult = await (
        audience === "early-access" ? subscribeToEarlyAccess : subscribeToNewsletter
      )(trimmedEmail)

      setIsSuccess(result.success)
      setMessage(result.message)

      if (result.success) {
        trackGoogleEvent("generate_lead", { lead_source: audience })
        setEmail("")
        setTimeout(() => {
          setMessage("")
        }, 5000)
      }
    })
  }

  const handleSubmit = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault()
    subscribe()
  }

  return {
    email,
    setEmail,
    message,
    isSuccess,
    isPending,
    handleSubmit,
    subscribe,
  }
}
