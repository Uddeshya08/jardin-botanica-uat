import { defineField, defineType } from "sanity"

export const quoteBlock = defineType({
  name: "quoteBlock",
  title: "Pull Quote",
  type: "object",
  fields: [
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "attribution", title: "Attribution", type: "string" }),
  ],
  preview: {
    select: { title: "quote", subtitle: "attribution" },
  },
})
