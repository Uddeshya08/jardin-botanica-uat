import { Heading } from "@medusajs/ui"

import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"
import Package from "@modules/common/icons/package"

const CheckoutSummary = ({ cart }: { cart: any }) => {
  return (
    <div className="lg:sticky lg:top-28 h-fit bg-white/60 backdrop-blur-md rounded-2xl md:rounded-3xl p-4 md:p-8 border border-white/80 shadow-xl">
      <div className="flex items-center gap-3 mb-2">
        <h2 className="font-american-typewriter mb-6 flex items-center space-x-2">
          <Package className="w-5 h-5" />
          <span>Order Summary</span>
        </h2>
      </div>

      <ItemsPreviewTemplate cart={cart} />

      <div>
        <DiscountCode cart={cart} />
      </div>

      <Divider />

      <CartTotals totals={cart} />
    </div>
  )
}

export default CheckoutSummary
