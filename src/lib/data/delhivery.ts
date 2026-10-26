"use server"

import { sdk } from "@lib/config"
import { getAuthHeaders } from "./cookies"

export type ShipmentTracking = {
  awb: string
  status: string
  location: string
  updatedAt: string
  remarks: string
}

export async function trackShipment(awb: string): Promise<
  { tracking: ShipmentTracking; error?: never } | { error: string; tracking?: never }
> {
  const waybill = awb.trim()
  if (!/^\d{8,30}$/.test(waybill)) {
    return { error: "Please enter a valid AWB number (8–30 digits)." }
  }

  const headers = await getAuthHeaders()
  if (!("authorization" in headers)) {
    return { error: "Please sign in to track your order." }
  }

  try {
    const data = await sdk.client.fetch<{
      ShipmentData?: { Shipment?: {
        AWB?: string
        Status?: {
          Status?: string
          StatusLocation?: string
          StatusDateTime?: string
          Instructions?: string
        }
      } }[]
    }>(`/store/custom/delhivery/track/${encodeURIComponent(waybill)}`, {
      method: "GET",
      headers,
      cache: "no-store",
    })
    const shipment = data.ShipmentData?.[0]?.Shipment
    if (!shipment?.Status?.Status) {
      return { error: "No tracking updates found. Check your AWB number or try again after dispatch." }
    }

    return {
      tracking: {
        awb: waybill,
        status: shipment.Status.Status,
        location: shipment.Status.StatusLocation || "",
        updatedAt: shipment.Status.StatusDateTime || "",
        remarks: shipment.Status.Instructions || "",
      },
    }
  } catch {
    return { error: "Tracking is temporarily unavailable. Please try again shortly." }
  }
}

export async function checkPincodeServiceability(pincode: string) {
  const headers = {
    ...(await getAuthHeaders()),
  }

  return await sdk.client.fetch(`/store/custom/delhivery/serviceability?pincode=${pincode}`, {
    method: "GET",
    headers,
  })
}
