'use client'

import { useCallback, useState, type FormEvent } from 'react'
import { useRouter } from '@/i18n/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  clearFeedback,
  loginUser,
  registerUser,
} from '@/store/slices/auth.reducer'
import type { AuthMode } from '@/types/auth'

interface UseAuthFormOptions {
  redirectTo?: string
}

interface UseAuthFormResult {
  mode: AuthMode
  email: string
  password: string
  updating: boolean
  errorMessage: string | null
  registerSuccess: boolean
  setEmail: (value: string) => void
  setPassword: (value: string) => void
  toggleMode: () => void
  submit: (event: FormEvent<HTMLFormElement>) => Promise<void>
}

export function useAuthForm(options: UseAuthFormOptions = {}): UseAuthFormResult {
  const { redirectTo = '/analyze' } = options
  const router = useRouter()
  const dispatch = useAppDispatch()

  const { updating, errorMessage, registerSuccess } = useAppSelector(
    (state: any) => state.auth,
  )

  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === 'login' ? 'register' : 'login'))
    dispatch(clearFeedback())
  }, [dispatch])

  const submit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      const credentials = { email, password }

      if (mode === 'login') {
        const result = await dispatch(loginUser(credentials))
        if (loginUser.fulfilled.match(result)) {
          router.push(redirectTo)
        }
        return
      }

      await dispatch(registerUser(credentials))
    },
    [dispatch, email, password, mode, redirectTo, router],
  )

  return {
    mode,
    email,
    password,
    updating,
    errorMessage,
    registerSuccess,
    setEmail,
    setPassword,
    toggleMode,
    submit,
  }
}