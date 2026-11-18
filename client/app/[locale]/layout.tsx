import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
//@ts-ignore
import '../globals.css'
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { AuthProvider } from '@/components/AuthProvider'
import { StoreProvider } from '@/store/StoreProvider'

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Metadata' })
  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords').split(','),
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body className={`${geist.variable} antialiased`}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <StoreProvider>
            <AuthProvider>{children}</AuthProvider>
          </StoreProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
