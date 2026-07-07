'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { ApiError } from '@/services/apiClient'
import { CASE_TYPE_LABELS, type CaseType } from '@/types/analysis'
import { startAnalysis } from '@/services/analysesApi'
import { createCheckout, startCheckout } from '@/services/paymentsApi'
import FileUploader from './FileUploader'
// import { ApiError } from 'next/dist/server/api-utils'

interface CaseFormProps {
  onSubmit: (jobId: string) => void
  onError: (message: string) => void
}

export default function CaseForm({ onSubmit, onError }: CaseFormProps) {
  const [description, setDescription] = useState('')
  const [caseType, setCaseType] = useState<CaseType>('civil')
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const t = useTranslations('CaseForm')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!description.trim() && files.length === 0) {
      onError(t('errorEmpty'))
      return
    }

    setLoading(true)

    try {
      const { jobId } = await startAnalysis(caseType, description, files)
      onSubmit(jobId)
    } catch (err) {
      if (err instanceof ApiError && err.statusCode === 402) {
        try {
          const { url } = await createCheckout()
          window.location.href = url
        } catch {
          onError(t('errorCheckout'))
          setLoading(false)
        }
        return
      }
      const message = err instanceof Error ? err.message : t('errorUnexpected')
      onError(message)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Case type selector */}
      <div className="space-y-2">
        <label className="block text-base font-semibold text-gray-800">
          {t('caseTypeLabel')}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {(Object.entries(CASE_TYPE_LABELS) as [CaseType, string][]).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setCaseType(value)}
              className={`
                py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all
                ${caseType === value
                  ? 'border-blue-600 bg-blue-50 text-blue-800'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                }
              `}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="block text-base font-semibold text-gray-800" htmlFor="description">
          {t('descriptionLabel')}
          <span className="ml-2 text-sm font-normal text-gray-400">{t('descriptionOptional')}</span>
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t('descriptionPlaceholder')}
          rows={6}
          maxLength={5000}
          className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none leading-relaxed"
        />
        <p className="text-xs text-gray-400 text-right">
          {t('charsCounter', { count: description.length })}
        </p>
      </div>

      {/* File upload */}
      <div className="space-y-2">
        <label className="block text-base font-semibold text-gray-800">
          {t('uploadLabel')}
          <span className="ml-2 text-sm font-normal text-gray-400">{t('optional')}</span>
        </label>
        <FileUploader files={files} onChange={setFiles} />
        <div
          className={`flex items-start gap-2 rounded-xl px-3 py-2 text-xs leading-relaxed border ${files.length > 0
            ? 'bg-amber-50 border-amber-200 text-amber-800'
            : 'bg-gray-50 border-gray-200 text-gray-600'
            }`}
        >
          <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>
            {files.length > 0
              ? t.rich('creditWithFiles', { b: (chunks) => <strong>{chunks}</strong> })
              : t.rich('creditWithoutFiles', { b: (chunks) => <strong>{chunks}</strong> })}
          </span>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-1">
        <p className="text-sm font-semibold text-amber-800">{t('tipsTitle')}</p>
        <ul className="text-sm text-amber-700 space-y-1">
          <li>• {t('tip1')}</li>
          <li>• {t('tip2')}</li>
          <li>• {t('tip3')}</li>
        </ul>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="
          w-full py-5 px-8 rounded-2xl text-lg font-bold text-white
          bg-blue-900 hover:bg-blue-800 active:bg-blue-950
          disabled:opacity-60 disabled:cursor-not-allowed
          transition-all duration-200 shadow-lg hover:shadow-xl
          flex items-center justify-center gap-3
        "
      >
        {loading ? (
          <>
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {t('submitting')}
          </>
        ) : (
          <>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            {t('submit')}
          </>
        )}
      </button>
    </form>
  )
}
