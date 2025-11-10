import { NextRequest, NextResponse } from "next/server"

const DEFAULT_MEDUSA_URL = "http://localhost:9000"

const getMedusaBaseUrl = () =>
  process.env.MEDUSA_BACKEND_URL || DEFAULT_MEDUSA_URL

const normalizeHeaders = (
  headersInit?: HeadersInit
): Record<string, string> => {
  if (!headersInit) {
    return {}
  }

  if (headersInit instanceof Headers) {
    return Object.fromEntries(headersInit.entries())
  }

  if (Array.isArray(headersInit)) {
    return Object.fromEntries(headersInit)
  }

  return headersInit
}

export const buildMedusaHeaders = (
  req: NextRequest,
  extraHeaders?: HeadersInit
): Headers => {
  const headers = new Headers({
    "Content-Type": "application/json",
  })

  const cookie = req.headers.get("cookie")
  if (cookie) {
    headers.set("cookie", cookie)
  }

  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
  if (publishableKey) {
    headers.set("x-publishable-api-key", publishableKey)
  }

  const normalized = normalizeHeaders(extraHeaders)
  Object.entries(normalized).forEach(([key, value]) => {
    if (typeof value === "string") {
      headers.set(key, value)
    }
  })

  return headers
}

export const parseJsonBody = async <T = unknown>(
  req: NextRequest
): Promise<{ parsed?: T; raw?: string }> => {
  if (req.method === "GET" || req.method === "HEAD") {
    return {}
  }

  const text = await req.text()
  if (!text) {
    return {}
  }

  try {
    const parsed = JSON.parse(text) as T
    return { parsed, raw: text }
  } catch (error) {
    throw new Error("Invalid JSON body")
  }
}

const forwardSetCookieHeaders = (
  from: Headers,
  to: Headers
): void => {
  const raw = (from as unknown as { raw?: () => Record<string, string[]> }).raw?.()
  const cookies = raw?.["set-cookie"]

  if (cookies && Array.isArray(cookies)) {
    cookies.forEach((cookie) => {
      to.append("set-cookie", cookie)
    })
  } else {
    const single = from.get("set-cookie")
    if (single) {
      to.append("set-cookie", single)
    }
  }
}

export const proxyMedusaRequest = async (
  req: NextRequest,
  path: string,
  init: RequestInit & { body?: string }
) => {
  try {
    const url = new URL(path, getMedusaBaseUrl())
    const headers = buildMedusaHeaders(req, init.headers)

    const medusaResponse = await fetch(url.toString(), {
      ...init,
      headers,
      body: init.body,
      cache: "no-store",
    })

    const responseBody = await medusaResponse.text()
    const responseHeaders = new Headers()
    const contentType = medusaResponse.headers.get("content-type")
    if (contentType) {
      responseHeaders.set("content-type", contentType)
    }

    forwardSetCookieHeaders(medusaResponse.headers, responseHeaders)

    return new NextResponse(responseBody, {
      status: medusaResponse.status,
      headers: responseHeaders,
    })
  } catch (error) {
    console.error("Medusa proxy error:", error)
    return NextResponse.json(
      { message: "Unexpected Medusa error" },
      { status: 500 }
    )
  }
}

