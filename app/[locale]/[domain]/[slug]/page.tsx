import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import { mdxComponents } from "@/components/mdx/mdx-components";
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
import { SITE_NAME } from "@/lib/site";

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
    const url = new URL(src, "https://example.com");
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

  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: `${article.title} | ${SITE_NAME}`,
      description: article.description,
      type: "article",
      locale: article.locale === "id" ? "id_ID" : "en_US",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
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
    <section className="section-space">
      <div className="container-wide grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <article className="container-reading">
          <header className="section-divider pb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              {article.locale.toUpperCase()} · {article.domain.toUpperCase()}
            </p>
            <h1 className="display-title mt-4 text-4xl text-ink md:text-6xl">{article.title}</h1>
            <p className="type-lede mt-5 max-w-[70ch]">{article.description}</p>

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-body">
              <p>Published: {formatDate(article.publishedAt)}</p>
              <p>Updated: {formatDate(article.updatedAt)}</p>
              <p>{article.readingMinutes} min read</p>
            </div>

            <ul className="mt-4 flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <li key={tag}>
                  <Link
                    href={`/${article.locale}/tags/${encodeURIComponent(tag)}`}
                    className="inline-flex rounded-full border border-hairline px-3 py-1 text-xs text-body hover:text-ink"
                  >
                    #{tag}
                  </Link>
                </li>
              ))}
            </ul>

            {translations.length > 0 ? (
              <div className="mt-5 flex flex-wrap gap-2 text-sm">
                {translations.map((entry) => (
                  <Link
                    key={`${entry.locale}-${entry.slug}`}
                    href={`/${entry.locale}/${entry.domain}/${entry.slug}`}
                    className="rounded-full border border-hairline px-3 py-1 text-body hover:text-ink"
                  >
                    Read {entry.locale.toUpperCase()} version
                  </Link>
                ))}
              </div>
            ) : null}
          </header>

          {article.coverImage ? (
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
          ) : null}

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
        </article>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <section className="editorial-card p-5">
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">Related</h2>
            <ul className="mt-3 space-y-2 text-sm text-body">
              {relatedArticles.length > 0 ? (
                relatedArticles.map((entry) => (
                  <li key={`${entry.locale}-${entry.domain}-${entry.slug}`}>
                    <Link href={`/${entry.locale}/${entry.domain}/${entry.slug}`} className="hover:text-ink">
                      {entry.title}
                    </Link>
                  </li>
                ))
              ) : (
                <li>No related entries yet.</li>
              )}
            </ul>
          </section>

          <section className="editorial-card p-5">
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">Recent</h2>
            <ul className="mt-3 space-y-2 text-sm text-body">
              {recentArticles.map((entry) => (
                <li key={`${entry.locale}-${entry.domain}-${entry.slug}`}>
                  <Link href={`/${entry.locale}/${entry.domain}/${entry.slug}`} className="hover:text-ink">
                    {entry.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="editorial-card p-5">
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">Featured</h2>
            <ul className="mt-3 space-y-2 text-sm text-body">
              {featuredArticles.map((entry) => (
                <li key={`${entry.locale}-${entry.domain}-${entry.slug}`}>
                  <Link href={`/${entry.locale}/${entry.domain}/${entry.slug}`} className="hover:text-ink">
                    {entry.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </section>
  );
}
