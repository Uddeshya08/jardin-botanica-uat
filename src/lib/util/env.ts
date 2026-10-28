export const getBaseURL = () => {
  return process.env.NEXT_PUBLIC_BASE_URL || "https://localhost:8000"
}

// Public crawler URLs need a production fallback without changing existing app URLs.
export const getSEOBaseURL = () => {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://www.jardinbotanica.com"
}
