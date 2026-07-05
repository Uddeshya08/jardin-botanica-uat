import { defineField, defineType } from "sanity"

export const imageBlock = defineType({
  name: "imageBlock",
  title: "Image",
  type: "object",
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "alt", title: "Alt text", type: "string" }),
    defineField({ name: "caption", title: "Caption", type: "string" }),
    defineField({
      name: "fullBleed",
      title: "Full-bleed (edge to edge)",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: { media: "image", title: "caption" },
    prepare({ media, title }) {
      return { title: title || "Image", media }
    },
  },
})
