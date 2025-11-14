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

  // Custom styles object
  const styles = {
    bannerHeading: {
      fontFamily: '"American Typewriter"',
      fontSize: '42px',
      letterSpacing: '5px',
      color: '#4f5864',
    },
    subCopy: {
      fontFamily: '"DIN Next LT Arabic Light"',
      fontSize: '16px',
      letterSpacing: '1px',
      color: '#626262',
    },
    subsequentHeading: {
      fontFamily: '"American Typewriter"',
      fontSize: '24px',
      letterSpacing: '2px',
      color: '#626262',
    },
    subsequentHeading3: {
      fontFamily: '"American Typewriter"',
      fontSize: '16px',
      letterSpacing: '2px',
      color: '#626262',
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
      />
      <div className="h-4"></div>
      {/* first section */}
      <div
        className="w-full bg-[#FEFDF3] pt-20 relative"
        style={{
          paddingTop: '120px', // Reduced padding for more compact layout
          minHeight: '35vh', // Much more compact
        }}
      >
        {/* Centered Journal */}
        <motion.h1
          className="font-american-typewriter text-center text-5xl md:text-6xl lg:text-7xl tracking-tight uppercase"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Journal
        </motion.h1>

        <div className="relative max-w-7xl mx-auto">
          <motion.p
            className="absolute right-6 top-0"
            style={styles.subsequentHeading3}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Volume 67, No.7 | September 2017
          </motion.p>
        </div>
      </div>

      {/* second section */}
      <div className="max-w-7xl mx-auto my-20">
        <div className="flex justify-between py-20 gap-8">
          {/* Hero Article - 75% width */}
          <motion.div
            style={{ width: '70%' }}
            className="flex-shrink-0"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <div className="relative">
            <div className="relative group w-full h-auto overflow-hidden">
  {/* Image */}
  <motion.img
    src="/assets/blog1.jpg"
    alt="Surfing big waves"
    className="w-full h-auto object-cover"
    style={{ filter: "grayscale(100%)" }}
    data-testid="hero-image"
    initial={{ scale: 1.1, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ delay: 0.8, duration: 1.0 }}
  />

  {/* Black Overlay */}
  <motion.div
    className="absolute inset-0 bg-black"
    initial={{ opacity: 0 }}
    whileHover={{ opacity: 0.4 }}
    transition={{ duration: 0.3, ease: "easeInOut" }}
  />
</div>


              {/* Gradient Overlay */}
              {/* <div className="absolute inset-0 bg-gradient-to-r from-[#EFEEE2] via-[#EFEEE2]/70 to-transparent"></div> */}

              {/* Article Overlay - vertically centered, left aligned */}
              <motion.div
                className="absolute top-1/2 left-12 transform -translate-y-1/2 max-w-lg px-8"
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.0, duration: 0.8 }}
              >
                <motion.div
                  className="text-xs text-gray-600 mb-3 px-4"
                  style={{
                    ...styles.subCopy,
                  }}
                  data-testid="hero-date"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                >
                  APRIL 27, 2017 | SPORTS
                </motion.div>
                <motion.h2
                  className="text-3xl text-gray-900 mb-4"
                  style={{ ...styles.subsequentHeading }}
                  data-testid="hero-title"
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.3, duration: 0.6 }}
                >
                  The Longform Guide to Surfing: Great Stories About Big Waves
                </motion.h2>
                <motion.p
                  className="mb-6"
                  style={{ ...styles.subCopy }}
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
                  className="text-md font-american-typewriter font-medium text-gray-600 hover:underline bottom-10"
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
            style={{ width: '30%' }}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <div className="bg-[#FEFDF3] px-6 h-fit">
              <motion.h3
                className="mb-6"
                data-testid="daily-feed-title"
                style={{
                  ...styles.subsequentHeading,
                  borderBottom: '5px solid #D3D2CA',
                  paddingBottom: '8px',
                }}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.0, duration: 0.6 }}
              >
                Daily Feed
              </motion.h3>

              <motion.p
                className="w-full h-[4px] bg-[#000000]"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 1.2, duration: 0.8 }}
              ></motion.p>

              <div className="space-y-5">
                {dailyFeedArticles.map((article, index) => (
                  <motion.article
                    key={article.id}
                    className={`${
                      index < dailyFeedArticles.length - 1
                        ? 'border-b border-gray-200 pb-4'
                        : 'pb-4'
                    }`}
                    data-testid={`daily-feed-article-${article.id}`}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.3 + index * 0.2, duration: 0.6 }}
                  >
                    <motion.div
                      className="text-[14px] text-gray-600 mb-2 pt-3"
                      style={styles.trackingNewspaper}
                      data-testid={`article-categories-${article.id}`}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 1.4 + index * 0.2, duration: 0.5 }}
                    >
                      in {article.categories.join(', ')}
                    </motion.div>
                    <motion.h4
                      className="mb-2"
                      style={{
                        ...styles.newspaperSerif,
                      }}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 1.5 + index * 0.2, duration: 0.5 }}
                    >
                      <a
                        href={`/blogs/${article.id}`}
                        className="hover:underline"
                        style={styles.subsequentHeading2}
                        data-testid={`article-title-${article.id}`}
                      >
                        {article.title}
                      </a>
                    </motion.h4>
                    <motion.p
                      style={{ ...styles.subCopy }}
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

      <div className="max-w-7xl mx-auto  my-20">
        <motion.div
          className="text-left mb-16"
          style={{ borderBottom: '5px solid #D3D2CA', paddingBottom: '8px' }}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <motion.h2
            className="font-american-typewriter pt-4 text-3xl tracking-tight uppercase"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Featured News
          </motion.h2>
          <motion.p
            className="w-full h-[3px] bg-[#D3D2CA]"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ delay: 0.7, duration: 1.0 }}
          ></motion.p>
        </motion.div>

        <div className="flex gap-8">
          {/* Left Side - 2 Blogs (70%) */}
          <div className="flex-1" style={{ width: '70%' }}>
            <motion.div
              className="pb-12"
              style={{ paddingBottom: '40px' }}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              <div className="flex w-full gap-6 flex-nowrap">
                {/* Image = 65 */}
                <motion.div
                  className="basis-0 grow-[65] pb-3 border-b-[2px] border-[#000000]"
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1.1, duration: 0.8 }}
                >
                  <div className="relative group w-full h-auto overflow-hidden">
                    {/* Image */}
                    <motion.img
                      src="/assets/firstblog.jpg"
                      alt="Renounce City's Vote to Drop References"
                      className="w-full h-auto object-cover"
                      initial={{ scale: 1.1, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 1.3, duration: 0.8 }}
                    />

                    {/* Black Overlay */}
                    <motion.div
                      className="absolute inset-0 bg-black"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 0.4 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    />
                  </div>
                </motion.div>

                {/* Text = 35 */}
                <motion.div
                  className="basis-0 grow-[35] flex flex-col justify-between"
                  style={{ paddingBottom: '5px' }}
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                >
                  <div>
                    <motion.h3
                      className="font-american-typewriter text-xl mb-3"
                      initial={{ y: 15, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 1.4, duration: 0.6 }}
                    >
                      Renounce City's Vote to Drop References
                    </motion.h3>
                    <motion.p
                      className="text-[16px] font-dinRegular text-[#535c4a] mb-4"
                      initial={{ y: 15, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 1.5, duration: 0.6 }}
                    >
                      by Thomas Williams
                    </motion.p>
                    <motion.p
                      style={styles.subCopy}
                      className="leading-relaxed"
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
                    className="text-md font-american-typewriter font-medium text-gray-600 hover:underline bottom-10"
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
              <div className="flex gap-6">
                {/* Left: Title + Author + Image */}
                <motion.div
                  className="w-1/2 flex flex-col"
                  style={{ borderTop: '2.5px solid #D3D2CA' }}
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1.5, duration: 0.8 }}
                >
                  {/* Title + Author */}
                  <div className="mb-4">
                    <motion.h3
                      className="font-american-typewriter text-xl mb-2 leading-tight pt-6"
                      initial={{ y: 15, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 1.7, duration: 0.6 }}
                    >
                      US Open 2017 latest: Women's semi-final results and Nadal
                      vs Del Potro
                    </motion.h3>
                    <motion.p
                      className="text-sm italic text-gray-600"
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
                    <div className="relative group w-full h-64 overflow-hidden">
                      {/* Image */}
                      <motion.img
                        src="/assets/secondblog.jpg"
                        alt="US Open 2017"
                        className="w-full h-64 object-cover"
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 2.1, duration: 0.8 }}
                      />

                      {/* Black Overlay */}
                      <motion.div
                        className="absolute inset-0 bg-black"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 0.4 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      />
                    </div>
                  </motion.div>
                </motion.div>

                {/* Right: Description + Read More */}
                <motion.div
                  className="w-1/2 flex flex-col justify-between pb-10"
                  style={{
                    borderTop: '2.5px solid #D3D2CA',
                    paddingBottom: '5px',
                  }}
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1.6, duration: 0.8 }}
                >
                  <div>
                    <motion.p
                      style={styles.subCopy}
                      className="leading-relaxed mb-4 pt-6"
                      initial={{ y: 15, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 1.8, duration: 0.6 }}
                    >
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Sed tincidunt porta velit, sed suscipit massa consequat
                      sed.
                    </motion.p>
                    <motion.p
                      style={styles.subCopy}
                      className="leading-relaxed mb-4"
                      initial={{ y: 15, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 1.9, duration: 0.6 }}
                    >
                      Quisque auctor justo eu odio tincidunt, vitae consectetur
                      nulla consequat. Nam vel aliquet turpis, ac sollicitudin
                      nisl.
                    </motion.p>
                    <motion.p
                      style={styles.subCopy}
                      className="leading-relaxed mb-4"
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
                    className="text-md font-american-typewriter font-medium text-gray-600 hover:underline"
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
            style={{ width: '30%' }}
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.8 }}
          >
            <div className="">
              <div className="relative group w-full h-96 mb-6 overflow-hidden">
                {/* Image */}
                <motion.img
                  src="/assets/thirdblog.jpg"
                  alt="Simone Rocha on the Importance of Shoes"
                  className="w-full h-full object-cover"
                  initial={{ scale: 1.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.3, duration: 0.8 }}
                />

                {/* Black Overlay */}
                <motion.div
                  className="absolute inset-0 bg-black"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 0.4 }} // control darkness here
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                />
              </div>

              <motion.div
                className="px-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.8 }}
              >
                <motion.h3
                  className="text-2xl font-american-typewriter mb-3 leading-tight"
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.7, duration: 0.6 }}
                >
                  Simone Rocha on the Importance of Shoes
                </motion.h3>
                <motion.p
                  className="text-sm italic text-gray-600 mb-4"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.8, duration: 0.6 }}
                >
                  by Amy Adams
                </motion.p>
                <motion.p
                  style={styles.subCopy}
                  className="leading-relaxed mb-4"
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
                  className="text-md font-american-typewriter font-medium text-gray-600 hover:underline"
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
          className="mt-16 pt-8 border-t border-gray-300 pb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2.3, duration: 0.8 }}
        >
          <a
            href="#"
            className="text-sm font-medium text-gray-900 hover:underline"
          >
            VIEW MORE POSTS
          </a>
        </motion.div>
      </div>
    </div>
  )
}

export default Home
