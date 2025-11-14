// import React, { useState, useEffect, useRef } from 'react'
// import { motion, AnimatePresence } from 'motion/react'
// import { User, Search, ShoppingBag, X, Plus, Minus, Heart } from 'lucide-react'
// import Link from 'next/link'
// import Image from 'next/image'

// interface CartItem {
//   id: string
//   name: string
//   price: number
//   quantity: number
//   image?: string
// }

// interface NavigationProps {
//   isScrolled?: boolean
//   cartItems?: CartItem[]
//   onCartUpdate?: (item: CartItem | null) => void
// }

// export function Navigation({
//   isScrolled = false,
//   cartItems = [],
//   onCartUpdate,
// }: NavigationProps) {
//   const [isMenuOpen, setIsMenuOpen] = useState(false)
//   const [isCartOpen, setIsCartOpen] = useState(false)
//   const [isWishlisted, setIsWishlisted] = useState(false)
//   const [isSearchOpen, setIsSearchOpen] = useState(false)
//   const [searchQuery, setSearchQuery] = useState('')
//   const [isNavHovered, setIsNavHovered] = useState(false)
//   const [mounted, setMounted] = useState(false)
//   const [isHomePage, setIsHomePage] = useState(false)
//   const cartRef = useRef<HTMLDivElement>(null)
//   const searchRef = useRef<HTMLDivElement>(null)
//   const searchInputRef = useRef<HTMLInputElement>(null)

//   // Handle component mounting and home page detection
//   useEffect(() => {
//     setMounted(true)
    
//     const checkAndSetHomePage = () => {
//       const currentPath = window.location.pathname
//       const isHome = currentPath === '/in'
//       setIsHomePage(isHome)
      
//       // Set body class for CSS styling
//       if (isHome) {
//         document.body.classList.add('home-page')
//       } else {
//         document.body.classList.remove('home-page')
//       }
//     }
    
//     // Initial check
//     checkAndSetHomePage()
    
//     // Listen for navigation changes
//     const handleNavigation = () => {
//       setTimeout(checkAndSetHomePage, 10)
//     }
    
//     // Listen for visibility change (tab switching)
//     const handleVisibilityChange = () => {
//       if (!document.hidden) {
//         setTimeout(checkAndSetHomePage, 10)
//       }
//     }
    
//     // Listen for focus events (tab switching fallback)
//     const handleFocus = () => {
//       setTimeout(checkAndSetHomePage, 10)
//     }
    
//     window.addEventListener('popstate', handleNavigation)
//     document.addEventListener('visibilitychange', handleVisibilityChange)
//     window.addEventListener('focus', handleFocus)
    
//     // Also listen for route changes in Next.js
//     const handleRouteChange = () => {
//       setTimeout(checkAndSetHomePage, 10)
//     }
    
//     // If Next.js router is available
//     if (typeof window !== 'undefined' && window.history) {
//       const originalPushState = window.history.pushState
//       const originalReplaceState = window.history.replaceState
      
//       window.history.pushState = function(...args) {
//         originalPushState.apply(this, args)
//         handleRouteChange()
//       }
      
//       window.history.replaceState = function(...args) {
//         originalReplaceState.apply(this, args)
//         handleRouteChange()
//       }
//     }
    
//     return () => {
//       window.removeEventListener('popstate', handleNavigation)
//       document.removeEventListener('visibilitychange', handleVisibilityChange)
//       window.removeEventListener('focus', handleFocus)
//       document.body.classList.remove('home-page')
//     }
//   }, [])

//   // Close cart and search when clicking outside
//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
//         setIsCartOpen(false)
//       }
//       if (
//         searchRef.current &&
//         !searchRef.current.contains(event.target as Node)
//       ) {
//         setIsSearchOpen(false)
//       }
//     }

//     document.addEventListener('mousedown', handleClickOutside)
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside)
//     }
//   }, [])

//   // Handle escape key to close search
//   useEffect(() => {
//     function handleEscapeKey(event: KeyboardEvent) {
//       if (event.key === 'Escape') {
//         setIsSearchOpen(false)
//         setSearchQuery('')
//       }
//     }

//     document.addEventListener('keydown', handleEscapeKey)
//     return () => {
//       document.removeEventListener('keydown', handleEscapeKey)
//     }
//   }, [])

//   // Focus search input when opened
//   useEffect(() => {
//     if (isSearchOpen && searchInputRef.current) {
//       searchInputRef.current.focus()
//     }
//   }, [isSearchOpen])

//   const getTotalPrice = () => {
//     return cartItems.reduce(
//       (total, item) => total + item.price * item.quantity,
//       0
//     )
//   }

//   const getTotalItems = () => {
//     return cartItems.reduce((total, item) => total + item.quantity, 0)
//   }

//   const handleQuantityChange = (itemId: string, change: number) => {
//     const item = cartItems.find((item) => item.id === itemId)
//     if (item && onCartUpdate) {
//       const newQuantity = Math.max(0, item.quantity + change)
//       onCartUpdate({
//         ...item,
//         quantity: newQuantity,
//       })
//     }
//   }

//   const handleSearchToggle = () => {
//     setIsSearchOpen(!isSearchOpen)
//     if (isSearchOpen) {
//       setSearchQuery('')
//     }
//   }

//   const handleSearchSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     if (searchQuery.trim()) {
//       console.log('Searching for:', searchQuery)
//       // Add your search logic here
//     }
//   }

//   const menuItems = [
//     {
//       label: 'HANDS',
//       url: '/hands',
//     },
//     {
//       label: 'HOME CREATIONS',
//       url: '/home-creations',
//     },
//     {
//       label: 'JOURNAL',
//       url: '/blogs',
//     },
//     {
//       label: 'THE LAB',
//       url: '/the-lab',
//     },
//     {
//       label: 'PRODUCTS',
//       url: '/store'
//     }
//   ]



//   // Determine navigation background and text styling
//   const getNavStyles = () => {
//     if (isHomePage) {
//       // Home page: always transparent with white text, glassy on scroll/hover
//       if (isScrolled || isNavHovered) {
//         return {
//           backgroundColor: 'rgba(0, 0, 0, 0.65)',
//           backdropFilter: 'blur(12px) saturate(200%)',
//           WebkitBackdropFilter: 'blur(12px) saturate(200%)',
//           borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
//           textColor: 'white',
//           logoSrc: '/assets/Jardinlogo.svg'
//         }
//       }
//       return {
//         backgroundColor: 'transparent',
//         backdropFilter: 'none',
//         WebkitBackdropFilter: 'none',
//         borderBottom: 'none',
//         textColor: 'white',
//         logoSrc: '/assets/Jardinlogo.svg'
//       }
//     } else {
//       // Non-home pages
//       if (isNavHovered) {
//         // Hovered: pure black background with white text (takes priority over scroll)
//         return {
//           backgroundColor: '#000000',
//           backdropFilter: 'none',
//           WebkitBackdropFilter: 'none',
//           borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
//           textColor: 'white',
//           logoSrc: '/assets/Jardinlogo.svg'
//         }
//       } else if (isScrolled) {
//         // Scrolled: glassy background with white text
//         return {
//           backgroundColor: 'rgba(0, 0, 0, 0.65)',
//           backdropFilter: 'blur(12px) saturate(200%)',
//           WebkitBackdropFilter: 'blur(12px) saturate(200%)',
//           borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
//           textColor: 'white',
//           logoSrc: '/assets/Jardinlogo.svg'
//         }
//       } else {
//         // Default: transparent with black text
//         return {
//           backgroundColor: 'transparent',
//           backdropFilter: 'none',
//           WebkitBackdropFilter: 'none',
//           borderBottom: 'none',
//           textColor: 'black',
//           logoSrc: '/assets/Jardinlogoblack.svg'
//         }
//       }
//     }
//   }

//   const navStyles = getNavStyles()

//   return (
//     <>
//       <div className="fixed top-0 left-0 right-0 z-50">
//         {/* Top Shipping Bar */}
//         <motion.div
//           initial={{ y: -50, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ duration: 0.6, ease: 'easeOut' }}
//           className="text-white py-2"
//           style={{ backgroundColor: '#545d4a' }}
//         >
//           <div className="px-6 lg:px-12">
//             <div className="flex justify-center">
//               <p className="font-din-arabic text-xs tracking-wider whitespace-nowrap">
//                 Complimentary shipping on orders above ₹2500
//               </p>
//             </div>
//           </div>
//         </motion.div>

//         {/* Main Navigation */}
//         <motion.nav
//           initial={{ y: -100 }}
//           animate={{ y: 0 }}
//           transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
//           className="group/nav"
//           onMouseEnter={() => setIsNavHovered(true)}
//           onMouseLeave={() => setIsNavHovered(false)}
//           style={{
//             backgroundColor: navStyles.backgroundColor,
//             backdropFilter: navStyles.backdropFilter,
//             WebkitBackdropFilter: navStyles.WebkitBackdropFilter,
//             borderBottom: navStyles.borderBottom,
//             transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
//             position: 'relative',
//           }}
//         >
//           {/* Glassy overlay effect */}
//           {(isScrolled || isNavHovered) && (
//             <div
//               style={{
//                 position: 'absolute',
//                 top: 0,
//                 left: 0,
//                 right: 0,
//                 bottom: 0,
//                 background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.02) 100%)',
//                 pointerEvents: 'none',
//                 zIndex: 1,
//               }}
//             />
//           )}
//           <div className="px-6 lg:px-12 relative z-20">
//       <div className="flex items-center justify-between py-4 relative">
//         {/* Logo */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.3, duration: 0.6 }}
//           className="flex w-full"
//         >
//           <a href="/" className="">
//             <img
//               src={navStyles.logoSrc}
//               alt="Jardin Botanica Logo"
//               width={200}
//               height={60}
//               className="transition-all duration-300"
//             />
//           </a>
//         </motion.div>

//         {/* Absolutely Centered Navigation Menu */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.4, duration: 0.6 }}
//           className="hidden lg:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2 gap-6"
//         >
//           {menuItems.map((item, index) => (
//             <motion.a
//               key={item.label}
//               href={item.url}
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
//               className="font-light text-sm tracking-widest transition-all duration-300 relative group hover:opacity-80 whitespace-nowrap px-1"
//               style={{ color: navStyles.textColor }}
//             >
//               {item.label}
//               <span
//                 className="absolute bottom-[-4px] left-0 w-0 h-px bg-orange-400 transition-all duration-500 group-hover:w-full"
//               ></span>
//             </motion.a>
//           ))}
//         </motion.div>

//         {/* Actions */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.7, duration: 0.6 }}
//           className="flex items-center gap-6"
//         >
//           {/* Search Section */}
//           <div className="relative flex items-center" ref={searchRef}>
//             <AnimatePresence>
//               {isSearchOpen && (
//                 <motion.form
//                   initial={{ width: 0, opacity: 0 }}
//                   animate={{ width: 'auto', opacity: 1 }}
//                   exit={{ width: 0, opacity: 0 }}
//                   transition={{ duration: 0.3, ease: 'easeInOut' }}
//                   onSubmit={handleSearchSubmit}
//                   className="mr-3 overflow-hidden"
//                 >
//                   <motion.input
//                     ref={searchInputRef}
//                     initial={{ width: 0 }}
//                     animate={{ width: 200 }}
//                     exit={{ width: 0 }}
//                     transition={{ duration: 0.3, ease: 'easeInOut' }}
//                     type="text"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     placeholder="Search..."
//                     className="px-3 py-2 bg-transparent border-b border-opacity-30 transition-all duration-300 focus:outline-none placeholder-opacity-70 font-light"
//                     style={{ 
//                       color: navStyles.textColor,
//                       borderColor: navStyles.textColor === 'white' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'
//                     }}
//                   />
//                 </motion.form>
//               )}
//             </AnimatePresence>

//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//               onClick={handleSearchToggle}
//               className="p-2 transition-all duration-300"
//               style={{ color: navStyles.textColor }}
//               aria-label="Search"
//             >
//               <Search className="w-5 h-5" />
//             </motion.button>
//           </div>

//           <motion.button
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.9 }}
//             onClick={() => setIsWishlisted(!isWishlisted)}
//             className="p-2 transition-all duration-300"
//             style={{ color: isWishlisted ? '#e58a4d' : navStyles.textColor }}
//             aria-label="Favorites"
//           >
//             <Heart
//               className={`w-5 h-5 transition-colors ${
//                 isWishlisted ? 'fill-current' : ''
//               }`}
//             />
//           </motion.button>

//           {/* Profile Icon */}
//           <motion.button
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.9 }}
//             className="p-2 transition-all duration-300"
//             style={{ color: navStyles.textColor }}
//             aria-label="Profile"
//           >
//             <a href="/account">
//               <User className="w-5 h-5" />
//             </a>
//           </motion.button>

//           <div className="relative" ref={cartRef}>
//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//               onClick={() => setIsCartOpen(!isCartOpen)}
//               className="p-2 transition-all duration-300 relative"
//               style={{ color: navStyles.textColor }}
//               aria-label="Shopping bag"
//             >
//               <ShoppingBag className="w-5 h-5" />
//               {getTotalItems() > 0 && (
//                 <span
//                   className="absolute -top-1 -right-1 bg-orange-400 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-light"
//                 >
//                   {getTotalItems()}
//                 </span>
//               )}
//             </motion.button>

//             {/* Cart Dropdown */}
//             <AnimatePresence>
//               {isCartOpen && (
//                 <motion.div
//                   initial={{ opacity: 0, y: -10, scale: 0.95 }}
//                   animate={{ opacity: 1, y: 0, scale: 1 }}
//                   exit={{ opacity: 0, y: -10, scale: 0.95 }}
//                   transition={{ duration: 0.2 }}
//                   className="absolute right-0 top-full mt-2 w-96 bg-stone-100 border border-black border-opacity-10 shadow-2xl z-50"
//                 >
//                   {/* Cart Header */}
//                   <div className="p-4 border-b border-black border-opacity-10">
//                     <div className="flex items-center justify-between">
//                       <h3 className="text-lg text-black font-medium">
//                         Your Cart
//                       </h3>
//                       <button
//                         onClick={() => setIsCartOpen(false)}
//                         className="p-1 hover:bg-black hover:bg-opacity-10 transition-colors rounded"
//                       >
//                         <X className="w-4 h-4 text-black text-opacity-70" />
//                       </button>
//                     </div>
//                   </div>

//                   {/* Cart Content */}
//                   <div className="max-h-96 overflow-y-auto">
//                     {cartItems.length === 0 ? (
//                       // Empty Cart State
//                       <div className="p-8 text-center">
//                         <div className="mb-4">
//                           <ShoppingBag className="w-12 h-12 text-black text-opacity-30 mx-auto" />
//                         </div>
//                         <p className="text-black text-opacity-70 mb-4 font-light">
//                           Nothing is in your cart
//                         </p>
//                         <button
//                           onClick={() => setIsCartOpen(false)}
//                           className="px-6 py-2 bg-black text-white hover:bg-opacity-90 transition-colors tracking-wide font-light"
//                         >
//                           Continue Shopping
//                         </button>
//                       </div>
//                     ) : (
//                       // Cart Items
//                       <div className="p-4 space-y-4">
//                         {cartItems.map((item) => (
//                           <div
//                             key={item.id}
//                             className="flex items-center gap-3 p-3 bg-white bg-opacity-50 border border-black border-opacity-5"
//                           >
//                             {item.image && (
//                               <img
//                                 src={item.image}
//                                 alt={item.name}
//                                 className="w-16 h-16 object-cover"
//                               />
//                             )}
//                             <div className="flex-1">
//                               <h4 className="text-black  font-light">
//                                 {item.name}
//                               </h4>
//                               <p className="text-black text-opacity-70 text-sm font-light">
//                                 ₹{item.price}
//                               </p>
//                             </div>
//                             <div className="flex items-center gap-2">
//                               <button
//                                 onClick={() =>
//                                   handleQuantityChange(item.id, -1)
//                                 }
//                                 className="p-1 hover:bg-black hover:bg-opacity-10 transition-colors rounded"
//                               >
//                                 <Minus className="w-3 h-3 text-black text-opacity-70" />
//                               </button>
//                               <span className="text-black text-sm min-w-[20px] text-center font-light">
//                                 {item.quantity}
//                               </span>
//                               <button
//                                 onClick={() =>
//                                   handleQuantityChange(item.id, 1)
//                                 }
//                                 className="p-1 hover:bg-black hover:bg-opacity-10 transition-colors rounded"
//                               >
//                                 <Plus className="w-3 h-3 text-black text-opacity-70" />
//                               </button>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>

//                   {/* Cart Footer */}
//                   {/* {cartItems.length} */}
//                   {cartItems.length > 0 && (
//                     <div className="p-4 border-t border-black border-opacity-10">
//                       <div className="flex items-center justify-between mb-4">
//                         <span className="text-black font-light">
//                           Total: 
//                         </span>
//                         <span className="text-black  font-light">
//                           ₹{getTotalPrice()}
//                         </span>
//                       </div>
//                       <div className="space-y-2 text-center">
//                        <Link href={"/cart"}>
//                         <button className="w-full py-3 bg-black text-white hover:bg-opacity-90 transition-colors tracking-wide text-center font-light">
//                           Checkout
//                         </button>
//                        </Link>
//                         <button
//                           onClick={() => setIsCartOpen(false)}
//                           className="w-full py-2 border border-black border-opacity-20 text-black hover:bg-black hover:bg-opacity-5 transition-colors tracking-wide text-center font-light"
//                         >
//                           Continue Shopping
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//         </motion.nav>
//       </div>
//     </>
//   )
// }

"use client"

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { User, Search, ShoppingBag, X, Plus, Minus, Heart } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

interface DropdownItem {
  label: string
  href: string
  image?: string
}

interface MenuItem {
  name: string
  href?: string
  dropdown?: DropdownItem[]
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
  const cartRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // --- Mega menu state & refs ---
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Handle component mounting and home page detection
  useEffect(() => {
    setMounted(true)

    const checkAndSetHomePage = () => {
      const currentPath = typeof window !== "undefined" ? window.location.pathname : '/'
      const isHome = currentPath === '/in'
      setIsHomePage(isHome)

      if (isHome) {
        document.body.classList.add('home-page')
      } else {
        document.body.classList.remove('home-page')
      }
    }

    checkAndSetHomePage()

    const handleNavigation = () => {
      setTimeout(checkAndSetHomePage, 10)
    }

    const handleVisibilityChange = () => {
      if (!document.hidden) setTimeout(checkAndSetHomePage, 10)
    }

    const handleFocus = () => {
      setTimeout(checkAndSetHomePage, 10)
    }

    window.addEventListener('popstate', handleNavigation)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)

    // intercept pushState/replaceState to detect SPA route changes (fallback)
    if (typeof window !== 'undefined' && window.history) {
      const originalPushState = window.history.pushState
      const originalReplaceState = window.history.replaceState

      // @ts-ignore
      window.history.pushState = function (...args: any[]) {
        originalPushState.apply(this, args)
        handleNavigation()
      }
      // @ts-ignore
      window.history.replaceState = function (...args: any[]) {
        originalReplaceState.apply(this, args)
        handleNavigation()
      }
    }

    return () => {
      window.removeEventListener('popstate', handleNavigation)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
      document.body.classList.remove('home-page')
      // cleanup overlay if still present
      const overlay = document.getElementById('nav-blur-overlay')
      if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay)
    }
  }, [])

  // Close cart and search when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsCartOpen(false)
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
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
        setActiveDropdown(null)
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

  // Preload dropdown images
  useEffect(() => {
    menuItems.forEach(item => {
      if (item.dropdown) {
        item.dropdown.forEach(d => {
          if (d.image) {
            const img = new window.Image()
            img.src = d.image
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
      console.log('Searching for:', searchQuery)
      // Add your search logic here
    }
  }

  // --- Mega-menu handlers ---
  const handleMouseEnter = (itemName: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current)
      dropdownTimeoutRef.current = null
    }
    setActiveDropdown(itemName)
    setHoveredItem(null)

    // Create blur overlay if not present
    let overlay = document.getElementById('nav-blur-overlay')
    if (!overlay) {
      overlay = document.createElement('div')
      overlay.id = 'nav-blur-overlay'
      overlay.style.cssText = `
        position: fixed;
        top:0;left:0;right:0;bottom:0;
        backdrop-filter: blur(2px);
        background: rgba(0,0,0,0.08);
        z-index:40;
        pointer-events:none;
        opacity:0;
        transition: opacity .18s ease-out;
      `
      document.body.appendChild(overlay)
      // animate in
      requestAnimationFrame(() => {
        if (overlay) overlay.style.opacity = '1'
      })
    }
  }

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null)
      setHoveredItem(null)
      // Remove blur overlay
      const overlay = document.getElementById('nav-blur-overlay')
      if (overlay) {
        overlay.style.opacity = '0'
        setTimeout(() => {
          if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay)
        }, 180)
      }
    }, 120)
  }

  const handleDropdownItemHover = (label: string) => {
    setHoveredItem(label)
  }

  // --- Menu items with dropdown structure ---
  const menuItems: MenuItem[] = [
    {
      name: 'BODY & HANDS',
      href: '/body-hands',
      dropdown: [
        {
          label: 'Cleansers & Exfoliants',
          href: '/products/tea-exfoliant-rinse',
          image: 'https://images.unsplash.com/photo-1743597979473-5b1c0cae1bce?auto=format&fit=crop&w=1080&q=80'
        },
        {
          label: 'Lotions & Moisturisers',
          href: '/products/cedarbloom',
          image: 'https://images.unsplash.com/photo-1660675558428-5a7a1b8546f4?auto=format&fit=crop&w=1080&q=80'
        }
      ]
    },
    {
      name: 'HOME CREATIONS',
      href: '/home-creations',
      dropdown: [
        {
          label: 'Candles',
          href: '/products/candles',
          image: 'https://images.unsplash.com/photo-1648310379950-2773bb5d2525?auto=format&fit=crop&w=1080&q=80'
        },
        {
          label: 'Lava Rock Diffusers',
          href: '/products/diffusers',
          image: 'https://images.unsplash.com/photo-1747198919508-a7657e63d4f9?auto=format&fit=crop&w=1080&q=80'
        }
      ]
    },
    { name: 'JOURNAL', href: '/blogs' },
    { name: "BOTANIST'S LAB", href: '/the-lab' },
    // { name: 'PRODUCTS', href: '/store' },
  ]

  // Determine navigation background and text styling
  const getNavStyles = () => {
    if (isHomePage) {
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
      if (isNavHovered) {
        return {
          backgroundColor: '#000000',
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          textColor: 'white',
          logoSrc: '/assets/Jardinlogo.svg'
        }
      } else if (isScrolled) {
        return {
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(12px) saturate(200%)',
          WebkitBackdropFilter: 'blur(12px) saturate(200%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          textColor: 'white',
          logoSrc: '/assets/Jardinlogo.svg'
        }
      } else {
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
            backdropFilter: navStyles.backdropFilter as any,
            WebkitBackdropFilter: (navStyles as any).WebkitBackdropFilter,
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

              {/* --- Centered Desktop Navigation with Mega Menu --- */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="hidden lg:flex space-x-8 absolute left-1/2 transform -translate-x-1/2"
              >
                {menuItems.map((item, index) => (
                  <div
                    key={item.name}
                    className="relative"
                    onMouseEnter={() => item.dropdown && handleMouseEnter(item.name)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <motion.a
                      href={item.href || '#'}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.06, duration: 0.35 }}
                      className="font-din-arabic text-sm tracking-wider transition-all duration-300 relative group/item hover:opacity-80 whitespace-nowrap"
                      style={{ color: navStyles.textColor }}
                    >
                      {item.name}
                      <span
                        className="absolute bottom-[-4px] left-0 w-0 h-[1px] transition-all duration-500 group-hover/item:w-full"
                        style={{ backgroundColor: '#e58a4d' }}
                      />
                    </motion.a>

                    {/* Mega Dropdown */}
                    <AnimatePresence>
                      {item.dropdown && activeDropdown === item.name && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.18, ease: 'easeOut' }}
                          className="absolute top-full left-0 pt-4 z-50"
                        >
                          <div
                            className="border shadow-2xl overflow-hidden"
                            style={{
                              backgroundColor: '#e3e3d8',
                              borderColor: 'rgba(0,0,0,0.08)',
                            }}
                          >
                            <div className="flex h-72">
                              {/* Left: Links */}
                              <div className="py-6 w-80 flex flex-col">
                                {item.dropdown.map((dItem) => (
                                  <a
                                    key={dItem.label}
                                    href={dItem.href}
                                    className="group/dropdown-item block px-8 py-4 font-american-typewriter tracking-wide transition-all duration-150"
                                    style={{ color: '#000', fontSize: '0.95rem' }}
                                    onMouseEnter={() => handleDropdownItemHover(dItem.label)}
                                  >
                                    <span className="relative inline-block">
                                      {dItem.label}
                                      <span
                                        className="absolute bottom-[-2px] left-0 w-0 h-[1px] transition-all duration-300 group-hover/dropdown-item:w-full"
                                        style={{ backgroundColor: '#e58a4d' }}
                                      />
                                    </span>
                                  </a>
                                ))}
                              </div>

                              {/* Right: Image preview */}
                              <div className="w-96 h-full overflow-hidden relative p-4" style={{ backgroundColor: '#e3e3d8' }}>
                                {item.dropdown.map((dItem) => (
                                  <img
                                    key={dItem.label}
                                    src={dItem.image}
                                    alt={dItem.label}
                                    className="absolute inset-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)] object-cover pointer-events-none rounded"
                                    style={{
                                      opacity: hoveredItem === dItem.label ? 1 : 0,
                                      transition: 'opacity 0.18s ease-out',
                                      zIndex: hoveredItem === dItem.label ? 2 : 1
                                    }}
                                    loading="eager"
                                  />
                                ))}
                                {/* fallback/default image */}
                                {item.dropdown[0]?.image && (
                                  <img
                                    src={item.dropdown[0].image}
                                    alt="default"
                                    className="absolute inset-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)] object-cover pointer-events-none rounded"
                                    style={{
                                      opacity: !hoveredItem ? 1 : 0,
                                      transition: 'opacity 0.18s ease-out',
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
                        transition={{ duration: 0.28, ease: 'easeInOut' }}
                        onSubmit={handleSearchSubmit}
                        className="mr-3 overflow-hidden"
                      >
                        <motion.input
                          ref={searchInputRef}
                          initial={{ width: 0 }}
                          animate={{ width: 200 }}
                          exit={{ width: 0 }}
                          transition={{ duration: 0.28, ease: 'easeInOut' }}
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search..."
                          className="px-3 py-2 bg-transparent border-b border-opacity-30 transition-all duration-300 focus:outline-none placeholder-opacity-70 font-light"
                          style={{
                            color: navStyles.textColor,
                            borderColor: navStyles.textColor === 'white' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'
                          }}
                        />
                      </motion.form>
                    )}
                  </AnimatePresence>

                  <motion.button
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={handleSearchToggle}
                    className="p-2 transition-all duration-300"
                    style={{ color: navStyles.textColor }}
                    aria-label="Search"
                  >
                    <Search className="w-5 h-5" />
                  </motion.button>
                </div>

                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="p-2 transition-all duration-300"
                  style={{ color: isWishlisted ? '#e58a4d' : navStyles.textColor }}
                  aria-label="Favorites"
                >
                  <Heart
                    className={`w-5 h-5 transition-colors ${isWishlisted ? 'fill-current' : ''}`}
                  />
                </motion.button>

                {/* Profile Icon */}
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.96 }}
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
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.96 }}
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
                        className="absolute right-0 top-full mt-2 w-96 bg-stone-100 border border-black border-opacity-10 shadow-2xl z-50"
                      >
                        {/* Cart Header */}
                        <div className="p-4 border-b border-black border-opacity-10">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg text-black font-medium">
                              Your Cart
                            </h3>
                            <button
                              onClick={() => setIsCartOpen(false)}
                              className="p-1 hover:bg-black hover:bg-opacity-10 transition-colors rounded"
                            >
                              <X className="w-4 h-4 text-black text-opacity-70" />
                            </button>
                          </div>
                        </div>

                        {/* Cart Content */}
                        <div className="max-h-96 overflow-y-auto">
                          {cartItems.length === 0 ? (
                            <div className="p-8 text-center">
                              <div className="mb-4">
                                <ShoppingBag className="w-12 h-12 text-black text-opacity-30 mx-auto" />
                              </div>
                              <p className="text-black text-opacity-70 mb-4 font-light">
                                Nothing is in your cart
                              </p>
                              <button
                                onClick={() => setIsCartOpen(false)}
                                className="px-6 py-2 bg-black text-white hover:bg-opacity-90 transition-colors tracking-wide font-light"
                              >
                                Continue Shopping
                              </button>
                            </div>
                          ) : (
                            <div className="p-4 space-y-4">
                              {cartItems.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex items-center gap-3 p-3 bg-white bg-opacity-50 border border-black border-opacity-5"
                                >
                                  {item.image && (
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="w-16 h-16 object-cover"
                                    />
                                  )}
                                  <div className="flex-1">
                                    <h4 className="text-black  font-light">
                                      {item.name}
                                    </h4>
                                    <p className="text-black text-opacity-70 text-sm font-light">
                                      ₹{item.price}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => handleQuantityChange(item.id, -1)}
                                      className="p-1 hover:bg-black hover:bg-opacity-10 transition-colors rounded"
                                    >
                                      <Minus className="w-3 h-3 text-black text-opacity-70" />
                                    </button>
                                    <span className="text-black text-sm min-w-[20px] text-center font-light">
                                      {item.quantity}
                                    </span>
                                    <button
                                      onClick={() => handleQuantityChange(item.id, 1)}
                                      className="p-1 hover:bg-black hover:bg-opacity-10 transition-colors rounded"
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
                              <span className="text-black font-light">
                                Total:
                              </span>
                              <span className="text-black  font-light">
                                ₹{getTotalPrice()}
                              </span>
                            </div>
                            <div className="space-y-2 text-center">
                              <Link href={"/cart"}>
                                <button className="w-full py-3 bg-black text-white hover:bg-opacity-90 transition-colors tracking-wide text-center font-light">
                                  Checkout
                                </button>
                              </Link>
                              <button
                                onClick={() => setIsCartOpen(false)}
                                className="w-full py-2 border border-black border-opacity-20 text-black hover:bg-black hover:bg-opacity-5 transition-colors tracking-wide text-center font-light"
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
