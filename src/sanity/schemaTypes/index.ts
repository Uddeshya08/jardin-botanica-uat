import type { SchemaTypeDefinition } from "sanity"
import { blog } from "./documents/blog"
import { pageSeo } from "./documents/pageSeo"
import { author } from "./objects/author"
import { ctaBlock } from "./objects/ctaBlock"
import { imageBlock } from "./objects/imageBlock"
import { imageGalleryBlock } from "./objects/imageGalleryBlock"
import { quoteBlock } from "./objects/quoteBlock"
import { statementBlock } from "./objects/statementBlock"

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blog, pageSeo, author, imageBlock, imageGalleryBlock, ctaBlock, quoteBlock, statementBlock],
}
