import { NextResponse } from "next/server"
import { getOrSetCart } from "@lib/data/cart"

export async function POST(request: Request) {
  try {
    const { countryCode } = await request.json()
    const country = (countryCode || "us").toLowerCase()
    const cart = await getOrSetCart(country)
    return NextResponse.json({ ok: true, cartId: cart.id })
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e?.message || "failed" }, { status: 500 })
  }
}


