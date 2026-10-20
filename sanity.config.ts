"use client"

import { visionTool } from "@sanity/vision"
import { defineConfig } from "sanity"
import { structureTool } from "sanity/structure"
import { apiVersion, dataset, projectId } from "./src/sanity/env"
import { schema } from "./src/sanity/schemaTypes"

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Homepage")
              .id("homePage")
              .child(S.document().schemaType("homePage").documentId("homePage")),
            ...S.documentTypeListItems().filter((item) => item.getId() !== "homePage"),
          ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
})
