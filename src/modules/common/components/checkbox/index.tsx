import { Checkbox } from "@medusajs/ui"
import type React from "react"

type CheckboxProps = {
  checked?: boolean
  onChange?: () => void
  label: string
  name?: string
  "data-testid"?: string
  className?: string
  labelClassName?: string
}

const CheckboxWithLabel: React.FC<CheckboxProps> = ({
  checked = true,
  onChange,
  label,
  name,
  "data-testid": dataTestId,
  className,
  labelClassName,
}) => {
  return (
    <label className="flex items-center space-x-3 cursor-pointer group">
      <Checkbox
        className={className || "text-base-regular flex items-center gap-x-2"}
        id="checkbox"
        role="checkbox"
        type="button"
        checked={checked}
        aria-checked={checked}
        onClick={onChange}
        name={name}
        data-testid={dataTestId}
      />
      <span className={labelClassName || "!transform-none !txt-medium"}>{label}</span>
    </label>
  )
}

export default CheckboxWithLabel
