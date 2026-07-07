import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConsultationsRepository, LawyerRow } from './consultations.repository';
import {
  ConsultationsMapper,
  ConsultationInsertPayload,
  ConsultationRow,
  ConsultationUpdatePayload,
} from './consultations.mapper';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';
import { ConsultationResponseDto } from './dto/consultation-response.dto';
import { AvailabilityQueryDto } from './dto/availability-query.dto';
import { AvailabilitySlotDto } from './dto/availability-slot.dto';
import {
  BLOCKING_STATUSES,
  ConsultationStatus,
} from './enums/consultation-status.enum';

const DEFAULT_DURATION_MINUTES = 30;
const DEFAULT_SLOT_MINUTES = 30;

@Injectable()
export class ConsultationsService {
  constructor(
    private readonly repo: ConsultationsRepository,
    private readonly mapper: ConsultationsMapper,
  ) {}

  async list(userId: string): Promise<ConsultationResponseDto[]> {
    const rows = await this.repo.listForUser(userId);
    return this.mapper.toResponseList(rows);
  }

  async findOne(id: string, userId: string): Promise<ConsultationResponseDto> {
    const row = await this.loadOwned(id, userId);
    return this.mapper.toResponse(row);
  }

  async create(
    userId: string,
    dto: CreateConsultationDto,
  ): Promise<ConsultationResponseDto> {
    const scheduledAt = this.parseFutureDate(dto.scheduledAt);
    const durationMinutes = dto.durationMinutes ?? DEFAULT_DURATION_MINUTES;

    await this.ensureUserExists(userId);
    await this.ensureLawyerExists(dto.lawyerId);
    await this.ensureNoOverlap({
      lawyerId: dto.lawyerId,
      scheduledAt,
      durationMinutes,
    });

    const payload: ConsultationInsertPayload = {
      case_id: dto.caseId,
      lawyer_id: dto.lawyerId,
      user_id: userId,
      scheduled_at: scheduledAt.toISOString(),
      duration_minutes: durationMinutes,
      notes: dto.notes ?? null,
      meeting_url: dto.meetingUrl ?? null,
      status: ConsultationStatus.PENDING,
    };

    const row = await this.repo.create(payload);
    return this.mapper.toResponse(row);
  }

  async update(
    id: string,
    userId: string,
    dto: UpdateConsultationDto,
  ): Promise<ConsultationResponseDto> {
    if (Object.keys(dto).length === 0) {
      throw new BadRequestException('No hay campos para actualizar.');
    }

    const existing = await this.loadOwned(id, userId);
    this.ensureMutable(existing);

    const nextScheduledAt = dto.scheduledAt
      ? this.parseFutureDate(dto.scheduledAt)
      : new Date(existing.scheduled_at);
    const nextDuration = dto.durationMinutes ?? existing.duration_minutes;

    const reschedules =
      dto.scheduledAt !== undefined || dto.durationMinutes !== undefined;
    const willBlock =
      dto.status === undefined
        ? BLOCKING_STATUSES.includes(existing.status)
        : BLOCKING_STATUSES.includes(dto.status);

    if (reschedules && willBlock) {
      await this.ensureNoOverlap({
        lawyerId: existing.lawyer_id,
        scheduledAt: nextScheduledAt,
        durationMinutes: nextDuration,
        excludeId: id,
      });
    }

    const payload: ConsultationUpdatePayload = {};
    if (dto.scheduledAt !== undefined) payload.scheduled_at = nextScheduledAt.toISOString();
    if (dto.durationMinutes !== undefined) payload.duration_minutes = dto.durationMinutes;
    if (dto.notes !== undefined) payload.notes = dto.notes;
    if (dto.meetingUrl !== undefined) payload.meeting_url = dto.meetingUrl;
    if (dto.status !== undefined) payload.status = dto.status;

    const row = await this.repo.update(id, payload);
    return this.mapper.toResponse(row);
  }

  async remove(id: string, userId: string): Promise<void> {
    const existing = await this.loadOwned(id, userId);
    this.ensureMutable(existing);
    await this.repo.delete(id);
  }

  async getAvailability(
    lawyerId: string,
    query: AvailabilityQueryDto,
  ): Promise<AvailabilitySlotDto[]> {
    const lawyer = await this.repo.findLawyerById(lawyerId);
    if (!lawyer) {
      throw new NotFoundException('Abogado no encontrado.');
    }

    const { dayStart, dayEnd } = this.buildDayWindow(query.date);
    const slotMinutes = query.slotMinutes ?? DEFAULT_SLOT_MINUTES;
    const bookings = await this.repo.listForLawyerOnDay(lawyerId, dayStart, dayEnd);

    return this.computeFreeSlots({
      dayStart,
      dayEnd,
      lawyer,
      bookings,
      slotMinutes,
      now: new Date(),
    });
  }

  private async loadOwned(id: string, userId: string): Promise<ConsultationRow> {
    const row = await this.repo.findById(id);
    if (row.user_id !== userId) {
      throw new ForbiddenException('No tienes acceso a esta consulta.');
    }
    return row;
  }

  private ensureMutable(row: ConsultationRow): void {
    if (row.status === ConsultationStatus.COMPLETED) {
      throw new BadRequestException('No se puede modificar una consulta completada.');
    }
    if (row.status === ConsultationStatus.CANCELLED) {
      throw new BadRequestException('No se puede modificar una consulta cancelada.');
    }
  }

  private parseFutureDate(value: string): Date {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException('Fecha inválida.');
    }
    if (date.getTime() <= Date.now()) {
      throw new BadRequestException('No se permiten citas en el pasado.');
    }
    return date;
  }

  private async ensureUserExists(userId: string): Promise<void> {
    const exists = await this.repo.userExists(userId);
    if (!exists) {
      throw new NotFoundException('Usuario no encontrado.');
    }
  }

  private async ensureLawyerExists(lawyerId: string): Promise<void> {
    const lawyer = await this.repo.findLawyerById(lawyerId);
    if (!lawyer) {
      throw new NotFoundException('Abogado no encontrado.');
    }
  }

  private async ensureNoOverlap(input: {
    lawyerId: string;
    scheduledAt: Date;
    durationMinutes: number;
    excludeId?: string;
  }): Promise<void> {
    const overlapping = await this.repo.findOverlapping(input);
    if (overlapping.length > 0) {
      throw new ConflictException(
        'El abogado ya tiene una consulta agendada en ese horario.',
      );
    }
  }

  private buildDayWindow(dateIso: string): { dayStart: Date; dayEnd: Date } {
    const start = new Date(dateIso);
    if (Number.isNaN(start.getTime())) {
      throw new BadRequestException('Fecha inválida.');
    }
    const dayStart = new Date(
      Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate(), 0, 0, 0, 0),
    );
    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60_000);
    return { dayStart, dayEnd };
  }

  private computeFreeSlots(input: {
    dayStart: Date;
    dayEnd: Date;
    lawyer: LawyerRow;
    bookings: ConsultationRow[];
    slotMinutes: number;
    now: Date;
  }): AvailabilitySlotDto[] {
    const { dayStart, lawyer, bookings, slotMinutes, now } = input;

    const workStart = new Date(dayStart.getTime() + lawyer.working_hours_start * 60 * 60_000);
    const workEnd = new Date(dayStart.getTime() + lawyer.working_hours_end * 60 * 60_000);

    if (workEnd.getTime() <= workStart.getTime()) {
      return [];
    }

    const slots: AvailabilitySlotDto[] = [];
    const stepMs = slotMinutes * 60_000;

    for (let cursor = workStart.getTime(); cursor + stepMs <= workEnd.getTime(); cursor += stepMs) {
      const slotStart = new Date(cursor);
      const slotEnd = new Date(cursor + stepMs);

      if (slotStart.getTime() <= now.getTime()) {
        continue;
      }

      const conflicts = bookings.some((booking) => {
        const bookingStart = new Date(booking.scheduled_at).getTime();
        const bookingEnd = bookingStart + booking.duration_minutes * 60_000;
        return bookingStart < slotEnd.getTime() && bookingEnd > slotStart.getTime();
      });

      if (!conflicts) {
        slots.push({
          start: slotStart.toISOString(),
          end: slotEnd.toISOString(),
        });
      }
    }

    return slots;
  }
}
