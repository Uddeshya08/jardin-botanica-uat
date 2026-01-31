import { listProducts } from "@lib/data/products"
import Hero from "@modules/home/components/hero"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Medusa Next.js Starter Template",
  description: "A performant frontend ecommerce starter template with Next.js 15 and Medusa.",
}

export default async function Home(props: { params: Promise<{ countryCode: string }> }) {
  const params = await props.params
  const { countryCode } = params

  // Fetch products for the carousel
  const {
    response: { products },
  } = await listProducts({
    countryCode,
    queryParams: {
      limit: 10,
    },
  })

  // Filter for specific products if needed, otherwise pass all
  // For now, passing all fetched products to be filtered/mapped by the carousel

  return (
    <>
      <Hero products={products} countryCode={countryCode} />
    </>
  )
}
