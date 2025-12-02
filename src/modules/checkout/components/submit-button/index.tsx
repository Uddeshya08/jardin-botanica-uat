"use client"

import React from "react"
import { useFormStatus } from "react-dom"
import { Button } from "../../../../app/components/ui/button"

export function SubmitButton({
  children,
  variant = "primary",
  className,
  disabled: externalDisabled,
  "data-testid": dataTestId,
}: {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "transparent" | "danger" | null
  className?: string
  disabled?: boolean
  "data-testid"?: string
}) {
  const { pending } = useFormStatus()

  // Map Medusa variants to theme variants
  const themeVariant = 
    variant === "primary" ? "default" :
    variant === "secondary" ? "secondary" :
    variant === "danger" ? "destructive" :
    variant === "transparent" ? "ghost" :
    "default"

  return (
    <button
      size="lg"
      className={'ml-auto px-8 py-3 bg-black text-white rounded-xl font-din-arabic transition-all shadow-lg hover:shadow-xl flex items-center space-x-2'}
      type="submit"
      disabled={pending || externalDisabled}
      variant={themeVariant}
      data-testid={dataTestId}
    >
      {children}
    </button>
  )
}
