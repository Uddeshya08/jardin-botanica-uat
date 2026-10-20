// Uploads the current homepage images and publishes the matching singleton.
// Run: node --env-file=.env scripts/seed-homepage-sanity.mjs
// Stops if a published or draft homepage already exists; never replaces edits.

import { readFile } from "node:fs/promises"
import { createClient } from "@sanity/client"

const {
  NEXT_PUBLIC_SANITY_PROJECT_ID: projectId,
  NEXT_PUBLIC_SANITY_DATASET: dataset,
  SANITY_API_WRITE_TOKEN: token,
} = process.env

if (!projectId || !dataset || !token) {
  throw new Error("Sanity project, dataset, and write token are required in .env")
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01",
  useCdn: false,
})

const images = {
  rituals: {
    filename: "homepage-banner-rituals.jpg",
    source: "https://images.unsplash.com/photo-1674620305515-1394fe40c634?w=2400&q=85",
    alt: "Botanical care ritual",
  },
  atmosphere: {
    filename: "homepage-banner-atmosphere.jpg",
    source: "https://images.unsplash.com/photo-1650482713537-8de547ea7a16?w=2400&q=85",
    alt: "Warm candlelit atmosphere",
  },
  lab: {
    filename: "homepage-banner-lab.jpg",
    source: "https://images.unsplash.com/photo-1720275273886-89966091ce4d?w=2400&q=85",
    alt: "Botanical laboratory atmosphere",
  },
  circle: {
    filename: "homepage-banner-circle.jpg",
    source: "https://images.unsplash.com/photo-1740513348123-72148a7dbf5b?w=2400&q=85",
    alt: "The Botanist's Circle",
  },
  philosophy: {
    filename: "homepage-design-philosophy.png",
    source: new URL("../public/assets/second.png", import.meta.url),
    alt: "Botanical glass greenhouse with palm fronds",
  },
  ritual: {
    filename: "homepage-hand-ritual.png",
    source: new URL("../public/assets/handwashImg.png", import.meta.url),
    alt: "Jardin Botanica handwash with natural bristle brush",
  },
  gifting: {
    filename: "homepage-bespoke-gifting.png",
    source: new URL("../public/assets/first.png", import.meta.url),
    alt: "Hands holding botanical book with oranges and plants",
  },
}

async function homepageExists() {
  return client.fetch('count(*[_id in ["homePage", "drafts.homePage"]]) > 0')
}

async function uploadImage({ filename, source, alt }) {
  const existing = await client.fetch(
    '*[_type == "sanity.imageAsset" && originalFilename == $filename][0]._id',
    { filename }
  )
  let assetId = existing

  if (!assetId) {
    let data
    if (source instanceof URL && source.protocol === "file:") {
      data = await readFile(source)
    } else {
      const response = await fetch(source)
      if (!response.ok) throw new Error(`Could not download ${filename}: HTTP ${response.status}`)
      data = Buffer.from(await response.arrayBuffer())
    }
    const asset = await client.assets.upload("image", data, { filename })
    assetId = asset._id
    console.log(`Uploaded ${filename}`)
  } else {
    console.log(`Reused ${filename}`)
  }

  return { _type: "image", alt, asset: { _type: "reference", _ref: assetId } }
}

if (await homepageExists()) {
  throw new Error("Homepage already exists in Sanity; refusing to overwrite it")
}

const uploaded = {}
for (const [key, image] of Object.entries(images)) {
  uploaded[key] = await uploadImage(image)
}

if (await homepageExists()) {
  throw new Error("Homepage was created during upload; refusing to overwrite it")
}

await client.create({
  _id: "homePage",
  _type: "homePage",
  heroSlides: [
    {
      _type: "heroSlide",
      _key: "rituals",
      title: "Rituals",
      headline: "Little acts of care that change the day.",
      description: "Made to turn the everyday into something worth noticing.",
      image: uploaded.rituals,
      videoUrl: "/assets/video-banner.mp4",
      ctaLabel: "Build your set",
      ctaAction: "link",
      ctaLink: "/body-hands",
    },
    {
      _type: "heroSlide",
      _key: "atmosphere",
      title: "Atmosphere",
      headline: "Evenings that hold you a little longer.",
      description: "A gentle glow, a scent that stays close.",
      image: uploaded.atmosphere,
      ctaLabel: "Shop candles",
      ctaAction: "link",
      ctaLink: "/candles",
    },
    {
      _type: "heroSlide",
      _key: "lab",
      title: "The Lab",
      headline: "The garden is our brief; the lab is our proof.",
      description:
        "Formulas with measured actives and climate-smart bases - finished with design you can feel.",
      image: uploaded.lab,
      ctaLabel: "Enter the lab",
      ctaAction: "link",
      ctaLink: "/the-lab",
    },
    {
      _type: "heroSlide",
      _key: "circle",
      title: "Circle",
      headline: "The Botanist's Circle",
      description:
        "An invitation to the inner world.\nEarly access. Limited blends. Private gatherings.",
      image: uploaded.circle,
      ctaLabel: "Join the Circle",
      ctaAction: "newsletter",
    },
  ],
  philosophy: {
    _type: "object",
    eyebrow: "Design Philosophy",
    heading: "From Kyoto\u2019s Moss Gardens to Kew\u2019s Glasshouses",
    description:
      "We study living collections and translate them into disciplined blends built on measured actives and climate-smart bases. Design carries it home through the weight of the vessel, the rhythm of use, and the soft afterfeel, turning daily gestures into deliberate pleasure.",
    image: uploaded.philosophy,
    ctaLabel: "Explore more",
    ctaLink: "/the-lab",
  },
  products: { _type: "object", heading: "From the Botanist\u2019s Lab\u2122" },
  ritual: {
    _type: "object",
    heading: "The Botanist's Hand Ritual",
    description:
      "Clean that isn't squeaky; softness that isn't sticky.\nA considered approach to hand care that brings together gentle exfoliation and lightweight nourishment in one everyday ritual.",
    image: uploaded.ritual,
    ctaLabel: "Get Early Access",
    emailPlaceholder: "Enter your email",
    submitLabel: "Submit",
  },
  gifting: {
    _type: "object",
    heading: "Bespoke Botanical Set",
    description:
      "For rooms, tables, welcome moments, and gestures that call for something more considered, we compose tailored selections from the Jardin Botanica world. From hand care and candles to home fragrance objects and finishing details, each set is arranged with use, atmosphere, and presentation in mind.",
    secondaryText:
      "Our specialists design solutions aligned with your brand, your ideas, and the moments you want to elevate.",
    image: uploaded.gifting,
    ctaLabel: "Begin consultation",
    contactEmail: "hello@jardinbotanica.com",
    emailSubject: "Business Enquiry",
  },
  journal: { _type: "object", heading: "From the Journal", ctaLabel: "View all" },
  newsletter: {
    _type: "object",
    heading: "Join the Circle",
    description:
      "Be the first to discover new blends, exclusive rituals, and stories from our botanical laboratory.",
    emailPlaceholder: "Enter your email",
    submitLabel: "Subscribe",
  },
})

console.log("Published homepage content and seven Sanity images")
