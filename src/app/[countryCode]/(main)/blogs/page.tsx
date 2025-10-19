// blogs/page.tsx
'use client'
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Facebook,
  Instagram,
  Twitter,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { RippleEffect } from 'app/components/RippleEffect'
import { Navigation } from 'app/components/Navigation'

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
  const [email, setEmail] = useState('')
  const [activeTab, setActiveTab] = useState('HOME')

  // Custom styles object
  const styles = {
    bannerHeading: {
      fontFamily: '"American Typewriter"',
      fontSize: '42px',
      letterSpacing: '5px',
      color: '#4f5864',
    },
    subCopy: {
      fontFamily: '"font-din-arabic"',
      fontSize: '16px',
      letterSpacing: '1px',
      color: '#626262',
    },
    subsequentHeading: {
      fontFamily: '"American Typewriter"',
      fontSize: '48px',
      letterSpacing: '2px',
      color: '#000',
      fontWeight: '600',
    },
    subsequentHeading3: {
      fontFamily: '"American Typewriter"',
      fontSize: '14px',
      letterSpacing: '1px',
      color: '#000000',
      fontWeight: '600',
    },
    subsequentHeading2: {
      fontFamily: '"font-dinBold"',
      fontSize: '20px',
      letterSpacing: '1px',
      color: '#403F3F',
    },
    newspaperSerif: {
      fontFamily: '"American Typewriter"',
      fontSize: '24px',
      letterSpacing: '5px',
      color: '#4f5864',
    },
    newspaperSpacing: {
      lineHeight: '1.6',
    },
    tightSpacing: {
      lineHeight: '1.3',
    },
    trackingNewspaper: {
      fontFamily: '"DIN Arabic Regular"',
      letterSpacing: '0.1em',
    },
    trackingWideNewspaper: {
      fontFamily: '"DIN Arabic Regular"',
      letterSpacing: '0.15em',
    },
  }

  const dailyFeedArticles: DailyFeedArticle[] = [
    {
      id: '1',
      categories: ['LIFESTYLE', 'TECHNOLOGY'],
      title: 'How to be as Productive as a Google Employee',
      excerpt:
        'Suspendisse quis orci ut orci pulvinar eleifend. Nulla eu mattis ipsum. Integer eget sagittis nulla praesent et maximus.',
    },
    {
      id: '2',
      categories: ['HEALTH'],
      title: 'How Exercise Could Help You Learn a New Language',
      excerpt:
        'Etiam eu molestie eros, commodo hendrerit sapien. Nunc pretium tortor felis, eget cursus magna egetnec imperdiet ornare.',
    },
    {
      id: '3',
      categories: ['LIFESTYLE', 'MAIN'],
      title: 'Get the Best Catering for Your Summer Wedding in Philly',
      excerpt:
        'Etiam eu molestie eros, commodo nec turpis hendrerit sapien. Maecenas tempus leo ac nisi iaculis porta. Sed sapien tempus.',
    },
  ]

  const featuredArticles: FeaturedArticle[] = [
    {
      id: '1',
      title:
        "US Open 2017 latest: Women's semi-final results and Nadal vs Del Potro",
      author: 'Alice Bohn',
      excerpt:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt porta velit, sed suscipit massa consequat sed. Integer est ante, dictum quis metus non, rhoncus accumsan ante.',
      imageUrl:
        'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=300',
      imageAlt: 'Tennis player celebration',
    },
    {
      id: '2',
      title: "Renounce City's Vote to Drop References",
      author: 'Thomas Williams',
      excerpt:
        'Sometimes it is easier to learn which advisors you should avoid versus learning how to select the best advisors. This can be tougher than it sounds because good and bad advisors look and sound a lot alike...',
      imageUrl:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=200',
      imageAlt: 'Business conference',
    },
    {
      id: '3',
      title: 'Simone Rocha on the Importance of Shoes',
      author: 'Amy Adams',
      excerpt:
        'In the latest installment of this series that goes inside the private working worlds of designers, Simone Rocha, founder and creative director of her own fashion line, discusses life in East London, the importance of shoes you can walk in, and fighting with her father.',
      imageUrl:
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=300',
      imageAlt: 'Designer shoes',
    },
  ]

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      console.log('Newsletter signup:', email)
      setEmail('')
      // TODO: Implement newsletter subscription API call
    }
  }

  const [isScrolled, setIsScrolled] = useState(false)
  const [showStickyHeader, setShowStickyHeader] = useState(false)
  const [showStickyCart, setShowStickyCart] = useState(false)
  const [heroCartItem, setHeroCartItem] = useState<CartItem | null>(null)
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 'soft-orris-hand-veil',
      name: 'Soft Orris Hand Veil',
      price: 1800,
      quantity: 1,
      image:
        'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop',
    },
  ])

  const handleCartUpdate = (item: CartItem | null) => {
    setHeroCartItem(item)

    // Update cartItems array for navigation
    if (item && item.quantity > 0) {
      setCartItems((prevItems) => {
        const existingIndex = prevItems.findIndex(
          (cartItem) => cartItem.id === item.id
        )
        if (existingIndex >= 0) {
          // Update existing item
          const updatedItems = [...prevItems]
          updatedItems[existingIndex] = item
          return updatedItems
        } else {
          // Add new item
          return [...prevItems, item]
        }
      })
    } else if (item && item.quantity === 0) {
      // Remove item if quantity is 0
      setCartItems((prevItems) =>
        prevItems.filter((cartItem) => cartItem.id !== item.id)
      )
    }
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
      const shouldShowCart =
        scrollY > 450 && (heroCartItem === null || heroCartItem.quantity > 0)

      // Hide sticky cart when footer copyright is visible
      const footerElement = document.querySelector('footer')
      const copyrightElement = footerElement?.querySelector('p')

      if (
        copyrightElement &&
        copyrightElement.textContent?.includes('© 2025 Jardin Botanica')
      ) {
        const copyrightRect = copyrightElement.getBoundingClientRect()
        const isFooterVisible =
          copyrightRect.top < window.innerHeight && copyrightRect.bottom > 0

        setShowStickyCart(shouldShowCart && !isFooterVisible)
      } else {
        setShowStickyCart(shouldShowCart)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
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
            <div className="w-full mt-2 md:mt-4 lg:mt-8 pt-2" style={{ boxShadow: "inset 0px 2px 0px 0px #d3d2ca, inset 0px 3px 0px 0px #fefdf3, inset 0px 4px 0px 0px #d3d2ca" }}>
              <div className="flex justify-start lg:justify-center items-center space-x-4 md:space-x-6 lg:space-x-8 mb-3 lg:mb-4 mt-2 lg:mt-4 overflow-x-auto lg:overflow-x-visible scrollbar-hide">
                <button
                  onClick={() => setActiveTab('HOME')}
                  className={`font-bold uppercase tracking-wide transition-colors duration-200 text-xs md:text-sm lg:text-base whitespace-nowrap ${activeTab === 'HOME'
                    ? 'text-[#4f5864]'
                    : 'text-[#4f5864] hover:text-[#626262]'
                    }`}
                >
                  HOME
                </button>
                <button
                  onClick={() => setActiveTab('POLITICS')}
                  className={`font-bold uppercase tracking-wide transition-colors duration-200 text-xs md:text-sm lg:text-base whitespace-nowrap ${activeTab === 'POLITICS'
                    ? 'text-[#000]'
                    : 'text-[#000] hover:text-[#626262]'
                    }`}
                >
                  POLITICS
                </button>
                <button
                  onClick={() => setActiveTab('TECHNOLOGY')}
                  className={`font-bold uppercase tracking-wide transition-colors duration-200 text-xs md:text-sm lg:text-base whitespace-nowrap ${activeTab === 'TECHNOLOGY'
                    ? 'text-[#000]'
                    : 'text-[#000] hover:text-[#626262]'
                    }`}
                >
                  TECHNOLOGY
                </button>
                <button
                  onClick={() => setActiveTab('SPORTS')}
                  className={`font-bold uppercase tracking-wide transition-colors duration-200 text-xs md:text-sm lg:text-base whitespace-nowrap ${activeTab === 'SPORTS'
                    ? 'text-[#000]'
                    : 'text-[#000] hover:text-[#626262]'
                    }`}
                >
                  SPORTS
                </button>
                <button
                  onClick={() => setActiveTab('FASHION')}
                  className={`font-bold uppercase tracking-wide transition-colors duration-200 text-xs md:text-sm lg:text-base whitespace-nowrap ${activeTab === 'FASHION'
                    ? 'text-[#000]'
                    : 'text-[#000] hover:text-[#626262]'
                    }`}
                >
                  FASHION
                </button>
                <button
                  onClick={() => setActiveTab('FOOD')}
                  className={`font-bold uppercase tracking-wide transition-colors duration-200 text-xs md:text-sm lg:text-base whitespace-nowrap ${activeTab === 'FOOD'
                    ? 'text-[#000]'
                    : 'text-[#000] hover:text-[#626262]'
                    }`}
                >
                  FOOD
                </button>
                <button
                  onClick={() => setActiveTab('SHORTCODES')}
                  className={`font-bold uppercase tracking-wide transition-colors duration-200 text-xs md:text-sm lg:text-base whitespace-nowrap ${activeTab === 'SHORTCODES'
                    ? 'text-[#000]'
                    : 'text-[#000] hover:text-[#626262]'
                    }`}
                >
                  SHORTCODES
                </button>
                <button
                  onClick={() => setActiveTab('POST TYPES')}
                  className={`font-bold uppercase tracking-wide transition-colors duration-200 text-xs md:text-sm lg:text-base whitespace-nowrap ${activeTab === 'POST TYPES'
                    ? 'text-[#000]'
                    : 'text-[#000] hover:text-[#626262]'
                    }`}
                >
                  POST TYPES
                </button>
                <button
                  onClick={() => setActiveTab('CONTACTS')}
                  className={`font-bold uppercase tracking-wide transition-colors duration-200 text-xs md:text-sm lg:text-base whitespace-nowrap ${activeTab === 'CONTACTS'
                    ? 'text-[#000]'
                    : 'text-[#000] hover:text-[#626262]'
                    }`}
                >
                  CONTACTS
                </button>
                <Search className="w-4 h-4 lg:w-5 lg:h-5 text-[#4f5864] ml-4 hover:text-[#626262] transition-colors duration-200 cursor-pointer flex-shrink-0" />
              </div>

              {/* Sticky Horizontal Line */}
              <div className="w-full h-[1.5px] bg-[#4f5864]"></div>
            </div>
          </div>
        </div>
      )}

      {/* Volume Text - Below sticky header, not part of it */}
      {showStickyHeader && (
        <div className="w-full bg-[#FEFDF3] pt-3 md:pt-4 pb-3 md:pb-4">
          <div className="w-full flex justify-end px-4 lg:pr-40">
            <p className="text-xs lg:text-sm" style={styles.subsequentHeading3}>
              Volume 67, No.7 | September 2017
            </p>
          </div>
          {/* Light separator below volume text */}
          <div className="w-full h-[1px] bg-[#d3d2ca] mt-3 md:mt-4"></div>
        </div>
      )}

      {/* first section */}
      <div
        className="w-full bg-[#FEFDF3] relative"
      >
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
          style={{ boxShadow: "inset 0px 2px 0px 0px #d3d2ca, inset 0px 3px 0px 0px #fefdf3, inset 0px 4px 0px 0px #d3d2ca" }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="flex justify-start lg:justify-center items-center space-x-4 md:space-x-6 lg:space-x-8 mb-4 pt-4 lg:pt-6 overflow-x-auto lg:overflow-x-visible scrollbar-hide px-4 lg:px-0">
            <button
              onClick={() => setActiveTab('HOME')}
              className={`font-bold uppercase tracking-wide transition-colors duration-200 text-xs md:text-sm lg:text-base whitespace-nowrap ${activeTab === 'HOME'
                ? 'text-[#4f5864]'
                : 'text-[#4f5864] hover:text-[#626262]'
                }`}
            >
              HOME
            </button>
            <button
              onClick={() => setActiveTab('POLITICS')}
              className={`font-bold uppercase tracking-wide transition-colors duration-200 text-xs md:text-sm lg:text-base whitespace-nowrap ${activeTab === 'POLITICS'
                ? 'text-[#000]'
                : 'text-[#000] hover:text-[#626262]'
                }`}
            >
              POLITICS
            </button>
            <button
              onClick={() => setActiveTab('TECHNOLOGY')}
              className={`font-bold uppercase tracking-wide transition-colors duration-200 text-xs md:text-sm lg:text-base whitespace-nowrap ${activeTab === 'TECHNOLOGY'
                ? 'text-[#000]'
                : 'text-[#000] hover:text-[#626262]'
                }`}
            >
              TECHNOLOGY
            </button>
            <button
              onClick={() => setActiveTab('SPORTS')}
              className={`font-bold uppercase tracking-wide transition-colors duration-200 text-xs md:text-sm lg:text-base whitespace-nowrap ${activeTab === 'SPORTS'
                ? 'text-[#000]'
                : 'text-[#000] hover:text-[#626262]'
                }`}
            >
              SPORTS
            </button>
            <button
              onClick={() => setActiveTab('FASHION')}
              className={`font-bold uppercase tracking-wide transition-colors duration-200 text-xs md:text-sm lg:text-base whitespace-nowrap ${activeTab === 'FASHION'
                ? 'text-[#000]'
                : 'text-[#000] hover:text-[#626262]'
                }`}
            >
              FASHION
            </button>
            <button
              onClick={() => setActiveTab('FOOD')}
              className={`font-bold uppercase tracking-wide transition-colors duration-200 text-xs md:text-sm lg:text-base whitespace-nowrap ${activeTab === 'FOOD'
                ? 'text-[#000]'
                : 'text-[#000] hover:text-[#626262]'
                }`}
            >
              FOOD
            </button>
            <button
              onClick={() => setActiveTab('SHORTCODES')}
              className={`font-bold uppercase tracking-wide transition-colors duration-200 text-xs md:text-sm lg:text-base whitespace-nowrap ${activeTab === 'SHORTCODES'
                ? 'text-[#000]'
                : 'text-[#000] hover:text-[#626262]'
                }`}
            >
              SHORTCODES
            </button>
            <button
              onClick={() => setActiveTab('POST TYPES')}
              className={`font-bold uppercase tracking-wide transition-colors duration-200 text-xs md:text-sm lg:text-base whitespace-nowrap ${activeTab === 'POST TYPES'
                ? 'text-[#000]'
                : 'text-[#000] hover:text-[#626262]'
                }`}
            >
              POST TYPES
            </button>
            <button
              onClick={() => setActiveTab('CONTACTS')}
              className={`font-bold uppercase tracking-wide transition-colors duration-200 text-xs md:text-sm lg:text-base whitespace-nowrap ${activeTab === 'CONTACTS'
                ? 'text-[#000]'
                : 'text-[#000] hover:text-[#626262]'
                }`}
            >
              CONTACTS
            </button>
            <Search className="w-4 h-4 lg:w-5 lg:h-5 text-[#4f5864] ml-4 hover:text-[#626262] transition-colors duration-200 cursor-pointer flex-shrink-0" />
          </div>

          {/* Horizontal Line - Full Width */}
          <motion.div
            className="w-full h-[1.5px] bg-[#4f5864]"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ delay: 0.5, duration: 0.8 }}
          />

          {/* Volume Text - Directly below separator */}
          <motion.div
            className="w-full flex justify-end px-4 md:pr-20 lg:pr-40 pt-4"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <p
              className="text-xs md:text-sm"
              style={{...styles.subsequentHeading3, fontSize: undefined}}
            >
              Volume 67, No.7 | September 2017
            </p>
          </motion.div>

          {/* Light separator below volume text */}
          <motion.div
            className="w-full h-[1px] bg-[#d3d2ca] mt-4"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: '100%', opacity: 1 }}
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
            {activeTab === 'HOME' && (
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
            {activeTab === 'POLITICS' && (
              <motion.div
                key="politics"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-center py-20"
              >
                <h3 className="text-2xl font-american-typewriter text-[#4f5864] mb-4">POLITICS</h3>
                <p className="text-[#626262] font-dinRegular">No content available at the moment</p>
              </motion.div>
            )}
            {activeTab === 'TECHNOLOGY' && (
              <motion.div
                key="technology"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-center py-20"
              >
                <h3 className="text-2xl font-american-typewriter text-[#4f5864] mb-4">TECHNOLOGY</h3>
                <p className="text-[#626262] font-dinRegular">No content available at the moment</p>
              </motion.div>
            )}
            {activeTab === 'SPORTS' && (
              <motion.div
                key="sports"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-center py-20"
              >
                <h3 className="text-2xl font-american-typewriter text-[#4f5864] mb-4">SPORTS</h3>
                <p className="text-[#626262] font-dinRegular">No content available at the moment</p>
              </motion.div>
            )}
            {activeTab === 'FASHION' && (
              <motion.div
                key="fashion"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-center py-20"
              >
                <h3 className="text-2xl font-american-typewriter text-[#4f5864] mb-4">FASHION</h3>
                <p className="text-[#626262] font-dinRegular">No content available at the moment</p>
              </motion.div>
            )}
            {activeTab === 'FOOD' && (
              <motion.div
                key="food"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-center py-20"
              >
                <h3 className="text-2xl font-american-typewriter text-[#4f5864] mb-4">FOOD</h3>
                <p className="text-[#626262] font-dinRegular">No content available at the moment</p>
              </motion.div>
            )}
            {activeTab === 'SHORTCODES' && (
              <motion.div
                key="shortcodes"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-center py-20"
              >
                <h3 className="text-2xl font-american-typewriter text-[#4f5864] mb-4">SHORTCODES</h3>
                <p className="text-[#626262] font-dinRegular">No content available at the moment</p>
              </motion.div>
            )}
            {activeTab === 'POST TYPES' && (
              <motion.div
                key="post-types"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-center py-20"
              >
                <h3 className="text-2xl font-american-typewriter text-[#4f5864] mb-4">POST TYPES</h3>
                <p className="text-[#626262] font-dinRegular">No content available at the moment</p>
              </motion.div>
            )}
            {activeTab === 'CONTACTS' && (
              <motion.div
                key="contacts"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-center py-20"
              >
                <h3 className="text-2xl font-american-typewriter text-[#4f5864] mb-4">CONTACTS</h3>
                <p className="text-[#626262] font-dinRegular">No content available at the moment</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Content sections - only show when HOME tab is active */}
      {activeTab === 'HOME' && (
        <>
          {/* second section */}
          <div className="max-w-7xl mx-auto my-8 md:my-12 lg:my-20 px-4 lg:px-0">
            <div className="flex flex-col lg:flex-row justify-between gap-6 lg:gap-8">
              {/* Hero Article - 75% width */}
              <motion.div
                className="w-full lg:w-[70%] flex-shrink-0"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <div className="relative">
                  <div className="relative group w-full overflow-hidden" style={{ aspectRatio: '858/971' }}>
                    {/* Grayscale Base Image */}
                    <motion.img
                      src="https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=858&h=971&fit=crop"
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      alt="Surfing big waves"
                      data-testid="hero-image"
                      initial={{ scale: 1.1, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.8, duration: 1.0 }}
                    />

                    {/* Black Overlay - Removed on hover */}
                    <motion.div
                      className="absolute inset-0 bg-black group-hover:opacity-0 transition-opacity duration-500"
                      initial={{ opacity: 0 }}
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
                      className="text-xs lg:text-sm text-gray-600 mb-2 lg:mb-3"
                     style={{color: "#626262", padding:0, fontSize: '14px'}}
                      data-testid="hero-date"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 1.2, duration: 0.6 }}
                    >
                      APRIL 27, 2017 | SPORTS
                    </motion.div>
                    <motion.h2
                      className="text-xl md:text-2xl lg:text-[48px] text-gray-900 mb-3 lg:mb-4 font-american-typewriter leading-tight"
                      style={{ letterSpacing: '2px', fontWeight: '600' }}
                      data-testid="hero-title"
                      initial={{ y: 15, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 1.3, duration: 0.6 }}
                    >
                      The Longform Guide to Surfing: Great Stories About Big Waves
                    </motion.h2>
                    <motion.p
                      className="mb-4 lg:mb-6 text-sm lg:text-[16px] font-din-arabic"
                      style={{ letterSpacing: '1px', color: '#626262' }}
                      data-testid="hero-excerpt"
                      initial={{ y: 15, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 1.4, duration: 0.6 }}
                    >
                      Every weekend, Longform shares a collection of great stories
                      from its archive. Big waves, unlikely champs, and the "dark
                      prince of the beach"—our favorite stories about surfers.
                    </motion.p>
                    <motion.a
                      href="#"
                      className="text-sm lg:text-base font-american-typewriter font-medium text-gray-600 hover:underline"
                      style={{fontWeight: "600"}}
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 1.5, duration: 0.6 }}
                    >
                      READ MORE...
                    </motion.a>
                  </motion.div>
                </div>
              </motion.div>

              {/* Daily Feed Sidebar - 25% width */}
              <motion.div
                className="w-full lg:w-[30%]"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                <div className="bg-[#FEFDF3] px-4 lg:px-6 h-fit">
                  <motion.h3
                    className="mb-4 lg:mb-6 text-2xl lg:text-3xl font-american-typewriter font-bold italic"
                    data-testid="daily-feed-title"
                    style={{
                      fontFamily: "American Typewriter",
                      fontSize: "36px",
                      letterSpacing: "2px",
                      fontWeight: "bold",
                    }}
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.0, duration: 0.6 }}
                  >
                    Daily Feed
                  </motion.h3>

                  <motion.p
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                  ></motion.p>

                  <div className="space-y-4 lg:space-y-5" style={{ boxShadow: "inset 0px 2px 0px 0px #d3d2ca, inset 0px 3px 0px 0px #fefdf3, inset 0px 4px 0px 0px #d3d2ca" }}
                  >
                    {dailyFeedArticles.map((article, index) => (
                      <motion.article
                        key={article.id}
                        className={`${index < dailyFeedArticles.length - 1
                          ? 'border-b border-gray-200 pb-3 lg:pb-4'
                          : 'pb-3 lg:pb-4'
                          }`}
                        data-testid={`daily-feed-article-${article.id}`}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1.3 + index * 0.2, duration: 0.6 }}
                      >
                        <motion.div
                          className={`text-xs lg:text-sm text-gray-600 mb-2 ${index == 0 ? 'pt-4 lg:pt-6' : 'pt-0'}`}
                          style={{fontFamily: '"DIN Arabic Regular"', letterSpacing: '0.1em', fontSize: '14px'}}
                          data-testid={`article-categories-${article.id}`}
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 1.4 + index * 0.2, duration: 0.5 }}
                        >
                          in {article.categories.join(', ')}
                        </motion.div>
                        <motion.h4
                          className="mb-2"
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 1.5 + index * 0.2, duration: 0.5 }}
                        >
                          <a
                            href={`/blogs/${article.id}`}
                            className="hover:underline text-base lg:text-lg font-dinBold"
                            style={{fontSize: '20px', letterSpacing: '1px', color: '#403F3F'}}
                            data-testid={`article-title-${article.id}`}
                          >
                            {article.title}
                          </a>
                        </motion.h4>
                        <motion.p
                          className="text-sm lg:text-base font-din-arabic"
                          style={{fontSize: '16px', letterSpacing: '1px', color: '#626262'}}
                          data-testid={`article-excerpt-${article.id}`}
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 1.6 + index * 0.2, duration: 0.5 }}
                        >
                          {article.excerpt}
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
                      className="text-[14px] font-medium text-[#535c4a] hover:underline"
                      style={styles.subsequentHeading3}
                      data-testid="view-more-posts"
                    >
                      VIEW MORE POSTS
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
                style={{ fontWeight: "bold"}}
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                Featured News
              </motion.h2>
              <motion.h2
                className="font-american-typewriter pt-2 text-3xl tracking-tight uppercase"
                style={{ boxShadow: "inset 0px 2px 0px 0px #d3d2ca, inset 0px 3px 0px 0px #fefdf3, inset 0px 4px 0px 0px #d3d2ca" }}
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                {/* Featured News */}
              </motion.h2>
            </motion.div>

            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8" >
              {/* Left Side - 2 Blogs (70%) */}
              <div className="flex-1 w-full lg:w-[70%]">
                <motion.div
                  className="pb-8 lg:pb-12"
                  style={{ paddingBottom: '40px' }}
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
                      style={{ paddingBottom: '5px', position: "relative" }}
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
                          className="text-sm lg:text-base font-dinRegular text-[#535c4a] mb-3 lg:mb-4"
                          style={{fontSize: '16px'}}
                          initial={{ y: 15, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 1.5, duration: 0.6 }}
                        >
                          by Thomas Williams
                        </motion.p>
                        <motion.p
                          className="leading-relaxed text-sm lg:text-base font-din-arabic"
                          style={{letterSpacing: '1px', color: '#626262', fontSize: '16px'}}
                          initial={{ y: 15, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 1.6, duration: 0.6 }}
                        >
                          Sometimes it is easier to learn which advisors you should
                          avoid versus learning how to select the best advisors...
                        </motion.p>
                      </div>
                      <motion.a
                        href="#"
                        className="text-sm lg:text-base font-american-typewriter font-medium text-gray-600 hover:underline mt-4 hidden lg:block"
                        style={{position: "absolute", bottom: "0"}}
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1.7, duration: 0.6 }}
                      >
                        READ MORE...
                      </motion.a>
                      <motion.a
                        href="#"
                        className="text-sm font-american-typewriter font-medium text-gray-600 hover:underline mt-4 lg:hidden"
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1.7, duration: 0.6 }}
                      >
                        READ MORE...
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
                      style={{ borderTop: '1px solid #D3D2CA' }}
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
                          US Open 2017 latest: Women's semi-final results and Nadal
                          vs Del Potro
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
                        borderTop: '1px solid #D3D2CA',
                        paddingBottom: '5px',
                      }}
                      initial={{ x: 30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 1.6, duration: 0.8 }}
                    >
                      <div>
                        <motion.p
                          className="leading-relaxed mb-3 lg:mb-4 pt-4 lg:pt-6 text-sm lg:text-base font-din-arabic"
                          style={{letterSpacing: '1px', color: '#626262', fontSize: '16px'}}
                          initial={{ y: 15, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 1.8, duration: 0.6 }}
                        >
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                          Sed tincidunt porta velit, sed suscipit massa consequat
                          sed.
                        </motion.p>
                        <motion.p
                          className="leading-relaxed mb-3 lg:mb-4 text-sm lg:text-base font-din-arabic"
                          style={{letterSpacing: '1px', color: '#626262', fontSize: '16px'}}
                          initial={{ y: 15, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 1.9, duration: 0.6 }}
                        >
                          Quisque auctor justo eu odio tincidunt, vitae consectetur
                          nulla consequat. Nam vel aliquet turpis, ac sollicitudin
                          nisl.
                        </motion.p>
                        <motion.p
                          className="leading-relaxed mb-3 lg:mb-4 text-sm lg:text-base font-din-arabic"
                          style={{letterSpacing: '1px', color: '#626262', fontSize: '16px'}}
                          initial={{ y: 15, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 2.0, duration: 0.6 }}
                        >
                          Cras erat leo, mollis sit amet lacus a, tristique euismod
                          quam. Suspendisse viverra a turpis in sodales.
                        </motion.p>
                      </div>
                      <motion.a
                        href="#"
                        className="text-sm lg:text-base font-american-typewriter font-medium text-gray-600 hover:underline"
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 2.1, duration: 0.6 }}
                      >
                        READ MORE...
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
                      style={{letterSpacing: '1px', color: '#626262', fontSize: '16px'}}
                      initial={{ y: 15, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 1.9, duration: 0.6 }}
                    >
                      In the latest installment of this series that goes inside the
                      private working worlds of designers, Simone Rocha, founder and
                      creative director of her own fashion line, discusses life in
                      East London, the importance of shoes you can walk in, and
                      fighting with her father.
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
              Sign up for the Spotlight Newsletter:
            </motion.h2>

            {/* Email Form */}
            <motion.form
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              {/* Email Input */}
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address *"
                required
                className="flex-1 w-full px-4 py-3 border border-gray-300 bg-white text-black placeholder-gray-500 italic focus:outline-none focus:border-black transition-colors"
                style={{ fontFamily: '"font-din-arabic"' }}
              />
              
              {/* Subscribe Button */}
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 bg-black text-white font-american-typewriter font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors"
              >
                SIGN UP
              </button>
            </motion.form>
          </motion.div>
        </div>
      </div>

      {/* Bottom Separator Line */}
      <motion.div
        className="w-full h-1 bg-black"
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ delay: 0.8, duration: 1.0 }}
      />
    </div>
  )
}

export default Home
