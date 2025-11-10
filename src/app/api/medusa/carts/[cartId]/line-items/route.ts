import { NextRequest, NextResponse } from "next/server"
import { parseJsonBody, proxyMedusaRequest } from "../../../utils"

type Params = {
  cartId: string
}

export async function POST(req: NextRequest, { params }: { params: Params }) {
  const { parsed, raw } = await parseJsonBody<Record<string, unknown>>(req)

  if (!parsed || typeof parsed !== "object") {
    return NextResponse.json(
      { message: "Missing line item payload" },
      { status: 400 }
    )
  }

  return proxyMedusaRequest(
    req,
    `/store/carts/${params.cartId}/line-items`,
    {
      method: "POST",
      body: raw ?? JSON.stringify(parsed),
    }
  )
}

