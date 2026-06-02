'use client'

import { useTransition } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'

interface LocaleSwitcherProps {
  className?: string
}

const DEFAULT_CLASS =
  'text-xs text-white/60 hover:text-white transition-colors bg-transparent border-none cursor-pointer'

export default function LocaleSwitcher({
  className = DEFAULT_CLASS,
}: LocaleSwitcherProps) {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations('Common')
  const [isPending, startTransition] = useTransition()

  function switchTo(next: string) {
    startTransition(() => {
      router.replace(pathname, { locale: next })
    })
  }

  return (
    <select
      aria-label={t('language')}
      value={locale}
      disabled={isPending}
      onChange={(e) => switchTo(e.target.value)}
      className={className}
    >
      {routing.locales.map((l) => (
        <option key={l} value={l} className="text-gray-900">
          {l.toUpperCase()}
        </option>
      ))}
    </select>
  )
}
