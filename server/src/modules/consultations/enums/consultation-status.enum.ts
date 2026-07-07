export enum ConsultationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export const CONSULTATION_STATUSES: ConsultationStatus[] = [
  ConsultationStatus.PENDING,
  ConsultationStatus.CONFIRMED,
  ConsultationStatus.COMPLETED,
  ConsultationStatus.CANCELLED,
];

export const BLOCKING_STATUSES: ConsultationStatus[] = [
  ConsultationStatus.PENDING,
  ConsultationStatus.CONFIRMED,
];
