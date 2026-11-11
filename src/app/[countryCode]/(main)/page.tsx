import { listProductsByContentfulCategories } from "@lib/data/contentful"
import { getHomePageSanity, getLatestJournalWithCoverSanity, getPageSEOSanity } from "@lib/sanity"
import { buildMetadata } from "@lib/seo"
import { getSEOBaseURL } from "@lib/util/env"
import { getHeroMedia } from "@lib/util/hero-media"
import Hero from "@modules/home/components/hero"
import type { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  const [seo, homeContent] = await Promise.all([
    getPageSEOSanity("home"),
    getHomePageSanity(),
  ])
  const firstBanner = homeContent?.heroSlides?.[0]
  const bannerImage = getHeroMedia(firstBanner?.videoUrl, firstBanner?.image?.url).imageUrl
    || "/assets/welcome-banner-poster.webp"
  const image = new URL(bannerImage, getSEOBaseURL()).toString()
  const metadata = buildMetadata(seo, {
    title: "Jardin Botanica",
    description: "Discover Jardin Botanica's botanical candles, home fragrances, and body and hand care. Thoughtful essentials for everyday rituals and considered gifting.",
  })

  // The homepage preview follows banner 1, including its poster for video banners.
  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      images: [{ url: image, alt: firstBanner?.image?.alt || "Jardin Botanica" }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo?.metaTitle || "Jardin Botanica",
      description: seo?.metaDescription || metadata.description || undefined,
      images: [image],
    },
  }
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
