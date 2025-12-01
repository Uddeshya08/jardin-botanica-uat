"use client"

import React from "react"
import { useFormStatus } from "react-dom"
import { Button } from "../../../../app/components/ui/button"

export function SubmitButton({
  children,
  variant = "primary",
  className,
  "data-testid": dataTestId,
  disabled,
}: {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "transparent" | "danger" | null
  className?: string
  "data-testid"?: string
  disabled?: boolean
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
    <Button
      size="md"
      className={className}
      type="submit"
      disabled={pending || disabled}
      variant={themeVariant}
      data-testid={dataTestId}
    >
      {children}
    </Button>
  )
}
