import Home, { metadata } from "../page";

export { metadata };

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "id" }];
}

export default async function LocaleHomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <Home locale={locale} />;
}
