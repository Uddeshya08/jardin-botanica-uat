"use client";

import React from 'react';
import { motion } from 'motion/react';
import { Plus } from 'lucide-react';
import { SavedAddress } from './types';

interface SavedAddressesProps {
  addresses: SavedAddress[];
  selectedAddressId: string;
  onSelect: (addressId: string) => void;
  onAddNew: () => void;
  onPopulate: (address: SavedAddress) => void;
}

export function SavedAddresses({
  addresses,
  selectedAddressId,
  onSelect,
  onAddNew,
  onPopulate
}: SavedAddressesProps) {
  if (addresses.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((address) => (
          <motion.div
            key={address.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              onSelect(address.id);
              onPopulate(address);
            }}
            className={`cursor-pointer rounded-2xl p-5 transition-all duration-300 ${
              selectedAddressId === address.id
                ? 'bg-white/60 border-2 border-black/20 shadow-lg shadow-black/10'
                : 'bg-white/40 border border-white/60 hover:bg-white/60 hover:shadow-md'
            }`}
          >
            <div className="space-y-1">
              <p className="font-din-arabic">{address.name}</p>
              <p className="font-din-arabic text-sm text-black/60">
                {address.addressLine1}
                {address.addressLine2 && `, ${address.addressLine2}`}
              </p>
              <p className="font-din-arabic text-sm text-black/60">
                {address.city}, {address.state} {address.pincode}
              </p>
              <div className="flex items-center space-x-2 pt-1">
                <p className="font-din-arabic text-sm text-black/60">
                  {address.phone}
                </p>
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
          onClick={onAddNew}
          className="cursor-pointer rounded-2xl p-5 bg-white/40 border border-white/60 hover:bg-white/60 hover:shadow-md transition-all duration-300 flex items-center justify-center"
        >
          <div className="flex items-center space-x-2 text-black/60">
            <Plus className="w-5 h-5" />
            <span className="font-din-arabic">Add New Address</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

