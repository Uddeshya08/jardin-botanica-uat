"use client"

import { convertToLocale } from "@lib/util/money"
import type { HttpTypes } from "@medusajs/types"
import { Search, X } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

interface SearchMegaMenuProps {
  isOpen: boolean
  onClose: () => void
  countryCode: string
  region: HttpTypes.StoreRegion | null
}

interface Product {
  id: string
  title: string
  subtitle?: string
  handle: string
  thumbnail?: string
  images?: Array<{ url: string }>
  variants?: Array<{
    calculated_price?: {
      calculated_amount: number
      currency_code: string
    }
  }>
}

export function SearchMegaMenu({ isOpen, onClose, countryCode, region }: SearchMegaMenuProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<{
    products: Product[]
    suggestedTerms: string[]
    categories: string[]
  }>({
    products: [],
    suggestedTerms: [],
    categories: [],
  })
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())
  const searchInputRef = useRef<HTMLInputElement>(null)
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)

  // Focus input when opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  // Prevent body scroll when search menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  // Perform search with debounce
  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current)
    }

    if (!searchQuery.trim()) {
      setSearchResults({
        products: [],
        suggestedTerms: [],
        categories: [],
      })
      return
    }

    setIsSearching(true)

    debounceTimeout.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(searchQuery)}&countryCode=${countryCode}`
        )
        const data = await response.json()
        setSearchResults(data)
      } catch (error) {
        console.error("Search error:", error)
      } finally {
        setIsSearching(false)
      }
    }, 300)

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current)
      }
    }
  }, [searchQuery, countryCode])

  const formatPrice = (amount: number, currencyCode: string) => {
    return convertToLocale({
      amount: amount,
      currency_code: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  }

  const getProductPrice = (product: Product) => {
    const variant = product.variants?.[0]
    if (!variant) return null

    const price = variant.calculated_price
    if (!price) return null

    return {
      amount: price.calculated_amount,
      currencyCode: price.currency_code || region?.currency_code || "INR",
    }
  }

  const handleClose = () => {
    setSearchQuery("")
    setSearchResults({ products: [], suggestedTerms: [], categories: [] })
    onClose()
  }

  const handleProductClick = () => {
    handleClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed top-0 left-0 right-0 bottom-0 bg-black/30 backdrop-blur-sm z-40"
            style={{ marginTop: "105px" }}
            onClick={handleClose}
          />

          {/* Mega Menu */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed left-0 right-0 z-50 bg-[#e3e3d8] shadow-xl overflow-y-auto"
            style={{
              top: "105px",
              maxHeight: "calc(100vh - 105px)",
            }}
          >
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 py-8 sm:py-12">
              {/* Search Bar */}
              <div className="relative mb-12 sm:mb-16">
                <div className="relative max-w-4xl mx-auto">
                  <div className="relative flex items-center">
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="I'm looking for..."
                      className="flex-1 px-0 py-4 pr-16 text-xl sm:text-2xl border-b-2 border-black/20 bg-transparent font-din-arabic focus:outline-none focus:border-black transition-colors placeholder:text-black/30"
                      style={{
                        color: "#000",
                        lineHeight: "1.2",
                      }}
                    />
                    <div
                      className="absolute right-0 flex items-center gap-3"
                      style={{ bottom: "1rem" }}
                    >
                      {isSearching && (
                        <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      )}
                      <button
                        onClick={handleClose}
                        className="text-black/40 hover:text-black transition-colors flex items-center"
                        aria-label="Close search"
                      >
                        <X size={24} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results */}
              {searchQuery.trim() ? (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
                  {/* Main Content - Best Matches */}
                  <div className="lg:col-span-3">
                    <div className="flex items-baseline justify-between mb-8 pb-4 border-b border-black/10">
                      <h2 className="font-american-typewriter text-black text-lg sm:text-xl">
                        Best matches
                      </h2>
                      {searchResults.products.length > 0 && (
                        <Link
                          href={`/${countryCode}/search?q=${encodeURIComponent(searchQuery)}`}
                          onClick={handleClose}
                          className="font-din-arabic text-black/60 hover:text-black text-sm underline transition-colors"
                        >
                          View all
                        </Link>
                      )}
                    </div>

                    {searchResults.products.length === 0 && !isSearching ? (
                      <div className="py-20 text-center">
                        <p className="font-din-arabic text-black/50 text-base">No products found</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {searchResults.products.slice(0, 6).map((product) => {
                          const price = getProductPrice(product)
                          const thumbnail = product.thumbnail || product.images?.[0]?.url
                          const hasImageError = imageErrors.has(product.id)
                          const showPlaceholder = !thumbnail || hasImageError

                          return (
                            <Link
                              key={product.id}
                              href={`/${countryCode}/products/${product.handle}`}
                              onClick={handleProductClick}
                              className="group flex gap-4"
                            >
                              {/* Product Image - Left Side */}
                              <div className="relative w-28 h-28 flex-shrink-0 bg-white/40 overflow-hidden flex items-center justify-center">
                                {!showPlaceholder ? (
                                  <Image
                                    src={thumbnail!}
                                    alt={product.title || "Product"}
                                    fill
                                    className="object-cover transition-opacity duration-300 group-hover:opacity-90"
                                    onError={() => {
                                      setImageErrors((prev) => new Set(prev).add(product.id))
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white/60 to-white/30">
                                    <div className="text-center">
                                      <div className="text-3xl mb-1 opacity-30">🌿</div>
                                      <p className="text-[10px] font-din-arabic text-black/30">
                                        No Image
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Product Details - Right Side */}
                              <div className="flex-1 flex flex-col justify-center space-y-2">
                                <h3 className="font-american-typewriter text-black text-base leading-tight">
                                  {product.title}
                                </h3>
                                {product.subtitle && (
                                  <p className="font-din-arabic text-black/60 text-xs leading-relaxed line-clamp-2">
                                    {product.subtitle}
                                  </p>
                                )}
                                {price && (
                                  <p className="font-din-arabic text-black text-sm">
                                    {formatPrice(price.amount, price.currencyCode)}
                                  </p>
                                )}
                              </div>
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  {/* Sidebar - Suggested & Categories */}
                  <div className="lg:col-span-1">
                    <div className="space-y-8">
                      {/* Suggested Keywords */}
                      {searchResults.suggestedTerms.length > 0 && (
                        <div>
                          <h3 className="font-american-typewriter text-black text-base mb-4 pb-3 border-b border-black/10">
                            Suggested
                          </h3>
                          <div className="space-y-2">
                            {searchResults.suggestedTerms.map((term, index) => (
                              <button
                                key={index}
                                onClick={() => setSearchQuery(term)}
                                className="block w-full text-left font-din-arabic text-black/60 hover:text-black text-sm py-1 transition-colors"
                              >
                                {term}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Categories */}
                      {searchResults.categories.length > 0 && (
                        <div>
                          <h3 className="font-american-typewriter text-black text-base mb-4 pb-3 border-b border-black/10">
                            Categories
                          </h3>
                          <div className="space-y-2">
                            <Link
                              href={`/${countryCode}/store`}
                              onClick={handleClose}
                              className="block font-din-arabic text-black/60 hover:text-black text-sm py-1 transition-colors"
                            >
                              See all Hair
                            </Link>
                            {searchResults.categories.map((category, index) => (
                              <Link
                                key={index}
                                href={`/${countryCode}/store?category=${encodeURIComponent(category)}`}
                                onClick={handleClose}
                                className="block font-din-arabic text-black/60 hover:text-black text-sm py-1 transition-colors"
                              >
                                {category}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Popular Searches */}
                      <div>
                        <h3 className="font-american-typewriter text-black text-base mb-4 pb-3 border-b border-black/10">
                          Popular
                        </h3>
                        <div className="space-y-2">
                          {[
                            {
                              label: "hand balm",
                              link: `/${countryCode}/body-hands`,
                            },
                            {
                              label: "hand soap",
                              link: `/${countryCode}/body-hands`,
                            },
                            {
                              label: "candles",
                              link: `/${countryCode}/candles`,
                            },
                            {
                              label: "gift sets",
                              link: `/${countryCode}/gift-sets`,
                            },
                          ].map((item) => (
                            <Link
                              key={item.label}
                              href={item.link}
                              onClick={handleClose}
                              className="block font-din-arabic text-black/60 hover:text-black text-sm py-1 transition-colors"
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Empty state - show popular categories
                <div className="py-12">
                  <h3 className="font-american-typewriter text-black text-lg mb-8 pb-4 border-b border-black/10">
                    Popular searches
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl">
                    {[
                      {
                        label: "Hand & Hands",
                        link: `/${countryCode}/body-hands`,
                      },
                      { label: "Candles", link: `/${countryCode}/candles` },
                      { label: "Gift Sets", link: `/${countryCode}/gift-sets` },
                      {
                        label: "Home Creations",
                        link: `/${countryCode}/home-creations`,
                      },
                      { label: "The Lab", link: `/${countryCode}/the-lab` },
                    ].map((item) => (
                      <Link
                        key={item.label}
                        href={item.link}
                        onClick={handleClose}
                        className="text-left p-4 bg-white/30 hover:bg-white/50 transition-colors"
                      >
                        <p className="font-din-arabic text-black text-sm">{item.label}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
