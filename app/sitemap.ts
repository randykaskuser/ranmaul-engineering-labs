import { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'
import { getPublishedArticles, LOCALES, DOMAINS } from '@/lib/content'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getPublishedArticles()

  const articleUrls = articles.map((article) => ({
    url: `${SITE_URL}/${article.locale}/${article.domain}/${article.slug}`,
    lastModified: new Date(article.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const indexUrls: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    }
  ]

  LOCALES.forEach(locale => {
    DOMAINS.forEach(domain => {
      indexUrls.push({
        url: `${SITE_URL}/${locale}/${domain}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      })
    })
  })

  return [...indexUrls, ...articleUrls]
}
