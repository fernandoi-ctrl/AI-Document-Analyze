'use client'

import { useTranslations } from 'next-intl'
import { usePayments } from '@/hooks/usePayments'
import PaymentSuccessCard from '@/components/payments/PaymentSuccessCard'

export default function SuccessPage() {
  const t = useTranslations('Success')

  usePayments({ autoLoadCredits: true })

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-blue-950 text-white flex flex-col items-center justify-center px-6">
      <PaymentSuccessCard
        title={t('title')}
        description={t('desc')}
        ctaLabel={t('cta')}
        ctaHref="/analyze"
      />
    </main>
  )
}
