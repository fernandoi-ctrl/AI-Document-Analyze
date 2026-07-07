'use client'

import { useCallback, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  clearAvailability,
  clearEntity,
  clearUpdateSuccess,
  createConsultation,
  deleteConsultation,
  getConsultation,
  getConsultations,
  getLawyers,
  updateConsultation,
} from '@/store/slices/consultation.reducer'
import type {
  CreateConsultationPayload,
  UpdateConsultationPayload,
} from '@/types/consultation'

export function useConsultations(autoFetch = true) {
  const dispatch = useAppDispatch()
  const state = useAppSelector((s) => s.consultation)

  useEffect(() => {
    if (autoFetch) {
      void dispatch(getConsultations())
    }
  }, [autoFetch, dispatch])

  const refetch = useCallback(() => dispatch(getConsultations()), [dispatch])
  const fetchOne = useCallback((id: string) => dispatch(getConsultation(id)), [dispatch])
  const create = useCallback(
    (payload: CreateConsultationPayload) => dispatch(createConsultation(payload)),
    [dispatch],
  )
  const update = useCallback(
    (id: string, payload: UpdateConsultationPayload) =>
      dispatch(updateConsultation({ id, payload })),
    [dispatch],
  )
  const remove = useCallback(
    (id: string) => dispatch(deleteConsultation(id)),
    [dispatch],
  )
  const loadLawyers = useCallback(() => dispatch(getLawyers()), [dispatch])
  const resetEntity = useCallback(() => dispatch(clearEntity()), [dispatch])
  const resetAvailability = useCallback(() => dispatch(clearAvailability()), [dispatch])
  const resetUpdateSuccess = useCallback(
    () => dispatch(clearUpdateSuccess()),
    [dispatch],
  )

  return {
    ...state,
    refetch,
    fetchOne,
    create,
    update,
    remove,
    loadLawyers,
    resetEntity,
    resetAvailability,
    resetUpdateSuccess,
  }
}
