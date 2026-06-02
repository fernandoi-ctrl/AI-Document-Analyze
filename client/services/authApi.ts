import { apiRequest } from './apiClient'
import type {
  AuthCredentials,
  LoginResponse,
  RegisterResponse,
} from '@/types/auth'

export function loginRequest(credentials: AuthCredentials) {
  return apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: credentials,
    auth: false,
  })
}

export function registerRequest(credentials: AuthCredentials) {
  return apiRequest<RegisterResponse>('/auth/register', {
    method: 'POST',
    body: credentials,
    auth: false,
  })
}
// export interface AuthUser {
//   id: string
//   email: string
// }

// export interface AuthSession {
//   accessToken: string
//   refreshToken: string
//   expiresAt: number
// }

// export interface LoginResponse {
//   user: AuthUser
//   session: AuthSession
// }

// export interface RegisterResponse {
//   user: AuthUser
//   requiresEmailConfirmation: boolean
// }

// const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api'

// async function request<T>(path: string, body: unknown): Promise<T> {
//   const res = await fetch(`${API_URL}${path}`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(body),
//   })

//   const data = (await res.json().catch(() => null)) as { message?: string } | T | null

//   if (!res.ok) {
//     const message =
//       data && typeof data === 'object' && 'message' in data && typeof data.message === 'string'
//         ? data.message
//         : `Request failed with status ${res.status}`
//     throw new Error(message)
//   }

//   return data as T
// }

// export function login(email: string, password: string): Promise<LoginResponse> {
//   return request<LoginResponse>('/auth/login', { email, password })
// }

// export function register(email: string, password: string): Promise<RegisterResponse> {
//   return request<RegisterResponse>('/auth/register', { email, password })
// }
