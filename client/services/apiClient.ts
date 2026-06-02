import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type RawAxiosResponseHeaders,
  type AxiosResponseHeaders,
} from 'axios'
import { getAccessToken } from '@/lib/sessionStorage'
import { supabase } from '@/lib/supabase'

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api'

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: unknown
  formData?: FormData
  auth?: boolean
}

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message)
    this.name = 'ApiError'
  }
}

export interface ApiResponse<T> {
  data: T
  status: number
  headers: RawAxiosResponseHeaders | AxiosResponseHeaders
}

const http = axios.create({ baseURL: API_URL })

async function authHeader(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// export async function apiRequest<T>(
//   path: string,
//   options: RequestOptions = {},
// // ): Promise<ApiResponse<T>> {
//   // const { data: { session } } = await supabase.auth.getSession()
//   // console.log(session?.access_token)
//   // const token = getAccessToken();
//   // console.log("Token usado en peticion", token);
//   const { method = 'GET', body, formData, auth = true } = options

//   const headers: Record<string, string> = {
//     ...(auth ? authHeader() : {}),
//   }

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
export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<ApiResponse<T>> {
  const { method = 'GET', body, formData, auth = true } = options

  const headers: Record<string, string> = auth ? await authHeader() : {}

  const config: AxiosRequestConfig = { url: path, method, headers }

  if (formData) {
    config.data = formData
  } else if (body !== undefined) {
    config.data = body
  }

  try {
    const res = await http.request<T>(config)
    return {
      data: res.data,
      status: res.status,
      headers: res.headers,
    }
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
      throw new ApiError(message, status)
    }
    throw err
  }
}
export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, formData, auth = true } = options

  const headers: Record<string, string> = auth ? await authHeader() : {}

  const config: AxiosRequestConfig = {
    url: `${API_URL}${path}`,
    method,
    headers,
  }

  if (formData) {
    config.data = formData
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
    config.data = body
  }

  try {
    const res = await axios.request<T>(config)
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
      throw new ApiError(message, status)
    }
    throw err
  }
}