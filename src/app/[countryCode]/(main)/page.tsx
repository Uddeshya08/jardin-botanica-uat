import { listProductsByContentfulCategories } from "@lib/data/contentful"
import Hero from "@modules/home/components/hero"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Medusa Next.js Starter Template",
  description: "A performant frontend ecommerce starter template with Next.js 15 and Medusa.",
}

export default async function Home(props: { params: Promise<{ countryCode: string }> }) {
  const params = await props.params
  const { countryCode } = params

  // Fetch products from Contentful categories (only categories with productHandles.length > 0)
  const { products } = await listProductsByContentfulCategories({
    countryCode,
    maxProducts: 6,
  })

  return (
    <>
      <Hero products={products} countryCode={countryCode} />
    </>
  )
}
