"use client"

import { loginWithPhoneOtp, requestPhoneOtp } from "@lib/data/phone-otp"
import { ArrowLeft, Smartphone } from "lucide-react"
import { motion } from "motion/react"
import { type FormEvent, useEffect, useState } from "react"

type PhoneOtpLoginProps = {
  onBack: () => void
  onSuccess: () => void
}

export function PhoneOtpLogin({ onBack, onSuccess }: PhoneOtpLoginProps) {
  const [step, setStep] = useState<"phone" | "otp">("phone")
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [message, setMessage] = useState("")
  const [isError, setIsError] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [resendSeconds, setResendSeconds] = useState(0)

  useEffect(() => {
    if (resendSeconds <= 0) return
    const timer = window.setInterval(
      () => setResendSeconds((value) => Math.max(0, value - 1)),
      1000
    )
    return () => window.clearInterval(timer)
  }, [resendSeconds])

  const fullPhone = `+91${phone}`

  async function sendOtp(event?: FormEvent) {
    event?.preventDefault()
    if (phone.length !== 10) {
      setIsError(true)
      setMessage("Enter a valid 10-digit mobile number.")
      return
    }

    setIsPending(true)
    setMessage("")
    const result = await requestPhoneOtp(fullPhone)
    setIsPending(false)
    setIsError(!result.success)
    setMessage(result.message)

    if (result.success) {
      setStep("otp")
      setResendSeconds(result.retryAfterSeconds || 60)
    } else if (result.retryAfterSeconds) {
      setResendSeconds(result.retryAfterSeconds)
    }
  }

  async function verifyOtp(event: FormEvent) {
    event.preventDefault()
    if (otp.length !== 6) {
      setIsError(true)
      setMessage("Enter the 6-digit code sent to your phone.")
      return
    }

    setIsPending(true)
    setMessage("")
    const result = await loginWithPhoneOtp(fullPhone, otp)
    setIsPending(false)
    setIsError(!result.success)
    setMessage(result.message)
    if (result.success) onSuccess()
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 18 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-5"
    >
      <button
        type="button"
        onClick={onBack}
        className="font-din-arabic inline-flex items-center gap-2 text-sm text-black/65 hover:text-black"
      >
        <ArrowLeft className="h-4 w-4" />
        Sign in another way
      </button>

      {step === "phone" ? (
        <form onSubmit={sendOtp} className="space-y-5">
          <div className="text-center">
            <Smartphone className="mx-auto mb-3 h-7 w-7" />
            <p className="font-din-arabic text-sm text-black/70">
              Enter the mobile number linked to your account.
            </p>
          </div>
          <div>
            <label htmlFor="otp-phone" className="font-din-arabic mb-2 block text-sm tracking-wide">
              Mobile number*
            </label>
            <div className="flex border border-[#D8D2C7] focus-within:border-black">
              <span className="font-din-arabic flex items-center border-r border-[#D8D2C7] px-4 text-black/70">
                +91
              </span>
              <input
                id="otp-phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                value={phone}
                onChange={(event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="98765 43210"
                className="font-din-arabic min-w-0 flex-1 bg-transparent px-4 py-3.5 outline-none"
                required
              />
            </div>
          </div>
          {message && (
            <p
              role="status"
              className={`font-din-arabic text-sm ${isError ? "text-rose-600" : "text-black/70"}`}
            >
              {message}
            </p>
          )}
          <button
            type="submit"
            disabled={isPending || resendSeconds > 0}
            className="font-din-arabic w-full bg-black py-4 text-center text-white transition-opacity disabled:opacity-50"
          >
            {isPending
              ? "Sending code..."
              : resendSeconds > 0
                ? `Try again in ${resendSeconds}s`
                : "Send verification code"}
          </button>
        </form>
      ) : (
        <form onSubmit={verifyOtp} className="space-y-5">
          <div className="text-center">
            <p className="font-american-typewriter mb-2 text-xl">Enter verification code</p>
            <p className="font-din-arabic text-sm text-black/65">
              Sent to +91 {phone.slice(0, 5)} {phone.slice(5)}
            </p>
          </div>
          <div>
            <label htmlFor="phone-otp" className="sr-only">
              Six-digit verification code
            </label>
            <input
              id="phone-otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={otp}
              onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
              className="font-din-arabic w-full border border-[#D8D2C7] bg-transparent px-4 py-3.5 text-center text-xl tracking-[0.7em] outline-none focus:border-black"
              placeholder="000000"
              required
            />
          </div>
          {message && (
            <p
              role="status"
              className={`font-din-arabic text-sm ${isError ? "text-rose-600" : "text-black/70"}`}
            >
              {message}
            </p>
          )}
          <button
            type="submit"
            disabled={isPending}
            className="font-din-arabic w-full bg-black py-4 text-center text-white transition-opacity disabled:opacity-50"
          >
            {isPending ? "Verifying..." : "Verify and sign in"}
          </button>
          <div className="font-din-arabic flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={() => {
                setStep("phone")
                setOtp("")
                setMessage("")
                setResendSeconds(0)
              }}
              className="underline underline-offset-4"
            >
              Change number
            </button>
            <button
              type="button"
              onClick={() => sendOtp()}
              disabled={isPending || resendSeconds > 0}
              className="underline underline-offset-4 disabled:no-underline disabled:opacity-50"
            >
              {resendSeconds > 0 ? `Resend in ${resendSeconds}s` : "Resend code"}
            </button>
          </div>
        </form>
      )}
    </motion.div>
  )
}
