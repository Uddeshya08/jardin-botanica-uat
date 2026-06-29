import { buildMetadata } from "@lib/seo"
import { getPageSEO } from "@lib/strapi"
import type { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"
import type { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSEO("store")
  return buildMetadata(seo, {
    title: "Store | Jardin Botanica",
    description: "Explore all of our products.",
  })
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
  params: Promise<{
    countryCode: string
  }>
}

export default async function StorePage(props: Params) {
  const params = await props.params
  const searchParams = await props.searchParams
  const { sortBy, page } = searchParams

  return <StoreTemplate sortBy={sortBy} page={page} countryCode={params.countryCode} />
}
