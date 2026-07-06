import { getProductByHandle } from "@lib/data/products"
import { getProductPrice } from "@lib/util/get-product-price"
import { getBlogBySlugSanity, getLatestBlogCardsSanity, getPageSEOSanity } from "@lib/sanity"
import { buildMetadata } from "@lib/seo"
import { SingleBlogTemplate2 } from "app/components/SingleBlogTemplate2"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { SanityBlog, SanityFeaturedProduct } from "types/sanity-blog"

async function withCtaProductImages(blog: SanityBlog, countryCode: string): Promise<SanityBlog> {
  const content = await Promise.all(
    blog.content.map(async (block) => {
      if (block._type !== "ctaBlock") return block
      const handle = block.url.split("/products/")[1]?.split(/[/?#]/)[0]
      if (!handle) return block
      const product = await getProductByHandle({ handle, countryCode }).catch(() => null)
      return { ...block, productImage: product?.thumbnail ?? null }
    })
  )
  return { ...blog, content }
}

async function resolveFeaturedProducts(
  handles: string[] | undefined,
  countryCode: string
): Promise<SanityFeaturedProduct[]> {
  if (!handles?.length) return []
  const products = await Promise.all(
    handles.slice(0, 3).map(async (handle) => {
      const product = await getProductByHandle({ handle, countryCode }).catch(() => null)
      if (!product) return null
      const { cheapestPrice } = getProductPrice({ product })
      return {
        handle,
        title: product.title ?? handle,
        image: product.thumbnail ?? null,
        price: cheapestPrice?.calculated_price ?? null,
      }
    })
  )
  return products.filter((p): p is SanityFeaturedProduct => p !== null)
}

type Props = {
  params: Promise<{ countryCode: string; id: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const blog = await getBlogBySlugSanity(params.id)

  if (!blog) {
    notFound()
  }

  const seo = await getPageSEOSanity(`blog-${params.id}`)
  return buildMetadata(seo, {
    title: `${blog.title} | Jardin Botanica`,
    description: blog.description || blog.title,
    image: blog.coverImage?.url,
  })
}

export default async function SingleBlogTemplate2Page(props: Props) {
  const params = await props.params
  const [blog, alsoArticles] = await Promise.all([
    getBlogBySlugSanity(params.id),
    getLatestBlogCardsSanity(6, params.id),
  ])

  if (!blog) {
    notFound()
  }

  const [enrichedBlog, featuredProducts] = await Promise.all([
    withCtaProductImages(blog, params.countryCode),
    resolveFeaturedProducts(blog.featuredProducts, params.countryCode),
  ])

  return (
    <SingleBlogTemplate2
      blog={enrichedBlog}
      countryCode={params.countryCode}
      alsoArticles={alsoArticles}
      featuredProducts={featuredProducts}
    />
  )
}
