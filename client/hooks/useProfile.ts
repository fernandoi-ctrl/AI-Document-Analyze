'use client'

import { useCallback, useEffect } from 'react'
import { useRouter } from '@/i18n/navigation'
import { useAuth } from '@/components/AuthProvider'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { getEntities as getAnalyses } from '@/store/slices/analyses.reducer'
import { logout as logoutAction } from '@/store/slices/auth.reducer'
import { usePayments } from '@/hooks/usePayments'
import type { AuthSession, AuthUser } from '@/types/auth'
import type { RootState } from '@/store'

interface UseProfileOptions {
  loginPath?: string
  homePath?: string
}

interface UseProfileResult {
  user: AuthUser | null
  session: AuthSession | null
  authLoading: boolean
  credits: number | null
  analysesCount: number | null
  buyingCredits: boolean
  ready: boolean
  buyCredits: () => Promise<void>
  signOut: () => void
}

export function useProfile(options: UseProfileOptions = {}): UseProfileResult {
  const { loginPath = '/login', homePath = '/' } = options
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user, session, loading: authLoading } = useAuth()

  const {
    credits,
    updating: buyingCredits,
    refreshCredits,
    buyCredits: requestCheckout,
  } = usePayments()

  const analysesCount = useAppSelector(
    (state: RootState) => state.analyses.totalItems,
  )

  useEffect(() => {
    if (!authLoading && !user) router.push(loginPath)
  }, [authLoading, user, router, loginPath])

  useEffect(() => {
    if (!user || !session) return
    refreshCredits()
    dispatch(getAnalyses())
  }, [dispatch, user, session, refreshCredits])

  const buyCredits = useCallback(async () => {
    const url = await requestCheckout()
    if (url) window.location.href = url
  }, [requestCheckout])

  const signOut = useCallback(() => {
    dispatch(logoutAction())
    router.push(homePath)
  }, [dispatch, router, homePath])

  return {
    user,
    session,
    authLoading,
    credits,
    analysesCount,
    buyingCredits,
    ready: !authLoading && !!user,
    buyCredits,
    signOut,
  }
}
