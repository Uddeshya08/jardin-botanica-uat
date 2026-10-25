"use client"

import { trackShipment, type ShipmentTracking } from "@lib/data/delhivery"
import { useState, type FormEvent } from "react"

export default function TrackOrder() {
  const [awb, setAwb] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [tracking, setTracking] = useState<ShipmentTracking | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError("")
    setTracking(null)
    try {
      const result = await trackShipment(awb)
      if (result.error) setError(result.error)
      else if (result.tracking) setTracking(result.tracking)
    } catch {
      setError("Tracking is temporarily unavailable. Please try again shortly.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-2xl" data-testid="track-order-page">
      <h1 className="font-american-typewriter text-2xl lg:text-3xl mb-4 text-black">
        Track my order
      </h1>
      <p className="font-din-arabic text-sm text-black/60 mb-8">
        Enter the Delhivery AWB number from your shipping confirmation to see the latest update.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label htmlFor="tracking-awb" className="block font-din-arabic text-sm text-black">
          AWB number
        </label>
        <input
          id="tracking-awb"
          name="awb"
          inputMode="numeric"
          autoComplete="off"
          required
          pattern="[0-9]{8,30}"
          maxLength={30}
          title="Enter an AWB number containing 8–30 digits"
          value={awb}
          onChange={(event) => {
            setAwb(event.target.value.trim())
            setError("")
            setTracking(null)
          }}
          disabled={loading}
          placeholder="Enter your AWB number"
          className="w-full border border-[#D8D2C7] bg-transparent px-4 py-3 font-din-arabic text-black focus:outline-none focus:border-black"
          aria-describedby={error ? "tracking-error" : undefined}
        />
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 bg-black text-white font-din-arabic hover:bg-black/90 disabled:opacity-50"
        >
          {loading ? "Checking…" : "Track order"}
        </button>
      </form>
      {error && <p id="tracking-error" role="alert" className="mt-4 font-din-arabic text-sm text-red-600">{error}</p>}
      <div aria-live="polite" aria-busy={loading}>
        {tracking && (
          <dl className="mt-8 border border-[#D8D2C7] p-6 space-y-4 font-din-arabic text-sm">
            {[
              ["AWB number", tracking.awb],
              ["Status", tracking.status],
              ["Current location", tracking.location],
              ["Last updated", tracking.updatedAt.replace("T", " ")],
              ["Update", tracking.remarks],
            ].filter(([, value]) => value).map(([label, value]) => (
              <div key={label}>
                <dt className="text-black/50 mb-1">{label}</dt>
                <dd className="text-black break-words">{value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </div>
  )
}
