import { apiRequest } from './apiClient'
import type {
  AvailabilityQuery,
  AvailabilitySlot,
  Consultation,
  CreateConsultationPayload,
  Lawyer,
  UpdateConsultationPayload,
} from '@/types/consultation'

const RESOURCE = '/consultations'

function buildQuery(params: Record<string, string | number | undefined>): string {
  const entries = Object.entries(params).filter(
    (entry): entry is [string, string | number] => entry[1] !== undefined && entry[1] !== '',
  )
  if (entries.length === 0) return ''
  const search = new URLSearchParams(
    entries.map(([key, value]) => [key, String(value)]),
  )
  return `?${search.toString()}`
}

export function fetchConsultations() {
  return apiRequest<Consultation[]>(RESOURCE)
}

export function fetchConsultation(id: string) {
  return apiRequest<Consultation>(`${RESOURCE}/${id}`)
}

export function fetchAvailability(lawyerId: string, query: AvailabilityQuery) {
  const qs = buildQuery({
    date: query.date,
    slotMinutes: query.slotMinutes,
  })
  return apiRequest<AvailabilitySlot[]>(`${RESOURCE}/availability/${lawyerId}${qs}`)
}

export function createConsultation(payload: CreateConsultationPayload) {
  return apiRequest<Consultation>(RESOURCE, {
    method: 'POST',
    body: payload,
  })
}

export function updateConsultation(id: string, payload: UpdateConsultationPayload) {
  return apiRequest<Consultation>(`${RESOURCE}/${id}`, {
    method: 'PUT',
    body: payload,
  })
}

export function deleteConsultation(id: string) {
  return apiRequest<void>(`${RESOURCE}/${id}`, {
    method: 'DELETE',
  })
}

export function fetchLawyers() {
  return apiRequest<Lawyer[]>('/lawyers')
}
