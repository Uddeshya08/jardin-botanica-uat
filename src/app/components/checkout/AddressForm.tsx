"use client";

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { indianCities, indianStates } from './constants';
import { AddressData, SavedAddress } from './types';
import { toast } from 'sonner';

interface AddressFormProps {
  addressData: AddressData;
  onUpdate: (data: Partial<AddressData>) => void;
  onSave: (address: SavedAddress) => void;
  onCancel: () => void;
  isBilling?: boolean;
}

export function AddressForm({
  addressData,
  onUpdate,
  onSave,
  onCancel,
  isBilling = false
}: AddressFormProps) {
  const handleSave = () => {
    // Validate required fields
    if (!addressData.name || !addressData.addressLine1 || !addressData.city || 
        !addressData.state || !addressData.pincode || !addressData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Validate pincode
    if (addressData.pincode.replace(/\D/g, '').length !== 6) {
      toast.error('Please enter a valid 6-digit PIN code');
      return;
    }
    
    // Save the new address
    const newAddr: SavedAddress = {
      id: `address-${Date.now()}`,
      ...addressData
    };
    
    onSave(newAddr);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className="space-y-6 overflow-hidden"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`${isBilling ? 'billing' : 'new'}Name`} className="font-din-arabic mb-2 block">
              Full Name
            </Label>
            <Input
              id={`${isBilling ? 'billing' : 'new'}Name`}
              value={addressData.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              className="bg-white/80 border-black/10 focus:border-black/30 transition-all duration-300"
              placeholder="Enter full name"
            />
          </div>
          <div>
            <Label htmlFor={`${isBilling ? 'billing' : 'new'}Phone`} className="font-din-arabic mb-2 block">
              Phone Number
            </Label>
            <div className="flex space-x-2">
              <div className="w-16 bg-white/80 border border-black/10 rounded-md flex items-center justify-center text-xs font-din-arabic text-black/60">
                +91
              </div>
              <Input
                id={`${isBilling ? 'billing' : 'new'}Phone`}
                type="tel"
                value={addressData.phone}
                onChange={(e) => onUpdate({ phone: e.target.value })}
                className="bg-white/80 border-black/10 focus:border-black/30 transition-all duration-300"
                placeholder="XXXXX XXXXX"
                maxLength={10}
              />
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor={`${isBilling ? 'billing' : 'new'}Address1`} className="font-din-arabic mb-2 block">
            Address Line 1
          </Label>
          <Input
            id={`${isBilling ? 'billing' : 'new'}Address1`}
            value={addressData.addressLine1}
            onChange={(e) => onUpdate({ addressLine1: e.target.value })}
            className="bg-white/80 border-black/10 focus:border-black/30 transition-all duration-300"
            placeholder="House no., Street, Locality"
          />
        </div>

        <div>
          <Label htmlFor={`${isBilling ? 'billing' : 'new'}Address2`} className="font-din-arabic mb-2 block">
            Address Line 2 (Optional)
          </Label>
          <Input
            id={`${isBilling ? 'billing' : 'new'}Address2`}
            value={addressData.addressLine2}
            onChange={(e) => onUpdate({ addressLine2: e.target.value })}
            className="bg-white/80 border-black/10 focus:border-black/30 transition-all duration-300"
            placeholder="Apartment, suite, etc."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`${isBilling ? 'billing' : 'new'}City`} className="font-din-arabic mb-2 block">City</Label>
            <Select
              value={addressData.city}
              onValueChange={(value) => onUpdate({ city: value })}
            >
              <SelectTrigger className="bg-white/80 border-black/10 focus:border-black/30 font-din-arabic">
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
            <Label htmlFor={`${isBilling ? 'billing' : 'new'}State`} className="font-din-arabic mb-2 block">State</Label>
            <Select
              value={addressData.state}
              onValueChange={(value) => onUpdate({ state: value })}
            >
              <SelectTrigger className="bg-white/80 border-black/10 focus:border-black/30 font-din-arabic">
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

        <div className={isBilling ? "" : "grid grid-cols-2 gap-4"}>
          <div>
            <Label htmlFor={`${isBilling ? 'billing' : 'new'}Pincode`} className="font-din-arabic mb-2 block">PIN Code</Label>
            <Input
              id={`${isBilling ? 'billing' : 'new'}Pincode`}
              value={addressData.pincode}
              onChange={(e) => onUpdate({ pincode: e.target.value })}
              className="bg-white/80 border-black/10 focus:border-black/30 transition-all duration-300"
              maxLength={6}
              placeholder="Enter 6-digit PIN"
            />
          </div>
          {!isBilling && (
            <div>
              <Label htmlFor="newLabel" className="font-din-arabic mb-2 block">Address Label</Label>
              <Select
                value={addressData.label}
                onValueChange={(value) => onUpdate({ label: value as 'Home' | 'Work' | 'Other' })}
              >
                <SelectTrigger className="bg-white/80 border-black/10 focus:border-black/30 font-din-arabic">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Home" className="font-din-arabic">Home</SelectItem>
                  <SelectItem value="Work" className="font-din-arabic">Work</SelectItem>
                  <SelectItem value="Other" className="font-din-arabic">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {!isBilling && (
          <div className="pt-2">
            <label className="flex items-center space-x-3 cursor-pointer group">
              <Checkbox
                checked={addressData.isDefault}
                onCheckedChange={(checked) => onUpdate({ isDefault: checked as boolean })}
              />
              <span className="font-din-arabic text-sm text-black/70 group-hover:text-black transition-colors">
                Mark as default address
              </span>
            </label>
          </div>
        )}

        {/* Save/Cancel Buttons */}
        <div className="flex space-x-3 pt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            className="flex-1 px-6 py-3 bg-black text-white font-din-arabic hover:bg-black/80 transition-all duration-300 rounded-lg"
          >
            Save Address
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCancel}
            className="flex-1 px-6 py-3 border border-black/20 text-black font-din-arabic hover:bg-black/5 transition-all duration-300 rounded-lg"
          >
            Cancel
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

