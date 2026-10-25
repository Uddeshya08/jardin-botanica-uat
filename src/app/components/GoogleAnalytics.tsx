"use client"

import Script from "next/script"
import { useEffect, useState } from "react"

const MEASUREMENT_ID = "G-NREJ5ZDPRL"

export default function GoogleAnalytics() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const updateConsent = () => {
      setEnabled(localStorage.getItem("jardinBotanica_cookieConsent") === "accepted")
    }
    updateConsent()
    window.addEventListener("jardinBotanica:cookie-consent", updateConsent)
    window.addEventListener("storage", updateConsent)
    return () => {
      window.removeEventListener("jardinBotanica:cookie-consent", updateConsent)
      window.removeEventListener("storage", updateConsent)
    }
  }, [])

  if (!enabled) return null

  return (
    <>
      <Script id="google-analytics-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${MEASUREMENT_ID}');
        `}
      </Script>
      <Script
        id="google-analytics-loader"
        src={`https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
    </>
  )
}
