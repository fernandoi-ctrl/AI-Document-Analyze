'use client'

import type { Lawyer } from '@/types/consultation'
import LoadingState from './LoadingState'
import ErrorState from './ErrorState'
import EmptyState from './EmptyState'

interface LawyerSelectorProps {
  lawyers: Lawyer[]
  loading: boolean
  error: string | null
  selectedId: string | null
  onSelect: (lawyerId: string) => void
  onRetry?: () => void
}

export default function LawyerSelector({
  lawyers,
  loading,
  error,
  selectedId,
  onSelect,
  onRetry,
}: LawyerSelectorProps) {
  if (loading) return <LoadingState label="Buscando abogados disponibles…" />
  if (error) return <ErrorState message={error} onRetry={onRetry} />
  if (lawyers.length === 0) {
    return (
      <EmptyState
        title="No hay abogados disponibles"
        description="Aún no se han registrado abogados en la plataforma. Vuelve a intentarlo más tarde."
      />
    )
  }

  return (
    <ul
      role="radiogroup"
      aria-label="Seleccionar abogado"
      className="grid grid-cols-1 gap-3 sm:grid-cols-2"
    >
      {lawyers.map((lawyer) => {
        const isSelected = lawyer.id === selectedId
        return (
          <li key={lawyer.id}>
            <button
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelect(lawyer.id)}
              className={`flex w-full items-center gap-3 rounded-2xl border-2 p-4 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                isSelected
                  ? 'border-blue-600 bg-blue-50 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Avatar lawyer={lawyer} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-gray-900">
                  {lawyer.fullName}
                </p>
                {lawyer.specialty && (
                  <p className="truncate text-xs text-gray-500">{lawyer.specialty}</p>
                )}
              </div>
              {isSelected && (
                <svg
                  className="h-5 w-5 flex-shrink-0 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>
          </li>
        )
      })}
    </ul>
  )
}

function Avatar({ lawyer }: { lawyer: Lawyer }) {
  if (lawyer.avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={lawyer.avatarUrl}
        alt=""
        className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
      />
    )
  }
  const initials = lawyer.fullName
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
  return (
    <div
      aria-hidden="true"
      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700"
    >
      {initials || 'AB'}
    </div>
  )
}
