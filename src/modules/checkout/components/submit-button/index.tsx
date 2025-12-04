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
      className={'ml-auto px-8 py-2 bg-black text-white rounded-lg font-din-arabic transition-all shadow-lg hover:shadow-xl flex items-center space-x-2'}
      type="submit"
      disabled={pending || externalDisabled}
      data-testid={dataTestId}
    >
      {children}
    </button>
  )
}
