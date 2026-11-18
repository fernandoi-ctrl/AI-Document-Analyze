'use client'

import { Suspense, useEffect, useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { streamJobEvents } from '@/services/analysesApi'
import type { AnalysisResult } from '@/types/analysis'

interface SSEPayload {
  status?: string
  progress?: number
  message?: string
  result?: AnalysisResult
  error?: string
}

// Suspense wrapper required because useSearchParams needs a boundary at build time
export default function ProcessingPage() {
  return (
    <Suspense fallback={<LoadingShell />}>
      <ProcessingContent />
    </Suspense>
  )
}

function ProcessingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const jobId = searchParams.get('id')
  const t = useTranslations('Processing')
  const tc = useTranslations('Common')

  const STAGES = [
    { label: t('stage1'), threshold: 0 },
    { label: t('stage2'), threshold: 40 },
    { label: t('stage3'), threshold: 70 },
    { label: t('stage4'), threshold: 80 },
    { label: t('stage5'), threshold: 95 },
  ]

  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState(t('starting'))
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const esRef = useRef<EventSource | null>(null)

  useEffect(() => {
    if (!jobId) {
      router.replace('/analyze')
      return
    }

    let cancelled = false

    streamJobEvents(jobId).then((es) => {
      if (cancelled) {
        es.close()
        return
      }
      esRef.current = es

      es.onmessage = (event) => {
        const data = JSON.parse(event.data) as SSEPayload

        if (data.progress !== undefined) setProgress(data.progress)
        if (data.message) setMessage(data.message)

        if (data.status === 'done' && data.result) {
          es.close()
          sessionStorage.setItem(`Analiza tu juicio_result_${jobId}`, JSON.stringify(data.result))
          router.push(`/result?id=${jobId}`)
        }

        if (data.status === 'error') {
          es.close()
          setErrorMsg(data.error ?? data.message ?? t('errorUnknown'))
        }
      }

      es.onerror = () => {
        es.close()
        setErrorMsg(t('errorConnection'))
      }
    })

    return () => {
      cancelled = true
      esRef.current?.close()
    }
  }, [jobId, router, t])

  const activeStage = STAGES.filter((s) => s.threshold <= progress).at(-1)

  if (errorMsg) {
    return <ErrorScreen message={errorMsg} title={tc('errorTitle')} cta={t('tryAgain')} />
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-blue-900 text-white px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-2">
          <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center">
            <span className="text-blue-900 font-black text-xs">LS</span>
          </div>
          <span className="font-black tracking-tight text-lg">{tc('appName')}</span>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full text-center space-y-8">
          {/* Animated icon */}
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 rounded-full bg-blue-100 animate-ping opacity-30" />
            <div className="relative w-24 h-24 bg-blue-900 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-amber-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-gray-900">
              {t('title')}
            </h1>
            <p className="text-gray-500 text-base">
              {t('subtitle')}
            </p>
          </div>

          {/* Progress bar */}
          <div className="space-y-3">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-blue-900 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${Math.max(5, progress)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>{t('percent', { p: progress })}</span>
              {progress < 100 && <span>{t('wait')}</span>}
            </div>
          </div>

          {/* Current message */}
          <div className="bg-white border border-gray-200 rounded-2xl px-5 py-4">
            <p className="text-sm text-gray-600 font-medium">{message}</p>
          </div>

          {/* Stage checklist */}
          <div className="text-left space-y-2">
            {STAGES.map((stage, i) => {
              const done = progress > stage.threshold + 20
              const current = activeStage?.label === stage.label && !done
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${done ? 'bg-green-500' : current ? 'bg-blue-600 animate-pulse' : 'bg-gray-200'
                    }`}>
                    {done ? (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <div className={`w-2 h-2 rounded-full ${current ? 'bg-white' : 'bg-gray-400'}`} />
                    )}
                  </div>
                  <span className={`text-sm ${done ? 'text-gray-400 line-through' : current ? 'text-blue-800 font-semibold' : 'text-gray-400'
                    }`}>
                    {stage.label}
                  </span>
                </div>
              )
            })}
          </div>

          <p className="text-xs text-gray-400">
            {t('doNotClose')}
          </p>
        </div>
      </div>
    </main>
  )
}

function LoadingShell() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-amber-400 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      </div>
    </main>
  )
}

function ErrorScreen({ message, title, cta }: { message: string; title: string; cta: string }) {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-black text-gray-900">{title}</h2>
          <p className="text-gray-600 text-sm mt-2">{message}</p>
        </div>
        <Link
          href="/analyze"
          className="inline-block px-8 py-4 bg-blue-900 text-white font-bold rounded-2xl hover:bg-blue-800 transition-colors"
        >
          {cta}
        </Link>
      </div>
    </main>
  )
}
