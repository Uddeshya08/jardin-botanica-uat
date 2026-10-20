import { defineArrayMember, defineField, defineType } from "sanity"

const imageField = defineField({
  name: "image",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  fields: [defineField({ name: "alt", title: "Alternative text", type: "string" })],
})

const editorialFields = [
  defineField({ name: "heading", title: "Heading", type: "string" }),
  defineField({ name: "description", title: "Description", type: "text", rows: 4 }),
  imageField,
  defineField({ name: "ctaLabel", title: "Button label", type: "string" }),
]

export const homePage = defineType({
  name: "homePage",
  title: "Homepage",
  type: "document",
  initialValue: {
    philosophy: {
      eyebrow: "Design Philosophy",
      heading: "From Kyoto\u2019s Moss Gardens to Kew\u2019s Glasshouses",
      description:
        "We study living collections and translate them into disciplined blends built on measured actives and climate-smart bases. Design carries it home through the weight of the vessel, the rhythm of use, and the soft afterfeel, turning daily gestures into deliberate pleasure.",
      ctaLabel: "Explore more",
      ctaLink: "/the-lab",
    },
    products: { heading: "From the Botanist\u2019s Lab\u2122" },
    ritual: {
      heading: "The Botanist's Hand Ritual",
      description:
        "Clean that isn't squeaky; softness that isn't sticky.\nA considered approach to hand care that brings together gentle exfoliation and lightweight nourishment in one everyday ritual.",
      ctaLabel: "Get Early Access",
      emailPlaceholder: "Enter your email",
      submitLabel: "Submit",
    },
    gifting: {
      heading: "Bespoke Botanical Set",
      description:
        "For rooms, tables, welcome moments, and gestures that call for something more considered, we compose tailored selections from the Jardin Botanica world. From hand care and candles to home fragrance objects and finishing details, each set is arranged with use, atmosphere, and presentation in mind.",
      secondaryText:
        "Our specialists design solutions aligned with your brand, your ideas, and the moments you want to elevate.",
      ctaLabel: "Begin consultation",
      contactEmail: "hello@jardinbotanica.com",
      emailSubject: "Business Enquiry",
    },
    journal: { heading: "From the Journal", ctaLabel: "View all" },
    newsletter: {
      heading: "Join the Circle",
      description:
        "Be the first to discover new blends, exclusive rituals, and stories from our botanical laboratory.",
      emailPlaceholder: "Enter your email",
      submitLabel: "Subscribe",
    },
  },
  groups: [
    { name: "banner", title: "Banner", default: true },
    { name: "philosophy", title: "Design philosophy" },
    { name: "products", title: "Products" },
    { name: "ritual", title: "Hand ritual" },
    { name: "gifting", title: "Gifting" },
    { name: "journal", title: "Journal" },
    { name: "newsletter", title: "Newsletter" },
  ],
  fields: [
    defineField({
      name: "heroSlides",
      title: "Banner slides",
      description:
        "Drag to reorder. Leave empty to keep the current four banners. An uploaded video plays over its image; the image is used if playback fails.",
      type: "array",
      group: "banner",
      of: [
        defineArrayMember({
          name: "heroSlide",
          title: "Slide",
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Navigation tab",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "headline",
              title: "Headline",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
            imageField,
            defineField({
              name: "video",
              title: "Background video (optional)",
              type: "file",
              options: { accept: "video/*" },
            }),
            defineField({
              name: "videoUrl",
              title: "Existing video URL (optional)",
              description:
                "Used when no video file is uploaded. A site path such as /assets/video-banner.mp4 is allowed.",
              type: "string",
            }),
            defineField({ name: "ctaLabel", title: "Button label", type: "string" }),
            defineField({
              name: "ctaAction",
              title: "Button action",
              type: "string",
              options: {
                list: [
                  { title: "Open page", value: "link" },
                  { title: "Open email signup", value: "newsletter" },
                ],
                layout: "radio",
              },
              initialValue: "link",
            }),
            defineField({
              name: "ctaLink",
              title: "Internal page path",
              description: "For example /candles. Required when button action is Open page.",
              type: "string",
              hidden: ({ parent }) => parent?.ctaAction === "newsletter",
              validation: (Rule) =>
                Rule.custom((value, context) => {
                  const parent = context.parent as
                    | { ctaAction?: string; ctaLabel?: string }
                    | undefined
                  if (parent?.ctaAction === "newsletter" || !parent?.ctaLabel) return true
                  return typeof value === "string" && /^\/(?!\/)[^\s]*$/.test(value)
                    ? true
                    : "Enter an internal path starting with /"
                }),
            }),
          ],
          preview: { select: { title: "title", subtitle: "headline", media: "image" } },
        }),
      ],
    }),
    defineField({
      name: "philosophy",
      title: "Design philosophy",
      type: "object",
      group: "philosophy",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        ...editorialFields,
        defineField({ name: "ctaLink", title: "Internal page path", type: "string" }),
      ],
    }),
    defineField({
      name: "products",
      title: "Product carousel",
      type: "object",
      group: "products",
      description: "Products and prices remain managed in Medusa and Contentful.",
      fields: [defineField({ name: "heading", title: "Heading", type: "string" })],
    }),
    defineField({
      name: "ritual",
      title: "Hand ritual",
      type: "object",
      group: "ritual",
      fields: [
        ...editorialFields,
        defineField({ name: "emailPlaceholder", title: "Email placeholder", type: "string" }),
        defineField({ name: "submitLabel", title: "Submit label", type: "string" }),
      ],
    }),
    defineField({
      name: "gifting",
      title: "Bespoke gifting",
      type: "object",
      group: "gifting",
      fields: [
        ...editorialFields,
        defineField({ name: "secondaryText", title: "Second paragraph", type: "text", rows: 3 }),
        defineField({
          name: "contactEmail",
          title: "Consultation email",
          type: "string",
          validation: (Rule) => Rule.email(),
        }),
        defineField({ name: "emailSubject", title: "Consultation email subject", type: "string" }),
      ],
    }),
    defineField({
      name: "journal",
      title: "Journal",
      type: "object",
      group: "journal",
      description: "Article cards are populated from published Sanity blog posts.",
      fields: [
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({ name: "ctaLabel", title: "Button label", type: "string" }),
      ],
    }),
    defineField({
      name: "newsletter",
      title: "Newsletter",
      type: "object",
      group: "newsletter",
      fields: [
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
        defineField({ name: "emailPlaceholder", title: "Email placeholder", type: "string" }),
        defineField({ name: "submitLabel", title: "Submit label", type: "string" }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Homepage" }) },
})
