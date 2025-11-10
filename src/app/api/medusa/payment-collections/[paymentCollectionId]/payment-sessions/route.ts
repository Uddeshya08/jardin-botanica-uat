import { NextRequest } from "next/server"
import { parseJsonBody, proxyMedusaRequest } from "../../../utils"

type Params = {
  paymentCollectionId: string
}

export async function POST(req: NextRequest, { params }: { params: Params }) {
  const { raw } = await parseJsonBody(req)

  return proxyMedusaRequest(
    req,
    `/store/payment-collections/${params.paymentCollectionId}/payment-sessions`,
    {
      method: "POST",
      body: raw,
    }
  )
}

