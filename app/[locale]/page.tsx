import Home, { homeMetadata } from "../page";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return homeMetadata(locale);
}

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "id" }];
}

export default async function LocaleHomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <Home locale={locale} />;
}
