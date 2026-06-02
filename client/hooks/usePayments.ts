'use client'

import { useCallback, useEffect } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  clearCheckoutUrl,
  createCheckout,
  getCredits,
} from '@/store/slices/payments.reducer'
import type { RootState } from '@/store'

interface UsePaymentsOptions {
  autoLoadCredits?: boolean
}

interface UsePaymentsResult {
  credits: number | null
  loading: boolean
  updating: boolean
  errorMessage: string | null
  refreshCredits: () => void
  buyCredits: () => Promise<string | null>
  resetCheckoutUrl: () => void
}

export function usePayments(options: UsePaymentsOptions = {}): UsePaymentsResult {
  const { autoLoadCredits = false } = options
  const dispatch = useAppDispatch()
  const { user, session } = useAuth()

  const credits = useAppSelector((state: RootState) => state.payments.credits)
  const loading = useAppSelector((state: RootState) => state.payments.loading)
  const updating = useAppSelector((state: RootState) => state.payments.updating)
  const errorMessage = useAppSelector(
    (state: RootState) => state.payments.errorMessage,
  )

  const refreshCredits = useCallback(() => {
    if (!user || !session) return
    dispatch(getCredits())
  }, [dispatch, user, session])

  useEffect(() => {
    if (!autoLoadCredits) return
    refreshCredits()
  }, [autoLoadCredits, refreshCredits])

  const buyCredits = useCallback(async (): Promise<string | null> => {
    if (!session) return null
    const result = await dispatch(createCheckout())
    return createCheckout.fulfilled.match(result) ? result.payload : null
  }, [dispatch, session])

  const resetCheckoutUrl = useCallback(() => {
    dispatch(clearCheckoutUrl())
  }, [dispatch])

  return {
    credits,
    loading,
    updating,
    errorMessage,
    refreshCredits,
    buyCredits,
    resetCheckoutUrl,
  }
}
