"use server"

import { sdk } from "@lib/config"
import type { HttpTypes } from "@medusajs/types"
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
    const productFields =
      "*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags,+categories"

    // Parallel: text search on products AND category name lookup
    const [textResponse, categoryResponse] = await Promise.all([
      sdk.client.fetch<{
        products: HttpTypes.StoreProduct[]
        count: number
      }>(`/store/products`, {
        method: "GET",
        query: {
          q: query,
          limit,
          region_id: region.id,
          fields: productFields,
        },
        headers,
        next,
        cache: "no-store",
      }),
      sdk.client.fetch<{
        product_categories: Array<{ id: string; name: string; handle: string }>
      }>(`/store/product-categories`, {
        method: "GET",
        query: {
          q: query,
          limit: 5,
          fields: "id,name,handle",
        },
        headers,
        next,
        cache: "no-store",
      }).catch(() => ({ product_categories: [] })),
    ])

    // If category-name matched, fetch products in those categories and merge
    const categoryIds = (categoryResponse.product_categories || []).map((c) => c.id)
    let categoryProducts: HttpTypes.StoreProduct[] = []
    if (categoryIds.length > 0) {
      const catResp = await sdk.client
        .fetch<{
          products: HttpTypes.StoreProduct[]
          count: number
        }>(`/store/products`, {
          method: "GET",
          query: {
            category_id: categoryIds,
            limit,
            region_id: region.id,
            fields: productFields,
          },
          headers,
          next,
          cache: "no-store",
        })
        .catch(() => ({ products: [], count: 0 }))
      categoryProducts = catResp.products || []
    }

    // Merge + dedupe by id, text matches first
    const byId = new Map<string, HttpTypes.StoreProduct>()
    ;[...(textResponse.products || []), ...categoryProducts].forEach((p) => {
      if (p?.id && !byId.has(p.id)) byId.set(p.id, p)
    })
    const products = Array.from(byId.values()).slice(0, limit)
    const count = products.length || textResponse.count || 0

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
function generateSuggestedTerms(query: string, products: HttpTypes.StoreProduct[]): string[] {
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
export const getAllCategories = async (countryCode: string): Promise<string[]> => {
  try {
    const region = await getRegion(countryCode)
    if (!region) return []

    // This would fetch all categories from your backend
    // For now, return common categories
    return ["Hair Care", "Hand Care", "Body Care", "Home Creations", "Gift Sets", "Candles"]
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}
