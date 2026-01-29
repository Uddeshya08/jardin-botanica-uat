import { BodyHandsPage } from "app/components/BodyHandsPage"
import { getCategoryByHandle } from "@lib/data/categories"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { notFound } from "next/navigation"

type Props = {
  params: Promise<{ countryCode: string }>
}

export default async function BodyHandsRoutePage(props: Props) {
  const params = await props.params
  const { countryCode } = params

  const region = await getRegion(countryCode)

  if (!region) {
    notFound()
  }

  // Fetch the category
  const category = await getCategoryByHandle(["body-hands"])

  // Fetch products for the category
  const { response: { products } } = await listProducts({
    countryCode,
    queryParams: {
      category_id: category ? [category.id] : [],
      limit: 100,
    } as any
  })

  // If category is not found, products might be empty which is fine, 
  // or we might want to show all products if that's the intended fallback.
  // For now, assuming if category exists we filter by it.

  return (
    <BodyHandsPage storeProducts={products} />
  )
}
