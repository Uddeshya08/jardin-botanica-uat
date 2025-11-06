import { NextResponse } from "next/server"
import { retrieveCart, initiatePaymentSession } from "@lib/data/cart"

export async function POST() {
  try {
    const cart = await retrieveCart()
    if (!cart) {
      return NextResponse.json({ ok: false, message: "No cart found" }, { status: 400 })
    }

    // Ensure Razorpay session exists
    await initiatePaymentSession(cart as any, { provider_id: "pp_razorpay_razorpay" } as any)

    const updatedCart = await retrieveCart()
    const paymentSession = updatedCart?.payment_collection?.payment_sessions?.find(
      (s: any) => s.provider_id?.startsWith("pp_razorpay") && s.status === "pending"
    )

    if (!paymentSession) {
      return NextResponse.json({ ok: false, message: "No Razorpay session" }, { status: 400 })
    }

    const razorpayOrderId = (paymentSession.data as any)?.razorpayOrder?.id
    const amount = paymentSession.amount
    const currency = updatedCart?.currency_code?.toUpperCase()
    const name = `${updatedCart?.billing_address?.first_name || ""} ${updatedCart?.billing_address?.last_name || ""}`.trim()
    const email = updatedCart?.email
    const contact = updatedCart?.shipping_address?.phone

    return NextResponse.json({
      ok: true,
      razorpayOrderId,
      amount,
      currency,
      prefill: { name, email, contact },
    })
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e?.message || "failed" }, { status: 500 })
  }
}


