'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { useAuth } from '@/components/AuthProvider'
import { supabase } from '@/lib/supabase'
import Avatar from '@/components/Avatar'
import LocaleSwitcher from '@/components/LocaleSwitcher'
import CaseForm from '@/components/cases/CaseFom'

export default function AnalyzePage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const t = useTranslations('Analyze')
  const tc = useTranslations('Common')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  function handleSubmit(jobId: string) {
    router.push(`/processing?id=${jobId}`)
  }

  if (loading || !user) return null

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-blue-900 text-white px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
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
            <Link href="/my-analyses" className="text-xs text-white/60 hover:text-white transition-colors">
              {tc('myAnalyses')}
            </Link>
            <button
              onClick={handleLogout}
              className="text-xs text-white/50 hover:text-white transition-colors"
            >
              {tc('logout')}
            </button>
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

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            {t('title')}
          </h1>
          <p className="text-gray-500 text-base leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center gap-2">
          <Step number={1} label={t('stepCase')} active />
          <div className="flex-1 h-0.5 bg-gray-200" />
          <Step number={2} label={t('stepProcessing')} />
          <div className="flex-1 h-0.5 bg-gray-200" />
          <Step number={3} label={t('stepResult')} />
        </div>

        {/* Error banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-semibold text-red-800 text-sm">{t('errorTitle')}</p>
              <p className="text-red-700 text-sm mt-0.5">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Form card */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8">
          <CaseForm onSubmit={handleSubmit} onError={setError} />
        </div>

        <p className="text-center text-xs text-gray-400 leading-relaxed px-4">
          {t('footer')}
        </p>
      </div>
    </main>
  )
}

function Step({ number, label, active }: { number: number; label: string; active?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
          ${active ? 'bg-blue-900 text-white' : 'bg-gray-200 text-gray-400'}`}
      >
        {number}
      </div>
      <span className={`text-xs font-medium ${active ? 'text-blue-900' : 'text-gray-400'}`}>
        {label}
      </span>
    </div>
  )
}
