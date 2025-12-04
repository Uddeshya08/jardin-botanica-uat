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

  return (
    <button
      className={className}
      type="submit"
      disabled={pending || externalDisabled}
      data-testid={dataTestId}
    >
      {children}
    </button>
  )
}
