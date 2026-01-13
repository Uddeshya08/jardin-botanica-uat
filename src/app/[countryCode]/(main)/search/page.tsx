import { getRegion } from "@lib/data/regions"
import { searchProducts } from "@lib/data/search"
import { notFound } from "next/navigation"
import SearchResults from "./search-results"

type Props = {
  params: Promise<{
    countryCode: string
  }>
  searchParams: Promise<{
    q?: string
  }>
}

export default async function SearchPage(props: Props) {
  const params = await props.params
  const searchParams = await props.searchParams
  const query = searchParams.q || ""

  const region = await getRegion(params.countryCode)

  if (!region) {
    notFound()
  }

  const searchResults = await searchProducts({
    query,
    countryCode: params.countryCode,
    limit: 12,
  })

  return (
    <SearchResults
      query={query}
      searchResults={searchResults}
      region={region}
      countryCode={params.countryCode}
    />
  )
}
