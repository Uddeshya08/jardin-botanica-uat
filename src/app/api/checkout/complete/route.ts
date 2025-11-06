import { NextResponse } from "next/server"
import { sdk } from "@lib/config"
import { getAuthHeaders, getCartId } from "@lib/data/cookies"

export async function POST() {
  try {
    const id = await getCartId()
    if (!id) {
      return NextResponse.json({ ok: false, message: "No cart id" }, { status: 400 })
    }
    const headers = { ...(await getAuthHeaders()) }
    const res = await sdk.store.cart.complete(id, {}, headers)
    return NextResponse.json({ ok: true, result: res })
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e?.message || "failed" }, { status: 500 })
  }
}


