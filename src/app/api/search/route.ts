import { NextRequest, NextResponse } from "next/server"
import { searchProducts } from "@lib/data/search"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("q") || ""
    const countryCode = searchParams.get("countryCode") || "in"

    if (!query) {
      return NextResponse.json({
        products: [],
        suggestedTerms: [],
        categories: [],
        totalCount: 0,
      })
    }

    const results = await searchProducts({
      query,
      countryCode,
      limit: 12,
    })

    return NextResponse.json(results)
  } catch (error) {
    console.error("Search API error:", error)
    return NextResponse.json(
      {
        products: [],
        suggestedTerms: [],
        categories: [],
        totalCount: 0,
        error: "Search failed",
      },
      { status: 500 }
    )
  }
}


