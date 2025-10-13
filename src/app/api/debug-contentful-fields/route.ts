import { NextResponse } from "next/server"
import { getContentfulClient } from "@lib/contentful"

export async function GET() {
  try {
    const client = getContentfulClient()

    // Fetch all entries
    const response = await client.getEntries({
      content_type: "productContent",
      limit: 10,
    })

    if (!response.items || response.items.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No entries found",
      })
    }

    // Show raw field data
    const debugData = response.items.map((entry: any) => ({
      id: entry.sys.id,
      contentType: entry.sys.contentType.sys.id,
      allFieldIds: Object.keys(entry.fields),
      rawFields: entry.fields,
      // Check different possible field names
      possibleHandleFields: {
        product_handle: entry.fields.product_handle || "NOT FOUND",
        productHandle: entry.fields.productHandle || "NOT FOUND",
        handle: entry.fields.handle || "NOT FOUND",
        Product_Handle: entry.fields.Product_Handle || "NOT FOUND",
      },
    }))

    return NextResponse.json({
      success: true,
      count: response.items.length,
      message: "Raw field data from Contentful",
      entries: debugData,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    )
  }
}

