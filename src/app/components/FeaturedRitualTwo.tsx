'use client'
import React, { useMemo } from 'react'
import { motion } from 'motion/react'

type ProductLike = {
  title?: string
  handle?: string
  metadata?: Record<string, any>
}

type Cta = {
  label?: string
  href?: string
}

type FeaturedMeta = {
  heading?: string
  subheading?: string
  bg?: string
  image?: string
  imageAlt?: string
  cta?: Cta
  // optional layout control
  align?: 'image-right' | 'image-left'
}

function stripJsonComments(str: string) {
  return str
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1')
}
function parseMaybe(v: any) {
  if (typeof v !== 'string') return v
  try { return JSON.parse(stripJsonComments(v.trim())) } catch { return v }
}
function parseTwice(v: any) {
  const once = parseMaybe(v)
  return typeof once === 'string' ? parseMaybe(once) : once
}

export function FeaturedRitualTwo({ product }: { product?: ProductLike }) {
  // Read from metadata: prefer flat key, then sections.featuredRitualTwo
  const meta: Required<FeaturedMeta> = useMemo(() => {
    const defaults: Required<FeaturedMeta> = {
      heading: 'Hand Care Elev',
      subheading:
        'A refreshing blend of tea antioxidants and gentle exfoliants, this handwash keeps your hands healthy, glowing, and nourished.',
      bg: '#e3e3d8',
      image: '/assets/handCareImage.png',
      imageAlt:
        'Jardin Botanica Tea Exfoliant Rinse with hands and botanical elements',
      cta: { label: 'Read more', href: '#' },
      align: 'image-right',
    }

    const raw =
      product?.metadata?.featuredRitualTwo ??
      product?.metadata?.sections?.featuredRitualTwo

    if (!raw) return defaults

    const parsed: any = parseTwice(raw)
    if (!parsed || typeof parsed !== 'object') return defaults

    return {
      heading:
        typeof parsed.heading === 'string' ? parsed.heading : defaults.heading,
      subheading:
        typeof parsed.subheading === 'string'
          ? parsed.subheading
          : defaults.subheading,
      bg: typeof parsed.bg === 'string' ? parsed.bg : defaults.bg,
      image: typeof parsed.image === 'string' ? parsed.image : defaults.image,
      imageAlt:
        typeof parsed.imageAlt === 'string' ? parsed.imageAlt : defaults.imageAlt,
      cta: {
        label:
          typeof parsed.cta?.label === 'string'
            ? parsed.cta.label
            : defaults.cta.label,
        href:
          typeof parsed.cta?.href === 'string'
            ? parsed.cta.href
            : defaults.cta.href,
      },
      align:
        parsed.align === 'image-left' || parsed.align === 'image-right'
          ? parsed.align
          : defaults.align,
    }
  }, [product])

  const Left = (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      viewport={{ once: true }}
      className="w-2/5 flex flex-col justify-center px-16 py-16"
    >
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        viewport={{ once: true }}
        className="font-american-typewriter text-3xl tracking-tight mb-8 text-black leading-tight"
      >
        {meta.heading}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        viewport={{ once: true }}
        className="font-din-arabic text-lg text-black/70 leading-relaxed mb-12"
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
      className="w-3/5 relative"
    >
      <div className="h-[80vh] overflow-hidden">
        <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.9 }} className="w-full h-full">
          <img
            src={meta.image}
            alt={meta.imageAlt}
            className="w-full h-full object-cover object-center"
          />
        </motion.div>
      </div>
    </motion.div>
  )

  // Optional layout flip via metadata.align
  const content = meta.align === 'image-left' ? (
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
      className="pt-4 pb-12 lg:pt-6 lg:pb-20"
      style={{ backgroundColor: meta.bg, marginTop: '20px' }}
    >
      <div className="flex">{content}</div>
    </section>
  )
}
