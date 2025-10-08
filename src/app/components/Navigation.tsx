import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { User, Search, ShoppingBag, X, Plus, Minus, Heart } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

interface NavigationProps {
  isScrolled?: boolean
  cartItems?: CartItem[]
  onCartUpdate?: (item: CartItem | null) => void
}

export function Navigation({
  isScrolled = false,
  cartItems = [],
  onCartUpdate,
}: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isNavHovered, setIsNavHovered] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isHomePage, setIsHomePage] = useState(false)
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false)
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null)
  const megaMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const cartRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const pathname = usePathname()

  // Handle component mounting and home page detection
  useEffect(() => {
    setMounted(true)
    
    const checkAndSetHomePage = () => {
      const currentPath = window.location.pathname
      const isHome = currentPath === '/in'
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

  // Cleanup mega menu timeout on unmount
  useEffect(() => {
    return () => {
      if (megaMenuTimeoutRef.current) {
        clearTimeout(megaMenuTimeoutRef.current)
      }
    }
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
      console.log('Searching for:', searchQuery)
      // Add your search logic here
    }
  }

  const handleMegaMenuOpen = (menuLabel: string) => {
    // Clear any existing timeout
    if (megaMenuTimeoutRef.current) {
      clearTimeout(megaMenuTimeoutRef.current)
    }
    setIsMegaMenuOpen(true)
    setActiveMegaMenu(menuLabel)
  }

  const handleMegaMenuClose = () => {
    // Add a small delay before closing to prevent flickering
    megaMenuTimeoutRef.current = setTimeout(() => {
      setIsMegaMenuOpen(false)
      setActiveMegaMenu(null)
    }, 150)
  }

  const handleMegaMenuEnter = () => {
    // Cancel the close timeout when mouse enters the mega menu
    if (megaMenuTimeoutRef.current) {
      clearTimeout(megaMenuTimeoutRef.current)
    }
  }

  const menuItems = [
    {
      label: 'HANDS',
      url: '/hands',
      hasMegaMenu: true,
    },
    {
      label: 'HOME CREATIONS',
      url: '/home-creations',
      hasMegaMenu: true,
    },
    {
      label: 'JOURNAL',
      url: '/blogs',
    },
    {
      label: 'THE LAB',
      url: '/the-lab',
    }
  ]



  // Determine navigation background and text styling
  const getNavStyles = () => {
    if (isHomePage) {
      // Home page: always transparent with white text, glassy on scroll/hover
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

  // Get country code from pathname
  const getCountryCode = () => {
    if (pathname) {
      const pathParts = pathname.split('/')
      return pathParts[1] || 'in'
    }
    return 'in'
  }

  const countryCode = getCountryCode()

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50">
        {/* Top Shipping Bar */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
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
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
          className="group/nav"
          onMouseEnter={() => setIsNavHovered(true)}
          onMouseLeave={() => setIsNavHovered(false)}
          style={{
            backgroundColor: navStyles.backgroundColor,
            backdropFilter: navStyles.backdropFilter,
            WebkitBackdropFilter: navStyles.WebkitBackdropFilter,
            borderBottom: navStyles.borderBottom,
            transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex w-full"
        >
          <a href="/" className="">
            <img
              src={navStyles.logoSrc}
              alt="Jardin Botanica Logo"
              width={200}
              height={60}
              className="transition-all duration-300"
            />
          </a>
        </motion.div>

        {/* Absolutely Centered Navigation Menu */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="hidden lg:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2 gap-6"
        >
          {menuItems.map((item, index) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => {
                if (item.hasMegaMenu) {
                  handleMegaMenuOpen(item.label)
                }
              }}
              onMouseLeave={() => {
                if (item.hasMegaMenu) {
                  handleMegaMenuClose()
                }
              }}
            >
              <motion.a
                href={item.url}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
                className="font-light text-sm tracking-widest transition-all duration-300 relative group hover:opacity-80 whitespace-nowrap px-1 block"
                style={{ color: navStyles.textColor }}
              >
                {item.label}
                <span
                  className="absolute bottom-[-4px] left-0 w-0 h-px bg-orange-400 transition-all duration-500 group-hover:w-full"
                ></span>
              </motion.a>
            </div>
          ))}
        </motion.div>

        {/* Mega Menu */}
        <AnimatePresence>
          {isMegaMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="absolute top-full left-0 right-0 shadow-lg z-40"
              style={{ 
                backgroundColor: '#e3e3d8',
                borderTop: '1px solid rgba(0, 0, 0, 0.1)' 
              }}
              onMouseEnter={handleMegaMenuEnter}
              onMouseLeave={handleMegaMenuClose}
            >
              <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
                {/* HANDS Mega Menu */}
                {activeMegaMenu === 'HANDS' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Cedar Bloom Card */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1, duration: 0.4 }}
                      className="group cursor-pointer"
                    >
                      <Link href="/products/cedarbloom">
                        <div className="bg-transparent hover:bg-white hover:bg-opacity-15 transition-all duration-300 group cursor-pointer p-4 rounded-lg border-b-0 hover:border-b-2 hover:border-orange-400"
                             onMouseEnter={(e) => {
                               e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'
                             }}
                             onMouseLeave={(e) => {
                               e.currentTarget.style.backgroundColor = 'transparent'
                             }}>
                          <div className="flex flex-col">
                            <div className="w-full h-56 overflow-hidden mb-4 rounded-lg">
                              <img
                                src="/assets/botanicalLeaves.png"
                                alt="Cedar Bloom Collection"
                                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                            <div className="text-left">
                              <p className="font-din-arabic text-black text-opacity-60 font-light text-xs mb-2 tracking-wide uppercase">
                                Hand Care
                              </p>
                              <h3 className="font-din-arabic text-black font-light text-lg mb-3 leading-tight">
                                Cedar Bloom Collection
                              </h3>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>

                    {/* Hand Lotion Card */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                      className="group cursor-pointer"
                    >
                      <Link href="/products/handlotion">
                        <div className="bg-transparent hover:bg-white hover:bg-opacity-15 transition-all duration-300 group cursor-pointer p-4 rounded-lg border-b-0 hover:border-b-2 hover:border-orange-400"
                             onMouseEnter={(e) => {
                               e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'
                             }}
                             onMouseLeave={(e) => {
                               e.currentTarget.style.backgroundColor = 'transparent'
                             }}>
                          <div className="flex flex-col">
                            <div className="w-full h-56 overflow-hidden mb-4 rounded-lg">
                              <img
                                src="/assets/handLotion.png"
                                alt="Hand Lotion"
                                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                            <div className="text-left">
                              <p className="font-din-arabic text-black text-opacity-60 font-light text-xs mb-2 tracking-wide uppercase">
                                Hand Care
                              </p>
                              <h3 className="font-din-arabic text-black font-light text-lg mb-3 leading-tight">
                                Hand Lotion
                              </h3>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  </div>
                )}

                {/* HOME CREATIONS Mega Menu */}
                {activeMegaMenu === 'HOME CREATIONS' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Cleaners Card */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1, duration: 0.4 }}
                      className="group cursor-pointer"
                    >
                      <Link href="/products/cleaners">
                        <div className="bg-transparent hover:bg-white hover:bg-opacity-15 transition-all duration-300 group cursor-pointer p-4 rounded-lg border-b-0 hover:border-b-2 hover:border-orange-400"
                             onMouseEnter={(e) => {
                               e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'
                             }}
                             onMouseLeave={(e) => {
                               e.currentTarget.style.backgroundColor = 'transparent'
                             }}>
                          <div className="flex flex-col">
                            <div className="w-full h-56 overflow-hidden mb-4 rounded-lg">
                              <img
                                src="/assets/handwashImg.png"
                                alt="Cleaners"
                                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                            <div className="text-left">
                              <p className="font-din-arabic text-black text-opacity-60 font-light text-xs mb-2 tracking-wide uppercase">
                                Home Creations
                              </p>
                              <h3 className="font-din-arabic text-black font-light text-lg mb-3 leading-tight">
                                Cleaners
                              </h3>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>

                    {/* Exfoliants Card */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                      className="group cursor-pointer"
                    >
                      <Link href="/products/exfoliants">
                        <div className="bg-transparent hover:bg-white hover:bg-opacity-15 transition-all duration-300 group cursor-pointer p-4 rounded-lg border-b-0 hover:border-b-2 hover:border-orange-400"
                             onMouseEnter={(e) => {
                               e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'
                             }}
                             onMouseLeave={(e) => {
                               e.currentTarget.style.backgroundColor = 'transparent'
                             }}>
                          <div className="flex flex-col">
                            <div className="w-full h-56 overflow-hidden mb-4 rounded-lg">
                              <img
                                src="/assets/handCareImage.png"
                                alt="Exfoliants"
                                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                            <div className="text-left">
                              <p className="font-din-arabic text-black text-opacity-60 font-light text-xs mb-2 tracking-wide uppercase">
                                Home Creations
                              </p>
                              <h3 className="font-din-arabic text-black font-light text-lg mb-3 leading-tight">
                                Exfoliants
                              </h3>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex items-center gap-6"
        >
          {/* Search Section */}
          <div className="relative flex items-center" ref={searchRef}>
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
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSearchToggle}
              className="p-2 transition-all duration-300"
              style={{ color: navStyles.textColor }}
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </motion.button>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
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
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 transition-all duration-300"
            style={{ color: navStyles.textColor }}
            aria-label="Profile"
          >
            <a href="/account">
              <User className="w-5 h-5" />
            </a>
          </motion.button>

          <div className="relative" ref={cartRef}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
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
                            {item.image && (
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
                       <Link href={`/${countryCode}/cart`}>
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
      </div>
    </>
  )
}