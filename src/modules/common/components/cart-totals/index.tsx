"use client"

import { convertToLocale } from "@lib/util/money"
import { Shield } from "lucide-react"

import type React from "react"

type CartTotalsProps = {
  totals: {
    total?: number | null
    subtotal?: number | null
    item_total?: number | null
    tax_total?: number | null
    shipping_total?: number | null
    discount_total?: number | null
    gift_card_total?: number | null
    currency_code: string
    shipping_subtotal?: number | null
  }
}

const CartTotals: React.FC<CartTotalsProps> = ({ totals }) => {
  const {
    currency_code,
    total,
    subtotal,
    item_total,
    tax_total,
    discount_total,
    gift_card_total,
    shipping_subtotal,
  } = totals

  return (
    <div>
      <div className="flex flex-col py-3 gap-y-2 font-din-arabi text-black/70 ">
        <div className="flex items-center justify-between">
          <span className="flex gap-x-1 items-center text-black/70 font-din-arabic">Subtotal</span>
          <span data-testid="cart-subtotal" data-value={subtotal || 0}>
            {convertToLocale({ amount: item_total ?? 0, currency_code })}
          </span>
        </div>
        {!!discount_total && (
          <div className="flex items-center justify-between">
            <span>Discount</span>
            <span
              className="text-ui-fg-interactive"
              data-testid="cart-discount"
              data-value={discount_total || 0}
            >
              - {convertToLocale({ amount: discount_total ?? 0, currency_code })}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-black/70 font-din-arabic">Shipping</span>
          <span data-testid="cart-shipping" data-value={shipping_subtotal || 0}>
            {convertToLocale({ amount: shipping_subtotal ?? 0, currency_code })}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="flex gap-x-1 items-center text-black/70 font-din-arabic">
            Taxes (GST added)
          </span>
          <span data-testid="cart-taxes" data-value={tax_total || 0}>
            {convertToLocale({ amount: tax_total ?? 0, currency_code })}
          </span>
        </div>
        {!!gift_card_total && (
          <div className="flex items-center justify-between">
            <span>Gift card</span>
            <span
              className="text-ui-fg-interactive"
              data-testid="cart-gift-card-amount"
              data-value={gift_card_total || 0}
            >
              - {convertToLocale({ amount: gift_card_total ?? 0, currency_code })}
            </span>
          </div>
        )}
      </div>
      <div className="h-px w-full border-b border-gray-200 my-4" />
      <div className="flex justify-between font-american-typewriter p-4 bg-white/50 rounded-xl">
        <span>Total</span>
        <span className="txt-xlarge-plus" data-testid="cart-total" data-value={total || 0}>
          {convertToLocale({ amount: total ?? 0, currency_code })}
        </span>
      </div>
      {/* <div className="h-px w-full border-b border-gray-200 mt-4" /> */}
      <div className="mt-6 p-4 bg-black/5 rounded-xl flex items-center justify-center space-x-2 opacity-100">
        <Shield className="w-4 h-4 text-black/50" />
        <p className="font-din-arabic text-xs text-black/50">Secure &amp; Encrypted Payment</p>
      </div>
    </div>
  )
}

export default CartTotals
