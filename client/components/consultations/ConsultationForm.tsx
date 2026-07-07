'use client'

import { useId, useMemo, useState } from 'react'
import {
  DURATION_OPTIONS,
  type AvailabilitySlot,
  type CreateConsultationPayload,
  type Lawyer,
} from '@/types/consultation'

interface ConsultationFormProps {
  lawyer: Lawyer
  slot: AvailabilitySlot
  caseId: string
  defaultDurationMinutes?: number
  submitting: boolean
  errorMessage: string | null
  onSubmit: (payload: CreateConsultationPayload) => void
  onCancel?: () => void
}

const MAX_NOTES = 2000

export default function ConsultationForm({
  lawyer,
  slot,
  caseId,
  defaultDurationMinutes = 30,
  submitting,
  errorMessage,
  onSubmit,
  onCancel,
}: ConsultationFormProps) {
  const [duration, setDuration] = useState<number>(defaultDurationMinutes)
  const [notes, setNotes] = useState<string>('')
  const [validationError, setValidationError] = useState<string | null>(null)

  const durationId = useId()
  const notesId = useId()

  const slotLabel = useMemo(() => formatSlot(slot), [slot])

  const error = validationError ?? errorMessage

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setValidationError(null)

    if (!caseId) {
      setValidationError('Falta vincular un caso a esta consulta.')
      return
    }

    const payload: CreateConsultationPayload = {
      caseId,
      lawyerId: lawyer.id,
      scheduledAt: slot.start,
      durationMinutes: duration,
    }
    const trimmedNotes = notes.trim()
    if (trimmedNotes) payload.notes = trimmedNotes
    onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" aria-busy={submitting}>
      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
        <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-medium text-gray-500">Abogado</dt>
            <dd className="mt-0.5 font-semibold text-gray-900">{lawyer.fullName}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">Horario</dt>
            <dd className="mt-0.5 font-semibold text-gray-900">{slotLabel}</dd>
          </div>
        </dl>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor={durationId}
          className="block text-sm font-semibold text-gray-800"
        >
          Duración
        </label>
        <select
          id={durationId}
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          disabled={submitting}
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        >
          {DURATION_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label htmlFor={notesId} className="block text-sm font-semibold text-gray-800">
          Notas para el abogado{' '}
          <span className="font-normal text-gray-400">(opcional)</span>
        </label>
        <textarea
          id={notesId}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={MAX_NOTES}
          rows={4}
          disabled={submitting}
          placeholder="Describe brevemente lo que necesitas conversar…"
          className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        />
        <p className="text-right text-xs text-gray-400">
          {notes.length}/{MAX_NOTES}
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {error}
        </div>
      )}

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-60"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-60"
        >
          {submitting && (
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
              <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          {submitting ? 'Agendando…' : 'Confirmar consulta'}
        </button>
      </div>
    </form>
  )
}

function formatSlot(slot: AvailabilitySlot): string {
  const start = new Date(slot.start)
  const end = new Date(slot.end)
  const day = new Intl.DateTimeFormat('es', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(start)
  const time = new Intl.DateTimeFormat('es', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  return `${day} · ${time.format(start)}–${time.format(end)}`
}
