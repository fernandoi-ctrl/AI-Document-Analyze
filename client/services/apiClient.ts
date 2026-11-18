// import axios, {
//   AxiosError,
//   type AxiosRequestConfig,
//   type RawAxiosResponseHeaders,
//   type AxiosResponseHeaders,
// } from 'axios'
// import { getAccessToken } from '@/lib/sessionStorage'

// export const API_URL =
//   process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api'

// interface RequestOptions {
//   method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
//   body?: unknown
//   formData?: FormData
//   auth?: boolean
// }

// export class ApiError extends Error {
//   constructor(message: string, public readonly status: number) {
//     super(message)
//     this.name = 'ApiError'
//   }
// }

// export interface ApiResponse<T> {
//   data: T
//   status: number
//   headers: RawAxiosResponseHeaders | AxiosResponseHeaders
// }

// const http = axios.create({ baseURL: API_URL })

// async function authHeader(): Promise<Record<string, string>> {
//   const token = getAccessToken() // tu helper que lo lee de sessionStorage/localStorage
//   return token ? { Authorization: `Bearer ${token}` } : {}
// }

// export async function apiRequest<T>(
//   path: string,
//   options: RequestOptions = {},
// ): Promise<ApiResponse<T>> {
//   const { method = 'GET', body, formData, auth = true } = options

//   const headers: Record<string, string> = auth ? await authHeader() : {}

//   const config: AxiosRequestConfig = { url: path, method, headers }

//   if (formData) {
//     config.data = formData
//   } else if (body !== undefined) {
//     config.data = body
//   }

//   try {
//     const res = await http.request<T>(config)
//     return {
//       data: res.data,
//       status: res.status,
//       headers: res.headers,
//     }
//   } catch (err) {
//     if (err instanceof AxiosError) {
//       const status = err.response?.status ?? 0
//       const data = err.response?.data as { message?: unknown } | undefined
//       const message =
//         data && typeof data.message === 'string'
//           ? data.message
//           : status
//             ? `Request failed with status ${status}`
//             : err.message
//       throw new ApiError(message, status)
//     }
//     throw err
//   }
// }

// export async function apiFetch<T>(
//   path: string,
//   options: RequestOptions = {},
// ): Promise<T> {
//   const { method = 'GET', body, formData, auth = true } = options

//   const headers: Record<string, string> = auth ? await authHeader() : {}

//   const config: AxiosRequestConfig = {
//     url: `${API_URL}${path}`,
//     method,
//     headers,
//   }

//   if (formData) {
//     config.data = formData
//   } else if (body !== undefined) {
//     headers['Content-Type'] = 'application/json'
//     config.data = body
//   }

//   try {
//     const res = await axios.request<T>(config)
//     return res.data
//   } catch (err) {
//     if (err instanceof AxiosError) {
//       const status = err.response?.status ?? 0
//       const data = err.response?.data as { message?: unknown } | undefined
//       const message =
//         data && typeof data.message === 'string'
//           ? data.message
//           : status
//             ? `Request failed with status ${status}`
//             : err.message
//       throw new ApiError(message, status)
//     }
//     throw err
//   }
// }
import axios, { AxiosError, AxiosRequestConfig, AxiosRequestHeaders } from 'axios'
import { getAccessToken, readSession, writeSession, clearSession } from '@/lib/sessionStorage'
import { ApiError } from 'next/dist/server/api-utils'
import { supabase } from '@/lib/supabase'

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api'

const http = axios.create({ baseURL: API_URL })

// Interceptor de request: añade el accessToken
http.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    // Usa el método set en vez de asignar un objeto
    // config.headers?.set('Authorization', `Bearer ${token}`)
    (config.headers as AxiosRequestHeaders).set('Authorization', `Bearer ${token}`)
  } else {
    config.headers = { Authorization: `Bearer ${token}` } as AxiosRequestHeaders
  }
  return config
})

// Interceptor de response: maneja 401 y refresca
http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const session = readSession()
      const refreshToken = session?.session.refreshToken
      if (!refreshToken) {
        clearSession()
        return Promise.reject(error)
      }

      try {
        // pedir nuevo accessToken
        const res = await axios.post(`${API_URL}/auth/refresh`, { refreshToken })
        const newAccessToken = res.data.accessToken

        // actualizar sesión
        const updated = {
          ...session!,
          session: {
            ...session!.session,
            accessToken: newAccessToken,
            expiresAt: Date.now() + 3600 * 1000,
          },
        }
        writeSession(updated)
        // reintentar la petición original con el nuevo token
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newAccessToken}`,
        }
        return http(originalRequest)
      } catch (refreshError) {
        clearSession()
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

// Función genérica para peticiones
export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {

  console.log(await readSession())
  const { method = 'GET', body, formData } = options
  const config: AxiosRequestConfig = { url: path, method }

  if (formData) {
    config.data = formData
  } else if (body !== undefined) {
    config.data = body
  }

  const res = await http.request<T>(config)
  return res.data
}
export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = 'GET', body, formData, auth = true } = options
  const config: AxiosRequestConfig = {
    url: `${API_URL}${path}`,
    method,
  }
  if (formData) {
    config.data = formData
  } else if (body !== undefined) {
    config.data = body
    config.headers = {
      ...(config.headers || {}),
      'Content-Type': 'application/json',
    }
  }

  try {
    // 👇 usamos el mismo cliente http con interceptores
    const res = await http.request<T>(config)
    console.log(res)
    return res.data
  } catch (err) {
    if (err instanceof AxiosError) {
      const status = err.response?.status ?? 0
      const data = err.response?.data as { message?: unknown } | undefined
      const message =
        data && typeof data.message === 'string'
          ? data.message
          : status
            ? `Request failed with status ${status}`
            : err.message
      throw new ApiError(status, message)
    }
    throw err
  }
}
// client/services/apiClient.ts
export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: unknown
  formData?: FormData
  auth?: boolean
}
export { ApiError }

