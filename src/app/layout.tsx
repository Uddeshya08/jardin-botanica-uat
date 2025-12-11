import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import { Toaster } from "./components/ui/sonner"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light" className="overflow-x-hidden">
      <link rel="stylesheet" href="https://use.typekit.net/zud1nbn.css" />
      <body className="overflow-x-hidden">
        <main className="relative">{props.children}</main>
        <Toaster />
      </body>
    </html>
  )
}
