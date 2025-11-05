"use client";

import React from 'react';
import { motion } from 'motion/react';
import { MapPin, CreditCard, Check, Shield } from 'lucide-react';
import { FormData } from './types';
import { paymentMethods } from './constants';

interface ReviewStepProps {
  formData: FormData;
  selectedPayment: string;
  cartItems: { price: number; quantity: number }[];
  appliedCoupon: { type: 'percentage' | 'fixed'; value: number; code: string } | null;
}

export function ReviewStep({
  formData,
  selectedPayment,
  cartItems,
  appliedCoupon
}: ReviewStepProps) {
  const selectedPaymentMethod = paymentMethods.find(pm => pm.id === selectedPayment);

  return (
    <motion.div
      key="review"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="bg-white/60 backdrop-blur-md rounded-2xl md:rounded-3xl p-4 md:p-8 border border-white/80 shadow-xl"
    >
      <div className="flex items-center space-x-3 mb-6 md:mb-8">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
          className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, rgba(4, 120, 87, 0.2), rgba(4, 120, 87, 0.1))' }}
        >
          <Check className="w-6 h-6" style={{ color: '#047857' }} />
        </motion.div>
        <div>
          <h2 className="font-american-typewriter text-xl sm:text-2xl md:text-3xl tracking-wide">Review Your Order</h2>
          <p className="font-din-arabic text-xs sm:text-sm text-black/60">Verify Details Before Parcel Dispatch.</p>
        </div>
      </div>
      <div className="space-y-6">
        {/* Shipping Info Summary */}
        <div className="p-6 bg-white/50 rounded-2xl border border-black/10">
          <h3 className="font-din-arabic font-semibold mb-4 flex items-center space-x-2">
            <MapPin className="w-4 h-4" />
            <span>Shipping Details</span>
          </h3>
          <div className="font-din-arabic text-sm leading-relaxed" style={{ lineHeight: '1.8' }}>
            <p>{formData.firstName} {formData.lastName}</p>
            <p>{formData.address}, {formData.city}, {formData.state} - {formData.pincode}</p>
            <p>{formData.countryCode} {formData.phone}</p>
            <p>{formData.email}</p>
          </div>
        </div>

        {/* Payment Info Summary */}
        <div className="p-6 bg-white/50 rounded-2xl border border-black/10">
          <h3 className="font-din-arabic font-semibold mb-4 flex items-center space-x-2">
            <CreditCard className="w-4 h-4" />
            <span>Payment Method</span>
          </h3>
          <p className="font-din-arabic text-sm mb-2">
            {selectedPaymentMethod?.name}
          </p>
          {selectedPayment !== 'cod' && (
            <p className="font-din-arabic text-xs text-black/60 flex items-center space-x-1.5 mt-3">
              <Shield className="w-3.5 h-3.5" style={{ color: '#047857' }} />
              <span>Payment will be processed securely via Razorpay</span>
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
