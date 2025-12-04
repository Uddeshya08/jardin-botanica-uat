"use client"

import { clx } from "@medusajs/ui"
import { updateLineItem } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { deleteLineItem } from "@lib/data/cart"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Spinner from "@modules/common/icons/spinner"
import Thumbnail from "@modules/products/components/thumbnail"
import { useState } from "react"
import { motion } from "framer-motion"
import { X } from "lucide-react"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem
  type?: "full" | "preview"
  currencyCode: string
  index?: number
}

const Item = ({ item, type = "full", currencyCode, index = 0 }: ItemProps) => {
  const [updating, setUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const changeQuantity = async (quantity: number) => {
    if (quantity < 1) return
    
    setUpdating(true)

    await updateLineItem({
      lineId: item.id,
      quantity,
    })
      .finally(() => {
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
      className="flex items-start space-x-4 p-4 bg-white/60 rounded-xl border border-white/80 group hover:shadow-lg transition-all duration-300"
      data-testid="product-row"
    >
      <LocalizedClientLink
        href={`/products/${item.product_handle}`}
        className={clx("relative overflow-hidden rounded-lg flex-shrink-0", {
          "w-16 h-16": type === "preview",
          "w-20 h-20": type === "full",
        })}
      >
        <motion.div
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.2 }}
          className="relative w-full h-full"
        >
          <Thumbnail
            thumbnail={item.thumbnail}
            images={item.variant?.product?.images}
            size="square"
            className="!p-0 w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none" />
        </motion.div>
      </LocalizedClientLink>

      <div className="flex-1 min-w-0">
        <span
          className="font-din-arabic-bold truncate"
          data-testid="product-title"
        >
          {item.product_title}
        </span>
        
        {type === "preview" ? (
          <>
            <span className="font-din-arabic text-sm text-black/60 mt-1">
              <LineItemUnitPrice
                item={item}
                style="tight"
                currencyCode={currencyCode}
              />
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
                <span className="font-din-arabic text-sm w-8 text-center">
                  {item.quantity}
                </span>
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
                {isDeleting ? (
                  <Spinner className="w-4 h-4" />
                ) : (
                  <X className="w-4 h-4" />
                )}
              </motion.button>
            </div>
          </>
        ) : (
          <>
            <span className="font-din-arabic text-sm text-black/60 mt-1">
              <LineItemUnitPrice
                item={item}
                style="tight"
                currencyCode={currencyCode}
              />
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
                <span className="font-din-arabic text-sm w-10 text-center">
                  {item.quantity}
                </span>
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
                {isDeleting ? (
                  <Spinner className="w-4 h-4" />
                ) : (
                  <X className="w-4 h-4" />
                )}
              </motion.button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  )
}

export default Item
