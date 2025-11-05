"use client";

import React from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { steps } from './constants';

interface ProgressStepsProps {
  currentStep: number;
}

export function ProgressSteps({ currentStep }: ProgressStepsProps) {
  return (
    <div className="max-w-2xl mx-auto px-2">
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
                className={`relative w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
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
                  <step.icon className="w-4 h-4 md:w-5 md:h-5" />
                )}
              </motion.div>
              <span className={`font-din-arabic text-xs mt-2 transition-colors duration-300 hidden sm:block ${
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
  );
}

