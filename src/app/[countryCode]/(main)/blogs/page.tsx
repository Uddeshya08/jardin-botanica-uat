"use client"
import {
  getAllJournalTags,
  getFeaturedBlogs,
  getHeroAndOtherBlogs,
  getNonHeroBlogs,
} from "@lib/data/contentful"
import { Navigation } from "app/components/Navigation"
import { RippleEffect } from "app/components/RippleEffect"
import type { CartItem } from "app/context/cart-items-context"
import { ChevronLeft, ChevronRight, Facebook, Instagram, Search, Twitter, X } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import type { Blog, JournalTag } from "types/contentful"

// Removed unused local interfaces

const Home = () => {
  const params = useParams()
  const countryCode = (params?.countryCode as string) || "in"
  const [email, setEmail] = useState("")
  const [activeTab, setActiveTab] = useState("HOME")
  const [heroBlog, setHeroBlog] = useState<Blog | null>(null)
  const [dailyFeedBlogs, setDailyFeedBlogs] = useState<Blog[]>([])
  const [featuredBlogs, setFeaturedBlogs] = useState<Blog[]>([])
  const [tags, setTags] = useState<JournalTag[]>([])
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([])

  const DAILY_FEED_LIMIT = 3
  const FEATURED_LIMIT = 3
  const [dailyFeedPage, setDailyFeedPage] = useState(0)
  const [dailyFeedTotal, setDailyFeedTotal] = useState(0)
  const [featuredPage, setFeaturedPage] = useState(0)
  const [featuredTotal, setFeaturedTotal] = useState(0)

  const featuredBlogList = featuredBlogs
  const hasMoreFeatured = featuredBlogs.length < featuredTotal

  const chunkedFeaturedBlogs: Blog[][] = featuredBlogList.reduce((acc: Blog[][], curr, i) => {
    if (i % 3 === 0) {
      acc.push([curr])
    } else {
      acc[acc.length - 1].push(curr)
    }
    return acc
  }, [])

  // Fetch hero, daily feed, and featured blogs from Contentful
  useEffect(() => {
    const fetchData = async () => {
      // Fetch hero separately
      const [heroResult, dailyFeedResult, featuredResult, allTags] = await Promise.all([
        getHeroAndOtherBlogs(1, 0, countryCode),
        getNonHeroBlogs(DAILY_FEED_LIMIT, dailyFeedPage * DAILY_FEED_LIMIT, countryCode),
        getFeaturedBlogs(FEATURED_LIMIT, featuredPage * FEATURED_LIMIT, countryCode),
        getAllJournalTags(),
      ])

      // Set hero (first blog from hero result)
      if (heroResult.blogs.length > 0) {
        setHeroBlog(heroResult.blogs[0])
      }

      // Set daily feed (replace on pagination)
      setDailyFeedBlogs(dailyFeedResult.blogs)
      setDailyFeedTotal(dailyFeedResult.total)

      // Append featured blogs (accumulate on pagination)
      if (featuredPage === 0) {
        setFeaturedBlogs(featuredResult.blogs)
      } else {
        setFeaturedBlogs((prev) => [...prev, ...featuredResult.blogs])
      }
      setFeaturedTotal(featuredResult.total)
      setTags(allTags)
    }
    fetchData()
  }, [countryCode, dailyFeedPage, featuredPage])

  // Filter blogs based on search query and active tab
  useEffect(() => {
    let filtered = [...(heroBlog ? [heroBlog] : []), ...dailyFeedBlogs]

    // Filter by active tab (tag)
    if (activeTab !== "HOME") {
      filtered = filtered.filter((blog: Blog) =>
        blog.journalTags?.some((tag: JournalTag) => tag.name === activeTab)
      )
    }

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (blog: Blog) =>
          blog.title.toLowerCase().includes(query) ||
          (blog.description && blog.description.toLowerCase().includes(query)) ||
          (blog.author && blog.author.name && blog.author.name.toLowerCase().includes(query))
      )
    }

    setFilteredBlogs(filtered)
  }, [searchQuery, heroBlog, dailyFeedBlogs, activeTab])

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

  const handleDailyFeedPrev = () => {
    if (dailyFeedPage > 0) {
      setDailyFeedPage(dailyFeedPage - 1)
    }
  }

  const handleDailyFeedNext = () => {
    const maxPage = Math.ceil(dailyFeedTotal / DAILY_FEED_LIMIT) - 1
    if (dailyFeedPage < maxPage) {
      setDailyFeedPage(dailyFeedPage + 1)
    }
  }

  const handleFeaturedViewMore = () => {
    if (!hasMoreFeatured) return
    setFeaturedPage((prev) => prev + 1)
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

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setIsScrolled(scrollY > 50)

      // Show sticky header after scrolling past the main navigation
      setShowStickyHeader(scrollY > 200)

      // Show sticky cart logic
      const shouldShowCart = scrollY > 450 && (heroCartItem === null || heroCartItem.quantity > 0)
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
  }, [heroCartItem])

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
            <h1 className="font-american-typewriter text-center text-2xl md:text-4xl lg:text-7xl tracking-tight py-2 lg:py-0">
              Journal
            </h1>

            <div
              className="w-full mt-2 md:mt-4 lg:mt-8 pt-2"
              style={{
                boxShadow:
                  "inset 0px 2px 0px 0px #d3d2ca, inset 0px 3px 0px 0px #fefdf3, inset 0px 4px 0px 0px #d3d2ca",
              }}
            >
              <div className="flex justify-start lg:justify-center items-center space-x-4 md:space-x-6 lg:space-x-8 mb-3 lg:mb-4 mt-2 lg:mt-4 overflow-x-auto lg:overflow-x-visible scrollbar-hide">
                <button
                  type="button"
                  onClick={() => setActiveTab("HOME")}
                  className={`font-bold uppercase tracking-wide transition-colors duration-200 text-xs md:text-sm lg:text-base whitespace-nowrap ${
                    activeTab === "HOME" ? "text-[#4f5864]" : "text-[#4f5864] hover:text-[#626262]"
                  }`}
                >
                  HOME
                </button>
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => setActiveTab(tag.name)}
                    className={`font-bold uppercase tracking-wide transition-colors duration-200 text-xs md:text-sm lg:text-base whitespace-nowrap ${
                      activeTab === tag.name ? "text-[#000]" : "text-[#000] hover:text-[#626262]"
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
                <button
                  type="button"
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

              <div className="w-full h-[1.5px] bg-[#4f5864]"></div>

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

      {showStickyHeader && (
        <div className="w-full bg-[#FEFDF3] pt-3 md:pt-4 pb-3 md:pb-4">
          <div className="w-full flex justify-end px-4 lg:pr-40">
            <p className="text-xs lg:text-sm font-american-typewriter text-black font-semibold tracking-[1px]">
              Volume 67, No.7 | September 2017
            </p>
          </div>
          <div className="w-full h-[1px] bg-[#d3d2ca] mt-3 md:mt-4"></div>
        </div>
      )}

      {/* Main Journal Section */}
      <div className="w-full bg-[#FEFDF3] relative pt-12 md:pt-24">
        <motion.h1
          className="font-american-typewriter text-center text-3xl md:text-5xl lg:text-7xl tracking-tight uppercase px-4 lg:px-0"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Journal
        </motion.h1>

        {/* Tabs */}
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
              type="button"
              onClick={() => setActiveTab("HOME")}
              className={`font-bold uppercase tracking-wide transition-colors duration-200 text-xs md:text-sm lg:text-base whitespace-nowrap ${
                activeTab === "HOME" ? "text-[#4f5864]" : "text-[#4f5864] hover:text-[#626262]"
              }`}
            >
              HOME
            </button>
            {tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => setActiveTab(tag.name)}
                className={`font-bold uppercase tracking-wide transition-colors duration-200 text-xs md:text-sm lg:text-base whitespace-nowrap ${
                  activeTab === tag.name ? "text-[#000]" : "text-[#000] hover:text-[#626262]"
                }`}
              >
                {tag.name}
              </button>
            ))}
            <button
              type="button"
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

          <motion.div
            className="w-full h-[1.5px] bg-[#4f5864]"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.5, duration: 0.8 }}
          />

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
            {activeTab === "HOME" ? (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {/* Search Results */}
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

                {/* Default content (Hero + Daily Feed) */}
                {(!isSearchOpen || searchQuery.trim() === "") && (
                  <>
                    <div className="max-w-7xl mx-auto my-8 md:my-12 lg:my-20 px-4 lg:px-0">
                      <div className="flex flex-col lg:flex-row justify-between gap-6 lg:gap-8">
                        {/* Hero Article */}
                        {heroBlog && (
                          <motion.div
                            className="w-full lg:w-[70%] flex-shrink-0"
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                          >
                            <Link href={`/${countryCode}/blogs/${heroBlog.slug}`}>
                              <div className="relative cursor-pointer">
                                <div
                                  className="relative group w-full overflow-hidden"
                                  style={{ aspectRatio: "858/971" }}
                                >
                                  <motion.img
                                    src={
                                      heroBlog.image ||
                                      "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=858&h=971&fit=crop"
                                    }
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                    alt={heroBlog.imagealt || heroBlog.title}
                                    initial={{ scale: 1.1, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.8, duration: 1.0 }}
                                  />
                                  <motion.div
                                    className="absolute inset-0 bg-[#FEFDF3] transition-opacity duration-500"
                                    initial={{ opacity: 0.5 }}
                                    animate={{ opacity: 0.5 }}
                                  />
                                </div>
                                <motion.div
                                  className="absolute top-1/2 left-4 md:left-8 lg:left-12 transform -translate-y-1/2 max-w-xs md:max-w-md lg:max-w-lg px-4 md:px-6 lg:px-8"
                                  initial={{ x: -30, opacity: 0 }}
                                  animate={{ x: 0, opacity: 1 }}
                                  transition={{ delay: 1.0, duration: 0.8 }}
                                >
                                  <motion.div
                                    className="text-xs lg:text-sm text-gray-600 mb-2 lg:mb-3 text-[#626262] p-0 text-[14px]"
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.2, duration: 0.6 }}
                                  >
                                    {heroBlog.publishedDate
                                      ? new Date(heroBlog.publishedDate)
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
                                    initial={{ y: 15, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.3, duration: 0.6 }}
                                  >
                                    {heroBlog.title}
                                  </motion.h2>
                                  <motion.p
                                    className="mb-4 lg:mb-6 text-sm lg:text-[16px] font-din-arabic tracking-[1px] text-[#626262]"
                                    initial={{ y: 15, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.4, duration: 0.6 }}
                                  >
                                    {heroBlog.description}
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

                        {/* Daily Feed Sidebar */}
                        <motion.div
                          className="w-full lg:w-[30%]"
                          initial={{ x: 50, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.8, duration: 0.8 }}
                        >
                          <div className="bg-[#FEFDF3] px-4 lg:px-6 h-fit">
                            <motion.h3
                              className="mb-4 lg:mb-6 text-2xl lg:text-[36px] font-american-typewriter font-bold italic tracking-[2px]"
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
                              {dailyFeedBlogs.map((blog, index) => (
                                <motion.article
                                  key={blog.slug}
                                  className={`${
                                    index < dailyFeedBlogs.length - 1
                                      ? "border-b border-gray-200 pb-3 lg:pb-4"
                                      : "pb-3 lg:pb-4"
                                  }`}
                                  initial={{ y: 20, opacity: 0 }}
                                  animate={{ y: 0, opacity: 1 }}
                                  transition={{ delay: 1.3 + index * 0.2, duration: 0.6 }}
                                >
                                  <motion.div
                                    className={`text-xs lg:text-sm text-gray-600 mb-2 font-din-arabic tracking-[0.1em] text-[14px] ${
                                      index == 0 ? "pt-4 lg:pt-6" : "pt-0"
                                    }`}
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
                                    >
                                      {blog.title}
                                    </Link>
                                  </motion.h4>
                                  <motion.p
                                    className="text-sm lg:text-base font-din-arabic text-[16px] tracking-[1px] text-[#626262]"
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
                              <button
                                type="button"
                                className="text-[14px] font-medium text-[#535c4a] hover:underline font-american-typewriter tracking-[1px] font-semibold"
                              >
                                View more posts
                              </button>
                              <div className="flex space-x-2">
                                <button
                                  type="button"
                                  onClick={handleDailyFeedPrev}
                                  disabled={dailyFeedPage === 0}
                                  className="disabled:opacity-30"
                                >
                                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                                </button>
                                <button
                                  type="button"
                                  onClick={handleDailyFeedNext}
                                  disabled={
                                    dailyFeedPage >=
                                    Math.ceil(dailyFeedTotal / DAILY_FEED_LIMIT) - 1
                                  }
                                  className="disabled:opacity-30"
                                >
                                  <ChevronRight className="w-4 h-4 text-gray-600" />
                                </button>
                              </div>
                            </motion.div>
                          </div>
                        </motion.div>
                      </div>
                    </div>

                    {/* Featured News Section */}
                    {featuredBlogs.length > 0 && (
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
                            {/* Separator line essentially */}
                          </motion.h2>
                        </motion.div>

                        <div className="flex flex-col gap-12 lg:gap-16">
                          {chunkedFeaturedBlogs.map((chunk, chunkIndex) => (
                            <div key={`featured-chunk-${chunkIndex}`}>
                              {chunkIndex > 0 && (
                                <motion.div
                                  className="w-full mb-12 lg:mb-16"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ duration: 0.8 }}
                                >
                                  <h2
                                    className="font-american-typewriter tracking-tight uppercase"
                                    style={{
                                      borderBottom: "1px solid #d3d2ca",
                                      height: "1px",
                                    }}
                                  ></h2>
                                </motion.div>
                              )}
                              <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                                {/* Left Side - Up to 2 Blogs (70%) */}
                                <div className="flex-1 w-full lg:w-[70%]">
                                  {chunk[0] && (
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
                                          className="w-full md:w-1/2 flex flex-col cursor-pointer group"
                                          initial={{ x: -30, opacity: 0 }}
                                          animate={{ x: 0, opacity: 1 }}
                                          transition={{ delay: 1.1, duration: 0.8 }}
                                        >
                                          <Link
                                            href={`/${countryCode}/blogs/${chunk[0].slug}`}
                                            className="relative w-full h-auto overflow-hidden block"
                                          >
                                            {/* Grayscale Base Image */}
                                            <motion.img
                                              src={
                                                chunk[0].image ||
                                                "https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=800&h=600&fit=crop"
                                              }
                                              alt={chunk[0].imagealt || chunk[0].title}
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
                                          </Link>
                                        </motion.div>

                                        {/* Text = 35 */}
                                        <motion.div
                                          className="w-full md:w-1/2 flex flex-col group"
                                          style={{ paddingBottom: "5px", position: "relative" }}
                                          initial={{ x: 30, opacity: 0 }}
                                          animate={{ x: 0, opacity: 1 }}
                                          transition={{ delay: 1.2, duration: 0.8 }}
                                        >
                                          <div>
                                            <Link
                                              href={`/${countryCode}/blogs/${chunk[0].slug}`}
                                              className="block"
                                            >
                                              <motion.h3
                                                className="font-american-typewriter text-lg lg:text-xl mb-2 lg:mb-3 group-hover:underline"
                                                initial={{ y: 15, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{ delay: 1.4, duration: 0.6 }}
                                              >
                                                {chunk[0].title}
                                              </motion.h3>
                                            </Link>
                                            {chunk[0].author && (
                                              <motion.p
                                                className="text-sm lg:text-base font-din-arabic text-[#535c4a] mb-3 lg:mb-4 text-[16px]"
                                                initial={{ y: 15, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{ delay: 1.5, duration: 0.6 }}
                                              >
                                                by {chunk[0].author.name}
                                              </motion.p>
                                            )}
                                            <motion.p
                                              className="leading-relaxed text-sm lg:text-base font-din-arabic tracking-[1px] text-[#626262] text-[16px] line-clamp-3"
                                              initial={{ y: 15, opacity: 0 }}
                                              animate={{ y: 0, opacity: 1 }}
                                              transition={{ delay: 1.6, duration: 0.6 }}
                                            >
                                              {chunk[0].description}
                                            </motion.p>
                                          </div>
                                          <motion.div
                                            className="mt-4 lg:hidden"
                                            initial={{ y: 10, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 1.7, duration: 0.6 }}
                                          >
                                            <Link
                                              href={`/${countryCode}/blogs/${chunk[0].slug}`}
                                              className="text-sm font-american-typewriter font-medium text-gray-600 hover:underline inline-block uppercase tracking-wide"
                                            >
                                              Read more...
                                            </Link>
                                          </motion.div>
                                          <motion.div
                                            className="mt-4 hidden lg:block"
                                            style={{ position: "absolute", bottom: "0" }}
                                            initial={{ y: 10, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 1.7, duration: 0.6 }}
                                          >
                                            <Link
                                              href={`/${countryCode}/blogs/${chunk[0].slug}`}
                                              className="text-sm lg:text-base font-american-typewriter font-medium text-gray-600 hover:underline inline-block uppercase tracking-wide"
                                            >
                                              Read more...
                                            </Link>
                                          </motion.div>
                                        </motion.div>
                                      </div>
                                    </motion.div>
                                  )}

                                  {/* Second Blog */}
                                  {chunk[1] && (
                                    <motion.div
                                      className=""
                                      initial={{ y: 40, opacity: 0 }}
                                      animate={{ y: 0, opacity: 1 }}
                                      transition={{ delay: 1.3, duration: 0.8 }}
                                    >
                                      <div className="flex flex-col md:flex-row gap-4 md:gap-6 group">
                                        {/* Left: Title + Author + Image */}
                                        <motion.div
                                          className="w-full md:w-1/2 flex flex-col"
                                          style={{ borderTop: "1px solid #D3D2CA" }}
                                          initial={{ x: -30, opacity: 0 }}
                                          animate={{ x: 0, opacity: 1 }}
                                          transition={{ delay: 1.5, duration: 0.8 }}
                                        >
                                          {/* Title + Author */}
                                          <Link
                                            href={`/${countryCode}/blogs/${chunk[1].slug}`}
                                            className="mb-3 lg:mb-4 block"
                                          >
                                            <motion.h3
                                              className="font-american-typewriter text-lg lg:text-xl mb-2 leading-tight pt-4 lg:pt-6 group-hover:underline"
                                              initial={{ y: 15, opacity: 0 }}
                                              animate={{ y: 0, opacity: 1 }}
                                              transition={{ delay: 1.7, duration: 0.6 }}
                                            >
                                              {chunk[1].title}
                                            </motion.h3>
                                            {chunk[1].author && (
                                              <motion.p
                                                className="text-xs lg:text-sm italic text-gray-600"
                                                initial={{ y: 10, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{ delay: 1.8, duration: 0.6 }}
                                              >
                                                by {chunk[1].author.name}
                                              </motion.p>
                                            )}
                                          </Link>
                                          {/* Image */}
                                          <motion.div
                                            className="flex-1"
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 1.9, duration: 0.8 }}
                                          >
                                            <Link
                                              href={`/${countryCode}/blogs/${chunk[1].slug}`}
                                              className="relative group/img w-full h-48 lg:h-64 overflow-hidden block"
                                            >
                                              {/* Grayscale Base Image */}
                                              <motion.img
                                                src={
                                                  chunk[1].image ||
                                                  "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop"
                                                }
                                                alt={chunk[1].imagealt || chunk[1].title}
                                                className="w-full h-full object-cover grayscale group-hover/img:grayscale-0 transition-all duration-500"
                                                initial={{ scale: 1.1, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ delay: 2.1, duration: 0.8 }}
                                              />

                                              {/* Black Overlay - Removed on hover */}
                                              <motion.div
                                                className="absolute inset-0 bg-black group-hover/img:opacity-0 transition-opacity duration-500"
                                                initial={{ opacity: 0 }}
                                              />
                                            </Link>
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
                                              className="leading-relaxed mb-3 lg:mb-4 pt-4 lg:pt-6 text-sm lg:text-base font-din-arabic tracking-[1px] text-[#626262] text-[16px] line-clamp-6"
                                              initial={{ y: 15, opacity: 0 }}
                                              animate={{ y: 0, opacity: 1 }}
                                              transition={{ delay: 1.8, duration: 0.6 }}
                                            >
                                              {chunk[1].description}
                                            </motion.p>
                                          </div>
                                          <motion.div
                                            initial={{ y: 10, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 2.1, duration: 0.6 }}
                                          >
                                            <Link
                                              href={`/${countryCode}/blogs/${chunk[1].slug}`}
                                              className="text-sm lg:text-base font-american-typewriter font-medium text-gray-600 hover:underline inline-block mt-4 uppercase tracking-wide"
                                            >
                                              Read more...
                                            </Link>
                                          </motion.div>
                                        </motion.div>
                                      </div>
                                    </motion.div>
                                  )}
                                </div>

                                {/* Right Side - 1 Blog (30%) */}
                                {chunk[2] && (
                                  <motion.div
                                    className="w-full lg:w-[30%]"
                                    initial={{ x: 40, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 1.1, duration: 0.8 }}
                                  >
                                    <div className="group">
                                      <Link
                                        href={`/${countryCode}/blogs/${chunk[2].slug}`}
                                        className="relative w-full h-64 md:h-80 lg:h-96 mb-4 lg:mb-6 overflow-hidden block"
                                      >
                                        {/* Grayscale Base Image */}
                                        <motion.img
                                          src={
                                            chunk[2].image ||
                                            "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=600&fit=crop"
                                          }
                                          alt={chunk[2].imagealt || chunk[2].title}
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
                                      </Link>

                                      <motion.div
                                        className="px-2 cursor-pointer"
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 1.5, duration: 0.8 }}
                                      >
                                        <Link
                                          href={`/${countryCode}/blogs/${chunk[2].slug}`}
                                          className="block"
                                        >
                                          <motion.h3
                                            className="text-xl lg:text-2xl font-american-typewriter mb-2 lg:mb-3 leading-tight group-hover:underline"
                                            initial={{ y: 15, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 1.7, duration: 0.6 }}
                                          >
                                            {chunk[2].title}
                                          </motion.h3>
                                        </Link>
                                        {chunk[2].author && (
                                          <motion.p
                                            className="text-xs lg:text-sm italic text-gray-600 mb-3 lg:mb-4"
                                            initial={{ y: 10, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 1.8, duration: 0.6 }}
                                          >
                                            by {chunk[2].author.name}
                                          </motion.p>
                                        )}
                                        <motion.p
                                          className="leading-relaxed mb-3 lg:mb-4 text-sm lg:text-base font-din-arabic line-clamp-4"
                                          style={{
                                            letterSpacing: "1px",
                                            color: "#626262",
                                            fontSize: "16px",
                                          }}
                                          initial={{ y: 15, opacity: 0 }}
                                          animate={{ y: 0, opacity: 1 }}
                                          transition={{ delay: 1.9, duration: 0.6 }}
                                        >
                                          {chunk[2].description}
                                        </motion.p>
                                        <motion.div
                                          initial={{ y: 10, opacity: 0 }}
                                          animate={{ y: 0, opacity: 1 }}
                                          transition={{ delay: 2.0, duration: 0.6 }}
                                        >
                                          <Link
                                            href={`/${countryCode}/blogs/${chunk[2].slug}`}
                                            className="text-sm lg:text-base font-american-typewriter font-medium text-gray-600 hover:underline inline-block mt-2 uppercase tracking-wide"
                                          >
                                            READ MORE...
                                          </Link>
                                        </motion.div>
                                      </motion.div>
                                    </div>
                                  </motion.div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        {hasMoreFeatured && (
                          <motion.div
                            className="mt-8 md:mt-12 lg:mt-16 pt-6 lg:pt-8 border-t border-gray-300 pb-4 lg:pb-6"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 2.3, duration: 0.8 }}
                          >
                            <button
                              type="button"
                              onClick={handleFeaturedViewMore}
                              className="text-xs lg:text-sm font-medium text-gray-900 hover:underline"
                            >
                              VIEW MORE POSTS
                            </button>
                          </motion.div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            ) : (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-center py-20"
              >
                {filteredBlogs.length > 0 ? (
                  <div className="max-w-7xl mx-auto px-4 lg:px-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {filteredBlogs.map((blog, index) => (
                      <motion.article
                        key={blog.slug}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="group text-left"
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
                ) : (
                  <>
                    <h3 className="text-2xl font-american-typewriter text-[#4f5864] mb-4">
                      {activeTab}
                    </h3>
                    <p className="text-[#626262] font-din-arabic">No articles found for this tag</p>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Newsletter Subscription Section */}
      <div className="w-full bg-[#FEFDF3] py-8 lg:py-10">
        <div className="max-w-4xl mx-auto px-4 lg:px-6">
          <motion.div
            className="text-center"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
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

            <motion.form
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col gap-4 max-w-md mx-auto"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address *"
                  required
                  disabled={isSubmitting}
                  className="flex-1 w-full px-4 py-3 border border-gray-300 bg-white text-black placeholder-gray-500 italic focus:outline-none focus:border-black transition-colors font-din-arabic"
                />
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

      <motion.div
        className="w-full h-1 bg-black"
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ delay: 0.8, duration: 1.0 }}
      />
    </div>
  )
}

export default Home
