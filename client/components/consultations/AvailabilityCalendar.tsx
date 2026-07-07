'use client'

import { useMemo, useRef } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import esLocale from '@fullcalendar/core/locales/es'
import type {
  DateSelectArg,
  DatesSetArg,
  EventClickArg,
  EventInput,
} from '@fullcalendar/core'
import type { AvailabilitySlot } from '@/types/consultation'

interface AvailabilityCalendarProps {
  selectedDate: Date | null
  availability: AvailabilitySlot[]
  onDateChange: (date: Date) => void
  onMonthChange?: (month: Date) => void
}

export default function AvailabilityCalendar({
  selectedDate,
  availability,
  onDateChange,
  onMonthChange,
}: AvailabilityCalendarProps) {
  const calendarRef = useRef<FullCalendar | null>(null)

  const events: EventInput[] = useMemo(() => {
    const byDay = new Map<string, number>()
    for (const slot of availability) {
      const day = slot.start.slice(0, 10)
      byDay.set(day, (byDay.get(day) ?? 0) + 1)
    }
    return Array.from(byDay.entries()).map(([day, count]) => ({
      id: `availability-${day}`,
      title: `${count} ${count === 1 ? 'horario' : 'horarios'}`,
      start: day,
      allDay: true,
      classNames: ['lex-availability-event'],
    }))
  }, [availability])

  const selectedIso = useMemo(() => {
    if (!selectedDate) return null
    const y = selectedDate.getUTCFullYear()
    const m = String(selectedDate.getUTCMonth() + 1).padStart(2, '0')
    const d = String(selectedDate.getUTCDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }, [selectedDate])

  function handleDateSelect(arg: DateSelectArg) {
    onDateChange(arg.start)
  }

  function handleEventClick(arg: EventClickArg) {
    if (arg.event.start) onDateChange(arg.event.start)
  }

  function handleDatesSet(arg: DatesSetArg) {
    if (onMonthChange) {
      const mid = new Date((arg.start.getTime() + arg.end.getTime()) / 2)
      onMonthChange(mid)
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-2 sm:p-4">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale={esLocale}
        firstDay={1}
        height="auto"
        selectable
        selectMirror
        unselectAuto
        events={events}
        select={handleDateSelect}
        eventClick={handleEventClick}
        datesSet={handleDatesSet}
        dayCellClassNames={(arg) => {
          const day = arg.date.toISOString().slice(0, 10)
          if (day === selectedIso) return ['lex-day-selected']
          if (arg.isPast) return ['lex-day-past']
          return []
        }}
        headerToolbar={{
          left: 'prev',
          center: 'title',
          right: 'next today',
        }}
        buttonText={{ today: 'Hoy' }}
        validRange={{ start: new Date() }}
      />
      <style jsx global>{`
        .lex-availability-event {
          background-color: #1d4ed8 !important;
          border-color: #1d4ed8 !important;
          color: #fff !important;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 9999px;
          font-size: 11px;
        }
        .lex-day-selected {
          background-color: #dbeafe !important;
        }
        .lex-day-past {
          opacity: 0.45;
        }
        .fc .fc-button {
          background-color: #1e3a8a;
          border-color: #1e3a8a;
          border-radius: 0.75rem;
          font-weight: 600;
          text-transform: capitalize;
        }
        .fc .fc-button:hover {
          background-color: #1e40af;
          border-color: #1e40af;
        }
        .fc .fc-button-primary:not(:disabled).fc-button-active {
          background-color: #1e40af;
        }
        .fc .fc-toolbar-title {
          font-size: 1.125rem;
          font-weight: 700;
          text-transform: capitalize;
        }
        .fc .fc-daygrid-day-number {
          padding: 6px 8px;
          font-weight: 500;
        }
      `}</style>
    </div>
  )
}
