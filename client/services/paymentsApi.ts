import { apiFetch, apiRequest } from './apiClient'

export interface CreditsResponse {
  credits: number
}

export interface CheckoutResponse {
  url: string
}

export function fetchCredits() {
  return apiRequest<CreditsResponse>('/payments/credits')
}

export function startCheckout() {
  return apiRequest<CheckoutResponse>('/payments/checkout', {
    method: 'POST',
    body: {},
  })
}

export function createCheckout(): Promise<{ url: string }> {
  return apiFetch<{ url: string }>('/payments/checkout', { method: 'POST', body: {} })
}
