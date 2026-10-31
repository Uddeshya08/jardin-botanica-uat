"use client"

import { saveMetaConsent } from "@lib/data/meta-consent"
import { useId, useState } from "react"

type Props = {
  cartId: string
  savedConsent: boolean
  onSavingChange: (saving: boolean) => void
}

export function MarketingConsent({ cartId, savedConsent, onSavingChange }: Props) {
  const id = useId()
  const [accepted, setAccepted] = useState(savedConsent === true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateConsent = async (next: boolean) => {
    setSaving(true)
    onSavingChange(true)
    setError(null)
    try {
      const result = await saveMetaConsent(cartId, next)
      if (result.success) setAccepted(next)
      else setError(result.error || "We couldn't save this preference. Please try again.")
    } catch {
      setError("We couldn't save this preference. Your previous choice is still selected. Please try again.")
    } finally {
      setSaving(false)
      onSavingChange(false)
    }
  }

  return (
    <div className="mt-6 font-din-arabic text-sm text-black/70" aria-busy={saving}>
      <label htmlFor={id} className="flex items-start gap-3 cursor-pointer">
        <input
          id={id}
          type="checkbox"
          checked={accepted}
          disabled={saving}
          onChange={(event) => void updateConsent(event.target.checked)}
          aria-describedby={`${id}-details${error ? ` ${id}-error` : ""}`}
          className="mt-1 h-4 w-4 shrink-0 accent-black disabled:cursor-wait"
        />
        <span>Allow Jardin Botanica to share order information with Meta to measure advertising performance.</span>
      </label>
      <p id={`${id}-details`} className="mt-2 ml-7 text-xs text-black/60">
        Optional. You can place your order without agreeing. See our{" "}
        <a href="/in/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline">Privacy Policy</a>.
      </p>
      {saving && <p role="status" className="mt-2 ml-7 text-xs">Saving preference…</p>}
      {error && <p id={`${id}-error`} role="alert" className="mt-2 ml-7 text-xs text-red-700">{error}</p>}
    </div>
  )
}
