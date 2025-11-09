'use client'
import React, { useState, useEffect } from 'react';
import { Navigation } from 'app/components/Navigation';
import { AccountPage } from 'app/components/AccountPage';
import { RippleEffect } from 'app/components/RippleEffect';
import { upsertCartItems } from 'lib/util/cart-helpers';


interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const handleCartUpdate = (item: CartItem | null) => {
    if (!item) return;
    setCartItems(prevItems => upsertCartItems(prevItems, item));
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen">
      <RippleEffect />
      <Navigation isScrolled={isScrolled} cartItems={cartItems} onCartUpdate={handleCartUpdate} />
      <AccountPage />
      
    </div>
  );
}