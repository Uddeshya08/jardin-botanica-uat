"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Package, Lock, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { CheckoutPageProps, SavedAddress, FormData, AddressData, Coupon } from './checkout/types';
import { availableCoupons, paymentMethods, steps } from './checkout/constants';
import { populateAddressFields, loadSavedAddresses, saveAddress, calculateTotals } from './checkout/utils';
import { ProgressSteps } from './checkout/ProgressSteps';
import { ShippingStep } from './checkout/ShippingStep';
import { PaymentStep } from './checkout/PaymentStep';
import { ReviewStep } from './checkout/ReviewStep';
import { OrderSummary } from './checkout/OrderSummary';
import { usePathname, useRouter } from 'next/navigation';
import { useRazorpay, RazorpayOrderOptions } from 'react-razorpay';

export function CheckoutPage({ cartItems, onBack, onCartUpdate }: CheckoutPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const countryCode = (pathname?.split('/')?.[1] || 'in');
  const { Razorpay } = useRazorpay();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState<string>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');
  const [useDifferentBilling, setUseDifferentBilling] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddressData, setNewAddressData] = useState<AddressData>({
    name: '', addressLine1: '', addressLine2: '', city: '', 
    state: '', pincode: '', phone: '', label: 'Home', isDefault: false
  });
  const [newBillingData, setNewBillingData] = useState<AddressData>({
    name: '', addressLine1: '', addressLine2: '', city: '', 
    state: '', pincode: '', phone: '', label: 'Home', isDefault: false
  });
  const [formData, setFormData] = useState<FormData>({
    firstName: '', lastName: '', email: '', phone: '', countryCode: '+91',
    address: '', city: '', state: '', pincode: '',
    billingName: '', billingAddress: '', billingCity: '', billingState: '', billingPincode: '', billingPhone: '',
    cardNumber: '', cardName: '', expiryDate: '', cvv: '',
    upiId: '', bankName: ''
  });
  const [phoneError, setPhoneError] = useState('');
  const [pincodeError, setPincodeError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isEditingBillingAddress, setIsEditingBillingAddress] = useState(false);
  const [selectedBillingId, setSelectedBillingId] = useState<string>('');
  const [showBillingForm, setShowBillingForm] = useState(false);

  // Load saved addresses on mount
  useEffect(() => {
    const addresses = loadSavedAddresses();
    if (addresses.length > 0) {
      setSavedAddresses(addresses);
      if (addresses.length === 1) {
        setSelectedAddressId(addresses[0].id);
        const populated = populateAddressFields(addresses[0]);
        setFormData(prev => ({ ...prev, ...populated }));
      } else {
        const defaultAddress = addresses.find(addr => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id);
          const populated = populateAddressFields(defaultAddress);
          setFormData(prev => ({ ...prev, ...populated }));
        }
      }
    } else {
      setShowAddressForm(true);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let processedValue = value;

    // Format card number with spaces
    if (name === 'cardNumber') {
      const digitsOnly = value.replace(/\s/g, '');
      if (digitsOnly.length <= 16) {
        processedValue = digitsOnly.replace(/(\d{4})(?=\d)/g, '$1 ');
      } else {
        processedValue = formData.cardNumber; // Don't update if exceeds 16 digits
      }
    }

    // Format expiry date as MM/YY
    if (name === 'expiryDate') {
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length <= 4) {
        if (digitsOnly.length >= 2) {
          processedValue = digitsOnly.slice(0, 2) + '/' + digitsOnly.slice(2, 4);
        } else {
          processedValue = digitsOnly;
        }
      } else {
        processedValue = formData.expiryDate; // Don't update if exceeds 4 digits
      }
    }

    setFormData(prev => ({ ...prev, [name]: processedValue }));

    if (name === 'email') {
      if (value.length > 0) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          setEmailError('Please enter a valid email address');
        } else {
          setEmailError('');
        }
      } else {
        setEmailError('');
      }
    }

    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length > 0 && digitsOnly.length < 10) {
        setPhoneError('Please enter a 10-digit phone number');
      } else {
        setPhoneError('');
      }
    }

    if (name === 'pincode') {
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length === 6) {
        setPincodeError('');
      } else if (digitsOnly.length > 0) {
        setPincodeError('Invalid PIN code. Please enter 6 digits.');
      } else {
        setPincodeError('');
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
      setAppliedCoupon({ code, type: coupon.type, value: coupon.value });
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

  const handleSaveAddress = (address: SavedAddress) => {
    const updated = saveAddress(address);
    setSavedAddresses(updated);
    setSelectedAddressId(address.id);
    const populated = populateAddressFields(address);
    setFormData(prev => ({ ...prev, ...populated }));
    setNewAddressData({
      name: '', addressLine1: '', addressLine2: '', city: '', 
      state: '', pincode: '', phone: '', label: 'Home', isDefault: false
    });
    setShowAddressForm(false);
    toast.success('Address saved successfully');
  };

  const validateStep = (step: number) => {
    if (step === 1) {
      // Validate email address
      if (!formData.email) {
        toast.error('Please enter your email address');
        return false;
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error('Please enter a valid email address');
        return false;
      }
      
      // Validate address selection
      if (!selectedAddressId) {
        toast.error('Please select or add a shipping address');
        return false;
      }
      
      // Validate shipping information (populated from selected address or new address form)
      if (!formData.address || !formData.city || !formData.state || !formData.pincode) {
        toast.error('Please complete all shipping details');
        return false;
      }
    } else if (step === 2) {
      // Payment method selection is required
      if (!selectedPayment) {
        toast.error('Please select a payment method');
        return false;
      }
      // No need to validate payment details as they will be collected via Razorpay
      // Only COD is selected directly
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handlePlaceOrder = async () => {
    if (selectedPayment !== 'cod') {
      const rzpMethod = selectedPayment; // 'upi' | 'card' | 'netbanking' | 'wallet'
      try {
        // Prepare payload for backend Razorpay checkout
        const { total } = calculateTotals(cartItems, appliedCoupon)
        const checkoutRes = await fetch(`/api/razorpay/checkout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: Number(total),
            currency: 'INR',
            order_id: `temp_${Date.now()}`,
            receipt: `receipt_${Date.now()}`,
            customer_name: `${formData.firstName} ${formData.lastName}`.trim(),
            customer_email: formData.email,
            customer_contact: formData.phone,
            notes: {
              source: 'jardin-custom-ui',
            },
          }),
        })
        if (!checkoutRes.ok) {
          const err = await checkoutRes.json().catch(() => ({}))
          throw new Error(err?.error || 'Failed to create Razorpay order')
        }
        const { order, key_id } = await checkoutRes.json()

        const methodConfig: any = {
          method: {
            upi: rzpMethod === 'upi',
            card: rzpMethod === 'card',
            netbanking: rzpMethod === 'netbanking',
            wallet: rzpMethod === 'wallet',
          },
          config: { display: { sequence: [`block.${rzpMethod}`] } },
          upi: rzpMethod === 'upi' ? { flow: 'intent' } : undefined,
        }

        const options: RazorpayOrderOptions & any = {
          key: key_id,
          amount: order.amount,
          currency: order.currency,
          order_id: order.id,
          name: process.env.COMPANY_NAME ?? 'Jardin Botanica',
          description: `Order Payment`,
          ...methodConfig,
          prefill: {
            name: `${formData.firstName} ${formData.lastName}`.trim(),
            email: formData.email,
            contact: formData.phone,
          },
          handler: async (response: any) => {
            try {
              const verifyRes = await fetch(`/api/razorpay/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              })
              const verifyJson = await verifyRes.json()
              if (!verifyRes.ok || !verifyJson?.verified) {
                throw new Error(verifyJson?.error || 'Payment verification failed')
              }

              let cartId: string | null = null;

    if (typeof window !== 'undefined') {
      cartId = localStorage.getItem('medusa_cart_id');
    }

    if (!cartId) {
      throw new Error('Cart not found – cannot create order');
    }
    const completeRes = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/store/carts/${cartId}/complete`,
      {
        method: 'POST',
       headers: { 'Content-Type': 'application/json',
      'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
     },
    credentials: 'include', 
      }
    );

    const completeJson = await completeRes.json();
    const order = completeJson.order;

 // ✅ store order ids in localStorage as ARRAY
            if (typeof window !== 'undefined' && order?.id) {
              // also keep your single last order
              localStorage.setItem('last_order_id', order.id);

              const existingRaw = localStorage.getItem('medusa_order_ids');
              const existingIds = existingRaw ? JSON.parse(existingRaw) as string[] : [];
              // add + dedupe
              const updated = Array.from(new Set([...existingIds, order.id]));
              localStorage.setItem('medusa_order_ids', JSON.stringify(updated));
            }

    if (!completeRes.ok || !completeJson?.order) {
      throw new Error(completeJson?.message || 'Failed to create order in Medusa');
    }
              toast.success('Payment successful!')
              if (typeof window !== 'undefined') {
                import("@lib/util/local-cart").then(({ clearLocalCart }) => {
                  clearLocalCart();
                  window.dispatchEvent(new CustomEvent('localCartUpdated', { detail: { items: [] } }));
                })
              }
              router.push(`/in/profile`)
            } catch (e: any) {
              toast.error(e?.message || 'Verification failed')
            }
          },
          modal: {
            backdropclose: true,
            escape: true,
            handleback: true,
            confirm_close: true,
          },
          theme: { color: '#000000' },
        }

        const rzp = new (Razorpay as any)(options)
        rzp.open()
      } catch (e:any) {
        toast.error(e?.message || 'Payment start failed')
      }
      return
    }

    // COD flow (local)
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2500));
    setIsProcessing(false);
    toast.success('Order placed successfully! You will receive a confirmation email shortly.');
    if (typeof window !== 'undefined') {
      import("@lib/util/local-cart").then(({ clearLocalCart }) => {
        clearLocalCart();
        window.dispatchEvent(new CustomEvent('localCartUpdated', { detail: { items: [] } }));
      });
    }
    setTimeout(() => { onBack(); }, 1500);
  };

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: '#e3e3d8' }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-32 mb-8 lg:mb-12"
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
            <h1 className="font-american-typewriter text-xl sm:text-2xl md:text-3xl mb-2">Complete Your Order</h1>
            <p className="font-din-arabic text-xs sm:text-sm text-black/60">A few steps away from botanical bliss</p>
          </div>

          <ProgressSteps currentStep={currentStep} />
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-4 lg:space-y-6">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <ShippingStep
                  savedAddresses={savedAddresses}
                  selectedAddressId={selectedAddressId}
                  showAddressForm={showAddressForm}
                  useDifferentBilling={useDifferentBilling}
                  newAddressData={newAddressData}
                  newBillingData={newBillingData}
                  formData={formData}
                  emailError={emailError}
                  onSelectAddress={setSelectedAddressId}
                  onShowAddressForm={() => setShowAddressForm(true)}
                  onUpdateAddressData={(data) => setNewAddressData(prev => ({ ...prev, ...data }))}
                  onUpdateBillingData={(data) => setNewBillingData(prev => ({ ...prev, ...data }))}
                  onSaveAddress={handleSaveAddress}
                  onCancelAddressForm={() => {
                    setShowAddressForm(false);
                    setSelectedAddressId(savedAddresses.length > 0 ? savedAddresses[0].id : '');
                  }}
                  onSetUseDifferentBilling={setUseDifferentBilling}
                  onUpdateFormData={(data) => setFormData(prev => ({ ...prev, ...data }))}
                  onInputChange={handleInputChange}
                />
              )}

              {currentStep === 2 && (
                <PaymentStep
                  selectedPayment={selectedPayment}
                  formData={formData}
                  savedAddresses={savedAddresses}
                  selectedAddressId={selectedAddressId}
                  selectedBillingId={selectedBillingId}
                  isEditingBillingAddress={isEditingBillingAddress}
                  showBillingForm={showBillingForm}
                  newBillingData={newBillingData}
                  onSelectPayment={setSelectedPayment}
                  onUpdateFormData={(data) => setFormData(prev => ({ ...prev, ...data }))}
                  onInputChange={handleInputChange}
                  onSetSelectedAddressId={setSelectedAddressId}
                  onSetSelectedBillingId={setSelectedBillingId}
                  onSetIsEditingBillingAddress={setIsEditingBillingAddress}
                  onSetShowBillingForm={setShowBillingForm}
                  onSetNewBillingData={setNewBillingData}
                  onSetFormData={(data) => {
                    if (typeof data === 'function') {
                      setFormData(data);
                    } else {
                      setFormData(prev => ({ ...prev, ...data }));
                    }
                  }}
                />
              )}

              {currentStep === 3 && (
                <ReviewStep
                  formData={formData}
                  selectedPayment={selectedPayment}
                  cartItems={cartItems}
                  appliedCoupon={appliedCoupon}
                />
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
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
                  className="ml-auto px-8 py-4 bg-black text-white rounded-xl font-din-arabic disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl hover:shadow-2xl flex items-center space-x-3"
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
                      <span>Place Orders</span>
                      <Sparkles className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary (Sticky) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:sticky lg:top-28 h-fit"
          >
            <OrderSummary
              cartItems={cartItems}
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              appliedCoupon={appliedCoupon}
              couponError={couponError}
              onApplyCoupon={handleApplyCoupon}
              onRemoveCoupon={handleRemoveCoupon}
              selectedPayment={selectedPayment}
              onCartUpdate={onCartUpdate}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

