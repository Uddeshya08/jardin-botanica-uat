'use client'
import React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  ChevronLeft,
  ChevronRight,
  Facebook,
  Instagram,
  Twitter,
} from 'lucide-react'

const SingleBlogPage = () => {
  // Custom styles object - copied from your blogs page
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

  const latestArticles = [
    'The Longform Guide to Surfing: Great Stories About Big Waves',
    "The Ultimate Guide to New York's Favorite Food",
    'Salty Peanut-Pretzel Ice Cream Cake',
    'A Cool Solution for Hot Summer Nights',
    'Full Irish Breakfast In Manhattan',
    'Overcoming Your Fear Of The Kitchen',
    'Want to Make Creamed Corn Into a Meal? Add Shrimp',
    "Why Healthy Eating Doesn't Mean Dieting",
    'A Quick, Satisfying Fix for Weeknight Chicken',
    'Fresh Food on TV: Weekend Edition',
  ]

  const topSearches = [
    'Art & Design',
    'Blog',
    'Business',
    'Culture',
    'Economy',
    'Health',
    'Lifestyle',
    'Movies',
    'NY',
    'Newspaper',
    'Obituaries',
    'Photos',
    'Politics',
    'Post',
    'Science',
    'Sports',
    'Tech',
    "Today's Arts",
    'Travel',
    'U.S.',
    'Videos',
    'World',
  ]

  const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  }

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.3 },
    },
  }

  const textHoverVariants = {
    hover: {
      x: 5,
      transition: { duration: 0.2 },
    },
  }

  // const latestArticles = [
  //   "The Longform Guide to Surfing: Great Stories About Big Waves",
  //   "The Ultimate Guide to New York's Favorite Food",
  //   "Salty Peanut-Pretzel Ice Cream Cake",
  //   "A Cool Solution for Hot Summer Nights",
  //   "Full Irish Breakfast In Manhattan",
  //   "Overcoming Your Fear Of The Kitchen",
  //   "Want to Make Creamed Corn Into a Meal? Add Shrimp",
  //   "Why Healthy Eating Doesn't Mean Dieting",
  //   "A Quick, Satisfying Fix for Weeknight Chicken",
  //   "Fresh Food on TV: Weekend Edition"
  // ];

  // const topSearches = [
  //   "Art & Design", "Blog", "Business", "Culture", "Economy", "Health",
  //   "Lifestyle", "Movies", "N.Y.", "Newspaper", "Obituaries", "Photos",
  //   "Politics", "Post", "Science", "Sports", "Tech", "Today's Arts",
  //   "Travel", "U.S.", "Videos", "World"
  // ];

  return (
    <div className="bg-[#FEFDF3] min-h-screen">
      <div
        className="max-w-7xl mx-auto  py-12 "
        style={{  marginTop: '70px' }}
      >
        <div className="flex gap-16">
          {/* Main Content - Left Side */}
          <div
            className="flex-1 max-w-4xl px-12"
            style={{ borderRight: '2px solid #000' }}
          >
            {/* Sports Category */}
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <p
                className="text-sm mb-6 uppercase"
                style={{
                  ...styles.trackingNewspaper,
                  fontSize: '12px',
                  color: '#999',
                  letterSpacing: '2px',
                }}
              >
                SPORTS
              </p>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              className="mb-8"
              style={{
                fontFamily: '"American Typewriter"',
                fontSize: '40px',
                lineHeight: '1.1',
                color: '#000',
                fontWeight: 'normal',
                fontStyle: 'italic',
              }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Liverpool Tops Hoffenheim in First Leg of Champions League Playoff
            </motion.h1>

            {/* Date, Author and Comment Count */}
            <motion.div
              className="flex items-center gap-6 mb-8 pb-6"
              style={{ borderBottom: '1px solid #ddd' }}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <span
                style={{
                  fontFamily: '"American Typewriter"',
                  fontSize: '12px',
                  color: '#999',
                  letterSpacing: '1px',
                }}
              >
                MAY 15, 2017
              </span>
              <span
                style={{
                  fontFamily: '"American Typewriter"',
                  fontSize: '12px',
                  color: '#999',
                  letterSpacing: '1px',
                }}
              >
                BY CMSMASTERS
              </span>
              <div className="ml-auto flex items-center gap-2">
                <span
                  style={{
                    fontFamily: '"American Typewriter"',
                    fontSize: '12px',
                    color: '#999',
                  }}
                >
                  💬 14
                </span>
              </div>
            </motion.div>

            {/* Main Image */}
            <motion.div
              className="mb-12"
              initial={{ scale: 1.05, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <img
                src="/assets/football.jpg"
                alt="Soccer player with ball"
                className="w-full h-auto object-cover"
                style={{ filter: 'grayscale(100%)' }}
              />
            </motion.div>

            {/* Share Section */}
            <motion.div
              className="mb-8 flex"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <div className="w-32 gap-8 " style={{ marginRight: '5px' }}>
                <p
                  style={{
                    fontFamily: '"American Typewriter "',
                    fontSize: '14px',
                    color: '#999',
                    marginBottom: '12px',
                  }}
                >
                  SHARE THIS POST?
                </p>
                <div className="space-y-1">
                  <motion.p
                    style={{
                      fontFamily: '"American Typewriter"',
                      fontSize: '14px',
                      color: '#999',
                      fontStyle: 'italic',
                    }}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.0, duration: 0.4 }}
                  >
                    Facebook
                  </motion.p>
                  <motion.p
                    style={{
                      fontFamily: '"American Typewriter"',
                      fontSize: '14px',
                      color: '#999',
                      fontStyle: 'italic',
                    }}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.1, duration: 0.4 }}
                  >
                    Twitter
                  </motion.p>
                  <motion.p
                    style={{
                      fontFamily: '"American Typewriter"',
                      fontSize: '14px',
                      color: '#999',
                      fontStyle: 'italic',
                    }}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.4 }}
                  >
                    Pinterest
                  </motion.p>
                </div>
              </div>

              {/* Article Content */}
              <motion.div
                className="flex-1 ml-12 pl-8 space-y-6"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.0, duration: 0.8 }}
                style={{
                  borderLeft: '2px solid #D3D2CA',
                }}
              >
                <motion.p
                  style={{
                    fontFamily: 'Georgia, serif',
                    fontSize: '16px',
                    lineHeight: '1.8',
                    color: '#333',
                  }}
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                >
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  ultrices ipsum non mattis pharetra. Integer blandit non felis
                  sit amet pharetra. Integer mollis eget felis non finibus.
                  Nullam nibh mauris, fermentum vitae felis vehicula, aliquam
                  bibendum sapien. In euismod velit vitae neque rhoncus congue.
                  Aliquam luctus, sapien in consectetur cursus, quam urna
                  euismod magna, sed pellentesque massa libero eu lorem. Aenean
                  rhoncus gravida nisl vel pretium. Nam ac nisl non ipsum
                  vestibulum vehicula vulputate sagittis magna. Aenean est nisl,
                  convallis volutpat tempor ac, tempus ac ante. Class aptent
                  taciti sociosqu ad litora torquent per conubia nostra, per
                  inceptos himenaeos. Fusce rhoncus sodales tempor. Nunc pretium
                  tortor felis, eget cursus magna accumsan a.
                </motion.p>

                <motion.p
                  style={{
                    fontFamily: 'Georgia, serif',
                    fontSize: '16px',
                    lineHeight: '1.8',
                    color: '#333',
                  }}
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.3, duration: 0.6 }}
                >
                  Etiam eu molestie eros, commodo hendrerit sapien. Maecenas
                  tempus leo ac nisi iaculis porta. Sed sapien tortor, aliquet a
                  velit ut, lacinia molestie velit. Maecenas ornare consequat
                  massa ullamcorper dapibus. Aliquam auctor, sapien sit amet
                  accumsan facilisis, enim enim aliquet arcu, tincidunt
                  pellentesque justo turpis id neque. Duis eleifend nunc sit
                  amet mi dapibus ornare. Suspendisse vel libero sem.
                </motion.p>

                <motion.p
                  style={{
                    fontFamily: 'Georgia, serif',
                    fontSize: '16px',
                    lineHeight: '1.8',
                    color: '#333',
                  }}
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.4, duration: 0.6 }}
                >
                  Sed nec blandit nibh. Pellentesque commodo suscipit gravida.
                  Sed sit amet ex sed mi dignissim elementum in ut quam. Vivamus
                  laoreet non mauris eget mattis. Nam turpis orci, consectetur
                  vel accumsan sed, condimentum et sapien. Nunc ut egestas
                  neque, eu hendrerit lacus. Suspendisse fermentum congue dui
                  nec fringilla. Duis volutpat nunc lectus. Suspendisse potenti.
                  Suspendisse egestas venenatis nunc. Donec et laoreet lacus.
                </motion.p>

                <motion.p
                  style={{
                    fontFamily: 'Georgia, serif',
                    fontSize: '16px',
                    lineHeight: '1.8',
                    color: '#333',
                  }}
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.5, duration: 0.6 }}
                >
                  Pellentesque habitant morbi tristique senectus et netus et
                  malesuada fames ac turpis egestas. Aliquam quam elit, mollis
                  at odio gravida, ultrices pulvinar justo. Vivamus eleifend
                  mollis dolor, et ornare turpis vehicula in. Pellentesque
                  auctor ac enim sit amet euismod. Ut eu accumsan nunc. Nam
                  ultrices, orci a volutpat molestie, ipsum magna posuere ex,
                  vel lobortis dolor purus tristique purus. Integer arcu libero,
                  feugiat non eros vel, aliquet sodales justo. Aliquam lobortis
                  efficitur velit, vel tempor dui iaculis non. Mauris non
                  ullamcorper leo. Nulla consectetur arcu eget condimentum
                  auctor. Aliquam sagittis dictum augue. Duis fringilla nec
                  augue eu laoreet.
                </motion.p>

                {/* Tags */}
                <motion.div
                  className="mb-12 pt-8"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.8, duration: 0.6 }}
                >
                  <p
                    style={{
                      fontFamily: 'Georgia, serif',
                      fontSize: '14px',
                      color: '#999',
                      fontStyle: 'italic',
                    }}
                  >
                    Blog, Lifestyle, Sports
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Previous/Next Navigation */}
            <motion.div
              className="pt-8 mb-8"
              style={{
                borderTop: '2px solid #000',
                borderBottom: '2px solid #000',
                paddingBottom: '15px',
              }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 2.0, duration: 0.6 }}
            >
              <div className="flex justify-between">
                <motion.div
                  className="w-1/2 pr-8"
                  initial={{ x: -15, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 2.2, duration: 0.5 }}
                >
                  <p
                    style={{
                      fontFamily: '"American Typewriter"',
                      fontSize: '12px',
                      color: '#999',
                      marginBottom: '8px',
                    }}
                  >
                    PREVIOUS POST
                  </p>
                  <h4
                    style={{
                      fontFamily: '"American Typewriter"',
                      fontSize: '18px',
                      color: '#333',
                      lineHeight: '1.3',
                    }}
                  >
                    Get the Best Catering for Your Summer Wedding in Philly
                  </h4>
                </motion.div>
                <motion.div
                  className="w-1/2 pl-8 text-right"
                  initial={{ x: 15, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 2.2, duration: 0.5 }}
                >
                  <p
                    style={{
                      fontFamily: '"American Typewriter"',
                      fontSize: '12px',
                      color: '#999',
                      marginBottom: '8px',
                    }}
                  >
                    NEXT POST
                  </p>
                  <h4
                    style={{
                      fontFamily: '"American Typewriter"',
                      fontSize: '18px',
                      color: '#333',
                      lineHeight: '1.3',
                    }}
                  >
                    Why Some Say the Eclipse Is Best Experienced in a Crowd
                  </h4>
                </motion.div>
              </div>
            </motion.div>

            {/* About Author */}
            <div
              className=""
              style={{
                borderBottom: '2px solid #000',
                paddingBottom: '15px',
              }}
            >
              <div>
                <h2 style={styles.subsequentHeading} className=" pt-6 mb-6">
                  About author
                </h2>
              </div>
              <div className="flex justify-around gap-2">
                {/* Left */}
                <div>
                  <img
                    src="https://secure.gravatar.com/avatar/36e2a7ea656db63c186eb0a02e7fe5c656ed25665db2154081aff88f2f5671c4?s=180&d=mm&r=g"
                    alt="author"
                    className="rounded-full"
                  />
                </div>
                {/* right */}
                <div className="flex flex-col gap-2 pl-4">
                  <h2 className="uppercase" style={styles.subsequentHeading}>
                    cmsmasters
                  </h2>
                  <p style={styles.subCopy}>
                    Cmsmasters Studio is a union of 25 people who are completely
                    into innovative website design and progressive website
                    development. Yes, we believe we can make the world be more
                    beautiful. And as we specialize on WordPress themes, we do
                    our job the best way it can be done.
                  </p>
                </div>
              </div>
            </div>

            {/* More post */}
            <div className="mt-20" style={{ marginTop: '30px' }}>
              <div>
                <h2 style={styles.subsequentHeading}>More posts</h2>
              </div>

              {/* blogs */}
              <div
                className="flex justify-between gap-4"
                style={{ marginTop: '20px' }}
              >
                {/* first */}
                <div className="flex flex-col gap-4">
                  <p>August 24, 2017</p>
                  <h2 style={styles.subsequentHeading3}>
                    Want to Make Creamed Corn Into a Meal? Add Shrimp
                  </h2>
                  <p style={styles.subCopy}>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem
                    architecto ratione similique non quidem quaerat odio
                    nesciunt enim fuga totam?
                  </p>
                  <h3 style={styles.subsequentHeading3} className="uppercase">
                    Read more
                  </h3>
                </div>

                {/* second */}
                <div className="flex flex-col gap-4">
                  <p>August 24, 2017</p>
                  <h2 style={styles.subsequentHeading3}>
                    Want to Make Creamed Corn Into a Meal? Add Shrimp
                  </h2>
                  <p style={styles.subCopy}>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem
                    architecto ratione similique non quidem quaerat odio
                    nesciunt enim fuga totam?
                  </p>
                  <h3 style={styles.subsequentHeading3} className="uppercase">
                    Read more
                  </h3>
                </div>

                {/* third */}
                <div className="flex flex-col gap-4">
                  <p>August 24, 2017</p>
                  <h2 style={styles.subsequentHeading3}>
                    Want to Make Creamed Corn Into a Meal? Add Shrimp
                  </h2>
                  <p style={styles.subCopy}>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem
                    architecto ratione similique non quidem quaerat odio
                    nesciunt enim fuga totam?
                  </p>
                  <h3 style={styles.subsequentHeading3} className="uppercase">
                    Read more
                  </h3>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            className=""
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="p-6" style={{width:'300px'}}>
              {/* Latest Articles Section */}
              <motion.div variants={itemVariants}>
                <h2 style={styles.subsequentHeading} className=" mb-4 pt-4">
                  LATEST ARTICLES
                </h2>
                <motion.ul className="space-y-3">
                  {latestArticles.map((article, index) => (
                    <motion.li
                      key={index}
                      variants={itemVariants}
                      whileHover="hover"
                    >
                      <motion.div
                        className="flex items-start"
                        variants={textHoverVariants}
                      >
                        <span className=" mr-2 mt-1">•</span>
                        <motion.a
                          href="#"
                          className=" leading-relaxed"
                          whileHover={{ color: '#111827' }}
                          style={styles.subCopy}
                        >
                          {article}
                        </motion.a>
                      </motion.div>
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>

              {/* Recommended Section */}
              <motion.div className="mt-12" variants={itemVariants}>
                <div className="flex items-center justify-between mb-4">
                  <h2 style={styles.subsequentHeading3} className=" py-2">
                    RECOMMENDED
                  </h2>
                  <div className="flex space-x-1">
                    <motion.button
                      className="p-1 hover:bg-gray-200 rounded"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ChevronLeft size={16} className="text-gray-600" />
                    </motion.button>
                    <motion.button
                      className="p-1 hover:bg-gray-200 rounded"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ChevronRight size={16} className="text-gray-600" />
                    </motion.button>
                  </div>
                </div>

                <motion.div
                  className="overflow-hidden"
                  variants={imageVariants}
                  whileHover="hover"
                >
                  <motion.img
                    src="/assets/car.jpg"
                    alt="Recommended article"
                    className="w-full h-48 object-cover"
                    variants={imageVariants}
                  />
                  <div className="">
                    <motion.h3
                      className="text-sm font-medium text-gray-800 leading-relaxed"
                      variants={textHoverVariants}
                      whileHover="hover"
                      style={{marginTop: "5px"}}
                    >
                      6 Books About The Best Bridges You Should Read
                    </motion.h3>
                  </div>
                </motion.div>
              </motion.div>

              {/* Top Searches Section */}
              <motion.div className="mt-12" variants={itemVariants} style={{marginTop: "10px"}}>
                <h2 style={styles.subsequentHeading3} className=" mb-4">
                  TOP SEARCHES
                </h2>
                <motion.div className="flex flex-wrap gap-2">
                  {topSearches.map((search, index) => (
                    <motion.a
                      key={index}
                      href="#"
                      className="transition-colors duration-200"
                      variants={itemVariants}
                      whileHover={{
                        scale: 1.05,
                        color: '#111827',
                        transition: { duration: 0.2 },
                      }}
                      whileTap={{ scale: 0.95 }}
                      style={styles.subCopy}
                    >
                      {search}
                      {index < topSearches.length - 1 && (
                        <span className="ml-2 text-gray-400">|</span>
                      )}
                    </motion.a>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Border */}
      <motion.div
        className="w-full h-2 bg-gray-900 mt-16"
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ delay: 4.5, duration: 1.0 }}
      />
    </div>
  )
}

export default SingleBlogPage
