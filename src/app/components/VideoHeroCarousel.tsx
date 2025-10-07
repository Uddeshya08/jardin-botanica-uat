import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CarouselSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  cta: string;
  isSpecial?: boolean;
}

const slides: CarouselSlide[] = [
  {
    id: 1,
    title: "Where nature begins to whisper.",
    subtitle: "Origins",
    description: "Raw botanicals. Distilled purity.\nEvery drop crafted with intention.",
    imageUrl: "https://images.unsplash.com/photo-1720275273886-89966091ce4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYXclMjBib3RhbmljYWxzJTIwaGVyYnMlMjByb290cyUyMHNlZWRzJTIwZGV3JTIwZHJvcHN8ZW58MXx8fHwxNzU2ODE1ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    cta: "Discover Origins"
  },
  {
    id: 2,
    title: "Alchemy in motion.",
    subtitle: "Craft",
    description: "Hand-blended. Slow-brewed.\nA ritual of patience, precision, and soul.",
    imageUrl: "https://images.unsplash.com/photo-1674620305515-1394fe40c634?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcG90aGVjYXJ5JTIwaGFuZHMlMjBibGVuZGluZyUyMGFtYmVyJTIwYm90dGxlcyUyMGJyYXNzJTIwc2NhbGVzfGVufDF8fHx8MTc1NjgxNTgwMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    cta: "Witness Craft"
  },
  {
    id: 3,
    title: "For the senses, not the shelf.",
    subtitle: "Experience",
    description: "Unfiltered. Honest.\nAn aroma that lingers, a story that stays.",
    imageUrl: "https://images.unsplash.com/photo-1650482713537-8de547ea7a16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbW9rZSUyMHRyYWlscyUyMG1pc3QlMjBjYW5kbGUlMjBmbGFtZXMlMjBzZW5zb3J5JTIwYXJvbWF0aGVyYXB5fGVufDF8fHx8MTc1NjgxNTgwMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    cta: "Feel Experience"
  },
  {
    id: 4,
    title: "The Botanist's Circle",
    subtitle: "Join Now",
    description: "An invitation to the inner world.\nEarly access. Limited blends. Private gatherings.\n\nJoin now — step inside the circle.",
    imageUrl: "https://images.unsplash.com/photo-1713117224401-b88adbc53fe3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW1iZXJzaGlwJTIwY2FyZCUyMGJvdGFuaWNhbCUyMGVsZW1lbnRzJTIwZmxhdCUyMGxheSUyMGxpbmVuJTIwcGFwZXJ8ZW58MXx8fHwxNzU2ODE1ODAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    cta: "Join the Circle",
    isSpecial: true
  }
];

export function VideoHeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Auto-advance slides
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000); // Slightly longer for the membership panel

    return () => clearInterval(interval);
  }, [isPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div 
      className="relative w-full h-screen overflow-hidden bg-black"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* Background Image/Video */}
          <div className="absolute inset-0">
            <ImageWithFallback
              src={slides[currentSlide].imageUrl}
              alt={slides[currentSlide].title}
              className="w-full h-full object-cover"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/30" />
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex items-center">
            <div className="container mx-auto px-6 lg:px-12">
              <div className={`${slides[currentSlide].isSpecial ? 'max-w-3xl text-center mx-auto' : 'max-w-2xl'}`}>
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="mb-4"
                >
                  <span className="inline-block px-4 py-2 text-sm tracking-widest text-white/80 border border-white/20 rounded-full">
                    {slides[currentSlide].subtitle}
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className={`font-light text-white mb-6 tracking-tight ${
                    slides[currentSlide].isSpecial 
                      ? 'text-3xl md:text-5xl lg:text-6xl' 
                      : 'text-4xl md:text-6xl lg:text-7xl'
                  }`}
                >
                  {slides[currentSlide].title}
                </motion.h1>

                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                  className={`text-white/80 mb-8 leading-relaxed ${
                    slides[currentSlide].isSpecial 
                      ? 'text-base md:text-lg' 
                      : 'text-lg md:text-xl'
                  }`}
                >
                  {slides[currentSlide].description.split('\n').map((line, index) => (
                    <span key={index}>
                      {line}
                      {index < slides[currentSlide].description.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </motion.div>

                <motion.button
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.8 }}
                  className={`inline-flex items-center px-8 py-3 transition-all duration-300 tracking-wide ${
                    slides[currentSlide].isSpecial
                      ? 'bg-white text-black hover:bg-white/90'
                      : 'text-white border border-white/30 hover:bg-white hover:text-black'
                  }`}
                >
                  {slides[currentSlide].cta}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-3 text-white/60 hover:text-white transition-colors duration-300"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-3 text-white/60 hover:text-white transition-colors duration-300"
        aria-label="Next slide"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Progress Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className="group relative"
            aria-label={`Go to slide ${index + 1}`}
          >
            <div className="w-12 h-0.5 bg-white/30 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white rounded-full"
                initial={{ width: 0 }}
                animate={{ 
                  width: index === currentSlide ? "100%" : "0%" 
                }}
                transition={{ duration: index === currentSlide ? 6 : 0.3 }}
              />
            </div>
          </button>
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute bottom-8 right-6 z-20 text-white/60 text-sm tracking-wider">
        <span className="text-white">{String(currentSlide + 1).padStart(2, '0')}</span>
        {' / '}
        <span>{String(slides.length).padStart(2, '0')}</span>
      </div>
    </div>
  );
}