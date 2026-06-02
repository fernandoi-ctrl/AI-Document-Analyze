import type { AuthSession, AuthUser } from '@/types/auth'

const STORAGE_KEY = 'lexscan.session'
const SESSION_EVENT = 'lexscan:session-change'

export interface StoredSession {
  user: AuthUser
  session: AuthSession
}

function isBrowser(): boolean {
  return typeof window !== 'undefined'
}

export function readSession(): StoredSession | null {
  if (!isBrowser()) return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as StoredSession
  } catch {
    return null
  }
}

export function writeSession(value: StoredSession): void {
  if (!isBrowser()) return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  window.dispatchEvent(new CustomEvent(SESSION_EVENT))
}

export function clearSession(): void {
  if (!isBrowser()) return
  window.localStorage.removeItem(STORAGE_KEY)
  window.dispatchEvent(new CustomEvent(SESSION_EVENT))
}

export function getAccessToken(): string | null {
  return readSession()?.session.accessToken ?? null
}

export function subscribeToSession(listener: () => void): () => void {
  if (!isBrowser()) return () => { }
  const handler = () => listener()
  window.addEventListener(SESSION_EVENT, handler)
  window.addEventListener('storage', handler)
  return () => {
    window.removeEventListener(SESSION_EVENT, handler)
    window.removeEventListener('storage', handler)
  }
}
