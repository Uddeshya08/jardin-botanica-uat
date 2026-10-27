import { getJournalArticleRouteSanity } from "@lib/sanity"
import { getJournalPath } from "@lib/util/journal-url"
import { notFound, permanentRedirect } from "next/navigation"

type Props = { params: Promise<{ countryCode: string; id: string }> }

export default async function LegacyBlogPage({ params }: Props) {
  const { countryCode, id } = await params
  const article = await getJournalArticleRouteSanity(id)
  if (!article) notFound()
  permanentRedirect(getJournalPath(article.slug, article.category, countryCode))
}
