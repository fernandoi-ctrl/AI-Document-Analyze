import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import {
  ConsultationInsertPayload,
  ConsultationRow,
  ConsultationUpdatePayload,
} from './consultations.mapper';
import { BLOCKING_STATUSES, ConsultationStatus } from './enums/consultation-status.enum';

export interface LawyerRow {
  id: string;
  user_id: string;
  specialty?: string | null;
  timezone: string;
  working_hours_start: number;
  working_hours_end: number;
  user: { full_name: string | null; email: string } | null;
}

export interface OverlapQuery {
  lawyerId: string;
  scheduledAt: Date;
  durationMinutes: number;
  excludeId?: string;
}

const TABLE = 'consultations';
const LAWYERS_TABLE = 'lawyers';
const USERS_TABLE = 'auth.users'; // 👈 corregido

const SELECT_COLUMNS =
  'id, case_id, lawyer_id, user_id, scheduled_at, duration_minutes, notes, meeting_url, status, created_at, updated_at';

@Injectable()
export class ConsultationsRepository {
  private readonly logger = new Logger(ConsultationsRepository.name);

  constructor(private readonly db: DatabaseService) { }

  async listForUser(userId: string): Promise<ConsultationRow[]> {
    const { data, error } = await this.db.client
      .from(TABLE)
      .select(SELECT_COLUMNS)
      .eq('user_id', userId)
      .order('scheduled_at', { ascending: true });

    if (error) {
      this.logger.error(`listForUser failed: ${error.message}`);
      throw new InternalServerErrorException('No se pudieron obtener las consultas.');
    }
    return (data ?? []) as ConsultationRow[];
  }

  async findById(id: string): Promise<ConsultationRow> {
    const { data, error } = await this.db.client
      .from(TABLE)
      .select(SELECT_COLUMNS)
      .eq('id', id)
      .maybeSingle();

    if (error) {
      this.logger.error(`findById failed: ${error.message}`);
      throw new InternalServerErrorException('No se pudo obtener la consulta.');
    }
    if (!data) {
      throw new NotFoundException('Consulta no encontrada.');
    }
    return data as ConsultationRow;
  }

  async create(payload: ConsultationInsertPayload): Promise<ConsultationRow> {
    const { data, error } = await this.db.client
      .from(TABLE)
      .insert([payload])
      .select(SELECT_COLUMNS)
      .single();

    if (error || !data) {
      this.logger.error(`create failed: ${error?.message ?? 'unknown error'}`);
      throw new InternalServerErrorException('No se pudo crear la consulta.');
    }
    return data as ConsultationRow;
  }

  async update(id: string, payload: ConsultationUpdatePayload): Promise<ConsultationRow> {
    const { data, error } = await this.db.client
      .from(TABLE)
      .update(payload)
      .eq('id', id)
      .select(SELECT_COLUMNS)
      .maybeSingle();

    if (error) {
      this.logger.error(`update failed: ${error.message}`);
      throw new InternalServerErrorException('No se pudo actualizar la consulta.');
    }
    if (!data) {
      throw new NotFoundException('Consulta no encontrada.');
    }
    return data as ConsultationRow;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.db.client.from(TABLE).delete().eq('id', id);
    if (error) {
      this.logger.error(`delete failed: ${error.message}`);
      throw new InternalServerErrorException('No se pudo eliminar la consulta.');
    }
  }

  // async userExists(userId: string): Promise<boolean> {
  //   const { data, error } = await this.db.client
  //     .from("auth.users") // 👈 nombre completo del esquema + tabla
  //     .select('id')
  //     .eq('id', userId)
  //     .maybeSingle();

  //   if (error) {
  //     this.logger.error(`userExists failed: ${error.message}`);
  //     throw new InternalServerErrorException('No se pudo validar el usuario.');
  //   }
  //   return Boolean(data);
  // }
  async userExists(userId: string): Promise<boolean> {
    try {
      const { data, error } = await this.db.client.auth.admin.getUserById(userId);
      if (error) {
        this.logger.error(`userExists failed: ${error.message}`);
        throw new InternalServerErrorException('No se pudo validar el usuario.');
      }
      return Boolean(data?.user);
    } catch (err: any) {
      this.logger.error(`userExists failed: ${err.message}`);
      throw new InternalServerErrorException('No se pudo validar el usuario.');
    }
  }

  async findLawyerById(lawyerId: string): Promise<LawyerRow | null> {
    const { data, error } = await this.db.client
      .from(LAWYERS_TABLE)
      .select('id, user_id, working_hours_start, working_hours_end, timezone')
      .eq('id', lawyerId)
      .maybeSingle();

    if (error) {
      this.logger.error(`findLawyerById failed: ${error.message}`);
      throw new InternalServerErrorException('No se pudo validar el abogado.');
    }
    return (data as LawyerRow) ?? null;
  }

  async findOverlapping(query: OverlapQuery): Promise<ConsultationRow[]> {
    const windowEnd = new Date(
      query.scheduledAt.getTime() + query.durationMinutes * 60_000,
    );

    let builder = this.db.client
      .from(TABLE)
      .select(SELECT_COLUMNS)
      .eq('lawyer_id', query.lawyerId)
      .in('status', BLOCKING_STATUSES as ConsultationStatus[])
      .lt('scheduled_at', windowEnd.toISOString())
      .gt(
        'scheduled_at',
        new Date(query.scheduledAt.getTime() - 24 * 60 * 60_000).toISOString(),
      );

    if (query.excludeId) {
      builder = builder.neq('id', query.excludeId);
    }

    const { data, error } = await builder;
    if (error) {
      this.logger.error(`findOverlapping failed: ${error.message}`);
      throw new InternalServerErrorException('No se pudo validar disponibilidad.');
    }

    const rows = (data ?? []) as ConsultationRow[];
    return rows.filter((row) => {
      const rowStart = new Date(row.scheduled_at).getTime();
      const rowEnd = rowStart + row.duration_minutes * 60_000;
      return rowStart < windowEnd.getTime() && rowEnd > query.scheduledAt.getTime();
    });
  }

  async listForLawyerOnDay(
    lawyerId: string,
    dayStart: Date,
    dayEnd: Date,
  ): Promise<ConsultationRow[]> {
    const { data, error } = await this.db.client
      .from(TABLE)
      .select(SELECT_COLUMNS)
      .eq('lawyer_id', lawyerId)
      .in('status', BLOCKING_STATUSES as ConsultationStatus[])
      .gte('scheduled_at', dayStart.toISOString())
      .lt('scheduled_at', dayEnd.toISOString())
      .order('scheduled_at', { ascending: true });

    if (error) {
      this.logger.error(`listForLawyerOnDay failed: ${error.message}`);
      throw new InternalServerErrorException('No se pudo obtener la agenda del abogado.');
    }
    return (data ?? []) as ConsultationRow[];
  }
}
