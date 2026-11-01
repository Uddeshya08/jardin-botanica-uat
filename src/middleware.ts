import type { HttpTypes } from "@medusajs/types"
import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.MEDUSA_BACKEND_URL
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "us"

const regionMapCache = {
  regionMap: new Map<string, HttpTypes.StoreRegion>(),
  regionMapUpdated: Date.now(),
}

async function getRegionMap(cacheId: string) {
  const { regionMap, regionMapUpdated } = regionMapCache

  if (!BACKEND_URL) {
    throw new Error(
      "Middleware.ts: Error fetching regions. Did you set up regions in your Medusa Admin and define a MEDUSA_BACKEND_URL environment variable? Note that the variable is no longer named NEXT_PUBLIC_MEDUSA_BACKEND_URL."
    )
  }

  if (!regionMap.keys().next().value || regionMapUpdated < Date.now() - 3600 * 1000) {
    // Fetch regions from Medusa. We can't use the JS client here because middleware is running on Edge and the client needs a Node environment.
    const { regions } = await fetch(`${BACKEND_URL}/store/regions`, {
      headers: {
        "x-publishable-api-key": PUBLISHABLE_API_KEY!,
      },
      next: {
        revalidate: 3600,
        tags: [`regions-${cacheId}`],
      },
      cache: "force-cache",
    }).then(async (response) => {
      const json = await response.json()

      if (!response.ok) {
        throw new Error(json.message)
      }

      return json
    })

    if (!regions?.length) {
      throw new Error("No regions found. Please set up regions in your Medusa Admin.")
    }

    // Create a map of country codes to regions.
    regions.forEach((region: HttpTypes.StoreRegion) => {
      region.countries?.forEach((c) => {
        regionMapCache.regionMap.set(c.iso_2 ?? "", region)
      })
    })

    regionMapCache.regionMapUpdated = Date.now()
  }

  return regionMapCache.regionMap
}

/**
 * Fetches regions from Medusa and sets the region cookie.
 * @param request
 * @param response
 */
async function getCountryCode(
  request: NextRequest,
  regionMap: Map<string, HttpTypes.StoreRegion | number>
) {
  try {
    let countryCode

    const vercelCountryCode = request.headers.get("x-vercel-ip-country")?.toLowerCase()

    const urlCountryCode = request.nextUrl.pathname.split("/")[1]?.toLowerCase()

    if (urlCountryCode && regionMap.has(urlCountryCode)) {
      countryCode = urlCountryCode
    } else if (vercelCountryCode && regionMap.has(vercelCountryCode)) {
      countryCode = vercelCountryCode
    } else if (regionMap.has(DEFAULT_REGION)) {
      countryCode = DEFAULT_REGION
    } else if (regionMap.keys().next().value) {
      countryCode = regionMap.keys().next().value
    }

    return countryCode
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(
        "Middleware.ts: Error getting the country code. Did you set up regions in your Medusa Admin and define a MEDUSA_BACKEND_URL environment variable? Note that the variable is no longer named NEXT_PUBLIC_MEDUSA_BACKEND_URL."
      )
    }
  }
}

/**
 * Middleware to handle region selection and onboarding status.
 */
export async function middleware(request: NextRequest) {
  let redirectUrl = request.nextUrl.href

  let response = NextResponse.next()
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-current-path", `${request.nextUrl.pathname}${request.nextUrl.search}`)

  const cacheIdCookie = request.cookies.get("_medusa_cache_id")

  const cacheId = cacheIdCookie?.value || crypto.randomUUID()

  let regionMap: Map<string, HttpTypes.StoreRegion>

  try {
    regionMap = await getRegionMap(cacheId)
  } catch (error) {
    if (process.env.NODE_ENV !== "development") {
      throw error
    }

    console.warn("Middleware.ts: Medusa regions unavailable; using URL country in development.")

    const urlCountryCode = request.nextUrl.pathname.split("/")[1]?.toLowerCase()
    if (/^[a-z]{2}$/.test(urlCountryCode || "")) {
      const fallbackResponse = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })

      if (!cacheIdCookie) {
        fallbackResponse.cookies.set("_medusa_cache_id", cacheId, {
          maxAge: 60 * 60 * 24,
        })
      }

      return fallbackResponse
    }

    const redirectPath = request.nextUrl.pathname === "/" ? "" : request.nextUrl.pathname
    const queryString = request.nextUrl.search || ""
    return NextResponse.redirect(
      `${request.nextUrl.origin}/${DEFAULT_REGION}${redirectPath}${queryString}`,
      307
    )
  }

  const countryCode = regionMap && (await getCountryCode(request, regionMap))

  const urlHasCountryCode =
    countryCode && request.nextUrl.pathname.split("/")[1].toLowerCase() === countryCode

  // Country URLs must render even when crawlers or visitors do not retain cookies.
  if (urlHasCountryCode) {
    if (!cacheIdCookie) {
      // Server components need the new cache ID on this first request too.
      // Previously they received it only after the cookie-setting redirect.
      const existingCookies = requestHeaders.get("cookie")
      requestHeaders.set("cookie", [existingCookies, `_medusa_cache_id=${cacheId}`].filter(Boolean).join("; "))
    }
    response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
    if (!cacheIdCookie) {
      response.cookies.set("_medusa_cache_id", cacheId, {
        maxAge: 60 * 60 * 24,
      })
    }

    return response
  }

  // check if the url is a static asset
  if (request.nextUrl.pathname.includes(".")) {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  const redirectPath = request.nextUrl.pathname === "/" ? "" : request.nextUrl.pathname

  const queryString = request.nextUrl.search ? request.nextUrl.search : ""

  // If no country code is set, we redirect to the relevant region.
  if (!urlHasCountryCode && countryCode) {
    redirectUrl = `${request.nextUrl.origin}/${countryCode}${redirectPath}${queryString}`
    response = NextResponse.redirect(`${redirectUrl}`, 307)
  }

  return response
}

export const config = {
  matcher: [
    "/((?!robots\\.txt$|sitemap\\.xml$|api|studio|_next/static|_next/image|favicon.ico|images|assets|png|svg|jpg|jpeg|gif|webp).*)",
  ],
}
