import type { HttpTypes } from "@medusajs/types"
import { Container } from "@medusajs/ui"
import compareAddresses from "@lib/util/compare-addresses"
import { normalizeCheckoutPhone } from "@lib/util/checkout-phone"
import Checkbox from "@modules/common/components/checkbox"
import Input from "@modules/common/components/input"
import { mapKeys } from "lodash"
import { Edit, Plus } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import type React from "react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"
import { Checkbox as ShadcnCheckbox } from "../../../../app/components/ui/checkbox"
import { Label } from "../../../../app/components/ui/label"
import { addCustomerAddress, updateCustomerAddress } from "@lib/data/customer"
import { useRouter } from "next/navigation"
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

const toComparableAddress = (address: SavedAddress): HttpTypes.StoreCartAddress => {
  const [firstName, ...lastNameParts] = address.name.split(" ")

  return {
    first_name: firstName || "",
    last_name: lastNameParts.join(" ") || "",
    address_1: address.addressLine1,
    company: address.addressLine2 || "",
    postal_code: address.pincode,
    city: address.city,
    country_code: "in",
    province: address.state,
    phone: address.phone,
  } as HttpTypes.StoreCartAddress
}

const ShippingAddress = ({
  customer,
  cart,
  checked,
  onChange,
  onContactValidationChange,
}: {
  customer: HttpTypes.StoreCustomer | null
  cart: HttpTypes.StoreCart | null
  checked: boolean
  onChange: () => void
  onContactValidationChange?: (isValid: boolean) => void
}) => {
  const router = useRouter()
  const [formData, setFormData] = useState<Record<string, any>>({
    "shipping_address.first_name": cart?.shipping_address?.first_name || "",
    "shipping_address.last_name": cart?.shipping_address?.last_name || "",
    "shipping_address.address_1": cart?.shipping_address?.address_1 || "",
    "shipping_address.company": cart?.shipping_address?.company || "",
    "shipping_address.postal_code": cart?.shipping_address?.postal_code || "",
    "shipping_address.city": cart?.shipping_address?.city || "",
    "shipping_address.country_code": cart?.shipping_address?.country_code || "",
    "shipping_address.province": cart?.shipping_address?.province || "",
    "shipping_address.phone": cart?.shipping_address?.phone || customer?.phone || "",
    email: cart?.email || customer?.email || "",
  })

  // Local state for saved addresses
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([])
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [selectedAddressId, setSelectedAddressId] = useState<string>("")
  const selectedCheckoutAddress = useRef<SavedAddress | null>(null)
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
  const [phoneTouched, setPhoneTouched] = useState(false)
  const [isLoadingPostalData, setIsLoadingPostalData] = useState(false)

  // Submit the address being edited, even when Continue is used before Save Address.
  const shippingAddress = showAddressForm
    ? toComparableAddress({ id: "draft", ...newAddressData })
    : {
        first_name: formData["shipping_address.first_name"],
        last_name: formData["shipping_address.last_name"],
        address_1: formData["shipping_address.address_1"],
        company: formData["shipping_address.company"],
        postal_code: formData["shipping_address.postal_code"],
        city: formData["shipping_address.city"],
        province: formData["shipping_address.province"],
        country_code: formData["shipping_address.country_code"] || "in",
      }

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

  const setFormAddress = (address?: HttpTypes.StoreCartAddress) => {
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
        "shipping_address.phone": prevState["shipping_address.phone"] || address?.phone || "",
      }))

  }

  const populateAddressFields = (address: SavedAddress) => {
    const comparableAddress = toComparableAddress(address)
    setFormAddress(comparableAddress)
  }

  const selectSavedAddress = (address: SavedAddress) => {
    selectedCheckoutAddress.current = address
    setSelectedAddressId(address.id)
    populateAddressFields(address)
  }

  // Load saved addresses from localStorage and customer addresses from Medusa
  useEffect(() => {
    const allAddresses: SavedAddress[] = []

    // First, load customer addresses from Medusa (if logged in)
    if (customer?.addresses && customer.addresses.length > 0) {
      const customerAddresses: SavedAddress[] = customer.addresses
        .filter((addr) => addr.country_code === "in") // Only Indian addresses for now
        .map((addr) => ({
          id: addr.id || `cust-${Math.random().toString(36).substr(2, 9)}`,
          name: `${addr.first_name || ""} ${addr.last_name || ""}`.trim() || "Saved Address",
          addressLine1: addr.address_1 || "",
          addressLine2: addr.address_2 || undefined,
          city: addr.city || "",
          state: addr.province || "",
          pincode: addr.postal_code || "",
          phone: addr.phone || "",
          label:
            (addr.metadata?.address_type as "Home" | "Work" | "Other") ||
            ((addr.company ? "Work" : "Home") as "Home" | "Work" | "Other"),
          isDefault: false,
        }))
      allAddresses.push(...customerAddresses)
    }

    // Then, load addresses from sessionStorage
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("jardinBotanica_savedAddresses")
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          // Filter out sessionStorage addresses that already exist in customer addresses
          const localAddresses = parsed.filter(
            (localAddr: SavedAddress) =>
              !allAddresses.some(
                (custAddr) =>
                  custAddr.addressLine1.toLowerCase() === localAddr.addressLine1.toLowerCase() &&
                  custAddr.pincode === localAddr.pincode
              )
          )
          allAddresses.push(...localAddresses)
        } catch (e) {
          console.error("Error loading saved addresses:", e)
        }
      }
    }

    if (allAddresses.length > 0) {
      setSavedAddresses(allAddresses)
      // Customer refreshes must retain the address just saved or selected.
      if (selectedCheckoutAddress.current) {
        const selectedAddress = allAddresses.find((address) =>
          compareAddresses(
            toComparableAddress(address),
            toComparableAddress(selectedCheckoutAddress.current!)
          )
        )
        if (selectedAddress) {
          selectedCheckoutAddress.current = selectedAddress
          setSelectedAddressId(selectedAddress.id)
        }
        return
      }
      const matchingCartAddress = cart?.shipping_address
        ? allAddresses.find((address) =>
            compareAddresses(toComparableAddress(address), cart.shipping_address)
          )
        : undefined

      // Auto-select default address if available
      const defaultAddr = allAddresses.find((addr: SavedAddress) => addr.isDefault)
      const hasCartAddress = Boolean(
        cart?.shipping_address?.postal_code?.trim() &&
        cart.shipping_address.address_1?.trim() &&
        cart.shipping_address.city?.trim() &&
        cart.shipping_address.country_code
      )
      if (matchingCartAddress) {
        setSelectedAddressId(matchingCartAddress.id)
        populateAddressFields(matchingCartAddress)
      } else if (defaultAddr && !hasCartAddress) {
        selectSavedAddress(defaultAddr)
      } else if (!hasCartAddress) {
        selectSavedAddress(allAddresses[0])
      } else {
        setSelectedAddressId("")
      }
    }
  }, [cart?.shipping_address, customer])

  useEffect(() => {
    // Ensure cart is not null and has a shipping_address before setting form data
    if (cart?.shipping_address && !selectedCheckoutAddress.current && !showAddressForm) {
      setFormAddress(cart.shipping_address)
    }
  }, [cart]) // Add cart as a dependency

  let phoneError = ""
  try {
    normalizeCheckoutPhone(formData["shipping_address.phone"] || "")
  } catch (error) {
    phoneError = (error as Error).message
  }

  const email = formData.email.trim()
  const emailError = email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ? "Please enter a valid email address"
    : ""

  useEffect(() => {
    onContactValidationChange?.(!phoneError && !emailError)
  }, [phoneError, emailError, onContactValidationChange])

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLInputElement | HTMLSelectElement>
  ) => {
    const value = e.target.value
    setFormData({
      ...formData,
      [e.target.name]: value,
    })

  }

  const emailField = (
    <div>
      <Label htmlFor="shipping-email" className="font-din-arabic mb-2 block">
        Email Address
      </Label>
      <Input
        id="shipping-email"
        label=""
        name="email"
        type="email"
        autoComplete="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Enter email address"
        className={`h-9 w-full rounded-md border px-3 py-1 bg-white/60 font-din-arabic ${emailError ? "border-red-500" : "border-black/20"}`}
        aria-invalid={Boolean(emailError)}
        aria-describedby={emailError ? "shipping-email-error" : undefined}
        data-testid="shipping-email-input"
      />
      {emailError && (
        <p id="shipping-email-error" className="mt-1.5 text-sm text-red-500 font-din-arabic">
          {emailError}
        </p>
      )}
    </div>
  )

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
                  selectSavedAddress(address)
                }}
                className={`cursor-pointer rounded-2xl p-5 transition-all duration-300 relative ${selectedAddressId === address.id
                  ? "bg-white/60 border-2 border-black/20 shadow-lg shadow-black/10"
                  : "bg-white/40 border border-white/60 hover:bg-white/60 shadow-md"
                  }`}
              >
                {/* Edit Icon */}
                <motion.button
                  type="button"
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
                <span className="font-din-arabic">Add new address</span>
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
              <div className="min-w-0">
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
              <div className="min-w-0">{emailField}</div>
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
                onClick={async () => {
                  // Validate required fields
                  if (
                    !newAddressData.name ||
                    !newAddressData.addressLine1 ||
                    !newAddressData.city ||
                    !newAddressData.state ||
                    !newAddressData.pincode
                  ) {
                    toast.error("Please fill in all required fields")
                    return
                  }

                  let phone: string
                  try {
                    phone = normalizeCheckoutPhone(formData["shipping_address.phone"])
                  } catch (error) {
                    toast.error((error as Error).message)
                    return
                  }
                  const addressToSave = { ...newAddressData, phone }

                  // Validate pincode
                  if (newAddressData.pincode.replace(/\D/g, "").length !== 6) {
                    toast.error("Please enter a valid 6-digit PIN code")
                    return
                  }

                  if (customer?.id) {
                    const [firstName, ...lastNameParts] = newAddressData.name.split(" ")
                    const lastName = lastNameParts.join(" ") || ""

                    const formDataToSubmit = new FormData()
                    formDataToSubmit.append("first_name", firstName)
                    formDataToSubmit.append("last_name", lastName)
                    formDataToSubmit.append("address_1", newAddressData.addressLine1)
                    formDataToSubmit.append("address_2", newAddressData.addressLine2 || "")
                    formDataToSubmit.append("city", newAddressData.city)
                    formDataToSubmit.append("province", newAddressData.state)
                    formDataToSubmit.append("postal_code", newAddressData.pincode)
                    formDataToSubmit.append("phone", phone)
                    formDataToSubmit.append("country_code", "in")
                    if (newAddressData.isDefault) {
                      formDataToSubmit.append("is_default_shipping", "on")
                    }
                    formDataToSubmit.append("address_type", newAddressData.label)

                    if (isEditingAddress && !editingAddressId.startsWith("address-")) {
                      const res = await updateCustomerAddress(
                        { addressId: editingAddressId },
                        formDataToSubmit
                      )
                      if (!res.success) {
                        toast.error(res.error || "Failed to update address")
                        return
                      }
                      toast.success("Address updated successfully")
                      router.refresh()
                    } else {
                        const res = await addCustomerAddress({}, formDataToSubmit)
                        if (!res.success) {
                          toast.error(res.error || "Failed to save address")
                          return
                        }
                        toast.success("Address saved successfully")
                        router.refresh()
                    }
                  } else {
                    if (isEditingAddress) {
                      // Update existing address
                      const updated = savedAddresses.map((addr) =>
                        addr.id === editingAddressId ? { ...addr, ...addressToSave } : addr
                      )
                      setSavedAddresses(updated)
                      sessionStorage.setItem("jardinBotanica_savedAddresses", JSON.stringify(updated))

                      // Update form fields if this address is selected
                      if (selectedAddressId === editingAddressId) {
                        populateAddressFields({
                          id: editingAddressId,
                          ...addressToSave,
                        } as SavedAddress)
                      }
                      
                      toast.success("Address updated successfully")
                    } else {
                      // Save new address
                      const newAddr: SavedAddress = {
                        id: `address-${Date.now()}`,
                        ...addressToSave,
                      }
                      const updated = [...savedAddresses, newAddr]
                      setSavedAddresses(updated)
                      sessionStorage.setItem("jardinBotanica_savedAddresses", JSON.stringify(updated))

                      // Select it and populate form
                      selectSavedAddress(newAddr)
                      
                      toast.success("Address saved successfully")
                    }
                  }

                  // Both customer and guest saves must update checkout fields before
                  // the editor closes; saving to the address book alone is insufficient.
                  selectSavedAddress({
                    id: editingAddressId || `address-${Date.now()}`,
                    ...addressToSave,
                  })

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

      <div className="space-y-4 pt-6 border-t border-black/10">
        <h3 className="font-din-arabic text-sm text-black/50">Contact Information</h3>
        <Label htmlFor="checkout-phone" className="font-din-arabic mb-2 block">
          Phone Number <span className="text-red-500">*</span>
        </Label>
        <Input
          id="checkout-phone"
          label=""
          name="shipping_address.phone"
          type="tel"
          autoComplete="tel"
          required
          value={formData["shipping_address.phone"]}
          onChange={handleChange}
          onBlur={() => setPhoneTouched(true)}
          placeholder="10-digit mobile number or +91..."
          className={`h-9 w-full rounded-md border px-3 py-1 bg-white/60 font-din-arabic ${phoneTouched && phoneError ? "border-red-500" : "border-black/20"}`}
          aria-invalid={phoneTouched && Boolean(phoneError)}
          data-testid="shipping-phone-input"
        />
        {phoneTouched && phoneError && (
          <p className="font-din-arabic text-sm text-red-500">{phoneError}</p>
        )}
      </div>

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
        {!showAddressForm && <input type="hidden" name="email" value={formData.email} />}
        <Input
          label=""
          name="shipping_address.first_name"
          value={shippingAddress.first_name || ""}
          onChange={handleChange}
        />
        <Input
          label=""
          name="shipping_address.last_name"
          value={shippingAddress.last_name || ""}
          onChange={handleChange}
        />
        <Input
          label=""
          name="shipping_address.address_1"
          value={shippingAddress.address_1 || ""}
          onChange={handleChange}
        />
        <Input
          label=""
          name="shipping_address.company"
          value={shippingAddress.company || ""}
          onChange={handleChange}
        />
        <Input
          label=""
          name="shipping_address.postal_code"
          value={shippingAddress.postal_code || ""}
          onChange={handleChange}
        />
        <Input
          label=""
          name="shipping_address.city"
          value={shippingAddress.city || ""}
          onChange={handleChange}
        />
        <Input
          label=""
          name="shipping_address.province"
          value={shippingAddress.province || ""}
          onChange={handleChange}
        />
        <CountrySelect
          name="shipping_address.country_code"
          region={cart?.region}
          value={shippingAddress.country_code || "in"}
          onChange={handleChange}
        />
      </div>
    </div>
  )
}

export default ShippingAddress
