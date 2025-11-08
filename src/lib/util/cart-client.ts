"use client"

export function emitCartUpdated(payload?: { quantityDelta?: number }) {
  window.dispatchEvent(new CustomEvent("cart:updated", { detail: payload || {} }))
}

export function emitCartOpen() {
  window.dispatchEvent(new Event("cart:open"))
}
