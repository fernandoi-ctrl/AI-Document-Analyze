'use client'

interface CreditsCardProps {
  label: string
  hint: string
  credits: number | null
  buyLabel: string
  redirectingLabel: string
  buying: boolean
  onBuy: () => void
}

export default function CreditsCard({
  label,
  hint,
  credits,
  buyLabel,
  redirectingLabel,
  buying,
  onBuy,
}: CreditsCardProps) {
  return (
    <div className="bg-gradient-to-br from-amber-400 to-amber-500 rounded-3xl p-6 text-blue-900 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide opacity-70">
            {label}
          </p>
          <p className="text-5xl font-black mt-2">
            {credits === null ? '—' : credits}
          </p>
          <p className="text-xs mt-1 opacity-80">{hint}</p>
        </div>
        <div className="w-12 h-12 bg-blue-900 rounded-2xl flex items-center justify-center">
          <svg
            aria-hidden="true"
            className="w-6 h-6 text-amber-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>
      <button
        type="button"
        onClick={onBuy}
        disabled={buying}
        className="mt-5 w-full py-3 rounded-xl bg-blue-900 text-amber-400 font-bold hover:bg-blue-800 transition-colors disabled:opacity-60"
      >
        {buying ? redirectingLabel : buyLabel}
      </button>
    </div>
  )
}
