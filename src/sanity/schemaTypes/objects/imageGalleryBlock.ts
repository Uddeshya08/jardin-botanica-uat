import { defineArrayMember, defineField, defineType } from "sanity"

export const imageGalleryBlock = defineType({
  name: "imageGalleryBlock",
  title: "Image Gallery",
  type: "object",
  fields: [
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [defineArrayMember({ type: "image", options: { hotspot: true } })],
      validation: (Rule) => Rule.min(2),
    }),
    defineField({ name: "caption", title: "Caption", type: "string" }),
  ],
  preview: {
    select: { media: "images.0", count: "images" },
    prepare({ media, count }) {
      return { title: `Gallery (${count?.length || 0} images)`, media }
    },
  },
})
