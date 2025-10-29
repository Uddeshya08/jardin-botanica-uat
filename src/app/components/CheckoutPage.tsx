"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  Wallet, 
  Banknote,
  ChevronLeft,
  Lock,
  Package,
  Truck,
  X,
  Check,
  MapPin,
  Mail,
  Phone,
  User,
  Home,
  Shield,
  Sparkles,
  Tag,
  Gift
} from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Separator } from './ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CheckoutPageProps {
  cartItems: CartItem[];
  onBack: () => void;
  onCartUpdate: (item: CartItem | null) => void;
}

const paymentMethods = [
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

const steps = [
  { id: 1, name: 'Shipping', icon: MapPin },
  { id: 2, name: 'Payment', icon: CreditCard },
  { id: 3, name: 'Review', icon: Check }
];

const countryCodes = [
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+1', country: 'USA', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+86', country: 'China', flag: '🇨🇳' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
];

// Location data by country
const locationData: Record<string, { states: string[], cities: string[] }> = {
  'India': {
    states: [
      'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
      'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
      'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
      'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
      'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh',
      'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh',
      'Lakshadweep', 'Puducherry'
    ],
    cities: [
      'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata', 'Surat',
      'Pune', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal',
      'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana',
      'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Kalyan-Dombivali', 'Vasai-Virar',
      'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar', 'Navi Mumbai', 'Allahabad',
      'Ranchi', 'Howrah', 'Coimbatore', 'Jabalpur', 'Gwalior', 'Vijayawada', 'Jodhpur',
      'Madurai', 'Raipur', 'Kota', 'Other'
    ]
  },
  'USA': {
    states: [
      'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
      'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
      'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
      'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
      'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
      'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
      'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
      'Wisconsin', 'Wyoming'
    ],
    cities: [
      'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio',
      'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'Fort Worth', 'Columbus',
      'Charlotte', 'San Francisco', 'Indianapolis', 'Seattle', 'Denver', 'Boston', 'Nashville',
      'Detroit', 'Portland', 'Las Vegas', 'Miami', 'Atlanta', 'Washington DC', 'Baltimore',
      'Minneapolis', 'Tampa', 'New Orleans', 'Orlando', 'Other'
    ]
  },
  'UK': {
    states: ['England', 'Scotland', 'Wales', 'Northern Ireland'],
    cities: [
      'London', 'Birmingham', 'Manchester', 'Glasgow', 'Liverpool', 'Edinburgh', 'Leeds',
      'Bristol', 'Cardiff', 'Sheffield', 'Newcastle', 'Belfast', 'Nottingham', 'Leicester',
      'Brighton', 'Plymouth', 'Southampton', 'Reading', 'Oxford', 'Cambridge', 'Aberdeen',
      'York', 'Exeter', 'Bath', 'Norwich', 'Other'
    ]
  },
  'Australia': {
    states: [
      'New South Wales', 'Victoria', 'Queensland', 'Western Australia', 'South Australia',
      'Tasmania', 'Australian Capital Territory', 'Northern Territory'
    ],
    cities: [
      'Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Canberra',
      'Newcastle', 'Wollongong', 'Logan City', 'Geelong', 'Hobart', 'Townsville', 'Cairns',
      'Darwin', 'Toowoomba', 'Ballarat', 'Bendigo', 'Launceston', 'Other'
    ]
  },
  'UAE': {
    states: ['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah'],
    cities: [
      'Dubai', 'Abu Dhabi', 'Sharjah', 'Al Ain', 'Ajman', 'Ras Al Khaimah', 'Fujairah',
      'Umm Al Quwain', 'Khor Fakkan', 'Dibba Al-Fujairah', 'Dhaid', 'Jebel Ali', 'Ruwais', 'Other'
    ]
  },
  'Singapore': {
    states: ['Central Region', 'East Region', 'North Region', 'North-East Region', 'West Region'],
    cities: [
      'Singapore', 'Jurong', 'Woodlands', 'Tampines', 'Bedok', 'Hougang', 'Choa Chu Kang',
      'Yishun', 'Bukit Batok', 'Sengkang', 'Punggol', 'Ang Mo Kio', 'Pasir Ris', 'Other'
    ]
  },
  'France': {
    states: [
      'Île-de-France', 'Auvergne-Rhône-Alpes', 'Nouvelle-Aquitaine', 'Occitanie', 'Hauts-de-France',
      'Provence-Alpes-Côte d\'Azur', 'Grand Est', 'Pays de la Loire', 'Brittany', 'Normandy',
      'Bourgogne-Franche-Comté', 'Centre-Val de Loire', 'Corsica'
    ],
    cities: [
      'Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier',
      'Bordeaux', 'Lille', 'Rennes', 'Reims', 'Saint-Étienne', 'Toulon', 'Le Havre', 'Grenoble',
      'Dijon', 'Angers', 'Nîmes', 'Villeurbanne', 'Other'
    ]
  },
  'Germany': {
    states: [
      'Baden-Württemberg', 'Bavaria', 'Berlin', 'Brandenburg', 'Bremen', 'Hamburg', 'Hesse',
      'Lower Saxony', 'Mecklenburg-Vorpommern', 'North Rhine-Westphalia', 'Rhineland-Palatinate',
      'Saarland', 'Saxony', 'Saxony-Anhalt', 'Schleswig-Holstein', 'Thuringia'
    ],
    cities: [
      'Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Dortmund',
      'Essen', 'Leipzig', 'Bremen', 'Dresden', 'Hanover', 'Nuremberg', 'Duisburg', 'Bochum',
      'Wuppertal', 'Bonn', 'Bielefeld', 'Mannheim', 'Other'
    ]
  },
  'China': {
    states: [
      'Beijing', 'Shanghai', 'Tianjin', 'Chongqing', 'Guangdong', 'Jiangsu', 'Shandong', 'Zhejiang',
      'Henan', 'Sichuan', 'Hubei', 'Hebei', 'Hunan', 'Anhui', 'Fujian', 'Shaanxi', 'Liaoning',
      'Jiangxi', 'Yunnan', 'Guangxi', 'Guizhou', 'Shanxi', 'Jilin', 'Gansu', 'Inner Mongolia',
      'Heilongjiang', 'Xinjiang', 'Ningxia', 'Hainan', 'Qinghai', 'Tibet'
    ],
    cities: [
      'Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Chengdu', 'Tianjin', 'Wuhan', 'Chongqing',
      'Hangzhou', 'Nanjing', 'Xi\'an', 'Shenyang', 'Harbin', 'Qingdao', 'Dalian', 'Jinan',
      'Changsha', 'Zhengzhou', 'Kunming', 'Changchun', 'Suzhou', 'Ningbo', 'Dongguan', 'Foshan', 'Other'
    ]
  },
  'Japan': {
    states: [
      'Hokkaido', 'Aomori', 'Iwate', 'Miyagi', 'Akita', 'Yamagata', 'Fukushima', 'Ibaraki',
      'Tochigi', 'Gunma', 'Saitama', 'Chiba', 'Tokyo', 'Kanagawa', 'Niigata', 'Toyama', 'Ishikawa',
      'Fukui', 'Yamanashi', 'Nagano', 'Gifu', 'Shizuoka', 'Aichi', 'Mie', 'Shiga', 'Kyoto', 'Osaka',
      'Hyogo', 'Nara', 'Wakayama', 'Tottori', 'Shimane', 'Okayama', 'Hiroshima', 'Yamaguchi',
      'Tokushima', 'Kagawa', 'Ehime', 'Kochi', 'Fukuoka', 'Saga', 'Nagasaki', 'Kumamoto', 'Oita',
      'Miyazaki', 'Kagoshima', 'Okinawa'
    ],
    cities: [
      'Tokyo', 'Yokohama', 'Osaka', 'Nagoya', 'Sapporo', 'Fukuoka', 'Kobe', 'Kyoto', 'Kawasaki',
      'Saitama', 'Hiroshima', 'Sendai', 'Chiba', 'Kitakyushu', 'Sakai', 'Niigata', 'Hamamatsu',
      'Kumamoto', 'Sagamihara', 'Shizuoka', 'Okayama', 'Kagoshima', 'Hachioji', 'Funabashi',
      'Kawaguchi', 'Other'
    ]
  }
};

export function CheckoutPage({ cartItems, onBack, onCartUpdate }: CheckoutPageProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState<string>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string, type: 'percentage' | 'fixed', value: number} | null>(null);
  const [couponError, setCouponError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    countryCode: '+91',
    address: '',
    city: '',
    state: '',
    pincode: '',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    upiId: '',
    bankName: ''
  });

  const [phoneError, setPhoneError] = useState('');
  const [pincodeError, setPincodeError] = useState('');
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [serviceabilityData, setServiceabilityData] = useState<any>(null);
  const [serviceabilityError, setServiceabilityError] = useState('');
  const [isServiceable, setIsServiceable] = useState(false);

  const currentCountry = countryCodes.find(c => c.code === formData.countryCode)?.country || 'India';
  const currentLocationData = locationData[currentCountry] || locationData['India'];

  const postalCodeConfig: Record<string, { label: string, maxLength: number, placeholder: string }> = {
    'India': { label: 'PIN Code', maxLength: 6, placeholder: 'Enter 6-digit PIN' },
    'USA': { label: 'ZIP Code', maxLength: 5, placeholder: 'Enter 5-digit ZIP' },
    'UK': { label: 'Postcode', maxLength: 8, placeholder: 'Enter postcode' },
    'Australia': { label: 'Postcode', maxLength: 4, placeholder: 'Enter 4-digit postcode' },
    'UAE': { label: 'Postal Code', maxLength: 5, placeholder: 'Enter postal code' },
    'Singapore': { label: 'Postal Code', maxLength: 6, placeholder: 'Enter 6-digit postal code' },
    'France': { label: 'Code Postal', maxLength: 5, placeholder: 'Enter 5-digit code' },
    'Germany': { label: 'Postleitzahl', maxLength: 5, placeholder: 'Enter 5-digit PLZ' },
    'China': { label: 'Postal Code', maxLength: 6, placeholder: 'Enter 6-digit code' },
    'Japan': { label: 'Postal Code', maxLength: 8, placeholder: 'Enter postal code' }
  };
  
  const currentPostalConfig = postalCodeConfig[currentCountry] || postalCodeConfig['India'];

  const availableCoupons = {
    'WELCOME10': { type: 'percentage' as const, value: 10, description: '10% off' },
    'SAVE20': { type: 'percentage' as const, value: 20, description: '20% off' },
    'JARDIN15': { type: 'percentage' as const, value: 15, description: '15% off' },
    'FIRST100': { type: 'fixed' as const, value: 100, description: '₹100 off' },
    'FLAT200': { type: 'fixed' as const, value: 200, description: '₹200 off' },
  };

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
  const tax = Math.round(discountedSubtotal * 0.18);
  const total = discountedSubtotal + shipping + tax;

  const checkDelhiveryPincode = async (pincode: string) => {
    if (!pincode || pincode.length !== 6) {
      return;
    }

    setPincodeLoading(true);
    setServiceabilityError('');
    
    try {
      console.log('Calling Delhivery serviceability API for pincode:', pincode);
      
      const response = await fetch(
        `/api/delhivery/serviceability?pincode=${pincode}`,
        {
          method: 'GET',
          cache: 'no-store',
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Delhivery API Error:', response.status, errorText);
        throw new Error(`Failed to check serviceability: ${response.status}`);
      }

      const data = await response.json();
      console.log('Delhivery serviceability data:', data);
      setServiceabilityData(data);
      
      // Check if delivery_codes array is empty or not serviceable
      if (!data.delivery_codes || data.delivery_codes.length === 0) {
        // Empty delivery_codes array - location not serviceable
        setIsServiceable(false);
        toast.error('❌ We do not deliver to this pincode area. Please try a different location.');
      } else if (data.delivery_codes?.[0]?.postal_code) {
        const postalCode = data.delivery_codes[0].postal_code;
        const serviceableStatus = postalCode.pickup === 'Y' && postalCode.repl === 'Y';
        setIsServiceable(serviceableStatus);
        
        if (serviceableStatus) {
          toast.success(`✅ Delivery available! COD: ${postalCode.cod === 'Y' ? 'Available' : 'Not Available'}, Prepaid: ${postalCode.pre_paid === 'Y' ? 'Available' : 'Not Available'}`);
        } else {
          toast.error('❌ Delivery not available to this pincode');
        }
      } else {
        setIsServiceable(false);
        toast.error('❌ Unable to verify serviceability for this pincode');
      }
    } catch (error) {
      console.error('Error checking Delhivery pincode:', error);
      setServiceabilityError('Failed to check serviceability');
      
      // Mark as not serviceable if API fails
      setIsServiceable(false);
      // Don't show error toast - just log it for development
      // The UI will still work for checkout, just without serviceability details
      console.log('Continuing without serviceability data...');
    } finally {
      setPincodeLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length > 0 && digitsOnly.length < 10) {
        setPhoneError('Please enter a 10-digit phone number');
      } else {
        setPhoneError('');
      }
    }

    if (name === 'pincode') {
      const country = countryCodes.find(c => c.code === formData.countryCode)?.country || 'India';
      const postalCodeLengths: Record<string, number> = {
        'India': 6, 'USA': 5, 'UK': 6, 'Australia': 4, 'UAE': 5,
        'Singapore': 6, 'France': 5, 'Germany': 5, 'China': 6, 'Japan': 7
      };
      
      const expectedLength = postalCodeLengths[country] || 6;
      const digitsOnly = value.replace(/\D/g, '');
      
      if (digitsOnly.length === expectedLength) {
        setPincodeError('');
        // Check serviceability for Indian pincodes
        if (country === 'India' && digitsOnly.length === 6) {
          checkDelhiveryPincode(digitsOnly);
        }
      } else if (digitsOnly.length > 0) {
        setPincodeError('Invalid postal code.');
      } else {
        setPincodeError('');
        setServiceabilityData(null);
        setIsServiceable(false);
      }
    }
  };

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    
    if (!code) {
      setCouponError('Please enter a coupon code');
      return;
    }

    const coupon = availableCoupons[code as keyof typeof availableCoupons];
    
    if (coupon) {
      setAppliedCoupon({ code: code, type: coupon.type, value: coupon.value });
      setCouponError('');
      toast.success(`Coupon "${code}" applied successfully!`);
    } else {
      setCouponError('Invalid coupon code');
      toast.error('Invalid coupon code');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
    toast.success('Coupon removed');
  };

  const handleQuantityChange = (item: CartItem, change: number) => {
    const newQuantity = item.quantity + change;
    if (newQuantity > 0 && newQuantity <= 10) {
      onCartUpdate({ ...item, quantity: newQuantity });
    } else if (newQuantity === 0) {
      onCartUpdate({ ...item, quantity: 0 });
    }
  };

  const handleRemoveItem = (item: CartItem) => {
    onCartUpdate({ ...item, quantity: 0 });
  };

  const validateStep = (step: number) => {
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.email || 
          !formData.phone || !formData.address || !formData.city || 
          !formData.state || !formData.pincode) {
        toast.error('Please fill in all shipping details');
        return false;
      }
      
      // Check if pincode is serviceable (only for Indian pincodes)
      const country = countryCodes.find(c => c.code === formData.countryCode)?.country || 'India';
      if (country === 'India' && formData.pincode.length === 6) {
        // Check if we have checked serviceability
        if (serviceabilityData !== null && !isServiceable) {
          toast.error('Delivery is not available to this pincode. Please enter a different pincode.');
          return false;
        }
        // If pincode is entered but serviceability data is loading, don't allow proceeding
        if (pincodeLoading) {
          toast.error('Please wait for serviceability check to complete.');
          return false;
        }
      }
    } else if (step === 2) {
      if (selectedPayment === 'card') {
        if (!formData.cardNumber || !formData.cardName || !formData.expiryDate || !formData.cvv) {
          toast.error('Please fill in all card details');
          return false;
        }
      } else if (selectedPayment === 'upi') {
        if (!formData.upiId) {
          toast.error('Please enter your UPI ID');
          return false;
        }
      } else if (selectedPayment === 'netbanking') {
        if (!formData.bankName) {
          toast.error('Please select your bank');
          return false;
        }
      }
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2500));
    setIsProcessing(false);
    toast.success('Order placed successfully! You will receive a confirmation email shortly.');
    
    // Clear cart from localStorage after successful order
    if (typeof window !== 'undefined') {
      import("@lib/util/local-cart").then(({ clearLocalCart }) => {
        clearLocalCart();
        // Dispatch event to notify other components
        window.dispatchEvent(new CustomEvent('localCartUpdated', {
          detail: { items: [] }
        }));
      });
    }
    
    setTimeout(() => {
      onBack();
    }, 1500);
  };

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: '#e3e3d8' }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-32 mb-12"
        >
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={onBack}
            className="flex items-center space-x-2 mb-8 group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-din-arabic">Continue Shopping</span>
          </motion.button>

          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-black/10 backdrop-blur-sm mb-4"
            >
              <Package className="w-8 h-8" />
            </motion.div>
            <h1 className="font-american-typewriter mb-2">Complete Your Order</h1>
            <p className="font-din-arabic text-black/60">A few steps away from botanical bliss</p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex flex-col items-center flex-1"
                  >
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.2 }}
                      className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                        currentStep > step.id
                          ? 'bg-black text-white'
                          : currentStep === step.id
                          ? 'bg-white/80 backdrop-blur-sm shadow-lg'
                          : 'bg-white/40 backdrop-blur-sm'
                      }`}
                    >
                      {currentStep > step.id ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Check className="w-5 h-5" />
                        </motion.div>
                      ) : (
                        <step.icon className="w-5 h-5" />
                      )}
                    </motion.div>
                    <span className={`font-din-arabic text-xs mt-2 transition-colors duration-300 ${
                      currentStep >= step.id ? 'text-black' : 'text-black/40'
                    }`}>
                      {step.name}
                    </span>
                  </motion.div>
                  
                  {index < steps.length - 1 && (
                    <div className="flex-1 h-px bg-black/10 mx-2 relative overflow-hidden">
                      <motion.div
                        className="absolute inset-0 bg-black"
                        initial={{ width: '0%' }}
                        animate={{ width: currentStep > step.id ? '100%' : '0%' }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/60 backdrop-blur-md rounded-3xl p-8 border border-white/80 shadow-xl"
                >
                  <div className="flex items-center space-x-3 mb-8">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      className="w-12 h-12 rounded-2xl bg-gradient-to-br from-black/10 to-black/5 flex items-center justify-center"
                    >
                      <MapPin className="w-6 h-6" />
                    </motion.div>
                    <div>
                      <h2 className="font-american-typewriter">Shipping Information</h2>
                      <p className="font-din-arabic text-sm text-black/60">Where shall we send your order?</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <Label htmlFor="firstName" className="font-din-arabic mb-2 block flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span>First Name</span>
                        </Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="bg-white/80 border-black/10 focus:border-black/30 transition-all duration-300 placeholder:text-black/30"
                          placeholder="Enter first name"
                        />
                      </motion.div>
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                        <Label htmlFor="lastName" className="font-din-arabic mb-2 block flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span>Last Name</span>
                        </Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="bg-white/80 border-black/10 focus:border-black/30 transition-all duration-300 placeholder:text-black/30"
                          placeholder="Enter last name"
                        />
                      </motion.div>
                    </div>

                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                      <Label htmlFor="email" className="font-din-arabic mb-2 block flex items-center space-x-2">
                        <Mail className="w-4 h-4" />
                        <span>Email Address</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="bg-white/80 border-black/10 focus:border-black/30 transition-all duration-300 placeholder:text-black/30"
                        placeholder="your@email.com"
                      />
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                      <Label htmlFor="phone" className="font-din-arabic mb-2 block flex items-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span>Phone Number</span>
                      </Label>
                      <div className="flex space-x-2">
                        <Select
                          value={formData.countryCode}
                          onValueChange={(value: string) => {
                            setFormData(prev => ({ ...prev, countryCode: value, city: '', state: '' }));
                          }}
                        >
                          <SelectTrigger className="w-32 bg-white/80 border-black/10 focus:border-black/30 transition-all duration-300 font-din-arabic">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {countryCodes.map((country) => (
                              <SelectItem key={country.code} value={country.code} className="font-din-arabic">
                                <span className="flex items-center space-x-2">
                                  <span>{country.flag}</span>
                                  <span>{country.code}</span>
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="flex-1">
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="bg-white/80 border-black/10 focus:border-black/30 transition-all duration-300 placeholder:text-black/30"
                            placeholder="XXXXX XXXXX"
                          />
                          {phoneError && (
                            <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="font-din-arabic text-xs text-red-600 mt-1">
                              {phoneError}
                            </motion.p>
                          )}
                        </div>
                      </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                      <Label htmlFor="address" className="font-din-arabic mb-2 block flex items-center space-x-2">
                        <Home className="w-4 h-4" />
                        <span>Street Address</span>
                      </Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="bg-white/80 border-black/10 focus:border-black/30 transition-all duration-300 placeholder:text-black/30"
                        placeholder="House no., Street, Locality"
                      />
                    </motion.div>

                    <div className="grid grid-cols-2 gap-4">
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                        <Label htmlFor="city" className="font-din-arabic mb-2 block">City</Label>
                        <Select value={formData.city} onValueChange={(value: string) => setFormData(prev => ({ ...prev, city: value }))}>
                          <SelectTrigger className="bg-white/80 border-black/10 focus:border-black/30 transition-all duration-300 font-din-arabic">
                            <SelectValue placeholder="Select city" className="placeholder:text-black/30" />
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                            {currentLocationData.cities.map((city) => (
                              <SelectItem key={city} value={city} className="font-din-arabic">{city}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </motion.div>
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                        <Label htmlFor="state" className="font-din-arabic mb-2 block">State</Label>
                        <Select value={formData.state} onValueChange={(value: string) => setFormData(prev => ({ ...prev, state: value }))}>
                          <SelectTrigger className="bg-white/80 border-black/10 focus:border-black/30 transition-all duration-300 font-din-arabic">
                            <SelectValue placeholder="Select state" className="placeholder:text-black/30" />
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                            {currentLocationData.states.map((state) => (
                              <SelectItem key={state} value={state} className="font-din-arabic">{state}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </motion.div>
                    </div>

                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
                      <Label htmlFor="pincode" className="font-din-arabic mb-2 block">{currentPostalConfig.label}</Label>
                      <div className="relative">
                        <Input
                          id="pincode"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          className="bg-white/80 border-black/10 focus:border-black/30 transition-all duration-300 placeholder:text-black/30"
                          maxLength={currentPostalConfig.maxLength}
                          placeholder={currentPostalConfig.placeholder}
                        />
                        {pincodeLoading && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <div className="w-4 h-4 border-2 border-black/30 border-t-black/70 rounded-full animate-spin"></div>
                          </div>
                        )}
                      </div>
                      {pincodeError && (
                        <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="font-din-arabic text-xs text-red-600 mt-1">
                          {pincodeError}
                        </motion.p>
                      )}
                      {serviceabilityData && !pincodeError && (
                        serviceabilityData.delivery_codes && serviceabilityData.delivery_codes.length > 0 ? (
                          <motion.div 
                            initial={{ opacity: 0, y: -5 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            className="mt-3 p-4 bg-white/60 rounded-lg border border-white/80"
                          >
                            <div className="flex items-start gap-2">
                              <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                              <div className="flex-1">
                                <h4 className="font-din-arabic-bold text-sm text-black">Serviceability Details</h4>
                              {(() => {
                                const pc = serviceabilityData.delivery_codes[0].postal_code;
                                const isServiceable = pc.pickup === 'Y' && pc.repl === 'Y';
                                return (
                                  <div className="mt-2 space-y-1">
                                    <div className="flex justify-between items-center">
                                      <span className="font-din-arabic text-xs text-black/60">City:</span>
                                      <span className="font-din-arabic text-xs text-black">{pc.city}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <span className="font-din-arabic text-xs text-black/60">District:</span>
                                      <span className="font-din-arabic text-xs text-black">{pc.district}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <span className="font-din-arabic text-xs text-black/60">State:</span>
                                      <span className="font-din-arabic text-xs text-black">{pc.state_code}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <span className="font-din-arabic text-xs text-black/60">COD Available:</span>
                                      <span className={`font-din-arabic text-xs ${pc.cod === 'Y' ? 'text-green-600' : 'text-red-600'}`}>
                                        {pc.cod === 'Y' ? 'Yes' : 'No'}
                                      </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <span className="font-din-arabic text-xs text-black/60">Prepaid:</span>
                                      <span className={`font-din-arabic text-xs ${pc.pre_paid === 'Y' ? 'text-green-600' : 'text-red-600'}`}>
                                        {pc.pre_paid === 'Y' ? 'Yes' : 'No'}
                                      </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <span className="font-din-arabic text-xs text-black/60">Pickup:</span>
                                      <span className={`font-din-arabic text-xs ${pc.pickup === 'Y' ? 'text-green-600' : 'text-red-600'}`}>
                                        {pc.pickup === 'Y' ? 'Available' : 'Not Available'}
                                      </span>
                                    </div>
                                    {isServiceable && (
                                      <div className="mt-2 pt-2 border-t border-black/10">
                                        <p className="font-din-arabic text-xs text-green-600">✅ Delivery is available to this location</p>
                                      </div>
                                    )}
                                  </div>
                                );
                              })()}
                            </div>
                          </div>
                        </motion.div>
                        ) : (
                          <motion.div 
                            initial={{ opacity: 0, y: -5 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            className="mt-3 p-4 bg-red-50/80 rounded-lg border border-red-200"
                          >
                            <div className="flex items-start gap-2">
                              <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                              <div className="flex-1">
                                <h4 className="font-din-arabic-bold text-sm text-red-600">Delivery Not Available</h4>
                                <p className="font-din-arabic text-xs text-red-600 mt-1">
                                  We do not deliver to this pincode area. Please enter a different pincode to continue.
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 border border-white/80 shadow-xl">
                    <div className="flex items-center space-x-3 mb-8">
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                        className="w-12 h-12 rounded-2xl bg-gradient-to-br from-black/10 to-black/5 flex items-center justify-center"
                      >
                        <Lock className="w-6 h-6" />
                      </motion.div>
                      <div>
                        <h2 className="font-american-typewriter">Payment Method</h2>
                        <p className="font-din-arabic text-sm text-black/60">Choose your preferred payment option</p>
                      </div>
                    </div>

                    <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment}>
                      <div className="grid gap-4">
                        {paymentMethods.map((method, index) => (
                          <motion.div
                            key={method.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className={`relative flex items-center space-x-4 p-5 rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden ${
                              selectedPayment === method.id
                                ? 'bg-white shadow-lg'
                                : 'bg-white/40 hover:bg-white/60 hover:shadow-md'
                            }`}
                            onClick={() => setSelectedPayment(method.id)}
                          >
                            <motion.div
                              className="absolute inset-0 opacity-0"
                              style={{ background: `linear-gradient(135deg, ${method.color}15, transparent)` }}
                              animate={{ opacity: selectedPayment === method.id ? 1 : 0 }}
                              transition={{ duration: 0.3 }}
                            />
                            
                            <RadioGroupItem value={method.id} id={method.id} className="sr-only" />
                            <div 
                              className="w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300"
                              style={{ backgroundColor: selectedPayment === method.id ? `${method.color}20` : 'rgba(0,0,0,0.05)' }}
                            >
                              <method.icon 
                                className="w-7 h-7" 
                                style={{ color: selectedPayment === method.id ? method.color : 'currentColor' }}
                              />
                            </div>
                            <div className="flex-1 relative z-10">
                              <p className="font-din-arabic-bold">{method.name}</p>
                              <p className="font-din-arabic text-sm text-black/60">{method.description}</p>
                            </div>
                            <AnimatePresence>
                              {selectedPayment === method.id && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  exit={{ scale: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="w-7 h-7 rounded-full flex items-center justify-center"
                                  style={{ backgroundColor: method.color }}
                                >
                                  <Check className="w-4 h-4 text-white" />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  <AnimatePresence mode="wait">
                    {selectedPayment === 'card' && (
                      <motion.div
                        key="card-details"
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white/60 backdrop-blur-md rounded-3xl p-8 border border-white/80 shadow-xl"
                      >
                        <h3 className="font-american-typewriter mb-6 flex items-center space-x-2">
                          <Shield className="w-5 h-5" />
                          <span>Card Details</span>
                        </h3>
                        <div className="space-y-5">
                          <div>
                            <Label htmlFor="cardNumber" className="font-din-arabic mb-2 block">Card Number</Label>
                            <Input
                              id="cardNumber"
                              name="cardNumber"
                              placeholder="1234 5678 9012 3456"
                              value={formData.cardNumber}
                              onChange={handleInputChange}
                              className="bg-white/80 border-black/10 focus:border-black/30 transition-all duration-300 placeholder:text-black/30"
                              maxLength={19}
                            />
                          </div>
                          <div>
                            <Label htmlFor="cardName" className="font-din-arabic mb-2 block">Cardholder Name</Label>
                            <Input
                              id="cardName"
                              name="cardName"
                              placeholder="Name on card"
                              value={formData.cardName}
                              onChange={handleInputChange}
                              className="bg-white/80 border-black/10 focus:border-black/30 transition-all duration-300 placeholder:text-black/30"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="expiryDate" className="font-din-arabic mb-2 block">Expiry Date</Label>
                              <Input
                                id="expiryDate"
                                name="expiryDate"
                                placeholder="MM/YY"
                                value={formData.expiryDate}
                                onChange={handleInputChange}
                                className="bg-white/80 border-black/10 focus:border-black/30 transition-all duration-300 placeholder:text-black/30"
                                maxLength={5}
                              />
                            </div>
                            <div>
                              <Label htmlFor="cvv" className="font-din-arabic mb-2 block">CVV</Label>
                              <Input
                                id="cvv"
                                name="cvv"
                                placeholder="123"
                                type="password"
                                value={formData.cvv}
                                onChange={handleInputChange}
                                className="bg-white/80 border-black/10 focus:border-black/30 transition-all duration-300 placeholder:text-black/30"
                                maxLength={4}
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {selectedPayment === 'upi' && (
                      <motion.div
                        key="upi-details"
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white/60 backdrop-blur-md rounded-3xl p-8 border border-white/80 shadow-xl"
                      >
                        <h3 className="font-american-typewriter mb-6 flex items-center space-x-2">
                          <Smartphone className="w-5 h-5" />
                          <span>UPI Details</span>
                        </h3>
                        <div>
                          <Label htmlFor="upiId" className="font-din-arabic mb-2 block">UPI ID</Label>
                          <Input
                            id="upiId"
                            name="upiId"
                            placeholder="yourname@upi"
                            value={formData.upiId}
                            onChange={handleInputChange}
                            className="bg-white/80 border-black/10 focus:border-black/30 transition-all duration-300 placeholder:text-black/30"
                          />
                          <p className="font-din-arabic text-sm text-black/60 mt-3 flex items-start space-x-2">
                            <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>Enter your UPI ID to complete the payment securely</span>
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {selectedPayment === 'netbanking' && (
                      <motion.div
                        key="netbanking-details"
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white/60 backdrop-blur-md rounded-3xl p-8 border border-white/80 shadow-xl"
                      >
                        <h3 className="font-american-typewriter mb-6 flex items-center space-x-2">
                          <Building2 className="w-5 h-5" />
                          <span>Select Your Bank</span>
                        </h3>
                        <div>
                          <Label htmlFor="bankName" className="font-din-arabic mb-2 block">Bank Name</Label>
                          <Input
                            id="bankName"
                            name="bankName"
                            placeholder="Select or type your bank name"
                            value={formData.bankName}
                            onChange={handleInputChange}
                            className="bg-white/80 border-black/10 focus:border-black/30 transition-all duration-300 placeholder:text-black/30"
                          />
                          <p className="font-din-arabic text-sm text-black/60 mt-3">
                            You will be redirected to your bank's secure page
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {selectedPayment === 'wallet' && (
                      <motion.div
                        key="wallet-details"
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white/60 backdrop-blur-md rounded-3xl p-8 border border-white/80 shadow-xl"
                      >
                        <h3 className="font-american-typewriter mb-6 flex items-center space-x-2">
                          <Wallet className="w-5 h-5" />
                          <span>Select Wallet</span>
                        </h3>
                        <div className="grid grid-cols-3 gap-3">
                          {['Paytm', 'PhonePe', 'Amazon Pay', 'Mobikwik', 'Freecharge', 'Airtel Money'].map((wallet, index) => (
                            <motion.button
                              key={wallet}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.05 }}
                              whileHover={{ scale: 1.05, y: -2 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-4 bg-white/80 hover:bg-white rounded-xl border border-black/10 hover:border-black/20 transition-all shadow-sm hover:shadow-md"
                            >
                              <p className="font-din-arabic text-sm">{wallet}</p>
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {selectedPayment === 'cod' && (
                      <motion.div
                        key="cod-details"
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white/60 backdrop-blur-md rounded-3xl p-8 border border-white/80 shadow-xl"
                      >
                        <h3 className="font-american-typewriter mb-4 flex items-center space-x-2">
                          <Banknote className="w-5 h-5" />
                          <span>Cash on Delivery</span>
                        </h3>
                        <p className="font-din-arabic text-black/70 mb-4">
                          Pay with cash when your order is delivered. Please keep exact change ready.
                        </p>
                        <div className="p-4 bg-amber-50/80 border border-amber-200/80 rounded-xl backdrop-blur-sm">
                          <p className="font-din-arabic text-sm text-amber-900/80 flex items-start space-x-2">
                            <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>Additional ₹50 COD handling charges will be added to your order.</span>
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/60 backdrop-blur-md rounded-3xl p-8 border border-white/80 shadow-xl"
                >
                  <div className="flex items-center space-x-3 mb-8">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, rgba(229, 138, 77, 0.2), rgba(229, 138, 77, 0.1))' }}
                    >
                      <Check className="w-6 h-6" style={{ color: '#e58a4d' }} />
                    </motion.div>
                    <div>
                      <h2 className="font-american-typewriter">Review Your Order</h2>
                      <p className="font-din-arabic text-sm text-black/60">Everything looks good?</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="p-6 bg-white/50 rounded-2xl border border-black/10">
                      <h3 className="font-din-arabic-bold mb-4 flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>Shipping Details</span>
                      </h3>
                      <div className="space-y-2 font-din-arabic text-sm">
                        <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
                        <p><strong>Email:</strong> {formData.email}</p>
                        <p><strong>Phone:</strong> {formData.countryCode} {formData.phone}</p>
                        <p><strong>Address:</strong> {formData.address}, {formData.city}, {formData.state} - {formData.pincode}</p>
                      </div>
                    </div>

                    <div className="p-6 bg-white/50 rounded-2xl border border-black/10">
                      <h3 className="font-din-arabic-bold mb-4 flex items-center space-x-2">
                        <CreditCard className="w-4 h-4" />
                        <span>Payment Method</span>
                      </h3>
                      <p className="font-din-arabic text-sm">
                        {paymentMethods.find(m => m.id === selectedPayment)?.name}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between pt-4">
              {currentStep > 1 && (
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.02, x: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="px-8 py-3 bg-white/60 backdrop-blur-sm border-2 border-black/10 hover:border-black/20 rounded-xl font-din-arabic transition-all shadow-sm hover:shadow-md flex items-center space-x-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </motion.button>
              )}
              
              {currentStep < 3 ? (
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNextStep}
                  className="ml-auto px-8 py-3 bg-black text-white rounded-xl font-din-arabic transition-all shadow-lg hover:shadow-xl flex items-center space-x-2"
                >
                  <span>Continue</span>
                  <ChevronLeft className="w-4 h-4 rotate-180" />
                </motion.button>
              ) : (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePlaceOrder}
                  disabled={isProcessing || cartItems.length === 0}
                  className="ml-auto px-8 py-4 bg-gradient-to-r from-black to-gray-800 text-white rounded-xl font-din-arabic disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl hover:shadow-2xl flex items-center space-x-3"
                >
                  {isProcessing ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      <span>Place Secure Order</span>
                      <Sparkles className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:sticky lg:top-28 h-fit"
          >
            <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 border border-white/80 shadow-xl">
              <h2 className="font-american-typewriter mb-6 flex items-center space-x-2">
                <Package className="w-5 h-5" />
                <span>Order Summary</span>
              </h2>

              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto scrollbar-hide">
                {cartItems.map((item, index) => (
                  <motion.div 
                    key={item.id} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-4 p-4 bg-white/60 rounded-xl border border-white/80 group hover:shadow-lg transition-all duration-300"
                  >
                    {item.image && (
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        transition={{ duration: 0.2 }}
                        className="relative overflow-hidden rounded-lg"
                      >
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-20 h-20 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-din-arabic-bold truncate">{item.name}</p>
                      <p className="font-din-arabic text-sm text-black/60">₹{item.price}</p>
                      <div className="flex items-center space-x-2 mt-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleQuantityChange(item, -1)}
                          className="w-7 h-7 rounded-lg bg-black/10 hover:bg-black/20 flex items-center justify-center transition-colors"
                        >
                          <span className="font-din-arabic text-sm">-</span>
                        </motion.button>
                        <span className="font-din-arabic text-sm w-8 text-center">{item.quantity}</span>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleQuantityChange(item, 1)}
                          className="w-7 h-7 rounded-lg bg-black/10 hover:bg-black/20 flex items-center justify-center transition-colors"
                        >
                          <span className="font-din-arabic text-sm">+</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleRemoveItem(item)}
                          className="ml-auto text-black/40 hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Separator className="my-6 bg-black/10" />

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                {!appliedCoupon ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Tag className="w-4 h-4 text-black/50" />
                      <Label className="font-din-arabic text-sm text-black/70">Have a coupon code?</Label>
                    </div>
                    <div className="flex space-x-2">
                      <Input
                        value={couponCode}
                        onChange={(e) => {
                          setCouponCode(e.target.value.toUpperCase());
                          setCouponError('');
                        }}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleApplyCoupon();
                          }
                        }}
                        placeholder="Enter code"
                        className="flex-1 bg-white/60 border-black/20 font-din-arabic focus:border-black transition-all placeholder:text-black/30"
                        style={{ letterSpacing: '0.1em' }}
                      />
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleApplyCoupon}
                        className="px-6 py-2 bg-black text-white rounded-lg font-din-arabic text-sm hover:bg-black/90 transition-colors"
                        style={{ letterSpacing: '0.1em' }}
                      >
                        Apply
                      </motion.button>
                    </div>
                    {couponError && (
                      <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="font-din-arabic text-xs text-red-600">
                        {couponError}
                      </motion.p>
                    )}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="mt-4 p-3 bg-black/5 border rounded-lg"
                      style={{ borderColor: '#D8D2C7' }}
                    >
                      <div className="flex items-start space-x-2">
                        <Gift className="w-4 h-4 text-black/50 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-din-arabic text-xs text-black/60 mb-1" style={{ letterSpacing: '0.1em' }}>Available Codes:</p>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(availableCoupons).slice(0, 2).map(([code]) => (
                              <motion.button
                                key={code}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                  setCouponCode(code);
                                  setCouponError('');
                                }}
                                className="px-2 py-1 bg-white/80 border rounded text-xs font-din-arabic-bold text-black hover:bg-black hover:text-white transition-colors"
                                style={{ borderColor: '#D8D2C7', letterSpacing: '0.05em' }}
                              >
                                {code}
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 rounded-xl border"
                    style={{ 
                      background: 'linear-gradient(135deg, rgba(229, 138, 77, 0.15), rgba(229, 138, 77, 0.08))',
                      borderColor: 'rgba(229, 138, 77, 0.3)'
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <motion.div
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 0.5 }}
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: '#e58a4d' }}
                        >
                          <Check className="w-5 h-5 text-white" />
                        </motion.div>
                        <div>
                          <p className="font-din-arabic-bold text-sm" style={{ color: '#a85e35' }}>{appliedCoupon.code}</p>
                          <p className="font-din-arabic text-xs" style={{ color: '#c67447' }}>
                            {appliedCoupon.type === 'percentage' 
                              ? `${appliedCoupon.value}% discount applied` 
                              : `₹${appliedCoupon.value} discount applied`}
                          </p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleRemoveCoupon}
                        className="p-2 rounded-lg transition-colors"
                        style={{ backgroundColor: 'transparent' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(229, 138, 77, 0.15)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <X className="w-4 h-4" style={{ color: '#c67447' }} />
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              <Separator className="my-6 bg-black/10" />

              <div className="space-y-3">
                <div className="flex justify-between font-din-arabic">
                  <span className="text-black/70">Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                {appliedCoupon && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex justify-between font-din-arabic"
                  >
                    <span style={{ color: '#e58a4d' }}>Discount ({appliedCoupon.code})</span>
                    <span style={{ color: '#e58a4d' }}>-₹{discount}</span>
                  </motion.div>
                )}
                <div className="flex justify-between font-din-arabic">
                  <span className="text-black/70">Shipping</span>
                  <span style={shipping === 0 ? { color: '#e58a4d' } : {}}>
                    {shipping === 0 ? 'Complimentary' : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between font-din-arabic">
                  <span className="text-black/70">Tax (GST 18%)</span>
                  <span>₹{tax}</span>
                </div>
                {selectedPayment === 'cod' && (
                  <div className="flex justify-between font-din-arabic">
                    <span className="text-black/70">COD Charges</span>
                    <span>₹50</span>
                  </div>
                )}
                
                <Separator className="my-4 bg-black/10" />
                
                <motion.div 
                  className="flex justify-between font-american-typewriter p-4 bg-white/50 rounded-xl"
                  whileHover={{ scale: 1.02 }}
                >
                  <span>Total</span>
                  <span>₹{selectedPayment === 'cod' ? total + 50 : total}</span>
                </motion.div>
              </div>

              {shipping === 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 rounded-xl flex items-start space-x-3 border"
                  style={{ 
                    background: 'linear-gradient(135deg, rgba(229, 138, 77, 0.15), rgba(229, 138, 77, 0.08))',
                    borderColor: 'rgba(229, 138, 77, 0.3)'
                  }}
                >
                  <Truck className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#e58a4d' }} />
                  <p className="font-din-arabic text-sm" style={{ color: '#a85e35' }}>
                    Your order qualifies for complimentary shipping
                  </p>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-black/5 rounded-xl flex items-center justify-center space-x-2"
              >
                <Shield className="w-4 h-4 text-black/50" />
                <p className="font-din-arabic text-xs text-black/50">
                  Secure & Encrypted Payment
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

