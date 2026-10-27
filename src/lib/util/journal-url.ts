export function getJournalCategorySlug(category?: string): string {
  return category?.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "archive"
}

export function getJournalPath(slug: string, category?: string, countryCode?: string): string {
  const prefix = countryCode ? `/${countryCode}` : ""
  return `${prefix}/journal/${getJournalCategorySlug(category)}/${encodeURIComponent(slug)}`
}

export type JournalArticleLink = {
  title: string
  slug: string
  category?: string
}
