export const META_CLICK_COOKIE = "jb_meta_fbc"

export function latestMetaClick(pixel: string | undefined, fallback: string | undefined) {
  const timestamp = (value?: string) => Number(value?.match(/^fb\.\d+\.(\d{13})\.[a-zA-Z0-9_.-]+$/)?.[1] || 0)
  if (timestamp(fallback) > timestamp(pixel)) return fallback
  return timestamp(pixel) ? pixel : undefined
}
