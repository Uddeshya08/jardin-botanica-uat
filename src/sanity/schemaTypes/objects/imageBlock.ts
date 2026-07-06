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
    defineField({
      name: "alignment",
      title: "Alignment",
      type: "string",
      description: "Center = full-width row. Left/Right = pairs with adjacent text in the zigzag.",
      options: {
        list: [
          { title: "Left", value: "left" },
          { title: "Center", value: "center" },
          { title: "Right", value: "right" },
        ],
        layout: "radio",
      },
      initialValue: "center",
    }),
  ],
  preview: {
    select: { media: "image", title: "caption" },
    prepare({ media, title }) {
      return { title: title || "Image", media }
    },
  },
})
