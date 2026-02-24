"use client"

import { documentToReactComponents } from "@contentful/rich-text-react-renderer"
import { BLOCKS, INLINES } from "@contentful/rich-text-types"
import { addToCartAction } from "@lib/data/cart-actions"
import { emitCartUpdated } from "@lib/util/cart-client"
import type { HttpTypes } from "@medusajs/types"
import { type LedgerItem, useLedger } from "app/context/ledger-context"
import {
  ChevronRight as BreadcrumbChevron,
  ChevronLeft,
  ChevronRight,
  Heart,
  Home,
  Minus,
  Plus,
  Share2,
  Star,
  X,
} from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useRouter } from "next/navigation"
import React, { useEffect, useMemo, useState, useTransition } from "react"
import { IoIosArrowDown } from "react-icons/io"
import { toast } from "sonner"
import {
  type BreadcrumbItem as ContentfulBreadcrumbItem,
  DynamicPanel,
  type ProductContent,
  type ProductInfoPanels,
} from "../../types/contentful"
import { InfoPanel } from "./InfoPanel"
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb"
import { Label } from "./ui/label"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  isRitualProduct?: boolean
  variant_id?: string
}

interface ProductHeroProps {
  product: HttpTypes.StoreProduct
  countryCode: string
  onCartUpdate?: (item: CartItem | null) => void
  productInfoPanels?: ProductInfoPanels | null
  productContent?: ProductContent | null
}

const extractNumericSize = (label: string) => {
  const match = label?.toLowerCase().match(/([\d.]+)\s*(ml|l|g|kg|oz)?/)
  if (!match) {
    return Number.MAX_SAFE_INTEGER
  }

  const value = parseFloat(match[1])
  const unit = match[2]

  if (!unit || unit === "ml" || unit === "g" || unit === "oz") {
    return value
  }

  if (unit === "l") {
    return value * 1000
  }

  if (unit === "kg") {
    return value * 1000
  }

  return value
}

const buildSizeOptions = (product: ProductHeroProps["product"], sizeOptionId?: string) => {
  return (product.variants || [])
    .map((variant) => {
      const label = sizeOptionId
        ? (variant?.options?.find((opt) => opt.option_id === sizeOptionId)?.value ??
          variant?.title ??
          "")
        : (variant?.title ?? variant?.options?.[0]?.value ?? "")

      return label
        ? {
          id: variant.id,
          label,
        }
        : null
    })
    .filter((option): option is { id: string; label: string } => Boolean(option))
    .sort((a, b) => extractNumericSize(a.label) - extractNumericSize(b.label))
}

const isRecognizedSizeLabel = (label: string) =>
  extractNumericSize(label) !== Number.MAX_SAFE_INTEGER

export function ProductHero({
  product,
  countryCode,
  onCartUpdate,
  onVariantChange,
  productInfoPanels,
  productContent,
}: ProductHeroProps & {
  onVariantChange?: (variantId: string | null) => void
}) {
  const [isRitualPanelOpen, setIsRitualPanelOpen] = useState(false)
  const [isActivesPanelOpen, setIsActivesPanelOpen] = useState(false)
  const [isFragranceNotesOpen, setIsFragranceNotesOpen] = useState(false)
  const [isIngredientsPanelOpen, setIsIngredientsPanelOpen] = useState(false)

  // Dynamic panel states - for future extensibility
  const [openPanelId, setOpenPanelId] = useState<string | null>(null)

  // Accordion states for mobile
  const [openAccordionId, setOpenAccordionId] = useState<string | null>(null)

  // Track if we're on mobile (below lg breakpoint - 1024px)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isAddedToCart, setIsAddedToCart] = useState(false)
  const [adding, setAdding] = useState(false)
  const [uiError, setUiError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const { toggleLedgerItem, isInLedger } = useLedger()
  const sizeOptionId = product.options?.find(
    (option) => (option?.title || "").toLowerCase() === "size"
  )?.id
  const sizeOptions = useMemo(
    () => buildSizeOptions(product, sizeOptionId),
    [product, sizeOptionId]
  )
  const visibleSizeOptions = useMemo(() => {
    const seen = new Map<string, { id: string; label: string }>()

    sizeOptions.forEach((option) => {
      const key = option.label.trim().toLowerCase()
      if (!seen.has(key)) {
        seen.set(key, option)
      }
    })

    return Array.from(seen.values())
  }, [sizeOptions])
  const defaultVariantId = useMemo(() => {
    if (!product.variants?.length) {
      return null
    }

    if (!visibleSizeOptions.length) {
      return product.variants[0]?.id ?? null
    }

    const preferredOption =
      visibleSizeOptions.find((option) =>
        option.label.replace(/\s+/g, "").toLowerCase().includes("500ml")
      ) ?? visibleSizeOptions[visibleSizeOptions.length - 1]

    return preferredOption?.id ?? product.variants[0]?.id ?? null
  }, [product, visibleSizeOptions])
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(defaultVariantId)
  useEffect(() => {
    setSelectedVariantId(defaultVariantId)
    // Only call onVariantChange if it's actually different and not undefined
    if (defaultVariantId !== null && defaultVariantId !== undefined) {
      onVariantChange?.(defaultVariantId)
    }
  }, [defaultVariantId])
  const selectedVariant =
    product.variants?.find((v) => v.id === selectedVariantId) ?? product.variants?.[0]

  // Check if variant is in stock
  const isOutOfStock = useMemo(() => {
    if (!selectedVariant) return true
    // If inventory is not managed, consider it in stock
    if (!selectedVariant.manage_inventory) return false
    // If backorders are allowed, consider it in stock
    if (selectedVariant.allow_backorder) return false
    // Check inventory quantity
    const inventoryQty = selectedVariant.inventory_quantity ?? 0
    return inventoryQty <= 0
  }, [selectedVariant])

  const minorAmount = selectedVariant?.calculated_price?.calculated_amount ?? 0
  console.log("🔍 ProductHero - minorAmount:", {
    minorAmount,
    calculated_amount: selectedVariant?.calculated_price?.calculated_amount,
    variantId: selectedVariantId,
  })

  const fallbackImg = product.thumbnail ?? "/assets/productImage.png"
  const imgs = product.images?.map((i) => i.url).filter(Boolean) ?? []
  const productImages = imgs.length ? imgs : [fallbackImg]

  const selectedSizeLabel = visibleSizeOptions.find((opt) => opt.id === selectedVariantId)?.label
  const uniqueSizeLabels = useMemo(
    () => Array.from(new Set(visibleSizeOptions.map((option) => option.label.toLowerCase()))),
    [visibleSizeOptions]
  )
  const shouldShowSizeOptions =
    visibleSizeOptions.length > 1 && uniqueSizeLabels.every(isRecognizedSizeLabel)

  // Check if the product is a candle

  // Check if using dynamic panels (new approach) or legacy fields (backward compatibility)
  const useDynamicPanels = productInfoPanels?.panels && productInfoPanels.panels.length > 0

  // Default content (for legacy approach)
  const defaultRitualInPractice =
    "Dispense a measured amount. Work slowly into damp hands, letting the exfoliating texture and black tea notes awaken the senses. Rinse away — hands refreshed, reset, and primed."
  const defaultActives = [
    {
      name: "Black Tea Extract —",
      description: "antioxidant-rich, energizing.",
    },
    {
      name: "Colloidal Oats —",
      description: "natural scrubbing agent that lifts impurities gently.",
    },
    {
      name: "Panthenol (Pro-Vitamin B5) —",
      description: "hydrates and supports skin barrier.",
    },
    {
      name: "Aloe Leaf Water —",
      description: "refreshing, helps soothe after exfoliation.",
    },
    { name: "Glycerin —", description: "draws in and holds moisture." },
  ]
  const defaultFragranceNotes = [
    { type: "Top Notes —", description: "Fresh Pine" },
    { type: "Heart Notes —", description: "Resinous Balsam" },
    { type: "Base Notes —", description: "Grounded Cedarwood" },
  ]
  const defaultFullIngredients =
    "Water, Sodium Laureth Sulfate, Cocamidopropyl Betaine, Black Tea Extract (Camellia Sinensis), Colloidal Oatmeal, Panthenol (Pro-Vitamin B5), Aloe Barbadensis Leaf Juice, Glycerin, Sodium Chloride, Citric Acid, Phenoxyethanol, Ethylhexylglycerin, Natural Fragrance, Tocopherol (Vitamin E)."

  const ritualInPractice = productInfoPanels?.ritualInPractice || defaultRitualInPractice
  const actives =
    productInfoPanels?.actives && productInfoPanels.actives.length > 0
      ? productInfoPanels.actives
      : defaultActives
  const fragranceNotes =
    productInfoPanels?.fragranceNotes && productInfoPanels.fragranceNotes.length > 0
      ? productInfoPanels.fragranceNotes
      : defaultFragranceNotes
  const fullIngredients = productInfoPanels?.fullIngredients || defaultFullIngredients

  // Dynamic panels (for future extensibility)
  const dynamicPanels = productInfoPanels?.panels || []

  // Extract accordion items from productContent (Contentful)
  const accordionItems = productContent?.productAccordion || []

  // Rich text render options for Contentful accordion content
  const renderOptions = {
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node: any, children: any) => (
        <p className="mb-4 font-din-arabic text-black/80 leading-relaxed text-sm">{children}</p>
      ),
      [BLOCKS.HEADING_1]: (node: any, children: any) => (
        <h1 className="text-xl font-american-typewriter mb-4 text-black">{children}</h1>
      ),
      [BLOCKS.HEADING_2]: (node: any, children: any) => (
        <h2 className="text-lg font-american-typewriter mb-3 text-black">{children}</h2>
      ),
      [BLOCKS.HEADING_3]: (node: any, children: any) => (
        <h3 className="text-base font-american-typewriter mb-2 text-black">{children}</h3>
      ),
      [BLOCKS.UL_LIST]: (node: any, children: any) => (
        <ul className="list-disc pl-5 mb-4 space-y-1">{children}</ul>
      ),
      [BLOCKS.OL_LIST]: (node: any, children: any) => (
        <ol className="list-decimal pl-5 mb-4 space-y-1">{children}</ol>
      ),
      [BLOCKS.LIST_ITEM]: (node: any, children: any) => (
        <li className="font-din-arabic text-black/80 text-sm">{children}</li>
      ),
      [INLINES.HYPERLINK]: (node: any, children: any) => (
        <a
          href={node.data.uri}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#a28b6f] underline hover:text-black transition-colors"
        >
          {children}
        </a>
      ),
    },
    renderText: (text: string) => {
      // Handle line breaks (Shift+Enter) in Contentful rich text
      return text.split("\n").map((line, i, arr) => (
        <React.Fragment key={i}>
          {line}
          {i < arr.length - 1 && <br />}
        </React.Fragment>
      ))
    },
  }

  // Check if we have Contentful breadcrumbs, otherwise fall back to category-based logic
  const contentfulBreadcrumbs = productContent?.breadCrumbs || []
  const useContentfulBreadcrumbs = contentfulBreadcrumbs.length > 0

  // Fallback: Category-based breadcrumb logic using product.categories[0].name and description
  const category = product.categories?.[0]
  const breadcrumbParentCategory = (category as any)?.description || null
  const breadcrumbCategory = category?.name || "Uncategorized"
  const breadcrumbProduct = product.title || "Product"

  const metadata = category?.metadata as Record<string, any> | undefined
  const parentCategoryUrl = metadata?.parent_category_url
  const subCategoryUrl = metadata?.sub_category_url

  const handleAddToCart = () => {
    if (!selectedVariantId || adding || isPending) return

    // instant UI — don't block on network
    setAdding(true)
    setUiError(null)
    setIsAddedToCart(true)

    // Get variant title for display
    const variantTitle = selectedSizeLabel || selectedVariant?.title || "Default"
    const itemId = `${product.id}-${selectedVariantId}`

    // optimistic nav/sticky updates if parent listens (regular product - no image in nav)
    // calculated_amount is already in major units (rupees), no conversion needed
    console.log("🔍 ProductHero - Adding item with price:", {
      minorAmount,
      calculated_amount: selectedVariant?.calculated_price?.calculated_amount,
      variantId: selectedVariantId,
      itemId,
      variantTitle,
    })
    onCartUpdate?.({
      id: itemId,
      name: `${product.title} (${variantTitle})`,
      price: minorAmount,
      quantity,
      image: fallbackImg,
      isRitualProduct: false,
      variant_id: selectedVariantId,
      product_id: product.id,
      handle: product.handle,
      metadata: { variantTitle, variantId: selectedVariantId },
    } as any)
    emitCartUpdated({ quantityDelta: quantity })

    // network in the background
    startTransition(async () => {
      try {
        const result = await addToCartAction({
          variantId: selectedVariantId,
          quantity,
          countryCode: (countryCode || "in").toLowerCase(),
        })
        console.log("✅ Server action completed successfully:", result)

        // Update the cart item with the server line item ID for future updates
        if (result?.lineItemId) {
          onCartUpdate?.({
            id: itemId,
            name: `${product.title} (${variantTitle})`,
            price: minorAmount,
            quantity,
            image: fallbackImg,
            isRitualProduct: false,
            variant_id: selectedVariantId,
            product_id: product.id,
            handle: product.handle,
            metadata: { variantTitle, variantId: selectedVariantId },
            line_item_id: result.lineItemId,
          } as any)
        }
      } catch (e: any) {
        // roll back optimistic message
        setIsAddedToCart(false)
        const errorMessage = e?.message || "Could not add to cart"
        setUiError(errorMessage)
        console.error(e)

        // Show toast notification for error
        const errorMsg = String(errorMessage || "").toLowerCase()
        if (
          errorMsg.includes("inventory") ||
          errorMsg.includes("required inventory") ||
          errorMsg.includes("stock") ||
          errorMsg.includes("variant does not have")
        ) {
          toast.error("Inventory error", {
            description:
              "This product is currently out of stock or unavailable. Please try again later.",
            duration: 5000,
          })
        } else {
          toast.error("Failed to add to cart", {
            description: errorMessage,
            duration: 4000,
          })
        }
      } finally {
        // keep the checkmark visible briefly, then clear
        setTimeout(() => {
          setAdding(false)
          setIsAddedToCart(false)
        }, 900)
      }
    })
  }

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity)
    // keep parent UI synced while changing qty (optional)
    // calculated_amount is already in major units (rupees), no conversion needed
    if (selectedVariantId) {
      const variantTitle = selectedSizeLabel || selectedVariant?.title || "Default"
      const itemId = `${product.id}-${selectedVariantId}`
      onCartUpdate?.({
        id: itemId,
        name: `${product.title} (${variantTitle})`,
        price: minorAmount,
        quantity: newQuantity,
        image: fallbackImg,
        isRitualProduct: false,
        variant_id: selectedVariantId,
        product_id: product.id,
        handle: product.handle,
        metadata: { variantTitle, variantId: selectedVariantId },
      } as any)
    }
  }

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? productImages.length - 1 : prev - 1))
  }
  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === productImages.length - 1 ? 0 : prev + 1))
  }

  const handleToggleLedger = () => {
    const alreadyInLedger = isInLedger(product.id)
    const ledgerItem: LedgerItem = {
      id: product.id,
      name: product.title,
      price: minorAmount,
      image: productImages[0] ?? fallbackImg,
      description: product.subtitle ?? product.description ?? "",
      size: selectedSizeLabel,
      availableSizes: visibleSizeOptions.map((opt) => opt.label),
      selectedVariantId,
      variants: product.variants,
      countryCode,
    }

    toggleLedgerItem(ledgerItem)
    toast.success(`${product.title} ${alreadyInLedger ? "removed from" : "added to"} Ledger`, {
      duration: 2000,
    })
  }

  const isProductInLedger = isInLedger(product.id)

  return (
    <div
      className="flex flex-col-reverse lg:flex-row pl-0 md:pl-8 lg:pl-16 xl:pl-15 relative overflow-hidden"
      style={{ paddingTop: "80px", minHeight: "35vh" }}
    >
      {/* LEFT: (content) */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full lg:w-[40%] flex items-center py-8 md:py-12 px-4 md:px-4 relative overflow-hidden"
        style={{ backgroundColor: "#e3e3d8" }}
      >
        <div className="space-y-6 px-4 md:pl-2 md:pr-12 relative z-10">
          {/* Breadcrumbs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Breadcrumb>
              <BreadcrumbList>
                {useContentfulBreadcrumbs ? (
                  // Use Contentful breadcrumbs
                  contentfulBreadcrumbs.map((crumb: ContentfulBreadcrumbItem, index: number) => {
                    const isLast = index === contentfulBreadcrumbs.length - 1
                    const isFirst = index === 0
                    const isHome = isFirst && crumb.title.toLowerCase().includes("home")

                    return (
                      <React.Fragment key={index}>
                        {index > 0 && (
                          <BreadcrumbSeparator>
                            <BreadcrumbChevron className="w-3 h-3" style={{ color: "#a28b6f" }} />
                          </BreadcrumbSeparator>
                        )}
                        <BreadcrumbItem>
                          {isLast ? (
                            <BreadcrumbPage className="font-din-arabic text-xs tracking-wide text-black/80">
                              {isHome && <Home className="w-3 h-3 mr-1 inline mr-1" />}
                              {crumb.title}
                            </BreadcrumbPage>
                          ) : (
                            <BreadcrumbLink
                              href={crumb.url}
                              className={`font-din-arabic text-xs tracking-wide flex items-center ${isHome ? "" : "text-black/80 hover:underline"
                                }`}
                              style={isHome ? { color: "#a28b6f" } : {}}
                            >
                              {isHome && <Home className="w-3 h-3 mr-1" />}
                              {crumb.title}
                            </BreadcrumbLink>
                          )}
                        </BreadcrumbItem>
                      </React.Fragment>
                    )
                  })
                ) : (
                  // Fallback to category-based breadcrumbs
                  <>
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        href={`/${countryCode}`}
                        className="font-din-arabic text-xs tracking-wide flex items-center"
                        style={{ color: "#a28b6f" }}
                      >
                        <Home className="w-3 h-3 mr-1" />
                        Home
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    {breadcrumbParentCategory && (
                      <>
                        <BreadcrumbSeparator>
                          <BreadcrumbChevron className="w-3 h-3" style={{ color: "#a28b6f" }} />
                        </BreadcrumbSeparator>
                        <BreadcrumbItem>
                          {parentCategoryUrl ? (
                            <BreadcrumbLink
                              href={parentCategoryUrl}
                              className="font-din-arabic text-xs tracking-wide text-black/80 hover:underline"
                            >
                              {breadcrumbParentCategory}
                            </BreadcrumbLink>
                          ) : (
                            <BreadcrumbPage className="font-din-arabic text-xs tracking-wide text-black/80">
                              {breadcrumbParentCategory}
                            </BreadcrumbPage>
                          )}
                        </BreadcrumbItem>
                      </>
                    )}
                    <BreadcrumbSeparator>
                      <BreadcrumbChevron className="w-3 h-3" style={{ color: "#a28b6f" }} />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                      {subCategoryUrl ? (
                        <BreadcrumbLink
                          href={subCategoryUrl}
                          className="font-din-arabic text-xs tracking-wide text-black/80 hover:underline"
                        >
                          {breadcrumbCategory}
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage className="font-din-arabic text-xs tracking-wide text-black/80">
                          {breadcrumbCategory}
                        </BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                      <BreadcrumbChevron className="w-3 h-3" style={{ color: "#a28b6f" }} />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                      <BreadcrumbPage className="font-din-arabic text-xs tracking-wide text-black/80">
                        {breadcrumbProduct}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </motion.div>
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-american-typewriter text-2xl md:text-3xl tracking-tight text-black relative"
            style={{ paddingTop: "8px", paddingBottom: "8px" }}
          >
            <span className="relative">
              {product.title}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="absolute -bottom-2 left-0 h-px w-full origin-left"
                style={{ backgroundColor: "#a28b6f" }}
              />
            </span>
          </motion.h1>

          {/* Subtitle */}
          {product.subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="font-din-arabic text-black/80 leading-relaxed mb-4"
            >
              {product.subtitle}
            </motion.p>
          )}

          {/* Size Selection with Radio Buttons */}
          {shouldShowSizeOptions && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="space-y-3 pb-0 pt-3"
            >
              <h3
                className="font-din-arabic text-sm tracking-wider uppercase"
                style={{ color: "#a28b6f" }}
              >
                SIZE
              </h3>
              <RadioGroup
                value={selectedVariantId ?? ""}
                onValueChange={(value: string) => {
                  console.log("🔍 RadioGroup - onValueChange called:", {
                    newValue: value,
                    currentSelected: selectedVariantId,
                    visibleOptions: visibleSizeOptions.map((o) => ({
                      id: o.id,
                      label: o.label,
                    })),
                  })
                  if (value && value !== selectedVariantId) {
                    setSelectedVariantId(value)
                    onVariantChange?.(value)
                  }
                }}
                className="!flex flex-row gap-6"
              >
                {visibleSizeOptions.map((opt) => (
                  <div key={opt.id} className="flex items-center gap-2">
                    <RadioGroupItem
                      value={opt.id}
                      id={`size-${opt.id}`}
                      className="peer size-4 border-2 border-black/40 data-[state=checked]:border-[#00000066]"
                    />
                    <Label
                      htmlFor={`size-${opt.id}`}
                      className="font-din-arabic text-black cursor-pointer"
                    >
                      {opt.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </motion.div>
          )}

          {/* Price */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="space-y-2 pb-4 pt-2"
          >
            <p className="font-din-arabic-bold text-2xl md:text-3xl text-black mt-4">
              ₹{minorAmount}
            </p>
          </motion.div>

          {/* QTY + Add */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="space-y-4"
          >
            <h3
              className="font-din-arabic text-sm tracking-wider uppercase"
              style={{ color: "#a28b6f" }}
            >
              QUANTITY
            </h3>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <div className="relative w-full sm:w-auto">
                <select
                  value={quantity.toString()}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                  className="font-din-arabic appearance-none bg-transparent border border-black/30 px-4 py-3 pr-8 text-black focus:outline-none focus:border-black transition-colors w-full sm:min-w-[80px]"
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={(i + 1).toString()}>
                      {(i + 1).toString()}
                    </option>
                  ))}
                </select>
                <IoIosArrowDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-black/60 pointer-events-none" />
              </div>

              {isOutOfStock ? (
                <button
                  disabled
                  className="font-din-arabic px-6 md:px-8 py-3 bg-[#a28b6f]/30 text-black/50 border border-[#a28b6f]/40 cursor-not-allowed tracking-wide w-full sm:w-auto transition-all duration-300"
                >
                  Out of Stock
                </button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className="font-din-arabic px-6 md:px-8 py-3 bg-black text-white hover:bg-black/90 transition-all duration-300 tracking-wide relative overflow-hidden w-full sm:w-auto"
                  disabled={!selectedVariantId || adding || isPending}
                >
                  <AnimatePresence mode="wait">
                    {isAddedToCart ? (
                      <motion.span
                        key="added"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        Added to Cart
                      </motion.span>
                    ) : (
                      <motion.span
                        key="add"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        Add to cart
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              )}
              {uiError && (
                <p className="text-xs mt-2" style={{ color: "#b42318" }}>
                  {uiError}
                </p>
              )}
            </div>
          </motion.div>

          {/* Description */}
          {product.description && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="space-y-2 mt-6 mb-6"
            >
              <p className="font-din-arabic text-sm md:text-base text-black/80 leading-relaxed py-4">
                {product.description}
              </p>
            </motion.div>
          )}

          {/* Dynamic Accordion Items from Contentful productContent */}
          {accordionItems.map((item, index) => (
            <React.Fragment key={item.title || index}>
              {/* Separator line */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{
                  duration: 0.6,
                  delay: 0.9 + index * 0.1,
                }}
                className="w-full h-px origin-left"
                style={{
                  backgroundColor: "rgba(185, 168, 147, 0.22)",
                }}
              />

              {/* Collapsible Accordion Item */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 1.0 + index * 0.1,
                }}
                className="space-y-1"
              >
                <button
                  onClick={() => {
                    if (isMobile) {
                      setOpenAccordionId(openAccordionId === item.title ? null : item.title)
                    } else {
                      setOpenPanelId(item.title)
                    }
                  }}
                  className="flex items-center justify-between w-full py-1 text-left group"
                >
                  <span
                    className="font-din-arabic text-sm tracking-wider uppercase transition-colors duration-300"
                    style={{ color: "#a28b6f" }}
                  >
                    {item.title}
                  </span>
                  <motion.div
                    initial={false}
                    animate={{ rotate: 0 }}
                    whileHover={{ rotate: 0 }}
                    transition={{
                      duration: 0.3,
                      ease: "easeInOut",
                    }}
                  >
                    {openAccordionId === item.title ? (
                      <Minus
                        className="w-4 h-4 transition-colors duration-300"
                        style={{ color: "#a28b6f" }}
                      />
                    ) : (
                      <Plus
                        className="w-4 h-4 transition-colors duration-300"
                        style={{ color: "#a28b6f" }}
                      />
                    )}
                  </motion.div>
                </button>

                {/* Accordion Content - Mobile Only */}
                <AnimatePresence>
                  {openAccordionId === item.title && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                      }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: 0.3,
                        ease: "easeInOut",
                      }}
                      className="overflow-hidden lg:hidden"
                    >
                      <div className="pt-3 pb-2">
                        {item.content ? (
                          <div className="prose prose-sm max-w-none">
                            {documentToReactComponents(item.content, renderOptions)}
                          </div>
                        ) : (
                          <div
                            className="font-din-arabic text-black/80 leading-relaxed text-sm prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: item.contentText }}
                          />
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </React.Fragment>
          ))}

          {/* Dynamic Panel Buttons - render if using dynamic panels (new approach) */}
          {useDynamicPanels &&
            dynamicPanels.map((panel, index) => {
              if (!panel.isVisible) return null

              return (
                <React.Fragment key={panel.id}>
                  {/* Separator line */}
                  <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{
                      duration: 0.6,
                      delay: 1.7 + index * 0.1,
                    }}
                    className="w-full h-px origin-left"
                    style={{
                      backgroundColor: "rgba(185, 168, 147, 0.22)",
                    }}
                  />

                  {/* Panel Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: 1.8 + index * 0.1,
                    }}
                    className="space-y-1"
                  >
                    <button
                      onClick={() => {
                        // On mobile (below lg), use accordion; on desktop, use drawer
                        if (isMobile) {
                          setOpenAccordionId(openAccordionId === panel.id ? null : panel.id)
                        } else {
                          setOpenPanelId(panel.id)
                        }
                      }}
                      className="flex items-center justify-between w-full py-1 text-left group"
                    >
                      <span
                        className="font-din-arabic text-sm tracking-wider uppercase transition-colors duration-300"
                        style={{ color: "#a28b6f" }}
                      >
                        {panel.title}
                      </span>
                      <motion.div
                        initial={false}
                        animate={{
                          rotate: 0,
                        }}
                        whileHover={{ rotate: 0 }}
                        transition={{
                          duration: 0.3,
                          ease: "easeInOut",
                        }}
                      >
                        {openAccordionId === panel.id ? (
                          <Minus
                            className="w-4 h-4 transition-colors duration-300"
                            style={{
                              color: "#a28b6f",
                            }}
                          />
                        ) : (
                          <Plus
                            className="w-4 h-4 transition-colors duration-300"
                            style={{
                              color: "#a28b6f",
                            }}
                          />
                        )}
                      </motion.div>
                    </button>
                    {/* Accordion Content - Mobile Only */}
                    <AnimatePresence>
                      {openAccordionId === panel.id && (
                        <motion.div
                          initial={{
                            height: 0,
                            opacity: 0,
                          }}
                          animate={{
                            height: "auto",
                            opacity: 1,
                          }}
                          exit={{
                            height: 0,
                            opacity: 0,
                          }}
                          transition={{
                            duration: 0.3,
                            ease: "easeInOut",
                          }}
                          className="overflow-hidden lg:hidden"
                        >
                          <div className="pt-3 pb-2">
                            {(() => {
                              switch (panel.type) {
                                case "text":
                                  return (
                                    <p className="font-din-arabic text-black/80 leading-relaxed text-sm">
                                      {typeof panel.content === "string" ? panel.content : ""}
                                    </p>
                                  )
                                case "actives":
                                  return (
                                    <div className="space-y-4">
                                      {Array.isArray(panel.content) &&
                                        panel.content.map((active: any, idx: number) => (
                                          <div key={idx} className="group">
                                            <span className="font-din-arabic text-black inline text-sm">
                                              {active.name}{" "}
                                            </span>
                                            <span className="font-din-arabic text-black/70 group-hover:text-black transition-colors text-sm">
                                              {active.description}
                                            </span>
                                          </div>
                                        ))}
                                    </div>
                                  )
                                case "fragrance":
                                  return (
                                    <div className="space-y-4">
                                      {Array.isArray(panel.content) &&
                                        panel.content.map((note: any, idx: number) => (
                                          <div key={idx} className="group">
                                            <span className="font-din-arabic text-black inline text-sm">
                                              {note.type}{" "}
                                            </span>
                                            <span className="font-din-arabic text-black/70 group-hover:text-black transition-colors text-sm">
                                              {note.description}
                                            </span>
                                          </div>
                                        ))}
                                    </div>
                                  )
                                case "ingredients":
                                  return (
                                    <p className="font-din-arabic text-black/70 text-sm leading-relaxed">
                                      {typeof panel.content === "string" ? panel.content : ""}
                                    </p>
                                  )
                                default:
                                  return (
                                    <p className="font-din-arabic text-black/80 leading-relaxed text-sm">
                                      {typeof panel.content === "string" ? panel.content : ""}
                                    </p>
                                  )
                              }
                            })()}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </React.Fragment>
              )
            })}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full lg:w-[60%] relative overflow-hidden h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-auto lg:min-h-[calc(100vh-80px)] flex"
        style={{ backgroundColor: "#d6d6c6" }}
      >
        {/* Product Image - Full Section Coverage */}
        <img
          src={productImages[currentImageIndex]}
          alt="Jardin Botanica Tea Exfoliant Rinse"
          className="absolute inset-0 w-full h-full object-contain object-center"
          style={{
            filter: "drop-shadow(0 20px 45px rgba(0, 0, 0, 0.15))",
          }}
        />
        {/* </div> */}

        {/* Botanical Blend Badge - Top Left */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="absolute top-8 left-8 z-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
            <Star className="w-3 h-3" style={{ color: "#a28b6f" }} />
            <span
              className="font-din-arabic uppercase text-xs tracking-wide"
              style={{ color: "#a28b6f" }}
            >
              {(product.metadata?.botanical as string | undefined) || "BOTANICAL BLEND"}
            </span>
          </div>
        </motion.div>

        {/* Action Icons - Positioned at top-right above product image */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="absolute top-8 right-8 flex items-center gap-4 z-20"
        >
          {/* Favorite/Wishlist Icon */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleLedger}
            className={`p-2 transition-all bg-white/20 backdrop-blur-sm rounded-full border border-white/30 hover:bg-white/30 ${isProductInLedger ? "text-[#e58a4d]" : "text-black/60 hover:text-black"
              }`}
            aria-label={isProductInLedger ? "Remove from ledger" : "Add to ledger"}
          >
            <Heart
              className={`w-5 h-5 transition-colors ${isProductInLedger ? "fill-[#e58a4d] stroke-[#e58a4d]" : "stroke-current"
                }`}
            />
          </motion.button>

          {/* Share Icon */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: product.title,
                  text: product.description || product.title,
                  url: window.location.href,
                })
              } else {
                navigator.clipboard.writeText(window.location.href)
                toast.success("Link copied to clipboard", {
                  duration: 2000,
                })
              }
            }}
            className="p-2 text-black/60 hover:text-black transition-colors bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30"
            aria-label="Share product"
          >
            <Share2 className="w-5 h-5" />
          </motion.button>
        </motion.div>

        {/* Enhanced Previous Arrow */}
        <motion.button
          whileHover={{
            scale: 1.1,
            backgroundColor: "rgba(162, 139, 111, 0.1)",
          }}
          whileTap={{ scale: 0.9 }}
          onClick={handlePrevImage}
          className="absolute left-4 sm:left-8 top-1/2 transform -translate-y-1/2 z-10 p-3 sm:p-4 rounded-full text-black/60 hover:text-black transition-all backdrop-blur-sm"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </motion.button>

        {/* Enhanced Next Arrow */}
        <motion.button
          whileHover={{
            scale: 1.1,
            backgroundColor: "rgba(162, 139, 111, 0.1)",
          }}
          whileTap={{ scale: 0.9 }}
          onClick={handleNextImage}
          className="absolute right-4 sm:right-8 top-1/2 transform -translate-y-1/2 z-10 p-3 sm:p-4 rounded-full text-black/60 hover:text-black transition-all backdrop-blur-sm"
          aria-label="Next image"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </motion.button>

        {/* Enhanced Image Indicators */}
        <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
          {productImages.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${currentImageIndex === index ? "w-8" : ""
                }`}
              style={{
                backgroundColor: currentImageIndex === index ? "#a28b6f" : "rgba(0, 0, 0, 0.3)",
              }}
              aria-label={`View image ${index + 1}`}
            />
          ))}
        </div>
      </motion.div>
      {/* Panels */}
      <InfoPanel
        isOpen={isRitualPanelOpen}
        onClose={() => setIsRitualPanelOpen(false)}
        title="Ritual in Practice"
      >
        <p className="font-din-arabic text-black/80 leading-relaxed">{ritualInPractice}</p>
      </InfoPanel>
      <InfoPanel
        isOpen={isActivesPanelOpen}
        onClose={() => setIsActivesPanelOpen(false)}
        title="Actives & Key Botanicals"
      >
        <div className="space-y-4">
          {actives.map((active, index) => (
            <div key={index} className="group">
              <span className="font-din-arabic text-black inline">{active.name} </span>
              <span className="font-din-arabic text-black/70 group-hover:text-black transition-colors">
                {active.description}
              </span>
            </div>
          ))}
        </div>
      </InfoPanel>
      <InfoPanel
        isOpen={isFragranceNotesOpen}
        onClose={() => setIsFragranceNotesOpen(false)}
        title="Fragrance Profile"
      >
        <div className="space-y-4">
          {fragranceNotes.map((note, index) => (
            <div key={index} className="group">
              <span className="font-din-arabic text-black inline">{note.type} </span>
              <span className="font-din-arabic text-black/70 group-hover:text-black transition-colors">
                {note.description}
              </span>
            </div>
          ))}
        </div>
      </InfoPanel>
      <InfoPanel
        isOpen={isIngredientsPanelOpen}
        onClose={() => setIsIngredientsPanelOpen(false)}
        title="Full Ingredients"
      >
        <p className="font-din-arabic text-black/70 text-sm leading-relaxed">{fullIngredients}</p>
      </InfoPanel>

      {/* Dynamic Accordion Panels from Contentful productContent */}
      {accordionItems.map((item, index) => (
        <InfoPanel
          key={item.title || index}
          isOpen={openPanelId === item.title}
          onClose={() => setOpenPanelId(null)}
          title={item.title}
        >
          {item.content ? (
            <div className="prose prose-sm max-w-none">
              {documentToReactComponents(item.content, renderOptions)}
            </div>
          ) : (
            <div
              className="font-din-arabic text-black/80 leading-relaxed prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: item.contentText }}
            />
          )}
        </InfoPanel>
      ))}
    </div>
  )
}
