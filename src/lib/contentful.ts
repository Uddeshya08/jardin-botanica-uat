import { type ContentfulClientApi, createClient, Entry } from "contentful"

let contentfulClient: ContentfulClientApi<undefined> | null = null

/**
 * Initialize Contentful client with credentials from environment variables
 */
export function getContentfulClient(): ContentfulClientApi<undefined> {
  if (contentfulClient) {
    return contentfulClient
  }

  const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID
  const accessToken = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN
  const environment = process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || "master"

  if (!spaceId || !accessToken) {
    throw new Error(
      "Contentful credentials are missing. Please set NEXT_PUBLIC_CONTENTFUL_SPACE_ID and NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN in your environment variables."
    )
  }

  contentfulClient = createClient({
    space: spaceId,
    accessToken: accessToken,
    environment: environment,
  })

  return contentfulClient
}
