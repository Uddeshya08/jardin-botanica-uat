import type { HttpTypes } from "@medusajs/types"
import { Container } from "@medusajs/ui"
import Checkbox from "@modules/common/components/checkbox"
import Input from "@modules/common/components/input"
import { mapKeys } from "lodash"
import { Edit, Plus } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import type React from "react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { Checkbox as ShadcnCheckbox } from "../../../../app/components/ui/checkbox"
import { Label } from "../../../../app/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../app/components/ui/select"
import AddressSelect from "../address-select"
import CountrySelect from "../country-select"

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

// Valid email providers - only well-known legitimate email providers
const validEmailProviders = [
  "gmail.com",
  "yahoo.com",
  "yahoo.co.in",
  "yahoo.in",
  "outlook.com",
  "hotmail.com",
  "hotmail.co.in",
  "msn.com",
  "live.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "protonmail.com",
  "proton.me",
  "rediffmail.com",
  "rediff.com",
  "zoho.com",
  "zoho.in",
  "aol.com",
  "mail.com",
  "gmx.com",
  "yandex.com",
  "inbox.com",
  "fastmail.com",
  "tutanota.com",
]

interface SavedAddress {
  id: string
  name: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  pincode: string
  phone: string
  label: "Home" | "Work" | "Other"
  isDefault: boolean
}

const ShippingAddress = ({
  customer,
  cart,
  checked,
  onChange,
  onEmailValidationChange,
}: {
  customer: HttpTypes.StoreCustomer | null
  cart: HttpTypes.StoreCart | null
  checked: boolean
  onChange: () => void
  onEmailValidationChange?: (isValid: boolean) => void
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({
    "shipping_address.first_name": cart?.shipping_address?.first_name || "",
    "shipping_address.last_name": cart?.shipping_address?.last_name || "",
    "shipping_address.address_1": cart?.shipping_address?.address_1 || "",
    "shipping_address.company": cart?.shipping_address?.company || "",
    "shipping_address.postal_code": cart?.shipping_address?.postal_code || "",
    "shipping_address.city": cart?.shipping_address?.city || "",
    "shipping_address.country_code": cart?.shipping_address?.country_code || "",
    "shipping_address.province": cart?.shipping_address?.province || "",
    "shipping_address.phone": cart?.shipping_address?.phone || "",
    email: cart?.email || "",
  })

  // Local state for saved addresses
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([])
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [selectedAddressId, setSelectedAddressId] = useState<string>("")
  const [isEditingAddress, setIsEditingAddress] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState<string>("")
  const [newAddressData, setNewAddressData] = useState<Omit<SavedAddress, "id">>({
    name: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    label: "Home",
    isDefault: false,
  })
  const [emailError, setEmailError] = useState<string>("")
  const [emailTouched, setEmailTouched] = useState<boolean>(false)
  const [isLoadingPostalData, setIsLoadingPostalData] = useState(false)

  const countriesInRegion = useMemo(
    () => cart?.region?.countries?.map((c) => c.iso_2),
    [cart?.region]
  )

  // check if customer has saved addresses that are in the current region
  const addressesInRegion = useMemo(
    () =>
      customer?.addresses.filter(
        (a) => a.country_code && countriesInRegion?.includes(a.country_code)
      ),
    [customer?.addresses, countriesInRegion]
  )

  const setFormAddress = (address?: HttpTypes.StoreCartAddress, email?: string) => {
    address &&
      setFormData((prevState: Record<string, any>) => ({
        ...prevState,
        "shipping_address.first_name": address?.first_name || "",
        "shipping_address.last_name": address?.last_name || "",
        "shipping_address.address_1": address?.address_1 || "",
        "shipping_address.company": address?.company || "",
        "shipping_address.postal_code": address?.postal_code || "",
        "shipping_address.city": address?.city || "",
        "shipping_address.country_code": address?.country_code || "",
        "shipping_address.province": address?.province || "",
        "shipping_address.phone": address?.phone || "",
      }))

    email &&
      setFormData((prevState: Record<string, any>) => ({
        ...prevState,
        email: email,
      }))
  }

  // Load saved addresses from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("jardinBotanica_savedAddresses")
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          setSavedAddresses(parsed)
          // Auto-select default address if available
          const defaultAddr = parsed.find((addr: SavedAddress) => addr.isDefault)
          if (defaultAddr && !cart?.shipping_address) {
            populateAddressFields(defaultAddr)
            setSelectedAddressId(defaultAddr.id)
          }
        } catch (e) {
          console.error("Error loading saved addresses:", e)
        }
      }
    }
  }, [])

  useEffect(() => {
    // Ensure cart is not null and has a shipping_address before setting form data
    if (cart && cart.shipping_address) {
      setFormAddress(cart?.shipping_address, cart?.email)
    }

    if (cart && !cart.email && customer?.email) {
      setFormAddress(undefined, customer.email)
    }
  }, [cart]) // Add cart as a dependency

  // Validate email when formData.email changes (but not on every render)
  // This handles initial load and programmatic changes
  useEffect(() => {
    if (formData.email && formData.email.trim() !== "") {
      // Defer validation to next tick to ensure validateEmail is available
      const timer = setTimeout(() => {
        // Re-use the validation logic by triggering a synthetic validation
        // We'll validate directly here to avoid dependency issues
        const email = formData.email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
          setEmailError("Please use a valid email address")
          return
        }

        const domain = email.split("@")[1]?.toLowerCase()
        if (!domain) {
          setEmailError("Please use a valid email address")
          return
        }

        const exactMatch = validEmailProviders.some((provider) => domain === provider)
        if (exactMatch) {
          setEmailError("")
          return
        }

        const subdomainMatch = validEmailProviders.some((provider) =>
          domain.endsWith(`.${provider}`)
        )
        if (subdomainMatch) {
          setEmailError("")
          return
        }

        const corporateTlds = ["com", "co", "org", "edu", "gov", "net", "in"]
        const domainParts = domain.split(".")
        if (domainParts.length >= 2) {
          const tld = domainParts[domainParts.length - 1]
          if (corporateTlds.includes(tld)) {
            const secondLevelDomain = domainParts[domainParts.length - 2]
            if (
              secondLevelDomain &&
              secondLevelDomain.length >= 2 &&
              /^[a-z0-9-]+$/.test(secondLevelDomain) &&
              /[a-z]/.test(secondLevelDomain)
            ) {
              setEmailError("")
              return
            }
          }
        }

        setEmailError("Please use a valid email address")
      }, 100)

      return () => clearTimeout(timer)
    } else if (!formData.email || formData.email.trim() === "") {
      // Email is required, but only show error if field has been touched
      if (emailTouched) {
        setEmailError("Email address is required")
      } else {
        // Don't show error visually, but validation will still fail (button disabled)
        setEmailError("")
      }
    }
  }, [formData.email, emailTouched]) // Validate when email changes

  // Notify parent component about email validation status
  useEffect(() => {
    if (onEmailValidationChange) {
      // Email is invalid if there's an error OR if email is empty (required field)
      // emailError is a string, so check if it's truthy (non-empty)
      const hasError = emailError && emailError.trim() !== ""
      const hasEmail = formData.email && formData.email.trim() !== ""
      const isValid = !hasError && hasEmail
      onEmailValidationChange(isValid)
    }
  }, [emailError, formData.email, onEmailValidationChange])

  const populateAddressFields = (address: SavedAddress) => {
    const [firstName, ...lastNameParts] = address.name.split(" ")
    const lastName = lastNameParts.join(" ") || ""
    setFormData((prev) => ({
      ...prev,
      "shipping_address.first_name": firstName,
      "shipping_address.last_name": lastName,
      "shipping_address.address_1": address.addressLine1,
      "shipping_address.company": address.addressLine2 || "",
      "shipping_address.city": address.city,
      "shipping_address.province": address.state,
      "shipping_address.postal_code": address.pincode,
      "shipping_address.phone": address.phone,
      "shipping_address.country_code": "in",
    }))
  }

  const handleEditAddress = (address: SavedAddress) => {
    setNewAddressData({
      name: address.name,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || "",
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      phone: address.phone,
      label: address.label,
      isDefault: address.isDefault,
    })
    setIsEditingAddress(true)
    setEditingAddressId(address.id)
    setShowAddressForm(true)
  }

  // Function to fetch city and state from postal code
  const fetchPostalData = async (pincode: string) => {
    if (pincode.length === 6) {
      setIsLoadingPostalData(true)
      try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`)
        const data = await response.json()

        if (data && data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
          const postOffice = data[0].PostOffice[0]
          setNewAddressData((prev) => ({
            ...prev,
            city: postOffice.District || postOffice.Name || prev.city,
            state: postOffice.State || prev.state,
          }))
        }
      } catch (error) {
        console.error("Error fetching postal code data:", error)
      } finally {
        setIsLoadingPostalData(false)
      }
    }
  }

  // Auto-fill city and state when pincode changes
  useEffect(() => {
    if (newAddressData.pincode.length === 6) {
      fetchPostalData(newAddressData.pincode)
    }
  }, [newAddressData.pincode])

  const validateEmail = (email: string, showRequiredError: boolean = true): boolean => {
    // Check if email is required and empty
    if (!email || email.trim() === "") {
      // Show required error only if field has been touched (user interacted with it)
      if (emailTouched && showRequiredError) {
        setEmailError("Email address is required")
      } else {
        // Don't show error visually, but still return false to disable button
        setEmailError("")
      }
      return false
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setEmailError("Please use a valid email address")
      return false
    }

    // Extract domain from email
    const domain = email.split("@")[1]?.toLowerCase()
    if (!domain) {
      setEmailError("Please use a valid email address")
      return false
    }

    // Check if domain matches any valid provider exactly
    const exactMatch = validEmailProviders.some((provider) => domain === provider)
    if (exactMatch) {
      setEmailError("")
      return true
    }

    // Check if domain ends with a valid provider (e.g., "mail.gmail.com")
    const subdomainMatch = validEmailProviders.some((provider) => {
      return domain.endsWith(`.${provider}`)
    })
    if (subdomainMatch) {
      setEmailError("")
      return true
    }

    // Allow corporate/educational domains with common TLDs (.com, .co, .org, .edu, .gov, .net, .in)
    // but only if the domain looks legitimate (not random strings)
    const corporateTlds = ["com", "co", "org", "edu", "gov", "net", "in"]
    const domainParts = domain.split(".")
    if (domainParts.length >= 2) {
      const tld = domainParts[domainParts.length - 1]
      if (corporateTlds.includes(tld)) {
        const secondLevelDomain = domainParts[domainParts.length - 2]
        // Allow if second level domain looks legitimate (at least 2 characters, contains letters)
        if (
          secondLevelDomain &&
          secondLevelDomain.length >= 2 &&
          /^[a-z0-9-]+$/.test(secondLevelDomain) &&
          /[a-z]/.test(secondLevelDomain)
        ) {
          setEmailError("")
          return true
        }
      }
    }

    setEmailError("Please use a valid email address")
    return false
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLInputElement | HTMLSelectElement>
  ) => {
    const value = e.target.value
    setFormData({
      ...formData,
      [e.target.name]: value,
    })

    // Validate email in real-time
    if (e.target.name === "email") {
      // Mark field as touched when user starts typing
      if (!emailTouched) {
        setEmailTouched(true)
      }
      validateEmail(value)
    }
  }

  const handleEmailBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Mark field as touched when user leaves the field
    setEmailTouched(true)
    validateEmail(e.target.value, true)
  }

  return (
    <div className="space-y-6">
      {savedAddresses.length > 0 && !showAddressForm && (
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedAddresses.map((address) => (
              <motion.div
                key={address.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedAddressId(address.id)
                  populateAddressFields(address)
                }}
                className={`cursor-pointer rounded-2xl p-5 transition-all duration-300 relative ${
                  selectedAddressId === address.id
                    ? "bg-white/60 border-2 border-black/20 shadow-lg shadow-black/10"
                    : "bg-white/40 border border-white/60 hover:bg-white/60 shadow-md"
                }`}
              >
                {/* Edit Icon */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEditAddress(address)
                  }}
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/80 hover:bg-white border border-black/10 hover:border-black/20 transition-all"
                  aria-label="Edit address"
                >
                  <Edit className="w-3.5 h-3.5 text-black/60" />
                </motion.button>
                <div className="space-y-1 pr-8">
                  <p className="font-din-arabic font-medium">{address.name}</p>
                  <p className="font-din-arabic text-sm text-black/60">
                    {address.addressLine1}
                    {address.addressLine2 && `, ${address.addressLine2}`}
                  </p>
                  <p className="font-din-arabic text-sm text-black/60">
                    {address.city}, {address.state} {address.pincode}
                  </p>
                  <div className="flex items-center space-x-2 pt-1">
                    <p className="font-din-arabic text-sm text-black/60">{address.phone}</p>
                    <span className="text-black/30">|</span>
                    <span className="font-din-arabic text-xs px-2 py-1 bg-black/5 rounded-full text-black/50">
                      {address.label}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Add New Address Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setShowAddressForm(true)
                setSelectedAddressId("new")
                setIsEditingAddress(false)
                setEditingAddressId("")
                setNewAddressData({
                  name: "",
                  addressLine1: "",
                  addressLine2: "",
                  city: "",
                  state: "",
                  pincode: "",
                  phone: "",
                  label: "Home",
                  isDefault: false,
                })
              }}
              className="cursor-pointer rounded-2xl p-5 bg-white/40 border border-white/60 hover:bg-white/60 shadow-md transition-all duration-300 flex items-center justify-center"
            >
              <div className="flex items-center space-x-2 text-black/60">
                <Plus className="w-5 h-5" />
                <span className="font-din-arabic">Add New Address</span>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Show Add New Address card if no saved addresses */}
      {savedAddresses.length === 0 && !showAddressForm && (
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setShowAddressForm(true)
            setSelectedAddressId("new")
            setIsEditingAddress(false)
            setEditingAddressId("")
            setNewAddressData({
              name: "",
              addressLine1: "",
              addressLine2: "",
              city: "",
              state: "",
              pincode: "",
              phone: "",
              label: "Home",
              isDefault: false,
            })
          }}
          className="w-[50%] cursor-pointer rounded-2xl p-5 bg-white/40 border border-white/60 hover:bg-white/60 hover:shadow-md transition-all duration-300 flex items-center justify-center"
        >
          <div className="flex items-center space-x-2 text-black/60">
            <Plus className="w-5 h-5" />
            <span className="font-din-arabic">Add New Address</span>
          </div>
        </motion.div>
      )}

      {/* New Address Form - Shows only when adding new address */}
      <AnimatePresence>
        {showAddressForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="space-y-6 overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="newName" className="font-din-arabic mb-2 block">
                  Full Name
                </Label>
                <Input
                  id="newName"
                  placeholder="Enter full name"
                  label=""
                  name="newName"
                  value={newAddressData.name}
                  onChange={(e) =>
                    setNewAddressData({
                      ...newAddressData,
                      name: e.target.value,
                    })
                  }
                  className="file:text-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex-1 bg-white/60 border-black/20 font-din-arabic focus:border-black transition-all placeholder:text-black/30"
                />
              </div>
              <div>
                <Label htmlFor="newPhone" className="font-din-arabic mb-2 block">
                  Phone Number
                </Label>
                <div className="flex space-x-2">
                  <div className="w-16 bg-white/80 border border-black/10 rounded-md flex items-center justify-center text-xs font-din-arabic text-black/60">
                    +91
                  </div>
                  <Input
                    id="newPhone"
                    label=""
                    placeholder="Enter 10 digit number"
                    name="newPhone"
                    type="tel"
                    value={newAddressData.phone}
                    onChange={(e) =>
                      setNewAddressData({
                        ...newAddressData,
                        phone: e.target.value,
                      })
                    }
                    className="file:text-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex-1 bg-white/60 border-black/20 font-din-arabic focus:border-black transition-all placeholder:text-black/30"
                    maxLength={10}
                  />
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="newAddress1" className="font-din-arabic mb-2 block">
                Address Line 1
              </Label>
              <Input
                id="newAddress1"
                label=""
                placeholder="House no., street, locality"
                name="newAddress1"
                value={newAddressData.addressLine1}
                onChange={(e) =>
                  setNewAddressData({
                    ...newAddressData,
                    addressLine1: e.target.value,
                  })
                }
                className="file:text-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex-1 bg-white/60 border-black/20 font-din-arabic focus:border-black transition-all placeholder:text-black/30"
              />
            </div>
            <div>
              <Label htmlFor="newAddress2" className="font-din-arabic mb-2 block">
                Address Line 2 (Optional)
              </Label>
              <Input
                id="newAddress2"
                label=""
                placeholder="Apartment, suite, etc."
                name="newAddress2"
                value={newAddressData.addressLine2}
                onChange={(e) =>
                  setNewAddressData({
                    ...newAddressData,
                    addressLine2: e.target.value,
                  })
                }
                className="file:text-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex-1 bg-white/60 border-black/20 font-din-arabic focus:border-black transition-all placeholder:text-black/30"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="newPincode" className="font-din-arabic mb-2 block">
                  PIN Code
                </Label>
                <Input
                  id="newPincode"
                  label=""
                  placeholder="Enter 6-digit PIN"
                  name="newPincode"
                  value={newAddressData.pincode}
                  onChange={(e) =>
                    setNewAddressData({
                      ...newAddressData,
                      pincode: e.target.value,
                    })
                  }
                  className="file:text-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex-1 bg-white/60 border-black/20 font-din-arabic focus:border-black transition-all placeholder:text-black/30"
                  maxLength={6}
                />
              </div>

              <div>
                <Label htmlFor="newState" className="font-din-arabic mb-2 block">
                  State
                </Label>
                <Select
                  value={newAddressData.state}
                  onValueChange={(value: string) =>
                    setNewAddressData({ ...newAddressData, state: value })
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="newCity" className="font-din-arabic mb-2 block">
                  City
                </Label>
                <Select
                  value={newAddressData.city}
                  onValueChange={(value: string) =>
                    setNewAddressData({ ...newAddressData, city: value })
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
                <Label htmlFor="newLabel" className="font-din-arabic mb-2 block">
                  Address Label
                </Label>
                <Select
                  value={newAddressData.label}
                  onValueChange={(value: "Home" | "Work" | "Other") =>
                    setNewAddressData({ ...newAddressData, label: value })
                  }
                >
                  <SelectTrigger className="bg-white/80 border-black/10 focus:border-black/30 font-din-arabic h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Home" className="font-din-arabic">
                      Home
                    </SelectItem>
                    <SelectItem value="Work" className="font-din-arabic">
                      Work
                    </SelectItem>
                    <SelectItem value="Other" className="font-din-arabic">
                      Other
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* Mark as Default Checkbox */}
            <div className="pt-2">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <ShadcnCheckbox
                  checked={newAddressData.isDefault}
                  onCheckedChange={(checked: boolean) =>
                    setNewAddressData({
                      ...newAddressData,
                      isDefault: checked,
                    })
                  }
                />
                <span className="font-din-arabic text-sm text-black/70 group-hover:text-black transition-colors">
                  Mark as default address
                </span>
              </label>
            </div>
            {/* Save/Cancel Buttons */}
            <div className="flex space-x-3 pt-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  // Validate required fields
                  if (
                    !newAddressData.name ||
                    !newAddressData.addressLine1 ||
                    !newAddressData.city ||
                    !newAddressData.state ||
                    !newAddressData.pincode ||
                    !newAddressData.phone
                  ) {
                    toast.error("Please fill in all required fields")
                    return
                  }

                  // Validate pincode
                  if (newAddressData.pincode.replace(/\D/g, "").length !== 6) {
                    toast.error("Please enter a valid 6-digit PIN code")
                    return
                  }

                  if (isEditingAddress) {
                    // Update existing address
                    const updated = savedAddresses.map((addr) =>
                      addr.id === editingAddressId ? { ...addr, ...newAddressData } : addr
                    )
                    setSavedAddresses(updated)
                    localStorage.setItem("jardinBotanica_savedAddresses", JSON.stringify(updated))

                    // Update form fields if this address is selected
                    if (selectedAddressId === editingAddressId) {
                      populateAddressFields({
                        id: editingAddressId,
                        ...newAddressData,
                      } as SavedAddress)
                    }

                    toast.success("Address updated successfully")
                  } else {
                    // Save new address
                    const newAddr: SavedAddress = {
                      id: `address-${Date.now()}`,
                      ...newAddressData,
                    }
                    const updated = [...savedAddresses, newAddr]
                    setSavedAddresses(updated)
                    localStorage.setItem("jardinBotanica_savedAddresses", JSON.stringify(updated))

                    // Select it and populate form
                    setSelectedAddressId(newAddr.id)
                    populateAddressFields(newAddr)

                    toast.success("Address saved successfully")
                  }

                  // Reset and hide form
                  setNewAddressData({
                    name: "",
                    addressLine1: "",
                    addressLine2: "",
                    city: "",
                    state: "",
                    pincode: "",
                    phone: "",
                    label: "Home",
                    isDefault: false,
                  })
                  setShowAddressForm(false)
                  setIsEditingAddress(false)
                  setEditingAddressId("")
                }}
                className="flex-1 px-6 py-3 bg-black text-white font-din-arabic hover:bg-black/80 transition-all duration-300 rounded-lg"
              >
                {isEditingAddress ? "Update Address" : "Save Address"}
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setShowAddressForm(false)
                  setIsEditingAddress(false)
                  setEditingAddressId("")
                  setNewAddressData({
                    name: "",
                    addressLine1: "",
                    addressLine2: "",
                    city: "",
                    state: "",
                    pincode: "",
                    phone: "",
                    label: "Home",
                    isDefault: false,
                  })
                  if (savedAddresses.length > 0 && !selectedAddressId) {
                    setSelectedAddressId(savedAddresses[0].id)
                  }
                }}
                className="flex-1 px-6 py-3 border border-black/20 text-black font-din-arabic hover:bg-black/5 transition-all duration-300 rounded-lg"
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Information - Always visible when not adding address */}
      {!showAddressForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4 pt-6 border-t border-black/10"
        >
          <h3 className="font-din-arabic text-sm text-black/50 mb-4">Contact Information</h3>
          <div>
            <label
              data-slot="label"
              className="items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 font-din-arabic mb-2 block"
              htmlFor="email"
            >
              Email Address <span className="text-red-500">*</span>
            </label>
            <Input
              id="email"
              label=""
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleEmailBlur}
              className={`file:text-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex-1 bg-white/60 border-black/20 font-din-arabic focus:border-black transition-all placeholder:text-black/30 ${
                emailError
                  ? "border-red-500 focus:border-red-500"
                  : "border-black/10 focus:border-black/30"
              }`}
              aria-invalid={emailError ? "true" : "false"}
              data-testid="shipping-email-input"
            />
            {emailError && (
              <p className="mt-1.5 text-sm text-red-500 font-din-arabic">{emailError}</p>
            )}
          </div>
        </motion.div>
      )}

      {/* Billing Address Checkbox */}
      {!showAddressForm && (
        <div className="pt-6 border-t border-black/10">
          <div className="py-2">
            <label className="flex items-center space-x-3 cursor-pointer group">
              <ShadcnCheckbox
                checked={!checked}
                onCheckedChange={() => onChange()}
                data-testid="billing-address-checkbox"
              />
              <span className="font-din-arabic text-black/80 group-hover:text-black transition-colors">
                Use a different billing address
              </span>
            </label>
          </div>
        </div>
      )}

      {/* Hidden form fields for form submission */}
      <div className="hidden">
        <Input
          label=""
          name="email"
          type="email"
          value={formData.email || ""}
          onChange={handleChange}
        />
        <Input
          label=""
          name="shipping_address.first_name"
          value={formData["shipping_address.first_name"]}
          onChange={handleChange}
        />
        <Input
          label=""
          name="shipping_address.last_name"
          value={formData["shipping_address.last_name"]}
          onChange={handleChange}
        />
        <Input
          label=""
          name="shipping_address.address_1"
          value={formData["shipping_address.address_1"]}
          onChange={handleChange}
        />
        <Input
          label=""
          name="shipping_address.company"
          value={formData["shipping_address.company"]}
          onChange={handleChange}
        />
        <Input
          label=""
          name="shipping_address.postal_code"
          value={formData["shipping_address.postal_code"]}
          onChange={handleChange}
        />
        <Input
          label=""
          name="shipping_address.city"
          value={formData["shipping_address.city"]}
          onChange={handleChange}
        />
        <Input
          label=""
          name="shipping_address.province"
          value={formData["shipping_address.province"]}
          onChange={handleChange}
        />
        <Input
          label=""
          name="shipping_address.phone"
          value={formData["shipping_address.phone"]}
          onChange={handleChange}
        />
        <CountrySelect
          name="shipping_address.country_code"
          region={cart?.region}
          value={formData["shipping_address.country_code"] || "in"}
          onChange={handleChange}
        />
      </div>
    </div>
  )
}

export default ShippingAddress
