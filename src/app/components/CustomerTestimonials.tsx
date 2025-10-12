'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Check, Star, Quote } from 'lucide-react'
import { TestimonialsSection, TestimonialItem } from '../../types/contentful'

// --------- UI bits you already had ----------
const StarRating = ({ rating, delay = 0 }: { rating: number; delay?: number }) => (
  <div className="flex justify-center gap-1 mb-4">
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, scale: 0, rotate: -45 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.4, delay: delay + i * 0.05, type: 'spring', stiffness: 200, damping: 10 }}
        viewport={{ once: true }}
      >
        <Star className={`w-4 h-4 ${i < rating ? 'text-black fill-black' : 'text-black/20'}`} strokeWidth={1} />
      </motion.div>
    ))}
  </div>
)

const VerifiedBadge = ({ delay = 0 }: { delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0, rotate: -180 }}
    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
    transition={{ duration: 0.5, delay, type: 'spring', stiffness: 200, damping: 12 }}
    viewport={{ once: true }}
    className="inline-flex items-center justify-center w-5 h-5 bg-black rounded-full ml-2 relative"
  >
    <Check className="w-3 h-3 text-white" strokeWidth={2.5} />
    <motion.div
      initial={{ scale: 0 }}
      whileInView={{ scale: [0, 1.2, 1] }}
      transition={{ duration: 0.3, delay: delay + 0.3 }}
      viewport={{ once: true }}
      className="absolute inset-0 bg-black/20 rounded-full -z-10"
    />
  </motion.div>
)

// --------- Dynamic component ----------
type CustomerTestimonialsProps = {
  testimonialsContent?: TestimonialsSection | null
}

export function CustomerTestimonials({ testimonialsContent }: CustomerTestimonialsProps) {
  // Default values if no Contentful data is provided
  const defaults: TestimonialsSection = {
    title: '',
    sectionKey: '',
    heading: 'Loved By Our Customers',
    subheading: 'Real experiences from those who have made our product part of their daily ritual.',
    backgroundColor: '#e3e3d8',
    cta: { showMore: 'View All Reviews', showLess: 'Show Less Reviews', initialCount: 3 },
    items: [],
    isActive: true,
  }

  const content = testimonialsContent || defaults
  const { heading, subheading, backgroundColor: bg, cta, items } = content

  const [visibleCount, setVisibleCount] = useState<number>(cta.initialCount)
  const [isExpanded, setIsExpanded] = useState(false)

  // Don't render if Contentful data exists but is inactive
  if (testimonialsContent && !testimonialsContent.isActive) {
    return null
  }

  // Don't render if no items
  if (items.length === 0) {
    return null
  }

  const handleShowMore = () => {
    setVisibleCount(items.length)
    setIsExpanded(true)
  }
  const handleShowLess = () => {
    setVisibleCount(cta.initialCount)
    setIsExpanded(false)
  }

  return (
    <section className="pt-20 pb-20 lg:pt-10 lg:pb-20 relative overflow-hidden" style={{ backgroundColor: bg }}>
      {/* Subtle Background Pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, rgba(162, 139, 111, 0.3) 1px, transparent 1px),
                           radial-gradient(circle at 70% 60%, rgba(162, 139, 111, 0.2) 1px, transparent 1px),
                           radial-gradient(circle at 40% 80%, rgba(162, 139, 111, 0.2) 1px, transparent 1px)`,
          backgroundSize: '60px 60px, 40px 40px, 80px 80px',
        }}
      />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="inline-block mb-4"
          >
            <Quote className="w-8 h-8 text-black/30 mx-auto" strokeWidth={1} />
          </motion.div>

          <h2 className="font-american-typewriter text-3xl tracking-tight text-black mb-4">
            {heading}
          </h2>

          {subheading && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="font-din-arabic text-black/70 max-w-2xl mx-auto mb-6"
            >
              {subheading}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="h-px bg-gradient-to-r from-transparent via-black/20 to-transparent mx-auto"
            style={{ width: '120px' }}
          />
        </motion.div>

        {/* Testimonials Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {items.slice(0, visibleCount).map((t, index) => (
                <motion.div
                  key={t.id}
                  layout
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -50, scale: 0.9 }}
                  transition={{ duration: 0.6, delay: index * 0.1, type: 'spring', stiffness: 100, damping: 15 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group"
                >
                  <motion.div
                    className="bg-white/15 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-xl shadow-black/5 relative overflow-hidden"
                    whileHover={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)', borderColor: 'rgba(255, 255, 255, 0.4)' }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ borderRadius: '1rem' }}
                    />

                    {/* Customer Info */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                      viewport={{ once: true }}
                      className="text-center mb-4"
                    >
                      <div className="flex items-center justify-center mb-2">
                        <h3 className="font-american-typewriter text-lg text-black">
                          {t.name}
                        </h3>
                        {t.verified && <VerifiedBadge delay={index * 0.1 + 0.4} />}
                      </div>
                      <p className="font-din-arabic text-xs text-black/60 uppercase tracking-wide">
                        {t.location}{t.purchaseDate ? ` • ${t.purchaseDate}` : ''}
                      </p>
                    </motion.div>

                    {/* Star Rating */}
                    <StarRating rating={t.rating} delay={index * 0.1 + 0.5} />

                    {/* Review Text */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 + 0.6 }}
                      viewport={{ once: true }}
                      className="relative"
                    >
                      <Quote className="absolute -top-2 -left-2 w-6 h-6 text-black/20" strokeWidth={1} />
                      <p className="font-din-arabic text-black/80 leading-relaxed italic relative z-10 pl-4">
                        {t.review}
                      </p>
                    </motion.div>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Show More/Less Button */}
          {items.length > cta.initialCount && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <motion.button
                onClick={isExpanded ? handleShowLess : handleShowMore}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="font-din-arabic px-8 py-3 bg-transparent border border-black/30 text-black hover:bg-black hover:text-white transition-all duration-300 tracking-wide"
              >
                {isExpanded ? cta.showLess : cta.showMore}
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
