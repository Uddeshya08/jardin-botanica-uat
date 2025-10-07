// app/components/Afterlife.tsx
import React from "react"
import { motion } from "motion/react"
import { Recycle, RefreshCw, Leaf } from "lucide-react"
// If you have Medusa types available:
import type { HttpTypes } from "@medusajs/types"

type AfterlifeItem = {
  icon?: "recycle" | "refresh" | "leaf"
  title: string
  text: string
}

type AfterlifeContent = {
  heading?: string
  bg?: string            // hex or rgb(a)
  items?: AfterlifeItem[]
}

type ProductLike = {
  title?: string
  handle?: string
  metadata?: Record<string, any>
} & Partial<HttpTypes.Product>

/**
 * Safely read and normalize afterlife content from product.metadata.
 * Supports:
 * - metadata.afterlife as object
 * - metadata.afterlife as JSON string
 * Falls back to defaults when not present or invalid.
 */
function safeParseOnce(v: any) {
  if (typeof v !== "string") return v
  try { return JSON.parse(v) } catch { return v }
}
function safeParseTwice(v: any) {
  const once = safeParseOnce(v)
  return typeof once === "string" ? safeParseOnce(once) : once
}
function getAfterlifeContent(product?: ProductLike): AfterlifeContent {
  const defaults: AfterlifeContent = {
    heading: "Afterli",
    bg: "#EBEBE1",
    // items: [
    //   { icon: "recycle", title: "Glass Vessels", text: "Our amber glass bottles are designed for recycling and reuse — they can be rinsed, refilled, or even reimagined as planters." },
    //   { icon: "refresh", title: "Pump Systems", text: "Pumps are a mix of metal and plastic. We encourage reusing them across bottles until their natural end." },
    //   { icon: "leaf",    title: "Mindful End",   text: "When the pump no longer functions, please discard thoughtfully. Every choice matters to the gardens we're preserving." }
    // ],
  }

  if (!product?.metadata) return defaults

  // accept either metadata.afterlife OR metadata.sections.afterlife
  const raw = product.metadata.afterlife ?? product.metadata.sections?.afterlife
  if (!raw) return defaults
  // console.log("raw => ", raw)
  // handle: object | JSON string | "JSON string inside a JSON string"
  const parsed: any = safeParseTwice(raw)
  if (!parsed || typeof parsed !== "object") return defaults

  const itemsSrc = Array.isArray(parsed.items) ? parsed.items : []
  const items = itemsSrc.length
    ? itemsSrc.map((it: any): AfterlifeItem => ({
        icon: it?.icon === "recycle" || it?.icon === "refresh" || it?.icon === "leaf" ? it.icon : undefined,
        title: typeof it?.title === "string" ? it.title : "",
        text: typeof it?.text === "string" ? it.text : "",
      }))
    : defaults.items

  return {
    heading: typeof parsed.heading === "string" ? parsed.heading : defaults.heading,
    bg: typeof parsed.bg === "string" ? parsed.bg : defaults.bg,
    items,
  }
}
const iconMap = {
  recycle: Recycle,
  refresh: RefreshCw,
  leaf: Leaf,
}

export function Afterlife({ product }: { product?: ProductLike }) {
  const content = getAfterlifeContent(product)
  const { heading, bg, items = [] } = content
//  console.log("heading = ", heading)
  return (
    <section className="py-16 lg:py-20" style={{ backgroundColor: bg ?? "#EBEBE1" }}>
      <div className="container mx-auto px-8 lg:px-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="font-american-typewriter text-3xl tracking-tight text-black leading-tight"
            >
              {heading || "Afterlife"}
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-24 lg:gap-32">
            {items.map((item, idx) => {
              const Icon =
                item.icon && iconMap[item.icon] ? iconMap[item.icon] : iconMap.leaf
              return (
                <motion.div
                  key={`${item.title}-${idx}`}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * (idx + 1) }}
                  viewport={{ once: true }}
                  className={`space-y-3 ${idx === 0 ? "lg:-ml-4" : idx === 2 ? "lg:ml-4" : ""}`}
                >
                  <div className="flex items-center space-x-2 mb-3">
                    <div
                      className="p-2 rounded-full group/icon"
                      style={{ backgroundColor: "rgba(162, 139, 111, 0.08)" }}
                    >
                      <Icon
                        className="w-4 h-4 transition-transform duration-300 group-hover/icon:rotate-180"
                        style={{ color: "#a28b6f" }}
                      />
                    </div>
                    <h3 className="font-din-arabic text-base text-black/60 tracking-wide">
                      {item.title}
                    </h3>
                  </div>
                  <p className="font-din-arabic text-sm text-black/55 leading-relaxed">
                    {item.text}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
