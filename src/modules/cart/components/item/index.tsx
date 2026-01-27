"use client"

import { deleteLineItem, updateLineItem, updateLineItemGift } from "@lib/data/cart"
import type { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Spinner from "@modules/common/icons/spinner"
import { motion } from "framer-motion"
import { Gift, X } from "lucide-react"
import { useState } from "react"
import { ProductTitleTooltip } from "./product-title-tooltip"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem
  type?: "full" | "preview"
  currencyCode: string
  index?: number
}

const Item = ({ item, type = "full", currencyCode, index = 0 }: ItemProps) => {
  const [updating, setUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [giftUpdating, setGiftUpdating] = useState(false)

  // Read gift data from line item metadata (persisted in database)
  const itemMetadata = (item as any).metadata || {}
  const isGift = itemMetadata.is_gift === true || itemMetadata.is_gift === "true"

  // Check gift eligibility: first from line item metadata, then from product categories
  const canBeGiftedFromMetadata = itemMetadata.can_be_gifted === true || itemMetadata.can_be_gifted === "true"
  const canBeGiftedFromCategory = (item as any).product?.categories?.some((category: any) => {
    const categoryMetadata = category?.metadata as Record<string, any> | undefined
    return categoryMetadata?.can_be_gifted === true || categoryMetadata?.can_be_gifted === "true"
  }) ?? false
  const canBeGifted = canBeGiftedFromMetadata || canBeGiftedFromCategory

  const giftQty = typeof itemMetadata.gift_quantity === 'number'
    ? itemMetadata.gift_quantity
    : (isGift ? item.quantity : 0)

  // Toggle marking item as gift
  const handleToggleGift = async () => {
    if (giftUpdating) return

    setGiftUpdating(true)
    try {
      const newIsGift = !isGift
      await updateLineItemGift({
        lineId: item.id,
        quantity: item.quantity,
        isGift: newIsGift,
        giftQuantity: newIsGift ? item.quantity : 0,
      })
    } catch (error) {
      console.error("Failed to toggle gift status:", error)
    } finally {
      setGiftUpdating(false)
    }
  }

  // Update gift quantity in database
  const handleGiftChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value)
    if (isNaN(val) || giftUpdating) return

    setGiftUpdating(true)
    try {
      await updateLineItemGift({
        lineId: item.id,
        quantity: item.quantity,
        isGift: val > 0,
        giftQuantity: val,
      })
    } catch (error) {
      console.error("Failed to update gift quantity:", error)
    } finally {
      setGiftUpdating(false)
    }
  }

  const changeQuantity = async (quantity: number) => {
    if (quantity < 1) return

    setUpdating(true)

    await updateLineItem({
      lineId: item.id,
      quantity,
    }).finally(() => {
      setUpdating(false)
    })
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    await deleteLineItem(item.id).catch(() => {
      setIsDeleting(false)
    })
  }

  // TODO: Update this to grab the actual max inventory
  const maxQtyFromInventory = 10
  const maxQuantity = item.variant?.manage_inventory ? 10 : maxQtyFromInventory
  const canIncrease = item.quantity < maxQuantity

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex items-start space-x-4 p-4 bg-white/60 rounded-xl border border-white/80 group shadow-lg transition-all duration-300"
      data-testid="product-row"
    >
      <LocalizedClientLink
        href={`/products/${item.product_handle}`}
        className={clx("relative overflow-hidden rounded-lg flex-shrink-0 bg-[#e3e3d8]", {
          "w-16 h-16": type === "preview",
          "w-20 h-20": type === "full",
        })}
      >
        <motion.div
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.2 }}
          className="relative w-full h-full overflow-hidden rounded-lg"
        >
          {(item.thumbnail || item.variant?.product?.images?.[0]?.url) ? (
            <img
              src={item.thumbnail || item.variant?.product?.images?.[0]?.url}
              alt={item.product_title || "Product"}
              className="w-full h-full object-contain object-center"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <span className="text-gray-400 text-xs">No image</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none" />
        </motion.div>
      </LocalizedClientLink>

      <div className="flex-1 min-w-0">
        <ProductTitleTooltip title={item.product_title || ""}>
          <span className="font-din-arabic-bold block" data-testid="product-title">
            {item.product_title}
          </span>
        </ProductTitleTooltip>

        {type === "preview" ? (
          <>
            <span className="font-din-arabic text-sm text-black/60 mt-1">
              <LineItemUnitPrice item={item} style="tight" currencyCode={currencyCode} />
            </span>
            <div className="flex items-center gap-3 space-between mt-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => changeQuantity(item.quantity - 1)}
                disabled={updating || item.quantity <= 1}
                className="w-7 h-7 rounded-lg bg-black/10 hover:bg-black/20 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="product-decrease-button"
              >
                <span className="font-din-arabic text-sm">-</span>
              </motion.button>

              {updating ? (
                <Spinner className="w-4 h-4" />
              ) : (
                <span className="font-din-arabic text-sm w-8 text-center">{item.quantity}</span>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => changeQuantity(item.quantity + 1)}
                disabled={updating || !canIncrease}
                className="w-7 h-7 rounded-lg bg-black/10 hover:bg-black/20 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="product-increase-button"
              >
                <span className="font-din-arabic text-sm">+</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDelete}
                disabled={isDeleting}
                className="ml-auto text-black/40 hover:text-red-500 transition-colors disabled:opacity-50"
                data-testid="product-delete-button"
              >
                {isDeleting ? <Spinner className="w-4 h-4" /> : <X className="w-4 h-4" />}
              </motion.button>
            </div>

            {/* Gift Toggle - Show for gift-eligible items */}
            {canBeGifted && !isGift && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleToggleGift}
                disabled={giftUpdating}
                className="mt-3 w-full flex items-center justify-center space-x-2 px-3 py-2 bg-black/5 hover:bg-black/10 rounded-lg transition-colors disabled:opacity-50"
              >
                <Gift className="w-4 h-4 text-black/70" />
                <span className="font-din-arabic text-xs text-black/70">
                  {giftUpdating ? "Marking..." : "Mark as Gift"}
                </span>
              </motion.button>
            )}

            {/* Gift Bifurcation UI - Show for items marked as gift */}
            {isGift && (
              <div className="mt-5 pt-3 border-t border-black/5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2 text-black/80">
                    <Gift className="w-3.5 h-3.5" />
                    <span className="font-din-arabic text-xs uppercase tracking-wider">Mark as Gift</span>
                  </div>
                  <span className="font-din-arabic text-xs text-black/60">
                    {giftQty} / {item.quantity}
                  </span>
                </div>

                <div className="relative h-6 flex items-center">
                  <input
                    type="range"
                    min="0"
                    max={item.quantity}
                    step="1"
                    value={giftQty}
                    onChange={handleGiftChange}
                    className="w-full h-1.5 bg-black/10 rounded-full appearance-none cursor-pointer accent-black focus:outline-none focus:ring-1 focus:ring-black/20"
                  />
                </div>

                <div className="flex justify-between items-center text-[10px] md:text-xs font-din-arabic mt-1">
                  <span className={giftQty < item.quantity ? "text-black" : "text-black/40"}>
                    For You: {item.quantity - giftQty}
                  </span>
                  <span className={giftQty > 0 ? "text-black" : "text-black/40"}>
                    Gift: {giftQty}
                  </span>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <span className="font-din-arabic text-sm text-black/60 mt-1">
              <LineItemUnitPrice item={item} style="tight" currencyCode={currencyCode} />
            </span>
            <div className="flex items-center gap-3 space-between mt-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => changeQuantity(item.quantity - 1)}
                disabled={updating || item.quantity <= 1}
                className="w-7 h-7 rounded-lg bg-black/10 hover:bg-black/20 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="product-decrease-button"
              >
                <span className="font-din-arabic text-sm">-</span>
              </motion.button>

              {updating ? (
                <Spinner className="w-4 h-4" />
              ) : (
                <span className="font-din-arabic text-sm w-10 text-center">{item.quantity}</span>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => changeQuantity(item.quantity + 1)}
                disabled={updating || !canIncrease}
                className="w-7 h-7 rounded-lg bg-black/10 hover:bg-black/20 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="product-increase-button"
              >
                <span className="font-din-arabic text-sm">+</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDelete}
                disabled={isDeleting}
                className="ml-auto text-black/40 hover:text-red-500 transition-colors disabled:opacity-50"
                data-testid="product-delete-button"
              >
                {isDeleting ? <Spinner className="w-4 h-4" /> : <X className="w-4 h-4" />}
              </motion.button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  )
}

export default Item
