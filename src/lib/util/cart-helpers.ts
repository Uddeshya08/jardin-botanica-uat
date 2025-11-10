export interface BasicCartItem {
  id: string
  quantity: number
  [key: string]: any
}

export function upsertCartItems<T extends BasicCartItem>(prev: T[], item: T): T[] {
  if (!item) {
    return prev
  }

  if (item.quantity <= 0) {
    return prev.filter((existing) => existing.id !== item.id)
  }

  const index = prev.findIndex((existing) => existing.id === item.id)
  if (index >= 0) {
    const updated = [...prev]
    updated[index] = { ...updated[index], ...item }
    return updated
  }

  return [...prev, { ...item }]
}


