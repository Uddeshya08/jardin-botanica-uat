// One-off demo seed: creates "The Veil Theory" blog in Sanity, mirroring the
// framacph.com "Sink Theory" editorial rhythm, themed to Jardin Botanica.
// Uploads placeholder botanical images from public URLs, then builds a Portable
// Text document exercising every block type + the featuredProducts field.
//
// Run: node --env-file=.env scripts/seed-demo-blog.mjs
// Requires SANITY_API_WRITE_TOKEN (Editor role) in .env — never commit it.

import { createClient } from "@sanity/client"

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01"
const token = process.env.SANITY_API_WRITE_TOKEN

if (!token) {
  console.error("Missing SANITY_API_WRITE_TOKEN in .env (Editor role). Aborting.")
  process.exit(1)
}

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false })

// Free botanical/interior stock (Unsplash direct URLs, cropped to a workable size).
const IMAGES = {
  cover: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1600&q=80",
  basin: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=1200&q=80",
  marble: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
  interior: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1600&q=80",
}

async function uploadImage(label, url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Fetch ${label} failed: ${res.status}`)
  const buffer = Buffer.from(await res.arrayBuffer())
  const asset = await client.assets.upload("image", buffer, { filename: `${label}.jpg` })
  console.log(`  uploaded ${label} -> ${asset._id}`)
  return asset._id
}

function imageRef(assetId) {
  return { _type: "image", asset: { _type: "reference", _ref: assetId } }
}

function key(n) {
  return `blk${n}`
}

async function run() {
  console.log("Uploading placeholder images...")
  const ids = {}
  for (const [label, url] of Object.entries(IMAGES)) {
    ids[label] = await uploadImage(label, url)
  }

  console.log("Creating blog document...")
  const doc = {
    _type: "blog",
    title: "The Veil Theory",
    slug: { _type: "slug", current: "the-veil-theory" },
    description:
      "An exploration of the quiet architecture between Jardin Botanica's most essential hand care and the spaces it lives in — where material, ritual, and scent meet at the edge of a sink.",
    publishedDate: new Date().toISOString(),
    coverImage: { ...imageRef(ids.cover), hotspot: undefined },
    categories: ["Rituals"],
    tags: ["hand care", "scent", "interior"],
    author: { _type: "author", name: "Jardin Botanica" },
    featuredProducts: ["soft-orris"],
    content: [
      {
        _type: "block",
        _key: key(1),
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: key("1a"),
            text: "At Jardin Botanica, design is made for living. Every ritual begins with a fundamental need — shaped by the daily contact between body, object, and space. Soft Orris was built to bring ease into that routine: hand care that nourishes while turning a plain gesture into ceremony. The Veil Theory follows this thread — the architectural bond between our most essential hand veil and the rooms it quietly inhabits.",
            marks: [],
          },
        ],
      },
      {
        _type: "imageBlock",
        _key: key(2),
        image: imageRef(ids.basin),
        alt: "Soft Orris at the basin",
        caption: "Soft Orris at the basin",
        alignment: "right",
        fullBleed: false,
      },
      {
        _type: "imageBlock",
        _key: key(3),
        image: imageRef(ids.marble),
        alt: "Marble, water, scent",
        caption: "Marble, water, scent",
        alignment: "left",
        fullBleed: false,
      },
      {
        _type: "block",
        _key: key(4),
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: key("4a"),
            text: "The sink is one of the most-visited points in any interior — where material, architecture, and routine coalesce. The hands meet this structure many times a day, and in that meeting scent enters the surrounding air. Through water and Soft Orris, scent becomes spatial: scaled from an intimate act into an architectural frame. The cerebral made corporeal, the ephemeral made tangible, through one simple daily motion.",
            marks: [],
          },
        ],
      },
      {
        _type: "quoteBlock",
        _key: key(5),
        quote: "Making the ephemeral tangible, through a simple daily gesture.",
        attribution: "Jardin Botanica",
      },
      {
        _type: "statementBlock",
        _key: key(6),
        statement: "A natural extension of any considered interior.",
      },
      {
        _type: "imageBlock",
        _key: key(7),
        image: imageRef(ids.interior),
        alt: "A room shaped by scent",
        caption: "",
        alignment: "center",
        fullBleed: true,
      },
      {
        _type: "ctaBlock",
        _key: key(8),
        label: "Shop Soft Orris",
        url: "/in/products/soft-orris",
      },
    ],
  }

  // createOrReplace on a fixed id so re-runs update instead of duplicating.
  doc._id = "blog-the-veil-theory-demo"
  const result = await client.createOrReplace(doc)
  console.log(`Done. Document id: ${result._id}`)
  console.log("View: http://localhost:8000/in/blogs/template-2/the-veil-theory")
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
