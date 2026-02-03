"use client"

import { deleteLineItem, updateLineItem } from "@lib/data/cart"
import { getNavigation } from "@lib/data/contentful"
import { convertToLocale } from "@lib/util/money"
import type { HttpTypes } from "@medusajs/types"
import { useAuth } from "app/context/auth-context"
import { type CartItem, useCartItemsSafe } from "app/context/cart-items-context"
import { ChevronDown, Heart, Menu, Minus, Plus, Search, ShoppingBag, User, X } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import type React from "react"
import { useEffect, useRef, useState } from "react"
import { SearchMegaMenu } from "./SearchMegaMenu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"

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
  onDropdownChange?: (isOpen: boolean) => void
  forceWhiteText?: boolean
  disableSticky?: boolean
  disableAnimations?: boolean
  isLoggedIn?: boolean
}

export function Navigation({
  isScrolled = false,
  cartItems: cartItemsProp,
  onCartUpdate: onCartUpdateProp,
  onDropdownChange,
  disableSticky = false,
  disableAnimations = false,
  forceWhiteText = false,
  isLoggedIn = false,
}: NavigationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { isLoggedIn: authIsLoggedIn } = useAuth()

  // Use context if available, otherwise fall back to props
  const cartContext = useCartItemsSafe()
  const cartItems = cartContext?.cartItems ?? cartItemsProp ?? []
  const onCartUpdate = cartContext?.handleCartUpdate ?? onCartUpdateProp
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isNavHovered, setIsNavHovered] = useState(false)
  const [region, setRegion] = useState<HttpTypes.StoreRegion | null>(null)
  const [mounted, setMounted] = useState(false)
  const [isHomePage, setIsHomePage] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mobileActiveDropdown, setMobileActiveDropdown] = useState<string | null>(null)
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [updatingCartItem, setUpdatingCartItem] = useState<string | null>(null)
  const cartRef = useRef<HTMLDivElement>(null)
  const cartPanelRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  // Determine if user is logged in - prioritize prop, then context, then fallback to false
  const userIsLoggedIn = isLoggedIn !== false ? isLoggedIn : authIsLoggedIn

  // --- Mega menu state & refs ---
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Fetch navigation from Contentful
  useEffect(() => {
    const fetchNav = async () => {
      const navItems = await getNavigation()
      if (navItems.length > 0) {
        setMenuItems(
          navItems.map((item) => ({
            name: item.name,
            href: item.href,
            dropdown: item.dropdown?.map((d) => ({
              label: d.label,
              href: d.href,
              image: d.image,
            })),
          }))
        )
      }
    }
    fetchNav()
  }, [])

  // Handle component mounting and home page detection
  useEffect(() => {
    setMounted(true)

    const checkAndSetHomePage = () => {
      const currentPath = typeof window !== "undefined" ? window.location.pathname : "/"
      const isHome = currentPath === "/in"
      setIsHomePage(isHome)

      if (isHome) {
        document.body.classList.add("home-page")
      } else {
        document.body.classList.remove("home-page")
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

    window.addEventListener("popstate", handleNavigation)
    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("focus", handleFocus)

    // intercept pushState/replaceState to detect SPA route changes (fallback)
    if (typeof window !== "undefined" && window.history) {
      const originalPushState = window.history.pushState
      const originalReplaceState = window.history.replaceState

      window.history.pushState = function (data: any, unused: string, url?: string | URL | null) {
        originalPushState.call(this, data, unused, url)
        handleNavigation()
      }
      window.history.replaceState = function (
        data: any,
        unused: string,
        url?: string | URL | null
      ) {
        originalReplaceState.call(this, data, unused, url)
        handleNavigation()
      }
    }

    return () => {
      window.removeEventListener("popstate", handleNavigation)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("focus", handleFocus)
      document.body.classList.remove("home-page")
      // cleanup overlay if still present
      const overlay = document.getElementById("nav-blur-overlay")
      if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay)
    }
  }, [])

  // Close cart and search when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Check if click is outside both cart button and cart dropdown panel
      const isOutsideCartButton = cartRef.current && !cartRef.current.contains(event.target as Node)
      const isOutsideCartPanel =
        cartPanelRef.current && !cartPanelRef.current.contains(event.target as Node)
      const isOutsideCart = isOutsideCartButton && (!cartPanelRef.current || isOutsideCartPanel)

      if (isOutsideCart) {
        setIsCartOpen(false)
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Handle escape key to close search and mobile menu
  useEffect(() => {
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsSearchOpen(false)
        setSearchQuery("")
        setActiveDropdown(null)
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener("keydown", handleEscapeKey)
    return () => {
      document.removeEventListener("keydown", handleEscapeKey)
    }
  }, [])

  // Close mobile menu when window is resized to desktop
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMobileMenuOpen])

  // Preload dropdown images
  useEffect(() => {
    menuItems.forEach((item) => {
      if (item.dropdown) {
        item.dropdown.forEach((d) => {
          if (d.image) {
            const img = new window.Image()
            img.src = d.image
          }
        })
      }
    })
  }, [])

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const handleQuantityChange = async (itemId: string, change: number) => {
    const item = cartItems.find((item) => item.id === itemId)
    if (!item) return

    setUpdatingCartItem(itemId)
    const newQuantity = Math.max(0, item.quantity + change)

    // Use line_item_id for server operations if available, otherwise fall back to item.id
    const serverLineId = item.line_item_id || itemId

    try {
      if (newQuantity === 0) {
        // Delete the line item if quantity becomes 0
        await deleteLineItem(serverLineId)
      } else {
        // Update the line item quantity in Medusa
        await updateLineItem({
          lineId: serverLineId,
          quantity: newQuantity,
        })
      }

      // Update local context state
      if (onCartUpdate) {
        if (newQuantity === 0) {
          // Pass the item with quantity 0 to signal deletion
          onCartUpdate({
            ...item,
            quantity: 0,
          })
        } else {
          onCartUpdate({
            ...item,
            quantity: newQuantity,
          })
        }
      }
    } catch (error) {
      console.error("Failed to update cart item:", error)
      // You could show an error toast here
    } finally {
      setUpdatingCartItem(null)
    }
  }

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen)
    setIsCartOpen(false) // Close cart when opening search
    setIsMobileMenuOpen(false) // Close mobile menu when opening search
    setActiveDropdown(null) // Close mega menu when opening search
    if (isSearchOpen) {
      setSearchQuery("")
    }
  }

  const handleCartToggle = () => {
    setIsCartOpen(!isCartOpen)
    setIsSearchOpen(false) // Close search when opening cart
    setIsMobileMenuOpen(false) // Close mobile menu when opening cart
  }

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    setIsSearchOpen(false) // Close search when opening menu
    setIsCartOpen(false) // Close cart when opening menu
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Not used anymore, search happens in SearchMegaMenu
  }

  // Get country code from current path
  const getCountryCode = () => {
    const currentPath = pathname || ""
    const countryMatch = currentPath.match(/^\/([^/]+)/)
    return countryMatch ? countryMatch[1] : "in"
  }

  const handleHeartClick = () => {
    if (userIsLoggedIn) {
      // User is logged in, redirect to ledger
      const currentPath = pathname || ""
      // Extract country code from path if present (e.g., /in/account/...)
      const countryMatch = currentPath.match(/^\/([^/]+)/)
      const countryCode = countryMatch ? countryMatch[1] : "in"
      router.push(`/${countryCode}/account/ledger`)
    } else {
      // User is not logged in, show login dialog
      setShowLoginDialog(true)
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
    onDropdownChange?.(true)

    // Create blur overlay if not present
    let overlay = document.getElementById("nav-blur-overlay")
    if (!overlay) {
      overlay = document.createElement("div")
      overlay.id = "nav-blur-overlay"
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
        if (overlay) overlay.style.opacity = "1"
      })
    }
  }

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null)
      setHoveredItem(null)
      onDropdownChange?.(false)
      // Remove blur overlay
      const overlay = document.getElementById("nav-blur-overlay")
      if (overlay) {
        overlay.style.opacity = "0"
        setTimeout(() => {
          if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay)
        }, 180)
      }
    }, 120)
  }

  const handleDropdownItemHover = (label: string) => {
    setHoveredItem(label)
  }

  // Menu items are now fetched from Contentful via useEffect above

  // Determine navigation background and text styling
  const getNavStyles = () => {
    if (isHomePage || forceWhiteText) {
      // Home page or forced white text: transparent by default, black on hover (only if not scrolled), glassy on scroll
      if (isScrolled) {
        // Scrolled: glassy background with white text (stays glassy even on hover)
        return {
          backgroundColor: "rgba(0, 0, 0, 0.65)",
          backdropFilter: "blur(12px) saturate(200%)",
          WebkitBackdropFilter: "blur(12px) saturate(200%)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
          textColor: "white",
          logoSrc: "/assets/Jardinlogo.svg",
        }
      } else if (isNavHovered) {
        // Hovered (when not scrolled): pure black background with white text
        return {
          backgroundColor: "#000000",
          backdropFilter: "none",
          WebkitBackdropFilter: "none",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          textColor: "white",
          logoSrc: "/assets/Jardinlogo.svg",
        }
      }
      return {
        backgroundColor: "transparent",
        backdropFilter: "none",
        WebkitBackdropFilter: "none",
        borderBottom: "none",
        textColor: "white",
        logoSrc: "/assets/Jardinlogo.svg",
      }
    } else {
      // Non-home pages
      if (isScrolled) {
        // Scrolled: glassy background with white text (stays glassy even on hover)
        return {
          backgroundColor: "rgba(0, 0, 0, 0.65)",
          backdropFilter: "blur(12px) saturate(200%)",
          WebkitBackdropFilter: "blur(12px) saturate(200%)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
          textColor: "white",
          logoSrc: "/assets/Jardinlogo.svg",
        }
      } else if (isNavHovered) {
        // Hovered (when not scrolled): pure black background with white text
        return {
          backgroundColor: "#000000",
          backdropFilter: "none",
          WebkitBackdropFilter: "none",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          textColor: "white",
          logoSrc: "/assets/Jardinlogo.svg",
        }
      } else {
        // Default: transparent with black text
        return {
          backgroundColor: "transparent",
          backdropFilter: "none",
          WebkitBackdropFilter: "none",
          borderBottom: "none",
          textColor: "#1a1a1a",
          logoSrc: "/assets/Jardinlogoblack.svg",
        }
      }
    }
  }

  const navStyles = getNavStyles()

  return (
    <>
      <div className={disableSticky ? "relative z-50" : "fixed top-0 left-0 right-0 z-50"}>
        {/* Top Shipping Bar */}
        <motion.div
          initial={disableAnimations ? undefined : { y: -50, opacity: 0 }}
          animate={disableAnimations ? undefined : { y: 0, opacity: 1 }}
          transition={disableAnimations ? undefined : { duration: 0.6, ease: "easeOut" }}
          className="text-white py-2"
          style={{ backgroundColor: "#545d4a" }}
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
          initial={disableAnimations ? undefined : { y: -100 }}
          animate={disableAnimations ? undefined : { y: 0 }}
          transition={
            disableAnimations ? undefined : { duration: 0.8, ease: "easeOut", delay: 0.3 }
          }
          className="group/nav"
          onMouseEnter={() => setIsNavHovered(true)}
          onMouseLeave={() => setIsNavHovered(false)}
          style={{
            backgroundColor: navStyles.backgroundColor,
            backdropFilter: navStyles.backdropFilter as any,
            WebkitBackdropFilter: (navStyles as any).WebkitBackdropFilter,
            borderBottom: navStyles.borderBottom,
            transition: disableAnimations ? "none" : "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
            position: "relative",
          }}
        >
          {/* Glassy overlay effect */}
          {(isScrolled || isNavHovered) && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.02) 100%)",
                pointerEvents: "none",
                zIndex: 1,
              }}
            />
          )}

          <div className="px-2 md:px-4 lg:px-12 relative z-20">
            <div className="flex items-center justify-between py-4 px-0 md:px-4 relative">
              {/* Logo */}
              <motion.div
                initial={disableAnimations ? undefined : { opacity: 0 }}
                animate={disableAnimations ? undefined : { opacity: 1 }}
                transition={disableAnimations ? undefined : { delay: 0.3, duration: 0.6 }}
                className="flex w-full"
              >
                <a href="/" className="">
                  <img
                    src={navStyles.logoSrc}
                    alt="Jardin Botanica Logo"
                    width={270}
                    height={60}
                    className="transition-all duration-300"
                  />
                </a>
              </motion.div>

              {/* --- Centered Desktop Navigation with Mega Menu --- */}
              <motion.div
                initial={disableAnimations ? undefined : { opacity: 0 }}
                animate={disableAnimations ? undefined : { opacity: 1 }}
                transition={disableAnimations ? undefined : { delay: 0.4, duration: 0.6 }}
                className="hidden lg:flex space-x-8 absolute left-1/2 transform -translate-x-1/2"
              >
                {menuItems.map((item, index) => (
                  <div
                    key={item.name}
                    className="relative"
                    style={item.name === "HOME CREATIONS" ? { marginLeft: "0.5rem" } : undefined}
                    onMouseEnter={() => item.dropdown && handleMouseEnter(item.name)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <motion.a
                      href={item.href || "#"}
                      initial={disableAnimations ? undefined : { opacity: 0, y: -10 }}
                      animate={disableAnimations ? undefined : { opacity: 1, y: 0 }}
                      transition={
                        disableAnimations ? undefined : { delay: 0.4 + index * 0.1, duration: 0.4 }
                      }
                      className="font-din-arabic text-sm tracking-wider transition-all duration-300 relative group/item hover:opacity-80 whitespace-nowrap"
                      style={{ color: navStyles.textColor }}
                    >
                      {item.name}
                      <span
                        className="absolute bottom-[-4px] left-0 w-0 h-[1px] transition-all duration-500 group-hover/item:w-full"
                        style={{ backgroundColor: "#e58a4d" }}
                      />
                    </motion.a>

                    {/* Mega Dropdown */}
                    <AnimatePresence>
                      {item.dropdown && activeDropdown === item.name && (
                        <motion.div
                          initial={disableAnimations ? undefined : { opacity: 0 }}
                          animate={disableAnimations ? undefined : { opacity: 1 }}
                          exit={disableAnimations ? undefined : { opacity: 0 }}
                          transition={
                            disableAnimations
                              ? undefined
                              : {
                                  duration: 0.2,
                                  ease: "easeOut",
                                }
                          }
                          className="absolute top-full left-0 pt-4 z-50"
                        >
                          <div
                            className="border shadow-2xl overflow-hidden"
                            style={{
                              backgroundColor: "#e3e3d8",
                              borderColor: "rgba(0,0,0,0.08)",
                            }}
                          >
                            <div className="flex h-72">
                              {/* Left: Links */}
                              <div className="py-6 w-80 flex flex-col">
                                {item.dropdown
                                  .filter((dItem) => dItem.label !== "All Products")
                                  .map((dItem) => (
                                    <a
                                      key={dItem.label}
                                      href={dItem.href}
                                      className="group/dropdown-item block px-8 py-4 font-american-typewriter tracking-wide transition-all duration-150"
                                      style={{
                                        color: "#000",
                                        fontSize: "0.95rem",
                                      }}
                                      onMouseEnter={() => handleDropdownItemHover(dItem.label)}
                                    >
                                      <span className="relative inline-block">
                                        {dItem.label}
                                        <span
                                          className="absolute bottom-[-2px] left-0 w-0 h-[1px] transition-all duration-300 group-hover/dropdown-item:w-full"
                                          style={{ backgroundColor: "#e58a4d" }}
                                        />
                                      </span>
                                    </a>
                                  ))}
                              </div>

                              {/* Right: Image preview */}
                              <div
                                className="w-96 h-full overflow-hidden relative p-4"
                                style={{ backgroundColor: "#e3e3d8" }}
                              >
                                {item.dropdown
                                  .filter((dItem) => dItem.label !== "All Products")
                                  .map((dItem) => (
                                    <img
                                      key={dItem.label}
                                      src={dItem.image}
                                      alt={dItem.label}
                                      className="absolute inset-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)] object-cover pointer-events-none rounded"
                                      style={{
                                        opacity: hoveredItem === dItem.label ? 1 : 0,
                                        transition: "opacity 0.18s ease-out",
                                        zIndex: hoveredItem === dItem.label ? 2 : 1,
                                      }}
                                      loading="eager"
                                    />
                                  ))}
                                {/* fallback/default image */}
                                {item.dropdown.filter((dItem) => dItem.label !== "All Products")[0]
                                  ?.image && (
                                  <img
                                    src={
                                      item.dropdown.filter(
                                        (dItem) => dItem.label !== "All Products"
                                      )[0].image
                                    }
                                    alt="default"
                                    className="absolute inset-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)] object-cover pointer-events-none rounded"
                                    style={{
                                      opacity: !hoveredItem ? 1 : 0,
                                      transition: "opacity 0.18s ease-out",
                                      zIndex: 0,
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

              {/* Mobile Menu Toggle - Cart and Hamburger */}
              <motion.div
                initial={disableAnimations ? undefined : { opacity: 0 }}
                animate={disableAnimations ? undefined : { opacity: 1 }}
                transition={disableAnimations ? undefined : { delay: 0.7, duration: 0.6 }}
                className="lg:hidden flex items-center space-x-1 z-10"
              >
                {/* Mobile Cart */}
                <div className="relative" ref={cartRef}>
                  <motion.button
                    whileHover={disableAnimations ? {} : { scale: 1.1 }}
                    whileTap={disableAnimations ? {} : { scale: 0.9 }}
                    onClick={() => setIsCartOpen(!isCartOpen)}
                    className="relative p-2 transition-all duration-300"
                    style={{ color: navStyles.textColor }}
                    aria-label="Shopping bag"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    {getTotalItems() > 0 && (
                      <span
                        className="absolute top-0 right-0 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-din-arabic"
                        style={{
                          backgroundColor: "#e58a4d",
                          fontWeight: 600,
                        }}
                      >
                        {getTotalItems()}
                      </span>
                    )}
                  </motion.button>
                  {/* Mobile Cart Dropdown */}
                  <AnimatePresence>
                    {isCartOpen && (
                      <motion.div
                        ref={cartPanelRef}
                        initial={
                          disableAnimations ? undefined : { opacity: 0, y: -10, scale: 0.95 }
                        }
                        animate={disableAnimations ? undefined : { opacity: 1, y: 0, scale: 1 }}
                        exit={disableAnimations ? undefined : { opacity: 0, y: -10, scale: 0.95 }}
                        transition={disableAnimations ? undefined : { duration: 0.2 }}
                        className="fixed left-4 right-4 top-[110px] max-w-md mx-auto border shadow-2xl z-[100]"
                        style={{
                          backgroundColor: "#e3e3d8",
                          borderColor: "rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        {/* Cart Header */}
                        <div className="p-4 border-b" style={{ borderColor: "rgba(0, 0, 0, 0.1)" }}>
                          <div className="flex items-center justify-between">
                            <h3 className="font-american-typewriter text-lg text-black">
                              Your Cart
                            </h3>
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
                            <div className="p-8 text-center">
                              <div className="mb-4">
                                <ShoppingBag className="w-12 h-12 text-black/30 mx-auto" />
                              </div>
                              <p className="font-din-arabic text-black/70 mb-4">
                                Nothing is in your cart
                              </p>
                              <button
                                onClick={() => setIsCartOpen(false)}
                                className="font-din-arabic px-6 py-2 bg-black text-white hover:bg-black/90 transition-colors tracking-wide"
                              >
                                Continue shopping
                              </button>
                            </div>
                          ) : (
                            <div className="p-4 space-y-4">
                              {cartItems.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex items-center space-x-3 p-3 bg-white/50 border"
                                  style={{ borderColor: "rgba(0, 0, 0, 0.05)" }}
                                >
                                  <Link
                                    href={item.handle ? `/products/${item.handle}` : "#"}
                                    className="flex items-center space-x-3 flex-1 min-w-0"
                                    onClick={() => setIsCartOpen(false)}
                                  >
                                    {item.image && (
                                      <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-16 h-16 object-contain"
                                      />
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-din-arabic text-black font-medium truncate">
                                        {item.name}
                                      </h4>
                                      <p className="font-din-arabic text-black/70 text-sm">
                                        {convertToLocale({
                                          amount: item.price,
                                          currency_code: "INR",
                                          maximumFractionDigits: 0,
                                        })}
                                      </p>
                                    </div>
                                  </Link>
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={() => handleQuantityChange(item.id, -1)}
                                      disabled={updatingCartItem === item.id}
                                      className="p-1 hover:bg-black/10 transition-colors rounded disabled:opacity-50 cursor-pointer"
                                    >
                                      <Minus className="w-3 h-3 text-black/70" />
                                    </button>
                                    <span className="font-din-arabic text-black text-sm min-w-[20px] text-center">
                                      {updatingCartItem === item.id ? "..." : item.quantity}
                                    </span>
                                    <button
                                      onClick={() => handleQuantityChange(item.id, 1)}
                                      disabled={updatingCartItem === item.id}
                                      className="p-1 hover:bg-black/10 transition-colors rounded disabled:opacity-50 cursor-pointer"
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
                          <div
                            className="p-4 border-t"
                            style={{ borderColor: "rgba(0, 0, 0, 0.1)" }}
                          >
                            <div className="flex items-center justify-between mb-4">
                              <span className="font-din-arabic text-black">Total:</span>
                              <span className="font-din-arabic text-black font-medium">
                                {convertToLocale({
                                  amount: getTotalPrice(),
                                  currency_code: "INR",
                                  maximumFractionDigits: 0,
                                })}
                              </span>
                            </div>
                            <div className="space-y-2 text-center">
                              <Link href={"/checkout?step=address"}>
                                <button
                                  onClick={() => setIsCartOpen(false)}
                                  className="w-full font-din-arabic py-3 bg-black text-white hover:bg-black/90 transition-colors tracking-wide"
                                >
                                  Checkout
                                </button>
                              </Link>
                              <button
                                onClick={() => setIsCartOpen(false)}
                                className="w-full font-din-arabic py-2 border text-black hover:bg-black/5 transition-colors tracking-wide text-center"
                                style={{ borderColor: "rgba(0, 0, 0, 0.2)" }}
                              >
                                Continue shopping
                              </button>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <motion.button
                  whileHover={disableAnimations ? {} : { scale: 1.1 }}
                  whileTap={disableAnimations ? {} : { scale: 0.9 }}
                  onClick={handleMobileMenuToggle}
                  className="p-2 transition-all duration-300"
                  style={{ color: navStyles.textColor }}
                  aria-label="Menu"
                >
                  {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </motion.button>
              </motion.div>

              {/* Desktop Actions */}
              <motion.div
                initial={disableAnimations ? undefined : { opacity: 0 }}
                animate={disableAnimations ? undefined : { opacity: 1 }}
                transition={disableAnimations ? undefined : { delay: 0.7, duration: 0.6 }}
                className="hidden lg:flex items-center gap-6"
              >
                {/* Search Section - Hidden when SearchMegaMenu is open */}
                {!isSearchOpen && (
                  <div className="relative flex items-center" ref={searchRef}>
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
                )}

                <motion.button
                  whileHover={disableAnimations ? {} : { scale: 1.1 }}
                  whileTap={disableAnimations ? {} : { scale: 0.9 }}
                  onClick={handleHeartClick}
                  className="p-2 transition-all duration-300"
                  style={{
                    color: isWishlisted ? "#e58a4d" : navStyles.textColor,
                  }}
                  aria-label="Favorites"
                >
                  <Heart className={`w-5 h-5 transition-colors`} />
                </motion.button>

                {/* Profile Icon */}
                <motion.button
                  whileHover={disableAnimations ? {} : { scale: 1.1 }}
                  whileTap={disableAnimations ? {} : { scale: 0.9 }}
                  className="p-2 transition-all duration-300"
                  style={{ color: navStyles.textColor }}
                  aria-label="Profile"
                >
                  <Link href="/account">
                    <User className="w-5 h-5" />
                  </Link>
                </motion.button>

                <div className="relative" ref={cartRef}>
                  <motion.button
                    whileHover={disableAnimations ? {} : { scale: 1.1 }}
                    whileTap={disableAnimations ? {} : { scale: 0.9 }}
                    onClick={handleCartToggle}
                    className="p-2 transition-all duration-300 relative"
                    style={{ color: navStyles.textColor }}
                    aria-label="Shopping bag"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    {getTotalItems() > 0 && (
                      <span
                        className="absolute -top-1 -right-1 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-din-arabic"
                        style={{
                          backgroundColor: "#e58a4d",
                          fontWeight: 600,
                        }}
                      >
                        {getTotalItems()}
                      </span>
                    )}
                  </motion.button>

                  {/* Cart Dropdown */}
                  <AnimatePresence>
                    {isCartOpen && (
                      <motion.div
                        initial={
                          disableAnimations ? undefined : { opacity: 0, y: -10, scale: 0.95 }
                        }
                        animate={disableAnimations ? undefined : { opacity: 1, y: 0, scale: 1 }}
                        exit={disableAnimations ? undefined : { opacity: 0, y: -10, scale: 0.95 }}
                        transition={disableAnimations ? undefined : { duration: 0.2 }}
                        className="absolute right-0 top-full mt-2 w-96 border shadow-2xl z-50"
                        style={{
                          backgroundColor: "#e3e3d8",
                          borderColor: "rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        {/* Cart Header */}
                        <div className="p-4 border-b" style={{ borderColor: "rgba(0, 0, 0, 0.1)" }}>
                          <div className="flex items-center justify-between">
                            <h3 className="font-american-typewriter text-lg text-black">
                              Your Cart
                            </h3>
                            <button
                              onClick={() => setIsCartOpen(false)}
                              className="p-1 hover:bg-black/10 transition-colors rounded"
                            >
                              <X className="w-4 h-4 text-black/70" />
                            </button>
                          </div>
                        </div>

                        {/* Cart Content */}
                        <div className="max-h-96 overflow-y-auto">
                          {cartItems.length === 0 ? (
                            <div className="p-8 text-center">
                              <div className="mb-4">
                                <ShoppingBag className="w-12 h-12 text-black/30 mx-auto" />
                              </div>
                              <p className="font-din-arabic text-black/70 mb-4">
                                Nothing is in your cart
                              </p>
                              <button
                                onClick={() => setIsCartOpen(false)}
                                className="font-din-arabic px-6 py-2 bg-black text-white hover:bg-black/90 transition-colors tracking-wide"
                              >
                                Continue shopping
                              </button>
                            </div>
                          ) : (
                            <div className="p-4 space-y-4">
                              {cartItems.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex items-center gap-3 p-3 bg-white/50 border"
                                  style={{ borderColor: "rgba(0, 0, 0, 0.05)" }}
                                >
                                  <Link
                                    href={item.handle ? `/products/${item.handle}` : "#"}
                                    className="flex items-center gap-3 flex-1"
                                    onClick={() => setIsCartOpen(false)}
                                  >
                                    {item.image && (
                                      <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-16 h-16 object-contain"
                                      />
                                    )}
                                    <div className="flex-1">
                                      <h4 className="font-din-arabic text-black font-medium">
                                        {item.name}
                                      </h4>
                                      <p className="font-din-arabic text-black/70 text-sm">
                                        {convertToLocale({
                                          amount: item.price,
                                          currency_code: "INR",
                                          maximumFractionDigits: 0,
                                        })}
                                      </p>
                                    </div>
                                  </Link>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => handleQuantityChange(item.id, -1)}
                                      disabled={updatingCartItem === item.id}
                                      className="p-1 hover:bg-black/10 transition-colors rounded disabled:opacity-50 cursor-pointer"
                                    >
                                      <Minus className="w-3 h-3 text-black/70" />
                                    </button>
                                    <span className="font-din-arabic text-black text-sm min-w-[20px] text-center">
                                      {updatingCartItem === item.id ? "..." : item.quantity}
                                    </span>
                                    <button
                                      onClick={() => handleQuantityChange(item.id, 1)}
                                      disabled={updatingCartItem === item.id}
                                      className="p-1 hover:bg-black/10 transition-colors rounded disabled:opacity-50 cursor-pointer"
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
                          <div
                            className="p-4 border-t"
                            style={{ borderColor: "rgba(0, 0, 0, 0.1)" }}
                          >
                            <div className="flex items-center justify-between mb-4">
                              <span className="font-din-arabic text-black">Total:</span>
                              <span className="font-din-arabic text-black font-medium">
                                {convertToLocale({
                                  amount: getTotalPrice(),
                                  currency_code: "INR",
                                  maximumFractionDigits: 0,
                                })}
                              </span>
                            </div>
                            <div className="space-y-2 text-center">
                              <Link href={"/checkout?step=address"}>
                                <button className="w-full font-din-arabic py-3 bg-black text-white hover:bg-black/90 transition-colors tracking-wide text-center">
                                  Checkout
                                </button>
                              </Link>
                              <button
                                onClick={() => setIsCartOpen(false)}
                                className="w-full font-din-arabic py-2 border text-black hover:bg-black/5 transition-colors tracking-wide text-center"
                                style={{ borderColor: "rgba(0, 0, 0, 0.2)" }}
                              >
                                Continue shopping
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
              style={{ top: "106px" }}
            />

            {/* Menu Content */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-[106px] bottom-0 w-full max-w-sm z-50 overflow-y-auto lg:hidden"
              style={{ backgroundColor: "#e3e3d8" }}
            >
              <div className="p-6">
                {/* Mobile Search Button */}
                <div className="mb-6 pb-6 border-b" style={{ borderColor: "rgba(0, 0, 0, 0.1)" }}>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      setIsSearchOpen(true)
                    }}
                    className="w-full flex items-center justify-between px-4 py-4 text-black font-din-arabic tracking-wider hover:bg-black/5 transition-colors bg-white/50 border"
                    style={{ borderColor: "rgba(0, 0, 0, 0.1)" }}
                  >
                    <span>Search Products</span>
                    <Search className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Navigation Links */}
                <nav className="space-y-1">
                  {menuItems.map((item) => (
                    <div key={item.name}>
                      {item.dropdown ? (
                        <div>
                          <button
                            onClick={() =>
                              setMobileActiveDropdown(
                                mobileActiveDropdown === item.name ? null : item.name
                              )
                            }
                            className="w-full flex items-center justify-between px-4 py-4 text-black font-din-arabic tracking-wider hover:bg-black/5 transition-colors"
                          >
                            <span>{item.name}</span>
                            <ChevronDown
                              className={`w-4 h-4 transition-transform ${
                                mobileActiveDropdown === item.name ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                          <AnimatePresence>
                            {mobileActiveDropdown === item.name && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
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

                  {/* Mobile-only: Gift Sets */}
                  <a
                    href="/in/gift-sets"
                    className="block px-4 py-4 text-black font-din-arabic tracking-wider hover:bg-black/5 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    GIFT SETS
                  </a>
                </nav>

                {/* Mobile Quick Actions */}
                <div
                  className="mt-6 pt-6 border-t space-y-3"
                  style={{ borderColor: "rgba(0, 0, 0, 0.1)" }}
                >
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      handleHeartClick()
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 text-black font-din-arabic tracking-wide hover:bg-black/5 transition-colors"
                  >
                    <span>Ledger</span>
                    <Heart className={`w-5 h-5 text-[#e58a4d]`} />
                  </button>
                  <a
                    href="/account"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full flex items-center justify-between px-4 py-3 text-black font-din-arabic tracking-wide hover:bg-black/5 transition-colors"
                  >
                    <span>My Account</span>
                    <User className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Login Required Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-american-typewriter text-xl text-black">
              Open Your Ledger
            </DialogTitle>
            <DialogDescription className="font-din-arabic text-black/70 pt-2">
              Sign in to add favourites to your Ledger.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 pt-4">
            <button
              onClick={() => {
                setShowLoginDialog(false)
                const currentPath = pathname || ""
                const countryMatch = currentPath.match(/^\/([^/]+)/)
                const countryCode = countryMatch ? countryMatch[1] : "in"
                router.push(`/${countryCode}/account?tab=signin`)
              }}
              className="w-full font-din-arabic py-3 bg-black text-white hover:bg-black/90 transition-colors tracking-wide"
            >
              Sign in
            </button>
            <button
              onClick={() => setShowLoginDialog(false)}
              className="w-full font-din-arabic py-2 border text-black hover:bg-black/5 transition-colors tracking-wide"
              style={{ borderColor: "rgba(0, 0, 0, 0.2)" }}
            >
              Keep Browsing
            </button>
          </div>
          <div className="pt-4 text-center">
            <button
              onClick={() => {
                setShowLoginDialog(false)
                const currentPath = pathname || ""
                const countryMatch = currentPath.match(/^\/([^/]+)/)
                const countryCode = countryMatch ? countryMatch[1] : "in"
                router.push(`/${countryCode}/account?tab=signup`)
              }}
              className="font-din-arabic text-sm text-black/70 hover:text-black transition-colors"
            >
              New here?{" "}
              <span className="underline decoration-black/20 hover:decoration-black/60">
                Create an account
              </span>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Search Mega Menu */}
      <SearchMegaMenu
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        countryCode={getCountryCode()}
        region={region}
      />
    </>
  )
}
