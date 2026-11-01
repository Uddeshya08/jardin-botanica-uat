import type { MetadataRoute } from "next"
import { getSEOBaseURL } from "@lib/util/env"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL("/sitemap.xml", getSEOBaseURL()).href,
  }
}
