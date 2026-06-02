import { Link } from '@/i18n/navigation'

interface AnalysesCardProps {
  label: string
  hint: string
  count: number | null
  viewLabel: string
  viewHref?: string
}

export default function AnalysesCard({
  label,
  hint,
  count,
  viewLabel,
  viewHref = '/my-analyses',
}: AnalysesCardProps) {
  return (
    <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-gray-400">
            {label}
          </p>
          <p className="text-5xl font-black mt-2 text-gray-900">
            {count === null ? '—' : count}
          </p>
          <p className="text-xs mt-1 text-gray-500">{hint}</p>
        </div>
        <div className="w-12 h-12 bg-blue-900 rounded-2xl flex items-center justify-center">
          <svg
            aria-hidden="true"
            className="w-6 h-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 17v-2a4 4 0 014-4h6m-6 0a4 4 0 11-8 0 4 4 0 018 0zM3 7h12M3 11h6"
            />
          </svg>
        </div>
      </div>
      <Link
        href={viewHref}
        className="mt-5 inline-block w-full text-center py-3 rounded-xl bg-gray-100 text-gray-800 font-bold hover:bg-gray-200 transition-colors"
      >
        {viewLabel}
      </Link>
    </div>
  )
}
