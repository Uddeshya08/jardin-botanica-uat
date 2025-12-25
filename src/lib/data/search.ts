"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { getRegion } from "./regions"

export interface SearchResult {
  products: HttpTypes.StoreProduct[]
  suggestedTerms: string[]
  categories: string[]
  totalCount: number
}

/**
 * Search products by query string
 */
export const searchProducts = async ({
  query,
  countryCode,
  limit = 12,
}: {
  query: string
  countryCode: string
  limit?: number
}): Promise<SearchResult> => {
  if (!query || !countryCode) {
    return {
      products: [],
      suggestedTerms: [],
      categories: [],
      totalCount: 0,
    }
  }

  const region = await getRegion(countryCode)

  if (!region) {
    return {
      products: [],
      suggestedTerms: [],
      categories: [],
      totalCount: 0,
    }
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("products")),
  }

  try {
    // Search products by title
    const response = await sdk.client.fetch<{
      products: HttpTypes.StoreProduct[]
      count: number
    }>(`/store/products`, {
      method: "GET",
      query: {
        q: query,
        limit,
        region_id: region.id,
        fields:
          "*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags,+categories",
      },
      headers,
      next,
      cache: "no-store",
    })

    const products = response.products || []
    const count = response.count || 0

    // Extract categories from products
    const categoriesSet = new Set<string>()
    products.forEach((product) => {
      if (product.categories) {
        product.categories.forEach((cat: any) => {
          if (cat.name) {
            categoriesSet.add(cat.name)
          }
        })
      }
    })

    // Generate suggested terms based on product titles and query
    const suggestedTerms = generateSuggestedTerms(query, products)

    return {
      products,
      suggestedTerms,
      categories: Array.from(categoriesSet),
      totalCount: count,
    }
  } catch (error) {
    console.error("Error searching products:", error)
    return {
      products: [],
      suggestedTerms: [],
      categories: [],
      totalCount: 0,
    }
  }
}

/**
 * Generate suggested search terms based on query and products
 */
function generateSuggestedTerms(
  query: string,
  products: HttpTypes.StoreProduct[]
): string[] {
  const suggestions = new Set<string>()
  const queryLower = query.toLowerCase()

  // Common product-related suggestions
  const commonSuggestions: { [key: string]: string[] } = {
    hair: ["shampoo", "conditioner", "hair oil", "hair mask", "scalp care"],
    hand: ["hand balm", "hand soap", "hand lotion", "hand cream"],
    body: ["body lotion", "body wash", "body oil", "body care"],
    candle: ["scented candles", "soy candles", "home fragrance"],
    gift: ["gift sets", "gift box", "gift hamper"],
    skin: ["skincare", "face care", "moisturizer", "serum"],
  }

  // Add suggestions based on query
  Object.keys(commonSuggestions).forEach((key) => {
    if (queryLower.includes(key)) {
      commonSuggestions[key].forEach((term) => suggestions.add(term))
    }
  })

  // Extract terms from product titles
  products.slice(0, 5).forEach((product) => {
    if (product.title) {
      const words = product.title
        .toLowerCase()
        .split(/\s+/)
        .filter((word) => word.length > 3)
      words.forEach((word) => {
        if (!queryLower.includes(word)) {
          suggestions.add(word)
        }
      })
    }
  })

  return Array.from(suggestions).slice(0, 8)
}

/**
 * Get all available categories for search
 */
export const getAllCategories = async (
  countryCode: string
): Promise<string[]> => {
  try {
    const region = await getRegion(countryCode)
    if (!region) return []

    // This would fetch all categories from your backend
    // For now, return common categories
    return [
      "Hair Care",
      "Hand Care",
      "Body Care",
      "Home Creations",
      "Gift Sets",
      "Candles",
    ]
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

