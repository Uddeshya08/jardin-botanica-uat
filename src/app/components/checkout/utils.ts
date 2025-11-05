// Checkout utility functions

import { SavedAddress, FormData } from './types';

export const populateAddressFields = (address: SavedAddress): Partial<FormData> => {
  const nameParts = address.name.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  return {
    firstName,
    lastName,
    phone: address.phone.replace(/^\+\d+\s*/, ''), // Remove country code
    address: address.addressLine1 + (address.addressLine2 ? ', ' + address.addressLine2 : ''),
    city: address.city,
    state: address.state,
    pincode: address.pincode,
  };
};

export const loadSavedAddresses = (): SavedAddress[] => {
  if (typeof window === 'undefined') return [];
  
  const storedAddresses = localStorage.getItem('jardinBotanica_savedAddresses');
  if (storedAddresses) {
    try {
      return JSON.parse(storedAddresses);
    } catch (error) {
      console.error('Failed to load saved addresses:', error);
      return [];
    }
  }
  return [];
};

export const saveAddress = (address: SavedAddress): SavedAddress[] => {
  const addresses = loadSavedAddresses();
  const updated = [...addresses, address];
  localStorage.setItem('jardinBotanica_savedAddresses', JSON.stringify(updated));
  return updated;
};

export const calculateTotals = (
  cartItems: { price: number; quantity: number }[],
  appliedCoupon: { type: 'percentage' | 'fixed'; value: number } | null
) => {
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percentage') {
      discount = Math.round(subtotal * (appliedCoupon.value / 100));
    } else {
      discount = appliedCoupon.value;
    }
  }
  
  const discountedSubtotal = subtotal - discount;
  const shipping = discountedSubtotal >= 2500 ? 0 : 150;
  const tax = Math.round(discountedSubtotal * 0.18); // 18% GST
  const total = discountedSubtotal + shipping + tax;

  return { subtotal, discount, discountedSubtotal, shipping, tax, total };
};

