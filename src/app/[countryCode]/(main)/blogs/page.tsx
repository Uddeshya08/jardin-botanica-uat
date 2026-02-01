// blogs/page.tsx
"use client"
import { getAllBlogs } from "@lib/data/contentful"
import { Navigation } from "app/components/Navigation"
import { RippleEffect } from "app/components/RippleEffect"
import { ChevronLeft, ChevronRight, Facebook, Instagram, Search, Twitter, X } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import type { Blog } from "types/contentful"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

interface DailyFeedArticle {
  id: string
  categories: string[]
  title: string
  excerpt: string
}

interface FeaturedArticle {
  id: string
  title: string
  author: string
  excerpt: string
  imageUrl: string
  imageAlt: string
}

const Home = () => {
  const params = useParams()
  const countryCode = (params?.countryCode as string) || "in"
  const [email, setEmail] = useState("")
  const [activeTab, setActiveTab] = useState("HOME")
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([])

  // Fetch blogs from Contentful
  useEffect(() => {
    const fetchBlogs = async () => {
      const allBlogs = await getAllBlogs(undefined, countryCode)
      console.log("=== BLOGS FROM CONTENTFUL ===", allBlogs)
      setBlogs(allBlogs)
    }
    fetchBlogs()
  }, [countryCode])

  // Filter blogs based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredBlogs(blogs)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = blogs.filter(
        (blog) =>
          blog.title.toLowerCase().includes(query) ||
          (blog.description && blog.description.toLowerCase().includes(query)) ||
          (blog.author && blog.author.name && blog.author.name.toLowerCase().includes(query))
      )
      setFilteredBlogs(filtered)
    }
  }, [searchQuery, blogs])

  // Custom styles object

  const dailyFeedArticles: DailyFeedArticle[] = [
    {
      id: "1",
      categories: ["LIFESTYLE", "TECHNOLOGY"],
      title: "How to be as Productive as a Google Employee",
      excerpt:
        "Suspendisse quis orci ut orci pulvinar eleifend. Nulla eu mattis ipsum. Integer eget sagittis nulla praesent et maximus.",
    },
    {
      id: "2",
      categories: ["HEALTH"],
      title: "How Exercise Could Help You Learn a New Language",
      excerpt:
        "Etiam eu molestie eros, commodo hendrerit sapien. Nunc pretium tortor felis, eget cursus magna egetnec imperdiet ornare.",
    },
    {
      id: "3",
      categories: ["LIFESTYLE", "MAIN"],
      title: "Get the Best Catering for Your Summer Wedding in Philly",
      excerpt:
        "Etiam eu molestie eros, commodo nec turpis hendrerit sapien. Maecenas tempus leo ac nisi iaculis porta. Sed sapien tempus.",
    },
  ]

  const featuredArticles: FeaturedArticle[] = [
    {
      id: "1",
      title: "US Open 2017 latest: Women's semi-final results and Nadal vs Del Potro",
      author: "Alice Bohn",
      excerpt:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt porta velit, sed suscipit massa consequat sed. Integer est ante, dictum quis metus non, rhoncus accumsan ante.",
      imageUrl:
        "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=300",
      imageAlt: "Tennis player celebration",
    },
    {
      id: "2",
      title: "Renounce City's Vote to Drop References",
      author: "Thomas Williams",
      excerpt:
        "Sometimes it is easier to learn which advisors you should avoid versus learning how to select the best advisors. This can be tougher than it sounds because good and bad advisors look and sound a lot alike...",
      imageUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=200",
      imageAlt: "Business conference",
    },
    {
      id: "3",
      title: "Simone Rocha on the Importance of Shoes",
      author: "Amy Adams",
      excerpt:
        "In the latest installment of this series that goes inside the private working worlds of designers, Simone Rocha, founder and creative director of her own fashion line, discusses life in East London, the importance of shoes you can walk in, and fighting with her father.",
      imageUrl:
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=300",
      imageAlt: "Designer shoes",
    },
  ]

  const [message, setMessage] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    if (!email.includes("@")) {
      setMessage("Please enter a valid email address")
      setIsSuccess(false)
      return
    }

    setIsSubmitting(true)

    const { subscribeToNewsletter } = await import("@lib/data/brevo")
    const result = await subscribeToNewsletter(email)

    setIsSubmitting(false)
    setIsSuccess(result.success)
    setMessage(result.message)

    if (result.success) {
      setEmail("")
      setTimeout(() => {
        setMessage("")
      }, 5000)
    }
  }

  const [isScrolled, setIsScrolled] = useState(false)
  const [showStickyHeader, setShowStickyHeader] = useState(false)
  const [showStickyCart, setShowStickyCart] = useState(false)
  const [heroCartItem, setHeroCartItem] = useState<CartItem | null>(null)
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  const handleCartUpdate = (item: CartItem | null) => {
    setHeroCartItem(item)

    if (!item) return
  }

  const handleHeroQuantityUpdate = (quantity: number) => {
    if (heroCartItem) {
      setHeroCartItem({
        ...heroCartItem,
        quantity: quantity,
      })
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setIsScrolled(scrollY > 50)

      // Show sticky header after scrolling past the main navigation (approximately 200px)
      setShowStickyHeader(scrollY > 200)

      // Show sticky cart after scrolling past the ProductHero section (approximately 450px for compact height)
      // Show by default, hide only when heroCartItem exists and quantity is explicitly 0
      const shouldShowCart = scrollY > 450 && (heroCartItem === null || heroCartItem.quantity > 0)

      // Hide sticky cart when footer copyright is visible
      const footerElement = document.querySelector("footer")
      const copyrightElement = footerElement?.querySelector("p")

      if (copyrightElement && copyrightElement.textContent?.includes("© 2025 Jardin Botanica")) {
        const copyrightRect = copyrightElement.getBoundingClientRect()
        const isFooterVisible = copyrightRect.top < window.innerHeight && copyrightRect.bottom > 0

        setShowStickyCart(shouldShowCart && !isFooterVisible)
      } else {
        setShowStickyCart(shouldShowCart)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="bg-[#FEFDF3] min-h-screen">
      <RippleEffect />
      <Navigation
        isScrolled={isScrolled}
        cartItems={cartItems}
        onCartUpdate={handleCartUpdate}
        disableSticky={true}
        disableAnimations={true}
      />

      {/* Sticky Header */}
      {showStickyHeader && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-[#FEFDF3]">
          <div className="w-full px-4 lg:px-0">
            {/* Sticky Journal Heading */}
            <h1 className="font-american-typewriter text-center text-2xl md:text-4xl lg:text-7xl tracking-tight py-2 lg:py-0">
              Journal
            </h1>

            {/* Sticky Navigation Tabs */}
            <div
              className="w-full mt-2 md:mt-4 lg:mt-8 pt-2"
              style={{
                boxShadow:
                  "inset 0px 2px 0px 0px #d3d2ca, inset 0px 3px 0px 0px #fefdf3, inset 0px 4px 0px 0px #d3d2ca",
              }}
            >
              <div className="flex justify-start lg:justify-center items-center space-x-4 md:space-x-6 lg:space-x-8 mb-3 lg:mb-4 mt-2 lg:mt-4 overflow-x-auto lg:overflow-x-visible scrollbar-hide">
                <button
                  onClick={() => setActiveTab("HOME")}
                  className={`font-bold uppercase tracking-wide transition-colors duration-200 text-xs md:text-sm lg:text-base whitespace-nowrap ${
                    activeTab === "HOME" ? "text-[#4f5864]" : "text-[#4f5864] hover:text-[#626262]"
                  }`}
                >
                  HOME
                </button>
                <button
                  onClick={() => setActiveTab("POLITICS")}
                  className={`font-bold uppercase tracking-wide transition-colors duration-200 text-xs md:text-sm lg:text-base whitespace-nowrap ${
                    activeTab === "POLITICS" ? "text-[#000]" : "text-[#000] hover:text-[#626262]"
                  }`}
                >
                  POLITICS
                </button>
                <button
                  onClick={() => setActiveTab("TECHNOLOGY")}
                  className={`font-bold uppercase tracking-wide transition-colors duration-200 text-xs md:text-sm lg:text-base whitespace-nowrap ${
                    activeTab === "TECHNOLOGY" ? "text-[#000]" : "text-[#000] hover:text-[#626262]"
                  }`}
                >
                  TECHNOLOGY
                </button>
                <button
                  onClick={() => setActiveTab("SPORTS")}
                  className={`font-bold uppercase tracking-wide transition-colors duration-200 text-xs md:text-sm lg:text-base whitespace-nowrap ${
                    activeTab === "SPORTS" ? "text-[#000]" : "text-[#000] hover:text-[#626262]"
                  }`}
                >
                  SPORTS
                </button>
                <button
                  onClick={() => setActiveTab("FASHION")}
                  className={`font-bold uppercase tracking-wide transition-colors duration-200 text-xs md:text-sm lg:text-base whitespace-nowrap ${
                    activeTab === "FASHION" ? "text-[#000]" : "text-[#000] hover:text-[#626262]"
                  }`}
                >
                  FASHION
                </button>
                <button
                  onClick={() => setActiveTab("FOOD")}
                  className={`font-bold uppercase tracking-wide transition-colors duration-200 text-xs md:text-sm lg:text-base whitespace-nowrap ${
                    activeTab === "FOOD" ? "text-[#000]" : "text-[#000] hover:text-[#626262]"
                  }`}
                >
                  FOOD
                </button>
                <button
                  onClick={() => setActiveTab("SHORTCODES")}
                  className={`font-bold uppercase tracking-wide transition-colors duration-200 text-xs md:text-sm lg:text-base whitespace-nowrap ${
                    activeTab === "SHORTCODES" ? "text-[#000]" : "text-[#000] hover:text-[#626262]"
                  }`}
                >
                  SHORTCODES
                </button>
                <button
                  onClick={() => setActiveTab("POST TYPES")}
                  className={`font-bold uppercase tracking-wide transition-colors duration-200 text-xs md:text-sm lg:text-base whitespace-nowrap ${
                    activeTab === "POST TYPES" ? "text-[#000]" : "text-[#000] hover:text-[#626262]"
                  }`}
                >
                  POST TYPES
                </button>
                <button
                  onClick={() => setActiveTab("CONTACTS")}
                  className={`font-bold uppercase tracking-wide transition-colors duration-200 text-xs md:text-sm lg:text-base whitespace-nowrap ${
                    activeTab === "CONTACTS" ? "text-[#000]" : "text-[#000] hover:text-[#626262]"
                  }`}
                >
                  CONTACTS
                </button>
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="ml-4 p-1 hover:text-[#626262] transition-colors duration-200 flex-shrink-0"
                  aria-label={isSearchOpen ? "Close search" : "Open search"}
                >
                  {isSearchOpen ? (
                    <X className="w-4 h-4 lg:w-5 lg:h-5 text-[#4f5864]" />
                  ) : (
                    <Search className="w-4 h-4 lg:w-5 lg:h-5 text-[#4f5864]" />
                  )}
                </button>
              </div>

              {/* Sticky Horizontal Line */}
              <div className="w-full h-[1.5px] bg-[#4f5864]"></div>

              {/* Sticky Search Input - Appears when search is open */}
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="w-full overflow-hidden"
                    style={{
                      boxShadow:
                        "inset 0px 2px 0px 0px #d3d2ca, inset 0px 3px 0px 0px #fefdf3, inset 0px 4px 0px 0px #d3d2ca",
                    }}
                  >
                    <div className="px-4 md:px-8 lg:px-12 py-2 md:py-3">
                      <div className="relative max-w-2xl mx-auto lg:mx-0 lg:max-w-none">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search articles..."
                          className="w-full bg-transparent border-b-2 border-[#4f5864] pb-2 text-sm md:text-base font-din-arabic text-[#4f5864] placeholder:text-[#4f5864]/50 focus:outline-none focus:border-[#000] transition-colors duration-200"
                        />
                        <Search className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-[#4f5864] pointer-events-none" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}

      {/* Volume Text - Below sticky header, not part of it */}
      {showStickyHeader && (
        <div className="w-full bg-[#FEFDF3] pt-3 md:pt-4 pb-3 md:pb-4">
          <div className="w-full flex justify-end px-4 lg:pr-40">
            <p className="text-xs lg:text-sm font-american-typewriter text-black font-semibold tracking-[1px]">
              Volume 67, No.7 | September 2017
            </p>
          </div>
          {/* Light separator below volume text */}
          <div className="w-full h-[1px] bg-[#d3d2ca] mt-3 md:mt-4"></div>
        </div>
      )}

      {/* first section */}
      <div className="w-full bg-[#FEFDF3] relative pt-12 md:pt-24">
        {/* Centered Journal */}
        <motion.h1
          className="font-american-typewriter text-center text-3xl md:text-5xl lg:text-7xl tracking-tight uppercase px-4 lg:px-0"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Journal
        </motion.h1>

        {/* Navigation Tabs */}
        <motion.div
          className="w-full mt-4 lg:mt-8"
          style={{
            boxShadow:
              "inset 0px 2px 0px 0px #d3d2ca, inset 0px 3px 0px 0px #fefdf3, inset 0px 4px 0px 0px #d3d2ca",
          }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="flex justify-start lg:justify-center items-center space-x-4 md:space-x-6 lg:space-x-8 mb-4 pt-4 lg:pt-6 overflow-x-auto lg:overflow-x-visible scrollbar-hide px-4 lg:px-0">
            <button
              onClick={() => setActiveTab("HOME")}
              className={`font-bold uppercase tracking-wide transition-colors duration-200 text-xs md:text-sm lg:text-base whitespace-nowrap ${
                activeTab === "HOME" ? "text-[#4f5864]" : "text-[#4f5864] hover:text-[#626262]"
              }`}
            >
              HOME
            </button>
            <button
              onClick={() => setActiveTab("POLITICS")}
              className={`font-bold uppercase tracking-wide transition-colors duration-200 text-xs md:text-sm lg:text-base whitespace-nowrap ${
                activeTab === "POLITICS" ? "text-[#000]" : "text-[#000] hover:text-[#626262]"
              }`}
            >
              POLITICS
            </button>
            <button
              onClick={() => setActiveTab("TECHNOLOGY")}
              className={`font-bold uppercase tracking-wide transition-colors duration-200 text-xs md:text-sm lg:text-base whitespace-nowrap ${
                activeTab === "TECHNOLOGY" ? "text-[#000]" : "text-[#000] hover:text-[#626262]"
              }`}
            >
              TECHNOLOGY
            </button>
            <button
              onClick={() => setActiveTab("SPORTS")}
              className={`font-bold uppercase tracking-wide transition-colors duration-200 text-xs md:text-sm lg:text-base whitespace-nowrap ${
                activeTab === "SPORTS" ? "text-[#000]" : "text-[#000] hover:text-[#626262]"
              }`}
            >
              SPORTS
            </button>
            <button
              onClick={() => setActiveTab("FASHION")}
              className={`font-bold uppercase tracking-wide transition-colors duration-200 text-xs md:text-sm lg:text-base whitespace-nowrap ${
                activeTab === "FASHION" ? "text-[#000]" : "text-[#000] hover:text-[#626262]"
              }`}
            >
              FASHION
            </button>
            <button
              onClick={() => setActiveTab("FOOD")}
              className={`font-bold uppercase tracking-wide transition-colors duration-200 text-xs md:text-sm lg:text-base whitespace-nowrap ${
                activeTab === "FOOD" ? "text-[#000]" : "text-[#000] hover:text-[#626262]"
              }`}
            >
              FOOD
            </button>
            <button
              onClick={() => setActiveTab("SHORTCODES")}
              className={`font-bold uppercase tracking-wide transition-colors duration-200 text-xs md:text-sm lg:text-base whitespace-nowrap ${
                activeTab === "SHORTCODES" ? "text-[#000]" : "text-[#000] hover:text-[#626262]"
              }`}
            >
              SHORTCODES
            </button>
            <button
              onClick={() => setActiveTab("POST TYPES")}
              className={`font-bold uppercase tracking-wide transition-colors duration-200 text-xs md:text-sm lg:text-base whitespace-nowrap ${
                activeTab === "POST TYPES" ? "text-[#000]" : "text-[#000] hover:text-[#626262]"
              }`}
            >
              POST TYPES
            </button>
            <button
              onClick={() => setActiveTab("CONTACTS")}
              className={`font-bold uppercase tracking-wide transition-colors duration-200 text-xs md:text-sm lg:text-base whitespace-nowrap ${
                activeTab === "CONTACTS" ? "text-[#000]" : "text-[#000] hover:text-[#626262]"
              }`}
            >
              CONTACTS
            </button>
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="ml-4 p-1 hover:text-[#626262] transition-colors duration-200 flex-shrink-0"
              aria-label={isSearchOpen ? "Close search" : "Open search"}
            >
              {isSearchOpen ? (
                <X className="w-4 h-4 lg:w-5 lg:h-5 text-[#4f5864]" />
              ) : (
                <Search className="w-4 h-4 lg:w-5 lg:h-5 text-[#4f5864]" />
              )}
            </button>
          </div>

          {/* Horizontal Line - Full Width */}
          <motion.div
            className="w-full h-[1.5px] bg-[#4f5864]"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.5, duration: 0.8 }}
          />

          {/* Search Input - Appears when search is open */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="w-full overflow-hidden"
                style={{
                  boxShadow:
                    "inset 0px 2px 0px 0px #d3d2ca, inset 0px 3px 0px 0px #fefdf3, inset 0px 4px 0px 0px #d3d2ca",
                }}
              >
                <div className="px-4 md:px-8 lg:px-12 py-3 md:py-4">
                  <div className="relative max-w-2xl mx-auto lg:mx-0 lg:max-w-none">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search articles..."
                      className="w-full bg-transparent border-b-2 border-[#4f5864] pb-2 text-base md:text-lg font-din-arabic text-[#4f5864] placeholder:text-[#4f5864]/50 focus:outline-none focus:border-[#000] transition-colors duration-200"
                      autoFocus
                    />
                    <Search className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4f5864] pointer-events-none" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Volume Text - Directly below separator */}
          <motion.div
            className="w-full flex justify-end px-4 md:pr-20 lg:pr-40 pt-4"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <p className="text-xs md:text-sm font-american-typewriter text-black font-semibold tracking-[1px]">
              Volume 67, No.7 | September 2017
            </p>
          </motion.div>

          {/* Light separator below volume text */}
          <motion.div
            className="w-full h-[1px] bg-[#d3d2ca] mt-4"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "100%", opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          />
        </motion.div>

        {/* Tab Content */}
        <motion.div
          className="w-full mt-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <AnimatePresence mode="wait">
            {activeTab === "HOME" && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {/* All existing content goes here */}
              </motion.div>
            )}
            {activeTab === "POLITICS" && (
              <motion.div
                key="politics"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-center py-20"
              >
                <h3 className="text-2xl font-american-typewriter text-[#4f5864] mb-4">POLITICS</h3>
                <p className="text-[#626262] font-din-arabic">No content available at the moment</p>
              </motion.div>
            )}
            {activeTab === "TECHNOLOGY" && (
              <motion.div
                key="technology"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-center py-20"
              >
                <h3 className="text-2xl font-american-typewriter text-[#4f5864] mb-4">
                  TECHNOLOGY
                </h3>
                <p className="text-[#626262] font-din-arabic">No content available at the moment</p>
              </motion.div>
            )}
            {activeTab === "SPORTS" && (
              <motion.div
                key="sports"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-center py-20"
              >
                <h3 className="text-2xl font-american-typewriter text-[#4f5864] mb-4">SPORTS</h3>
                <p className="text-[#626262] font-din-arabic">No content available at the moment</p>
              </motion.div>
            )}
            {activeTab === "FASHION" && (
              <motion.div
                key="fashion"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-center py-20"
              >
                <h3 className="text-2xl font-american-typewriter text-[#4f5864] mb-4">FASHION</h3>
                <p className="text-[#626262] font-din-arabic">No content available at the moment</p>
              </motion.div>
            )}
            {activeTab === "FOOD" && (
              <motion.div
                key="food"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-center py-20"
              >
                <h3 className="text-2xl font-american-typewriter text-[#4f5864] mb-4">FOOD</h3>
                <p className="text-[#626262] font-din-arabic">No content available at the moment</p>
              </motion.div>
            )}
            {activeTab === "SHORTCODES" && (
              <motion.div
                key="shortcodes"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-center py-20"
              >
                <h3 className="text-2xl font-american-typewriter text-[#4f5864] mb-4">
                  SHORTCODES
                </h3>
                <p className="text-[#626262] font-din-arabic">No content available at the moment</p>
              </motion.div>
            )}
            {activeTab === "POST TYPES" && (
              <motion.div
                key="post-types"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-center py-20"
              >
                <h3 className="text-2xl font-american-typewriter text-[#4f5864] mb-4">
                  POST TYPES
                </h3>
                <p className="text-[#626262] font-din-arabic">No content available at the moment</p>
              </motion.div>
            )}
            {activeTab === "CONTACTS" && (
              <motion.div
                key="contacts"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-center py-20"
              >
                <h3 className="text-2xl font-american-typewriter text-[#4f5864] mb-4">CONTACTS</h3>
                <p className="text-[#626262] font-din-arabic">No content available at the moment</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Content sections - only show when HOME tab is active */}
      {activeTab === "HOME" && (
        <>
          {/* Search Results - Show when search is active */}
          {isSearchOpen && searchQuery.trim() !== "" && (
            <div className="max-w-7xl mx-auto my-8 md:my-12 lg:my-20 px-4 lg:px-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="font-american-typewriter text-2xl md:text-3xl mb-6 text-[#4f5864]">
                  Search Results {filteredBlogs.length > 0 && `(${filteredBlogs.length})`}
                </h2>

                {filteredBlogs.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-[#626262] font-din-arabic text-lg">
                      No articles found matching &quot;{searchQuery}&quot;
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {filteredBlogs.map((blog, index) => (
                      <motion.article
                        key={blog.slug}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="group"
                      >
                        <Link href={`/${countryCode}/blogs/${blog.slug}`}>
                          <div
                            className="relative overflow-hidden mb-4"
                            style={{ aspectRatio: "16/10" }}
                          >
                            <img
                              src={
                                blog.image ||
                                "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&h=500&fit=crop"
                              }
                              alt={blog.imagealt || blog.title}
                              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                            />
                          </div>
                          <div className="text-xs text-[#626262] mb-2 font-din-arabic tracking-[0.1em]">
                            {blog.publishedDate
                              ? new Date(blog.publishedDate)
                                  .toLocaleDateString("en-US", {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                  })
                                  .toUpperCase()
                              : ""}
                          </div>
                          <h3 className="font-american-typewriter text-lg mb-2 group-hover:underline">
                            {blog.title}
                          </h3>
                          <p className="text-sm font-din-arabic text-[#626262] line-clamp-2">
                            {blog.description}
                          </p>
                        </Link>
                      </motion.article>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          )}

          {/* Default Layout - Show when search is not active or empty */}
          {(!isSearchOpen || searchQuery.trim() === "") && (
            <>
              {/* second section */}
              <div className="max-w-7xl mx-auto my-8 md:my-12 lg:my-20 px-4 lg:px-0">
                <div className="flex flex-col lg:flex-row justify-between gap-6 lg:gap-8">
                  {/* Hero Article - 75% width */}
                  {blogs.length > 0 && (
                    <motion.div
                      className="w-full lg:w-[70%] flex-shrink-0"
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.6, duration: 0.8 }}
                    >
                      <Link href={`/${countryCode}/blogs/${blogs[0].slug}`}>
                        <div className="relative cursor-pointer">
                          <div
                            className="relative group w-full overflow-hidden"
                            style={{ aspectRatio: "858/971" }}
                          >
                            {/* Grayscale Base Image */}
                            <motion.img
                              src={
                                blogs[0].image ||
                                "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=858&h=971&fit=crop"
                              }
                              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                              alt={blogs[0].imagealt || blogs[0].title}
                              data-testid="hero-image"
                              initial={{ scale: 1.1, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: 0.8, duration: 1.0 }}
                            />

                            {/* Cream Overlay - Lightens image for text readability */}
                            <motion.div
                              className="absolute inset-0 bg-[#FEFDF3] transition-opacity duration-500"
                              initial={{ opacity: 0.5 }}
                              animate={{ opacity: 0.5 }}
                            />
                          </div>

                          {/* Gradient Overlay */}
                          {/* <div className="absolute inset-0 bg-gradient-to-r from-[#EFEEE2] via-[#EFEEE2]/70 to-transparent"></div> */}

                          {/* Article Overlay - vertically centered, left aligned */}
                          <motion.div
                            className="absolute top-1/2 left-4 md:left-8 lg:left-12 transform -translate-y-1/2 max-w-xs md:max-w-md lg:max-w-lg px-4 md:px-6 lg:px-8"
                            initial={{ x: -30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 1.0, duration: 0.8 }}
                          >
                            <motion.div
                              className="text-xs lg:text-sm text-gray-600 mb-2 lg:mb-3 text-[#626262] p-0 text-[14px]"
                              data-testid="hero-date"
                              initial={{ y: 10, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 1.2, duration: 0.6 }}
                            >
                              {blogs[0].publishedDate
                                ? new Date(blogs[0].publishedDate)
                                    .toLocaleDateString("en-US", {
                                      month: "long",
                                      day: "numeric",
                                      year: "numeric",
                                    })
                                    .toUpperCase()
                                : ""}
                            </motion.div>
                            <motion.h2
                              className="text-xl md:text-2xl lg:text-[48px] text-gray-900 mb-3 lg:mb-4 font-american-typewriter leading-tight"
                              style={{ letterSpacing: "2px", fontWeight: "600" }}
                              data-testid="hero-title"
                              initial={{ y: 15, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 1.3, duration: 0.6 }}
                            >
                              {blogs[0].title}
                            </motion.h2>
                            <motion.p
                              className="mb-4 lg:mb-6 text-sm lg:text-[16px] font-din-arabic tracking-[1px] text-[#626262]"
                              data-testid="hero-excerpt"
                              initial={{ y: 15, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 1.4, duration: 0.6 }}
                            >
                              {blogs[0].description}
                            </motion.p>
                            <motion.span
                              className="text-sm lg:text-base font-american-typewriter font-medium text-gray-600 hover:underline"
                              style={{ fontWeight: "600" }}
                              initial={{ y: 10, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 1.5, duration: 0.6 }}
                            >
                              Read more...
                            </motion.span>
                          </motion.div>
                        </div>
                      </Link>
                    </motion.div>
                  )}

                  {/* Daily Feed Sidebar - 25% width */}
                  <motion.div
                    className="w-full lg:w-[30%]"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                  >
                    <div className="bg-[#FEFDF3] px-4 lg:px-6 h-fit">
                      <motion.h3
                        className="mb-4 lg:mb-6 text-2xl lg:text-[36px] font-american-typewriter font-bold italic tracking-[2px]"
                        data-testid="daily-feed-title"
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1.0, duration: 0.6 }}
                      >
                        Daily Feed
                      </motion.h3>

                      <motion.p
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ delay: 1.2, duration: 0.8 }}
                      ></motion.p>

                      <div
                        className="space-y-4 lg:space-y-5"
                        style={{
                          boxShadow:
                            "inset 0px 2px 0px 0px #d3d2ca, inset 0px 3px 0px 0px #fefdf3, inset 0px 4px 0px 0px #d3d2ca",
                        }}
                      >
                        {blogs.slice(1).map((blog, index) => (
                          <motion.article
                            key={blog.slug}
                            className={`${
                              index < blogs.slice(1).length - 1
                                ? "border-b border-gray-200 pb-3 lg:pb-4"
                                : "pb-3 lg:pb-4"
                            }`}
                            data-testid={`daily-feed-article-${blog.slug}`}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 1.3 + index * 0.2, duration: 0.6 }}
                          >
                            <motion.div
                              className={`text-xs lg:text-sm text-gray-600 mb-2 font-din-arabic tracking-[0.1em] text-[14px] ${index == 0 ? "pt-4 lg:pt-6" : "pt-0"}`}
                              data-testid={`article-date-${blog.slug}`}
                              initial={{ x: -10, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{
                                delay: 1.4 + index * 0.2,
                                duration: 0.5,
                              }}
                            >
                              {blog.publishedDate
                                ? new Date(blog.publishedDate)
                                    .toLocaleDateString("en-US", {
                                      month: "long",
                                      day: "numeric",
                                      year: "numeric",
                                    })
                                    .toUpperCase()
                                : ""}
                            </motion.div>
                            <motion.h4
                              className="mb-2"
                              initial={{ x: -10, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{
                                delay: 1.5 + index * 0.2,
                                duration: 0.5,
                              }}
                            >
                              <Link
                                href={`/${countryCode}/blogs/${blog.slug}`}
                                className="hover:underline text-base lg:text-lg font-din-arabic font-bold text-[20px] tracking-[1px] text-[#403F3F]"
                                data-testid={`article-title-${blog.slug}`}
                              >
                                {blog.title}
                              </Link>
                            </motion.h4>
                            <motion.p
                              className="text-sm lg:text-base font-din-arabic text-[16px] tracking-[1px] text-[#626262]"
                              data-testid={`article-excerpt-${blog.slug}`}
                              initial={{ y: 10, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{
                                delay: 1.6 + index * 0.2,
                                duration: 0.5,
                              }}
                            >
                              {blog.description}
                            </motion.p>
                          </motion.article>
                        ))}
                      </div>

                      {/* View More */}
                      <motion.div
                        className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 2.2, duration: 0.6 }}
                      >
                        <a
                          href="#"
                          className="text-[14px] font-medium text-[#535c4a] hover:underline font-american-typewriter tracking-[1px] font-semibold"
                          data-testid="view-more-posts"
                        >
                          View more posts
                        </a>
                        <div className="flex space-x-2">
                          <ChevronLeft
                            className="w-4 h-4 text-gray-600"
                            data-testid="pagination-prev"
                          />
                          <ChevronRight
                            className="w-4 h-4 text-gray-600"
                            data-testid="pagination-next"
                          />
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </div>

              <div className="max-w-7xl mx-auto my-8 md:my-12 lg:my-20 px-4 lg:px-0">
                <motion.div
                  className="text-left mb-6 lg:mb-10"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  <motion.h2
                    className="font-american-typewriter pb-4 lg:pb-6 text-2xl md:text-3xl tracking-tight uppercase"
                    style={{ fontWeight: "bold" }}
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  >
                    Featured News
                  </motion.h2>
                  <motion.h2
                    className="font-american-typewriter pt-2 text-3xl tracking-tight uppercase"
                    style={{
                      boxShadow:
                        "inset 0px 2px 0px 0px #d3d2ca, inset 0px 3px 0px 0px #fefdf3, inset 0px 4px 0px 0px #d3d2ca",
                    }}
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  >
                    {/* Featured News */}
                  </motion.h2>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                  {/* Left Side - 2 Blogs (70%) */}
                  <div className="flex-1 w-full lg:w-[70%]">
                    <motion.div
                      className="pb-8 lg:pb-12"
                      style={{ paddingBottom: "40px" }}
                      initial={{ y: 40, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.9, duration: 0.8 }}
                    >
                      <div className="flex flex-col md:flex-row gap-4 lg:gap-6">
                        {/* Image = 65 */}
                        <motion.div
                          className="w-full md:w-1/2 flex flex-col"
                          initial={{ x: -30, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 1.1, duration: 0.8 }}
                        >
                          <div className="relative group w-full h-auto overflow-hidden">
                            {/* Grayscale Base Image */}
                            <motion.img
                              src="https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=800&h=600&fit=crop"
                              alt="Business conference and networking"
                              className="w-full h-auto object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                              initial={{ scale: 1.1, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: 1.3, duration: 0.8 }}
                            />

                            {/* Black Overlay - Removed on hover */}
                            <motion.div
                              className="absolute inset-0 bg-black group-hover:opacity-0 transition-opacity duration-500"
                              initial={{ opacity: 0 }}
                            />
                          </div>
                        </motion.div>

                        {/* Text = 35 */}
                        <motion.div
                          className="w-full md:w-1/2 flex flex-col"
                          style={{ paddingBottom: "5px", position: "relative" }}
                          initial={{ x: 30, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 1.2, duration: 0.8 }}
                        >
                          <div>
                            <motion.h3
                              className="font-american-typewriter text-lg lg:text-xl mb-2 lg:mb-3"
                              initial={{ y: 15, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 1.4, duration: 0.6 }}
                            >
                              Renounce City's Vote to Drop References
                            </motion.h3>
                            <motion.p
                              className="text-sm lg:text-base font-din-arabic text-[#535c4a] mb-3 lg:mb-4 text-[16px]"
                              initial={{ y: 15, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 1.5, duration: 0.6 }}
                            >
                              by Thomas Williams
                            </motion.p>
                            <motion.p
                              className="leading-relaxed text-sm lg:text-base font-din-arabic tracking-[1px] text-[#626262] text-[16px]"
                              initial={{ y: 15, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 1.6, duration: 0.6 }}
                            >
                              Sometimes it is easier to learn which advisors you should avoid versus
                              learning how to select the best advisors...
                            </motion.p>
                          </div>
                          <motion.a
                            href="#"
                            className="text-sm lg:text-base font-american-typewriter font-medium text-gray-600 hover:underline mt-4 hidden lg:block"
                            style={{ position: "absolute", bottom: "0" }}
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 1.7, duration: 0.6 }}
                          >
                            Read more...
                          </motion.a>
                          <motion.a
                            href="#"
                            className="text-sm font-american-typewriter font-medium text-gray-600 hover:underline mt-4 lg:hidden"
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 1.7, duration: 0.6 }}
                          >
                            Read more...
                          </motion.a>
                        </motion.div>
                      </div>
                    </motion.div>

                    {/* Second Blog */}
                    <motion.div
                      className=""
                      initial={{ y: 40, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 1.3, duration: 0.8 }}
                    >
                      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                        {/* Left: Title + Author + Image */}
                        <motion.div
                          className="w-full md:w-1/2 flex flex-col"
                          style={{ borderTop: "1px solid #D3D2CA" }}
                          initial={{ x: -30, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 1.5, duration: 0.8 }}
                        >
                          {/* Title + Author */}
                          <div className="mb-3 lg:mb-4">
                            <motion.h3
                              className="font-american-typewriter text-lg lg:text-xl mb-2 leading-tight pt-4 lg:pt-6"
                              initial={{ y: 15, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 1.7, duration: 0.6 }}
                            >
                              US Open 2017 latest: Women's semi-final results and Nadal vs Del Potro
                            </motion.h3>
                            <motion.p
                              className="text-xs lg:text-sm italic text-gray-600"
                              initial={{ y: 10, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 1.8, duration: 0.6 }}
                            >
                              by Alice Bohn
                            </motion.p>
                          </div>
                          {/* Image */}
                          <motion.div
                            className="flex-1"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 1.9, duration: 0.8 }}
                          >
                            <div className="relative group w-full h-48 lg:h-64 overflow-hidden">
                              {/* Grayscale Base Image */}
                              <motion.img
                                src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop"
                                alt="Tennis player in action"
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                initial={{ scale: 1.1, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 2.1, duration: 0.8 }}
                              />

                              {/* Black Overlay - Removed on hover */}
                              <motion.div
                                className="absolute inset-0 bg-black group-hover:opacity-0 transition-opacity duration-500"
                                initial={{ opacity: 0 }}
                              />
                            </div>
                          </motion.div>
                        </motion.div>

                        {/* Right: Description + Read More */}
                        <motion.div
                          className="w-full md:w-1/2 flex flex-col justify-between pb-6 lg:pb-10"
                          style={{
                            borderTop: "1px solid #D3D2CA",
                            paddingBottom: "5px",
                          }}
                          initial={{ x: 30, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 1.6, duration: 0.8 }}
                        >
                          <div>
                            <motion.p
                              className="leading-relaxed mb-3 lg:mb-4 pt-4 lg:pt-6 text-sm lg:text-base font-din-arabic tracking-[1px] text-[#626262] text-[16px]"
                              initial={{ y: 15, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 1.8, duration: 0.6 }}
                            >
                              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt
                              porta velit, sed suscipit massa consequat sed.
                            </motion.p>
                            <motion.p
                              className="leading-relaxed mb-3 lg:mb-4 text-sm lg:text-base font-din-arabic tracking-[1px] text-[#626262] text-[16px]"
                              initial={{ y: 15, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 1.9, duration: 0.6 }}
                            >
                              Quisque auctor justo eu odio tincidunt, vitae consectetur nulla
                              consequat. Nam vel aliquet turpis, ac sollicitudin nisl.
                            </motion.p>
                            <motion.p
                              className="leading-relaxed mb-3 lg:mb-4 text-sm lg:text-base font-din-arabic tracking-[1px] text-[#626262] text-[16px]"
                              initial={{ y: 15, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 2.0, duration: 0.6 }}
                            >
                              Cras erat leo, mollis sit amet lacus a, tristique euismod quam.
                              Suspendisse viverra a turpis in sodales.
                            </motion.p>
                          </div>
                          <motion.a
                            href="#"
                            className="text-sm lg:text-base font-american-typewriter font-medium text-gray-600 hover:underline"
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 2.1, duration: 0.6 }}
                          >
                            Read more...
                          </motion.a>
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Right Side - 1 Blog (30%) */}
                  <motion.div
                    className="w-full lg:w-[30%]"
                    initial={{ x: 40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.1, duration: 0.8 }}
                  >
                    <div className="">
                      <div className="relative group w-full h-64 md:h-80 lg:h-96 mb-4 lg:mb-6 overflow-hidden">
                        {/* Grayscale Base Image */}
                        <motion.img
                          src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=600&fit=crop"
                          alt="Fashion designer shoes and accessories"
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                          initial={{ scale: 1.1, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 1.3, duration: 0.8 }}
                        />

                        {/* Black Overlay - Removed on hover */}
                        <motion.div
                          className="absolute inset-0 bg-black group-hover:opacity-0 transition-opacity duration-500"
                          initial={{ opacity: 0 }}
                        />
                      </div>

                      <motion.div
                        className="px-2"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1.5, duration: 0.8 }}
                      >
                        <motion.h3
                          className="text-xl lg:text-2xl font-american-typewriter mb-2 lg:mb-3 leading-tight"
                          initial={{ y: 15, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 1.7, duration: 0.6 }}
                        >
                          Simone Rocha on the Importance of Shoes
                        </motion.h3>
                        <motion.p
                          className="text-xs lg:text-sm italic text-gray-600 mb-3 lg:mb-4"
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 1.8, duration: 0.6 }}
                        >
                          by Amy Adams
                        </motion.p>
                        <motion.p
                          className="leading-relaxed mb-3 lg:mb-4 text-sm lg:text-base font-din-arabic"
                          style={{
                            letterSpacing: "1px",
                            color: "#626262",
                            fontSize: "16px",
                          }}
                          initial={{ y: 15, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 1.9, duration: 0.6 }}
                        >
                          In the latest installment of this series that goes inside the private
                          working worlds of designers, Simone Rocha, founder and creative director
                          of her own fashion line, discusses life in East London, the importance of
                          shoes you can walk in, and fighting with her father.
                        </motion.p>
                        <motion.a
                          href="#"
                          className="text-sm lg:text-base font-american-typewriter font-medium text-gray-600 hover:underline"
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 2.0, duration: 0.6 }}
                        >
                          READ MORE...
                        </motion.a>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>

                {/* View More Posts */}
                <motion.div
                  className="mt-8 md:mt-12 lg:mt-16 pt-6 lg:pt-8 border-t border-gray-300 pb-4 lg:pb-6"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 2.3, duration: 0.8 }}
                >
                  <a
                    href="#"
                    className="text-xs lg:text-sm font-medium text-gray-900 hover:underline"
                  >
                    VIEW MORE POSTS
                  </a>
                </motion.div>
              </div>
            </>
          )}
        </>
      )}

      {/* Newsletter Subscription Section */}
      <div className="w-full bg-[#FEFDF3] py-8 lg:py-10">
        <div className="max-w-4xl mx-auto px-4 lg:px-6">
          <motion.div
            className="text-center"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            {/* Newsletter Heading */}
            <motion.h2
              className="font-american-typewriter text-xl md:text-2xl lg:text-3xl font-bold mb-6 lg:mb-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              The Botanist’s Circle
            </motion.h2>
            <motion.p
              className="font-din-arabic text-black/70 mb-8 leading-relaxed text-lg"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Newsletter dispatches from the lab — when there’s something worth sharing.
            </motion.p>

            {/* Email Form */}
            <motion.form
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col gap-4 max-w-md mx-auto"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
                {/* Email Input */}
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address *"
                  required
                  disabled={isSubmitting}
                  className="flex-1 w-full px-4 py-3 border border-gray-300 bg-white text-black placeholder-gray-500 italic focus:outline-none focus:border-black transition-colors font-din-arabic"
                />

                {/* Subscribe Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3 bg-black text-white font-american-typewriter font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors"
                >
                  {isSubmitting ? "Joined" : "Join the circle"}
                </button>
              </div>
              {message && (
                <div
                  className={`text-sm px-4 py-2 rounded text-center ${
                    isSuccess
                      ? "bg-green-100 text-green-800 border border-green-300"
                      : "bg-red-100 text-red-800 border border-red-300"
                  }`}
                >
                  {message}
                </div>
              )}
            </motion.form>
          </motion.div>
        </div>
      </div>

      {/* Bottom Separator Line */}
      <motion.div
        className="w-full h-1 bg-black"
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ delay: 0.8, duration: 1.0 }}
      />
    </div>
  )
}
// `const [email, setEmail] = useState("")` is already there.

// Let's use `multi_replace_file_content`.

export default Home
