export type ConsultationStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'CANCELLED'

export interface Consultation {
  id: string
  caseId: string
  lawyerId: string
  userId: string
  scheduledAt: string
  durationMinutes: number
  notes: string | null
  meetingUrl: string | null
  status: ConsultationStatus
  createdAt: string
  updatedAt: string
}

export interface AvailabilitySlot {
  start: string
  end: string
}

export interface Lawyer {
  id: string
  userId: string
  fullName: string
  specialty: string | null
  avatarUrl: string | null
  timezone?: string
}

export interface CreateConsultationPayload {
  caseId: string
  lawyerId: string
  scheduledAt: string
  durationMinutes?: number
  notes?: string
  meetingUrl?: string
}

export interface UpdateConsultationPayload {
  scheduledAt?: string
  durationMinutes?: number
  notes?: string
  meetingUrl?: string
  status?: ConsultationStatus
}

export interface AvailabilityQuery {
  date: string
  slotMinutes?: number
}

export const CONSULTATION_STATUS_LABELS: Record<ConsultationStatus, string> = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmada',
  COMPLETED: 'Completada',
  CANCELLED: 'Cancelada',
}

export const CONSULTATION_STATUS_COLORS: Record<ConsultationStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-800 border-amber-200',
  CONFIRMED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  COMPLETED: 'bg-slate-100 text-slate-700 border-slate-200',
  CANCELLED: 'bg-rose-100 text-rose-800 border-rose-200',
}

export const DURATION_OPTIONS: { value: number; label: string }[] = [
  { value: 15, label: '15 minutos' },
  { value: 30, label: '30 minutos' },
  { value: 45, label: '45 minutos' },
  { value: 60, label: '1 hora' },
  { value: 90, label: '1 h 30 min' },
  { value: 120, label: '2 horas' },
]
