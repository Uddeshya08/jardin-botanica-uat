"use client"

import { trackMetaPageView } from "@lib/util/meta-pixel"
import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useRef } from "react"

export default function MetaPageView() {
  const pathname = usePathname()
  const search = useSearchParams()?.toString() || ""
  const lastPage = useRef<string | undefined>(undefined)

  useEffect(() => {
    if (!pathname) return
    const page = `${pathname}?${search}`
    const send = () => {
      if (lastPage.current !== page && trackMetaPageView()) lastPage.current = page
    }
    send()
    // A visitor who accepts after initially rejecting can track the current page.
    window.addEventListener("jardinBotanica:cookie-consent", send)
    return () => window.removeEventListener("jardinBotanica:cookie-consent", send)
  }, [pathname, search])

  return null
}
