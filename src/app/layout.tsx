import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"
import { Toaster } from "./components/ui/sonner"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <body className="overflow-x-hidden">
        <main className="relative">{props.children}</main>
        <Toaster />
      </body>
    </html>
  )
}
