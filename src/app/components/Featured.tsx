'use client'
import React, { useMemo } from 'react'
import { motion } from 'motion/react'

type ProductLike = { metadata?: Record<string, any> }

type FeaturedMeta = {
  heading?: string
  subheading?: string
  bg?: string
  inputPlaceholder?: string
  ctaLabel?: string
  ctaHref?: string    // optional link for Subscribe button
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

export default function Featured({ product }: { product?: ProductLike }) {
  const meta: Required<FeaturedMeta> = useMemo(() => {
    const defaults: Required<FeaturedMeta> = {
      heading: 'Cultivate Your Ritu',
      subheading:
        'Subscribe to receive hand care wisdom, botanical insights, and early access to our latest concoctions.',
      bg: '#e3e3d8',
      inputPlaceholder: 'Enter your email',
      ctaLabel: 'Subscribe',
      ctaHref: '#',
    }

    const raw =
      product?.metadata?.featured ??
      product?.metadata?.sections?.featured

    if (!raw) return defaults

    const parsed: any = parseTwice(raw)
    if (!parsed || typeof parsed !== 'object') return defaults

    return {
      heading: typeof parsed.heading === 'string' ? parsed.heading : defaults.heading,
      subheading: typeof parsed.subheading === 'string' ? parsed.subheading : defaults.subheading,
      bg: typeof parsed.bg === 'string' ? parsed.bg : defaults.bg,
      inputPlaceholder:
        typeof parsed.inputPlaceholder === 'string' ? parsed.inputPlaceholder : defaults.inputPlaceholder,
      ctaLabel: typeof parsed.ctaLabel === 'string' ? parsed.ctaLabel : defaults.ctaLabel,
      ctaHref: typeof parsed.ctaHref === 'string' ? parsed.ctaHref : defaults.ctaHref,
    }
  }, [product])

  return (
    <section className="py-20 relative overflow-hidden" style={{ backgroundColor: meta.bg }}>
      {/* animated background layers (unchanged) */}
      <motion.div
        className="absolute inset-0 opacity-15"
        style={{
          background:
            'linear-gradient(45deg, #e58a4d, #545d4a, #e58a4d, #545d4a, #e58a4d)',
          backgroundSize: '600% 600%',
        }}
        animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
        transition={{ duration: 15, ease: [0.4, 0, 0.6, 1], repeat: Infinity }}
      />
      <motion.div
        className="absolute inset-0 opacity-10"
        style={{
          background:
            'linear-gradient(-45deg, #545d4a, #e58a4d, #545d4a, #e58a4d)',
          backgroundSize: '800% 800%',
        }}
        animate={{ backgroundPosition: ['100% 0%', '0% 100%', '100% 0%'] }}
        transition={{ duration: 20, ease: [0.25, 0.46, 0.45, 0.94], repeat: Infinity }}
      />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="font-american-typewriter text-3xl tracking-tight mb-6 text-black"
          >
            {meta.heading}
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="font-din-arabic text-black/70 mb-8 leading-relaxed text-lg"
          >
            {meta.subheading}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
          >
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="email"
              placeholder={meta.inputPlaceholder}
              className="font-din-arabic flex-1 px-4 py-3 bg-transparent border border-black/30 text-black placeholder-black/60 focus:outline-none focus:border-black transition-all duration-300"
            />
            {/* If ctaHref is provided, render as a link; otherwise plain button */}
            {meta.ctaHref && meta.ctaHref !== '#' ? (
              <a href={meta.ctaHref} aria-label={meta.ctaLabel}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="font-din-arabic px-8 py-3 bg-black text-white hover:bg-black/90 transition-colors tracking-wide w-full sm:w-auto"
                >
                  {meta.ctaLabel}
                </motion.button>
              </a>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="font-din-arabic px-8 py-3 bg-black text-white hover:bg-black/90 transition-colors tracking-wide w-full sm:w-auto"
              >
                {meta.ctaLabel}
              </motion.button>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
