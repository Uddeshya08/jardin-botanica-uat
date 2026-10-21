"use client"

import { requestCheckoutOtp, verifyCheckoutOtp } from "@lib/data/checkout-otp"
import { type FormEvent, useEffect, useState } from "react"

type Props = {
  cartId: string
  phone: string
  verified: boolean
  onVerified: () => void
}

export function CodPhoneVerification({ cartId, phone, verified, onVerified }: Props) {
  const [otp, setOtp] = useState("")
  const [codeSent, setCodeSent] = useState(false)
  const [pending, setPending] = useState(false)
  const [retryAfter, setRetryAfter] = useState(0)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (retryAfter <= 0) return
    const timer = window.setTimeout(() => setRetryAfter(retryAfter - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [retryAfter])

  async function sendCode() {
    setPending(true)
    setError("")
    setMessage("")
    const result = await requestCheckoutOtp(cartId, phone)
    setPending(false)

    if (!result.success) {
      setError(result.message)
      return
    }

    setCodeSent(true)
    setOtp("")
    setMessage(result.message)
    setRetryAfter(result.retryAfterSeconds || 60)
  }

  async function verifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!/^\d{4,9}$/.test(otp)) {
      setError("Enter the verification code sent to your phone.")
      return
    }

    setPending(true)
    setError("")
    const result = await verifyCheckoutOtp(cartId, phone, otp)
    setPending(false)

    if (!result.success) {
      setError(result.message)
      return
    }

    setMessage(result.message)
    onVerified()
  }

  return (
    <section
      className="mt-6 rounded-2xl border border-black/10 bg-white/50 p-6"
      aria-label="Cash on delivery verification"
    >
      <h3 className="font-din-arabic text-base font-semibold text-black">
        Verify your phone for Cash on Delivery
      </h3>
      <p className="mt-2 font-din-arabic text-sm text-black/70">
        {verified
          ? "Your phone is verified. You can place your order."
          : `We will send a one-time code to ${phone} before you place your order.`}
      </p>

      {!verified && (
        <div className="mt-4">
          {!codeSent ? (
            <button
              type="button"
              onClick={sendCode}
              disabled={pending}
              className="rounded-lg bg-black px-5 py-3 font-din-arabic text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {pending ? "Sending..." : "Send verification code"}
            </button>
          ) : (
            <form onSubmit={verifyCode} className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1">
                <label
                  htmlFor="checkout-cod-otp"
                  className="mb-2 block font-din-arabic text-sm text-black"
                >
                  Verification code
                </label>
                <input
                  id="checkout-cod-otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{4,9}"
                  maxLength={9}
                  value={otp}
                  onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))}
                  className="w-full rounded-lg border border-black/20 bg-white px-3 py-3 font-din-arabic text-black"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={pending || !/^\d{4,9}$/.test(otp)}
                className="rounded-lg bg-black px-5 py-3 font-din-arabic text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {pending ? "Verifying..." : "Verify phone"}
              </button>
            </form>
          )}
          {codeSent && (
            <button
              type="button"
              onClick={sendCode}
              disabled={pending || retryAfter > 0}
              className="mt-3 font-din-arabic text-sm text-black underline disabled:cursor-not-allowed disabled:opacity-50"
            >
              {retryAfter > 0 ? `Resend code in ${retryAfter}s` : "Resend code"}
            </button>
          )}
        </div>
      )}

      {message && (
        <p role="status" className="mt-3 font-din-arabic text-sm text-green-800">
          {message}
        </p>
      )}
      {error && (
        <p role="alert" className="mt-3 font-din-arabic text-sm text-red-700">
          {error}
        </p>
      )}
    </section>
  )
}
