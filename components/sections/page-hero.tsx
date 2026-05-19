type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="section-space orb-surface section-divider">
      <div className="container space-y-6 md:space-y-7">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
          {eyebrow}
        </p>
        <h1 className="display-title max-w-4xl text-4xl text-ink md:text-6xl">
          {title}
        </h1>
        <p className="max-w-[70ch] text-base leading-8 text-body md:text-lg">{description}</p>
      </div>
    </section>
  );
}
