import { defineField, defineType } from "sanity"

export const ctaBlock = defineType({
  name: "ctaBlock",
  title: "Call to Action",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Title",
      type: "string",
      description: "Short CTA phrase, e.g. \"Shop Soft Orris Hand Veil\" — not marketing copy",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "string",
      description: "Full path, e.g. /in/products/soft-orris — not just the bare handle. Featured image is pulled automatically from this product.",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "url" },
  },
})
