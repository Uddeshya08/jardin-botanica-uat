import { defineArrayMember, defineField, defineType } from "sanity"

/**
 * Blog Template 1 — the classic single-column journal article (migrated off
 * Contentful). Rich text with inline images, a cover image, author byline, and
 * a "From the Botanist's Shelf" featured-products row resolved from Medusa.
 * Rendered by SingleBlogTemplate at /[countryCode]/blogs/[id].
 */
export const blogTemplate1 = defineType({
  name: "blogTemplate1",
  title: "Blog Template 1",
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
      description: "Short summary — used for share text and SEO fallback",
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
      name: "imageAlt",
      title: "Cover image alt text",
      type: "string",
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "author",
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      description: "Article body — text paragraphs interleaved with inline images",
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
      ],
    }),
    defineField({
      name: "featuredProducts",
      title: "Featured products",
      type: "array",
      description:
        'Shown as "From the Botanist\'s Shelf". Enter product handles only (e.g. soft-orris), not full URLs.',
      of: [defineArrayMember({ type: "string" })],
    }),
  ],
  preview: {
    select: { title: "title", media: "coverImage", subtitle: "publishedDate" },
  },
})
