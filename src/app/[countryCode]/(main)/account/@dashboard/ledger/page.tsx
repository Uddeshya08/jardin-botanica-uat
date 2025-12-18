"use client"

import { motion, AnimatePresence } from "motion/react"
import { BookOpen } from "lucide-react"
import { useLedger, LedgerItem } from "app/context/ledger-context"
import { useParams } from "next/navigation"
import { addToCartAction } from "@lib/data/cart-actions"
import { useState, useTransition, useEffect, useRef } from "react"
import { toast } from "sonner"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useCartItems } from "app/context/cart-items-context"
import { listProducts } from "@lib/data/products"

export default function LedgerPage() {
  const { ledger, toggleLedgerItem } = useLedger()
  const { handleCartUpdate } = useCartItems()
  const { countryCode } = useParams() as { countryCode: string }
  const [isPending, startTransition] = useTransition()
  const [addingItems, setAddingItems] = useState<Set<string>>(new Set())
  const [productHandles, setProductHandles] = useState<{ [key: string]: string }>({})
  const loadedHandlesRef = useRef<Set<string>>(new Set())

  // Load product handles for all ledger items
  useEffect(() => {
    const loadHandles = async () => {
      const handlesToLoad: { [key: string]: Promise<string | null> } = {}
      const handles: { [key: string]: string } = {}
      
      // Get current handles state using functional update
      let currentHandles: { [key: string]: string } = {}
      setProductHandles((prev) => {
        currentHandles = prev
        return prev
      })
      
      for (const item of ledger) {
        // Skip if already processed in this run
        if (loadedHandlesRef.current.has(item.id)) {
          continue
        }
        
        // Mark as processed to avoid duplicate fetches
        loadedHandlesRef.current.add(item.id)
        
        // Check if handle already exists in item data
        if ((item as any).handle) {
          handles[item.id] = (item as any).handle
        } else if (currentHandles[item.id]) {
          // Already have handle in state, no need to fetch
          continue
        } else {
          // Need to fetch handle
          handlesToLoad[item.id] = findProductHandle(item.name)
        }
      }
      
      // Wait for all handle fetches to complete
      if (Object.keys(handlesToLoad).length > 0) {
        const results = await Promise.all(
          Object.entries(handlesToLoad).map(async ([id, promise]) => {
            const handle = await promise
            return handle ? { id, handle } : null
          })
        )
        
        // Add fetched handles
        results.forEach((result) => {
          if (result) {
            handles[result.id] = result.handle
          }
        })
      }
      
      // Update state with all handles (only if we have new ones)
      if (Object.keys(handles).length > 0) {
        setProductHandles((prev) => {
          const newHandles = { ...prev }
          let hasUpdates = false
          Object.entries(handles).forEach(([id, handle]) => {
            if (prev[id] !== handle) {
              newHandles[id] = handle
              hasUpdates = true
            }
          })
          return hasUpdates ? newHandles : prev
        })
      }
    }
    
    // Reset ref when ledger changes (items added/removed)
    loadedHandlesRef.current.clear()
    
    if (ledger.length > 0) {
      loadHandles()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ledger])

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
  }

  const findProductHandle = async (productName: string): Promise<string | null> => {
    try {
      // Normalize the product name for comparison
      const normalizedSearchName = productName.toLowerCase().trim()
      
      // First, try searching with a higher limit to find matching products
      const response = await listProducts({
        countryCode: (countryCode || "in").toLowerCase(),
        queryParams: {
          limit: 100, // Search through more products
        } as any,
      })

      const allProducts = response.response.products || []
      
      // Search for product by name (checking title and handle)
      // Match common product name patterns (e.g., "Tea Exfoliant Rinse" matches "tea exfoliant rinse")
      const matchingProduct = allProducts.find((prod) => {
        const prodTitle = prod.title?.toLowerCase().trim() || ""
        const prodHandle = prod.handle?.toLowerCase().trim() || ""
        
        // Check if product name contains key words from search or vice versa
        const titleWords = normalizedSearchName.split(/\s+/).filter(w => w.length > 2)
        const titleMatch = titleWords.length > 0 && titleWords.some(word => 
          prodTitle.includes(word) || prodHandle.includes(word)
        )
        
        // Also check if search name contains product title words
        const prodTitleWords = prodTitle.split(/\s+/).filter(w => w.length > 2)
        const reverseMatch = prodTitleWords.length > 0 && prodTitleWords.some(word =>
          normalizedSearchName.includes(word)
        )
        
        // Direct match
        const directMatch = prodTitle.includes(normalizedSearchName) || 
                           normalizedSearchName.includes(prodTitle) ||
                           prodHandle.includes(normalizedSearchName) ||
                           normalizedSearchName.includes(prodHandle)
        
        return directMatch || titleMatch || reverseMatch
      })

      if (matchingProduct && matchingProduct.handle) {
        return matchingProduct.handle
      }

      return null
    } catch (error) {
      console.error("Error searching for product handle:", error)
      return null
    }
  }

  const findProductVariantId = async (productName: string, itemSize?: string): Promise<string | null> => {
    try {
      // Normalize the product name for comparison
      const normalizedSearchName = productName.toLowerCase().trim()
      
      // First, try searching with a higher limit to find matching products
      const response = await listProducts({
        countryCode: (countryCode || "in").toLowerCase(),
        queryParams: {
          limit: 100, // Search through more products
        } as any,
      })

      const allProducts = response.response.products || []
      
      // Search for product by name (checking title and handle)
      // Match common product name patterns (e.g., "Tea Exfoliant Rinse" matches "tea exfoliant rinse")
      const matchingProduct = allProducts.find((prod) => {
        const prodTitle = prod.title?.toLowerCase().trim() || ""
        const prodHandle = prod.handle?.toLowerCase().trim() || ""
        
        // Check if product name contains key words from search or vice versa
        const titleWords = normalizedSearchName.split(/\s+/).filter(w => w.length > 2)
        const titleMatch = titleWords.length > 0 && titleWords.some(word => 
          prodTitle.includes(word) || prodHandle.includes(word)
        )
        
        // Also check if search name contains product title words
        const prodTitleWords = prodTitle.split(/\s+/).filter(w => w.length > 2)
        const reverseMatch = prodTitleWords.length > 0 && prodTitleWords.some(word =>
          normalizedSearchName.includes(word)
        )
        
        // Direct match
        const directMatch = prodTitle.includes(normalizedSearchName) || 
                           normalizedSearchName.includes(prodTitle) ||
                           prodHandle.includes(normalizedSearchName) ||
                           normalizedSearchName.includes(prodHandle)
        
        return directMatch || titleMatch || reverseMatch
      })

      if (matchingProduct && matchingProduct.variants && matchingProduct.variants.length > 0) {
        // Return the first variant ID, or try to match by size if available
        if (itemSize) {
          // Try to find variant matching the size
          const sizeVariant = matchingProduct.variants.find((v: any) => {
            const variantTitle = (v.title || "").toLowerCase()
            const sizeLower = itemSize.toLowerCase()
            return variantTitle.includes(sizeLower) || sizeLower.includes(variantTitle) ||
                   (v.sku && v.sku.toLowerCase().includes(sizeLower))
          })
          if (sizeVariant) {
            return sizeVariant.id
          }
        }
        // Return the first variant or the one with calculated_price
        const variantWithPrice = matchingProduct.variants.find((v: any) => v.calculated_price)
        return variantWithPrice?.id || matchingProduct.variants[0].id
      }

      return null
    } catch (error) {
      console.error("Error searching for product:", error)
      return null
    }
  }

  const handleAddToCartClick = async (item: LedgerItem) => {
    const itemId = item.id

    // Prevent duplicate clicks
    if (addingItems.has(itemId) || isPending) {
      return
    }

    // Check if item has variantId (check multiple possible field names)
    let variantId = item.variantId || item.variant_id || (item as any).selectedVariantId

    // If variant ID is missing, try to find it by searching for the product
    if (!variantId) {
      setAddingItems((prev) => new Set(prev).add(itemId))
      
      toast.loading("Finding product variant...", { id: `finding-${itemId}` })
      
      try {
        variantId = await findProductVariantId(item.name, (item as any).size)
        
        if (variantId) {
          // Update the ledger item with the found variant ID
          const updatedItem = { ...item, variantId, variant_id: variantId }
          toggleLedgerItem(updatedItem as any)
          
          toast.dismiss(`finding-${itemId}`)
          toast.success("Product found! Adding to cart...", { duration: 1000 })
        } else {
          setAddingItems((prev) => {
            const next = new Set(prev)
            next.delete(itemId)
            return next
          })
          toast.dismiss(`finding-${itemId}`)
          toast.error("Unable to find product variant. Please add this item from the product page.")
          return
        }
      } catch (error: any) {
        setAddingItems((prev) => {
          const next = new Set(prev)
          next.delete(itemId)
          return next
        })
        toast.dismiss(`finding-${itemId}`)
        toast.error("Error searching for product. Please try again.")
        console.error("Error finding variant:", error)
        return
      }
    } else {
      setAddingItems((prev) => new Set(prev).add(itemId))
    }

    // Optimistically update cart context for immediate UI feedback
    handleCartUpdate({
      id: variantId as string,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
      variant_id: variantId as string,
    } as any)

    startTransition(async () => {
      try {
        await addToCartAction({
          variantId: variantId as string,
          quantity: 1,
          countryCode: (countryCode || "in").toLowerCase(),
        })
        toast.success("Added to cart")
      } catch (error: any) {
        console.error("Failed to add to cart:", error)
        toast.error(error?.message || "Could not add to cart")
        // Remove the optimistic update on error
        handleCartUpdate({
          id: variantId as string,
          quantity: 0,
        } as any)
      } finally {
        setAddingItems((prev) => {
          const next = new Set(prev)
          next.delete(itemId)
          return next
        })
      }
    })
  }

  const handleRemoveFromLedger = (item: LedgerItem) => {
    toggleLedgerItem(item)
    toast.success("Removed from ledger")
  }

  const highlightBotanicalTerms = (text: string): React.ReactNode => {
    // Simple implementation - you can enhance this with actual botanical term detection
    const botanicalTerms = [
      'extract', 'essence', 'note', 'scent', 'aroma', 'fragrance',
      'botanical', 'herbal', 'natural', 'organic', 'essential oil'
    ]
    
    const parts = text.split(/(\s+)/)
    return parts.map((part, index) => {
      const lowerPart = part.toLowerCase()
      const isTerm = botanicalTerms.some(term => lowerPart.includes(term))
      if (isTerm) {
        return <span key={index} className="font-medium text-black/60">{part}</span>
      }
      return <span key={index}>{part}</span>
    })
  }

  return (
    <motion.div
      key="ledger"
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-american-typewriter text-2xl lg:text-3xl text-black tracking-[0.15em] mb-3">
            The Botanist's Ledger
          </h1>
          <p className="font-din-arabic text-sm sm:text-base text-black/40 tracking-wide mt-2">
            Entries from your ongoing study of scent and care.
          </p>
        </div>
      </div>

      {ledger.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-24"
        >
          <p className="font-din-arabic text-sm sm:text-base text-black/60 mb-10 max-w-md mx-auto" style={{ letterSpacing: '0.1em' }}>
            No items saved yet. Your ledger awaits specimens from the Lab.
          </p>
          <LocalizedClientLink href="/">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-black text-white font-din-arabic tracking-wide text-xs sm:text-sm hover:bg-black/90 transition-colors"
              style={{ letterSpacing: '0.1em' }}
            >
              Browse the Collection →
            </motion.button>
          </LocalizedClientLink>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          {/* Ledger Book Container */}
          <div className="relative py-8 md:py-12 px-6 md:px-10">
            {/* Ledger Header */}
            <div className="mb-10 pb-7 border-b-2" style={{ borderColor: '#8b7759' }}>
              <div className="grid grid-cols-12 gap-6 items-center">
                <div className="col-span-1 flex items-center">
                  <p className="font-american-typewriter text-xs tracking-wider" style={{ color: '#6b5d3f' }}>
                    No.
                  </p>
                </div>
                <div className="col-span-11 md:col-span-5 flex items-center justify-center" style={{ marginLeft: '2px' }}>
                  <p className="font-american-typewriter text-xs tracking-wider" style={{ color: '#6b5d3f' }}>
                    Botanical Record
                  </p>
                </div>
                <div className="hidden md:flex md:col-span-3 items-center justify-center" style={{ marginLeft: '40px' }}>
                  <p className="font-american-typewriter text-xs tracking-wider" style={{ color: '#6b5d3f' }}>
                    Est. Value
                  </p>
                </div>
                <div className="hidden md:flex md:col-span-3 items-center justify-center" style={{ marginLeft: '-20px' }}>
                  <p className="font-american-typewriter text-xs tracking-wider" style={{ color: '#6b5d3f' }}>
                    Actions
                  </p>
                </div>
              </div>
            </div>

            {/* Ledger Entries */}
            <div className="space-y-0">
              <AnimatePresence mode="popLayout">
                {ledger.map((item: LedgerItem, index: number) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative border-b py-9 transition-all duration-300 hover:bg-black/[0.02]"
                    style={{ borderColor: 'rgba(139, 69, 19, 0.15)', marginLeft: '-1.5rem', marginRight: '-1.5rem', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}
                  >
                    <div className="grid grid-cols-12 gap-6 items-start" style={{ marginLeft: 0, marginRight: 0 }}>
                      {/* Entry Number */}
                      <div className="col-span-1 pt-1">
                        <p className="font-din-arabic tracking-wider text-sm text-black/40 transition-colors duration-300 group-hover:text-black/30">
                          {String(index + 1).padStart(2, '0')}
                        </p>
                      </div>

                      {/* Specimen Details */}
                      <div className="col-span-11 md:col-span-5">
                        {productHandles[item.id] ? (
                          <LocalizedClientLink 
                            href={`/products/${productHandles[item.id]}`}
                            className="flex items-start space-x-5 cursor-pointer hover:opacity-90 transition-opacity"
                          >
                            {/* Thumbnail */}
                            <div className="relative w-32 h-32 flex-shrink-0 rounded-sm overflow-hidden border z-10" style={{ borderColor: 'rgba(139, 69, 19, 0.3)' }}>
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            
                            {/* Details */}
                            <div className="flex-1 min-w-0 relative z-10 pt-1">
                              <h3 className="font-american-typewriter mb-3 text-sm sm:text-base leading-snug text-black/60 transition-colors duration-300 group-hover:text-black" style={{ letterSpacing: '0.03em' }}>
                                {item.name}
                              </h3>
                              {(item.batchNo || item.origin || item.primaryNote) && (
                                <p className="font-din-arabic text-xs sm:text-sm text-black/40 mb-2 leading-relaxed" style={{ letterSpacing: '0.05em' }}>
                                  {item.batchNo && (
                                    <>
                                      <span>Batch No. </span>
                                      <span className="transition-colors duration-300 group-hover:text-black">{item.batchNo}</span>
                                    </>
                                  )}
                                  {item.origin && (
                                    <>
                                      <span> · Origin: </span>
                                      <span className="transition-colors duration-300 group-hover:text-black">{item.origin}</span>
                                    </>
                                  )}
                                  {item.primaryNote && (
                                    <>
                                      <span> · Primary {item.category === 'candle' ? 'Note' : 'Extract'}: </span>
                                      <span className="transition-colors duration-300 group-hover:text-black">{item.primaryNote}</span>
                                    </>
                                  )}
                                </p>
                              )}
                              {item.description && (
                                <p className="font-din-arabic text-xs sm:text-sm text-black/40 line-clamp-2 leading-relaxed" style={{ letterSpacing: '0.05em' }}>
                                  {highlightBotanicalTerms(item.description)}
                                </p>
                              )}
                              {/* Mobile Price */}
                              <p className="md:hidden font-din-arabic mt-3 tracking-wider text-sm text-black/60 transition-colors duration-300 group-hover:text-black">
                                ₹{item.price.toLocaleString()}
                              </p>
                            </div>
                          </LocalizedClientLink>
                        ) : (
                          <div className="flex items-start space-x-5">
                            {/* Thumbnail */}
                            <div className="relative w-32 h-32 flex-shrink-0 rounded-sm overflow-hidden border z-10" style={{ borderColor: 'rgba(139, 69, 19, 0.3)' }}>
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            
                            {/* Details */}
                            <div className="flex-1 min-w-0 relative z-10 pt-1">
                              <h3 className="font-american-typewriter mb-3 text-sm sm:text-base leading-snug text-black/60 transition-colors duration-300 group-hover:text-black" style={{ letterSpacing: '0.03em' }}>
                                {item.name}
                              </h3>
                              {(item.batchNo || item.origin || item.primaryNote) && (
                                <p className="font-din-arabic text-xs sm:text-sm text-black/40 mb-2 leading-relaxed" style={{ letterSpacing: '0.05em' }}>
                                  {item.batchNo && (
                                    <>
                                      <span>Batch No. </span>
                                      <span className="transition-colors duration-300 group-hover:text-black">{item.batchNo}</span>
                                    </>
                                  )}
                                  {item.origin && (
                                    <>
                                      <span> · Origin: </span>
                                      <span className="transition-colors duration-300 group-hover:text-black">{item.origin}</span>
                                    </>
                                  )}
                                  {item.primaryNote && (
                                    <>
                                      <span> · Primary {item.category === 'candle' ? 'Note' : 'Extract'}: </span>
                                      <span className="transition-colors duration-300 group-hover:text-black">{item.primaryNote}</span>
                                    </>
                                  )}
                                </p>
                              )}
                              {item.description && (
                                <p className="font-din-arabic text-xs sm:text-sm text-black/40 line-clamp-2 leading-relaxed" style={{ letterSpacing: '0.05em' }}>
                                  {highlightBotanicalTerms(item.description)}
                                </p>
                              )}
                              {/* Mobile Price */}
                              <p className="md:hidden font-din-arabic mt-3 tracking-wider text-sm text-black/60 transition-colors duration-300 group-hover:text-black">
                                ₹{item.price.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Value - Desktop */}
                      <div className="hidden md:flex md:col-span-3 items-start justify-center pt-1" style={{ marginLeft: '40px' }}>
                        <p className="font-din-arabic tracking-wider text-sm text-black/60 transition-colors duration-300 group-hover:text-black">
                          ₹{item.price.toLocaleString()}
                        </p>
                      </div>

                      {/* Actions - Desktop */}
                      <div className="hidden md:flex md:col-span-3 items-center justify-center pt-1" style={{ marginLeft: '-20px' }}>
                        <div className="flex flex-col items-center space-y-2">
                          <button
                            onClick={() => handleAddToCartClick(item)}
                            disabled={addingItems.has(item.id) || isPending}
                            className="font-din-arabic text-xs text-black/60 hover:!text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {addingItems.has(item.id) ? '[Adding...]' : '[Add to Cart]'}
                          </button>
                          
                          <button
                            onClick={() => handleRemoveFromLedger(item)}
                            className="font-din-arabic text-xs text-black/60 hover:!text-black transition-colors"
                          >
                            [Remove]
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Actions */}
                    <div className="md:hidden mt-6 flex flex-col items-center space-y-2.5 col-span-12">
                      <button
                        onClick={() => handleAddToCartClick(item)}
                        disabled={addingItems.has(item.id) || isPending}
                        className="font-din-arabic text-sm text-black/60 hover:!text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {addingItems.has(item.id) ? '[Adding...]' : '[Add to Cart]'}
                      </button>
                      
                      <button
                        onClick={() => handleRemoveFromLedger(item)}
                        className="font-din-arabic text-xs text-black/60 hover:!text-black transition-colors"
                      >
                        [Remove]
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Ledger Footer */}
            <div className="mt-8 pt-6 border-t-2" style={{ borderColor: '#8b7759' }}>
              {/* Total Value Line */}
              <div className="grid grid-cols-12 gap-6 mb-4">
                <div className="col-span-1 hidden md:block"></div>
                <div className="col-span-12 md:col-span-5 flex items-center px-4 md:px-0">
                  <p className="font-american-typewriter text-xs sm:text-sm" style={{ letterSpacing: '0.05em', color: '#2d2520' }}>
                    Total Recorded Value
                  </p>
                  <div className="flex-1 mx-2 md:mx-3 border-b" style={{ borderColor: '#8b7759', borderStyle: 'dotted' }}></div>
                </div>
                <div className="col-span-12 md:col-span-3 flex items-center justify-center px-4 md:px-0 -mt-3 md:mt-0 md:ml-10">
                  <p className="font-din-arabic text-base sm:text-lg tabular-nums" style={{ color: '#8b7759', letterSpacing: '0.05em' }}>
                    ₹{ledger.reduce((sum: number, item: LedgerItem) => sum + item.price, 0).toLocaleString()}
                  </p>
                </div>
                <div className="hidden md:block md:col-span-3"></div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
