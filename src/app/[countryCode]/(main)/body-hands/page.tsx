"use client"

import { getProductCategoryByHandle } from "@lib/data/contentful"
import { getProductByHandle } from "@lib/data/products"
import { BodyHandsPage } from "app/components/BodyHandsPage"
import { Navigation } from "app/components/Navigation"
import { RippleEffect } from "app/components/RippleEffect"
import { useCartItems } from "app/context/cart-items-context"
import { useParams } from "next/navigation"
import React, { useEffect, useState } from "react"
import type { ProductCategory } from "../../../../types/contentful"

// Track which products we've already seen to avoid duplicates
// Returns only the subCategories with their product handles, filtering out duplicates
function getSubCategoriesWithProducts(
  category: ProductCategory
): { name: string; handles: string[] }[] {
  const seenProducts = new Set<string>()
  const result: { name: string; handles: string[] }[] = []

  if (category.subCategories) {
    for (const subCategory of category.subCategories) {
      const subCategoryHandles: string[] = []

      if (subCategory.productHandles) {
        for (const handle of subCategory.productHandles) {
          // Only add if we haven't seen this product before
          if (!seenProducts.has(handle)) {
            seenProducts.add(handle)
            subCategoryHandles.push(handle)
          }
        }
      }

      // Only include subCategory if it has products
      if (subCategoryHandles.length > 0) {
        result.push({
          name: subCategory.name,
          handles: subCategoryHandles,
        })
      }
    }
  }

  return result
}

// Transform Medusa product to BodyHandsPage Product format
function transformMedusaProduct(medusaProduct: any, subCategoryName: string) {
  const metadata = medusaProduct.metadata || {}

  console.log(metadata)

  // Get price from cheapest variant
  let price = 0
  if (medusaProduct.variants && medusaProduct.variants.length > 0) {
    const cheapestVariant = medusaProduct.variants.reduce((min: any, variant: any) => {
      const variantPrice = variant.calculated_price?.calculated_amount || 0
      return variantPrice < min ? variantPrice : min
    }, Infinity)
    price = cheapestVariant === Infinity ? 0 : cheapestVariant
  }

  // Get size from options or metadata
  let size = ""
  if (medusaProduct.options && medusaProduct.options.length > 0) {
    const sizeOption = medusaProduct.options.find(
      (o: any) =>
        o.title?.toLowerCase().includes("size") || o.title?.toLowerCase().includes("quantity")
    )
    if (sizeOption && sizeOption.values && sizeOption.values.length > 0) {
      size = sizeOption.values[0].value || ""
    }
  }
  if (!size && metadata.size) {
    size = metadata.size
  }
  if (!size && metadata.weight) {
    size = metadata.weight
  }

  // Normalize the size to match variant size format
  size = size
    .toLowerCase()
    .replace(/size:\s*/i, "")
    .trim()

  // Get images
  const image = medusaProduct.thumbnail || null
  const hoverImage =
    medusaProduct.images && medusaProduct.images.length > 1
      ? medusaProduct.images[1].url
      : undefined

  // Process variants for sizes and prices
  const variants = (medusaProduct.variants || []).map((v: any) => {
    const variantSize = (v.title || "")
      .toLowerCase()
      .replace(/size:\s*/i, "")
      .trim()
    return {
      id: v.id,
      size: variantSize,
      price: v.calculated_price?.calculated_amount || 0,
    }
  })

  // Sort variants: treat 'ml' as standard, 'l' as x1000
  variants.sort((a: any, b: any) => {
    const getVal = (s: string) => {
      if (s.includes("l") && !s.includes("ml")) return parseInt(s) * 1000
      return parseInt(s) || 999999
    }
    return getVal(a.size) - getVal(b.size)
  })

  // Get available sizes
  const availableSizes = variants.map((v: any) => v.size)

  // If no size found, default to first variant's size
  if (!size && variants.length > 0) {
    size = variants[0].size
  }

  return {
    id: medusaProduct.id,
    name: medusaProduct.title || "",
    slug: medusaProduct.handle || "",
    subCategoryName,
    price,
    variants,
    size,
    availableSizes,
    description: medusaProduct.description || (metadata.description as string) || "",
    subtitle: medusaProduct.subtitle || "",
    image,
    hoverImage,
    botanical: (metadata.botanical as string) || "Botanical Blend",
    property: (metadata.property as string) || "Nourishing & Protective",
  }
}

export default function BodyHandsRoutePage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [filterOptions, setFilterOptions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { cartItems, handleCartUpdate } = useCartItems()
  const params = useParams()
  const countryCode = params?.countryCode as string

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true)

        // Fetch category from Contentful
        const category = await getProductCategoryByHandle("body-hands")

        if (!category) {
          console.warn("No category found for handle: body-hands")
          setProducts([])
          setFilterOptions([])
          return
        }

        // Get subCategories with their product handles (filtered for duplicates)
        const subCategoriesWithProducts = getSubCategoriesWithProducts(category)

        if (subCategoriesWithProducts.length === 0) {
          console.warn("No subCategories with products found in category")
          setProducts([])
          setFilterOptions([])
          return
        }

        // Extract filter options from subCategory names
        const filterNames = subCategoriesWithProducts.map((sc) => sc.name)
        setFilterOptions(filterNames)

        // Fetch products for each subCategory
        const allProducts: any[] = []

        for (const subCategory of subCategoriesWithProducts) {
          // Fetch all products for this subCategory in parallel
          const medusaProducts = await Promise.all(
            subCategory.handles.map((handle) =>
              getProductByHandle({ handle, countryCode }).catch((error) => {
                console.error(`Error fetching product ${handle}:`, error)
                return null
              })
            )
          )

          // Transform valid products and add to list with subCategory name
          const validProducts = medusaProducts
            .filter((p): p is NonNullable<typeof p> => p !== null)
            .map((p) => transformMedusaProduct(p, subCategory.name))

          allProducts.push(...validProducts)
        }

        setProducts(allProducts)
      } catch (error) {
        console.error("Error fetching products:", error)
        setProducts([])
        setFilterOptions([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [countryCode])

  return (
    <div className="min-h-screen">
      <RippleEffect />
      <Navigation
        isScrolled={isScrolled}
        cartItems={cartItems}
        onCartUpdate={handleCartUpdate}
        forceWhiteText={false}
      />

      <BodyHandsPage
        products={products}
        filterOptions={filterOptions}
        isLoading={isLoading}
        countryCode={countryCode}
      />
    </div>
  )
}
