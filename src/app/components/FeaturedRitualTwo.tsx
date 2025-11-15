'use client'
import React from 'react'
import { motion } from 'motion/react'
import { FeaturedRitualTwoSection } from '../../types/contentful'

type FeaturedRitualTwoProps = {
  featuredRitualTwoContent?: FeaturedRitualTwoSection | null
}

export function FeaturedRitualTwo({ featuredRitualTwoContent }: FeaturedRitualTwoProps) {
  // Default values if no Contentful data is provided
  const defaults: FeaturedRitualTwoSection = {
    title: '',
    sectionKey: '',
    productHandle: undefined,
    heading: 'Hand Care Elevated',
    subheading: 'A refreshing blend of tea antioxidants and gentle exfoliants, this handwash keeps your hands healthy, glowing, and nourished.',
    backgroundColor: '#e3e3d8',
    imageUrl: '/assets/handCareImage.png',
    imageAlt: 'Jardin Botanica Tea Exfoliant Rinse with hands and botanical elements',
    cta: { label: 'Read more', href: '#' },
    imagePosition: 'left', // Changed default to image-left as requested
    active: true,
  }

  // console.log('=== FeaturedRitualTwo Component Debug ===');
  // console.log('featuredRitualTwoContent:', featuredRitualTwoContent);
  
  // if (featuredRitualTwoContent) {
  //   console.log('Product Handle:', featuredRitualTwoContent.productHandle);
  //   console.log('Section Key:', featuredRitualTwoContent.sectionKey);
  //   console.log('Heading:', featuredRitualTwoContent.heading);
  //   console.log('Image URL:', featuredRitualTwoContent.imageUrl);
  //   console.log('Active:', featuredRitualTwoContent.active);
  // }
  
  const meta = featuredRitualTwoContent || defaults

  // Don't render if Contentful data exists but is inactive
  if (featuredRitualTwoContent && !featuredRitualTwoContent.active) {
    // console.log('Section is inactive, not rendering');
    return null
  }

  const Left = (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      viewport={{ once: true }}
      className="w-full lg:w-2/5 flex flex-col justify-center px-4 md:px-10 lg:px-16 py-6 md:py-12 lg:py-16"
    >
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        viewport={{ once: true }}
        className="font-american-typewriter text-2xl md:text-3xl tracking-tight mb-6 md:mb-8 text-black leading-tight"
      >
        {meta.heading}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        viewport={{ once: true }}
        className="font-din-arabic text-base md:text-lg text-black/70 leading-relaxed mb-8 md:mb-12"
      >
        {meta.subheading}
      </motion.p>

      {meta.cta?.label && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <a href={meta.cta.href ?? '#'} aria-label={meta.cta.label}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="font-din-arabic px-8 py-3 bg-transparent border border-black/30 text-black hover:bg-black hover:text-white transition-all duration-300 tracking-wide"
            >
              {meta.cta.label}
            </motion.button>
          </a>
        </motion.div>
      )}
    </motion.div>
  )

  const Right = (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="w-full lg:w-3/5 relative px-0 md:px-0"
    >
      <div className="min-h-[400px] h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden rounded-lg md:rounded-none">
        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.9 }} className="w-full h-full">
          <img
            src={meta.imageUrl}
            alt={meta.imageAlt}
            className="w-full h-full object-contain md:object-cover object-center scale-150 md:scale-100"
          />
        </motion.div>
      </div>
    </motion.div>
  )

  // Layout based on imagePosition (default is image-left as requested)
  const content = meta.imagePosition === 'left' ? (
    <>
      {Right}
      {Left}
    </>
  ) : (
    <>
      {Left}
      {Right}
    </>
  )

  return (
    <section
      style={{ backgroundColor: meta.backgroundColor, marginTop: '20px' }}
    >
      <div className="flex flex-col lg:flex-row gap-0">{content}</div>
    </section>
  )
}