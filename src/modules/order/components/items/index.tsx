import repeat from "@lib/util/repeat"
import type { HttpTypes } from "@medusajs/types"
import { Table } from "@medusajs/ui"

import Divider from "@modules/common/components/divider"
import Item from "@modules/order/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type ItemsProps = {
  order: HttpTypes.StoreOrder
}

const Items = ({ order }: ItemsProps) => {
  const items = order.items

  return (
    <div className="flex flex-col bg-[#e3e3d8]">
      <Divider className="!mb-0" />
      <div className="px-4 py-2 border text-black font-din-arabic tracking-wide hover:text-white transition-all duration-300 shadow-sm hover:shadow-md rounded-xl overflow-hidden">
        <Table className="!bg-[#e3e3d8] w-full">
          <Table.Body className="!bg-[#e3e3d8]" data-testid="products-table">
            {items?.length
              ? items
                  .sort((a, b) => {
                    return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
                  })
                  .map((item) => {
                    return <Item key={item.id} item={item} currencyCode={order.currency_code} />
                  })
              : repeat(5).map((i) => {
                  return <SkeletonLineItem key={i} />
                })}
          </Table.Body>
        </Table>
      </div>
    </div>
  )
}

export default Items
