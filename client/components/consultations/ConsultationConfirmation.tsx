'use client'

import { useMemo } from 'react'
import {
  CONSULTATION_STATUS_COLORS,
  CONSULTATION_STATUS_LABELS,
  type Consultation,
  type Lawyer,
} from '@/types/consultation'

interface ConsultationConfirmationProps {
  consultation: Consultation
  lawyer?: Lawyer
  onBack?: () => void
  onCancel?: () => void
  canceling?: boolean
}

export default function ConsultationConfirmation({
  consultation,
  lawyer,
  onBack,
  onCancel,
  canceling,
}: ConsultationConfirmationProps) {
  const { dateLabel, timeLabel } = useMemo(
    () => formatScheduled(consultation.scheduledAt, consultation.durationMinutes),
    [consultation.scheduledAt, consultation.durationMinutes],
  )

  const statusClass = CONSULTATION_STATUS_COLORS[consultation.status]
  const statusLabel = CONSULTATION_STATUS_LABELS[consultation.status]

  return (
    <article className="space-y-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            aria-hidden="true"
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Consulta agendada</h2>
            <p className="text-sm text-gray-500">
              Te enviamos los detalles a tu correo.
            </p>
          </div>
        </div>
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClass}`}
          aria-label={`Estado: ${statusLabel}`}
        >
          {statusLabel}
        </span>
      </header>

      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Detail label="Fecha" value={dateLabel} />
        <Detail label="Hora" value={timeLabel} />
        <Detail
          label="Abogado"
          value={lawyer?.fullName ?? consultation.lawyerId}
          hint={lawyer?.specialty ?? undefined}
        />
        <Detail label="Duración" value={`${consultation.durationMinutes} min`} />
        {consultation.notes && (
          <div className="sm:col-span-2">
            <Detail label="Notas" value={consultation.notes} />
          </div>
        )}
        {consultation.meetingUrl && (
          <div className="sm:col-span-2">
            <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Enlace de videollamada
            </dt>
            <dd className="mt-1 break-all">
              <a
                href={consultation.meetingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-blue-700 underline decoration-blue-300 underline-offset-4 hover:text-blue-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                {consultation.meetingUrl}
              </a>
            </dd>
          </div>
        )}
      </dl>

      <footer className="flex flex-col gap-2 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="text-sm font-semibold text-gray-600 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            ← Volver al inicio
          </button>
        )}
        {onCancel && consultation.status !== 'CANCELLED' && consultation.status !== 'COMPLETED' && (
          <button
            type="button"
            onClick={onCancel}
            disabled={canceling}
            className="inline-flex items-center justify-center rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 disabled:opacity-60"
          >
            {canceling ? 'Cancelando…' : 'Cancelar consulta'}
          </button>
        )}
      </footer>
    </article>
  )
}

function Detail({
  label,
  value,
  hint,
}: {
  label: string
  value: string
  hint?: string
}) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-semibold text-gray-900">{value}</dd>
      {hint && <p className="mt-0.5 text-xs text-gray-500">{hint}</p>}
    </div>
  )
}

function formatScheduled(scheduledAt: string, durationMinutes: number) {
  const start = new Date(scheduledAt)
  const end = new Date(start.getTime() + durationMinutes * 60_000)
  const dateLabel = new Intl.DateTimeFormat('es', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(start)
  const time = new Intl.DateTimeFormat('es', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  const timeLabel = `${time.format(start)} – ${time.format(end)}`
  return { dateLabel, timeLabel }
}
