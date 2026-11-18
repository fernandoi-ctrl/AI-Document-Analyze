'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { useAuth } from '@/components/AuthProvider'
import { useConsultations } from '@/hooks/useConsultations'
import { useAvailability } from '@/hooks/useAvailability'
import LawyerSelector from '@/components/consultations/LawyerSelector'
import AvailabilityCalendar from '@/components/consultations/AvailabilityCalendar'
import TimeSlotPicker from '@/components/consultations/TimeSlotPicker'
import ConsultationForm from '@/components/consultations/ConsultationForm'
import LoadingState from '@/components/consultations/LoadingState'
import ErrorState from '@/components/consultations/ErrorState'
import EmptyState from '@/components/consultations/EmptyState'
import type { AvailabilitySlot } from '@/types/consultation'

// export default function LawyerSchedulePage() {
//   const router = useRouter()
//   const params = useSearchParams()
//   const caseIdParam = params.get('caseId') ?? ''
//   const { user, loading: authLoading } = useAuth()

//   const {
//     lawyers,
//     loadingLawyers,
//     lawyersError,
//     loadLawyers,
//     create,
//     updating,
//     updateSuccess,
//     errorMessage,
//     entity,
//     resetUpdateSuccess,
//   } = useConsultations(false)

//   const [selectedLawyerId, setSelectedLawyerId] = useState<string | null>(null)
//   const [selectedDate, setSelectedDate] = useState<Date | null>(null)
//   const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null)

//   useEffect(() => {
//     if (!authLoading && !user) router.push('/login')
//   }, [authLoading, user, router])

//   useEffect(() => {
//     void loadLawyers()
//   }, [loadLawyers])

//   useEffect(() => {
//     if (updateSuccess && entity) {
//       resetUpdateSuccess()
//       router.push(`/consultations/${entity.id}`)
//     }
//   }, [updateSuccess, entity, resetUpdateSuccess, router])

//   const {
//     slots,
//     loading: loadingAvailability,
//     error: availabilityError,
//     refresh,
//   } = useAvailability(selectedLawyerId, selectedDate, 30)

//   const selectedLawyer = useMemo(
//     () => lawyers.find((l) => l.id === selectedLawyerId) ?? null,
//     [lawyers, selectedLawyerId],
//   )

//   const handleLawyerSelect = useCallback((id: string) => {
//     setSelectedLawyerId(id)
//     setSelectedSlot(null)
//   }, [])

//   const handleDateChange = useCallback((date: Date) => {
//     setSelectedDate(date)
//     setSelectedSlot(null)
//   }, [])

//   const handleSlotSelect = useCallback((slot: AvailabilitySlot) => {
//     setSelectedSlot(slot)
//   }, [])

//   if (authLoading || !user) return null

export default function LawyerSchedulePage() {
  const router = useRouter()
  const params = useSearchParams()
  const caseIdParam = params.get('caseId') ?? ''
  const { user, loading: authLoading } = useAuth()

  const {
    lawyers = [], // 👈 valor por defecto para evitar undefined
    loadingLawyers,
    lawyersError,
    loadLawyers,
    create,
    updating,
    updateSuccess,
    errorMessage,
    entity,
    resetUpdateSuccess,
  } = useConsultations(false)

  const [selectedLawyerId, setSelectedLawyerId] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null)

  useEffect(() => {
    if (!authLoading && !user) router.push('/login')
  }, [authLoading, user, router])

  useEffect(() => {
    void loadLawyers()
  }, [loadLawyers])

  useEffect(() => {
    if (updateSuccess && entity) {
      resetUpdateSuccess()
      router.push(`/consultations/${entity.id}`)
    }
  }, [updateSuccess, entity, resetUpdateSuccess, router])

  const {
    slots,
    loading: loadingAvailability,
    error: availabilityError,
    refresh,
  } = useAvailability(selectedLawyerId, selectedDate, 30)

  const selectedLawyer = useMemo(
    () =>
      Array.isArray(lawyers)
        ? lawyers.find((l) => l.id === selectedLawyerId) ?? null
        : null,
    [lawyers, selectedLawyerId],
  )

  const handleLawyerSelect = useCallback((id: string) => {
    setSelectedLawyerId(id)
    setSelectedSlot(null)
  }, [])

  const handleDateChange = useCallback((date: Date) => {
    setSelectedDate(date)
    setSelectedSlot(null)
  }, [])

  const handleSlotSelect = useCallback((slot: AvailabilitySlot) => {
    setSelectedSlot(slot)
  }, [])

  if (authLoading || !user) return null


  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-blue-900 text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400">
              <span className="text-xs font-black text-blue-900">LS</span>
            </div>
            <span className="text-lg font-black tracking-tight">Analiza tu juicio</span>
          </Link>
          <span className="text-sm text-white/70">Agendar consulta</span>
        </div>
      </header>

      <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6 sm:py-10">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-gray-900 sm:text-3xl">
            Agenda tu consulta legal
          </h1>
          <p className="text-sm text-gray-500 sm:text-base">
            Elige un abogado, escoge un horario y confirma tu videollamada en segundos.
          </p>
        </div>

        {!caseIdParam && (
          <ErrorState
            message="Esta página debe abrirse desde un caso (parámetro caseId en la URL)."
          />
        )}

        <Section title="1. Selecciona un abogado" step={1}>
          <LawyerSelector
            lawyers={lawyers}
            loading={loadingLawyers}
            error={lawyersError}
            selectedId={selectedLawyerId}
            onSelect={handleLawyerSelect}
            onRetry={() => void loadLawyers()}
          />
        </Section>

        <Section title="2. Elige una fecha" step={2} disabled={!selectedLawyerId}>
          {!selectedLawyerId ? (
            <EmptyState
              title="Selecciona primero un abogado"
              description="El calendario mostrará los días con horarios disponibles para el abogado elegido."
            />
          ) : (
            <AvailabilityCalendar
              selectedDate={selectedDate}
              availability={slots}
              onDateChange={handleDateChange}
            />
          )}
        </Section>

        <Section title="3. Escoge un horario" step={3} disabled={!selectedDate}>
          {selectedLawyer ? (
            <TimeSlotPicker
              date={selectedDate}
              slots={slots}
              loading={loadingAvailability}
              error={availabilityError}
              selectedStart={selectedSlot?.start ?? null}
              onSelect={handleSlotSelect}
              onRetry={refresh}
              lawyer={selectedLawyer}
            />
          ) : (
            <EmptyState
              title="Selecciona primero un abogado"
              description="Elige un abogado para ver sus horarios disponibles."
            />
          )}
        </Section>


        <Section
          title="4. Confirma los detalles"
          step={4}
          disabled={!selectedSlot || !selectedLawyer}
        >
          {selectedSlot && selectedLawyer ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
              <ConsultationForm
                lawyer={selectedLawyer}
                slot={selectedSlot}
                caseId={caseIdParam}
                submitting={updating}
                errorMessage={errorMessage}
                onSubmit={(payload) => {
                  void create(payload)
                }}
                onCancel={() => setSelectedSlot(null)}
              />
            </div>
          ) : (
            <EmptyState
              title="Aún no hay nada que confirmar"
              description="Completa los pasos anteriores para revisar y confirmar tu consulta."
            />
          )}
        </Section>

        {updating && <LoadingState label="Agendando tu consulta…" />}
      </div>
    </main>
  )


  function Section({
    title,
    step,
    disabled,
    children,
  }: {
    title: string
    step: number
    disabled?: boolean
    children: React.ReactNode
  }) {
    return (
      <section
        aria-labelledby={`section-${step}`}
        className={disabled ? 'opacity-60' : ''}
      >
        <h2
          id={`section-${step}`}
          className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-500"
        >
          {title}
        </h2>
        {children}
      </section>
    )
  }
}