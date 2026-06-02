'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { getAnalysis } from '@/services/analysesApi'
import { useAuth } from '@/components/AuthProvider'
import type { AnalysisResult } from '@/types/analysis'
import AnalysisResultView from '@/components/analyses/AnalysisResult'

interface AnalysisRow {
  id: string
  created_at: string
  case_text: string | null
  result_json: AnalysisResult | null
}

const dateLocale = (l: string) => (l === 'es' ? 'es-MX' : 'en-US')

export default function AnalysisDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [row, setRow] = useState<AnalysisRow | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const t = useTranslations('AnalysisDetail')
  const tc = useTranslations('Common')
  const tMy = useTranslations('MyAnalyses')
  const locale = useLocale()

  useEffect(() => {
    if (!authLoading && !user) router.push('/login')
  }, [user, authLoading, router])

  useEffect(() => {
    if (!user || !id) return

    getAnalysis(id)
      .then((detail) => {
        if (!detail.result) {
          setNotFound(true)
        } else {
          setRow({
            id: detail.id,
            created_at: detail.createdAt,
            case_text: detail.caseText,
            result_json: detail.result,
          })
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id, user])

  if (authLoading || !user || loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500">
          <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {tc('loadingAnalysis')}
        </div>
      </main>
    )
  }

  if (notFound || !row || !row.result_json) {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900">{t('notFoundTitle')}</h2>
            <p className="text-gray-500 text-sm mt-2">
              {t('notFoundDesc')}
            </p>
          </div>
          <Link
            href="/my-analyses"
            className="inline-block px-8 py-4 bg-blue-900 text-white font-bold rounded-2xl hover:bg-blue-800 transition-colors"
          >
            {t('backToList')}
          </Link>
        </div>
      </main>
    )
  }

  const formattedDate = new Date(row.created_at).toLocaleDateString(dateLocale(locale), {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-blue-900 text-white px-6 py-4 print:hidden">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0">
              <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center">
                <span className="text-blue-900 font-black text-xs">LS</span>
              </div>
              <span className="font-black tracking-tight text-lg">{tc('appName')}</span>
            </Link>
            <span className="text-white/40 shrink-0">›</span>
            <Link href="/my-analyses" className="text-white/70 hover:text-white text-sm transition-colors shrink-0">
              {tMy('breadcrumb')}
            </Link>
            <span className="text-white/40 shrink-0">›</span>
            <span className="text-white/70 text-sm truncate">{t('breadcrumb')}</span>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Case context */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3 print:shadow-none">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              {t('case')}
            </span>
            <span className="text-xs text-gray-500">{formattedDate}</span>
          </div>
          <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
            {row.case_text || <span className="text-gray-400 italic">{t('noDescription')}</span>}
          </p>
        </div>

        {/* Result */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8">
          <AnalysisResultView
            result={row.result_json}
            onNewAnalysis={() => router.push('/analyze')}
          />
        </div>
      </div>
    </main>
  )
}
