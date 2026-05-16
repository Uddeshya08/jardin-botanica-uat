"use client"

import type { FormEvent } from "react"
import { useState, useTransition } from "react"

type NewsletterResult = {
  success: boolean
  message: string
}

export function useNewsletterSubscription() {
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
      const { subscribeToNewsletter } = await import("@lib/data/brevo")
      const result: NewsletterResult = await subscribeToNewsletter(trimmedEmail)

      setIsSuccess(result.success)
      setMessage(result.message)

      if (result.success) {
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
