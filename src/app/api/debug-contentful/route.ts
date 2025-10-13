import { NextResponse } from "next/server"
import { getContentfulClient } from "@lib/contentful"

export async function GET() {
  const debugInfo: any = {
    timestamp: new Date().toISOString(),
    environment: {},
    connection: null,
    contentTypes: null,
    entries: null,
    errors: [],
  }

  // Check environment variables
  debugInfo.environment = {
    spaceId: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID
      ? "✅ Set (hidden for security)"
      : "❌ NOT SET",
    accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN
      ? "✅ Set (hidden for security)"
      : "❌ NOT SET",
    environment:
      process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || "master (default)",
  }

  // Test connection
  try {
    const client = getContentfulClient()
    debugInfo.connection = "✅ Client initialized successfully"

    // Try to fetch content types
    try {
      const contentTypes = await client.getContentTypes()
      debugInfo.contentTypes = {
        status: "✅ Successfully fetched content types",
        count: contentTypes.items.length,
        availableTypes: contentTypes.items.map((ct) => ({
          id: ct.sys.id,
          name: ct.name,
          fields: ct.fields.map((f) => ({
            id: f.id,
            name: f.name,
            type: f.type,
          })),
        })),
      }

      // Check if productContent exists
      const hasProductContent = contentTypes.items.some(
        (ct) => ct.sys.id === "productContent"
      )
      if (!hasProductContent) {
        debugInfo.errors.push(
          "⚠️ Content type 'productContent' not found in Contentful"
        )
      }
    } catch (error: any) {
      debugInfo.contentTypes = {
        status: "❌ Failed to fetch content types",
        error: error.message,
      }
      debugInfo.errors.push(`Content Types Error: ${error.message}`)
    }

    // Try to fetch all entries
    try {
      const allEntries = await client.getEntries({ limit: 10 })
      debugInfo.entries = {
        status: "✅ Successfully fetched entries",
        totalCount: allEntries.total,
        fetchedCount: allEntries.items.length,
        entries: allEntries.items.map((entry) => ({
          id: entry.sys.id,
          contentType: entry.sys.contentType.sys.id,
          fields: Object.keys(entry.fields),
          fieldValues: entry.fields,
        })),
      }

      // Check for productContent entries
      const productContentEntries = allEntries.items.filter(
        (entry) => entry.sys.contentType.sys.id === "productContent"
      )
      
      if (productContentEntries.length === 0) {
        debugInfo.errors.push(
          "⚠️ No entries found with content type 'productContent'"
        )
      } else {
        debugInfo.productContentEntries = {
          count: productContentEntries.length,
          handles: productContentEntries.map((entry: any) => ({
            id: entry.sys.id,
            product_handle: entry.fields.product_handle || "NOT SET",
            title: entry.fields.title || "NOT SET",
          })),
        }
      }
    } catch (error: any) {
      debugInfo.entries = {
        status: "❌ Failed to fetch entries",
        error: error.message,
      }
      debugInfo.errors.push(`Entries Error: ${error.message}`)
    }
  } catch (error: any) {
    debugInfo.connection = `❌ Failed to initialize client: ${error.message}`
    debugInfo.errors.push(`Connection Error: ${error.message}`)
  }

  return NextResponse.json(debugInfo, { status: 200 })
}

