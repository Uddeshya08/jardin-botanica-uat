"use client"

import { ArrowRight, Mail } from "lucide-react"
import { motion } from "motion/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Navigation } from "../../../components/Navigation"

export default function CareersPage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  // Get country code from pathname
  const getCountryCode = () => {
    if (pathname) {
      const pathParts = pathname.split("/")
      return pathParts[1] || "in"
    }
    return "in"
  }

  const countryCode = getCountryCode()

  // Set page metadata on client side
  useEffect(() => {
    document.title = "Careers | Jardin Botanica"

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Join the Botanist's Lab at Jardin Botanica. We're looking for curious minds and restless hands across diverse disciplines."
      )
    }
  }, [])

  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 50)
    }

    window.addEventListener("scroll", handleScroll)

    // Check initial scroll position
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <>
      <Navigation isScrolled={isScrolled} />
      <main>
        <div
          className="min-h-screen px-6 lg:px-16 pt-32 lg:pt-40 pb-24 lg:pb-32"
          style={{ backgroundColor: "#e3e3d8" }}
        >
          <div className="max-w-4xl mx-auto">
            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-16 text-center"
            >
              <h1
                className="font-american-typewriter mb-4 text-3xl text-center"
                style={{ letterSpacing: "0.05em" }}
              >
                Work With the Botanist's Lab
              </h1>
              <p className="font-din-arabic text-black/60" style={{ letterSpacing: "0.1em" }}>
                Join our team of curious minds and restless hands
              </p>
            </motion.div>

            {/* Content Sections */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="space-y-12"
            >
              {/* Opening Statement */}
              <div className="space-y-6">
                <p
                  className="font-din-arabic text-black/80 leading-relaxed"
                  style={{ letterSpacing: "0.1em" }}
                >
                  If you see the world
                  through scent, texture, and light; if your art blurs science and story; if your
                  work begins with wonder — we'd love to hear from you.
                </p>
              </div>

              {/* Who We're Looking For */}
              <div className="border-t border-black/10 pt-12">
                <h2
                  className="font-american-typewriter mb-8 text-3xl text-center"
                  style={{ letterSpacing: "0.05em" }}
                >
                  Who We Welcome
                </h2>
                <p
                  className="font-din-arabic text-black/70 mb-10 text-center max-w-3xl mx-auto leading-relaxed"
                  style={{ letterSpacing: "0.1em" }}
                >
                  Our team is built from diverse disciplines united by shared obsession. Whether you
                  craft with words, pixels, molecules, or earth, there's space here for you.
                </p>
                <div className="space-y-8">
                  {[
                    {
                      role: "Writers",
                      desc: "Storytellers who shape narrative from scent and sense",
                    },
                    {
                      role: "Visual Artists",
                      desc: "Image-makers who translate botany into beauty",
                    },
                    {
                      role: "CGI/3D Wizards",
                      desc: "Digital alchemists building worlds from code",
                    },
                    {
                      role: "Botanists",
                      desc: "Plant scholars with dirt under their nails",
                    },
                    {
                      role: "Perfumers",
                      desc: "Scent architects who compose in molecules",
                    },
                    {
                      role: "Photographers",
                      desc: "Light-catchers documenting the unseen",
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={item.role}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                      className="border-l-2 border-black/20 pl-8"
                    >
                      <h3
                        className="font-american-typewriter mb-3 text-2xl"
                        style={{ letterSpacing: "0.05em" }}
                      >
                        {item.role}
                      </h3>
                      <p
                        className="font-din-arabic text-black/70 leading-relaxed"
                        style={{ letterSpacing: "0.1em" }}
                      >
                        {item.desc}
                      </p>
                    </motion.div>
                  ))}
                </div>
                <p
                  className="font-din-arabic text-black/60 mt-8 text-center italic"
                  style={{ letterSpacing: "0.1em" }}
                >
                  And anyone else driven by quiet obsession
                </p>
              </div>

              {/* How to Apply */}
              <div className="border-t border-black/10 pt-12">
                <h2
                  className="font-american-typewriter mb-8 text-3xl text-center"
                  style={{ letterSpacing: "0.05em" }}
                >
                  How to Apply
                </h2>
                <div className="space-y-8">
                  <div className="text-center">
                    <p
                      className="font-din-arabic text-black/80 leading-relaxed mb-6"
                      style={{ letterSpacing: "0.1em" }}
                    >
                      Send your resume and work to:
                    </p>

                    {/* Email Button */}
                    <motion.a
                      href="mailto:hello@jardinbotanica.com"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center gap-4 px-8 py-4 border text-black font-din-arabic tracking-wide hover:bg-black hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
                      style={{ borderColor: "#D8D2C7", letterSpacing: "0.1em" }}
                    >
                      <Mail className="w-5 h-5" />
                      hello@jardinbotanica.com
                    </motion.a>
                  </div>

                  {/* Subject Line Format */}
                  <div className="bg-black/5 p-8 lg:p-10">
                    <p
                      className="font-din-arabic text-black/60 mb-4"
                      style={{ letterSpacing: "0.1em" }}
                    >
                      Subject Line Format:
                    </p>
                    <p
                      className="font-din-arabic text-black mb-6"
                      style={{ letterSpacing: "0.1em" }}
                    >
                      "Attn: JB — [Discipline] — [Your Name]"
                    </p>
                    <div className="border-l-2 border-black/20 pl-6">
                      <p
                        className="font-din-arabic text-black/60 italic"
                        style={{ letterSpacing: "0.1em" }}
                      >
                        Example:
                        <br />
                        "Attn: JB — CGI Artist — Ananya Singh"
                      </p>
                    </div>
                  </div>

                  {/* Final Note */}
                  <p
                    className="font-din-arabic text-black/70 leading-relaxed"
                    style={{ letterSpacing: "0.1em" }}
                  >
                    We review submissions regularly and will reach out if there's a fit.
                  </p>
                </div>
              </div>

              {/* Values Section */}
              <div className="border-t border-black/10 pt-12">
                <h2
                  className="font-american-typewriter mb-8 text-3xl text-center"
                  style={{ letterSpacing: "0.05em" }}
                >
                  What We Value
                </h2>
                <div className="space-y-8">
                  {[
                    {
                      title: "Curiosity Over Certainty",
                      description:
                        'We prize the question more than the quick answer. Those who wonder "what if" tend to build things that last.',
                    },
                    {
                      title: "Craft & Chemistry",
                      description:
                        "Every formula, image, and word is shaped by both intuition and iteration. We expect precision, but we celebrate process.",
                    },
                    {
                      title: "Quiet Obsession",
                      description:
                        "The best work often happens in silence. We look for people who can disappear into their discipline and emerge with something genuine.",
                    },
                    {
                      title: "Collaborative Independence",
                      description:
                        "You know when to work alone and when to ask for eyes. You're confident but never closed off.",
                    },
                  ].map((value, index) => (
                    <motion.div
                      key={value.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                      className="border-l-2 border-black/20 pl-8"
                    >
                      <h3
                        className="font-american-typewriter mb-3 text-2xl"
                        style={{ letterSpacing: "0.05em" }}
                      >
                        {value.title}
                      </h3>
                      <p
                        className="font-din-arabic text-black/70 leading-relaxed"
                        style={{ letterSpacing: "0.1em" }}
                      >
                        {value.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="pt-12 border-t border-black/10 text-center">
                <Link href={`/${countryCode}`}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-3 px-8 py-4 border text-black font-din-arabic tracking-wide hover:bg-black hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
                    style={{ borderColor: "#D8D2C7", letterSpacing: "0.1em" }}
                  >
                    Return to home
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </>
  )
}
