

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import { mdxComponents } from "@/components/mdx/mdx-components";
import { Reveal } from "@/components/layout/reveal";
import { Stagger } from "@/components/layout/stagger";
import {
  DOMAINS,
  LOCALES,
  getArticleByRoute,
  getFeaturedArticles,
  getPublishedArticles,
  getRecentArticles,
  getRelatedArticles,
  getTranslationsForArticle,
  type Domain,
  type Locale,
} from "@/lib/content";
import { SITE_URL } from "@/lib/site";
import { PERSON_NAME, absoluteUrl, createPageMetadata, shareImage } from "@/lib/page-metadata";
import { JsonLd, PERSON_SCHEMA } from "@/components/seo/json-ld";

type RouteParams = {
  locale: string;
  domain: string;
  slug: string;
};

const prettyCodeTheme = {
  dark: "github-dark",
  light: "github-light",
};

function isValidLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}

function isValidDomain(value: string): value is Domain {
  return DOMAINS.includes(value as Domain);
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getCoverImageName(src: string): string {
  try {
    const url = new URL(src, "https://ranmaul.com");
    const last = url.pathname.split("/").filter(Boolean).pop();
    return last ?? "cover";
  } catch {
    return "cover";
  }
}

export async function generateStaticParams() {
  const articles = await getPublishedArticles();
  return articles.map((article) => ({
    locale: article.locale,
    domain: article.domain,
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<RouteParams> }): Promise<Metadata> {
  const { locale, domain, slug } = await params;
  if (!isValidLocale(locale) || !isValidDomain(domain)) {
    return {};
  }

  const article = await getArticleByRoute(locale, domain, slug);
  if (!article) {
    return {};
  }

  const translations = await getTranslationsForArticle(article);
  const languages: Record<string, string> = {
    [article.locale]: `/${article.locale}/${article.domain}/${article.slug}`,
  };
  
  for (const t of translations) {
    languages[t.locale] = `/${t.locale}/${t.domain}/${t.slug}`;
  }
  if (languages.en) {
    languages["x-default"] = languages.en;
  }

  const path = `/${article.locale}/${article.domain}/${article.slug}`;
  const base = createPageMetadata(article.title, article.description, {
    path,
    locale: article.locale,
    languages: translations.length > 0 ? languages : undefined,
    image: article.coverImage,
    type: "article",
  });

  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [PERSON_NAME],
      tags: article.tags,
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<RouteParams> }) {
  const { locale, domain, slug } = await params;
  if (!isValidLocale(locale) || !isValidDomain(domain)) {
    notFound();
  }

  const article = await getArticleByRoute(locale, domain, slug);
  if (!article) {
    notFound();
  }

  const [relatedArticles, recentArticles, featuredArticles, translations] = await Promise.all([
    getRelatedArticles(article, 3),
    getRecentArticles(article.locale, 4),
    getFeaturedArticles(article.locale, 4),
    getTranslationsForArticle(article),
  ]);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.description,
          image: absoluteUrl(shareImage(article.coverImage)),
          datePublished: article.publishedAt,
          dateModified: article.updatedAt,
          inLanguage: article.locale,
          mainEntityOfPage: `${SITE_URL}/${article.locale}/${article.domain}/${article.slug}`,
          keywords: article.tags.join(", "),
          author: PERSON_SCHEMA,
          publisher: PERSON_SCHEMA,
        }}
      />
      <section className="section-space">
      <div className="container-wide grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <article className="container-reading">
          <header className="section-divider pb-8">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                {article.locale.toUpperCase()} · {article.domain.toUpperCase()}
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="display-title mt-4 text-4xl text-ink md:text-6xl">{article.title}</h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="type-lede mt-5 max-w-[70ch]">{article.description}</p>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-body">
                <p>Published: {formatDate(article.publishedAt)}</p>
                <p>Updated: {formatDate(article.updatedAt)}</p>
                <p>{article.readingMinutes} min read</p>
              </div>
            </Reveal>

            <Stagger className="mt-4 flex flex-wrap gap-2" delay={0.4}>
              {article.tags.map((tag) => (
                <li key={tag} style={{ listStyle: 'none' }}>
                  <Link
                    href={`/${article.locale}/tags/${encodeURIComponent(tag)}`}
                    className="inline-flex rounded-full border border-hairline px-3 py-1 text-xs text-body transition hover:text-ink hover:border-hairline-strong hover:bg-surface-card"
                  >
                    #{tag}
                  </Link>
                </li>
              ))}
            </Stagger>

            {translations.length > 0 ? (
              <Reveal delay={0.5}>
                <div className="mt-5 flex flex-wrap gap-2 text-sm">
                  {translations.map((entry) => (
                    <Link
                      key={`${entry.locale}-${entry.slug}`}
                      href={`/${entry.locale}/${entry.domain}/${entry.slug}`}
                      className="rounded-full border border-hairline px-3 py-1 text-body transition hover:text-ink hover:border-hairline-strong hover:bg-surface-card"
                    >
                      Read {entry.locale.toUpperCase()} version
                    </Link>
                  ))}
                </div>
              </Reveal>
            ) : null}
          </header>

          {article.coverImage ? (
            <Reveal delay={0.2}>
              <figure className="my-8 overflow-hidden rounded-2xl border border-hairline bg-surface-card-soft">
                <Image
                  src={article.coverImage}
                  alt={article.coverAlt ?? article.title}
                  width={1600}
                  height={900}
                  priority
                  className="h-auto w-full"
                  sizes="(min-width: 1024px) 900px, 100vw"
                  style={{ objectFit: "cover" }}
                />
                <figcaption className="sr-only">
                  {article.coverAlt ?? `Cover image for ${article.title} (${getCoverImageName(article.coverImage)})`}
                </figcaption>
              </figure>
            </Reveal>
          ) : null}

          <Reveal delay={0.3}>
            <div className="article-prose mt-8">
              <MDXRemote
                source={article.body}
                components={mdxComponents}
                options={{
                  mdxOptions: {
                    remarkPlugins: [remarkGfm],
                    rehypePlugins: [[rehypePrettyCode, { theme: prettyCodeTheme }]],
                  },
                }}
              />
            </div>
          </Reveal>
        </article>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <Reveal direction="left" delay={0.4}>
            <section className="editorial-card p-5 transition-shadow hover:shadow-lg">
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">Related</h2>
              <ul className="mt-3 space-y-2 text-sm text-body">
                {relatedArticles.length > 0 ? (
                  relatedArticles.map((entry) => (
                    <li key={`${entry.locale}-${entry.domain}-${entry.slug}`}>
                      <Link href={`/${entry.locale}/${entry.domain}/${entry.slug}`} className="transition-colors hover:text-ink">
                        {entry.title}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li>No related entries yet.</li>
                )}
              </ul>
            </section>
          </Reveal>

          <Reveal direction="left" delay={0.5}>
            <section className="editorial-card p-5 transition-shadow hover:shadow-lg">
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">Recent</h2>
              <ul className="mt-3 space-y-2 text-sm text-body">
                {recentArticles.map((entry) => (
                  <li key={`${entry.locale}-${entry.domain}-${entry.slug}`}>
                    <Link href={`/${entry.locale}/${entry.domain}/${entry.slug}`} className="transition-colors hover:text-ink">
                      {entry.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </Reveal>

          <Reveal direction="left" delay={0.6}>
            <section className="editorial-card p-5 transition-shadow hover:shadow-lg">
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">Featured</h2>
              <ul className="mt-3 space-y-2 text-sm text-body">
                {featuredArticles.map((entry) => (
                  <li key={`${entry.locale}-${entry.domain}-${entry.slug}`}>
                    <Link href={`/${entry.locale}/${entry.domain}/${entry.slug}`} className="transition-colors hover:text-ink">
                      {entry.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </Reveal>
        </aside>
      </div>
    </section>
    </>
  );
}
