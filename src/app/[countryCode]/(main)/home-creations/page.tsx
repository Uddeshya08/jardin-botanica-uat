"use client"

import { getAllBlogs, getProductCategoryByHandle } from "@lib/data/contentful"
import { getProductByHandle } from "@lib/data/products"
import { HomeCreationsPage, type Product } from "app/components/HomeCreationsPage"
import { Navigation } from "app/components/Navigation"
import { RippleEffect } from "app/components/RippleEffect"
import { useCartItems } from "app/context/cart-items-context"
import { useParams } from "next/navigation"
import React, { useEffect, useState } from "react"
import type { Blog, ProductCategory } from "../../../../types/contentful"

function getCategoryProducts(category: ProductCategory, linkedCategories: ProductCategory[]) {
  const categorySources = [category, ...linkedCategories]
  const subCategories = categorySources.flatMap((sourceCategory) => [
    ...(sourceCategory.handle === category.handle && sourceCategory.productHandles.length === 0
      ? []
      : [{ name: sourceCategory.name, handles: sourceCategory.productHandles || [] }]),
    ...(sourceCategory.subCategories || []).map((subCategory) => ({
      name: subCategory.name,
      handles: subCategory.productHandles || [],
    })),
  ])

  const directHandles = categorySources.flatMap(
    (sourceCategory) => sourceCategory.productHandles || []
  )

  // Root handles power "All Products" in Contentful. Append subcategory-only
  // handles so older category entries continue to work.
  const allHandles = Array.from(
    new Set([...directHandles, ...subCategories.flatMap((subCategory) => subCategory.handles)])
  )

  return { subCategories, allHandles }
}

// Transform Medusa product to HomeCreationsPage Product format
function transformMedusaProduct(medusaProduct: any, subCategoryName: string): Product {
  const metadata = medusaProduct.metadata || {}

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
  const image = medusaProduct.images?.[0]?.url || medusaProduct.thumbnail || null
  const hoverImage =
    medusaProduct.images && medusaProduct.images.length > 1
      ? medusaProduct.images[1].url
      : undefined

  // Process variants for cart
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

  // If no size found, default to first variant's size
  if (!size && variants.length > 0) {
    size = variants[0].size
  }

  return {
    id: medusaProduct.id,
    name: medusaProduct.title || "",
    subCategoryName,
    price,
    size,
    description: medusaProduct.description || "",
    subtitle: medusaProduct.subtitle || "",
    image,
    hoverImage,
    botanical: metadata.botanical || "",
    property: metadata.property || "",
    variants,
  }
}

export default function HomeCreationsRoutePage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [journalBlogs, setJournalBlogs] = useState<Blog[]>([])
  const [filterOptions, setFilterOptions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { cartItems, handleCartUpdate } = useCartItems()
  const params = useParams()
  const countryCode = params?.countryCode as string

  useEffect(() => {
    getAllBlogs(4, countryCode)
      .then(setJournalBlogs)
      .catch((error) => console.error("Error fetching Home Creations journals:", error))
  }, [countryCode])

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
        const category = await getProductCategoryByHandle("home-creations")

        if (!category) {
          console.warn("No category found for handle: home-creations")
          setProducts([])
          setFilterOptions([])
          return
        }

        const linkedCategoryHandles = (category.pageLinks || [])
          .map((pageLink) => pageLink.url.split("?")[0].split("/").filter(Boolean).pop())
          .filter((handle): handle is string => !!handle && handle !== category.handle)
        const linkedCategories = (
          await Promise.all(
            linkedCategoryHandles.map((handle) => getProductCategoryByHandle(handle))
          )
        ).filter((linkedCategory): linkedCategory is ProductCategory => linkedCategory !== null)
        const { subCategories, allHandles } = getCategoryProducts(category, linkedCategories)

        if (allHandles.length === 0) {
          console.warn("No products found in home-creations category")
          setProducts([])
          setFilterOptions([])
          return
        }

        // Extract filter options from subCategory names
        const filterNames = subCategories.map((subCategory) => subCategory.name)
        setFilterOptions(filterNames)

        const medusaProducts = await Promise.all(
          allHandles.map(async (handle) => {
            const product = await getProductByHandle({ handle, countryCode }).catch((error) => {
              console.error(`Error fetching product ${handle}:`, error)
              return null
            })
            const subCategoryName =
              subCategories.find((subCategory) => subCategory.handles.includes(handle))?.name ||
              category.name

            return product ? transformMedusaProduct(product, subCategoryName) : null
          })
        )

        setProducts(medusaProducts.filter((product): product is Product => product !== null))
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
        forceWhiteText
      />
      <div className="h-4" />
      <HomeCreationsPage
        products={products}
        filterOptions={filterOptions}
        isLoading={isLoading}
        countryCode={countryCode}
        journalBlogs={journalBlogs}
      />
    </div>
  )
}
