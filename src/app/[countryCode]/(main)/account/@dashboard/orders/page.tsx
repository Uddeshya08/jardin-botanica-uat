import { listOrders } from "@lib/data/orders"

import OrderOverview from "@modules/account/components/order-overview"
import TransferRequestForm from "@modules/account/components/transfer-request-form"
import Divider from "@modules/common/components/divider"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Orders",
  description: "Overview of your previous orders.",
}

export default async function Orders() {
  const orders = await listOrders()

  return (
    <div className="w-full" data-testid="orders-page-wrapper">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="font-american-typewriter text-2xl lg:text-3xl mb-4 lg:mb-4 text-black">
          Orders
        </h1>
      </div>
      <div>
        <OrderOverview orders={orders || []} />
        <Divider className="my-16" />
        {/* <TransferRequestForm /> */}
      </div>
    </div>
  )
}
