import { listProductsByContentfulCategories } from "@lib/data/contentful"
import { getHomePageSanity, getLatestJournalWithCoverSanity, getPageSEOSanity } from "@lib/sanity"
import { buildMetadata } from "@lib/seo"
import Hero from "@modules/home/components/hero"
import type { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSEOSanity("home")
  return buildMetadata(seo, {
    title: "Jardin Botanica",
    description: "Discover Jardin Botanica's botanical candles, home fragrances, and body and hand care. Thoughtful essentials for everyday rituals and considered gifting.",
  })
}

export default async function Home(props: { params: Promise<{ countryCode: string }> }) {
  const params = await props.params
  const { countryCode } = params

  const [productResult, blogs, homeContent] = await Promise.all([
    listProductsByContentfulCategories({ countryCode, maxProducts: 6 }),
    getLatestJournalWithCoverSanity(3),
    getHomePageSanity(),
  ])

  return (
    <>
      <Hero products={productResult.products} blogs={blogs} countryCode={countryCode} content={homeContent} />
    </>
  )
}
