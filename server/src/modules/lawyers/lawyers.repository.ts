// Lawyer columns plus the related user's display name (embedded via the
// lawyers.user_id -> users.id foreign key).
// const SELECT_COLUMNS =
//   'id, user_id, specialty, timezone, working_hours_start, working_hours_end, user:auth.users(full_name, email)';

// @Injectable()
// export class LawyersRepository {
//   private readonly logger = new Logger(LawyersRepository.name);

//   constructor(private readonly db: DatabaseService) { }

//   async list(): Promise<LawyerRow[]> {
//     const { data, error } = await this.db.client
//       .from(TABLE)
//       .select(SELECT_COLUMNS)
//       .order('created_at', { ascending: true });

//     if (error) {
//       this.logger.error(`list failed: ${error.message}`);
//       throw new InternalServerErrorException('No se pudieron obtener los abogados.');
//     }
//     return (data ?? []) as unknown as LawyerRow[];
//   }
// }
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { LawyerRow } from './lawyers.mapper';

const TABLE = 'lawyers';

@Injectable()
export class LawyersRepository {
  private readonly logger = new Logger(LawyersRepository.name);

  constructor(private readonly db: DatabaseService) { }

  async list(): Promise<LawyerRow[]> {
    // 1. Traer abogados
    const { data: lawyers, error } = await this.db.client
      .from(TABLE)
      .select('id, user_id, specialty, timezone, working_hours_start, working_hours_end, avatar_url')
      .order('created_at', { ascending: true });

    if (error) {
      this.logger.error(`list failed: ${error.message}`);
      throw new InternalServerErrorException('No se pudieron obtener los abogados.');
    }

    if (!lawyers?.length) return [];

    // 2. Traer usuarios vinculados desde auth.users
    const { data: users, error: userError } = await this.db.client
      .from('auth.users')
      .select('id, email, full_name')
      .in('id', lawyers.map(l => l.user_id));

    if (userError) {
      this.logger.error(`users fetch failed: ${userError.message}`);
      throw new InternalServerErrorException('No se pudieron obtener los usuarios.');
    }

    // 3. Mapear resultados
    const userMap = new Map(users?.map(u => [u.id, u]));
    return lawyers.map(l => ({
      ...l,
      user: userMap.get(l.user_id) ?? null,
    })) as LawyerRow[];
  }
}
