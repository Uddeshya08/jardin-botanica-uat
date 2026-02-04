import LocalizedClientLink from "@modules/common/components/localized-client-link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "404",
  description: "Something went wrong",
}

export default async function NotFound() {
  return (
    <div
      className="flex flex-col gap-6 items-center justify-center min-h-[calc(100vh-64px)] w-full"
      style={{ backgroundColor: "#e3e3d8" }}
    >
      <div className="flex flex-col items-center max-w-md text-center px-6 py-12 border border-black/5 mx-4">
        <h1 className="text-6xl font-typewriter text-black mb-2 tracking-tighter opacity-90">
          404
        </h1>
        <div className="h-px w-16 bg-black/20 my-6"></div>
        <p className="text-base font-dinRegular text-black/80 tracking-wide uppercase mb-8">
          The page you tried to access does not exist.
        </p>
        <LocalizedClientLink
          href="/"
          className="bg-black text-white px-8 py-3 text-xs tracking-[0.2em] font-dinRegular hover:bg-black/80 transition-colors uppercase"
        >
          Return to Frontpage
        </LocalizedClientLink>
      </div>
    </div>
  )
}
