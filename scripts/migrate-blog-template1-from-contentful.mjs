// Migrates specific Contentful "blog" entries (Blog Template 1 / Journal) into
// Sanity's blogTemplate1 document type. Matches entries by title against the
// list below (from the Contentful CSV export), pulls full fields including
// rich text body + embedded images, and creates/updates them in Sanity.
//
// Run: node --env-file=.env scripts/migrate-blog-template1-from-contentful.mjs
// Requires (all already in .env):
//   CONTENTFUL_SPACE_ID / NEXT_PUBLIC_CONTENTFUL_SPACE_ID
//   CONTENTFUL_ACCESS_TOKEN / NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN
//   SANITY_API_WRITE_TOKEN (Editor role)

import { createClient as createContentfulClient } from "contentful"
import { createClient as createSanityClient } from "@sanity/client"
import { BLOCKS, INLINES, MARKS } from "@contentful/rich-text-types"

const TITLES_TO_MIGRATE = [
  "Orris, Powder, and the Art of the Soft Finish",
  "Tea, in Texture and Scent",
  "Santal Pepper: A Room With A Pulse",
  "Cedarwood Rose: A Room In Bloom",
]

const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || process.env.CONTENTFUL_SPACE_ID
const accessToken =
  process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN || process.env.CONTENTFUL_ACCESS_TOKEN
const environment = process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || "master"

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01"
const sanityToken = process.env.SANITY_API_WRITE_TOKEN

if (!spaceId || !accessToken) {
  console.error("Missing Contentful credentials in .env. Aborting.")
  process.exit(1)
}
if (!sanityToken) {
  console.error("Missing SANITY_API_WRITE_TOKEN in .env. Aborting.")
  process.exit(1)
}

const contentful = createContentfulClient({ space: spaceId, accessToken, environment })
const sanity = createSanityClient({ projectId, dataset, apiVersion, token: sanityToken, useCdn: false })

const assetCache = new Map()

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

async function uploadImageFromUrl(url, filename) {
  if (assetCache.has(url)) return assetCache.get(url)
  const res = await fetch(url.startsWith("//") ? `https:${url}` : url)
  if (!res.ok) throw new Error(`Fetch image failed (${res.status}): ${url}`)
  const buffer = Buffer.from(await res.arrayBuffer())
  const asset = await sanity.assets.upload("image", buffer, { filename })
  assetCache.set(url, asset._id)
  console.log(`  uploaded image ${filename} -> ${asset._id}`)
  return asset._id
}

function imageRef(assetId) {
  return { _type: "image", asset: { _type: "reference", _ref: assetId } }
}

let blockKeyCounter = 0
function key() {
  blockKeyCounter += 1
  return `blk${blockKeyCounter}`
}

const STYLE_MAP = {
  [BLOCKS.PARAGRAPH]: "normal",
  [BLOCKS.HEADING_2]: "h2",
  [BLOCKS.HEADING_3]: "h3",
  [BLOCKS.QUOTE]: "quote",
}

function marksToDecorators(marks = []) {
  const decorators = []
  for (const mark of marks) {
    if (mark.type === MARKS.BOLD) decorators.push("strong")
    if (mark.type === MARKS.ITALIC) decorators.push("em")
  }
  return decorators
}

function textNodeToSpans(node, markDefs) {
  if (node.nodeType === "text") {
    return [{ _type: "span", _key: key(), text: node.value, marks: marksToDecorators(node.marks) }]
  }
  if (node.nodeType === INLINES.HYPERLINK) {
    const linkKey = key()
    markDefs.push({ _key: linkKey, _type: "link", href: node.data?.uri || "" })
    const spans = []
    for (const child of node.content || []) {
      spans.push(...textNodeToSpans(child, markDefs))
    }
    return spans.map((s) => ({ ...s, marks: [...s.marks, linkKey] }))
  }
  // Unknown inline node type — skip
  return []
}

// Converts a Contentful rich text Document into blogTemplate1's `content`
// array (block + imageBlock). Lists get flattened to plain paragraphs since
// the Sanity schema has no list styles.
async function convertRichText(document) {
  const result = []
  if (!document?.content) return result

  for (const node of document.content) {
    if (node.nodeType === BLOCKS.EMBEDDED_ASSET) {
      const asset = node.data?.target
      const url = asset?.fields?.file?.url
      if (!url) continue
      const assetId = await uploadImageFromUrl(url, asset.fields.title || "embedded-image")
      result.push({
        _type: "imageBlock",
        _key: key(),
        image: imageRef(assetId),
        alt: asset.fields.description || asset.fields.title || "",
        caption: "",
        alignment: "center",
        fullBleed: false,
      })
      continue
    }

    if (node.nodeType === BLOCKS.UL_LIST || node.nodeType === BLOCKS.OL_LIST) {
      for (const item of node.content || []) {
        for (const para of item.content || []) {
          const markDefs = []
          const children = (para.content || []).flatMap((child) => textNodeToSpans(child, markDefs))
          if (children.length) {
            result.push({ _type: "block", _key: key(), style: "normal", markDefs, children })
          }
        }
      }
      continue
    }

    const style = STYLE_MAP[node.nodeType]
    if (!style) continue // skip unsupported node types (tables, hr, etc.)

    const markDefs = []
    const children = (node.content || []).flatMap((child) => textNodeToSpans(child, markDefs))
    if (!children.length) continue

    result.push({ _type: "block", _key: key(), style, markDefs, children })
  }

  return result
}

async function migrateEntry(entry) {
  const fields = entry.fields
  console.log(`\nMigrating: ${fields.title}`)

  const coverUrl = fields.image?.fields?.file?.url
  let coverImage
  if (coverUrl) {
    const assetId = await uploadImageFromUrl(coverUrl, fields.title)
    coverImage = { ...imageRef(assetId), hotspot: undefined }
  }

  const authorName = fields.author?.fields?.name
  const author = authorName ? { _type: "author", name: authorName } : undefined

  const categories = Array.isArray(fields.journalTag)
    ? fields.journalTag.map((t) => t.fields?.name).filter(Boolean)
    : []

  const featuredProducts = Array.isArray(fields.featuredProducts)
    ? fields.featuredProducts.map((p) => p.fields?.productHandle).filter(Boolean)
    : []

  const content = await convertRichText(fields.content)

  const doc = {
    _id: `blogTemplate1-${slugify(fields.slug || fields.title)}`,
    _type: "blogTemplate1",
    title: fields.title || "",
    slug: { _type: "slug", current: fields.slug || slugify(fields.title) },
    description: fields.description || "",
    publishedDate: fields.publishedDate || undefined,
    coverImage,
    imageAlt: fields.imagealt || "",
    author,
    categories,
    content,
    featuredProducts,
  }

  const result = await sanity.createOrReplace(doc)
  console.log(`  done -> ${result._id}`)
}

async function run() {
  console.log("Fetching entries from Contentful (content_type: blog)...")
  const response = await contentful.getEntries({ content_type: "blog", limit: 1000 })

  const matched = response.items.filter((item) => TITLES_TO_MIGRATE.includes(item.fields.title))
  console.log(`Matched ${matched.length}/${TITLES_TO_MIGRATE.length} entries.`)

  const missing = TITLES_TO_MIGRATE.filter(
    (title) => !matched.some((item) => item.fields.title === title)
  )
  if (missing.length) {
    console.warn("Not found in Contentful:", missing)
  }

  for (const entry of matched) {
    await migrateEntry(entry)
  }

  console.log("\nAll done.")
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
