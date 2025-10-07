'use client'
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Ripple {
  id: number;
  x: number;
  y: number;
  timestamp: number;
  isBlankClick: boolean;
}

export function RippleEffect() {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const isBlankClick =
        !target ||
        target === document.body ||
        target.tagName === 'HTML' ||
        target.classList.contains('blank-area') ||
        (!target.closest('button') &&
          !target.closest('a') &&
          !target.closest('input') &&
          !target.closest('[role="button"]') &&
          !target.closest('select') &&
          !target.closest('textarea'));

      const newRipple: Ripple = {
        id: Date.now() + Math.random(),
        x: event.clientX,
        y: event.clientY,
        timestamp: Date.now(),
        isBlankClick,
      };

      setRipples((prev) => [...prev, newRipple]);

      const duration = isBlankClick ? 400 : 500; // shorter lifetime
      setTimeout(() => {
        setRipples((prev) =>
          prev.filter((ripple) => ripple.id !== newRipple.id)
        );
      }, duration);
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]">
      <AnimatePresence>
        {ripples.map((ripple) => {
          const isBlank = ripple.isBlankClick;
          const opacity = isBlank ? 0.15 : 0.25; // lighter
          const maxScale = isBlank ? 1.1 : 1.3; // smaller scale
          const duration = isBlank ? 0.3 : 0.4;
          const borderOpacity = isBlank ? 0.15 : 0.2;
          const bgOpacity = isBlank ? 0.02 : 0.04;

          return (
            <motion.div
              key={ripple.id}
              initial={{ scale: 0, opacity }}
              animate={{
                scale: [0, 1, maxScale],
                opacity: [opacity, opacity * 0.3, 0],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="absolute w-4 h-4 rounded-full border"
              style={{
                left: ripple.x - 8,
                top: ripple.y - 8,
                transformOrigin: '50% 50%',
                borderColor: `rgba(0, 0, 0, ${borderOpacity})`,
                backgroundColor: `rgba(0, 0, 0, ${bgOpacity})`,
              }}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}
