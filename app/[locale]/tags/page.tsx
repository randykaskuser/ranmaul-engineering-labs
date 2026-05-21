import Link from "next/link";
import { notFound } from "next/navigation";
import { LOCALES, getAllTags, type Locale } from "@/lib/content";

type Params = {
  locale: string;
};

function isValidLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}

export default async function TagsIndexPage({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    notFound();
  }

  const tags = await getAllTags(locale);

  return (
    <section className="section-space">
      <div className="container">
        <header className="section-divider pb-8">
          <p className="type-kicker">{locale.toUpperCase()}</p>
          <h1 className="display-title mt-4 text-4xl text-ink md:text-6xl">Tags</h1>
          <p className="type-lede mt-4 max-w-[70ch]">Browse entries by tag.</p>
        </header>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tags.length > 0 ? (
            tags.map(({ tag, count }) => (
              <Link
                key={tag}
                href={`/${locale}/tags/${encodeURIComponent(tag)}`}
                className="editorial-card p-5"
              >
                <p className="text-sm font-medium text-ink">#{tag}</p>
                <p className="mt-1 text-xs text-muted">{count} entries</p>
              </Link>
            ))
          ) : (
            <p className="text-body">No tags yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}
