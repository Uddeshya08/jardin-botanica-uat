"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { toast } from "sonner"

interface GiftQuantityState {
    [lineItemId: string]: number // gift quantity for each item
}

interface GiftContextType {
    giftQuantities: GiftQuantityState
    setGiftQuantity: (lineItemId: string, quantity: number) => void
    getGiftQuantity: (lineItemId: string) => number
}

const GiftContext = createContext<GiftContextType | null>(null)

export const GiftProvider = ({ children }: { children: React.ReactNode }) => {
    const [giftQuantities, setGiftQuantities] = useState<GiftQuantityState>({})

    // Initialize from local storage if needed in future
    useEffect(() => {
        // Optional: Load from local storage
        const saved = localStorage.getItem("jardin_gift_quantities")
        if (saved) {
            try {
                setGiftQuantities(JSON.parse(saved))
            } catch (e) {
                console.error("Failed to parse saved gift quantities", e)
            }
        }
    }, [])

    // Persist to local storage
    useEffect(() => {
        localStorage.setItem("jardin_gift_quantities", JSON.stringify(giftQuantities))
    }, [giftQuantities])

    const setGiftQuantity = (lineItemId: string, quantity: number) => {
        setGiftQuantities((prev) => ({
            ...prev,
            [lineItemId]: quantity,
        }))
    }

    const getGiftQuantity = (lineItemId: string) => {
        return giftQuantities[lineItemId] || 0
    }

    return (
        <GiftContext.Provider value={{ giftQuantities, setGiftQuantity, getGiftQuantity }}>
            {children}
        </GiftContext.Provider>
    )
}

export const useGiftContext = () => {
    const context = useContext(GiftContext)
    if (!context) {
        throw new Error("useGiftContext must be used within a GiftProvider")
    }
    return context
}

export const useGiftContextSafe = () => {
    return useContext(GiftContext)
}
