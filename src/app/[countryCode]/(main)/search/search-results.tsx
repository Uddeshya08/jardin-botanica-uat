"use client"

import { useState, useEffect } from "react"
import { motion } from "motion/react"
import { HttpTypes } from "@medusajs/types"
import { SearchResult } from "@lib/data/search"
import { Navigation } from "app/components/Navigation"
import { RippleEffect } from "app/components/RippleEffect"
import Link from "next/link"
import Image from "next/image"
import { Search, Heart } from "lucide-react"
import { useRouter } from "next/navigation"

interface SearchResultsProps {
  query: string
  searchResults: SearchResult
  region: HttpTypes.StoreRegion
  countryCode: string
}

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

export default function SearchResults({
  query,
  searchResults,
  region,
  countryCode,
}: SearchResultsProps) {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [searchQuery, setSearchQuery] = useState(query)
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)

  const handleCartUpdate = (items: CartItem[]) => {
    setCartItems(items)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/${countryCode}/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const formatPrice = (amount: number, currencyCode: string) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 0,
    }).format(amount / 100)
  }

  const getProductPrice = (product: HttpTypes.StoreProduct) => {
    const variant = product.variants?.[0]
    if (!variant) return null

    const price = variant.calculated_price as any
    if (!price) return null

    return {
      amount: price.calculated_amount,
      currencyCode: price.currency_code || region.currency_code,
    }
  }

  // Mock articles data - in production, this would come from your CMS/API
  const relatedArticles = [
    {
      id: "1",
      title: "Understanding your skin type",
      excerpt: "A comprehensive guide to identifying and caring for your unique skin",
      category: "Skincare",
    },
    {
      id: "2",
      title: "The art of botanical formulation",
      excerpt: "How we blend nature and science in our laboratory",
      category: "Behind the scenes",
    },
  ].filter((article) =>
    article.title.toLowerCase().includes(query.toLowerCase()) ||
    article.excerpt.toLowerCase().includes(query.toLowerCase()) ||
    article.category.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#e3e3d8" }}>
      <RippleEffect />
      <Navigation
        isScrolled={false}
        cartItems={cartItems}
        onCartUpdate={handleCartUpdate}
        forceWhiteText={false}
      />

      <div className="pt-32 pb-20 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <form onSubmit={handleSearchSubmit} className="relative max-w-2xl">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="I'm looking for..."
                className="w-full px-6 py-4 pr-12 border border-black/20 bg-white/50 backdrop-blur-sm font-din-arabic text-lg focus:outline-none focus:border-black/40 transition-colors"
                style={{ color: "#000" }}
              />
              <button
                type="submit"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-black/60 hover:text-black transition-colors"
              >
                <Search size={24} />
              </button>
            </form>
            <p className="mt-3 font-din-arabic text-black/60 text-sm">
              Searching for: <span className="text-black font-medium">{query}</span>
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Main Content - Best Matches */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-american-typewriter text-black text-2xl">
                    Best matches
                  </h2>
                  {searchResults.totalCount > 0 && (
                    <Link
                      href={`/${countryCode}/store?q=${encodeURIComponent(query)}`}
                      className="font-din-arabic text-black/70 hover:text-black text-sm underline transition-colors"
                    >
                      View all
                    </Link>
                  )}
                </div>

                {searchResults.products.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="font-din-arabic text-black/60 text-lg mb-4">
                      No products found for "{query}"
                    </p>
                    <p className="font-din-arabic text-black/50 text-sm">
                      Try searching with different keywords or browse our categories
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {searchResults.products.map((product) => {
                      const price = getProductPrice(product)
                      const thumbnail = product.thumbnail || product.images?.[0]?.url

                      return (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4 }}
                          onMouseEnter={() => setHoveredProduct(product.id)}
                          onMouseLeave={() => setHoveredProduct(null)}
                          className="group"
                        >
                          <Link href={`/${countryCode}/products/${product.handle}`}>
                            <div className="relative aspect-square mb-4 bg-white/30 overflow-hidden">
                              {thumbnail && (
                                <Image
                                  src={thumbnail}
                                  alt={product.title || "Product"}
                                  fill
                                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                              )}
                            </div>
                            <div className="space-y-2">
                              <h3 className="font-american-typewriter text-black text-lg group-hover:text-black/70 transition-colors">
                                {product.title}
                              </h3>
                              {product.subtitle && (
                                <p className="font-din-arabic text-black/60 text-sm">
                                  {product.subtitle}
                                </p>
                              )}
                              {price && (
                                <p className="font-din-arabic text-black text-base">
                                  {formatPrice(price.amount, price.currencyCode)}
                                </p>
                              )}
                            </div>
                          </Link>
                        </motion.div>
                      )
                    })}
                  </div>
                )}

                {/* Related Articles Section */}
                {relatedArticles.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-16 pt-12 border-t border-black/10"
                  >
                    <h2 className="font-american-typewriter text-black text-2xl mb-8">
                      Related Articles
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {relatedArticles.map((article) => (
                        <motion.div
                          key={article.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4 }}
                          className="group"
                        >
                          <Link href={`/${countryCode}/blogs/${article.id}`}>
                            <div className="space-y-3">
                              <p className="font-din-arabic text-black/50 text-xs uppercase tracking-wider">
                                {article.category}
                              </p>
                              <h3 className="font-american-typewriter text-black text-lg group-hover:text-black/70 transition-colors">
                                {article.title}
                              </h3>
                              <p className="font-din-arabic text-black/60 text-sm leading-relaxed">
                                {article.excerpt}
                              </p>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Sidebar - Suggested & Categories */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-10"
              >
                {/* Suggested Keywords */}
                {searchResults.suggestedTerms.length > 0 && (
                  <div>
                    <h3 className="font-american-typewriter text-black text-lg mb-4">
                      Suggested
                    </h3>
                    <div className="space-y-2">
                      {searchResults.suggestedTerms.map((term, index) => (
                        <Link
                          key={index}
                          href={`/${countryCode}/search?q=${encodeURIComponent(term)}`}
                          className="block font-din-arabic text-black/70 hover:text-black text-sm py-1 transition-colors"
                        >
                          {term}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Categories */}
                {searchResults.categories.length > 0 && (
                  <div>
                    <h3 className="font-american-typewriter text-black text-lg mb-4">
                      Categories
                    </h3>
                    <div className="space-y-2">
                      {searchResults.categories.map((category, index) => (
                        <Link
                          key={index}
                          href={`/${countryCode}/store?category=${encodeURIComponent(category)}`}
                          className="block font-din-arabic text-black/70 hover:text-black text-sm py-1 transition-colors"
                        >
                          {category}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular Searches */}
                <div>
                  <h3 className="font-american-typewriter text-black text-lg mb-4">
                    Popular searches
                  </h3>
                  <div className="space-y-2">
                    {["candles", "gift sets", "body lotion", "shampoo"].map(
                      (term, index) => (
                        <Link
                          key={index}
                          href={`/${countryCode}/search?q=${encodeURIComponent(term)}`}
                          className="block font-din-arabic text-black/70 hover:text-black text-sm py-1 transition-colors"
                        >
                          {term}
                        </Link>
                      )
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

