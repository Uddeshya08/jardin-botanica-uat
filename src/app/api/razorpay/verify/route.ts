import { NextResponse } from "next/server"

const BACKEND_URL = process.env.MEDUSA_BACKEND_URL || process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || process.env.MEDUSA_PUBLISHABLE_KEY

export async function POST(request: Request) {
  try {
    if (!BACKEND_URL) {
      return NextResponse.json({ error: "MEDUSA_BACKEND_URL not configured" }, { status: 500 })
    }
    if (!PUBLISHABLE_KEY) {
      return NextResponse.json({ error: "Publishable API key not configured" }, { status: 500 })
    }

    const payload = await request.json()
    const res = await fetch(`${BACKEND_URL}/store/custom/razorpay/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key": PUBLISHABLE_KEY,
      },
      body: JSON.stringify(payload),
    })

    const json = await res.json().catch(() => ({}))
    return NextResponse.json(json, { status: res.status })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "failed" }, { status: 500 })
  }
}


