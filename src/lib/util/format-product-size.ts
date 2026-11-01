/** Normalize candle variants embedded in cart titles and other display labels. */
export function formatProductLabel(raw: string): string {
  return raw.replace(/\bcandles?\s*(?:[·•]\s*)?(\d+(?:\.\d+)?)\s*(kg|ml|oz|g|l)\b/gi,
    (_, quantity, unit) => `candle · ${quantity} ${unit.toLowerCase()}`)
}

/** Consistent category / quantity separator, including legacy "candle 200 g" values. */
export function formatProductSize(raw: string, category?: string): string {
  const match = raw.match(/^(.*?)\s*(\d+(?:\.\d+)?)\s*(kg|ml|oz|g|l)\s*$/i)
  if (!match) return formatProductLabel(raw)
  let label = (category || match[1]).replace(/[·•]\s*$/, "").trim()
  if (/^candles?$/i.test(label)) label = "candle"
  const quantity = `${match[2]} ${match[3].toLowerCase()}`
  return label ? `${label} · ${quantity}` : quantity
}
