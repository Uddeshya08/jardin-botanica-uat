'use client'
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Star, Heart, Share2, Plus, Minus, Home, ChevronRight as BreadcrumbChevron } from 'lucide-react';
import { InfoPanel } from './InfoPanel';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface ProductHeroProps {
  onCartUpdate?: (item: CartItem | null) => void;
}

export function ProductHeroHands({ onCartUpdate }: ProductHeroProps) {
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isIngredientsOpen, setIsIngredientsOpen] = useState(false);
  const [isActivesOpen, setIsActivesOpen] = useState(false);
  const [isRitualOpen, setIsRitualOpen] = useState(false);
  
  // New state for slide-in panels
  const [isRitualPanelOpen, setIsRitualPanelOpen] = useState(false);
  const [isActivesPanelOpen, setIsActivesPanelOpen] = useState(false);
  const [isFragranceNotesOpen, setIsFragranceNotesOpen] = useState(false);
  const [isIngredientsPanelOpen, setIsIngredientsPanelOpen] = useState(false);

  // Product details
  const productPrice = 2400;
  const productName = "Tea Exfoliant Rinse";
const productImage = '/assets/productImage.png';
  // Mock product images array (you can expand this with more images)
  const productImages = [productImage, productImage, productImage];
  
  const handleAddToCart = () => {
    setIsAddedToCart(true);
    
    // Create cart item and notify parent
    const cartItem: CartItem = {
      id: "tea-exfoliant-rinse",
      name: productName,
      price: productPrice,
      quantity: quantity,
      image: '/assets/productImage.png'
    };
    
    onCartUpdate?.(cartItem);
    
    setTimeout(() => setIsAddedToCart(false), 2000);
  };

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
    
    // Always update cart if it exists, since quantity selector is always visible
    const cartItem: CartItem = {
      id: "tea-exfoliant-rinse",
      name: productName,
      price: productPrice,
      quantity: newQuantity,
      image: '/assets/productImage.png'
    };
    onCartUpdate?.(cartItem);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? productImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === productImages.length - 1 ? 0 : prev + 1));
  };



  return (
    <div 
      className="flex"
      style={{ 
        paddingTop: '80px', // Reduced padding for more compact layout
        minHeight: '35vh' // Much more compact
      }}
    >
      {/* Left Side - Product Information (40%) with #e3e3d8 background */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full lg:w-[40%] flex items-center justify-center py-12 px-8 lg:px-16 xl:px-20 relative overflow-hidden"
        style={{ backgroundColor: '#e3e3d8' }}
      >
        {/* Subtle botanical pattern overlay */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 30%, rgba(162, 139, 111, 0.3) 1px, transparent 1px),
                             radial-gradient(circle at 70% 60%, rgba(162, 139, 111, 0.2) 1px, transparent 1px),
                             radial-gradient(circle at 40% 80%, rgba(162, 139, 111, 0.2) 1px, transparent 1px)`,
            backgroundSize: '60px 60px, 40px 40px, 80px 80px'
          }}
        />
        
        <div className="space-y-6 max-w-lg relative z-10">

          {/* Breadcrumbs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{paddingTop: "18px"}}
          >
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" className="font-din-arabic text-xs tracking-wide flex items-center" style={{ color: '#a28b6f' }}>
                    <Home className="w-3 h-3 mr-1" />
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <BreadcrumbChevron className="w-3 h-3" style={{ color: '#a28b6f' }} />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/hands" className="font-din-arabic text-xs tracking-wide" style={{ color: '#a28b6f' }}>
                    Hands
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <BreadcrumbChevron className="w-3 h-3" style={{ color: '#a28b6f' }} />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-din-arabic text-xs tracking-wide text-black/80">
                    Cleansers & Exfoliants
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </motion.div>

          {/* Product Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-american-typewriter text-3xl tracking-tight text-black relative"
            style={{paddingTop: "8px", paddingBottom: "8px"}}
          >
            <span className="relative">
              Tea Exfoliant Rinse
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="absolute -bottom-2 left-0 h-px w-full origin-left"
                style={{ backgroundColor: '#a28b6f' }}
              />
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="font-din-arabic text-lg text-black leading-relaxed mb-4"
          >
            A cleanse measured in patience — exfoliating, refreshing, resetting.
          </motion.p>

          {/* Price Section - Moved up */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="space-y-2 pb-4 pt-3"
          >
            <p className="font-din-arabic-bold text-3xl text-black mt-4">
              ₹2400
            </p>
          </motion.div>

          {/* Quantity and Add to Cart - Moved up */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="space-y-4"
          >
            <h3 className="font-din-arabic text-sm tracking-wider uppercase" style={{ color: '#a28b6f' }}>
              QUANTITY
            </h3>
            <div className="flex items-center gap-4">
              {/* Quantity Selector */}
              <div className="relative">
                <select
                  value={quantity.toString()}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                  className="font-din-arabic appearance-none bg-transparent border border-black/30 px-4 py-3 pr-8 text-black focus:outline-none focus:border-black transition-colors min-w-[80px]"
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={(i + 1).toString()}>
                      {(i + 1).toString()}
                    </option>
                  ))}
                </select>
                <ChevronRight className="absolute right-2 top-1/2 transform -translate-y-1/2 rotate-90 w-4 h-4 text-black/60 pointer-events-none" />
              </div>

              {/* Add to Cart Button with enhanced states */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className="font-din-arabic px-8 py-3 bg-black text-white hover:bg-black/90 transition-all duration-300 tracking-wide relative overflow-hidden"
              >
                <AnimatePresence mode="wait">
                  {isAddedToCart ? (
                    <motion.span
                      key="added"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      Added to Cart
                    </motion.span>
                  ) : (
                    <motion.span
                      key="add"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      Add to Cart
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </motion.div>

          {/* Description Section - Moved down */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="space-y-2 mt-6 mb-6"
          >
            <div className="space-y-2">
              <p className="font-din-arabic text-black/80 leading-relaxed py-4">
                Notes of fresh tea and neroli meet a gentle scrub of oats and mineral exfoliants in this exfoliating hand wash. Skin feels polished yet calm. Finish with our Soft Orris Hand Veil to seal in softness.
              </p>
            </div>
          </motion.div>

          {/* Separator line before Ritual in Practice */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="w-full h-px origin-left"
            style={{ backgroundColor: 'rgba(185, 168, 147, 0.22)' }}
          />

          {/* Collapsible Ritual in Practice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="space-y-1"
          >
            <button
              onClick={() => setIsRitualPanelOpen(true)}
              className="flex items-center justify-between w-full py-1 text-left group"
            >
              <span className="font-din-arabic text-sm tracking-wider uppercase transition-colors duration-300" style={{ color: '#a28b6f' }}>
                RITUAL IN PRACTICE
              </span>
              <motion.div
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <Plus className="w-4 h-4 transition-colors duration-300" style={{ color: '#a28b6f' }} />
              </motion.div>
            </button>
          </motion.div>

          {/* Separator line before Actives & Key Botanicals */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="w-full h-px origin-left"
            style={{ backgroundColor: 'rgba(185, 168, 147, 0.22)' }}
          />

          {/* Collapsible Actives & Key Botanicals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="space-y-1"
          >
            <button
              onClick={() => setIsActivesPanelOpen(true)}
              className="flex items-center justify-between w-full py-1 text-left group"
            >
              <span className="font-din-arabic text-sm tracking-wider uppercase transition-colors duration-300" style={{ color: '#a28b6f' }}>
                ACTIVES & KEY BOTANICALS
              </span>
              <motion.div
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <Plus className="w-4 h-4 transition-colors duration-300" style={{ color: '#a28b6f' }} />
              </motion.div>
            </button>
          </motion.div>

          {/* Separator line before Fragrance Notes */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            className="w-full h-px origin-left"
            style={{ backgroundColor: 'rgba(185, 168, 147, 0.22)' }}
          />

          {/* Collapsible Fragrance Notes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="space-y-1"
          >
            <button
              onClick={() => setIsFragranceNotesOpen(true)}
              className="flex items-center justify-between w-full py-1 text-left group"
            >
              <span className="font-din-arabic text-sm tracking-wider uppercase transition-colors duration-300" style={{ color: '#a28b6f' }}>
                FRAGRANCE NOTES
              </span>
              <motion.div
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <Plus className="w-4 h-4 transition-colors duration-300" style={{ color: '#a28b6f' }} />
              </motion.div>
            </button>
          </motion.div>

          {/* Separator line before Full Ingredients */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.6, delay: 1.5 }}
            className="w-full h-px origin-left"
            style={{ backgroundColor: 'rgba(185, 168, 147, 0.22)' }}
          />

          {/* Collapsible Full Ingredients */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.6 }}
            className="space-y-1"
          >
            <button
              onClick={() => setIsIngredientsPanelOpen(true)}
              className="flex items-center justify-between w-full py-1 text-left group"
            >
              <span className="font-din-arabic text-sm tracking-wider uppercase transition-colors duration-300" style={{ color: '#a28b6f' }}>
                FULL INGREDIENTS
              </span>
              <motion.div
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <Plus className="w-4 h-4 transition-colors duration-300" style={{ color: '#a28b6f' }} />
              </motion.div>
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Product Image with Carousel (60%) with #d6d6c6 background */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full lg:w-[60%] relative flex items-center justify-center py-6 overflow-hidden"
        style={{ backgroundColor: '#d6d6c6' }}
      >
        {/* Botanical Blend Badge - Top Left */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="absolute top-8 left-8 z-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
            <Star className="w-3 h-3" style={{ color: '#a28b6f' }} />
            <span className="font-din-arabic text-xs tracking-wide" style={{ color: '#a28b6f' }}>BOTANICAL BLEND</span>
          </div>
        </motion.div>

        {/* Action Icons - Positioned at top-right above product image */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="absolute top-8 right-8 flex items-center gap-4 z-20"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 text-black/60 hover:text-black transition-colors bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30"
          >
            <Share2 className="w-5 h-5" />
          </motion.button>
        </motion.div>


        {/* Enhanced Previous Arrow */}
        <motion.button
          whileHover={{ 
            scale: 1.1,
            backgroundColor: 'rgba(162, 139, 111, 0.1)'
          }}
          whileTap={{ scale: 0.9 }}
          onClick={handlePrevImage}
          className="absolute left-8 top-1/2 transform -translate-y-1/2 z-10 p-4 rounded-full text-black/60 hover:text-black transition-all backdrop-blur-sm"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>

        {/* Product Image - Static & Bigger */}
        <div className="relative max-w-4xl mx-auto">
          <img
            src={productImages[currentImageIndex]}
            alt="Jardin Botanica Tea Exfoliant Rinse"
            className="w-full h-auto object-contain mx-auto relative z-10"
            style={{ 
              maxHeight: '500px', // Reduced for more compact hero section
              filter: 'drop-shadow(0 20px 45px rgba(0, 0, 0, 0.15))'
            }}
          />
          
          {/* Enhanced shadow for bigger image */}
          <div 
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-8 w-3/4 h-10 rounded-full blur-2xl"
            style={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.18)',
              background: 'radial-gradient(ellipse, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, 0.12) 50%, transparent 100%)'
            }}
          />
        </div>

        {/* Enhanced Next Arrow */}
        <motion.button
          whileHover={{ 
            scale: 1.1,
            backgroundColor: 'rgba(162, 139, 111, 0.1)'
          }}
          whileTap={{ scale: 0.9 }}
          onClick={handleNextImage}
          className="absolute right-8 top-1/2 transform -translate-y-1/2 z-10 p-4 rounded-full text-black/60 hover:text-black transition-all backdrop-blur-sm"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6" />
        </motion.button>

        {/* Enhanced Image Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {productImages.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentImageIndex === index ? 'w-8' : ''
              }`}
              style={{
                backgroundColor: currentImageIndex === index ? '#a28b6f' : 'rgba(0, 0, 0, 0.3)'
              }}
              aria-label={`View image ${index + 1}`}
            />
          ))}
        </div>
        

      </motion.div>

      {/* Info Panels */}
      <InfoPanel
        isOpen={isRitualPanelOpen}
        onClose={() => setIsRitualPanelOpen(false)}
        title="RITUAL IN PRACTICE"
      >
        <p className="font-din-arabic text-black/80 leading-relaxed">
          Dispense a measured amount. Work slowly into damp hands, letting the exfoliating texture and black tea notes awaken the senses. Rinse away — hands refreshed, reset, and primed.
        </p>
      </InfoPanel>

      <InfoPanel
        isOpen={isActivesPanelOpen}
        onClose={() => setIsActivesPanelOpen(false)}
        title="ACTIVES & KEY BOTANICALS"
      >
        <div className="space-y-4">
          <div className="group">
            <span className="font-din-arabic text-black inline">Black Tea Extract — </span>
            <span className="font-din-arabic text-black/70 group-hover:text-black transition-colors">antioxidant-rich, energizing.</span>
          </div>
          <div className="group">
            <span className="font-din-arabic text-black inline">Colloidal Oats — </span>
            <span className="font-din-arabic text-black/70 group-hover:text-black transition-colors">natural scrubbing agent that lifts impurities gently.</span>
          </div>
          <div className="group">
            <span className="font-din-arabic text-black inline">Panthenol (Pro-Vitamin B5) — </span>
            <span className="font-din-arabic text-black/70 group-hover:text-black transition-colors">hydrates and supports skin barrier.</span>
          </div>
          <div className="group">
            <span className="font-din-arabic text-black inline">Aloe Leaf Water — </span>
            <span className="font-din-arabic text-black/70 group-hover:text-black transition-colors">refreshing, helps soothe after exfoliation.</span>
          </div>
          <div className="group">
            <span className="font-din-arabic text-black inline">Glycerin — </span>
            <span className="font-din-arabic text-black/70 group-hover:text-black transition-colors">draws in and holds moisture.</span>
          </div>
        </div>
      </InfoPanel>

      <InfoPanel
        isOpen={isFragranceNotesOpen}
        onClose={() => setIsFragranceNotesOpen(false)}
        title="FRAGRANCE NOTES"
      >
        <div className="space-y-4">
          <div className="group">
            <span className="font-din-arabic text-black inline">Top Notes — </span>
            <span className="font-din-arabic text-black/70 group-hover:text-black transition-colors">Fresh bergamot, green tea leaves, crisp cucumber.</span>
          </div>
          <div className="group">
            <span className="font-din-arabic text-black inline">Heart Notes — </span>
            <span className="font-din-arabic text-black/70 group-hover:text-black transition-colors">Black tea concentrate, white jasmine, subtle mint.</span>
          </div>
          <div className="group">
            <span className="font-din-arabic text-black inline">Base Notes — </span>
            <span className="font-din-arabic text-black/70 group-hover:text-black transition-colors">Cedarwood, soft musk, clean linen.</span>
          </div>
        </div>
      </InfoPanel>

      <InfoPanel
        isOpen={isIngredientsPanelOpen}
        onClose={() => setIsIngredientsPanelOpen(false)}
        title="FULL INGREDIENTS"
      >
        <p className="font-din-arabic text-black/70 text-sm leading-relaxed">
          Water, Sodium Laureth Sulfate, Cocamidopropyl Betaine, Black Tea Extract (Camellia Sinensis), Colloidal Oatmeal, Panthenol (Pro-Vitamin B5), Aloe Barbadensis Leaf Juice, Glycerin, Sodium Chloride, Citric Acid, Phenoxyethanol, Ethylhexylglycerin, Natural Fragrance, Tocopherol (Vitamin E).
        </p>
      </InfoPanel>
    </div>
  );
}