'use client'

import { useCallback, useEffect, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { getAvailability } from '@/store/slices/consultation.reducer'
import type { AvailabilitySlot } from '@/types/consultation'

function toIsoDate(date: Date): string {
  const y = date.getUTCFullYear()
  const m = String(date.getUTCMonth() + 1).padStart(2, '0')
  const d = String(date.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function useAvailability(
  lawyerId: string | null,
  date: Date | null,
  slotMinutes = 30,
) {
  const dispatch = useAppDispatch()
  const { availability, loadingAvailability, availabilityError } = useAppSelector(
    (s) => s.consultation,
  )

  const isoDate = useMemo(() => (date ? toIsoDate(date) : null), [date])

  const refresh = useCallback(() => {
    if (!lawyerId || !isoDate) return
    void dispatch(
      getAvailability({ lawyerId, query: { date: isoDate, slotMinutes } }),
    )
  }, [dispatch, lawyerId, isoDate, slotMinutes])

  useEffect(() => {
    refresh()
  }, [refresh])

  const slotsByDay = useMemo(() => groupByDay(availability), [availability])

  return {
    slots: availability,
    slotsByDay,
    loading: loadingAvailability,
    error: availabilityError,
    refresh,
  }
}

function groupByDay(slots: AvailabilitySlot[]): Record<string, AvailabilitySlot[]> {
  const grouped: Record<string, AvailabilitySlot[]> = {}
  for (const slot of slots) {
    const day = slot.start.slice(0, 10)
    if (!grouped[day]) grouped[day] = []
    grouped[day].push(slot)
  }
  return grouped
}
