















// 'use client'

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

// export default  function Nav({
//   isScrolled = false,
//   cartItems = []
// }: NavigationProps) {
  
//   const [isMenuOpen, setIsMenuOpen] = useState(false)
//   const [isCartOpen, setIsCartOpen] = useState(false)
//   const [isWishlisted, setIsWishlisted] = useState(false)
//   const [isSearchOpen, setIsSearchOpen] = useState(false)
//   const [searchQuery, setSearchQuery] = useState('')
//   const [isNavHovered, setIsNavHovered] = useState(false)
//   const [mounted, setMounted] = useState(false)
//   const cartRef = useRef<HTMLDivElement>(null)
//   const searchRef = useRef<HTMLDivElement>(null)
//   const searchInputRef = useRef<HTMLInputElement>(null)

//   // Determine if we should show the glassy/scrolled state
//   const shouldShowGlassyState = isScrolled || isNavHovered

//   // Handle component mounting and home page detection
//   useEffect(() => {
//     setMounted(true)
    
//     const checkAndSetHomePage = () => {
//       const currentPath = window.location.pathname
//       const isHome = currentPath === '/'
      
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

//   // const handleQuantityChange = (itemId: string, change: number) => {
//   //   const item = cartItems.find((item) => item.id === itemId)
//   //   if (item && onCartUpdate) {
//   //     const newQuantity = Math.max(0, item.quantity + change)
//   //     onCartUpdate({
//   //       ...item,
//   //       quantity: newQuantity,
//   //     })
//   //   }
//   // }

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
//   ]

//   return (
//     <>
//       <style>
//         {`
//           /* Home page styles - always white text */
//           body.home-page .nav-menu-item,
//           body.home-page .nav-action-button,
//           body.home-page .nav-search-input {
//             color: white !important;
//           }
          
//           body.home-page .nav-search-input {
//             border-color: rgba(255, 255, 255, 0.3) !important;
//           }
          
//           body.home-page .nav-search-input::placeholder {
//             color: rgba(255, 255, 255, 0.5) !important;
//           }
          
//           /* Home page logo - always white version */
//           body.home-page .nav-logo {
//             content: url('/Images/Jardinlogo.svg') !important;
//           }
          
//           /* Non-home page styles */
//           body:not(.home-page) .nav-menu-item:not(.glassy-active),
//           body:not(.home-page) .nav-action-button:not(.glassy-active) {
//             color: black !important;
//           }
          
//           body:not(.home-page) .nav-search-input:not(.glassy-active) {
//             color: black !important;
//             border-color: rgba(0, 0, 0, 0.3) !important;
//           }
          
//           body:not(.home-page) .nav-search-input:not(.glassy-active)::placeholder {
//             color: rgba(0, 0, 0, 0.5) !important;
//           }
          
//           /* Non-home page logo - black version when not glassy */
//           body:not(.home-page) .nav-logo:not(.glassy-active) {
//             content: url('/Images/Jardinlogoblack.svg') !important;
//           }
          
//           /* Glassy state overrides for non-home pages */
//           body:not(.home-page) .nav-menu-item.glassy-active,
//           body:not(.home-page) .nav-action-button.glassy-active {
//             color: white !important;
//           }
          
//           body:not(.home-page) .nav-search-input.glassy-active {
//             color: white !important;
//             border-color: rgba(255, 255, 255, 0.3) !important;
//           }
          
//           body:not(.home-page) .nav-search-input.glassy-active::placeholder {
//             color: rgba(255, 255, 255, 0.5) !important;
//           }
          
//           /* Non-home page logo - white version when glassy */
//           body:not(.home-page) .nav-logo.glassy-active {
//             content: url('/Images/Jardinlogo.svg') !important;
//           }
          
//           /* Custom font classes */
//           .font-din-arabic {
//             font-family: 'DIN Arabic', 'Arial', sans-serif;
//           }
          
//           .font-american-typewriter {
//             font-family: 'American Typewriter', 'Courier New', monospace;
//           }
          
//           /* Custom glassmorphism backdrop */
//           .glassy-nav {
//             background: rgba(0, 0, 0, 0.65);
//             backdrop-filter: blur(12px) saturate(200%);
//             -webkit-backdrop-filter: blur(12px) saturate(200%);
//             border-bottom: 1px solid rgba(255, 255, 255, 0.05);
//             transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
//           }
          
//           /* Custom gradient overlay */
//           .glassy-overlay {
//             background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.02) 100%);
//           }
          
//           /* Custom accent color */
//           .accent-color {
//             background-color: #e58a4d;
//           }
          
//           .accent-color-text {
//             color: #e58a4d;
//           }
          
//           .accent-hover:hover {
//             background-color: #e58a4d;
//           }
          
//           .shipping-bg {
//             background-color: #545d4a;
//           }
          
//           .cart-bg {
//             background-color: #e3e3d8;
//           }
//         `}
//       </style>
//       <div className="fixed top-0 left-0 right-0 z-50">
//         {/* Top Shipping Bar */}
//         <motion.div
//           initial={{ y: -50, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ duration: 0.6, ease: 'easeOut' }}
//           className="shipping-bg text-white py-2"
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
//           className={`group/nav relative transition-all duration-500 ${shouldShowGlassyState ? 'glassy-nav' : 'bg-transparent'}`}
//           onMouseEnter={() => setIsNavHovered(true)}
//           onMouseLeave={() => setIsNavHovered(false)}
//         >
//           {/* Glassy overlay effect */}
//           {shouldShowGlassyState && (
//             <div className="glassy-overlay absolute top-0 left-0 right-0 bottom-0 pointer-events-none z-10" />
//           )}
          
//           <div className="px-6 lg:px-48 pl-10 relative z-20">
//             <div className="flex items-center justify-between py-6 relative">
//               {/* Logo */}
//              <motion.div
//   initial={{ opacity: 0 }}
//   animate={{ opacity: 1 }}
//   transition={{ delay: 0.3, duration: 0.6 }}
//   className="flex-shrink-0" // Changed: Remove w-full and justify-end
// >
//   <Link href={'/'}>  {/* Removed pl-20 padding */}
//     <Image
//       src="/Images/Jardinlogo.svg"
//       alt="/Images/Jardin Botanica Logo"
//       width={240}
//       height={80}
//       className={`transition-all duration-300 nav-logo ${shouldShowGlassyState ? 'glassy-active' : ''}`}
//       priority
//     />
//   </Link>
// </motion.div>


//               {/* Absolutely Centered Navigation Menu */}
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.4, duration: 0.6 }}
//                 className="hidden lg:flex space-x-8 absolute left-1/2 transform -translate-x-1/2"
//               >
//                 {menuItems.map((item, index) => (
//                   <motion.a
//                     key={item.label}
//                     href={item.url}
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
//                     className={`font-din-arabic text-sm tracking-wider transition-all duration-300 relative group/item hover:opacity-80 whitespace-nowrap nav-menu-item ${shouldShowGlassyState ? 'glassy-active' : ''}`}
//                   >
//                     {item.label}
//                     <span className="accent-color absolute bottom-[-4px] left-0 w-0 h-[1px] transition-all duration-500 group-hover/item:w-full"></span>
//                   </motion.a>
//                 ))}
//               </motion.div>

//               {/* Actions */}
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.7, duration: 0.6 }}
//                 className="flex items-center space-x-6"
//               >
//                 {/* Search Section */}
//                 <div className="relative flex items-center" ref={searchRef}>
//                   <AnimatePresence>
//                     {isSearchOpen && (
//                       <motion.form
//                         initial={{ width: 0, opacity: 0 }}
//                         animate={{ width: 'auto', opacity: 1 }}
//                         exit={{ width: 0, opacity: 0 }}
//                         transition={{ duration: 0.3, ease: 'easeInOut' }}
//                         onSubmit={handleSearchSubmit}
//                         className="mr-3 overflow-hidden"
//                       >
//                         <motion.input
//                           ref={searchInputRef}
//                           initial={{ width: 0 }}
//                           animate={{ width: 200 }}
//                           exit={{ width: 0 }}
//                           transition={{ duration: 0.3, ease: 'easeInOut' }}
//                           type="text"
//                           value={searchQuery}
//                           onChange={(e) => setSearchQuery(e.target.value)}
//                           placeholder="Search..."
//                           className={`font-din-arabic px-3 py-2 bg-transparent border-b transition-all duration-300 focus:outline-none placeholder-opacity-70 nav-search-input ${shouldShowGlassyState ? 'glassy-active' : ''}`}
//                         />
//                       </motion.form>
//                     )}
//                   </AnimatePresence>

//                   <motion.button
//                     whileHover={{ scale: 1.1 }}
//                     whileTap={{ scale: 0.9 }}
//                     onClick={handleSearchToggle}
//                     className={`p-2 transition-all duration-300 nav-action-button ${shouldShowGlassyState ? 'glassy-active' : ''}`}
//                     aria-label="Search"
//                   >
//                     <Search className="w-5 h-5" />
//                   </motion.button>
//                 </div>

//                 <motion.button
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={() => setIsWishlisted(!isWishlisted)}
//                   className={`p-2 transition-all duration-300 nav-action-button ${shouldShowGlassyState ? 'glassy-active' : ''}`}
//                   aria-label="Favorites"
//                 >
//                   <Heart
//                     className={`w-5 h-5 transition-colors ${
//                       isWishlisted ? 'fill-current accent-color-text' : ''
//                     }`}
//                   />
//                 </motion.button>

//                 {/* Profile Icon */}
//                 <motion.button
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.9 }}
//                   className={`p-2 transition-all duration-300 nav-action-button ${shouldShowGlassyState ? 'glassy-active' : ''}`}
//                   aria-label="Profile"
//                 >
//                   <Link href="/account">
//                     <User className="w-5 h-5" />
//                   </Link>
//                 </motion.button>

//                 <div className="relative" ref={cartRef}>
//                   <motion.button
//                     whileHover={{ scale: 1.1 }}
//                     whileTap={{ scale: 0.9 }}
//                     onClick={() => setIsCartOpen(!isCartOpen)}
//                     className={`p-2 transition-all duration-300 nav-action-button ${shouldShowGlassyState ? 'glassy-active' : ''}`}
//                     aria-label="Shopping bag"
//                   >
//                     <ShoppingBag className="w-5 h-5" />
//                     {getTotalItems() > 0 && (
//                       <span className="accent-color absolute -top-1 -right-1 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-din-arabic">
//                         {getTotalItems()}
//                       </span>
//                     )}
//                   </motion.button>

//                   {/* Cart Dropdown */}
//                   <AnimatePresence>
//                     {isCartOpen && (
//                       <motion.div
//                         initial={{ opacity: 0, y: -10, scale: 0.95 }}
//                         animate={{ opacity: 1, y: 0, scale: 1 }}
//                         exit={{ opacity: 0, y: -10, scale: 0.95 }}
//                         transition={{ duration: 0.2 }}
//                         className="cart-bg absolute right-0 top-full mt-2 w-96 border border-black/10 shadow-2xl z-50 rounded-sm"
//                       >
//                         {/* Cart Header */}
//                         <div className="p-4 border-b border-black/10">
//                           <div className="flex items-center justify-between">
//                             <h3 className="font-american-typewriter text-lg text-black">
//                               Your Cart
//                             </h3>
//                             <button
//                               onClick={() => setIsCartOpen(false)}
//                               className="p-1 hover:bg-black/10 transition-colors rounded"
//                             >
//                               <X className="w-4 h-4 text-black/70" />
//                             </button>
//                           </div>
//                         </div>

//                         {/* Cart Content */}
//                         <div className="max-h-96 overflow-y-auto">
//                           {cartItems.length === 0 ? (
//                             // Empty Cart State
//                             <div className="p-8 text-center">
//                               <div className="mb-4">
//                                 <ShoppingBag className="w-12 h-12 text-black/30 mx-auto" />
//                               </div>
//                               <p className="font-din-arabic text-black/70 mb-4">
//                                 Nothing is in your cart
//                               </p>
//                               <button
//                                 onClick={() => setIsCartOpen(false)}
//                                 className="font-din-arabic px-6 py-2 bg-black text-white hover:bg-black/90 transition-colors tracking-wide"
//                               >
//                                 Continue Shopping
//                               </button>
//                             </div>
//                           ) : (
//                             // Cart Items
//                             <div className="p-4 space-y-4">
//                               {cartItems.map((item) => (
//                                 <div
//                                   key={item.id}
//                                   className="flex items-center space-x-3 p-3 bg-white/50 border border-black/5 rounded-sm"
//                                 >
//                                   {item.image && (
//                                     <img
//                                       src={item.image}
//                                       alt={item.name}
//                                       className="w-16 h-16 object-cover rounded"
//                                     />
//                                   )}
//                                   <div className="flex-1">
//                                     <h4 className="font-din-arabic text-black font-medium">
//                                       {item.name}
//                                     </h4>
//                                     <p className="font-din-arabic text-black/70 text-sm">
//                                       ₹{item.price}
//                                     </p>
//                                   </div>
//                                   <div className="flex items-center space-x-2">
//                                     <button
//                                       // onClick={() =>
//                                       //   handleQuantityChange(item.id, -1)
//                                       // }
//                                       className="p-1 hover:bg-black/10 transition-colors rounded"
//                                     >
//                                       <Minus className="w-3 h-3 text-black/70" />
//                                     </button>
//                                     <span className="font-din-arabic text-black text-sm min-w-[20px] text-center">
//                                       {item.quantity}
//                                     </span>
//                                     <button
//                                       // onClick={() =>
//                                       //   handleQuantityChange(item.id, 1)
//                                       // }
//                                       className="p-1 hover:bg-black/10 transition-colors rounded"
//                                     >
//                                       <Plus className="w-3 h-3 text-black/70" />
//                                     </button>
//                                   </div>
//                                 </div>
//                               ))}
//                             </div>
//                           )}
//                         </div>

//                         {/* Cart Footer */}
//                         {cartItems.length > 0 && (
//                           <div className="p-4 border-t border-black/10">
//                             <div className="flex items-center justify-between mb-4">
//                               <span className="font-din-arabic text-black">
//                                 Total:
//                               </span>
//                               <span className="font-din-arabic text-black font-medium">
//                                 ₹{getTotalPrice()}
//                               </span>
//                             </div>
//                             <div className="space-y-2 text-center">
//                               <button className="w-full font-din-arabic py-3 bg-black text-white hover:bg-black/90 transition-colors tracking-wide text-center rounded-sm">
//                                 Checkout
//                               </button>
//                               <button
//                                 onClick={() => setIsCartOpen(false)}
//                                 className="w-full font-din-arabic py-2 border border-black/20 text-black hover:bg-black/5 transition-colors tracking-wide text-center rounded-sm"
//                               >
//                                 Continue Shopping
//                               </button>
//                             </div>
//                           </div>
//                         )}
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </div>
//               </motion.div>
//             </div>
//           </div>
//         </motion.nav>
//       </div>
//     </>
//   )
// }