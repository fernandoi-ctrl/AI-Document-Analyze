'use client'

import { useTranslations } from 'next-intl'

interface TrafficLightProps {
  strengths: string[]
  risks: string[]
  critical_issues: string[]
}

export default function TrafficLight({ strengths, risks, critical_issues }: TrafficLightProps) {
  const t = useTranslations('TrafficLight')

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-800">{t('title')}</h3>

      <div className="space-y-3">
        {/* Green — Strengths */}
        {strengths.length > 0 && (
          <Section
            color="green"
            icon={
              <svg className="w-5 h-5 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M5 13l4 4L19 7" />
              </svg>
            }
            label={t('strengths')}
            items={strengths}
          />
        )}

        {/* Yellow — Risks */}
        {risks.length > 0 && (
          <Section
            color="yellow"
            icon={
              <svg className="w-5 h-5 text-yellow-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            }
            label={t('risks')}
            items={risks}
          />
        )}

        {/* Red — Critical issues */}
        {critical_issues.length > 0 && (
          <Section
            color="red"
            icon={
              <svg className="w-5 h-5 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M6 18L18 6M6 6l12 12" />
              </svg>
            }
            label={t('criticalIssues')}
            items={critical_issues}
          />
        )}

        {critical_issues.length === 0 && (
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
            <span className="text-green-600 text-xl">✓</span>
            <p className="text-sm text-green-800 font-medium">
              {t('noCritical')}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

interface SectionProps {
  color: 'green' | 'yellow' | 'red'
  icon: React.ReactNode
  label: string
  items: string[]
}

function Section({ color, icon, label, items }: SectionProps) {
  const styles = {
    green: {
      wrapper: 'bg-green-50 border-green-200',
      header: 'bg-green-100',
      dot: 'bg-green-500',
      text: 'text-green-900',
      label: 'text-green-800',
      indicator: 'bg-green-500',
    },
    yellow: {
      wrapper: 'bg-yellow-50 border-yellow-200',
      header: 'bg-yellow-100',
      dot: 'bg-yellow-500',
      text: 'text-yellow-900',
      label: 'text-yellow-800',
      indicator: 'bg-yellow-500',
    },
    red: {
      wrapper: 'bg-red-50 border-red-200',
      header: 'bg-red-100',
      dot: 'bg-red-500',
      text: 'text-red-900',
      label: 'text-red-800',
      indicator: 'bg-red-500',
    },
  }

  const s = styles[color]

  return (
    <div className={`border rounded-2xl overflow-hidden ${s.wrapper}`}>
      <div className={`flex items-center gap-2 px-4 py-3 ${s.header}`}>
        {icon}
        <span className={`font-bold text-sm ${s.label}`}>{label}</span>
        <span className={`ml-auto w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white ${s.indicator}`}>
          {items.length}
        </span>
      </div>
      <ul className="px-4 py-3 space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${s.dot}`} />
            <span className={`text-sm leading-relaxed ${s.text}`}>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
