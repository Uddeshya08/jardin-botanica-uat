"use client";

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Banknote, Shield, Check, Sparkles, Plus } from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { paymentMethods, indianStates, indianCities } from './constants';
import { FormData, SavedAddress, AddressData } from './types';
import { populateAddressFields } from './utils';
import { toast } from 'sonner';

interface PaymentStepProps {
  selectedPayment: string;
  formData: FormData;
  savedAddresses: SavedAddress[];
  selectedAddressId: string;
  selectedBillingId: string;
  isEditingBillingAddress: boolean;
  showBillingForm: boolean;
  newBillingData: AddressData;
  onSelectPayment: (paymentId: string) => void;
  onUpdateFormData: (data: Partial<FormData>) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSetSelectedAddressId: (id: string) => void;
  onSetSelectedBillingId: (id: string) => void;
  onSetIsEditingBillingAddress: (editing: boolean) => void;
  onSetShowBillingForm: (show: boolean) => void;
  onSetNewBillingData: (data: AddressData | ((prev: AddressData) => AddressData)) => void;
  onSetFormData: (data: Partial<FormData> | ((prev: FormData) => FormData)) => void;
}

export function PaymentStep({
  selectedPayment,
  formData,
  savedAddresses,
  selectedAddressId,
  selectedBillingId,
  isEditingBillingAddress,
  showBillingForm,
  newBillingData,
  onSelectPayment,
  onUpdateFormData,
  onInputChange,
  onSetSelectedAddressId,
  onSetSelectedBillingId,
  onSetIsEditingBillingAddress,
  onSetShowBillingForm,
  onSetNewBillingData,
  onSetFormData
}: PaymentStepProps) {
  return (
    <motion.div
      key="payment"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 lg:space-y-6"
    >
      {/* Payment Method Selection */}
      <div className="bg-white/60 backdrop-blur-md rounded-2xl md:rounded-3xl p-4 md:p-8 border border-white/80 shadow-xl">
        <div className="flex items-center space-x-3 mb-6 md:mb-8">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-black/10 to-black/5 flex items-center justify-center"
          >
            <Lock className="w-6 h-6" />
          </motion.div>
          <div>
            <h2 className="font-american-typewriter text-xl sm:text-2xl md:text-3xl">Payment Method</h2>
            <p className="font-din-arabic text-xs sm:text-sm text-black/60">Choose Your Preferred Payment Option</p>
          </div>
        </div>
        <RadioGroup value={selectedPayment} onValueChange={onSelectPayment}>
          <div className="grid gap-4">
            {paymentMethods.map((method, index) => {
              const Icon = method.icon;
              const isSelected = selectedPayment === method.id;
              return (
                <motion.div
                  key={method.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={`relative flex items-center space-x-4 p-5 rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden ${
                    isSelected
                      ? 'bg-white shadow-lg'
                      : 'bg-white/40 hover:bg-white/60 hover:shadow-md'
                  }`}
                  onClick={() => onSelectPayment(method.id)}
                >
                  {/* Animated background gradient */}
                  <motion.div
                    className="absolute inset-0 opacity-0"
                    style={{ background: `linear-gradient(135deg, #05966915, transparent)` }}
                    animate={{ opacity: isSelected ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  <RadioGroupItem value={method.id} id={method.id} className="sr-only" />
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300"
                    style={{ 
                      backgroundColor: isSelected ? `#05966920` : 'rgba(0,0,0,0.05)'
                    }}
                  >
                    <Icon 
                      className="w-7 h-7" 
                      style={{ color: isSelected ? '#059669' : 'currentColor' }}
                    />
                  </div>
                  <div className="flex-1 relative z-10">
                    <p className="font-din-arabic font-semibold">{method.name}</p>
                    <p className="font-din-arabic text-sm text-black/60">{method.description}</p>
                  </div>
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.2 }}
                        className="w-7 h-7 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: '#059669' }}
                      >
                        <Check className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </RadioGroup>
      </div>

      {/* Payment Details */}
      <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 border border-white/80 shadow-xl">
        <AnimatePresence mode="wait">
          {selectedPayment === 'cod' ? (
            <motion.div
              key="cod-details"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="font-american-typewriter mb-4 flex items-center space-x-2">
                <Banknote className="w-5 h-5" />
                <span>Cash on Delivery</span>
              </h3>
              <p className="font-din-arabic text-black/70 mb-4">
                Pay with cash when your order is delivered. Please keep exact change ready.
              </p>
              <div 
                className="p-4 rounded-xl backdrop-blur-sm border"
                style={{ 
                  backgroundColor: '#F9EFD8',
                  borderColor: '#E8DFC4'
                }}
              >
                <p className="font-din-arabic text-sm flex items-start space-x-2" style={{ color: '#6B5D47' }}>
                  <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Additional ₹50 COD handling charges will be added to your order.</span>
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="payment-info"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-start space-x-4">
                <motion.div 
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.2), rgba(5, 150, 105, 0.1))' }}
                >
                  <Shield className="w-6 h-6" style={{ color: '#059669' }} />
                </motion.div>
                <div className="flex-1">
                  <h3 className="font-american-typewriter mb-3">Secure Payment Via Razorpay</h3>
                  <p className="font-din-arabic text-black/70 mb-4">
                    Your Payment Details Are Encrypted and Processed Safely.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm font-din-arabic text-black/60">
                      <Check className="w-4 h-4" style={{ color: '#059669' }} />
                      <span>256-bit SSL encryption</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm font-din-arabic text-black/60">
                      <Check className="w-4 h-4" style={{ color: '#059669' }} />
                      <span>PCI DSS compliant</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm font-din-arabic text-black/60">
                      <Check className="w-4 h-4" style={{ color: '#059669' }} />
                      <span>Your card details are never stored</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Billing Address Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/60 backdrop-blur-md rounded-2xl md:rounded-3xl p-4 md:p-8 border border-white/80 shadow-xl"
      >
        <div className="mb-6">
          <h3 className="font-american-typewriter text-lg sm:text-xl md:text-2xl">Billing Address</h3>
        </div>
        
        {/* Display selected shipping address when not editing */}
        {!isEditingBillingAddress && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-5 rounded-2xl"
            style={{ boxShadow: 'inset 0 0 0 1.5px rgba(0, 0, 0, 0.15)' }}
          >
            {selectedAddressId && selectedAddressId !== 'new' ? (
              (() => {
                const address = savedAddresses.find(a => a.id === selectedAddressId);
                return address ? (
                  <div className="font-din-arabic text-sm space-y-1 text-black/80">
                    <p>{address.name}</p>
                    <p>{address.addressLine1}{address.addressLine2 ? `, ${address.addressLine2}` : ''}</p>
                    <p>{address.city}, {address.state} {address.pincode}</p>
                    <div className="flex items-center justify-between">
                      <p>{address.phone}</p>
                      <button
                        onClick={() => onSetIsEditingBillingAddress(true)}
                        className="font-din-arabic text-sm text-black/60 hover:!text-black transition-colors"
                      >
                        [Change]
                      </button>
                    </div>
                  </div>
                ) : null;
              })()
            ) : formData.address ? (
              <div className="font-din-arabic text-sm space-y-1 text-black/80">
                <p>{formData.firstName} {formData.lastName}</p>
                <p>{formData.address}</p>
                <p>{formData.city}, {formData.state} {formData.pincode}</p>
                <div className="flex items-center justify-between">
                  <p>{formData.phone}</p>
                  <button
                    onClick={() => onSetIsEditingBillingAddress(true)}
                    className="font-din-arabic text-sm text-black/60 hover:!text-black transition-colors"
                  >
                    [Change]
                  </button>
                </div>
              </div>
            ) : (
              <p className="font-din-arabic text-sm text-black/50 italic">
                Please select a shipping address from Step 1
              </p>
            )}
          </motion.div>
        )}

        {/* Show address selection/form when editing */}
        <AnimatePresence>
          {isEditingBillingAddress && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="space-y-4 overflow-hidden"
            >
              {/* Show saved addresses or new address form */}
              {!showBillingForm ? (
                <>
                  {/* Saved Addresses Grid */}
                  {savedAddresses.length > 0 && (
                    <div className="grid grid-cols-2 gap-4">
                      {savedAddresses.map((address) => (
                        <motion.div
                          key={`billing-${address.id}`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            onSetSelectedBillingId(address.id);
                            onSetSelectedAddressId(address.id);
                            const populated = populateAddressFields(address);
                            onSetFormData(prev => ({ ...prev, ...populated }));
                            onSetIsEditingBillingAddress(false);
                            toast.success('Billing address updated');
                          }}
                          className={`cursor-pointer rounded-2xl p-4 transition-all duration-300 ${
                            selectedBillingId === address.id || selectedAddressId === address.id
                              ? 'bg-white/60 border-2 border-black/20 shadow-lg shadow-black/10'
                              : 'bg-white/40 border border-white/60 hover:bg-white/60 hover:shadow-md'
                          }`}
                        >
                          <div className="space-y-1">
                            <p className="font-din-arabic text-sm">{address.name}</p>
                            <p className="font-din-arabic text-xs text-black/60">
                              {address.addressLine1}
                              {address.addressLine2 && `, ${address.addressLine2}`}
                            </p>
                            <p className="font-din-arabic text-xs text-black/60">
                              {address.city}, {address.state}, {address.pincode}
                            </p>
                            <div className="flex items-center justify-between pt-2">
                              <p className="font-din-arabic text-xs text-black/50">{address.phone}</p>
                              <span className="px-2 py-0.5 bg-black/10 rounded-full font-din-arabic text-xs uppercase">
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
                        onClick={() => onSetShowBillingForm(true)}
                        className="cursor-pointer rounded-2xl p-4 bg-white/40 border border-white/60 hover:bg-white/60 hover:shadow-md transition-all duration-300 flex items-center justify-center min-h-[140px]"
                      >
                        <div className="flex items-center space-x-2 text-black/60">
                          <Plus className="w-5 h-5" />
                          <span className="font-din-arabic">Add New</span>
                        </div>
                      </motion.div>
                    </div>
                  )}
                  {/* If no saved addresses, show add button */}
                  {savedAddresses.length === 0 && (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onSetShowBillingForm(true)}
                      className="cursor-pointer rounded-2xl p-6 bg-white/40 border border-white/60 hover:bg-white/60 hover:shadow-md transition-all duration-300 flex items-center justify-center"
                    >
                      <div className="text-center">
                        <Plus className="w-10 h-10 mx-auto mb-3 text-black/40" />
                        <p className="font-din-arabic text-black/70 mb-1">Add Billing Address</p>
                        <p className="font-din-arabic text-xs text-black/50">Enter a new billing address</p>
                      </div>
                    </motion.div>
                  )}
                </>
              ) : (
                /* New Billing Address Form */
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="billingName" className="font-din-arabic mb-2 block">
                        Full Name
                      </Label>
                      <Input
                        id="billingName"
                        value={newBillingData.name}
                        onChange={(e) => onSetNewBillingData({...newBillingData, name: e.target.value})}
                        className="bg-white/80 border-black/10 focus:border-black/30 transition-all duration-300"
                        placeholder="Enter full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="billingPhone" className="font-din-arabic mb-2 block">
                        Phone Number
                      </Label>
                      <div className="flex space-x-2">
                        <div className="w-16 bg-white/80 border border-black/10 rounded-md flex items-center justify-center text-xs font-din-arabic text-black/60">
                          +91
                        </div>
                        <Input
                          id="billingPhone"
                          type="tel"
                          value={newBillingData.phone}
                          onChange={(e) => onSetNewBillingData({...newBillingData, phone: e.target.value})}
                          className="bg-white/80 border-black/10 focus:border-black/30 transition-all duration-300"
                          placeholder="XXXXX XXXXX"
                          maxLength={10}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="billingAddress1" className="font-din-arabic mb-2 block">
                      Address Line 1
                    </Label>
                    <Input
                      id="billingAddress1"
                      value={newBillingData.addressLine1}
                      onChange={(e) => onSetNewBillingData({...newBillingData, addressLine1: e.target.value})}
                      className="bg-white/80 border-black/10 focus:border-black/30 transition-all duration-300"
                      placeholder="House no., Street, Locality"
                    />
                  </div>
                  <div>
                    <Label htmlFor="billingAddress2" className="font-din-arabic mb-2 block">
                      Address Line 2 (Optional)
                    </Label>
                    <Input
                      id="billingAddress2"
                      value={newBillingData.addressLine2}
                      onChange={(e) => onSetNewBillingData({...newBillingData, addressLine2: e.target.value})}
                      className="bg-white/80 border-black/10 focus:border-black/30 transition-all duration-300"
                      placeholder="Apartment, suite, etc."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="billingCity" className="font-din-arabic mb-2 block">City</Label>
                      <Select
                        value={newBillingData.city}
                        onValueChange={(value) => onSetNewBillingData({...newBillingData, city: value})}
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
                      <Label htmlFor="billingState" className="font-din-arabic mb-2 block">State</Label>
                      <Select
                        value={newBillingData.state}
                        onValueChange={(value) => onSetNewBillingData({...newBillingData, state: value})}
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
                  <div>
                    <Label htmlFor="billingPincode" className="font-din-arabic mb-2 block">PIN Code</Label>
                    <Input
                      id="billingPincode"
                      value={newBillingData.pincode}
                      onChange={(e) => onSetNewBillingData({...newBillingData, pincode: e.target.value})}
                      className="bg-white/80 border-black/10 focus:border-black/30 transition-all duration-300"
                      maxLength={6}
                      placeholder="Enter 6-digit PIN"
                    />
                  </div>
                  {/* Save/Cancel Buttons */}
                  <div className="flex space-x-3 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        // Validate required fields
                        if (!newBillingData.name || !newBillingData.addressLine1 || !newBillingData.city || 
                            !newBillingData.state || !newBillingData.pincode || !newBillingData.phone) {
                          toast.error('Please fill in all required billing fields');
                          return;
                        }
                        
                        // Validate pincode
                        if (newBillingData.pincode.replace(/\D/g, '').length !== 6) {
                          toast.error('Please enter a valid 6-digit PIN code');
                          return;
                        }
                        
                        // Validate phone
                        if (newBillingData.phone.replace(/\D/g, '').length !== 10) {
                          toast.error('Please enter a valid 10-digit phone number');
                          return;
                        }
                        
                        // Update formData with the new billing address
                        const nameParts = newBillingData.name.split(' ');
                        onSetFormData(prev => ({
                          ...prev,
                          firstName: nameParts[0] || '',
                          lastName: nameParts.slice(1).join(' ') || '',
                          phone: newBillingData.phone,
                          address: newBillingData.addressLine1 + (newBillingData.addressLine2 ? ', ' + newBillingData.addressLine2 : ''),
                          city: newBillingData.city,
                          state: newBillingData.state,
                          pincode: newBillingData.pincode,
                        }));
                        
                        onSetShowBillingForm(false);
                        onSetIsEditingBillingAddress(false);
                        onSetSelectedAddressId('new');
                        toast.success('Billing address saved');
                      }}
                      className="flex-1 px-6 py-3 bg-black text-white font-din-arabic hover:bg-black/80 transition-all duration-300 rounded-lg"
                    >
                      Save Address
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        onSetShowBillingForm(false);
                        onSetNewBillingData({
                          name: '', addressLine1: '', addressLine2: '', city: '', 
                          state: '', pincode: '', phone: '', label: 'Home', isDefault: false
                        });
                      }}
                      className="flex-1 px-6 py-3 border border-black/20 text-black font-din-arabic hover:bg-black/5 transition-all duration-300 rounded-lg"
                    >
                      Back
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
