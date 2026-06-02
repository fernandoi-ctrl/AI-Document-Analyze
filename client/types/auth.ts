export interface AuthUser {
  id: string
  email: string
  createdAt?: string
  lastSignInAt?: string
  fullName?: string
}

export interface AuthSession {
  accessToken: string
  refreshToken: string
  expiresAt: number
}

export interface LoginResponse {
  user: AuthUser
  session: AuthSession
}

export interface RegisterResponse {
  user: AuthUser
  requiresEmailConfirmation: boolean
}

export interface AuthCredentials {
  email: string
  password: string
}

export type AuthMode = 'login' | 'register'
