import { createClient } from "next-sanity"
import { apiVersion, dataset, projectId } from "../env"

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // CDN is fast but serves cached responses — off in dev so Studio edits show
  // immediately, on in prod for performance.
  useCdn: process.env.NODE_ENV === "production",
})
