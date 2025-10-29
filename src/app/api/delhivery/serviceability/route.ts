import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const pincode = searchParams.get("pincode")

  if (!pincode) {
    return NextResponse.json(
      { message: "Pincode is required" },
      { status: 400 }
    )
  }

  try {
    const BACKEND_URL = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
    const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
    
    console.log("Calling backend API:", `${BACKEND_URL}/store/custom/delhivery/serviceability?pincode=${pincode}`)
    
    // Prepare headers
    const headers: HeadersInit = {}
    if (PUBLISHABLE_KEY) {
      headers['x-publishable-api-key'] = PUBLISHABLE_KEY
    }
    
    const response = await fetch(
      `${BACKEND_URL}/store/custom/delhivery/serviceability?pincode=${pincode}`,
      {
        method: "GET",
        headers,
        cache: "no-store",
      }
    )

    console.log("Backend response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Delhivery API Error:", response.status, errorText)
      return NextResponse.json(
        { message: "Failed to check serviceability", error: errorText },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log("Successfully received data from backend")
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    console.error("Error checking Delhivery serviceability:", error)
    return NextResponse.json(
      { 
        message: "Internal server error", 
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

// Export as dynamic route to disable caching
export const dynamic = "force-dynamic"
export const revalidate = 0

