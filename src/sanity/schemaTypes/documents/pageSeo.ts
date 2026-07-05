import { defineField, defineType } from "sanity"

export const pageSeo = defineType({
  name: "pageSeo",
  title: "Page SEO",
  type: "document",
  fields: [
    defineField({
      name: "pageSlug",
      title: "Page slug",
      type: "string",
      description: "Matches the key passed to getPageSEO, e.g. 'blog-my-post-slug' or 'homepage'",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "pageType",
      title: "Page type",
      type: "string",
      options: {
        list: ["homepage", "product", "blog", "page"],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "metaTitle",
      title: "Meta title",
      type: "string",
    }),
    defineField({
      name: "metaDescription",
      title: "Meta description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "keywords",
      title: "Keywords",
      type: "string",
    }),
    defineField({
      name: "shareImage",
      title: "Share image",
      type: "image",
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: { title: "pageSlug", subtitle: "pageType" },
  },
})
