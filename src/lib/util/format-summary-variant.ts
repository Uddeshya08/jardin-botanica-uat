type SummaryItem = {
  product?: { categories?: { name?: string }[] | null } | null
  variant?: { title?: string | null; options?: { value?: string }[] | null } | null
}

export default function formatSummaryVariant(item: SummaryItem): string {
  const categoryName = item.product?.categories?.at(-1)?.name?.trim()
  const category = categoryName?.toLowerCase() === "candles"
    ? "Candle"
    : categoryName
      ? categoryName.charAt(0).toUpperCase() + categoryName.slice(1)
      : ""
  const size = [item.variant?.title, ...(item.variant?.options?.map((option) => option.value) || [])]
    .map((value) => value?.match(/\b(\d+(?:\.\d+)?)\s*(kg|ml|oz|g|l)\b/i))
    .find(Boolean)
  const details = [category, size ? `${size[1]}${size[2].toLowerCase()}` : ""].filter(Boolean).join(" ")

  return details || item.variant?.title || ""
}
