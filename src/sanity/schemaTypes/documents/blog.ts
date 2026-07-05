import { defineArrayMember, defineField, defineType } from "sanity"

export const blog = defineType({
  name: "blog",
  title: "Blog",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description: "Shown as the hero subtitle and used as a fallback SEO description",
    }),
    defineField({
      name: "publishedDate",
      title: "Published date",
      type: "datetime",
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "author",
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      description: "Stack text and image blocks in any order — this is what Contentful couldn't do",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  defineField({
                    name: "href",
                    title: "URL",
                    type: "url",
                    validation: (Rule) =>
                      Rule.uri({ scheme: ["http", "https", "mailto", "tel"] }),
                  }),
                ],
              },
            ],
          },
        }),
        defineArrayMember({ type: "imageBlock" }),
        defineArrayMember({ type: "imageGalleryBlock" }),
        defineArrayMember({ type: "ctaBlock" }),
        defineArrayMember({ type: "quoteBlock" }),
        defineArrayMember({ type: "statementBlock" }),
      ],
    }),
  ],
  preview: {
    select: { title: "title", media: "coverImage", subtitle: "publishedDate" },
  },
})
