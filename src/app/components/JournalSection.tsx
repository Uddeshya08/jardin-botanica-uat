import { motion } from "motion/react"
import Link from "next/link"
import React, { useState } from "react"
import type { Blog } from "types/contentful"
import { ImageWithFallback } from "./figma/ImageWithFallback"

interface JournalSectionProps {
  blogs?: Blog[]
  countryCode?: string
}

function JournalPostCard({
  blog,
  index,
  countryCode,
}: {
  blog: Blog
  index: number
  countryCode?: string
}) {
  const [isPressed, setIsPressed] = useState(false)

  return (
    <Link href={`/${countryCode}/blogs/${blog.slug}`} className="block h-full">
      <motion.article
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: index * 0.2 }}
        viewport={{ once: true }}
        className="group cursor-pointer flex flex-col h-full"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.2 + 0.3 }}
          viewport={{ once: true }}
          className="space-y-4 px-6 order-2 pb-10 md:pb-0 flex-grow"
        >
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: index * 0.2 + 0.4 }}
            viewport={{ once: true }}
            className="font-din-arabic text-sm text-black/60 tracking-wide"
          >
            {blog.categories?.[0] || "Journal"}
          </motion.span>

          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 + 0.5 }}
            viewport={{ once: true }}
            className="font-american-typewriter text-xl leading-tight text-black group-hover:text-black/70 transition-colors duration-300"
          >
            {blog.title}
          </motion.h3>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: index * 0.2 + 0.6 }}
            viewport={{ once: true }}
            className="font-din-arabic text-sm text-black/50"
          >
            {blog.publishedDate
              ? new Date(blog.publishedDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })
              : ""}
          </motion.p>
        </motion.div>

        <motion.div className="aspect-[4/3] md:aspect-[3/4] overflow-hidden mb-6 order-1 px-6 md:px-0">
          <motion.div
            whileHover={{ scale: 1.1 }}
            animate={{ scale: isPressed ? 1.1 : 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            onTouchStart={() => setIsPressed(true)}
            onTouchEnd={() => setIsPressed(false)}
            onTouchCancel={() => setIsPressed(false)}
            className="w-full h-full"
          >
            <ImageWithFallback
              src={blog.image || ""}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </motion.div>
      </motion.article>
    </Link>
  )
}

export function JournalSection({ blogs, countryCode }: JournalSectionProps) {
  if (!blogs || blogs.length === 0) {
    return null
  }

  return (
    <section className="pt-6 lg:pt-8 pb-12 lg:pb-16" style={{ backgroundColor: "#edede2" }}>
      <div className="w-full md:container md:mx-auto px-0 md:px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12 max-w-8xl mx-auto px-6"
        >
          <h2 className="font-american-typewriter text-center text-2xl md:text-3xl lg:text-4xl tracking-tight mb-4 text-black leading-tight">
            From the Journal
          </h2>
        </motion.div>

        <div className="max-w-8xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-4 md:mb-12">
            {blogs.map((blog, index) => (
              <JournalPostCard
                key={blog.slug}
                blog={blog}
                index={index}
                countryCode={countryCode}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
            className="text-center px-6"
          >
            <Link href={countryCode ? `/${countryCode}/blogs` : "/blogs"}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="font-din-arabic px-8 py-3 bg-transparent border border-black/30 text-black hover:bg-black hover:text-white transition-all duration-300 tracking-wide"
              >
                View all
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
