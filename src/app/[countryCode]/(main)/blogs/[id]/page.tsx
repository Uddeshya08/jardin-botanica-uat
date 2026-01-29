import { getBlogBySlug } from "@lib/data/contentful"
import { SingleBlogTemplate } from "app/components/SingleBlogTemplate" // Assuming absolute imports are set up as per previous file
import type { Metadata } from "next"
import { notFound } from "next/navigation"

type Props = {
  params: Promise<{ countryCode: string; id: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const blog = await getBlogBySlug(params.id, params.countryCode)

  if (!blog) {
    notFound()
  }

  return {
    title: `${blog.title} | Jardin Botanica`,
    description: blog.title,
    openGraph: {
      title: `${blog.title} | Jardin Botanica`,
      description: blog.title,
      images: blog.image ? [blog.image] : [],
    },
  }
}

export default async function SingleBlogPage(props: Props) {
  const params = await props.params
  const blog = await getBlogBySlug(params.id, params.countryCode)

  if (!blog) {
    notFound()
  }

  // Since we are separating the logic, we pass the data to the client component
  return <SingleBlogTemplate blog={blog} countryCode={params.countryCode} />
}
