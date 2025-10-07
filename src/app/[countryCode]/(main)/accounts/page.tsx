'use client'
import React, { useState, useEffect } from 'react';
import { Navigation } from 'app/components/Navigation';
import { AccountPage } from 'app/components/AccountPage';
import { RippleEffect } from 'app/components/RippleEffect';


interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 'soft-orris-hand-veil',
      name: 'Soft Orris Hand Veil',
      price: 1800,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop'
    }
  ]);

  const handleCartUpdate = (item: CartItem | null) => {
    // Update cartItems array for navigation
    if (item && item.quantity > 0) {
      setCartItems(prevItems => {
        const existingIndex = prevItems.findIndex(cartItem => cartItem.id === item.id);
        if (existingIndex >= 0) {
          // Update existing item
          const updatedItems = [...prevItems];
          updatedItems[existingIndex] = item;
          return updatedItems;
        } else {
          // Add new item
          return [...prevItems, item];
        }
      });
    } else if (item && item.quantity === 0) {
      // Remove item if quantity is 0
      setCartItems(prevItems => prevItems.filter(cartItem => cartItem.id !== item.id));
    }
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