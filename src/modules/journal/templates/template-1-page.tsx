import { getProductByHandle } from "@lib/data/products"
import {
  getAllBlogTemplate1LinksSanity,
  getBlogTemplate1BySlugSanity,
  getLatestBlogTemplate1LinksSanity,
  getPageSEOSanity,
} from "@lib/sanity"
import { buildMetadata } from "@lib/seo"
import { SingleBlogTemplate } from "app/components/SingleBlogTemplate"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { ResolvedFeaturedProduct, SanityBlogTemplate1 } from "types/sanity-blog"

type Props = {
  params: Promise<{ countryCode: string; id: string }>
}

// Resolve the article's featured-product handles into Medusa products, carrying
// the fields the "From the Botanist's Shelf" cards need (images, variants).
async function resolveFeaturedProducts(
  handles: string[] | undefined,
  countryCode: string
): Promise<ResolvedFeaturedProduct[]> {
  if (!handles?.length) return []
  const resolved = await Promise.all(
    handles.map(async (handle) => {
      const product = await getProductByHandle({ handle, countryCode }).catch(() => null)
      if (!product) return []
      const item: ResolvedFeaturedProduct = {
        id: product.id,
        name: product.title ?? handle,
        handle,
        image: product.thumbnail || undefined,
        hoverImage: product.images?.[1]?.url || product.thumbnail || undefined,
        description: product.description || undefined,
        subtitle: (product as { subtitle?: string | null }).subtitle || undefined,
        variants: product.variants || [],
      }
      return [item]
    })
  )
  return resolved.flat()
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const blog = await getBlogTemplate1BySlugSanity(params.id)

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

export default async function SingleBlogPage(props: Props) {
  const params = await props.params
  const [blog, latestArticles, allBlogLinks] = await Promise.all([
    getBlogTemplate1BySlugSanity(params.id),
    getLatestBlogTemplate1LinksSanity(8),
    getAllBlogTemplate1LinksSanity(),
  ])

  if (!blog) {
    notFound()
  }

  const enrichedBlog: SanityBlogTemplate1 = {
    ...blog,
    resolvedFeaturedProducts: await resolveFeaturedProducts(
      blog.featuredProducts,
      params.countryCode
    ),
  }

  const currentIndex = allBlogLinks.findIndex((item) => item.slug === blog.slug)

  const navigationPosts =
    currentIndex >= 0 && allBlogLinks.length > 1
      ? {
          previous: allBlogLinks[(currentIndex - 1 + allBlogLinks.length) % allBlogLinks.length],
          next: allBlogLinks[(currentIndex + 1) % allBlogLinks.length],
        }
      : {
          previous: null,
          next: null,
        }

  return (
    <SingleBlogTemplate
      blog={enrichedBlog}
      countryCode={params.countryCode}
      latestArticles={latestArticles}
      navigationPosts={navigationPosts}
    />
  )
}
