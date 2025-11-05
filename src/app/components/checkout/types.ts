// Checkout types and interfaces

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface CheckoutPageProps {
  cartItems: CartItem[];
  onBack: () => void;
  onCartUpdate: (item: CartItem | null) => void;
}

export interface SavedAddress {
  id: string;
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  label: 'Home' | 'Work' | 'Other';
  isDefault: boolean;
}

export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  countryCode: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  billingName: string;
  billingAddress: string;
  billingCity: string;
  billingState: string;
  billingPincode: string;
  billingPhone: string;
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
  upiId: string;
  bankName: string;
}

export interface AddressData {
  name: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  label: 'Home' | 'Work' | 'Other';
  isDefault: boolean;
}

export interface Coupon {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
}

