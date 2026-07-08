import { defineArrayMember, defineField, defineType } from "sanity"

/**
 * Collapsible section: an editor-set label, and rich text revealed on click.
 * Renders full-width in the article, breaking out of the left/right zigzag.
 */
export const accordionBlock = defineType({
  name: "accordionBlock",
  title: "Accordion",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      description: "The clickable header text of the accordion",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      description: "Rich text shown when the accordion is expanded",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H3", value: "h3" },
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
      ],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "label" },
    prepare({ title }) {
      return { title: title || "Accordion" }
    },
  },
})
