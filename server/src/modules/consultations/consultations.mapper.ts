import { Injectable } from '@nestjs/common';
import { ConsultationResponseDto } from './dto/consultation-response.dto';
import { ConsultationStatus } from './enums/consultation-status.enum';

export interface ConsultationRow {
  id: string;
  case_id: string;
  lawyer_id: string;
  user_id: string;
  scheduled_at: string;
  duration_minutes: number;
  notes: string | null;
  meeting_url: string | null;
  status: ConsultationStatus;
  created_at: string;
  updated_at: string;
}

export interface ConsultationInsertPayload {
  case_id: string;
  lawyer_id: string;
  user_id: string;
  scheduled_at: string;
  duration_minutes: number;
  notes: string | null;
  meeting_url: string | null;
  status: ConsultationStatus;
}

export interface ConsultationUpdatePayload {
  scheduled_at?: string;
  duration_minutes?: number;
  notes?: string | null;
  meeting_url?: string | null;
  status?: ConsultationStatus;
}

@Injectable()
export class ConsultationsMapper {
  toResponse(row: ConsultationRow): ConsultationResponseDto {
    return {
      id: row.id,
      caseId: row.case_id,
      lawyerId: row.lawyer_id,
      userId: row.user_id,
      scheduledAt: row.scheduled_at,
      durationMinutes: row.duration_minutes,
      notes: row.notes,
      meetingUrl: row.meeting_url,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  toResponseList(rows: ConsultationRow[]): ConsultationResponseDto[] {
    return rows.map((r) => this.toResponse(r));
  }
}
