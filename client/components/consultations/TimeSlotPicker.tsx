'use client'

import { useMemo } from 'react'
import type { AvailabilitySlot } from '@/types/consultation'
import LoadingState from './LoadingState'
import ErrorState from './ErrorState'
import EmptyState from './EmptyState'

interface TimeSlotPickerProps {
  date: Date | null
  slots: AvailabilitySlot[]
  loading: boolean
  error: string | null
  selectedStart: string | null
  onSelect: (slot: AvailabilitySlot) => void
  onRetry?: () => void
}

export default function TimeSlotPicker({
  date,
  slots,
  loading,
  error,
  selectedStart,
  onSelect,
  onRetry,
}: TimeSlotPickerProps) {
  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat('es', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
    [],
  )

  if (!date) {
    return (
      <EmptyState
        title="Elige una fecha"
        description="Selecciona un día en el calendario para ver los horarios disponibles."
      />
    )
  }
  if (loading) return <LoadingState label="Cargando horarios…" />
  if (error) return <ErrorState message={error} onRetry={onRetry} />
  if (slots.length === 0) {
    return (
      <EmptyState
        title="Sin horarios disponibles"
        description="El abogado no tiene horarios libres para esta fecha. Prueba con otro día."
      />
    )
  }

  return (
    <ul
      role="radiogroup"
      aria-label="Seleccionar horario disponible"
      className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4"
    >
      {slots.map((slot) => {
        const isSelected = slot.start === selectedStart
        return (
          <li key={slot.start}>
            <button
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelect(slot)}
              className={`w-full rounded-xl border-2 px-3 py-2.5 text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                isSelected
                  ? 'border-blue-600 bg-blue-600 text-white shadow-md'
                  : 'border-gray-200 bg-white text-gray-800 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              {formatter.format(new Date(slot.start))}
            </button>
          </li>
        )
      })}
    </ul>
  )
}
