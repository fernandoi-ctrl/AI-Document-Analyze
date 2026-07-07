import { ConsultationStatus } from '../enums/consultation-status.enum';

export interface ConsultationResponseDto {
  id: string;
  caseId: string;
  lawyerId: string;
  userId: string;
  scheduledAt: string;
  durationMinutes: number;
  notes: string | null;
  meetingUrl: string | null;
  status: ConsultationStatus;
  createdAt: string;
  updatedAt: string;
}
