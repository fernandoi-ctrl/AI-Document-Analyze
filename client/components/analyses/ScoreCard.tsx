'use client'

import { useTranslations } from 'next-intl'

interface ScoreCardProps {
  score: number       // 1–10
  probability: number // 0–100
}

export default function ScoreCard({ score, probability }: ScoreCardProps) {
  const t = useTranslations('ScoreCard')
  const scoreColor = score >= 7 ? '#16a34a' : score >= 4 ? '#ca8a04' : '#dc2626'
  const probabilityColor =
    probability >= 60 ? '#16a34a' : probability >= 35 ? '#ca8a04' : '#dc2626'

  const circumference = 2 * Math.PI * 54
  const scoreOffset = circumference - (score / 10) * circumference
  const probOffset = circumference - (probability / 100) * circumference

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col items-center gap-3">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          {t('scoreLabel')}
        </p>

        <div className="relative w-32 h-32">
          <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
            <circle cx="60" cy="60" r="54" fill="none" stroke="#e5e7eb" strokeWidth="10" />
            <circle
              cx="60" cy="60" r="54" fill="none"
              stroke={scoreColor} strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={scoreOffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-black" style={{ color: scoreColor }}>
              {score}
            </span>
            <span className="text-xs text-gray-400 font-medium">/10</span>
          </div>
        </div>

        <ScoreLabel score={score} />
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col items-center gap-3">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          {t('probabilityLabel')}
        </p>

        <div className="relative w-32 h-32">
          <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
            <circle cx="60" cy="60" r="54" fill="none" stroke="#e5e7eb" strokeWidth="10" />
            <circle
              cx="60" cy="60" r="54" fill="none"
              stroke={probabilityColor} strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={probOffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black" style={{ color: probabilityColor }}>
              {probability}%
            </span>
          </div>
        </div>

        <ProbabilityLabel probability={probability} />
      </div>
    </div>
  )
}

function ScoreLabel({ score }: { score: number }) {
  const t = useTranslations('ScoreCard')
  if (score >= 8) return <Badge color="green">{t('scoreSolid')}</Badge>
  if (score >= 6) return <Badge color="green">{t('scoreFavorable')}</Badge>
  if (score >= 4) return <Badge color="yellow">{t('scoreModerate')}</Badge>
  if (score >= 2) return <Badge color="red">{t('scoreWeak')}</Badge>
  return <Badge color="red">{t('scoreVeryWeak')}</Badge>
}

function ProbabilityLabel({ probability }: { probability: number }) {
  const t = useTranslations('ScoreCard')
  if (probability >= 70) return <Badge color="green">{t('probHigh')}</Badge>
  if (probability >= 50) return <Badge color="green">{t('probMedHigh')}</Badge>
  if (probability >= 35) return <Badge color="yellow">{t('probMed')}</Badge>
  if (probability >= 20) return <Badge color="yellow">{t('probLow')}</Badge>
  return <Badge color="red">{t('probVeryLow')}</Badge>
}

function Badge({ children, color }: { children: React.ReactNode; color: 'green' | 'yellow' | 'red' }) {
  const styles = {
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800',
  }
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[color]}`}>
      {children}
    </span>
  )
}
