import InteractiveLink from "@modules/common/components/interactive-link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "404",
  description: "Something went wrong",
}

export default function NotFound() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-[calc(100vh-64px)]">
      <h1 className="text-2xl-semi font-din-arabic text-sm text-black/70 tracking-wide">
        404
      </h1>
      <p className="text-small-regular font-din-arabic text-sm text-black/70 tracking-wide">
        The specimen isn’t in this drawer. Try the menu or search.
      </p>
      <InteractiveLink href="/">Go to frontpage</InteractiveLink>
    </div>
  )
}
