export const dynamic = 'force-static';
import { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'
import { getPublishedArticles, getTranslationsForArticle, LOCALES, DOMAINS, type Article } from '@/lib/content'

// Indexable pages only. Left out on purpose: tag pages (noindex, thin),
// /cv-randy-maulana (disallowed in robots.txt), /create (authoring guide),
// /about (placeholder), and /en (canonicalized to /).
const LOCALIZED_PAGES = ['drone-portfolio', 'tools', 'projects', 'contact']

const url = (path: string) => `${SITE_URL}${path}`

function newest(articles: Article[]): Date | undefined {
  const times = articles.map((a) => new Date(a.updatedAt).getTime()).filter((t) => !Number.isNaN(t))
  return times.length > 0 ? new Date(Math.max(...times)) : undefined
}

function bothLocales(path: (locale: string) => string) {
  return { languages: { en: url(path('en')), id: url(path('id')), 'x-default': url(path('en')) } }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getPublishedArticles()
  const entries: MetadataRoute.Sitemap = []

  const homeAlternates = { languages: { en: url('/'), id: url('/id'), 'x-default': url('/') } }
  entries.push({ url: url('/'), lastModified: newest(articles.filter((a) => a.locale === 'en')), alternates: homeAlternates })
  entries.push({ url: url('/id'), lastModified: newest(articles.filter((a) => a.locale === 'id')), alternates: homeAlternates })

  for (const page of LOCALIZED_PAGES) {
    for (const locale of LOCALES) {
      entries.push({ url: url(`/${locale}/${page}`), alternates: bothLocales((l) => `/${l}/${page}`) })
    }
  }

  for (const domain of DOMAINS) {
    for (const locale of LOCALES) {
      entries.push({
        url: url(`/${locale}/${domain}`),
        lastModified: newest(articles.filter((a) => a.locale === locale && a.domain === domain)),
        alternates: bothLocales((l) => `/${l}/${domain}`),
      })
    }
  }

  for (const article of articles) {
    const path = `/${article.locale}/${article.domain}/${article.slug}`
    const languages: Record<string, string> = { [article.locale]: url(path) }
    for (const t of await getTranslationsForArticle(article)) {
      languages[t.locale] = url(`/${t.locale}/${t.domain}/${t.slug}`)
    }
    if (languages.en) languages['x-default'] = languages.en

    entries.push({
      url: url(path),
      lastModified: newest([article]),
      alternates: Object.keys(languages).length > 1 ? { languages } : undefined,
    })
  }

  return entries
}
