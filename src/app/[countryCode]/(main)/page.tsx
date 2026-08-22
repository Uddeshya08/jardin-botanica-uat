import { listProductsByContentfulCategories } from "@lib/data/contentful"
import { getLatestJournalWithCoverSanity, getPageSEOSanity } from "@lib/sanity"
import { buildMetadata } from "@lib/seo"
import Hero from "@modules/home/components/hero"
import type { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSEOSanity("home")
  return buildMetadata(seo, {
    title: "Jardin Botanica",
    description: "Discover botanical skincare crafted with nature's finest ingredients.",
  })
}

export default async function Home(props: { params: Promise<{ countryCode: string }> }) {
  const params = await props.params
  const { countryCode } = params

  const { products } = await listProductsByContentfulCategories({
    countryCode,
    maxProducts: 6,
  })

  // Latest 3 journal entries with a cover image, merged across both Sanity
  // blog types. If any of the newest N have no cover, the next-newest that
  // does takes its place.
  const blogs = await getLatestJournalWithCoverSanity(3)

  return (
    <>
      <Hero products={products} blogs={blogs} countryCode={countryCode} />
    </>
  )
}
