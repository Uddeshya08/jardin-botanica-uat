import { NextRequest } from "next/server"
import { proxyMedusaRequest } from "../utils"

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const search = url.search

  return proxyMedusaRequest(req, `/store/shipping-options${search}`, {
    method: "GET",
  })
}

