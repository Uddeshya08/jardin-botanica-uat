"use client"

import type { HttpTypes } from "@medusajs/types"
import type React from "react"
import { createContext, useContext, useMemo } from "react"

interface AuthContextValue {
  customer: HttpTypes.StoreCustomer | null
  isLoggedIn: boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({
  customer,
  children,
}: {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
}) {
  const value = useMemo(
    () => ({
      customer,
      isLoggedIn: !!customer,
    }),
    [customer]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    // Return default values if context is not available (for pages outside provider)
    return { customer: null, isLoggedIn: false }
  }
  return context
}
