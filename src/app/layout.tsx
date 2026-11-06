import { getSEOBaseURL } from "@lib/util/env"
import type { Metadata } from "next"
import GoogleAnalytics from "./components/GoogleAnalytics"
import MicrosoftClarity from "./components/MicrosoftClarity"
import MetaPixel from "./components/MetaPixel"
import { Toaster } from "./components/ui/sonner"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getSEOBaseURL()),
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon-256.png", type: "image/png", sizes: "256x256" },
    ],
  },
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light" className="overflow-x-hidden">
      <body className="overflow-x-hidden">
        <GoogleAnalytics />
        <MicrosoftClarity />
        <MetaPixel />
        <main className="relative">{props.children}</main>
        <Toaster />
      </body>
    </html>
  )
}
