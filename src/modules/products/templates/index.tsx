"use client"
import React, { Suspense, useEffect, useState } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import ProductActionsWrapper from "./product-actions-wrapper"
import { HttpTypes } from "@medusajs/types"
import { ProductContent, FeaturedSection, TestimonialsSection, FeaturedRitualTwoSection } from "../../../types/contentful"
// import { ProductHero } from "app/components/ProductHero"
// import React, {  Suspense } from 'react'
import { motion } from "motion/react"
import { Navigation } from "app/components/Navigation"
import { ProductHero } from "app/components/ProductHero"
import { StickyCartBar } from "app/components/StickyCartBar"
import { Afterlife } from "app/components/Afterlife"
import { PeopleAlsoBought } from "app/components/PeopleAlsoBought"
import { FeaturedRitual } from "app/components/FeaturedRitual"

import { CustomerTestimonials } from "app/components/CustomerTestimonials"
import { RippleEffect } from "app/components/RippleEffect"
import { PeopleAlsoBoughtTwo } from "app/components/PeopleAlsoBoughtTwo"
import { FeaturedRitualTwo } from "app/components/FeaturedRitualTwo"
import Featured from "app/components/Featured"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  productContent?: ProductContent | null
  featuredContent?: FeaturedSection | null
  testimonialsContent?: TestimonialsSection | null
  featuredRitualTwoContent?: FeaturedRitualTwoSection | null
}

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}
const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
  productContent,
  featuredContent,
  testimonialsContent,
  featuredRitualTwoContent,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  const [isScrolled, setIsScrolled] = useState(false)
  const [showStickyCart, setShowStickyCart] = useState(false)
  const [heroCartItem, setHeroCartItem] = useState<CartItem | null>(null)
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  const handleCartUpdate = (item: CartItem | null) => {
    setHeroCartItem(item)

    // Update cartItems array for navigation
    if (item && item.quantity > 0) {
      setCartItems((prevItems) => {
        const existingIndex = prevItems.findIndex(
          (cartItem) => cartItem.id === item.id
        )
        if (existingIndex >= 0) {
          // Update existing item
          const updatedItems = [...prevItems]
          updatedItems[existingIndex] = item
          return updatedItems
        } else {
          // Add new item
          return [...prevItems, item]
        }
      })
    } else if (item && item.quantity === 0) {
      // Remove item if quantity is 0
      setCartItems((prevItems) =>
        prevItems.filter((cartItem) => cartItem.id !== item.id)
      )
    }
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
      const shouldShowCart =
        scrollY > 450 && (heroCartItem === null || heroCartItem.quantity > 0)

      // Hide sticky cart when footer copyright is visible
      const footerElement = document.querySelector("footer")
      const copyrightElement = footerElement?.querySelector("p")

      if (
        copyrightElement &&
        copyrightElement.textContent?.includes("© 2025 Jardin Botanica")
      ) {
        const copyrightRect = copyrightElement.getBoundingClientRect()
        const isFooterVisible =
          copyrightRect.top < window.innerHeight && copyrightRect.bottom > 0

        setShowStickyCart(shouldShowCart && !isFooterVisible)
      } else {
        setShowStickyCart(shouldShowCart)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  console.log("products => ", product)
  console.log("productContent from Contentful => ", productContent)

  return (
    <>
      {/* my new code tamplate */}
      <div className="min-h-screen">
        <RippleEffect />
        <Navigation
          isScrolled={isScrolled}
          cartItems={cartItems}
          onCartUpdate={handleCartUpdate}
        />
        <div className="h-4"></div>
        <ProductHero
          product={product}
          countryCode={'in'} // e.g. "in"
          onCartUpdate={handleCartUpdate}
        />

        <StickyCartBar
          isVisible={showStickyCart}
          product={product}
          onUpdateHeroQuantity={handleHeroQuantityUpdate}
          onCartUpdate={handleCartUpdate}
          cartItems={cartItems}
        />

        <Afterlife product={product} />
        <PeopleAlsoBought product={product} />
        <FeaturedRitualTwo 
          key={featuredRitualTwoContent?.productHandle || featuredRitualTwoContent?.sectionKey || 'default'} 
          featuredRitualTwoContent={featuredRitualTwoContent} 
        />
        <CustomerTestimonials 
          key={testimonialsContent?.productHandle || testimonialsContent?.sectionKey || 'default'} 
          testimonialsContent={testimonialsContent} 
        />
        <Featured featuredContent={featuredContent} />
      </div>
    </>
  )
}

export default ProductTemplate
