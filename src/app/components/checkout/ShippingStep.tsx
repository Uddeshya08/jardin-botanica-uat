"use client";

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { SavedAddresses } from './SavedAddresses';
import { AddressForm } from './AddressForm';
import { SavedAddress, FormData, AddressData } from './types';
import { populateAddressFields } from './utils';

interface ShippingStepProps {
  savedAddresses: SavedAddress[];
  selectedAddressId: string;
  showAddressForm: boolean;
  useDifferentBilling: boolean;
  newAddressData: AddressData;
  newBillingData: AddressData;
  formData: FormData;
  emailError: string;
  onSelectAddress: (addressId: string) => void;
  onShowAddressForm: () => void;
  onUpdateAddressData: (data: Partial<AddressData>) => void;
  onUpdateBillingData: (data: Partial<AddressData>) => void;
  onSaveAddress: (address: SavedAddress) => void;
  onCancelAddressForm: () => void;
  onSetUseDifferentBilling: (checked: boolean) => void;
  onUpdateFormData: (data: Partial<FormData>) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ShippingStep({
  savedAddresses,
  selectedAddressId,
  showAddressForm,
  useDifferentBilling,
  newAddressData,
  newBillingData,
  formData,
  emailError,
  onSelectAddress,
  onShowAddressForm,
  onUpdateAddressData,
  onUpdateBillingData,
  onSaveAddress,
  onCancelAddressForm,
  onSetUseDifferentBilling,
  onUpdateFormData,
  onInputChange
}: ShippingStepProps) {
  const handleAddressSelect = (addressId: string) => {
    onSelectAddress(addressId);
    if (addressId !== 'new') {
      const address = savedAddresses.find(addr => addr.id === addressId);
      if (address) {
        const populated = populateAddressFields(address);
        onUpdateFormData(populated);
      }
    }
  };

  const handleSaveAddress = (address: SavedAddress) => {
    onSaveAddress(address);
    handleAddressSelect(address.id);
  };

  return (
    <motion.div
      key="shipping"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="bg-white/60 backdrop-blur-md rounded-2xl md:rounded-3xl p-4 md:p-8 border border-white/80 shadow-xl"
    >
      <div className="mb-6 md:mb-8">
        <p className="font-din-arabic text-xs text-black/40 mb-2 tracking-wider uppercase">
          Shipping Information
        </p>
        <h2 className="font-american-typewriter text-xl sm:text-2xl md:text-3xl tracking-wide">
          Where Shall We Send Your Order?
        </h2>
      </div>

      <div className="space-y-6">
        {/* Saved Addresses */}
        {savedAddresses.length > 0 && !showAddressForm && (
          <SavedAddresses
            addresses={savedAddresses}
            selectedAddressId={selectedAddressId}
            onSelect={handleAddressSelect}
            onAddNew={onShowAddressForm}
            onPopulate={(address) => {
              const populated = populateAddressFields(address);
              onUpdateFormData(populated);
            }}
          />
        )}

        {/* New Address Form */}
        {showAddressForm && (
          <AddressForm
            addressData={newAddressData}
            onUpdate={onUpdateAddressData}
            onSave={handleSaveAddress}
            onCancel={onCancelAddressForm}
            isBilling={false}
          />
        )}

        {/* Contact Information */}
        {!showAddressForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4 pt-6 border-t border-black/10"
          >
            <h3 className="font-din-arabic text-sm text-black/50 mb-4">Contact Information</h3>
            <div>
              <Label htmlFor="email" className="font-din-arabic mb-2 block">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={onInputChange}
                className={`bg-white/80 transition-all duration-300 ${
                  emailError 
                    ? 'border-red-500 focus:border-red-600' 
                    : 'border-black/10 focus:border-black/30'
                }`}
                placeholder="your@email.com"
              />
              {emailError && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-din-arabic text-xs text-red-600 mt-1.5"
                >
                  {emailError}
                </motion.p>
              )}
            </div>
          </motion.div>
        )}

        {/* Billing Address Section */}
        {!showAddressForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-4 pt-6 border-t border-black/10"
          >
            <div className="py-2">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <Checkbox
                  checked={useDifferentBilling}
                  onCheckedChange={(checked) => {
                    onSetUseDifferentBilling(checked as boolean);
                    if (!checked) {
                      onUpdateBillingData({
                        name: '', addressLine1: '', addressLine2: '', city: '', 
                        state: '', pincode: '', phone: '', label: 'Home', isDefault: false
                      });
                    }
                  }}
                />
                <span className="font-din-arabic text-black/80 group-hover:text-black transition-colors">
                  Use a different billing address
                </span>
              </label>
            </div>

            <AnimatePresence>
              {useDifferentBilling && (
                <AddressForm
                  addressData={newBillingData}
                  onUpdate={onUpdateBillingData}
                  onSave={() => {}}
                  onCancel={() => onSetUseDifferentBilling(false)}
                  isBilling={true}
                />
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

