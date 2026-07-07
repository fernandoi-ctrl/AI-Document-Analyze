import { Injectable } from '@nestjs/common';
import { LawyerResponseDto } from './dto/lawyer-response.dto';

interface EmbeddedUser {
  full_name: string | null;
}

/**
 * Shape returned by Supabase when selecting from `lawyers` and embedding the
 * related `users` row. Supabase may type the embedded relation as either a
 * single object or an array depending on how it infers the relationship, so we
 * accept both and normalise in the mapper.
 */
export interface LawyerRow {
  id: string
  user_id: string
  specialty: string | null
  timezone: string
  working_hours_start: number
  working_hours_end: number
  user: { full_name: string | null; email: string } | null
}


@Injectable()
export class LawyersMapper {
  toResponse(row: LawyerRow): LawyerResponseDto {
    const user = Array.isArray(row.user) ? row.user[0] : row.user;
    return {
      id: row.id,
      userId: row.user_id,
      fullName: user?.full_name ?? '',
      specialty: row.specialty ?? null,
      // Avatars are not stored yet; the column does not exist in the schema.
      avatarUrl: null,
      timezone: row.timezone,
    };
  }

  toResponseList(rows: LawyerRow[]): LawyerResponseDto[] {
    return rows.map((row) => this.toResponse(row));
  }
}
