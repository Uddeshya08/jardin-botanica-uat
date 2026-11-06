import { NextRequest, NextResponse } from "next/server"
import { createHash } from "node:crypto"
import { Client } from "@medusajs/js-sdk"

export const runtime = "nodejs"
const rateLimits = new Map<string, { count: number; expires: number }>()
// The general storefront SDK logs custom headers in development. This dedicated
// server client must never log the relay credential, including during local tests.
const relayClient = new Client({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || process.env.MEDUSA_BACKEND_URL || "http://localhost:9000",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
  debug: false,
})

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin")
  if (!origin || origin !== new URL(req.url).origin) {
    return NextResponse.json({ queued: false }, { status: 403 })
  }
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
  const rateKey = createHash("sha256").update(ip || "unknown").digest("hex")
  const now = Date.now(), previous = rateLimits.get(rateKey)
  const bucket = previous && previous.expires > now ? previous : { count: 0, expires: now + 60000 }
  if (++bucket.count > 120) return NextResponse.json({ queued: false }, { status: 429 })
  if (rateLimits.size >= 10000) rateLimits.delete(rateLimits.keys().next().value!)
  rateLimits.set(rateKey, bucket)
  const secret = process.env.META_CAPI_RELAY_SECRET?.trim()
  const dataset = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim()
  if (!secret || secret.length < 32 || !dataset || !/^\d+$/.test(dataset)) {
    return NextResponse.json({ state: "disabled", queued: false })
  }
  try {
    if (Number(req.headers.get("content-length") || 0) > 8192) {
      return NextResponse.json({ queued: false }, { status: 413 })
    }
    const text = await req.text()
    if (Buffer.byteLength(text) > 8192) return NextResponse.json({ queued: false }, { status: 413 })
    const body = JSON.parse(text)
    const productionOrigin = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.jardinbotanica.com").origin
    if (origin !== productionOrigin) return NextResponse.json({ queued: false, state: "preview" })
    const headers = { "x-meta-relay-secret": secret }
    if (body?.event_name === "Purchase") {
      if (typeof body.order_id !== "string" || !/^order_[a-zA-Z0-9]+$/.test(body.order_id)) {
        return NextResponse.json({ state: "skipped" }, { status: 400 })
      }
      const result = await relayClient.fetch<Record<string, unknown>>(`/store/custom/meta/purchase/${body.order_id}`, {
        method: "GET", query: { dataset_id: dataset }, headers, cache: "no-store", signal: AbortSignal.timeout(5000),
      })
      return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } })
    }
    if (!["PageView", "ViewContent", "AddToCart"].includes(body?.event_name)) {
      return NextResponse.json({ queued: false }, { status: 400 })
    }
    // Use the HTTP browser context, not client-supplied identities or IP addresses.
    const userAgent = req.headers.get("user-agent")?.slice(0, 1024)
    if (!userAgent) return NextResponse.json({ queued: false }, { status: 400 })
    const source = new URL(typeof body.event_source_url === "string" ? body.event_source_url : "", origin)
    if (source.origin !== origin) return NextResponse.json({ queued: false }, { status: 400 })
    // Vercel Preview traffic is never presented as production traffic.
    const result = await relayClient.fetch<{ queued: boolean }>("/store/custom/meta/events", {
      method: "POST", headers, cache: "no-store", signal: AbortSignal.timeout(5000), body: {
        dataset_id: dataset, event_name: body.event_name, event_id: body.event_id,
        event_time: body.event_time, event_source_url: source.href, custom_data: body.custom_data,
        user_data: { client_user_agent: userAgent, ...(ip ? { client_ip_address: ip } : {}),
          ...(typeof body.fbp === "string" ? { fbp: body.fbp } : {}),
          ...(typeof body.fbc === "string" ? { fbc: body.fbc } : {}) },
      },
    })
    return NextResponse.json(result)
  } catch {
    // Do not return provider responses, request bodies or the relay credential.
    return NextResponse.json({ queued: false, state: "unavailable" }, { status: 503 })
  }
}
