'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { useLocale, useTranslations } from 'next-intl'
import type { AnalysisResult } from '@/types/analysis'
import AnalysisResultView from '@/analyses/AnalysisResult'

const dateLocale = (l: string) => (l === 'es' ? 'es-MX' : 'en-US')

export default function ResultPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <ResultContent />
    </Suspense>
  )
}

function ResultContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const jobId = searchParams.get('id')
  const t = useTranslations('Result')
  const tc = useTranslations('Common')
  const locale = useLocale()

  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!jobId) {
      router.replace('/analyze')
      return
    }

    const stored = sessionStorage.getItem(`Analiza tu juicio_result_${jobId}`)
    if (stored) {
      try {
        setResult(JSON.parse(stored) as AnalysisResult)
      } catch {
        setNotFound(true)
      }
    } else {
      setNotFound(true)
    }
  }, [jobId, router])

  function handleNewAnalysis() {
    if (jobId) sessionStorage.removeItem(`Analiza tu juicio_result_${jobId}`)
    router.push('/analyze')
  }

  // if (notFound) {
  //   return (
  //     <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
  //       <div className="max-w-md w-full text-center space-y-6">
  //         <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
  //           <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
  //               d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  //           </svg>
  //         </div>
  //         <div>
  //           <h2 className="text-xl font-black text-gray-900">{t('notFoundTitle')}</h2>
  //           <p className="text-gray-500 text-sm mt-2">
  //             {t('notFoundDesc')}
  //           </p>
  //         </div>
  //         <Link
  //           href="/analyze"
  //           className="inline-block px-8 py-4 bg-blue-900 text-white font-bold rounded-2xl hover:bg-blue-800 transition-colors"
  //         >
  //           {t('newAnalysis')}
  //         </Link>
  //       </div>
  //     </main>
  //   )
  // }

  if (!result) {
    return <LoadingScreen />
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-blue-900 text-white px-6 py-4 print:hidden">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center">
              <span className="text-blue-900 font-black text-xs">LS</span>
            </div>
            <span className="font-black tracking-tight text-lg">{tc('appName')}</span>
          </Link>
          <span className="text-white/40">›</span>
          <span className="text-white/70 text-sm">{t('breadcrumb')}</span>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Progress indicator */}
        <div className="flex items-center gap-2 print:hidden">
          <Step number={1} label={t('stepCase')} done />
          <div className="flex-1 h-0.5 bg-blue-900" />
          <Step number={2} label={t('stepProcessing')} done />
          <div className="flex-1 h-0.5 bg-blue-900" />
          <Step number={3} label={t('stepResult')} active />
        </div>

        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8">
          <AnalysisResultView result={result} onNewAnalysis={handleNewAnalysis} />
        </div>

        <p className="text-center text-xs text-gray-400 print:hidden">
          {t('generatedOn', {
            date: new Date().toLocaleDateString(dateLocale(locale), {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            }),
          })}
        </p>
      </div>
    </main>
  )
}

function LoadingScreen() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex items-center gap-3 text-gray-500">
        <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    </main>
  )
}

function Step({
  number,
  label,
  active,
  done,
}: {
  number: number
  label: string
  active?: boolean
  done?: boolean
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
          ${done ? 'bg-green-500 text-white' : active ? 'bg-blue-900 text-white' : 'bg-gray-200 text-gray-400'}`}
      >
        {done ? (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          number
        )}
      </div>
      <span className={`text-xs font-medium ${done || active ? 'text-blue-900' : 'text-gray-400'}`}>
        {label}
      </span>
    </div>
  )
}
