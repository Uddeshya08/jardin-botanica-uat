export interface BundleItem {
  id: string
  bundle_id: string
  medusa_variant_id: string
  quantity: number
  sort_order: number
}

export interface ChoiceOption {
  id: string
  choice_slot_id: string
  medusa_variant_id: string
  quantity: number
  sort_order: number
}

export interface ChoiceSlot {
  id: string
  bundle_id: string
  slot_name: string
  slot_description: string | null
  required: boolean
  min_selections: number
  max_selections: number
  sort_order: number
  options?: ChoiceOption[]
}

export interface Bundle {
  id: string
  title: string
  description: string | null
  medusa_product_id: string | null
  medusa_variant_id: string | null
  bundle_price: number
  bundle_image: string | null
  is_active: boolean
  is_featured: boolean
  metadata: Record<string, unknown> | null
  items?: BundleItem[]
  choice_slots?: ChoiceSlot[]
}

export interface BundleWithDetails extends Bundle {
  items: BundleItem[]
  choice_slots: ChoiceSlot[]
}

export interface AddBundleToCartPayload {
  cart_id: string
  quantity?: number
  selections?: Record<string, string[]>
  metadata?: Record<string, unknown>
}

export interface AddBundleToCartResponse {
  line_item: unknown
  message: string
}
