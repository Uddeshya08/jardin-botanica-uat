import type { SchemaTypeDefinition } from "sanity"
import { blog } from "./documents/blog"
import { blogTemplate1 } from "./documents/blogTemplate1"
import { pageSeo } from "./documents/pageSeo"
import { accordionBlock } from "./objects/accordionBlock"
import { author } from "./objects/author"
import { ctaBlock } from "./objects/ctaBlock"
import { imageBlock } from "./objects/imageBlock"
import { imageGalleryBlock } from "./objects/imageGalleryBlock"
import { quoteBlock } from "./objects/quoteBlock"
import { statementBlock } from "./objects/statementBlock"

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blogTemplate1,
    pageSeo,
    blog,
    author,
    imageBlock,
    imageGalleryBlock,
    ctaBlock,
    quoteBlock,
    statementBlock,
    accordionBlock,
  ],
}
