import InteractiveLink from "@modules/common/components/interactive-link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "404",
  description: "Something went wrong",
}

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
      <h1 className="text-2xl-semi font-din-arabic text-sm text-black/70 tracking-wide">
        Page not found
      </h1>
      <p className="text-small-regular font-din-arabic text-sm text-black/70 tracking-wide">
        The cart you tried to access does not exist. Clear your cookies and try again.
      </p>
      <InteractiveLink href="/">Go to frontpage</InteractiveLink>
    </div>
  )
}
