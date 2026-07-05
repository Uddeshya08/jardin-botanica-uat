import { defineField, defineType } from "sanity"

/**
 * Full-width feature section: small top-left image, centered bold statement,
 * small bottom-right image. Breaks out of the article's left/right zigzag
 * for its row — this block always spans the full width.
 */
export const statementBlock = defineType({
  name: "statementBlock",
  title: "Statement Section",
  type: "object",
  fields: [
    defineField({
      name: "topImage",
      title: "Top image (left-aligned)",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "statement",
      title: "Statement",
      type: "text",
      rows: 2,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "bottomImage",
      title: "Bottom image (right-aligned)",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "statement", media: "topImage" },
  },
})
