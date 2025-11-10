import { NextRequest } from "next/server"
import { parseJsonBody, proxyMedusaRequest } from "../utils"

export async function POST(req: NextRequest) {
  const { raw } = await parseJsonBody(req)

  return proxyMedusaRequest(req, "/store/payment-collections", {
    method: "POST",
    body: raw,
  })
}

