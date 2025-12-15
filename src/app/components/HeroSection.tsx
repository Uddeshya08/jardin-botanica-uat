'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HeroPanel {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  videoUrl?: string; // ✅ Added for background video
  cta: string;
  isSpecial?: boolean;
}

const heroPanels: HeroPanel[] = [
  {
    id: 1,
    title: "Rituals",
    subtitle: "Little acts of care that change the day.",
    description: "",
    imageUrl: "https://images.unsplash.com/photo-1674620305515-1394fe40c634",
    videoUrl: "/assets/video-banner.mp4",
    cta: "Build Your Set"
  },
  {
    id: 2,
    title: "Atmosphere",
    subtitle: "Evenings that hold you a little longer.",
    description: "A gentle glow, a scent that stays close.",
    imageUrl: "https://images.unsplash.com/photo-1650482713537-8de547ea7a16",
    // videoUrl: "/assets/video-banner.mp4",
    cta: "Shop Candles"
  },
  {
    id: 3,
    title: "The Lab",
    subtitle: "The garden is our brief; the lab is our proof.",
    description:
      "Formulas with measured actives and climate-smart bases—finished with design you can feel.",
    imageUrl: "https://images.unsplash.com/photo-1720275273886-89966091ce4d",
    // videoUrl: "/assets/video-banner.mp4",
    cta: "Enter The Lab"
  },
  {
    id: 4,
    title: "Circle",
    subtitle: "The Botanist's Circle",
    description:
      "An invitation to the inner world.\nEarly access. Limited blends. Private gatherings.",
    imageUrl: "https://images.unsplash.com/photo-1740513348123-72148a7dbf5b",
    // videoUrl: "/assets/video-banner.mp4",
    cta: "Join the Circle"
  }
];

export function HeroSection() {
  const [activePanel, setActivePanel] = useState(1);
  const [videoError, setVideoError] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  useEffect(() => {
    setActivePanel(1);
  }, []);

  const currentPanel = heroPanels.find(p => p.id === activePanel) || heroPanels[0];

  // Minimum swipe distance (in pixels) to trigger panel change
  const minSwipeDistance = 80;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
    setIsSwiping(true);
    setSwipeOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartX.current) return;
    
    const currentX = e.targetTouches[0].clientX;
    touchEndX.current = currentX;
    
    // Calculate swipe offset for visual feedback
    const offset = currentX - touchStartX.current;
    setSwipeOffset(offset);
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) {
      setIsSwiping(false);
      setSwipeOffset(0);
      return;
    }
    
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance; // Finger moved left = next panel
    const isRightSwipe = distance < -minSwipeDistance; // Finger moved right = previous panel

    if (isLeftSwipe) {
      // Swipe left (finger moved left) - go to next panel
      const currentIndex = heroPanels.findIndex(p => p.id === activePanel);
      const nextIndex = (currentIndex + 1) % heroPanels.length;
      setActivePanel(heroPanels[nextIndex].id);
      setVideoError(false);
    } else if (isRightSwipe) {
      // Swipe right (finger moved right) - go to previous panel
      const currentIndex = heroPanels.findIndex(p => p.id === activePanel);
      const prevIndex = (currentIndex - 1 + heroPanels.length) % heroPanels.length;
      setActivePanel(heroPanels[prevIndex].id);
      setVideoError(false);
    }
    
    // Reset swipe state
    setIsSwiping(false);
    setSwipeOffset(0);
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div 
      className="relative w-full h-screen bg-black overflow-hidden" 
      style={{ paddingTop: '40px' }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      
      {/* ✅ Background Video/Image Section */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePanel}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              x: isSwiping ? swipeOffset * 0.3 : 0
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <div className="w-full h-full relative overflow-hidden">
              {!videoError && currentPanel.videoUrl ? (
                <video
                  key={`video-${activePanel}`}
                  src={currentPanel.videoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  onError={() => setVideoError(true)}
                  className="w-full h-full object-cover"
                  style={{ minHeight: '100vh' }}
                />
              ) : (
                <ImageWithFallback
                  src={currentPanel.imageUrl}
                  alt={currentPanel.title}
                  className="w-full h-full object-cover"
                  style={{ minHeight: '100vh' }}
                />
              )}
            </div>
            <div className="absolute inset-0 bg-black/50" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ✅ Content Overlay */}
      <div className="absolute inset-0 z-20">
        <div className="container mx-auto px-6 lg:px-12 h-full flex items-center">
          <motion.div 
            className="max-w-2xl text-white"
            animate={{
              x: isSwiping ? swipeOffset * 0.2 : 0,
              opacity: isSwiping ? 1 - Math.abs(swipeOffset) / 300 : 1
            }}
            transition={{ duration: 0.1 }}
          >
            
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

              {/* Description */}
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
                      {currentPanel.description.split('\n').map((line, i) => (
                        <span key={i}>
                          {line}
                          {i < currentPanel.description.split('\n').length - 1 && <br />}
                        </span>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* CTA Button */}
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
          </motion.div>
        </div>
      </div>

      {/* ✅ Bottom Navigation */}
      <div className="absolute bottom-[6rem] sm:bottom-6 left-0 right-0 z-30">
        <div className="container mx-auto px-2 sm:px-4 md:px-6 lg:px-12">
          <div className="flex justify-center">
            <div className="flex bg-black/20 backdrop-blur-md rounded-full px-1 sm:px-1.5 md:px-2 py-1 sm:py-1.5 md:py-2 gap-0.5 sm:gap-1">
              {heroPanels.map(panel => (
                <button
                  key={panel.id}
                  className={`relative px-2.5 sm:px-4 md:px-5 lg:px-6 py-2 sm:py-2.5 md:py-3 text-[10px] sm:text-xs font-din-arabic tracking-wide sm:tracking-wider transition-all duration-300 rounded-full whitespace-nowrap ${
                    activePanel === panel.id
                      ? 'bg-white/20 text-white'
                      : 'text-white/60 hover:text-white/80 hover:bg-white/10'
                  }`}
                  onMouseEnter={() => {
                    setVideoError(false);
                    setActivePanel(panel.id);
                  }}
                  onClick={() => {
                    setVideoError(false);
                    setActivePanel(panel.id);
                  }}
                >
                  {panel.title.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}