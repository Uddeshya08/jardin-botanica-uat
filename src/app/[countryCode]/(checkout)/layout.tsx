import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { AuthProvider } from "app/context/auth-context"
import { CartItemsProvider } from "app/context/cart-items-context"
import { LedgerProvider } from "app/context/ledger-context"
import CheckoutNavigation from "./components/checkout-navigation"

export default async function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const customer = await retrieveCustomer()
  const cart = await retrieveCart()

  // Transform cart items to the format expected by Navigation
  const cartItems =
    cart?.items?.map((item) => {
      // Check if unit_price is already in major units or minor units
      // If unit_price > 10000, likely in minor units (paise), divide by 100
      // Otherwise, it's already in major units (rupees)
      const price = item.unit_price > 10000 ? item.unit_price / 100 : item.unit_price
      return {
        id: item.id,
        name: item.title,
        price: price,
        quantity: item.quantity,
        image: item.thumbnail,
      }
    }) || []

  return (
    <AuthProvider customer={customer}>
      <LedgerProvider>
        <CartItemsProvider initialCartItems={cartItems}>
          <div className="w-full bg-[#e3e3d8] relative small:min-h-screen">
            <CheckoutNavigation />
            <div className="relative pt-[106px]" data-testid="checkout-container">
              {children}
            </div>
          </div>
        </CartItemsProvider>
      </LedgerProvider>
    </AuthProvider>
  )
}
