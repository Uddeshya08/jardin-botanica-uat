import TrackOrder from "@modules/account/components/track-order"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Track my order",
  description: "Track your shipment using its AWB number.",
}

export default function TrackOrderPage() {
  return <TrackOrder />
}
