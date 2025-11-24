import { Metadata } from "next"

import { listCartOptions, retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { getBaseURL } from "@lib/util/env"
import { StoreCartShippingOption } from "@medusajs/types"
import CartMismatchBanner from "@modules/layout/components/cart-mismatch-banner"
import { LedgerProvider } from "app/context/ledger-context"
import { AuthProvider } from "app/context/auth-context"
import { CartItemsProvider } from "app/context/cart-items-context"
import FreeShippingPriceNudge from "@modules/shipping/components/free-shipping-price-nudge"
import { Footer } from "app/components/Footer"
import ScrollIndicator from "@modules/common/components/scroll-indicator"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function PageLayout(props: { children: React.ReactNode }) {
  const customer = await retrieveCustomer()
  const cart = await retrieveCart()
  let shippingOptions: StoreCartShippingOption[] = []

  if (cart) {
    const { shipping_options } = await listCartOptions()

    shippingOptions = shipping_options
  }
    const cartItems = cart?.items?.map(item => {
      console.log('🔍 Layout - Server cart item unit_price:', {
        id: item.id,
        title: item.title,
        unit_price: item.unit_price,
        unit_price_type: typeof item.unit_price,
        total: item.total,
      })
      // Check if unit_price is already in major units or minor units
      // If unit_price > 10000, likely in minor units (paise), divide by 100
      // Otherwise, it's already in major units (rupees)
      const price = item.unit_price > 10000 ? item.unit_price / 100 : item.unit_price
      return {
        id: item.id,
        name: item.title,
        price: price,
        quantity: item.quantity,
        image: item.thumbnail
      }
    }) || []

  return (
    <>
      {/* <Nav  cartItems={cartItems}
        /> */}
      {customer && cart && (
        <CartMismatchBanner customer={customer} cart={cart} />
      )}

      {cart && (
        <FreeShippingPriceNudge
          variant="popup"
          cart={cart}
          shippingOptions={shippingOptions}
        />
      )}
      <AuthProvider customer={customer}>
        <LedgerProvider>
          <CartItemsProvider initialCartItems={cartItems}>
            {props.children}
            <Footer />
            <ScrollIndicator />
          </CartItemsProvider>
        </LedgerProvider>
      </AuthProvider>
    </>
  )
}
