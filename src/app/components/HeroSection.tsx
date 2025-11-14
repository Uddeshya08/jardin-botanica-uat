'use client'
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HeroPanel {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  cta: string;
  isSpecial?: boolean;
}

const heroPanels: HeroPanel[] = [
  {
    id: 1,
    title: "Rituals",
    subtitle: "Little acts of care that change the day.",
    description: "",
    imageUrl: "https://images.unsplash.com/photo-1674620305515-1394fe40c634?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcG90aGVjYXJ5JTIwaGFuZHMlMjBibGVuZGluZyUyMGFtYmVyJTIwYm90dGxlcyUyMGJyYXNzJTIwc2NhbGVzfGVufDF8fHx8MTc1NjgxNTgwMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    cta: "Build Your Set"
  },
  {
    id: 2,
    title: "Atmosphere",
    subtitle: "Evenings that hold you a little longer.",
    description: "A gentle glow, a scent that stays close.",
    imageUrl: "https://images.unsplash.com/photo-1650482713537-8de547ea7a16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbW9rZSUyMHRyYWlscyUyMG1pc3QlMjBjYW5kbGUlMjBmbGFtZXMlMjBzZW5zb3J5JTIwYXJvbWF0aGVyYXB5fGVufDF8fHx8MTc1NjgxNTgwMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    cta: "Shop Candles"
  },
  {
    id: 3,
    title: "The Lab",
    subtitle: "The garden is our brief; the lab is our proof.",
    description: "Formulas with measured actives and climate-smart bases—finished with design you can feel.",
    imageUrl: "https://images.unsplash.com/photo-1720275273886-89966091ce4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYXclMjBib3RhbmljYWxzJTIwaGVyYnMlMjByb290cyUyMHNlZWRzJTIwZGV3JTIwZHJvcHN8ZW58MXx8fHwxNzU2ODE1ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    cta: "Enter The Lab"
  },
  {
    id: 4,
    title: "Circle",
    subtitle: "The Botanist's Circle",
    description: "An invitation to the inner world.\\nEarly access. Limited blends. Private gatherings.",
    imageUrl: "https://images.unsplash.com/photo-1740513348123-72148a7dbf5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3RhbmljYWwlMjBnYXJkZW4lMjBncmVlbmhvdXNlJTIwdmludGFnZSUyMHBsYW50c3xlbnwxfHx8fDE3NTY5MjM2OTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    cta: "Join the Circle"
  }
];

export function HeroSection() {
  const [activePanel, setActivePanel] = useState(1);

  // Show first section by default on mount
  useEffect(() => {
    setActivePanel(1);
  }, []);

  const currentPanel = heroPanels.find(panel => panel.id === activePanel) || heroPanels[0];

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden" style={{ paddingTop: '40px' }}>
      {/* Background Image Container - Fixed height */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePanel}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <div className="w-full h-full relative overflow-hidden">
              <ImageWithFallback
                src={currentPanel.imageUrl}
                alt={currentPanel.title}
                className="w-full h-full object-cover"
                style={{ minHeight: '100vh' }}
              />
            </div>
            <div className="absolute inset-0 bg-black/50" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 z-20">
        <div className="container mx-auto px-6 lg:px-12 h-full flex items-center">
          <div className="max-w-2xl text-white">
            {/* Fixed layout structure to prevent jumping */}
            <div className="min-h-[200px] md:min-h-[250px] lg:min-h-[300px]">
              <AnimatePresence mode="wait">
                <motion.h1
                  key={`title-${activePanel}`}
                  className="font-american-typewriter text-5xl md:text-6xl lg:text-7xl mb-6 tracking-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  {currentPanel.subtitle}
                </motion.h1>
              </AnimatePresence>

              {/* Description container with fixed height to prevent layout shift */}
              <div className="min-h-[80px] md:min-h-[100px] mb-8">
                <AnimatePresence mode="wait">
                  {currentPanel.description && (
                    <motion.div
                      key={`description-${activePanel}`}
                      className="font-din-arabic text-xl md:text-2xl text-white/90 leading-relaxed"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4, ease: "easeInOut", delay: 0.1 }}
                    >
                      {currentPanel.description.split('\\n').map((line, index) => (
                        <span key={index}>
                          {line}
                          {index < currentPanel.description.split('\\n').length - 1 && <br />}
                        </span>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* CTA Button - Fixed position container */}
            <div className="mt-4">
              <AnimatePresence mode="wait">
                <motion.button
                  key={`cta-${activePanel}`}
                  className={`font-din-arabic inline-flex items-center px-8 py-3 transition-all duration-300 tracking-wide ${
                    currentPanel.isSpecial
                      ? 'bg-white text-black hover:bg-white/90'
                      : 'text-white border border-white/30 hover:bg-white hover:text-black'
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  {currentPanel.cta}
                </motion.button>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation - Subtle */}
      <div className="absolute bottom-6 left-0 right-0 z-30">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex justify-center">
            <div className="flex bg-black/20 backdrop-blur-md rounded-full px-2 py-2">
              {heroPanels.map((panel, index) => (
                <button
                  key={panel.id}
                  className={`relative px-6 py-3 text-xs font-din-arabic tracking-wider transition-all duration-300 rounded-full ${
                    activePanel === panel.id 
                      ? 'bg-white/20 text-white' 
                      : 'text-white/60 hover:text-white/80 hover:bg-white/10'
                  }`}
                  onMouseEnter={() => setActivePanel(panel.id)}
                >
                  {panel.title.toUpperCase()}
                  
                  {/* Active indicator dot */}
                  {activePanel === panel.id && (
                    <motion.div
                      className="absolute -bottom-1 left-1/2 w-1 h-1 bg-white rounded-full"
                      initial={{ scale: 0, x: '-50%' }}
                      animate={{ scale: 1, x: '-50%' }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}