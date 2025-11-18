import { Heading } from "@medusajs/ui"

import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"
import Package from "@modules/common/icons/package"

const CheckoutSummary = ({ cart }: { cart: any }) => {
  return (
    <div className="sticky top-0 flex flex-col-reverse small:flex-col gap-y-8 py-8 small:py-0 ">
      <div className="w-full bg-[#e3e3d8] flex flex-col gap-4">
        <div className="flex items-center gap-3 mb-6">
          <Package className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Order Summary</h2>
        </div>

        <ItemsPreviewTemplate cart={cart} />
        <Divider className="my-6" />
        <CartTotals totals={cart} />
        <div className="my-6">
          <DiscountCode cart={cart} />
        </div>
      </div>
    </div>
  )
}

export default CheckoutSummary
