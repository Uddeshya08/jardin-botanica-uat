import { ArrowUpRightMini } from "@medusajs/icons"
import { Text } from "@medusajs/ui"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "404",
  description: "Something went wrong",
}

export default function NotFound() {
  return (
    <div
      className="flex flex-col gap-6 items-center justify-center min-h-screen w-full"
      style={{ backgroundColor: "#e3e3d8" }}
    >
      <div className="flex flex-col items-center max-w-md text-center px-6 py-12 mx-4">
        <h1 className="text-6xl font-typewriter text-black mb-2 tracking-tighter opacity-90">
          404
        </h1>
        <div className="h-px w-16 bg-black/20 my-6"></div>
        <p className="text-base font-dinRegular text-black/80 tracking-wide uppercase mb-8">
          The specimen isn't in this drawer.
        </p>
        <Link
          href="/"
          className="bg-black text-white px-8 py-3 text-xs tracking-[0.2em] font-dinRegular hover:bg-black/80 transition-colors uppercase no-underline"
        >
          Return to Frontpage
        </Link>
      </div>
    </div>
  )
}

// import { HttpTypes } from "@medusajs/types"
// import { NextRequest, NextResponse } from "next/server"

// const BACKEND_URL = process.env.MEDUSA_BACKEND_URL
// const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
// const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "us"

// const regionMapCache = {
//   regionMap: new Map<string, HttpTypes.StoreRegion>(),
//   regionMapUpdated: Date.now(),
// }

// async function getRegionMap(cacheId: string) {
//   const { regionMap, regionMapUpdated } = regionMapCache

//   if (!BACKEND_URL) {
//     throw new Error(
//       "Middleware.ts: Error fetching regions. Did you set up regions in your Medusa Admin and define a MEDUSA_BACKEND_URL environment variable? Note that the variable is no longer named NEXT_PUBLIC_MEDUSA_BACKEND_URL."
//     )
//   }

//   if (
//     !regionMap.keys().next().value ||
//     regionMapUpdated < Date.now() - 3600 * 1000
//   ) {
//     // Fetch regions from Medusa. We can't use the JS client here because middleware is running on Edge and the client needs a Node environment.
//     const { regions } = await fetch(`${BACKEND_URL}/store/regions`, {
//       headers: {
//         "x-publishable-api-key": PUBLISHABLE_API_KEY!,
//       },
//       next: {
//         revalidate: 3600,
//         tags: [`regions-${cacheId}`],
//       },
//       cache: "force-cache",
//     }).then(async (response) => {
//       const json = await response.json()

//       if (!response.ok) {
//         throw new Error(json.message)
//       }

//       return json
//     })

//     if (!regions?.length) {
//       throw new Error(
//         "No regions found. Please set up regions in your Medusa Admin."
//       )
//     }

//     // Create a map of country codes to regions.
//     regions.forEach((region: HttpTypes.StoreRegion) => {
//       region.countries?.forEach((c) => {
//         regionMapCache.regionMap.set(c.iso_2 ?? "", region)
//       })
//     })

//     regionMapCache.regionMapUpdated = Date.now()
//   }

//   return regionMapCache.regionMap
// }

// /**
//  * Fetches regions from Medusa and sets the region cookie.
//  * @param request
//  * @param response
//  */
// async function getCountryCode(
//   request: NextRequest,
//   regionMap: Map<string, HttpTypes.StoreRegion | number>
// ) {
//   try {
//     let countryCode

//     const vercelCountryCode = request.headers
//       .get("x-vercel-ip-country")
//       ?.toLowerCase()

//     const urlCountryCode = request.nextUrl.pathname.split("/")[1]?.toLowerCase()

//     if (urlCountryCode && regionMap.has(urlCountryCode)) {
//       countryCode = urlCountryCode
//     } else if (vercelCountryCode && regionMap.has(vercelCountryCode)) {
//       countryCode = vercelCountryCode
//     } else if (regionMap.has(DEFAULT_REGION)) {
//       countryCode = DEFAULT_REGION
//     } else if (regionMap.keys().next().value) {
//       countryCode = regionMap.keys().next().value
//     }

//     return countryCode
//   } catch (error) {
//     if (process.env.NODE_ENV === "development") {
//       console.error(
//         "Middleware.ts: Error getting the country code. Did you set up regions in your Medusa Admin and define a MEDUSA_BACKEND_URL environment variable? Note that the variable is no longer named NEXT_PUBLIC_MEDUSA_BACKEND_URL."
//       )
//     }
//   }
// }

// /**
//  * Middleware to handle region selection and onboarding status.
//  */
// export async function middleware(request: NextRequest) {
//   let redirectUrl = request.nextUrl.href

//   let response = NextResponse.redirect(redirectUrl, 307)

//   let cacheIdCookie = request.cookies.get("_medusa_cache_id")

//   let cacheId = cacheIdCookie?.value || crypto.randomUUID()

//   const regionMap = await getRegionMap(cacheId)

//   const countryCode = regionMap && (await getCountryCode(request, regionMap))

//   const urlHasCountryCode =
//     countryCode && request.nextUrl.pathname.split("/")[1].includes(countryCode)

//   // if one of the country codes is in the url and the cache id is set, return next
//   if (urlHasCountryCode && cacheIdCookie) {
//     return NextResponse.next()
//   }

//   // if one of the country codes is in the url and the cache id is not set, set the cache id and redirect
//   if (urlHasCountryCode && !cacheIdCookie) {
//     response.cookies.set("_medusa_cache_id", cacheId, {
//       maxAge: 60 * 60 * 24,
//     })

//     return response
//   }

//   // check if the url is a static asset
//   if (request.nextUrl.pathname.includes(".")) {
//     return NextResponse.next()
//   }

//   const redirectPath =
//     request.nextUrl.pathname === "/" ? "" : request.nextUrl.pathname

//   const queryString = request.nextUrl.search ? request.nextUrl.search : ""

//   // If no country code is set, we redirect to the relevant region.
//   if (!urlHasCountryCode && countryCode) {
//     redirectUrl = `${request.nextUrl.origin}/${countryCode}${redirectPath}${queryString}`
//     response = NextResponse.redirect(`${redirectUrl}`, 307)
//   }

//   return response
// }

// export const config = {
//   matcher: [
//     "/((?!api|_next/static|_next/image|favicon.ico|images|assets|png|svg|jpg|jpeg|gif|webp).*)",
//   ],
// }
