import { permanentRedirect } from "next/navigation"

export default async function LegacyBlogsPage({ params }: { params: Promise<{ countryCode: string }> }) {
  const { countryCode } = await params
  permanentRedirect(`/${countryCode}/journal`)
}
