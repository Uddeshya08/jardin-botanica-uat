"use client"

import { Button, Heading } from "@medusajs/ui"
import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"
import DiscountCode from "@modules/checkout/components/discount-code"
import { HttpTypes } from "@medusajs/types"

type SummaryProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
}

function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return "address"
  } else if (cart?.shipping_methods?.length === 0) {
    return "delivery"
  } else {
    return "payment"
  }
}

const Summary = ({ cart }: SummaryProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()
  const step = getCheckoutStep(cart)

  const handleCheckout = async () => {
    try {
      console.log("Checkout button clicked - setting loading to true")
      setIsLoading(true)
      setError(null)

      // Validate cart has items
      if (!cart?.items || cart.items.length === 0) {
        console.log("Cart validation failed - no items")
        setIsLoading(false)
        throw new Error("Your cart is empty")
      }

      // Validate cart region
      if (!cart.region) {
        console.log("Cart validation failed - no region")
        setIsLoading(false)
        throw new Error("Cart region is not set")
      }

      // Extract country code from pathname (e.g., /in/cart -> in)
      const pathParts = pathname.split('/')
      const countryCode = pathParts[1] || 'in'
      console.log("Country code:", countryCode, "Checkout step:", step)

      // Add minimum delay to show loading state (800ms for better visibility)
      const minLoadingTime = new Promise(resolve => setTimeout(resolve, 800))
      
      console.log("Starting navigation to checkout...")
      // Navigate to checkout
      const navigationPromise = router.push(`/${countryCode}/checkout?step=${step}`)

      // Wait for both minimum loading time and navigation to complete
      await Promise.all([minLoadingTime, navigationPromise])
      
      console.log("Navigation completed")
      // Keep loading state true during navigation
      // It will be reset when the page changes
    } catch (err) {
      console.error("Checkout error:", err)
      setIsLoading(false)
      setError(err instanceof Error ? err.message : "Failed to proceed to checkout")
    }
  }

  return (
    <div className="flex flex-col gap-y-4">
      <Heading level="h2" className="text-[2rem] leading-[2.75rem]">
        Summary
      </Heading>
      <DiscountCode cart={cart} />
      <Divider />
      <CartTotals totals={cart} />
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded relative text-sm">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <button
        type="button"
        className={`w-full h-12 relative rounded font-medium transition-all duration-200 ${
          isLoading 
            ? 'bg-gray-600 cursor-wait opacity-90' 
            : 'bg-black hover:bg-gray-900 cursor-pointer'
        } ${
          (!cart?.items || cart.items.length === 0) && !isLoading
            ? 'opacity-50 cursor-not-allowed'
            : ''
        }`}
        onClick={handleCheckout}
        disabled={isLoading || !cart?.items || cart.items.length === 0}
        data-testid="checkout-button"
        style={{
          color: 'white',
          border: 'none',
          outline: 'none',
        }}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            <svg 
              className="animate-spin h-5 w-5 text-white" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
              style={{ 
                animation: 'spin 1s linear infinite',
              }}
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span style={{ fontWeight: 500 }}>Processing...</span>
          </span>
        ) : (
          "Go to checkout"
        )}
      </button>
    </div>
  )
}

export default Summary
