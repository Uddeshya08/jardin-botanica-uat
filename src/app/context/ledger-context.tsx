"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"

export interface LedgerItem {
  id: string
  name: string
  price: number
  image: string
  description?: string
  category?: string
  [key: string]: any
}

interface LedgerContextValue {
  ledger: LedgerItem[]
  addToLedger: (item: LedgerItem) => void
  removeFromLedger: (id: string) => void
  toggleLedgerItem: (item: LedgerItem) => void
  isInLedger: (id: string) => boolean
  clearLedger: () => void
}

const LedgerContext = createContext<LedgerContextValue | undefined>(undefined)

const LEDGER_STORAGE_KEY = "jardin-ledger"

export function LedgerProvider({ children }: { children: React.ReactNode }) {
  const [ledger, setLedger] = useState<LedgerItem[]>([])

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    try {
      const stored = window.localStorage.getItem(LEDGER_STORAGE_KEY)
      if (stored) {
        const parsed: LedgerItem[] = JSON.parse(stored)
        setLedger(parsed)
      }
    } catch (error) {
      console.error("Failed to load ledger from storage", error)
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    try {
      window.localStorage.setItem(LEDGER_STORAGE_KEY, JSON.stringify(ledger))
    } catch (error) {
      console.error("Failed to persist ledger", error)
    }
  }, [ledger])

  const addToLedger = (item: LedgerItem) => {
    setLedger((prev) => {
      if (prev.some((existing) => existing.id === item.id)) {
        return prev
      }
      return [...prev, item]
    })
  }

  const removeFromLedger = (id: string) => {
    setLedger((prev) => prev.filter((item) => item.id !== id))
  }

  const isInLedger = (id: string) => {
    return ledger.some((item) => item.id === id)
  }

  const toggleLedgerItem = (item: LedgerItem) => {
    setLedger((prev) => {
      const exists = prev.some((existing) => existing.id === item.id)
      if (exists) {
        return prev.filter((existing) => existing.id !== item.id)
      }
      return [...prev, item]
    })
  }

  const clearLedger = () => setLedger([])

  const value = useMemo(
    () => ({
      ledger,
      addToLedger,
      removeFromLedger,
      toggleLedgerItem,
      isInLedger,
      clearLedger,
    }),
    [ledger]
  )

  return <LedgerContext.Provider value={value}>{children}</LedgerContext.Provider>
}

export function useLedger() {
  const context = useContext(LedgerContext)
  if (!context) {
    throw new Error("useLedger must be used within a LedgerProvider")
  }
  return context
}