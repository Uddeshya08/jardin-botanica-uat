import { HttpTypes } from "@medusajs/types"
import Input from "@modules/common/components/input"
import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Label } from "../../../../app/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../app/components/ui/select"

// Indian States
const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
]

// Major Indian Cities
const indianCities = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Surat",
  "Lucknow",
  "Kanpur",
  "Nagpur",
  "Indore",
  "Thane",
  "Bhopal",
  "Visakhapatnam",
  "Patna",
  "Vadodara",
  "Ghaziabad",
  "Ludhiana",
  "Agra",
  "Nashik",
  "Faridabad",
  "Meerut",
  "Rajkot",
  "Varanasi",
  "Srinagar",
  "Amritsar",
  "Chandigarh",
]

const BillingAddress = ({ cart }: { cart: HttpTypes.StoreCart | null }) => {
  const getFullName = () => {
    const firstName = cart?.billing_address?.first_name || ""
    const lastName = cart?.billing_address?.last_name || ""
    return `${firstName} ${lastName}`.trim()
  }

  const [formData, setFormData] = useState<any>({
    "billing_address.first_name": cart?.billing_address?.first_name || "",
    "billing_address.last_name": cart?.billing_address?.last_name || "",
    "billing_address.address_1": cart?.billing_address?.address_1 || "",
    "billing_address.company": cart?.billing_address?.company || "",
    "billing_address.postal_code": cart?.billing_address?.postal_code || "",
    "billing_address.city": cart?.billing_address?.city || "",
    "billing_address.country_code": cart?.billing_address?.country_code || "in",
    "billing_address.province": cart?.billing_address?.province || "",
    "billing_address.phone": cart?.billing_address?.phone || "",
    fullName: getFullName(),
  })

  useEffect(() => {
    if (cart?.billing_address) {
      const firstName = cart.billing_address.first_name || ""
      const lastName = cart.billing_address.last_name || ""
      setFormData({
        "billing_address.first_name": firstName,
        "billing_address.last_name": lastName,
        "billing_address.address_1": cart.billing_address.address_1 || "",
        "billing_address.company": cart.billing_address.company || "",
        "billing_address.postal_code": cart.billing_address.postal_code || "",
        "billing_address.city": cart.billing_address.city || "",
        "billing_address.country_code": cart.billing_address.country_code || "in",
        "billing_address.province": cart.billing_address.province || "",
        "billing_address.phone": cart.billing_address.phone || "",
        fullName: `${firstName} ${lastName}`.trim(),
      })
    }
  }, [cart?.billing_address])

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLInputElement | HTMLSelectElement
    >
  ) => {
    if (e.target.name === "fullName") {
      const fullName = e.target.value
      const parts = fullName.trim().split(" ")
      const firstName = parts[0] || ""
      const lastName = parts.slice(1).join(" ") || ""
      setFormData({
        ...formData,
        fullName: fullName,
        "billing_address.first_name": firstName,
        "billing_address.last_name": lastName,
      })
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      })
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="space-y-6 overflow-hidden pt-6 border-t border-black/10"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="billing_full_name" className="font-din-arabic mb-2 block">
              Full Name
            </Label>
            <Input
              id="billing_full_name"
              label=""
              name="fullName"
              placeholder="Enter full name"
              autoComplete="name"
              value={formData.fullName}
              onChange={handleChange}
              className="file:text-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex-1 bg-white/60 border-black/20 font-din-arabic focus:border-black transition-all placeholder:text-black/30"
              data-testid="billing-full-name-input"
            />
          </div>
          <div>
            <Label htmlFor="billing_phone" className="font-din-arabic mb-2 block">
              Phone Number
            </Label>
            <div className="flex space-x-2">
              <div className="w-16 bg-white/80 border border-black/10 rounded-md flex items-center justify-center text-xs font-din-arabic text-black/60">
                +91
              </div>
              <Input
                id="billing_phone"
                label=""
                name="billing_address.phone"
                placeholder="XXXXX XXXXX"
                type="tel"
                autoComplete="tel"
                value={formData["billing_address.phone"]}
                onChange={handleChange}
                maxLength={10}
                className="file:text-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex-1 bg-white/60 border-black/20 font-din-arabic focus:border-black transition-all placeholder:text-black/30"
                data-testid="billing-phone-input"
              />
            </div>
          </div>
        </div>
        <div>
          <Label htmlFor="billing_address_1" className="font-din-arabic mb-2 block">
            Address Line 1
          </Label>
          <Input
            id="billing_address_1"
            label=""
            name="billing_address.address_1"
            placeholder="House no., Street Locality"
            autoComplete="address-line1"
            value={formData["billing_address.address_1"]}
            onChange={handleChange}
            className="file:text-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex-1 bg-white/60 border-black/20 font-din-arabic focus:border-black transition-all placeholder:text-black/30"
            data-testid="billing-address-input"
          />
        </div>
        <div>
          <Label htmlFor="billing_company" className="font-din-arabic mb-2 block">
            Address Line 2 (Optional)
          </Label>
          <Input
            id="billing_company"
            label=""
            name="billing_address.company"
            placeholder="Apartment, suite, etc."
            value={formData["billing_address.company"]}
            onChange={handleChange}
            autoComplete="organization"
            className="file:text-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex-1 bg-white/60 border-black/20 font-din-arabic focus:border-black transition-all placeholder:text-black/30"
            data-testid="billing-company-input"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="billing_city" className="font-din-arabic mb-2 block">
              City
            </Label>
            <Select
              value={formData["billing_address.city"]}
              onValueChange={(value: string) =>
                setFormData({
                  ...formData,
                  "billing_address.city": value,
                })
              }
            >
              <SelectTrigger className="bg-white/80 border-black/10 focus:border-black/30 font-din-arabic h-11">
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {indianCities.map((city) => (
                  <SelectItem key={city} value={city} className="font-din-arabic">
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="billing_province" className="font-din-arabic mb-2 block">
              State
            </Label>
            <Select
              value={formData["billing_address.province"]}
              onValueChange={(value: string) =>
                setFormData({
                  ...formData,
                  "billing_address.province": value,
                })
              }
            >
              <SelectTrigger className="bg-white/80 border-black/10 focus:border-black/30 font-din-arabic h-11">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {indianStates.map((state) => (
                  <SelectItem key={state} value={state} className="font-din-arabic">
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="billing_postal_code" className="font-din-arabic mb-2 block">
            PIN Code
          </Label>
          <Input
            id="billing_postal_code"
            label=""
            name="billing_address.postal_code"
            placeholder="Enter 6-digit PIN"
            autoComplete="postal-code"
            value={formData["billing_address.postal_code"]}
            onChange={handleChange}
            maxLength={6}
            className="file:text-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex-1 bg-white/60 border-black/20 font-din-arabic focus:border-black transition-all placeholder:text-black/30"
            data-testid="billing-postal-input"
          />
        </div>
        {/* Hidden field for country_code */}
        <input
          type="hidden"
          name="billing_address.country_code"
          value={formData["billing_address.country_code"] || "in"}
        />
      </motion.div>
    </AnimatePresence>
  )
}

export default BillingAddress
