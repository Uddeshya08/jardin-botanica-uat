import type { HttpTypes } from "@medusajs/types"
import { Table, Text } from "@medusajs/ui"

import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import Thumbnail from "@modules/products/components/thumbnail"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem
  currencyCode: string
}

const Item = ({ item, currencyCode }: ItemProps) => {
  // Check if this is a bundle item using metadata
  const metadata = item?.metadata as Record<string, unknown> | null
  const isBundle = !!metadata?.["_bundle_id"]

  // For bundle items, use bundle title and image from metadata
  const displayName =
    isBundle && metadata?.["_bundle_title"]
      ? (metadata["_bundle_title"] as string)
      : item.product_title

  const displayThumbnail =
    isBundle && metadata?.["_bundle_image"] ? (metadata["_bundle_image"] as string) : item.thumbnail

  return (
    <Table.Row className="w-full !bg-[#e3e3d8]" data-testid="product-row">
      <Table.Cell className="!pl-0 p-4 w-24 !bg-[#e3e3d8]">
        <div className="flex w-16">
          <Thumbnail thumbnail={displayThumbnail} size="square" />
        </div>
      </Table.Cell>

      <Table.Cell className="text-left !bg-[#e3e3d8]">
        <Text
          className="txt-medium-plus font-din-arabic text-sm text-black/70 tracking-wide"
          data-testid="product-name"
        >
          {displayName}
        </Text>
        <LineItemOptions variant={item.variant} data-testid="product-variant" />
      </Table.Cell>

      <Table.Cell className="!pr-0 !bg-[#e3e3d8]">
        <span className="!pr-0 flex flex-col items-end h-full justify-center">
          <span className="flex gap-x-1 ">
            <Text className="text-ui-fg-muted">
              <span data-testid="product-quantity">{item.quantity}</span>x{" "}
            </Text>
            <LineItemUnitPrice item={item} style="tight" currencyCode={currencyCode} />
          </span>

          <LineItemPrice item={item} style="tight" currencyCode={currencyCode} />
        </span>
      </Table.Cell>
    </Table.Row>
  )
}

export default Item
