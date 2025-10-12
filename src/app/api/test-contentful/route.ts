import { NextResponse } from "next/server"
import { getProductContentByHandle, getAllProductContent } from "@lib/data/contentful"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const handle = searchParams.get("handle")

  try {
    if (handle) {
      // Test fetching by handle
      const productContent = await getProductContentByHandle(handle)
      
      return NextResponse.json({
        success: productContent !== null,
        handle,
        data: productContent,
        message: productContent
          ? "✅ Successfully fetched product content"
          : `❌ No product content found for handle: ${handle}`,
      })
    } else {
      // Test fetching all
      const allContent = await getAllProductContent()
      
      return NextResponse.json({
        success: allContent.length > 0,
        count: allContent.length,
        data: allContent,
        message:
          allContent.length > 0
            ? `✅ Successfully fetched ${allContent.length} product content entries`
            : "❌ No product content entries found",
        availableHandles: allContent.map((c) => c.productHandle),
      })
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        message: `❌ Error: ${error.message}`,
      },
      { status: 500 }
    )
  }
}

