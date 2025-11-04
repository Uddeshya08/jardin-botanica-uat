"use client";

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Package, X, Check, Tag, Shield, Sparkles } from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { CartItem, Coupon } from './types';
import { calculateTotals } from './utils';

interface OrderSummaryProps {
  cartItems: CartItem[];
  couponCode: string;
  setCouponCode: (code: string) => void;
  appliedCoupon: Coupon | null;
  couponError: string;
  onApplyCoupon: () => void;
  onRemoveCoupon: () => void;
  selectedPayment: string;
}

export function OrderSummary({
  cartItems,
  couponCode,
  setCouponCode,
  appliedCoupon,
  couponError,
  onApplyCoupon,
  onRemoveCoupon,
  selectedPayment,
  onCartUpdate
}: OrderSummaryProps & { onCartUpdate: (item: CartItem) => void }) {
  const { subtotal, discount, shipping, tax, total } = calculateTotals(
    cartItems,
    appliedCoupon
  );

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

  return (
    <div className="bg-white/60 backdrop-blur-md rounded-2xl md:rounded-3xl p-4 md:p-8 border border-white/80 shadow-xl">
      <h2 className="font-american-typewriter mb-6 flex items-center space-x-2">
        <Package className="w-5 h-5" />
        <span>Order Summary</span>
      </h2>

      {/* Cart Items */}
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

      {/* Coupon Code Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
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
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    onApplyCoupon();
                  }
                }}
                placeholder="Enter code"
                className="flex-1 bg-white/60 border-black/20 font-din-arabic focus:border-black transition-all placeholder:text-black/30"
                style={{ letterSpacing: '0.1em' }}
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onApplyCoupon}
                className="px-6 py-2 bg-black text-white rounded-lg font-din-arabic text-sm hover:bg-black/90 transition-colors"
                style={{ letterSpacing: '0.1em' }}
              >
                Apply
              </motion.button>
            </div>
            {couponError && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-din-arabic text-xs text-red-600"
              >
                {couponError}
              </motion.p>
            )}
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
                onClick={onRemoveCoupon}
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

      {/* Price Breakdown */}
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

      {/* Trust Badge */}
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
  );
}

