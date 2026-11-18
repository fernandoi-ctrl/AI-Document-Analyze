import { setRequestLocale } from 'next-intl/server';
import ClientHomePage from './ClientHomePage';
import { use } from 'react';

export default function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params); // 👈 unwrap con use()
  setRequestLocale(locale);

  return <ClientHomePage locale={locale} />;
}
