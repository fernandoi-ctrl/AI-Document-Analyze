'use client'

import { useTranslations } from 'next-intl'
import type { AnalysisResult } from '@/types/analysis'
import ScoreCard from './ScoreCard'
import TrafficLight from './TrafficLight'

interface AnalysisResultProps {
  result: AnalysisResult
  onNewAnalysis: () => void
}

const RISK_STYLE: Record<string, string> = {
  bajo: 'bg-green-100 text-green-800 border-green-200',
  medio: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  alto: 'bg-red-100 text-red-800 border-red-200',
}

export default function AnalysisResultView({ result, onNewAnalysis }: AnalysisResultProps) {
  const t = useTranslations('AnalysisResult')

  const riskLabel: Record<string, string> = {
    bajo: t('riskBajo'),
    medio: t('riskMedio'),
    alto: t('riskAlto'),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          {t('completed')}
        </div>

        <div className="flex justify-center">
          <span className={`px-4 py-2 rounded-full text-sm font-bold border ${RISK_STYLE[result.risk_level]}`}>
            {riskLabel[result.risk_level]}
          </span>
        </div>
      </div>

      {/* Score cards */}
      <ScoreCard score={result.score} probability={result.probability} />

      {/* Traffic light */}
      <TrafficLight
        strengths={result.strengths}
        risks={result.risks}
        critical_issues={result.critical_issues}
      />

      {/* Recommendations */}
      {result.recommendations.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 space-y-3">
          <h3 className="text-lg font-bold text-blue-900 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            {t('recommendations')}
          </h3>
          <ol className="space-y-3">
            {result.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <p className="text-sm text-blue-900 leading-relaxed pt-1">{rec}</p>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Legal disclaimer */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <p className="text-xs text-gray-500 text-center leading-relaxed">
          <strong>{t('disclaimerTitle')}</strong> {t('disclaimerBody')}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => window.print()}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 transition-colors text-base"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          {t('print')}
        </button>
        <button
          onClick={onNewAnalysis}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-blue-900 text-white font-semibold rounded-2xl hover:bg-blue-800 transition-colors text-base"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 4v16m8-8H4" />
          </svg>
          {t('newCase')}
        </button>
      </div>
    </div>
  )
}
