"use client"

import repeat from "@lib/util/repeat"
import type { HttpTypes } from "@medusajs/types"
import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"
import { Quote } from "lucide-react"

type ItemsTemplateProps = {
  cart: HttpTypes.StoreCart
}

export const QuoteStart = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 5H5L3 11v8h8V11H7l2-6zm12 0h-4l-2 6v8h8V11h-4l2-6z" />
  </svg>
)

const ItemsPreviewTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart.items

  if (items?.length == 0) {
    return (
      <div className="flex items-start space-x-4 p-4 bg-white/60 rounded-xl border border-white/80 group shadow-lg transition-all duration-300">
        <blockquote>
          <p className="font-din-arabic text-sm text-black/60">
            <QuoteStart className="w-4 h-4 text-black/60 inline-block mr-2" />
            No items here at the moment. Head back to the garden to discover more.
          </p>
        </blockquote>
      </div>
    )
  }

  return (
    <div className="space-y-4" data-testid="items-table">
      {items
        ? items
            .sort((a, b) => {
              return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
            })
            .map((item, index) => {
              return (
                <Item
                  key={item.id}
                  item={item}
                  type="preview"
                  currencyCode={cart.currency_code}
                  index={index}
                />
              )
            })
        : repeat(5).map((i) => {
            return <SkeletonLineItem key={i} />
          })}
    </div>
  )
}

export default ItemsPreviewTemplate
