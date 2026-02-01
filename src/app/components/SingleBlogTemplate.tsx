"use client"
import { documentToReactComponents } from "@contentful/rich-text-react-renderer"
import { BLOCKS, INLINES } from "@contentful/rich-text-types"
import { addToCart } from "@lib/data/cart"
import type { HttpTypes } from "@medusajs/types"
import { Navigation } from "app/components/Navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import { toast } from "sonner"
import type { Blog } from "types/contentful"

const FeaturedBlogProduct = ({
  id,
  name,
  image,
  description,
  handle,
  countryCode,
  variants,
}: {
  id: string
  name: string
  image?: string
  description?: string
  handle: string
  countryCode: string
  variants?: any[]
}) => {
  const [isAdding, setIsAdding] = useState(false)

  // Get the first available variant for simplicity
  const selectedVariant = variants?.[0]

  const handleAddToCart = async () => {
    if (!selectedVariant?.id) {
      toast.error("Product variant not available")
      return
    }

    setIsAdding(true)
    try {
      await addToCart({
        variantId: selectedVariant.id,
        quantity: 1,
        countryCode,
      })
      toast.success(`${name} added to cart`, { duration: 2000 })
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast.error((error as Error)?.message || "Failed to add to cart")
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="group flex flex-col h-full">
      <Link href={`/${countryCode}/products/${handle}`} className="cursor-pointer flex-1">
        <div className="relative overflow-hidden mb-4 bg-[#F5F5F0]">
          <div className="relative overflow-hidden" style={{ aspectRatio: "4/5" }}>
            <img
              src={image || "/assets/placeholder-product.jpg"}
              alt={name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              style={{
                objectFit: "contain",
                maxWidth: "100%",
                maxHeight: "100%",
              }}
            />
          </div>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
        </div>
        <div className="text-center px-2 flex flex-col flex-1 w-full">
          <h3
            className="text-lg md:text-xl mb-2 group-hover:underline decoration-1 underline-offset-4"
            style={{
              fontFamily: '"American Typewriter"',
              color: "#333",
              lineHeight: "1.2",
            }}
          >
            {name}
          </h3>
          {description && (
            <p
              className="text-sm md:text-base mb-4"
              style={{
                fontFamily: '"DIN Arabic Regular"',
                color: "#626262",
                lineHeight: "1.5",
              }}
            >
              {description}
            </p>
          )}
        </div>
      </Link>
      <button
        type="button"
        className="group/btn-wrapper w-full mt-auto px-4 py-2 border border-black/20 hover:bg-black transition-colors duration-300 text-sm tracking-wide flex items-center justify-center"
        style={{
          fontFamily: '"DIN Arabic Regular"',
        }}
        onClick={handleAddToCart}
        disabled={!selectedVariant || isAdding}
      >
        <span className="text-inherit group-hover/btn-wrapper:text-white transition-colors duration-300">
          {isAdding ? "Adding..." : "Add to cart"}
        </span>
        <span className="ml-2 text-inherit group-hover/btn-wrapper:text-white text-xs transition-colors duration-300">
          →
        </span>
      </button>
    </div>
  )
}

interface SingleBlogTemplateProps {
  blog: Blog | null
  countryCode: string
}

export const SingleBlogTemplate = ({ blog, countryCode }: SingleBlogTemplateProps) => {
  const [isScrolled, setIsScrolled] = useState(false)

  console.log("BLOG CONTENT")
  console.log(blog)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setIsScrolled(scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Custom styles object - copied from your blogs page
  const styles = {
    bannerHeading: {
      fontFamily: '"American Typewriter"',
      fontSize: "42px",
      letterSpacing: "5px",
      color: "#4f5864",
    },
    subCopy: {
      fontFamily: '"DIN Next LT Arabic Light"',
      fontSize: "16px",
      letterSpacing: "1px",
      color: "#626262",
    },
    subsequentHeading: {
      fontFamily: '"American Typewriter"',
      fontSize: "24px",
      letterSpacing: "2px",
      color: "#626262",
    },
    subsequentHeading3: {
      fontFamily: '"American Typewriter"',
      fontSize: "16px",
      letterSpacing: "2px",
      color: "#626262",
    },
    subsequentHeading2: {
      fontFamily: '"font-dinBold"',
      fontSize: "20px",
      letterSpacing: "1px",
      color: "#403F3F",
    },
    newspaperSerif: {
      fontFamily: '"American Typewriter"',
      fontSize: "24px",
      letterSpacing: "5px",
      color: "#4f5864",
    },
    newspaperSpacing: {
      lineHeight: "1.6",
    },
    tightSpacing: {
      lineHeight: "1.3",
    },
    trackingNewspaper: {
      fontFamily: '"DIN Arabic Regular"',
      letterSpacing: "0.1em",
    },
    trackingWideNewspaper: {
      fontFamily: '"DIN Arabic Regular"',
      letterSpacing: "0.15em",
    },
  }

  const latestArticles = [
    "The Longform Guide to Surfing: Great Stories About Big Waves",
    "The Ultimate Guide to New York's Favorite Food",
    "Salty Peanut-Pretzel Ice Cream Cake",
    "A Cool Solution for Hot Summer Nights",
    "Full Irish Breakfast In Manhattan",
    "Overcoming Your Fear Of The Kitchen",
    "Want to Make Creamed Corn Into a Meal? Add Shrimp",
    "Why Healthy Eating Doesn't Mean Dieting",
    "A Quick, Satisfying Fix for Weeknight Chicken",
    "Fresh Food on TV: Weekend Edition",
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

  const textHoverVariants = {
    hover: {
      x: 5,
      transition: { duration: 0.2 },
    },
  }

  const renderOptions = {
    renderNode: {
      [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
        const { file, title } = node.data.target.fields
        const imageUrl = `https:${file.url}`
        const alt = title || "Blog Image"
        return (
          <div className="my-8">
            <img src={imageUrl} alt={alt} className="w-full h-auto object-cover rounded-sm" />
          </div>
        )
      },
      [BLOCKS.PARAGRAPH]: (node: any, children: any) => <p className="mb-6">{children}</p>,
      [INLINES.HYPERLINK]: (node: any, children: any) => (
        <a
          href={node.data.uri}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#4f5864] underline hover:text-black transition-colors duration-200"
        >
          {children}
        </a>
      ),
    },
  }

  if (!blog) {
    return null
  }

  return (
    <div className="bg-[#FEFDF3] min-h-screen">
      <Navigation isScrolled={isScrolled} disableSticky={true} />
      <div className="max-w-7xl mx-auto py-12 px-4 md:px-6">
        {/* Back Button */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <Link
            href={`/${countryCode}/blogs`}
            className="inline-flex items-center text-xs md:text-sm text-[#999] hover:text-[#626262] transition-colors duration-200"
            style={{
              fontFamily: '"American Typewriter"',
              letterSpacing: "1px",
            }}
          >
            <ChevronLeft size={16} className="mr-1" />
            Back to Journal
          </Link>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-6 md:gap-16">
          {/* Main Content - Left Side */}
          <div
            className="flex-1 max-w-4xl px-4 md:px-12"
            style={{ borderRight: "0 md:2px solid #000" }}
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
                  fontSize: "12px",
                  color: "#999",
                  letterSpacing: "2px",
                }}
              >
                {blog?.categories?.[0] || "BLOG"}
              </p>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              className="mb-8"
              style={{
                fontFamily: '"American Typewriter"',
                fontSize: "40px",
                lineHeight: "1.1",
                color: "#000",
                fontWeight: "normal",
                fontStyle: "italic",
              }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              {blog?.title}
            </motion.h1>

            {/* Date, Author and Comment Count */}
            <motion.div
              className="flex items-center gap-6 mb-8 pb-6"
              style={{ borderBottom: "1px solid #ddd" }}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <span
                style={{
                  fontFamily: '"American Typewriter"',
                  fontSize: "12px",
                  color: "#999",
                  letterSpacing: "1px",
                }}
              >
                {blog?.publishedDate
                  ? new Date(blog.publishedDate)
                      .toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                      .toUpperCase()
                  : ""}
              </span>
              <span
                style={{
                  fontFamily: '"American Typewriter"',
                  fontSize: "12px",
                  color: "#999",
                  letterSpacing: "1px",
                }}
              >
                BY {blog?.author?.name?.toUpperCase() || "JARDIN BOTANICA"}
              </span>
              {/* <div className="ml-auto flex items-center gap-2">
                                <span
                                    style={{
                                        fontFamily: '"American Typewriter"',
                                        fontSize: "12px",
                                        color: "#999",
                                    }}
                                >
                                    💬 14
                                </span>
                            </div> */}
            </motion.div>

            {/* Main Image */}
            <motion.div
              className="mb-12"
              initial={{ scale: 1.05, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <img
                src={blog?.image || "/assets/football.jpg"}
                alt={blog?.imagealt || blog?.title}
                className="w-full h-auto object-cover"
                style={{ filter: "grayscale(100%)" }}
              />
            </motion.div>

            {/* Share Section */}
            <motion.div
              className="mb-8 flex flex-col md:flex-row"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <div className="w-full md:w-32 mb-8 md:mb-0 md:mr-[5px]">
                <p
                  style={{
                    fontFamily: '"American Typewriter "',
                    fontSize: "14px",
                    color: "#999",
                    marginBottom: "12px",
                  }}
                >
                  SHARE THIS POST?
                </p>
                <div className="flex flex-row md:flex-col gap-6 md:gap-0 md:space-y-1">
                  <motion.p
                    style={{
                      fontFamily: '"American Typewriter"',
                      fontSize: "14px",
                      color: "#999",
                      fontStyle: "italic",
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
                      fontSize: "14px",
                      color: "#999",
                      fontStyle: "italic",
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
                      fontSize: "14px",
                      color: "#999",
                      fontStyle: "italic",
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
                className="flex-1 md:ml-12 md:pl-8 space-y-6 border-l-0 md:border-l-2 md:border-[#D3D2CA]"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.0, duration: 0.8 }}
              >
                <motion.div
                  style={{
                    fontFamily: "Georgia, serif",
                    fontSize: "16px",
                    lineHeight: "1.8",
                    color: "#333",
                    // whiteSpace: "pre-wrap", // contentful rich text handles this
                  }}
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                >
                  {documentToReactComponents(blog?.content, renderOptions)}
                </motion.div>

                {/* Tags */}
                <motion.div
                  className="mb-12 pt-8"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.8, duration: 0.6 }}
                >
                  <p
                    style={{
                      fontFamily: "Georgia, serif",
                      fontSize: "14px",
                      color: "#999",
                      fontStyle: "italic",
                    }}
                  >
                    {blog?.tags?.join(", ") || blog?.categories?.join(", ")}
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Previous/Next Navigation */}
            <motion.div
              className="pt-8 mb-8"
              style={{
                borderTop: "2px solid #000",
                borderBottom: "2px solid #000",
                paddingBottom: "15px",
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
                      fontSize: "12px",
                      color: "#999",
                      marginBottom: "8px",
                    }}
                  >
                    PREVIOUS POST
                  </p>
                  <h4
                    style={{
                      fontFamily: '"American Typewriter"',
                      fontSize: "18px",
                      color: "#333",
                      lineHeight: "1.3",
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
                      fontSize: "12px",
                      color: "#999",
                      marginBottom: "8px",
                    }}
                  >
                    NEXT POST
                  </p>
                  <h4
                    style={{
                      fontFamily: '"American Typewriter"',
                      fontSize: "18px",
                      color: "#333",
                      lineHeight: "1.3",
                    }}
                  >
                    Why Some Say the Eclipse Is Best Experienced in a Crowd
                  </h4>
                </motion.div>
              </div>
            </motion.div>

            {/* From the Botanist's Shelf */}
            {blog?.featuredProducts && blog.featuredProducts.length > 0 && (
              <div className="mb-20 pt-16 border-t-[2px] border-[#000]">
                <h2 style={styles.subsequentHeading} className="mb-10 text-center">
                  From the Botanist's Shelf
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                  {blog.featuredProducts.map((product) => (
                    <FeaturedBlogProduct
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      image={product.image}
                      description={product.description}
                      handle={product.handle}
                      countryCode={countryCode}
                      variants={product.variants || []}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* About Author */}
            <div
              className=""
              style={{
                borderBottom: "2px solid #000",
                paddingBottom: "15px",
              }}
            >
              <div>
                <h2 style={styles.subsequentHeading} className=" pt-6 mb-6">
                  About author
                </h2>
              </div>
              <div className="flex items-center gap-4">
                {/* Profile Pic */}
                <img
                  src={
                    blog?.author?.profilePic ||
                    "https://secure.gravatar.com/avatar/36e2a7ea656db63c186eb0a02e7fe5c656ed25665db2154081aff88f2f5671c4?s=180&d=mm&r=g"
                  }
                  alt={blog?.author?.name || "author"}
                  className="rounded-full w-20 h-20 object-cover"
                />
                {/* Name */}
                <h2 className="uppercase" style={styles.subsequentHeading}>
                  {blog?.author?.name || "cmsmasters"}
                </h2>
              </div>
            </div>
          </div>

          <motion.div className="" variants={containerVariants} initial="hidden" animate="visible">
            <div className="p-6 w-full md:w-[300px]">
              {/* Latest Articles Section */}
              <motion.div variants={itemVariants}>
                <h2 style={styles.subsequentHeading} className=" mb-4 pt-4">
                  LATEST ARTICLES
                </h2>
                <motion.ul className="space-y-3">
                  {latestArticles.map((article, index) => (
                    <motion.li key={index} variants={itemVariants} whileHover="hover">
                      <motion.div className="flex items-start" variants={textHoverVariants}>
                        <span className=" mr-2 mt-1">•</span>
                        <motion.a
                          href={`/${countryCode}/blogs`}
                          className="leading-relaxed"
                          whileHover={{ color: "#111827" }}
                          style={styles.subCopy}
                        >
                          {article}
                        </motion.a>
                      </motion.div>
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
