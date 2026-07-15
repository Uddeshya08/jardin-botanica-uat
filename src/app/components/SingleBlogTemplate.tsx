"use client"
import { PortableText, type PortableTextComponents } from "@portabletext/react"
import { addToCart } from "@lib/data/cart"
import { Navigation } from "app/components/Navigation"
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "app/components/ui/carousel"
import { ChevronLeft, Share2 } from "lucide-react"
import { motion } from "motion/react"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import { toast } from "sonner"
import type { SanityBlogTemplate1 } from "types/sanity-blog"

const FeaturedBlogProduct = ({
  id,
  name,
  image,
  hoverImage,
  description,
  subtitle,
  handle,
  countryCode,
  variants,
  isMobile = false,
}: {
  id: string
  name: string
  image?: string
  hoverImage?: string
  description?: string
  subtitle?: string | null
  handle: string
  countryCode: string
  variants?: any[]
  isMobile?: boolean
}) => {
  const [isInCart, setIsInCart] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = React.useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  // Get the first available variant for simplicity
  const selectedVariant = variants?.[0]

  // Use subtitle if available, otherwise fall back to description
  const displayText = subtitle || description

  // Mobile auto-rotate effect
  useEffect(() => {
    if (!isMobile || !cardRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.5 }
    )

    observer.observe(cardRef.current)
    return () => observer.disconnect()
  }, [isMobile])

  useEffect(() => {
    if (!isMobile || !isVisible) {
      // Only reset to main image when scrolling out of view, not when scrolling into view
      if (!isVisible) {
        setIsHovered(false)
      }
      return
    }

    const interval = setInterval(() => {
      setIsHovered((prev) => !prev)
    }, 2500)

    return () => clearInterval(interval)
  }, [isMobile, isVisible])

  const handleAddToCart = async () => {
    if (!selectedVariant?.id) {
      toast.error("Product variant not available")
      return
    }

    try {
      await addToCart({
        variantId: selectedVariant.id,
        quantity: 1,
        countryCode,
      })
      toast.success(`${name} added to cart`, { duration: 2000 })
      setIsInCart(true)
      setTimeout(() => setIsInCart(false), 2000)
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast.error((error as Error)?.message || "Failed to add to cart")
    }
  }

  return (
    <div ref={cardRef} className="group flex flex-col h-full">
      <Link href={`/${countryCode}/products/${handle}`} className="cursor-pointer flex-1">
        <div className="relative overflow-hidden mb-4 bg-[#F5F5F0]">
          <div className="relative overflow-hidden" style={{ aspectRatio: "4/5" }}>
            {/* Main Image - Always base layer */}
            <div className="absolute inset-0">
              <img
                src={image || "/assets/placeholder-product.jpg"}
                alt={name}
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  objectFit: "contain",
                  maxWidth: "100%",
                  maxHeight: "100%",
                }}
              />
            </div>

            {/* Hover/Second Image - Fades IN over main (cyclic feel) */}
            <div
              className="absolute inset-0 transition-opacity duration-700 ease-in-out"
              style={{ opacity: isHovered ? 1 : 0 }}
            >
              <img
                src={hoverImage || image || "/assets/placeholder-product.jpg"}
                alt={`${name} alternate view`}
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  objectFit: "contain",
                  maxWidth: "100%",
                  maxHeight: "100%",
                }}
              />
            </div>
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
          {displayText && (
            <p
              className="text-sm md:text-base mb-4 line-clamp-2"
              style={{
                fontFamily: '"DIN Arabic Regular"',
                color: "#626262",
                lineHeight: "1.5",
              }}
            >
              {displayText}
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
        disabled={!selectedVariant}
      >
        <span className="text-inherit group-hover/btn-wrapper:text-white transition-colors duration-300">
          {isInCart ? "In cart" : "Add to cart"}
        </span>
        <span className="ml-2 text-inherit group-hover/btn-wrapper:text-white text-xs transition-colors duration-300">
          {isInCart ? "✓" : "→"}
        </span>
      </button>
    </div>
  )
}

interface SingleBlogTemplateProps {
  blog: SanityBlogTemplate1 | null
  countryCode: string
  latestArticles: { title: string; slug: string }[]
  navigationPosts: {
    previous: { title: string; slug: string } | null
    next: { title: string; slug: string } | null
  }
}

export const SingleBlogTemplate = ({
  blog,
  countryCode,
  latestArticles,
  navigationPosts,
}: SingleBlogTemplateProps) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()

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

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Mobile carousel auto-scroll
  useEffect(() => {
    if (!carouselApi || !isMobile) return
    const interval = setInterval(() => {
      const current = carouselApi.selectedScrollSnap()
      const total = carouselApi.scrollSnapList().length
      carouselApi.scrollTo((current + 1) % total)
    }, 5000)
    return () => clearInterval(interval)
  }, [carouselApi, isMobile])

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

  const portableTextComponents: PortableTextComponents = {
    block: {
      normal: ({ children }) => <p className="mb-6">{children}</p>,
      h2: ({ children }) => (
        <h2 className="mb-6 mt-4" style={{ ...styles.subsequentHeading, color: "#333" }}>
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3 className="mb-4 mt-2" style={{ ...styles.subsequentHeading3, color: "#333" }}>
          {children}
        </h3>
      ),
      quote: ({ children }) => (
        <blockquote
          className="my-8 pl-6 italic"
          style={{ borderLeft: "3px solid #4f5864", color: "#4f5864" }}
        >
          {children}
        </blockquote>
      ),
    },
    marks: {
      link: ({ children, value }) => {
        const href = value?.href || "#"
        const isExternal = href.startsWith("http")
        return (
          <a
            href={href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="text-[#4f5864] underline hover:text-black transition-colors duration-200"
          >
            {children}
          </a>
        )
      },
    },
    types: {
      imageBlock: ({ value }) => (
        <div className="my-8">
          <img
            src={value.image.url}
            alt={value.alt || blog?.title || "Blog Image"}
            className="w-full h-auto object-cover rounded-sm"
          />
          {value.caption && (
            <p className="text-center mt-3 text-sm" style={{ color: "#999" }}>
              {value.caption}
            </p>
          )}
        </div>
      ),
    },
  }

  if (!blog) {
    return null
  }

  const featuredProducts = blog.resolvedFeaturedProducts ?? []

  return (
    <div className="bg-[#FEFDF3] min-h-screen">
      <Navigation isScrolled={isScrolled} disableSticky={true} forceBlackText={true} />
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
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  if (!blog) return

                  if (navigator.share) {
                    navigator.share({
                      title: blog.title,
                      text: blog.description || blog.title,
                      url: window.location.href,
                    })
                  } else {
                    navigator.clipboard.writeText(window.location.href)
                    toast.success("Link copied to clipboard", {
                      duration: 2000,
                    })
                  }
                }}
                className="ml-auto p-2 text-black/60 hover:text-black transition-colors bg-black/5 rounded-full hover:bg-black/10"
                aria-label="Share blog"
              >
                <Share2 className="w-4 h-4" />
              </motion.button>
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
                src={blog?.coverImage?.url || "/assets/football.jpg"}
                alt={blog?.imageAlt || blog?.title}
                className="w-full h-auto object-cover"
              />
            </motion.div>

            {/* Article Content */}
            <motion.div
              className="mb-8 space-y-6"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <motion.div
                className="space-y-6"
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
                  {blog?.content && (
                    <PortableText value={blog.content} components={portableTextComponents} />
                  )}
                </motion.div>

                {/* Tags */}
                {/* <motion.div */}
                {/*   className="mb-12 pt-8" */}
                {/*   initial={{ y: 20, opacity: 0 }} */}
                {/*   animate={{ y: 0, opacity: 1 }} */}
                {/*   transition={{ delay: 1.8, duration: 0.6 }} */}
                {/* > */}
                {/*   <p */}
                {/*     style={{ */}
                {/*       fontFamily: "Georgia, serif", */}
                {/*       fontSize: "14px", */}
                {/*       color: "#999", */}
                {/*       fontStyle: "italic", */}
                {/*     }} */}
                {/*   > */}
                {/*     {blog?.tags?.join(", ") || blog?.categories?.join(", ")} */}
                {/*   </p> */}
                {/* </motion.div> */}
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
                  {navigationPosts.previous ? (
                    <Link
                      href={`/${countryCode}/blogs/${navigationPosts.previous.slug}`}
                      className="block hover:opacity-70 transition-opacity duration-200"
                    >
                      <h4
                        style={{
                          fontFamily: '"American Typewriter"',
                          fontSize: "18px",
                          color: "#333",
                          lineHeight: "1.3",
                        }}
                      >
                        {navigationPosts.previous.title}
                      </h4>
                    </Link>
                  ) : null}
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
                  {navigationPosts.next ? (
                    <Link
                      href={`/${countryCode}/blogs/${navigationPosts.next.slug}`}
                      className="block hover:opacity-70 transition-opacity duration-200"
                    >
                      <h4
                        style={{
                          fontFamily: '"American Typewriter"',
                          fontSize: "18px",
                          color: "#333",
                          lineHeight: "1.3",
                        }}
                      >
                        {navigationPosts.next.title}
                      </h4>
                    </Link>
                  ) : null}
                </motion.div>
              </div>
            </motion.div>

            {/* From the Botanist's Shelf */}
            {featuredProducts.length > 0 && (
              <div className="mb-20 pt-16 border-t-[2px] border-[#000]">
                <h2 style={styles.subsequentHeading} className="mb-10 text-center">
                  From the Botanist's Shelf
                </h2>

                {/* Desktop Grid */}
                <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                  {featuredProducts.map((product) => (
                    <FeaturedBlogProduct
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      image={product.image}
                      hoverImage={product.hoverImage}
                      description={product.description}
                      subtitle={product.subtitle}
                      handle={product.handle}
                      countryCode={countryCode}
                      variants={product.variants || []}
                      isMobile={false}
                    />
                  ))}
                </div>

                {/* Mobile Carousel */}
                <div className="md:hidden">
                  <style
                    dangerouslySetInnerHTML={{
                      __html: `
                        .blog-carousel-item {
                          width: calc(85vw) !important;
                          flex-basis: calc(85vw) !important;
                          flex-shrink: 0 !important;
                          margin-left: 0.75rem !important;
                          margin-right: 0.75rem !important;
                        }
                        .blog-carousel-content {
                          user-select: none !important;
                          -webkit-user-select: none !important;
                          padding-left: 0 !important;
                          padding-right: 1.5rem !important;
                        }
                        .blog-carousel-content > div {
                          margin-left: 0 !important;
                          gap: 0 !important;
                        }
                        .blog-carousel-wrapper [data-slot="carousel-content"] {
                          cursor: grab !important;
                          -webkit-overflow-scrolling: touch !important;
                          scroll-behavior: smooth !important;
                          scroll-snap-type: x mandatory !important;
                          scrollbar-width: none !important;
                          -ms-overflow-style: none !important;
                          overflow-x: auto !important;
                        }
                        .blog-carousel-wrapper [data-slot="carousel-content"]::-webkit-scrollbar {
                          display: none !important;
                        }
                        .blog-carousel-wrapper [data-slot="carousel-content"]:active {
                          cursor: grabbing !important;
                        }
                      `,
                    }}
                  />
                  <div className="blog-carousel-wrapper">
                    <Carousel
                      setApi={setCarouselApi}
                      opts={{
                        align: "center",
                        loop: true,
                        dragFree: true,
                        watchDrag: true,
                        duration: 30,
                        startIndex: 0,
                      }}
                      className="w-full"
                    >
                      <CarouselContent className="blog-carousel-content">
                        {featuredProducts.map((product) => (
                          <CarouselItem key={product.id} className="blog-carousel-item">
                            <FeaturedBlogProduct
                              id={product.id}
                              name={product.name}
                              image={product.image}
                              hoverImage={product.hoverImage}
                              description={product.description}
                              subtitle={product.subtitle}
                              handle={product.handle}
                              countryCode={countryCode}
                              variants={product.variants || []}
                              isMobile={true}
                            />
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                    </Carousel>
                  </div>
                </div>
              </div>
            )}
          </div>

          <motion.div className="" variants={containerVariants} initial="hidden" animate="visible">
            <div className="p-6 w-full md:w-[300px]">
              {/* Latest Articles Section */}
              <motion.div variants={itemVariants}>
                <h2 style={styles.subsequentHeading} className=" mb-4 pt-4">
                  LATEST ARTICLES
                </h2>
                <motion.ul className="space-y-3">
                  {latestArticles.map((article) => (
                    <motion.li key={article.slug} variants={itemVariants} whileHover="hover">
                      <motion.div className="flex items-start" variants={textHoverVariants}>
                        <span className=" mr-2 mt-1">•</span>
                        <Link
                          href={`/${countryCode}/blogs/${article.slug}`}
                          className="leading-relaxed"
                          style={styles.subCopy}
                        >
                          {article.title}
                        </Link>
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
