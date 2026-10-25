"use client"

import { signout } from "@lib/data/customer"
import { LogOut } from "lucide-react"
import { useParams } from "next/navigation"
import { useState } from "react"

export default function MobileSignOut() {
  const { countryCode } = useParams<{ countryCode: string }>()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState("")

  const handleSignOut = async () => {
    setPending(true)
    setError("")
    try {
      await signout(countryCode)
    } catch {
      setError("Unable to sign out. Please try again.")
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="lg:hidden mx-6 pt-6 pb-8 border-t border-[#D8D2C7]">
      <button
        type="button"
        onClick={handleSignOut}
        disabled={pending}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-[#D8D2C7] text-black font-din-arabic hover:bg-black/5 disabled:opacity-50"
        data-testid="mobile-logout-button"
      >
        <LogOut className="w-5 h-5" />
        {pending ? "Signing out…" : "Sign Out"}
      </button>
      {error && <p role="alert" className="mt-3 text-sm text-red-600 font-din-arabic">{error}</p>}
    </div>
  )
}
