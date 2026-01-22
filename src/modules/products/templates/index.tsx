"use client"
import type { HttpTypes } from "@medusajs/types"
import { Afterlife } from "app/components/Afterlife"
import { CustomerTestimonials } from "app/components/CustomerTestimonials"
import Featured from "app/components/Featured"
import { FeaturedRitualTwo } from "app/components/FeaturedRitualTwo"
import { Navigation } from "app/components/Navigation"
import { PeopleAlsoBought } from "app/components/PeopleAlsoBought"
import { ProductHero } from "app/components/ProductHero"
import { RippleEffect } from "app/components/RippleEffect"
import { StickyCartBar } from "app/components/StickyCartBar"
import { type CartItem, useCartItems } from "app/context/cart-items-context"
import { notFound } from "next/navigation"
import type React from "react"
import { useCallback, useEffect, useState } from "react"
import type {
  AfterlifeSection,
  FeaturedRitualTwoSection,
  FeaturedSection,
  FromTheLabSection,
  ProductContent,
  ProductInfoPanels,
  TestimonialsSection,
} from "../../../types/contentful"

interface RitualProduct {
  variantId: string
  name: string
  price: number
  currency: string
  image?: string
  isRitualProduct?: boolean
}

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  productContent?: ProductContent | null
  featuredContent?: FeaturedSection | null
  afterlifeContent?: AfterlifeSection | null
  testimonialsContent?: TestimonialsSection | null
  featuredRitualTwoContent?: FeaturedRitualTwoSection | null
  ritualProduct?: RitualProduct | null
  productInfoPanels?: ProductInfoPanels | null
  fromTheLabContent?: FromTheLabSection | null
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
  productContent,
  featuredContent,
  afterlifeContent,
  testimonialsContent,
  featuredRitualTwoContent,
  ritualProduct: ritualProductProp,
  productInfoPanels,
  fromTheLabContent,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  // Use cart context instead of local state
  const { cartItems, handleCartUpdate } = useCartItems()
  const [isScrolled, setIsScrolled] = useState(false)
  const [showStickyCart, setShowStickyCart] = useState(false)
  const [heroCartItem, setHeroCartItem] = useState<CartItem | null>(null)
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null)

  // Wrapper function to update both heroCartItem and context
  const handleCartUpdateWrapper = (item: CartItem | null) => {
    setHeroCartItem(item)
    // Update cart context (this will also update Navigation automatically)
    handleCartUpdate(item)
  }

  const handleHeroQuantityUpdate = (quantity: number) => {
    if (heroCartItem) {
      setHeroCartItem({
        ...heroCartItem,
        quantity: quantity,
      })
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setIsScrolled(scrollY > 50)

      // Show sticky cart after scrolling past the ProductHero section (approximately 450px for compact height)
      // Show by default, hide only when heroCartItem exists and quantity is explicitly 0
      const shouldShowCart = scrollY > 450 && (heroCartItem === null || heroCartItem.quantity > 0)

      // Hide sticky cart when footer copyright is visible
      const footerElement = document.querySelector("footer")
      const copyrightElement = footerElement?.querySelector("p")

      if (copyrightElement && copyrightElement.textContent?.includes("© 2025 Jardin Botanica")) {
        const copyrightRect = copyrightElement.getBoundingClientRect()
        const isFooterVisible = copyrightRect.top < window.innerHeight && copyrightRect.bottom > 0

        setShowStickyCart(shouldShowCart && !isFooterVisible)
      } else {
        setShowStickyCart(shouldShowCart)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [heroCartItem])

  return (
    <>
      {/* my new code tamplate */}
      <div className="min-h-screen">
        <RippleEffect />
        <Navigation
          isScrolled={isScrolled}
          cartItems={cartItems}
          onCartUpdate={handleCartUpdateWrapper}
          forceWhiteText={false}
        />
        <div className="h-4"></div>
        <ProductHero
          product={product}
          countryCode={countryCode}
          selectedVariantId={selectedVariantId}
          onUpdateHeroQuantity={handleHeroQuantityUpdate}
          onCartUpdate={handleCartUpdateWrapper}
          ritualProduct={ritualProductProp}
        />

        <StickyCartBar
          isVisible={showStickyCart}
          product={product as any}
          selectedVariantId={selectedVariantId}
          onUpdateHeroQuantity={handleHeroQuantityUpdate}
          onCartUpdate={handleCartUpdateWrapper}
          ritualProduct={ritualProductProp}
        />

        <Afterlife afterlifeContent={afterlifeContent} />
        <PeopleAlsoBought product={product as any} fromTheLabContent={fromTheLabContent} />
        <FeaturedRitualTwo
          key={`featured-ritual-two-${featuredRitualTwoContent?.productHandle ||
            featuredRitualTwoContent?.sectionKey ||
            "default"
            }`}
          featuredRitualTwoContent={featuredRitualTwoContent}
        />
        <CustomerTestimonials
          key={`customer-testimonials-${testimonialsContent?.productHandle || testimonialsContent?.sectionKey || "default"
            }`}
          testimonialsContent={testimonialsContent}
        />
        <Featured featuredContent={featuredContent} />
      </div>
    </>
  )
}

export default ProductTemplate
