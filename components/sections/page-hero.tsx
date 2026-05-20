type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="section-space-lg orb-surface section-divider">
      <div className="container space-y-6 md:space-y-7">
        <p className="type-kicker">{eyebrow}</p>
        <h1 className="display-title max-w-4xl text-4xl text-ink md:text-6xl">{title}</h1>
        <p className="type-lede max-w-[68ch]">{description}</p>
      </div>
    </section>
  );
}
