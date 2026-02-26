"use client"

import { addCustomerAddress } from "@lib/data/customer"
import useToggleState from "@lib/hooks/use-toggle-state"
import { Plus } from "@medusajs/icons"
import type { HttpTypes } from "@medusajs/types"
import { Button, Heading } from "@medusajs/ui"
import CountrySelect from "@modules/checkout/components/country-select"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import { useActionState, useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../app/components/ui/dialog"

const AddAddress = ({
  region,
  addresses,
}: {
  region: HttpTypes.StoreRegion
  addresses: HttpTypes.StoreCustomerAddress[]
}) => {
  const [successState, setSuccessState] = useState(false)
  const { state, open, close: closeModal } = useToggleState(false)
  const [postalCode, setPostalCode] = useState("")
  const [city, setCity] = useState("")
  const [province, setProvince] = useState("")
  const [isLoadingPostalData, setIsLoadingPostalData] = useState(false)

  const [formState, formAction] = useActionState(addCustomerAddress, {
    isDefaultShipping: addresses.length === 0,
    success: false,
    error: null,
  })

  const close = () => {
    setSuccessState(false)
    setPostalCode("")
    setCity("")
    setProvince("")
    closeModal()
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
          setCity(postOffice.District || postOffice.Name || "")
          setProvince(postOffice.State || "")
        } else {
          // Reset if postal code not found
          setCity("")
          setProvince("")
        }
      } catch (error) {
        console.error("Error fetching postal code data:", error)
      } finally {
        setIsLoadingPostalData(false)
      }
    }
  }

  useEffect(() => {
    if (successState) {
      close()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successState])

  useEffect(() => {
    if (formState.success) {
      setSuccessState(true)
    }
  }, [formState])

  // Fetch postal data when postal code changes
  useEffect(() => {
    if (postalCode.length === 6) {
      fetchPostalData(postalCode)
    }
  }, [postalCode])

  return (
    <>
      <button
        className="px-8 py-4 border text-black font-din-arabic tracking-wide hover:bg-black hover:text-white transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2"
        onClick={open}
        data-testid="add-address-button"
      >
        <span className="text-base-regular">Add address</span>
        <Plus />
      </button>

      <Dialog open={state} onOpenChange={(isOpen: boolean) => (isOpen ? open() : close())}>
        <DialogContent data-testid="add-address-modal">
          <DialogHeader>
            <DialogTitle>
              <Heading className="mb-2">Add address</Heading>
            </DialogTitle>
          </DialogHeader>
          <form action={formAction}>
            <div className="flex flex-col gap-y-2">
              <div className="grid grid-cols-2 gap-x-2">
                <Input
                  label="First name"
                  name="first_name"
                  required
                  autoComplete="given-name"
                  data-testid="first-name-input"
                />
                <Input
                  label="Last name"
                  name="last_name"
                  required
                  autoComplete="family-name"
                  data-testid="last-name-input"
                />
              </div>
              <Input
                label="Address"
                name="address_1"
                required
                autoComplete="address-line1"
                data-testid="address-1-input"
              />
              <Input
                label="Apartment, suite, etc."
                name="address_2"
                autoComplete="address-line2"
                data-testid="address-2-input"
              />
              <div className="grid grid-cols-[144px_1fr] gap-x-2">
                <Input
                  label="Postal code"
                  name="postal_code"
                  required
                  autoComplete="postal-code"
                  data-testid="postal-code-input"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
                <Input
                  label="City"
                  name="city"
                  required
                  autoComplete="locality"
                  data-testid="city-input"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <Input
                label="Province / State"
                name="province"
                autoComplete="address-level1"
                data-testid="state-input"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
              />
              <CountrySelect
                region={region}
                name="country_code"
                required
                autoComplete="country"
                data-testid="country-select"
              />
              <div className="flex flex-col gap-y-2">
                <label className="text-sm font-medium text-gray-700">Address Type</label>
                <select
                  name="address_type"
                  defaultValue="Home"
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <Input label="Phone" name="phone" autoComplete="phone" data-testid="phone-input" />
            </div>
            {formState.error && (
              <div className="text-rose-500 text-small-regular py-2" data-testid="address-error">
                {formState.error}
              </div>
            )}
            <DialogFooter>
              <div className="flex gap-3 mt-6">
                <Button
                  type="reset"
                  variant="secondary"
                  onClick={close}
                  className="h-10"
                  data-testid="cancel-button"
                >
                  Cancel
                </Button>
                <SubmitButton data-testid="save-button">Save</SubmitButton>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AddAddress
