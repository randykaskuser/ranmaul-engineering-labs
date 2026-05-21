import Link from "next/link";
import { notFound } from "next/navigation";
import { LOCALES, getArticlesByTag, type Locale } from "@/lib/content";

type Params = {
  locale: string;
  tag: string;
};

function isValidLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}

export default async function TagPage({ params }: { params: Promise<Params> }) {
  const { locale, tag } = await params;
  if (!isValidLocale(locale)) {
    notFound();
  }

  const decoded = decodeURIComponent(tag);
  const articles = await getArticlesByTag(locale, decoded);

  return (
    <section className="section-space">
      <div className="container">
        <header className="section-divider pb-8">
          <p className="type-kicker">{locale.toUpperCase()}</p>
          <h1 className="display-title mt-4 text-4xl text-ink md:text-6xl">#{decoded}</h1>
          <p className="type-lede mt-4 max-w-[70ch]">Entries tagged with “{decoded}”.</p>
          <div className="mt-5">
            <Link href={`/${locale}/tags`} className="text-sm text-body underline underline-offset-4">
              Browse all tags
            </Link>
          </div>
        </header>

        <div className="mt-10 grid gap-4">
          {articles.length > 0 ? (
            articles.map((article) => (
              <Link
                key={`${article.locale}-${article.domain}-${article.slug}`}
                href={`/${article.locale}/${article.domain}/${article.slug}`}
                className="editorial-card p-6"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h2 className="type-title text-ink">{article.title}</h2>
                  <p className="text-xs text-muted">{article.domain.toUpperCase()}</p>
                </div>
                <p className="mt-3 text-sm leading-7 text-body">{article.description}</p>
              </Link>
            ))
          ) : (
            <p className="text-body">No published entries for this tag.</p>
          )}
        </div>
      </div>
    </section>
  );
}
