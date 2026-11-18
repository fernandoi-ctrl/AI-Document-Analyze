'use client'

import { useEffect, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { useAuth } from '@/components/AuthProvider'
import { useConsultations } from '@/hooks/useConsultations'
import ConsultationConfirmation from '@/components/consultations/ConsultationConfirmation'
import LoadingState from '@/components/consultations/LoadingState'
import ErrorState from '@/components/consultations/ErrorState'

export default function ConsultationDetailPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const consultationId = params?.id

  const { user, loading: authLoading } = useAuth()
  const {
    entity,
    loading,
    errorMessage,
    fetchOne,
    update,
    updating,
    lawyers,
    loadLawyers,
    resetEntity,
  } = useConsultations(false)

  useEffect(() => {
    if (!authLoading && !user) router.push('/login')
  }, [authLoading, user, router])

  useEffect(() => {
    if (consultationId) void fetchOne(consultationId)
    return () => {
      resetEntity()
    }
  }, [consultationId, fetchOne, resetEntity])

  useEffect(() => {
    void loadLawyers()
  }, [loadLawyers])

  const lawyer = useMemo(
    () => (entity ? lawyers.find((l) => l.id === entity.lawyerId) : undefined),
    [entity, lawyers],
  )

  if (authLoading || !user) return null

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-blue-900 text-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400">
              <span className="text-xs font-black text-blue-900">LS</span>
            </div>
            <span className="text-lg font-black tracking-tight">Analiza tu juicio</span>
          </Link>
          <span className="text-sm text-white/70">Detalle de la consulta</span>
        </div>
      </header>

      <div className="mx-auto max-w-3xl space-y-6 px-4 py-6 sm:px-6 sm:py-10">
        {loading && <LoadingState label="Cargando consulta…" />}
        {errorMessage && !loading && (
          <ErrorState
            message={errorMessage}
            onRetry={() => {
              if (consultationId) void fetchOne(consultationId)
            }}
          />
        )}
        {entity && !loading && (
          <ConsultationConfirmation
            consultation={entity}
            lawyer={lawyer}
            onBack={() => router.push('/')}
            canceling={updating}
            onCancel={() => {
              void update(entity.id, { status: 'CANCELLED' })
            }}
          />
        )}
      </div>
    </main>
  )
}
