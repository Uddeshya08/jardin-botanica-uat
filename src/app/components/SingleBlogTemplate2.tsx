"use client"
import { PortableText, type PortableTextComponents } from "@portabletext/react"
import { Navigation } from "app/components/Navigation"
import { motion } from "motion/react"
import Link from "next/link"
import { useEffect, useState } from "react"
import type { SanityBlog } from "types/sanity-blog"

/**
 * Template 2 — editorial single-article layout inspired by framacph.com/blogs/stories.
 * Centered narrative column, full-bleed image breaks, minimal metadata, "Also" related grid.
 * Kept fully separate from SingleBlogTemplate so the live blog route is untouched.
 */

interface SingleBlogTemplate2Props {
  blog: SanityBlog | null
  countryCode: string
  alsoArticles: { title: string; slug: string; image?: string; imagealt?: string }[]
}

export const SingleBlogTemplate2 = ({
  blog,
  countryCode,
  alsoArticles,
}: SingleBlogTemplate2Props) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Same theme tokens as the live template — font/colour/size untouched, only layout differs.
  const styles = {
    subsequentHeading: {
      fontFamily: '"American Typewriter"',
      fontSize: "24px",
      letterSpacing: "2px",
      color: "#626262",
    },
    eyebrow: {
      fontFamily: '"American Typewriter"',
      fontSize: "12px",
      color: "#999",
      letterSpacing: "3px",
    },
    ctaLink: {
      fontFamily: '"American Typewriter"',
      fontSize: "13px",
      color: "#333",
      letterSpacing: "2px",
    },
  }

  const portableTextComponents: PortableTextComponents = {
    block: {
      normal: ({ children }) => <p className="mb-6">{children}</p>,
      h2: ({ children }) => (
        <h2
          className="mb-6 mt-4"
          style={{ fontFamily: '"American Typewriter"', fontSize: "28px", color: "#333" }}
        >
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3
          className="mb-4 mt-2"
          style={{ fontFamily: '"American Typewriter"', fontSize: "20px", color: "#333" }}
        >
          {children}
        </h3>
      ),
      blockquote: ({ children }) => (
        <blockquote className="text-center my-12 max-w-xl mx-auto">
          <p
            style={{
              fontFamily: '"American Typewriter"',
              fontStyle: "italic",
              fontSize: "24px",
              lineHeight: "1.4",
              color: "#4f5864",
            }}
          >
            {children}
          </p>
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
        <figure>
          <img
            src={value.image.url}
            alt={value.alt || blog?.title || ""}
            className="w-full h-auto object-cover"
            style={{ filter: "grayscale(100%)" }}
          />
          {value.caption && (
            <figcaption
              className="text-center mt-3"
              style={{
                fontFamily: '"American Typewriter"',
                fontSize: "12px",
                color: "#999",
                letterSpacing: "1px",
              }}
            >
              {value.caption}
            </figcaption>
          )}
        </figure>
      ),
      imageGalleryBlock: ({ value }) => (
        <figure>
          <div className="grid grid-cols-2 gap-2">
            {value.images.map((img: { url: string }, i: number) => (
              <img
                key={i}
                src={img.url}
                alt={blog?.title || ""}
                className="w-full h-full object-cover aspect-square"
                style={{ filter: "grayscale(100%)" }}
              />
            ))}
          </div>
          {value.caption && (
            <figcaption
              className="text-center mt-3"
              style={{
                fontFamily: '"American Typewriter"',
                fontSize: "12px",
                color: "#999",
                letterSpacing: "1px",
              }}
            >
              {value.caption}
            </figcaption>
          )}
        </figure>
      ),
      ctaBlock: ({ value }) => (
        <Link href={value.url} className="group block text-center my-6">
          {value.productImage && (
            <div className="relative overflow-hidden mb-4" style={{ aspectRatio: "4/5" }}>
              <img
                src={value.productImage}
                alt={value.label}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
            </div>
          )}
          <span
            className="inline-block uppercase border-b border-black/40 group-hover:border-black pb-1 transition-colors"
            style={styles.ctaLink}
          >
            {value.label}
          </span>
        </Link>
      ),
      quoteBlock: ({ value }) => (
        <blockquote className="text-center my-12 max-w-xl mx-auto">
          <p
            style={{
              fontFamily: '"American Typewriter"',
              fontStyle: "italic",
              fontSize: "24px",
              lineHeight: "1.4",
              color: "#4f5864",
            }}
          >
            &ldquo;{value.quote}&rdquo;
          </p>
          {value.attribution && (
            <cite
              className="block mt-3 not-italic"
              style={{
                fontFamily: '"American Typewriter"',
                fontSize: "12px",
                color: "#999",
                letterSpacing: "1px",
              }}
            >
              — {value.attribution}
            </cite>
          )}
        </blockquote>
      ),
      statementBlock: ({ value }) => (
        <div className="my-4">
          <div className="flex justify-start">
            <img
              src={value.topImage.url}
              alt=""
              className="w-full sm:w-[45%] h-auto object-cover"
              style={{ filter: "grayscale(100%)" }}
            />
          </div>
          <p
            className="text-center max-w-3xl mx-auto py-12 md:py-16 px-6"
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "28px",
              lineHeight: "1.4",
              color: "#000",
              fontWeight: 600,
            }}
          >
            {value.statement}
          </p>
          <div className="flex justify-end">
            <img
              src={value.bottomImage.url}
              alt=""
              className="w-full sm:w-[45%] h-auto object-cover"
              style={{ filter: "grayscale(100%)" }}
            />
          </div>
        </div>
      ),
    },
  }

  if (!blog) {
    return null
  }

  // statementBlock always breaks out to a full-width row of its own;
  // everything else pairs up left/right into shared rows for the zigzag.
  let contentRow = 1
  let pendingCol = 0
  const contentLayout = blog.content.map((block) => {
    if (block._type === "statementBlock") {
      if (pendingCol === 1) {
        contentRow += 1
        pendingCol = 0
      }
      const layout = { gridColumn: "1 / -1", gridRow: contentRow }
      contentRow += 1
      return layout
    }
    const layout = { gridColumn: pendingCol + 1, gridRow: contentRow }
    pendingCol += 1
    if (pendingCol === 2) {
      pendingCol = 0
      contentRow += 1
    }
    return layout
  })

  return (
    <div className="bg-[#FEFDF3] min-h-screen overflow-x-hidden">
      <Navigation isScrolled={isScrolled} disableSticky={true} />

      {/* Hero — centered title/subtitle, no image, matches reference "Sink Theory" hero */}
      <motion.div
        className="relative w-full flex items-end justify-center overflow-hidden mb-12 md:mb-16"
        style={{ minHeight: "70vh" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {blog.coverImage?.url && (
          <img
            src={blog.coverImage.url}
            alt={blog.title}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: "grayscale(100%)" }}
          />
        )}
        <div className="absolute inset-0 bg-black/35" />

        <div className="relative z-10 max-w-2xl mx-auto px-6 md:px-4 pb-12 md:pb-16 text-center">
          <motion.h1
            style={{
              fontFamily: '"American Typewriter"',
              fontSize: "44px",
              lineHeight: "1.15",
              color: "#fff",
              fontWeight: "normal",
              letterSpacing: "2px",
            }}
            className="mb-6 text-3xl md:text-[44px] uppercase"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.8 }}
          >
            {blog.title}
          </motion.h1>

          {blog.description && (
            <motion.p
              className="line-clamp-3"
              style={{
                fontFamily: '"DIN Next LT Arabic Light"',
                fontSize: "18px",
                letterSpacing: "1px",
                color: "#fff",
                lineHeight: "1.6",
              }}
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.7 }}
            >
              {blog.description}
            </motion.p>
          )}
        </div>
      </motion.div>

      {/* Narrative body — zigzag two-column: each block alternates left/right down the page */}
      <div className="max-w-5xl mx-auto px-6 md:px-4">
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 items-start"
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "16px",
            lineHeight: "1.8",
            color: "#333",
          }}
        >
          {blog.content.map((block, i) => (
            <motion.div
              key={block._key}
              style={isMobile ? undefined : contentLayout[i]}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 * i, duration: 0.6 }}
            >
              <PortableText value={[block]} components={portableTextComponents} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* "Also" — related stories grid, mirrors the reference site's related-content section */}
      {alsoArticles.length > 0 && (
        <div className="max-w-6xl mx-auto px-6 md:px-4 pb-24 pt-4">
          <h2
            className="text-center mb-10 uppercase"
            style={{
              fontFamily: '"American Typewriter"',
              fontSize: "20px",
              letterSpacing: "4px",
              color: "#4f5864",
            }}
          >
            Also
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {alsoArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/${countryCode}/blogs/${article.slug}`}
                className="group block"
              >
                <div className="relative overflow-hidden mb-4" style={{ aspectRatio: "4/5" }}>
                  <img
                    src={article.image || "/assets/placeholder-product.jpg"}
                    alt={article.imagealt || article.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <h3
                  className="text-center group-hover:underline"
                  style={{ fontFamily: '"American Typewriter"', fontSize: "16px", color: "#333" }}
                >
                  {article.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
