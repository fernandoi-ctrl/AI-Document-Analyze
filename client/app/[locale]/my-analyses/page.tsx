'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { listAnalyses } from '@/services/analysesApi'
import { useAuth } from '@/components/AuthProvider'
import Avatar from '@/components/Avatar'
import LocaleSwitcher from '@/components/LocaleSwitcher'
import type { RiskLevel } from '@/types/analysis'

interface Analysis {
  id: string
  created_at: string
  case_text: string
  score: number
  probability: number
  risk_level: RiskLevel
}

const RISK_COLORS: Record<RiskLevel, string> = {
  bajo: 'bg-green-100 text-green-800 border-green-200',
  medio: 'bg-amber-100 text-amber-800 border-amber-200',
  alto: 'bg-red-100 text-red-800 border-red-200',
}

const dateLocale = (l: string) => (l === 'es' ? 'es-MX' : 'en-US')

export default function MyAnalysesPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [fetching, setFetching] = useState(true)
  const t = useTranslations('MyAnalyses')
  const tc = useTranslations('Common')
  const locale = useLocale()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (!user) return

    listAnalyses()
      .then((rows) =>
        setAnalyses(
          rows.map((r) => ({
            id: r.id,
            created_at: r.createdAt,
            case_text: r.caseText ?? '',
            score: r.score ?? 0,
            probability: r.probability ?? 0,
            risk_level: (r.riskLevel as RiskLevel) ?? 'medio',
          })),
        ),
      )
      .catch(() => setAnalyses([]))
      .finally(() => setFetching(false))
  }, [user])

  if (loading || !user) return null

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-blue-900 text-white px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center">
                <span className="text-blue-900 font-black text-xs">LS</span>
              </div>
              <span className="font-black tracking-tight text-lg">{tc('appName')}</span>
            </Link>
            <span className="text-white/40">›</span>
            <span className="text-white/70 text-sm">{t('breadcrumb')}</span>
          </div>
          <div className="flex items-center gap-3">
            <LocaleSwitcher />
            <Link
              href="/analyze"
              className="px-4 py-2 bg-amber-400 text-blue-900 rounded-xl text-sm font-bold hover:bg-amber-300 transition-colors"
            >
              {tc('newAnalysis')}
            </Link>
            <Link
              href="/profile"
              aria-label={tc('viewProfile')}
              title={tc('viewProfile')}
              className="rounded-full hover:ring-2 hover:ring-white/40 transition-all"
            >
              <Avatar email={user.email!} size="sm" />
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
        <h1 className="text-2xl font-black text-gray-900">{t('title')}</h1>

        {fetching ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5 animate-pulse h-24" />
            ))}
          </div>
        ) : analyses.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center space-y-4">
            <p className="text-gray-400 text-base">{t('empty')}</p>
            <Link
              href="/analyze"
              className="inline-block px-6 py-3 bg-blue-900 text-white font-bold rounded-xl hover:bg-blue-800 transition-colors text-sm"
            >
              {t('ctaFirst')}
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {analyses.map((a) => (
              <Link
                key={a.id}
                href={`/analyses/${a.id}`}
                className="block bg-white rounded-2xl border border-gray-200 p-5 space-y-3 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-gray-800 text-sm leading-relaxed line-clamp-2 flex-1">
                    {a.case_text || t('noDescription')}
                  </p>
                  <span
                    className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full border capitalize ${RISK_COLORS[a.risk_level]}`}
                  >
                    {a.risk_level}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{t('score')}: <strong className="text-gray-800">{a.score}/100</strong></span>
                  <span>{t('probability')}: <strong className="text-gray-800">{a.probability}%</strong></span>
                  <span className="ml-auto text-xs flex items-center gap-1.5">
                    {new Date(a.created_at).toLocaleDateString(dateLocale(locale), {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                    <svg className="w-3.5 h-3.5 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
