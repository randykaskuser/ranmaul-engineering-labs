import Link from "next/link";
import { notFound } from "next/navigation";
import {
  DOMAINS,
  LOCALES,
  getArticlesByDomain,
  type Domain,
  type Locale,
} from "@/lib/content";
import { Reveal } from "@/components/layout/reveal";
import { Stagger } from "@/components/layout/stagger";

type Params = {
  locale: string;
  domain: string;
};

function isValidLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}

function isValidDomain(value: string): value is Domain {
  return DOMAINS.includes(value as Domain);
}

export default async function DomainIndexPage({ params }: { params: Promise<Params> }) {
  const { locale, domain } = await params;
  if (!isValidLocale(locale) || !isValidDomain(domain)) {
    notFound();
  }

  const articles = await getArticlesByDomain(locale, domain);

  return (
    <section className="section-space">
      <div className="container">
        <header className="section-divider pb-8">
          <Reveal>
            <p className="type-kicker">{locale.toUpperCase()}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="display-title mt-4 text-4xl text-ink md:text-6xl">{domain.toUpperCase()}</h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="type-lede mt-4 max-w-[70ch]">
              Entries in <span className="text-ink">{domain}</span>.
            </p>
          </Reveal>
        </header>

        <Stagger className="mt-10 grid gap-4">
          {articles.length > 0 ? (
            articles.map((article) => (
              <Link
                key={`${article.locale}-${article.domain}-${article.slug}`}
                href={`/${article.locale}/${article.domain}/${article.slug}`}
                className="editorial-card p-6 transition-all hover:-translate-y-1 hover:shadow-lg hover:border-hairline-strong"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h2 className="type-title text-ink">{article.title}</h2>
                  <p className="text-xs text-muted">{article.readingMinutes} min</p>
                </div>
                <p className="mt-3 text-sm leading-7 text-body">{article.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {article.tags.slice(0, 6).map((tag) => (
                    <span key={tag} className="rounded-full border border-hairline px-3 py-1 text-xs text-body">
                      #{tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))
          ) : (
            <p className="text-body">No published entries yet.</p>
          )}
        </Stagger>
      </div>
    </section>
  );
}
