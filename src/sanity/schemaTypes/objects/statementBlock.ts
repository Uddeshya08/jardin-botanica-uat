import { defineField, defineType } from "sanity"

/**
 * Full-width feature section: a single centered, bold statement. Breaks out of
 * the article's left/right zigzag for its row — this block always spans the
 * full width of the page.
 */
export const statementBlock = defineType({
  name: "statementBlock",
  title: "Statement Section",
  type: "object",
  fields: [
    defineField({
      name: "statement",
      title: "Statement",
      type: "text",
      rows: 2,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "statement" },
  },
})
