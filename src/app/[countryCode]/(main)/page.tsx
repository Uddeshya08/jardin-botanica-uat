import { getAllBlogs, listProductsByContentfulCategories } from "@lib/data/contentful"
import { getPageSEOSanity } from "@lib/sanity"
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

  const blogs = await getAllBlogs(3, countryCode)

  return (
    <>
      <Hero products={products} blogs={blogs} countryCode={countryCode} />
    </>
  )
}
