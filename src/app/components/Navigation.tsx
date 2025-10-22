import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { User, Search, ShoppingBag, X, Plus, Minus, Heart, Menu, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  isRitualProduct?: boolean
}

interface NavigationProps {
  isScrolled?: boolean
  cartItems?: CartItem[]
  onCartUpdate?: (item: CartItem | null) => void
  onDropdownChange?: (isOpen: boolean) => void
  disableSticky?: boolean
  disableAnimations?: boolean
  forceWhiteText?: boolean
}

export function Navigation({
  isScrolled = false,
  cartItems = [],
  onCartUpdate,
  onDropdownChange,
  disableSticky = false,
  disableAnimations = false,
  forceWhiteText = false,
}: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isNavHovered, setIsNavHovered] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isHomePage, setIsHomePage] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [mobileActiveDropdown, setMobileActiveDropdown] = useState<string | null>(null)
  const cartRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Handle component mounting and home page detection
  useEffect(() => {
    setMounted(true)
    
    const checkAndSetHomePage = () => {
      const currentPath = window.location.pathname
      // Check if it's home page or category page (should have white text navigation)
      const isHome = currentPath === '/in' || 
                     currentPath === '/in/' || 
                     currentPath.includes('/category') ||
                     currentPath.endsWith('/category') ||
                     currentPath.includes('/in/category')
      setIsHomePage(isHome)
      
      // Set body class for CSS styling
      if (isHome) {
        document.body.classList.add('home-page')
      } else {
        document.body.classList.remove('home-page')
      }
    }
    
    // Initial check
    checkAndSetHomePage()
    
    // Listen for navigation changes
    const handleNavigation = () => {
      setTimeout(checkAndSetHomePage, 10)
    }
    
    // Listen for visibility change (tab switching)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setTimeout(checkAndSetHomePage, 10)
      }
    }
    
    // Listen for focus events (tab switching fallback)
    const handleFocus = () => {
      setTimeout(checkAndSetHomePage, 10)
    }
    
    window.addEventListener('popstate', handleNavigation)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)
    
    // Also listen for route changes in Next.js
    const handleRouteChange = () => {
      setTimeout(checkAndSetHomePage, 10)
    }
    
    // If Next.js router is available
    if (typeof window !== 'undefined' && window.history) {
      const originalPushState = window.history.pushState
      const originalReplaceState = window.history.replaceState
      
      window.history.pushState = function(...args) {
        originalPushState.apply(this, args)
        handleRouteChange()
      }
      
      window.history.replaceState = function(...args) {
        originalReplaceState.apply(this, args)
        handleRouteChange()
      }
    }
    
    return () => {
      window.removeEventListener('popstate', handleNavigation)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
      document.body.classList.remove('home-page')
      // Clean up any blur overlays
      const blurOverlay = document.getElementById('dropdown-blur-overlay')
      if (blurOverlay && blurOverlay.parentNode) {
        blurOverlay.parentNode.removeChild(blurOverlay)
      }
      
      // Reset navigation styles
      const navigationElement = document.querySelector('nav') as HTMLElement
      if (navigationElement) {
        navigationElement.style.zIndex = ''
        navigationElement.style.position = ''
      }
    }
  }, [])

  // Close cart and search when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsCartOpen(false)
      }
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Handle escape key to close search
  useEffect(() => {
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsSearchOpen(false)
        setSearchQuery('')
      }
    }

    document.addEventListener('keydown', handleEscapeKey)
    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [])

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchOpen])

  // Preload dropdown images for instant display
  useEffect(() => {
    menuItems.forEach(item => {
      if (item.dropdown) {
        item.dropdown.forEach(dropdownItem => {
          if (dropdownItem.image) {
            const img = new window.Image()
            img.src = dropdownItem.image
          }
        })
      }
    })
  }, [])

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    )
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const handleQuantityChange = (itemId: string, change: number) => {
    const item = cartItems.find((item) => item.id === itemId)
    if (item && onCartUpdate) {
      const newQuantity = Math.max(0, item.quantity + change)
      onCartUpdate({
        ...item,
        quantity: newQuantity,
      })
    }
  }

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen)
    if (isSearchOpen) {
      setSearchQuery('')
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Handle search functionality here
      // Add your search logic here
    }
  }

  const handleMouseEnter = (itemName: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current)
      dropdownTimeoutRef.current = null
    }
    setActiveDropdown(itemName)
    setHoveredItem(null) // Reset hovered item when opening a new dropdown
    onDropdownChange?.(true)
    
    // Add overlay blur effect instead of direct element blur
    const navigationElement = document.querySelector('nav') as HTMLElement
    
    // Keep navigation sharp and on top
    if (navigationElement) {
      navigationElement.style.filter = 'none'
      navigationElement.style.zIndex = '60'
      navigationElement.style.position = 'relative'
    }
    
    // Create a blur overlay instead of blurring elements directly
    let blurOverlay = document.getElementById('dropdown-blur-overlay')
    if (!blurOverlay) {
      blurOverlay = document.createElement('div')
      blurOverlay.id = 'dropdown-blur-overlay'
      blurOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        backdrop-filter: blur(2px);
        background: rgba(0, 0, 0, 0.1);
        z-index: 45;
        pointer-events: none;
        transition: opacity 0.2s ease-out;
        opacity: 0;
      `
      document.body.appendChild(blurOverlay)
    }
    
    // Show the blur overlay
    setTimeout(() => {
      if (blurOverlay) {
        blurOverlay.style.opacity = '1'
      }
    }, 10)
  }

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null)
      setHoveredItem(null)
      onDropdownChange?.(false)
      
      // Remove blur overlay when dropdown closes
      const blurOverlay = document.getElementById('dropdown-blur-overlay')
      if (blurOverlay) {
        blurOverlay.style.opacity = '0'
        setTimeout(() => {
          if (blurOverlay && blurOverlay.parentNode) {
            blurOverlay.parentNode.removeChild(blurOverlay)
          }
        }, 200) // Wait for transition to complete
      }
      
      // Reset navigation styles
      const navigationElement = document.querySelector('nav') as HTMLElement
      if (navigationElement) {
        navigationElement.style.zIndex = ''
        navigationElement.style.position = ''
      }
    }, 100) // Reduced for faster, smoother response
  }

  const handleDropdownItemHover = (itemLabel: string) => {
    setHoveredItem(itemLabel)
  }

  // Define menu items with dropdown structure
  const menuItems = [
    {
      name: 'BODY & HANDS',
      dropdown: [
        { 
          label: 'Cleansers & Exfoliants', 
          href: '/products/cleansersexfoliants',
          image: 'https://images.unsplash.com/photo-1743597979473-5b1c0cae1bce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3RhbmljYWwlMjBoYW5kJTIwY3JlYW0lMjBsb3Rpb258ZW58MXx8fHwxNzU5NzQ5NDg0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
        },
        { 
          label: 'Lotions & Moisturisers', 
          href: '/products/cedarbloom',
          image: 'https://images.unsplash.com/photo-1660675558428-5a7a1b8546f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBoYW5kJTIwbG90aW9uJTIwbW9pc3R1cml6ZXJ8ZW58MXx8fHwxNzU5NzY4OTIwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
        }
      ]
    },
    {
      name: 'HOME CREATIONS',
      dropdown: [
        { 
          label: 'Candles', 
          href: '#',
          image: 'https://images.unsplash.com/photo-1648310379950-2773bb5d2525?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3Jlc3QlMjBzY2VudGVkJTIwY2FuZGxlfGVufDF8fHx8MTc1OTc2OTE1NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
        },
        { 
          label: 'Lava Rock Diffusers', 
          href: '#',
          image: 'https://images.unsplash.com/photo-1747198919508-a7657e63d4f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXZhJTIwcm9jayUyMGRpZmZ1c2VyJTIwYXJvbWF0aGVyYXB5fGVufDF8fHx8MTc1OTc2ODkyMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
        }
      ]
    },
    { name: 'JOURNAL', href: '/blogs' },
    { name: 'BOTANIST\'S LAB', href: '/the-lab' }
  ]



  // Determine navigation background and text styling
  const getNavStyles = () => {
    if (isHomePage || forceWhiteText) {
      // Home page or forced white text: always transparent with white text, glassy on scroll/hover
      if (isScrolled || isNavHovered) {
        return {
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(12px) saturate(200%)',
          WebkitBackdropFilter: 'blur(12px) saturate(200%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          textColor: 'white',
          logoSrc: '/assets/Jardinlogo.svg'
        }
      }
      return {
        backgroundColor: 'transparent',
        backdropFilter: 'none',
        WebkitBackdropFilter: 'none',
        borderBottom: 'none',
        textColor: 'white',
        logoSrc: '/assets/Jardinlogo.svg'
      }
    } else {
      // Non-home pages
      if (isNavHovered) {
        // Hovered: pure black background with white text (takes priority over scroll)
        return {
          backgroundColor: '#000000',
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          textColor: 'white',
          logoSrc: '/assets/Jardinlogo.svg'
        }
      } else if (isScrolled) {
        // Scrolled: glassy background with white text
        return {
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(12px) saturate(200%)',
          WebkitBackdropFilter: 'blur(12px) saturate(200%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          textColor: 'white',
          logoSrc: '/assets/Jardinlogo.svg'
        }
      } else {
        // Default: transparent with black text
        return {
          backgroundColor: 'transparent',
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none',
          borderBottom: 'none',
          textColor: 'black',
          logoSrc: '/assets/Jardinlogoblack.svg'
        }
      }
    }
  }

  const navStyles = getNavStyles()

  return (
    <>
      <div className={disableSticky ? "relative" : "fixed top-0 left-0 right-0 z-50"}>
        {/* Top Shipping Bar */}
        <motion.div
          initial={disableAnimations ? false : { y: -50, opacity: 0 }}
          animate={disableAnimations ? false : { y: 0, opacity: 1 }}
          transition={disableAnimations ? {} : { duration: 0.6, ease: 'easeOut' }}
          className="text-white py-2"
          style={{ backgroundColor: '#545d4a' }}
        >
          <div className="px-6 lg:px-12">
            <div className="flex justify-center">
              <p className="font-din-arabic text-xs tracking-wider whitespace-nowrap">
                Complimentary shipping on orders above ₹2500
              </p>
            </div>
          </div>
        </motion.div>

        {/* Main Navigation */}
        <motion.nav
          initial={disableAnimations ? false : { y: -100 }}
          animate={disableAnimations ? false : { y: 0 }}
          transition={disableAnimations ? {} : { duration: 0.8, ease: 'easeOut', delay: 0.3 }}
          className="group/nav"
          onMouseEnter={() => setIsNavHovered(true)}
          onMouseLeave={() => setIsNavHovered(false)}
          style={{
            backgroundColor: navStyles.backgroundColor,
            backdropFilter: navStyles.backdropFilter,
            WebkitBackdropFilter: navStyles.WebkitBackdropFilter,
            borderBottom: navStyles.borderBottom,
            transition: disableAnimations ? 'none' : 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            position: 'relative',
          }}
        >
          {/* Glassy overlay effect */}
          {(isScrolled || isNavHovered) && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.02) 100%)',
                pointerEvents: 'none',
                zIndex: 1,
              }}
            />
          )}
          <div className="px-6 lg:px-12 relative z-20">
      <div className="flex items-center justify-between py-4 relative">
        {/* Logo */}
        <motion.div
          initial={disableAnimations ? false : { opacity: 0 }}
          animate={disableAnimations ? false : { opacity: 1 }}
          transition={disableAnimations ? {} : { delay: 0.3, duration: 0.6 }}
          className="flex w-full"
        >
          <a href="/" className="">
            <img
              src={navStyles.logoSrc}
              alt="Jardin Botanica Logo"
              width={250}
              height={30}
              className="transition-all duration-300"
            />
          </a>
        </motion.div>

        {/* Absolutely Centered Navigation Menu */}
        <motion.div
          initial={disableAnimations ? false : { opacity: 0 }}
          animate={disableAnimations ? false : { opacity: 1 }}
          transition={disableAnimations ? {} : { delay: 0.4, duration: 0.6 }}
          className="hidden lg:flex space-x-8 absolute left-1/2 transform -translate-x-1/2"
        >
          {menuItems.map((item, index) => (
            <div 
              key={item.name}
              className="relative"
              style={index === 0 ? { marginRight: 0 } : {}}
              onMouseEnter={() => item.dropdown && handleMouseEnter(item.name)}
              onMouseLeave={handleMouseLeave}
            >
              <motion.a
                href={item.href || '#'}
                initial={disableAnimations ? false : { opacity: 0, y: -10 }}
                animate={disableAnimations ? false : { opacity: 1, y: 0 }}
                transition={disableAnimations ? {} : { delay: 0.4 + index * 0.1, duration: 0.4 }}
                className="font-din-arabic text-sm tracking-wider transition-all duration-300 relative group/item hover:opacity-80 whitespace-nowrap"
                style={{ color: navStyles.textColor }}
              >
                {item.name}
                <span 
                  className="absolute bottom-[-4px] left-0 w-0 h-[1px] transition-all duration-500 group-hover/item:w-full"
                  style={{ backgroundColor: '#e58a4d' }}
                ></span>
              </motion.a>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {item.dropdown && activeDropdown === item.name && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ 
                      duration: 0.2, 
                      ease: 'easeOut'
                    }}
                    className="absolute top-full left-0 pt-4 z-50"
                  >
                    <div 
                      className="border shadow-2xl overflow-hidden"
                      style={{ 
                        backgroundColor: '#e3e3d8',
                        borderColor: 'rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      <div className="flex h-72">
                        {/* Menu Items */}
                        <div className="py-6 w-80 flex flex-col">
                          {item.dropdown.map((dropdownItem, idx) => (
                            <a
                              key={idx}
                              href={dropdownItem.href}
                              className="group/dropdown-item block px-8 py-4 font-american-typewriter tracking-wide transition-all duration-150 relative"
                              style={{
                                color: '#000000',
                                fontSize: '0.95rem'
                              }}
                              onMouseEnter={() => {
                                handleDropdownItemHover(dropdownItem.label)
                              }}
                            >
                              <span className="relative inline-block">
                                {dropdownItem.label}
                                <span 
                                  className="absolute bottom-[-2px] left-0 w-0 h-[1px] transition-all duration-300 group-hover/dropdown-item:w-full"
                                  style={{ backgroundColor: '#e58a4d' }}
                                ></span>
                              </span>
                            </a>
                          ))}
                        </div>
                        
                        {/* Individual Dropdown Images */}
                        <div className="w-96 h-full overflow-hidden relative p-4" style={{ backgroundColor: '#e3e3d8' }}>
                          {item.dropdown.map((dropdownItem, idx) => (
                            <img
                              key={dropdownItem.label}
                              src={dropdownItem.image}
                              alt={dropdownItem.label}
                              className="absolute inset-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)] object-cover pointer-events-none rounded"
                              style={{ 
                                opacity: hoveredItem === dropdownItem.label ? 1 : 0,
                                transition: 'opacity 0.2s ease-out',
                                zIndex: hoveredItem === dropdownItem.label ? 2 : 1
                              }}
                              loading="eager"
                            />
                          ))}
                          {item.dropdown[0]?.image && (
                            <img
                              key="default"
                              src={item.dropdown[0].image}
                              alt={item.dropdown[0].label}
                              className="absolute inset-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)] object-cover pointer-events-none rounded"
                              style={{ 
                                opacity: !hoveredItem ? 1 : 0,
                                transition: 'opacity 0.2s ease-out',
                                zIndex: 0
                              }}
                              loading="eager"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>

        {/* Mobile Menu Toggle */}
        <motion.div
          initial={disableAnimations ? false : { opacity: 0 }}
          animate={disableAnimations ? false : { opacity: 1 }}
          transition={disableAnimations ? {} : { delay: 0.7, duration: 0.6 }}
          className="lg:hidden flex items-center space-x-4"
        >
          <motion.button
            whileHover={disableAnimations ? {} : { scale: 1.1 }}
            whileTap={disableAnimations ? {} : { scale: 0.9 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 transition-all duration-300"
            style={{ color: navStyles.textColor }}
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
          
          <div className="relative" ref={cartRef}>
            <motion.button
              whileHover={disableAnimations ? {} : { scale: 1.1 }}
              whileTap={disableAnimations ? {} : { scale: 0.9 }}
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="p-2 transition-all duration-300"
              style={{ color: navStyles.textColor }}
              aria-label="Shopping bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {getTotalItems() > 0 && (
                <span 
                  className="absolute -top-1 -right-1 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-din-arabic"
                  style={{ backgroundColor: '#e58a4d' }}
                >
                  {getTotalItems()}
                </span>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Desktop Actions */}
        <motion.div
          initial={disableAnimations ? false : { opacity: 0 }}
          animate={disableAnimations ? false : { opacity: 1 }}
          transition={disableAnimations ? {} : { delay: 0.7, duration: 0.6 }}
          className="hidden lg:flex items-center space-x-6"
        >
          {/* Search Section */}
          <div className="relative flex items-center" ref={searchRef} style={{margin:0}}>
            <AnimatePresence>
              {isSearchOpen && (
                <motion.form
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 'auto', opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  onSubmit={handleSearchSubmit}
                  className="mr-3 overflow-hidden"
                >
                  <motion.input
                    ref={searchInputRef}
                    initial={{ width: 0 }}
                    animate={{ width: 200 }}
                    exit={{ width: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="px-3 py-2 bg-transparent border-b border-opacity-30 transition-all duration-300 focus:outline-none placeholder-opacity-70 font-light"
                    style={{ 
                      color: navStyles.textColor,
                      borderColor: navStyles.textColor === 'white' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'
                    }}
                  />
                </motion.form>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={disableAnimations ? {} : { scale: 1.1 }}
              whileTap={disableAnimations ? {} : { scale: 0.9 }}
              onClick={handleSearchToggle}
              className="p-2 transition-all duration-300" 
              style={{ color: navStyles.textColor }}
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </motion.button>
          </div>

          <motion.button
            whileHover={disableAnimations ? {} : { scale: 1.1 }}
            whileTap={disableAnimations ? {} : { scale: 0.9 }}
            onClick={() => setIsWishlisted(!isWishlisted)}
            className="p-2 transition-all duration-300"
            style={{ color: isWishlisted ? '#e58a4d' : navStyles.textColor }}
            aria-label="Favorites"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isWishlisted ? 'fill-current' : ''
              }`}
            />
          </motion.button>

          {/* Profile Icon */}
          <motion.button
            whileHover={disableAnimations ? {} : { scale: 1.1 }}
            whileTap={disableAnimations ? {} : { scale: 0.9 }}
            className="p-2 transition-all duration-300"
            style={{ color: navStyles.textColor }}
            aria-label="Profile"
          >
            <a href="/profile">
              <User className="w-5 h-5" />
            </a>
          </motion.button>

          <div className="relative" ref={cartRef}>
            <motion.button
              whileHover={disableAnimations ? {} : { scale: 1.1 }}
              whileTap={disableAnimations ? {} : { scale: 0.9 }}
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="p-2 transition-all duration-300 relative"
              style={{ color: navStyles.textColor }}
              aria-label="Shopping bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {getTotalItems() > 0 && (
                <span
                  className="absolute -top-1 -right-1 bg-orange-400 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-light"
                >
                  {getTotalItems()}
                </span>
              )}
            </motion.button>

            {/* Cart Dropdown */}
            <AnimatePresence>
              {isCartOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-96 border border-black border-opacity-10 shadow-2xl z-50"
                  style={{ backgroundColor: '#e3e3d8' }}
                >
                  {/* Cart Header */}
                  <div className="p-4 border-b border-black border-opacity-10">
                    <div className="flex items-center justify-between">
                      <h3 className="font-american-typewriter text-lg text-black">
                        Your Cart
                      </h3>
                      <button
                        onClick={() => setIsCartOpen(false)}
                        className="p-1 transition-colors rounded"
                        style={{ 
                          '--hover-bg': 'rgb(0 0 0 / 7%)'
                        } as React.CSSProperties}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(0 0 0 / 7%)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <X className="w-4 h-4 text-black text-opacity-70" />
                      </button>
                    </div>
                  </div>

                  {/* Cart Content */}
                  <div className="max-h-96 overflow-y-auto">
                    {cartItems.length === 0 ? (
                      // Empty Cart State
                      <div className="p-8 text-center">
                        <div className="mb-4">
                          <ShoppingBag className="w-12 h-12 text-black text-opacity-30 mx-auto" />
                        </div>
                        <p className="font-din-arabic text-black text-opacity-70 mb-4">
                          Nothing is in your cart
                        </p>
                        <button
                          onClick={() => setIsCartOpen(false)}
                          className="px-6 py-2 bg-black text-white hover:bg-opacity-90 transition-colors tracking-wide font-din-arabic"
                        >
                          Continue Shopping
                        </button>
                      </div>
                    ) : (
                      // Cart Items
                      <div className="p-4 space-y-4">
                        {cartItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 p-3 border border-black border-opacity-5"
                            style={{ backgroundColor: '#f1f1ec' }}
                          >
                            {/* Only show image for ritual products */}
                            {item.isRitualProduct && item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-16 object-cover"
                              />
                            )}
                            <div className="flex-1">
                              <h4 className="font-din-arabic text-black">
                                {item.name}
                              </h4>
                              <p className="font-din-arabic text-black text-opacity-70 text-sm">
                                ₹{item.price}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  handleQuantityChange(item.id, -1)
                                }
                                className="p-1 transition-colors rounded"
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(0 0 0 / 7%)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                              >
                                <Minus className="w-3 h-3 text-black text-opacity-70" />
                              </button>
                              <span className="font-din-arabic text-black text-sm min-w-[20px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleQuantityChange(item.id, 1)
                                }
                                className="p-1 transition-colors rounded"
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(0 0 0 / 7%)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                              >
                                <Plus className="w-3 h-3 text-black text-opacity-70" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Cart Footer */}
                  {cartItems.length > 0 && (
                    <div className="p-4 border-t border-black border-opacity-10">
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-din-arabic text-black">
                          Total: 
                        </span>
                        <span className="font-din-arabic text-black">
                          ₹{getTotalPrice()}
                        </span>
                      </div>
                      <div className="space-y-2 text-center">
                       <Link href={"/cart"}>
                        <button className="w-full py-3 bg-black text-white hover:bg-opacity-90 transition-colors tracking-wide text-center font-din-arabic">
                          Checkout
                        </button>
                       </Link>
                        <button
                          onClick={() => setIsCartOpen(false)}
                          className="w-full py-2 border border-black border-opacity-20 text-black transition-colors tracking-wide text-center font-din-arabic"
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(0 0 0 / 7%)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          Continue Shopping
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
        </motion.nav>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ top: '90px' }} // Below the header
              />
              
              {/* Menu Content */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed right-0 top-[90px] bottom-0 w-full max-w-sm z-50 overflow-y-auto lg:hidden"
                style={{ backgroundColor: '#e3e3d8' }}
              >
                <div className="p-6">
                  {/* Mobile Navigation Links */}
                  <nav className="space-y-1">
                    {menuItems.map((item) => (
                      <div key={item.name}>
                        {item.dropdown ? (
                          <div>
                            <button
                              onClick={() => setMobileActiveDropdown(
                                mobileActiveDropdown === item.name ? null : item.name
                              )}
                              className="w-full flex items-center justify-between px-4 py-4 text-black font-din-arabic tracking-wider hover:bg-black/5 transition-colors"
                            >
                              <span>{item.name}</span>
                              <ChevronDown 
                                className={`w-4 h-4 transition-transform ${
                                  mobileActiveDropdown === item.name ? 'rotate-180' : ''
                                }`}
                              />
                            </button>
                            <AnimatePresence>
                              {mobileActiveDropdown === item.name && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden"
                                >
                                  <div className="pl-4 py-2 space-y-1">
                                    {item.dropdown.map((dropdownItem) => (
                                      <a
                                        key={dropdownItem.label}
                                        href={dropdownItem.href}
                                        className="block px-4 py-3 text-black/70 font-din-arabic tracking-wide hover:bg-black/5 transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                      >
                                        {dropdownItem.label}
                                      </a>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ) : (
                          <a
                            href={item.href}
                            className="block px-4 py-4 text-black font-din-arabic tracking-wider hover:bg-black/5 transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {item.name}
                          </a>
                        )}
                      </div>
                    ))}
                  </nav>

                  {/* Mobile Search */}
                  <div className="mt-8 pt-6 border-t" style={{ borderColor: 'rgba(0, 0, 0, 0.1)' }}>
                    <form onSubmit={handleSearchSubmit} className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search..."
                        className="w-full px-4 py-3 bg-white/50 border font-din-arabic tracking-wide focus:outline-none focus:border-black transition-colors"
                        style={{ borderColor: 'rgba(0, 0, 0, 0.1)' }}
                      />
                      <button
                        type="submit"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-black/50 hover:text-black transition-colors"
                      >
                        <Search className="w-5 h-5" />
                      </button>
                    </form>
                  </div>

                  {/* Mobile Actions */}
                  <div className="mt-6 space-y-3">
                    <button
                      onClick={() => {
                        setIsWishlisted(!isWishlisted)
                      }}
                      className="w-full flex items-center justify-between px-4 py-3 border text-black font-din-arabic tracking-wide hover:bg-black hover:text-white transition-all duration-300"
                      style={{ borderColor: '#D8D2C7' }}
                    >
                      <span>Wishlist</span>
                      <Heart 
                        className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`}
                        style={{ color: isWishlisted ? '#e58a4d' : 'currentColor' }}
                      />
                    </button>
                    
                    <a
                      href="/profile"
                      className="w-full flex items-center justify-between px-4 py-3 border text-black font-din-arabic tracking-wide hover:bg-black hover:text-white transition-all duration-300"
                      style={{ borderColor: '#D8D2C7' }}
                    >
                      <span>Account</span>
                      <User className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Mobile Cart Dropdown - Separate from desktop */}
        <AnimatePresence>
          {isCartOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed right-4 top-[90px] w-[calc(100%-2rem)] max-w-sm bg-white border border-black/10 shadow-2xl z-50"
              style={{ backgroundColor: '#e3e3d8' }}
            >
              {/* Cart Header */}
              <div className="p-4 border-b border-black/10">
                <div className="flex items-center justify-between">
                  <h3 className="font-american-typewriter text-lg text-black">Your Cart</h3>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="p-1 hover:bg-black/10 transition-colors rounded"
                  >
                    <X className="w-4 h-4 text-black/70" />
                  </button>
                </div>
              </div>

              {/* Cart Content */}
              <div className="max-h-[60vh] overflow-y-auto">
                {cartItems.length === 0 ? (
                  // Empty Cart State
                  <div className="p-8 text-center">
                    <div className="mb-4">
                      <ShoppingBag className="w-12 h-12 text-black/30 mx-auto" />
                    </div>
                    <p className="font-din-arabic text-black/70 mb-4">Nothing is in your cart</p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="font-din-arabic px-6 py-2 bg-black text-white hover:bg-black/90 transition-colors tracking-wide"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  // Cart Items
                  <div className="p-4 space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3 p-3 bg-white/50 border border-black/5">
                        {/* Only show image for ritual products */}
                        {item.isRitualProduct && item.image && (
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-16 h-16 object-cover"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-din-arabic text-black font-medium truncate">{item.name}</h4>
                          <p className="font-din-arabic text-black/70 text-sm">₹{item.price}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleQuantityChange(item.id, -1)}
                            className="p-1 hover:bg-black/10 transition-colors rounded"
                          >
                            <Minus className="w-3 h-3 text-black/70" />
                          </button>
                          <span className="font-din-arabic text-black text-sm min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => handleQuantityChange(item.id, 1)}
                            className="p-1 hover:bg-black/10 transition-colors rounded"
                          >
                            <Plus className="w-3 h-3 text-black/70" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cart Footer */}
              {cartItems.length > 0 && (
                <div className="p-4 border-t border-black/10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-din-arabic text-black">Total:</span>
                    <span className="font-din-arabic text-black font-medium">₹{getTotalPrice()}</span>
                  </div>
                  <div className="space-y-2 text-center">
                    <Link href="/cart">
                      <button className="w-full font-din-arabic py-3 bg-black text-white hover:bg-black/90 transition-colors tracking-wide text-center">
                        Checkout
                      </button>
                    </Link>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="w-full font-din-arabic py-2 border border-black/20 text-black hover:bg-black/5 transition-colors tracking-wide text-center"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}