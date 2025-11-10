import { NextRequest } from "next/server"
import { parseJsonBody, proxyMedusaRequest } from "../../utils"

type Params = {
  cartId: string
}

export async function POST(req: NextRequest, { params }: { params: Params }) {
  const { raw } = await parseJsonBody(req)

  return proxyMedusaRequest(req, `/store/carts/${params.cartId}`, {
    method: "POST",
    body: raw,
  })
}

export async function GET(req: NextRequest, { params }: { params: Params }) {
  return proxyMedusaRequest(req, `/store/carts/${params.cartId}`, {
    method: "GET",
  })
}

