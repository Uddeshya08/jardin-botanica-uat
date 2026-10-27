import { getJournalArticleRouteSanity } from "@lib/sanity"
import { getJournalPath } from "@lib/util/journal-url"
import Template1Page, { generateMetadata as template1Metadata } from "@modules/journal/templates/template-1-page"
import Template2Page, { generateMetadata as template2Metadata } from "@modules/journal/templates/template-2-page"
import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"

type Props = {
  params: Promise<{ countryCode: string; category: string; id: string }>
}

async function resolveArticle(props: Props) {
  const params = await props.params
  const article = await getJournalArticleRouteSanity(params.id)
  if (!article) notFound()

  const path = getJournalPath(article.slug, article.category, params.countryCode)
  if (path !== `/${params.countryCode}/journal/${params.category}/${encodeURIComponent(params.id)}`) {
    permanentRedirect(path)
  }
  return { article, path }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { article, path } = await resolveArticle(props)
  const metadata = await (article._type === "blog" ? template2Metadata(props) : template1Metadata(props))
  return {
    ...metadata,
    alternates: { ...metadata.alternates, canonical: path },
    openGraph: { ...metadata.openGraph, url: path },
  }
}

export default async function JournalArticlePage(props: Props) {
  const { article } = await resolveArticle(props)
  return article._type === "blog" ? Template2Page(props) : Template1Page(props)
}
