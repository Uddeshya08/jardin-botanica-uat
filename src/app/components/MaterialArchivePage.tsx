"use client"

import { motion } from "motion/react"
import { useState } from "react"
import { ImageWithFallback } from "./figma/ImageWithFallback"

type ArchiveCategory = "Candles" | "Fragrance" | "Cleansers & Exfoliants" | "Lotions & Moisturizers"

interface ArchiveRecord {
  id: string
  title: string
  category: ArchiveCategory
  image: string
  species: string
  variety: string
  origin: string
  harvested: string
  method: string
  duration: string
  notes: string
  description: string
}

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1632118588340-c4c7a674c707?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"

const archiveRecords: ArchiveRecord[] = [
  {
    id: "star-anise",
    title: "Star Anise",
    category: "Candles",
    image: "/assets/material-star-anise.jpg",
    species: "Illicium verum",
    variety: "Chinese star anise",
    origin: "Guangxi, China",
    harvested: "Early autumn",
    method: "Steam distillation",
    duration: "Eight hours",
    notes: "Warm spice, anise, dry wood",
    description:
      "The star-shaped fruit is gathered before full ripening, then slowly dried until its warm aromatic character deepens. Distillation reveals a sweet spice note with dry woody edges. In wax it adds diffusion and warmth, supporting resins, woods and citrus without overwhelming their quieter details.",
  },
  {
    id: "beeswax",
    title: "Botanical Wax",
    category: "Candles",
    image:
      "https://images.unsplash.com/photo-1578509725196-53444c549731?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=900&h=1120",
    species: "Euphorbia cerifera",
    variety: "Candelilla",
    origin: "Chihuahuan Desert, Mexico",
    harvested: "Early summer",
    method: "Water extraction",
    duration: "Three days",
    notes: "Clean burn, soft sheen",
    description:
      "A firm plant wax selected for its clean structure and delicate natural sheen. Harvested by hand and separated through warm-water extraction, it gives candle blends stability and a measured melt. The finished material burns evenly and carries fragrance with restrained clarity.",
  },
  {
    id: "bergamot",
    title: "Bergamot Peel",
    category: "Fragrance",
    image:
      "https://images.unsplash.com/photo-1693069313209-a9c8eca1eb1a?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=900&h=1120",
    species: "Citrus bergamia",
    variety: "Femminello",
    origin: "Calabria, Italy",
    harvested: "November to January",
    method: "Cold expression",
    duration: "Six hours",
    notes: "Green citrus, tea, soft floral",
    description:
      "The peel is pressed within hours of harvest to retain its vivid green facets. At first it is bright and almost bitter, then settles into tea-like softness. Used sparingly, bergamot opens a composition and gives darker woods and resins a clear, luminous edge.",
  },
  {
    id: "rose",
    title: "Damask Rose",
    category: "Fragrance",
    image:
      "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&q=85&w=900&h=1120",
    species: "Rosa damascena",
    variety: "Trigintipetala",
    origin: "Isparta, Turkey",
    harvested: "May dawn harvest",
    method: "Steam distillation",
    duration: "Four hours",
    notes: "Petal, honey, green stem",
    description:
      "Petals are gathered before the sun warms their volatile oils. Immediate distillation captures both the familiar bloom and its greener, less expected stem. The result is textured rather than sweet, lending fragrance a soft radiance and a natural sense of movement.",
  },
  {
    id: "tea",
    title: "Tea Leaf",
    category: "Cleansers & Exfoliants",
    image:
      "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&q=85&w=900&h=1120",
    species: "Camellia sinensis",
    variety: "Assamica",
    origin: "Assam, India",
    harvested: "Second flush",
    method: "Air dried and milled",
    duration: "Twenty-four hours",
    notes: "Tannin-rich, fine texture",
    description:
      "Young leaves are dried gently, then milled to a fine exfoliating powder. Their natural tannins bring a clean, astringent quality while the soft particle size polishes without harshness. The material gives rinse-off formulas an earthy colour and a fresh tea character.",
  },
  {
    id: "walnut",
    title: "Walnut Shell",
    category: "Cleansers & Exfoliants",
    image:
      "https://images.unsplash.com/photo-1471194402529-8e0f5a675de6?auto=format&fit=crop&q=85&w=900&h=1120",
    species: "Juglans regia",
    variety: "Kashmir walnut",
    origin: "Kashmir, India",
    harvested: "Early autumn",
    method: "Washed and micronized",
    duration: "Two days",
    notes: "Rounded grain, warm brown",
    description:
      "Discarded shells are cleaned, dried and precisely milled into rounded particles. Careful grading removes sharp fragments and creates a consistent, tactile exfoliant. In cleansing preparations it brings measured polish, an honest natural colour and a useful second life to orchard material.",
  },
  {
    id: "shea",
    title: "Shea Kernel",
    category: "Lotions & Moisturizers",
    image:
      "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&q=85&w=900&h=1120",
    species: "Vitellaria paradoxa",
    variety: "Nilotica",
    origin: "Northern Uganda",
    harvested: "June to August",
    method: "Cold pressed",
    duration: "Five days",
    notes: "Creamy, nutty, quick-melting",
    description:
      "The kernels are sun-dried and pressed at low temperature to retain their naturally soft fraction. This variety melts readily against skin and leaves a supple finish with little residue. Its mild aroma and generous texture make it a grounding base for restorative body formulas.",
  },
  {
    id: "calendula",
    title: "Calendula Flower",
    category: "Lotions & Moisturizers",
    image:
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&q=85&w=900&h=1120",
    species: "Calendula officinalis",
    variety: "Resina",
    origin: "Uttarakhand, India",
    harvested: "Midsummer",
    method: "Oil maceration",
    duration: "Twenty-one days",
    notes: "Herbaceous, golden, soothing",
    description:
      "Whole flower heads are dried in shade before a patient infusion in botanical oil. Time draws out their warm colour and lipid-soluble compounds without excessive heat. The resulting macerate has a gentle herbaceous note and brings comfort and softness to daily moisturizers.",
  },
]

const categories = [
  "All",
  "Candles",
  "Fragrance",
  "Cleansers & Exfoliants",
  "Lotions & Moisturizers",
] as const

export function MaterialArchivePage() {
  const [selectedCategory, setSelectedCategory] = useState<(typeof categories)[number]>("All")
  const visibleRecords =
    selectedCategory === "All"
      ? archiveRecords
      : archiveRecords.filter((record) => record.category === selectedCategory)

  return (
    <main className="min-h-screen bg-[#f0eee4] text-[#26251f]">
      <section className="relative h-[62vh] min-h-[500px] overflow-hidden">
        <ImageWithFallback
          src={HERO_IMAGE}
          alt="Botanical material archive"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/35 to-black/10" />
        <div className="relative z-10 flex h-full items-center justify-center px-5 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="mb-5 font-din-arabic text-xs tracking-[0.24em] text-white/80">
              THE BOTANIST&apos;S LAB
            </p>
            <h1 className="font-american-typewriter text-4xl tracking-wide sm:text-5xl lg:text-7xl">
              Material Archive
            </h1>
            <p className="mx-auto mt-6 max-w-2xl font-din-arabic text-sm leading-7 tracking-[0.08em] sm:text-base">
              A working record of botanical matter, its provenance, transformation, and purpose.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="border-b border-black/15 px-4 py-6 sm:px-8 lg:px-12">
        <div className="scrollbar-hide mx-auto flex max-w-[100rem] gap-7 overflow-x-auto pb-1 sm:flex-wrap sm:gap-x-10">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`shrink-0 border-b pb-1 font-din-arabic text-sm tracking-[0.1em] transition-colors ${
                selectedCategory === category
                  ? "border-black text-black"
                  : "border-transparent text-black/55 hover:text-black"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section className="px-4 py-12 sm:px-8 sm:py-16 lg:px-12 xl:px-16">
        <motion.div
          layout
          className="mx-auto grid max-w-[88rem] grid-cols-2 gap-x-3 gap-y-12 sm:gap-x-7 sm:gap-y-16 lg:grid-cols-4 xl:gap-x-9"
        >
          {visibleRecords.map((record, index) => (
            <motion.article
              layout
              key={record.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.04 }}
              className="min-w-0 border-t border-black/20 pt-3"
            >
              <div className="aspect-[3/5] overflow-hidden bg-[#ddd8ca]">
                <ImageWithFallback
                  src={record.image}
                  alt={record.title}
                  className="h-full w-full object-cover saturate-[0.72] sepia-[0.12]"
                />
              </div>

              <p className="mt-3 font-din-arabic text-[8px] uppercase tracking-[0.14em] text-black/50 sm:mt-4 sm:text-[9px] sm:tracking-[0.22em]">
                {record.category} record
              </p>
              <h2 className="mt-2 font-american-typewriter text-base leading-tight sm:text-xl">
                {record.title}
              </h2>

              <dl className="mt-4 grid grid-cols-[3.7rem_1fr] gap-x-1.5 gap-y-1 font-din-arabic text-[8px] uppercase leading-[1.45] tracking-[0.04em] sm:mt-5 sm:grid-cols-[4.9rem_1fr] sm:gap-x-2 sm:text-[10px] sm:tracking-[0.08em]">
                <dt className="text-black/48">Species</dt>
                <dd className="min-w-0">{record.species}</dd>
                <dt className="text-black/48">Variety</dt>
                <dd className="min-w-0">{record.variety}</dd>
                <dt className="text-black/48">Origin</dt>
                <dd className="min-w-0">{record.origin}</dd>
                <dt className="text-black/48">Harvested</dt>
                <dd className="min-w-0">{record.harvested}</dd>
                <dt className="text-black/48">Method</dt>
                <dd className="min-w-0">{record.method}</dd>
                <dt className="text-black/48">Duration</dt>
                <dd className="min-w-0">{record.duration}</dd>
                <dt className="text-black/48">Notes</dt>
                <dd className="min-w-0">{record.notes}</dd>
              </dl>

              <p className="mt-4 border-t border-black/15 pt-4 font-american-typewriter text-[10px] leading-[1.55] text-black/75 sm:mt-6 sm:pt-5 sm:text-[12px] sm:leading-[1.65]">
                {record.description}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </section>
    </main>
  )
}
