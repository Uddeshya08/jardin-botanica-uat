export function normalizeCheckoutPhone(value: string): string {
  const input = value.trim()
  if (!/^\+?[\d\s()-]+$/.test(input)) {
    throw new Error("Please enter a valid phone number")
  }

  let digits = input.replace(/\D/g, "")
  if (!input.startsWith("+") && digits.startsWith("00")) digits = digits.slice(2)
  if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1)
  if (digits.length === 10) {
    if (!/^[6-9]\d{9}$/.test(digits)) {
      throw new Error("Please enter a valid 10-digit mobile number")
    }
    digits = `91${digits}`
  }

  if (digits.startsWith("91") && !/^91[6-9]\d{9}$/.test(digits)) {
    throw new Error("Please enter a valid Indian mobile number")
  }

  if (!/^[1-9]\d{9,14}$/.test(digits)) {
    throw new Error("Please enter a valid phone number with country code")
  }

  return `+${digits}`
}
