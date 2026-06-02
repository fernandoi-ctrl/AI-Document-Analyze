'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import {
  readSession,
  subscribeToSession,
  type StoredSession,
} from '@/lib/sessionStorage'
import type { AuthSession, AuthUser } from '@/types/auth'

interface AuthContextValue {
  session: AuthSession | null
  user: AuthUser | null
  loading: boolean
}

const AuthContext = createContext<AuthContextValue>({
  session: null,
  user: null,
  loading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [stored, setStored] = useState<StoredSession | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setStored(readSession())
    setLoading(false)

    return subscribeToSession(() => {
      setStored(readSession())
    })
  }, [])

  return (
    <AuthContext.Provider
      value={{
        session: stored?.session ?? null,
        user: stored?.user ?? null,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
