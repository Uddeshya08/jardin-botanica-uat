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
      name: "isFeatured",
      title: "Featured on journal page",
      type: "boolean",
      description: "Toggle on to include this article in the Featured section on /blogs. Off = shows only in Recent Entries.",
      initialValue: false,
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
      name: "category",
      title: "Category",
      type: "string",
      description: "Section the article belongs to on /blogs. Drives the tab filter under the journal header.",
      options: {
        list: [
          { title: "Rituals", value: "Rituals" },
          { title: "Dispatches", value: "Dispatches" },
          { title: "Field Notes", value: "Field Notes" },
          { title: "Archive", value: "Archive" },
          { title: "Spaces", value: "Spaces" },
        ],
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required(),
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
            { title: "Quote", value: "quote" },
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
