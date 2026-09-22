"use client"
import { PortableText, type PortableTextComponents } from "@portabletext/react"
import { Navigation } from "app/components/Navigation"
import { Carousel, CarouselContent, CarouselItem } from "app/components/ui/carousel"
import { ChevronLeft } from "lucide-react"
import { motion } from "motion/react"
import Link from "next/link"
import { useEffect, useState } from "react"
import type { SanityAccordionBlock, SanityBlog } from "types/sanity-blog"

/**
 * Template 2 — editorial single-article layout inspired by framacph.com/blogs/stories.
 * Centered narrative column, full-bleed image breaks, minimal metadata, "Also" related grid.
 * Kept fully separate from SingleBlogTemplate so the live blog route is untouched.
 */

interface FeaturedProduct {
  handle: string
  title: string
  image: string | null
  price: string | null
}

// Rich text renderer for accordion bodies — kept minimal (paragraph, h3, link).
const accordionInnerComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
    h3: ({ children }) => (
      <h3
        className="mb-2 mt-4"
        style={{ fontFamily: '"American Typewriter"', fontSize: "18px", color: "#333" }}
      >
        {children}
      </h3>
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
}

// Collapsible section: click the label to reveal the rich text body.
const AccordionItem = ({
  label,
  content,
}: {
  label: string
  content: SanityAccordionBlock["content"]
}) => {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-t border-black/15 w-full max-w-3xl mx-auto">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-5 text-left"
        aria-expanded={open}
      >
        <span
          className="uppercase"
          style={{
            fontFamily: '"American Typewriter"',
            fontSize: "15px",
            letterSpacing: "2px",
            color: "#333",
          }}
        >
          {label}
        </span>
        <span
          className="ml-4 shrink-0 transition-transform duration-300"
          style={{
            fontSize: "22px",
            lineHeight: 1,
            color: "#333",
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
          }}
        >
          +
        </span>
      </button>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? "1000px" : "0px", opacity: open ? 1 : 0 }}
      >
        <div
          className="pb-6"
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "16px",
            lineHeight: "1.8",
            color: "#333",
          }}
        >
          <PortableText value={content} components={accordionInnerComponents} />
        </div>
      </div>
    </div>
  )
}

interface SingleBlogTemplate2Props {
  blog: SanityBlog | null
  countryCode: string
  alsoArticles: { title: string; slug: string; image?: string; imagealt?: string }[]
  featuredProducts?: FeaturedProduct[]
  atmosphereProducts?: FeaturedProduct[]
}

const atmosphereTitles: Record<string, string> = {
  "oud-waters": "For quiet arrivals",
  "cedarwood-rose": "For rooms at dusk",
  "saffron-amberwood": "For the table after dinner",
  "santal-pepper": "For the last lamp on",
}

const ATMOSPHERE_PLACEHOLDER_IMAGE = "/assets/atmosphere-product-placeholder.jpg"

const AtmosphereProductCard = ({
  product,
  countryCode,
}: {
  product: FeaturedProduct
  countryCode: string
}) => (
  <Link href={`/${countryCode}/products/${product.handle}`} className="group block min-w-0">
    <div className="relative aspect-[4/3] overflow-hidden bg-[#e7e5da] mb-4">
      <img
        src={ATMOSPHERE_PLACEHOLDER_IMAGE}
        alt={product.title}
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
      />
    </div>
    <p className="font-din-arabic text-[11px] text-black/55 uppercase tracking-[0.14em] mb-1.5">
      {product.title}
    </p>
    <h3 className="font-american-typewriter text-lg lg:text-xl leading-snug text-black group-hover:underline">
      {atmosphereTitles[product.handle]}
    </h3>
  </Link>
)

const AtmosphereProductGrid = ({
  products,
  countryCode,
}: {
  products: FeaturedProduct[]
  countryCode: string
}) => (
  <section className="pb-20 sm:pb-24 lg:pb-28 pt-12 md:pt-16">
    <div className="max-w-[88rem] mx-auto px-5 sm:px-8 lg:px-12 xl:px-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mb-8 md:mb-10"
      >
        <h2 className="font-american-typewriter text-3xl md:text-4xl text-black">By atmosphere</h2>
      </motion.div>

      <div className="hidden md:grid grid-cols-4 gap-4 lg:gap-5">
        {products.map((product, index) => (
          <motion.article
            key={product.handle}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, delay: index * 0.08 }}
            className="min-w-0"
          >
            <AtmosphereProductCard product={product} countryCode={countryCode} />
          </motion.article>
        ))}
      </div>
    </div>

    <div className="md:hidden overflow-hidden">
      <style>{`
        .atmosphere-carousel-content {
          margin-left: 0 !important;
          padding-left: 1.25rem;
          padding-right: 1.25rem;
        }
        .atmosphere-carousel-item {
          flex: 0 0 78vw !important;
          width: 78vw !important;
          padding-left: 0 !important;
          margin-right: 1rem;
        }
      `}</style>
      <Carousel
        opts={{
          align: "start",
          loop: false,
          dragFree: true,
          containScroll: "trimSnaps",
        }}
        className="w-full"
      >
        <CarouselContent className="atmosphere-carousel-content">
          {products.map((product) => (
            <CarouselItem key={product.handle} className="atmosphere-carousel-item">
              <AtmosphereProductCard product={product} countryCode={countryCode} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  </section>
)

export const SingleBlogTemplate2 = ({
  blog,
  countryCode,
  alsoArticles,
  featuredProducts = [],
  atmosphereProducts = [],
}: SingleBlogTemplate2Props) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const showJournalStoryGrid = blog?.slug === "on-wax-rooms-and-scent"

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
      quote: ({ children }) => (
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
      imageBlock: ({ value }) => {
        const alignment = value.alignment || "center"
        const alignClass =
          alignment === "left" ? "mr-auto" : alignment === "right" ? "ml-auto" : "mx-auto"
        return (
          <figure className={alignment === "center" ? "" : alignClass}>
            <div
              className={alignment === "center" ? "w-full" : `w-full ${alignClass}`}
              style={{
                aspectRatio: "4/5",
                minWidth: alignment === "center" ? undefined : "240px",
                maxWidth: alignment === "center" ? undefined : "420px",
              }}
            >
              <img
                src={value.image.url}
                alt={value.alt || blog?.title || ""}
                className="w-full h-full object-cover"
              />
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
        )
      },
      imageGalleryBlock: ({ value }) => (
        <figure>
          <div className="grid grid-cols-2 gap-2">
            {value.images.map((img: { url: string }, i: number) => (
              <img
                key={i}
                src={img.url}
                alt={blog?.title || ""}
                className="w-full h-full object-cover aspect-square"
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
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
      accordionBlock: ({ value }) => <AccordionItem label={value.label} content={value.content} />,
      statementBlock: ({ value }) => (
        <p
          className="text-center w-full py-12 md:py-16 px-6"
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "32px",
            lineHeight: "1.35",
            color: "#000",
            fontWeight: 700,
          }}
        >
          {value.statement}
        </p>
      ),
    },
  }

  if (!blog) {
    return null
  }

  // "07-Jul-26" style — matches the byline format requested for the hero.
  const formatByline = (iso?: string) => {
    if (!iso) return ""
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return ""
    const day = String(d.getDate()).padStart(2, "0")
    const month = d.toLocaleString("en-US", { month: "short" })
    const year = String(d.getFullYear()).slice(-2)
    return `${day}-${month}-${year}`
  }
  const bylineDate = formatByline(blog.publishedDate)
  const bylineAuthor = blog.author?.name

  // statementBlock, accordionBlock, and center-aligned images break out to a
  // full-width row of their own. Everything else pairs up in plain document
  // order — first block in a pair lands col 1, second lands col 2 — so a text
  // block followed by an image reads text-left/image-right, and an image
  // followed by text reads image-left/text-right, matching the zigzag straight
  // from array order. Left/right on an imageBlock only styles how the image
  // sits *inside* whichever column it lands in (see the imageBlock renderer) —
  // it never moves the column itself, or pairing with neighbors breaks.
  let contentRow = 1
  let pendingCol = 0
  const contentLayout = blog.content.map((block) => {
    const isCenterImage = block._type === "imageBlock" && (block.alignment || "center") === "center"

    if (block._type === "statementBlock" || block._type === "accordionBlock" || isCenterImage) {
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
      <Navigation isScrolled={isScrolled} disableSticky={true} forceBlackText={true} />

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
          />
        )}
        <div className="absolute inset-0 bg-black/35" />

        {showJournalStoryGrid && (
          <motion.div
            className="absolute top-6 md:top-8 left-6 md:left-10 z-20"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <Link
              href={`/${countryCode}/blogs`}
              className="inline-flex items-center text-base md:text-lg text-white hover:text-white/75 transition-colors duration-200 drop-shadow-md"
              style={{
                fontFamily: '"American Typewriter"',
                letterSpacing: "1px",
              }}
            >
              <ChevronLeft size={22} className="mr-1" />
              Back to Journal
            </Link>
          </motion.div>
        )}

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

          {(bylineDate || bylineAuthor) && (
            <motion.p
              className="mb-6"
              style={{
                fontFamily: '"American Typewriter"',
                fontSize: "13px",
                letterSpacing: "2px",
                color: "#fff",
              }}
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.18, duration: 0.7 }}
            >
              {[bylineDate, bylineAuthor].filter(Boolean).join("  ")}
            </motion.p>
          )}

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
      <div
        className={`${showJournalStoryGrid ? "w-full max-w-none px-6 md:px-12 lg:px-20" : "max-w-5xl px-6 md:px-4"} mx-auto`}
      >
        {!showJournalStoryGrid && (
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
        )}

        <div
          className={
            showJournalStoryGrid
              ? "flex flex-col gap-y-4"
              : "grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 items-start"
          }
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
              style={isMobile || showJournalStoryGrid ? undefined : contentLayout[i]}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 * i, duration: 0.6 }}
            >
              <PortableText value={[block]} components={portableTextComponents} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Featured Products — up to 3 tiles, editorially chosen per article in Sanity */}
      {featuredProducts.length > 0 && (
        <div className="max-w-5xl mx-auto px-6 md:px-4 pb-16 pt-4">
          <h2
            className="text-center mb-10 uppercase"
            style={{
              fontFamily: '"American Typewriter"',
              fontSize: "20px",
              letterSpacing: "4px",
              color: "#4f5864",
            }}
          >
            Shop the Story
          </h2>

          <div className="hidden md:grid grid-cols-3 gap-x-8 gap-y-12">
            {featuredProducts.map((product) => (
              <Link
                key={product.handle}
                href={`/${countryCode}/products/${product.handle}`}
                className="group block text-center"
              >
                <div className="relative overflow-hidden mb-4" style={{ aspectRatio: "4/5" }}>
                  <img
                    src={product.image || "/assets/placeholder-product.jpg"}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3
                  className="group-hover:underline"
                  style={{ fontFamily: '"American Typewriter"', fontSize: "16px", color: "#333" }}
                >
                  {product.title}
                </h3>
                {product.price && (
                  <p
                    className="mt-1"
                    style={{ fontFamily: "Georgia, serif", fontSize: "14px", color: "#666" }}
                  >
                    {product.price}
                  </p>
                )}
              </Link>
            ))}
          </div>

          <div className="md:hidden">
            <style
              dangerouslySetInnerHTML={{
                __html: `
                  .shop-story-carousel-item {
                    width: calc(85vw) !important;
                    flex-basis: calc(85vw) !important;
                    flex-shrink: 0 !important;
                    margin-left: 0.75rem !important;
                    margin-right: 0.75rem !important;
                  }
                  .shop-story-carousel-content {
                    user-select: none !important;
                    -webkit-user-select: none !important;
                    padding-left: 0 !important;
                    padding-right: 1.5rem !important;
                  }
                  .shop-story-carousel-content > div {
                    margin-left: 0 !important;
                    gap: 0 !important;
                  }
                `,
              }}
            />
            <Carousel
              opts={{
                align: "center",
                loop: featuredProducts.length > 1,
                dragFree: true,
              }}
              className="w-full"
            >
              <CarouselContent className="shop-story-carousel-content">
                {featuredProducts.map((product) => (
                  <CarouselItem key={product.handle} className="shop-story-carousel-item">
                    <Link
                      href={`/${countryCode}/products/${product.handle}`}
                      className="group block text-center"
                    >
                      <div className="relative overflow-hidden mb-4" style={{ aspectRatio: "4/5" }}>
                        <img
                          src={product.image || "/assets/placeholder-product.jpg"}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3
                        className="group-hover:underline"
                        style={{
                          fontFamily: '"American Typewriter"',
                          fontSize: "16px",
                          color: "#333",
                        }}
                      >
                        {product.title}
                      </h3>
                      {product.price && (
                        <p
                          className="mt-1"
                          style={{ fontFamily: "Georgia, serif", fontSize: "14px", color: "#666" }}
                        >
                          {product.price}
                        </p>
                      )}
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      )}

      {/* "Also" — related stories grid, mirrors the reference site's related-content section */}
      {showJournalStoryGrid && atmosphereProducts.length > 0 && (
        <AtmosphereProductGrid products={atmosphereProducts} countryCode={countryCode} />
      )}

      {!showJournalStoryGrid && alsoArticles.length > 0 && (
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
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
