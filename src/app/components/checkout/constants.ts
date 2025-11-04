// Checkout constants and configuration
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  Wallet, 
  Banknote,
  MapPin,
  Check
} from 'lucide-react';

export const paymentMethods = [
  {
    id: 'card',
    name: 'Credit / Debit Card',
    icon: CreditCard,
    description: 'Visa, Mastercard, Amex, Rupay',
    color: '#4f46e5'
  },
  {
    id: 'upi',
    name: 'UPI',
    icon: Smartphone,
    description: 'Google Pay, PhonePe, Paytm & more',
    color: '#059669'
  },
  {
    id: 'netbanking',
    name: 'Net Banking',
    icon: Building2,
    description: 'All major banks supported',
    color: '#dc2626'
  },
  {
    id: 'wallet',
    name: 'Wallets',
    icon: Wallet,
    description: 'Paytm, Mobikwik, Amazon Pay',
    color: '#ea580c'
  },
  {
    id: 'cod',
    name: 'Cash on Delivery',
    icon: Banknote,
    description: 'Pay when you receive',
    color: '#545d4a'
  }
];

export const steps = [
  { id: 1, name: 'Shipping', icon: MapPin },
  { id: 2, name: 'Payment', icon: CreditCard },
  { id: 3, name: 'Review', icon: Check }
];

export const availableCoupons = {
  'WELCOME10': { type: 'percentage' as const, value: 10, description: '10% off' },
  'SAVE20': { type: 'percentage' as const, value: 20, description: '20% off' },
  'JARDIN15': { type: 'percentage' as const, value: 15, description: '15% off' },
  'FIRST100': { type: 'fixed' as const, value: 100, description: '₹100 off' },
  'FLAT200': { type: 'fixed' as const, value: 200, description: '₹200 off' },
};

// Indian cities and states for address forms
export const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh',
  'Lakshadweep', 'Puducherry'
];

export const indianCities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata', 'Surat',
  'Pune', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal',
  'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana',
  'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Kalyan-Dombivali', 'Vasai-Virar',
  'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar', 'Navi Mumbai', 'Allahabad',
  'Ranchi', 'Howrah', 'Coimbatore', 'Jabalpur', 'Gwalior', 'Vijayawada', 'Jodhpur',
  'Madurai', 'Raipur', 'Kota', 'Other'
];

