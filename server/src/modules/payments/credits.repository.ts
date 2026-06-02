import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class CreditsRepository {
  private readonly logger = new Logger(CreditsRepository.name);

  constructor(private readonly db: DatabaseService) { }

  async read(userId: string): Promise<number> {
    this.logger.debug(`Reading credits for userId=${userId}`);
    const { data, error } = await this.db.client
      .from('user_credits')
      .select('credits')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) throw new InternalServerErrorException(error.message);
    return (data?.credits as number | undefined) ?? 0;
  }

  async tryDecrementOne(userId: string): Promise<boolean> {
    const current = await this.read(userId);
    if (current <= 0) return false;
    const { data, error } = await this.db.client
      .from('user_credits')
      .update({ credits: current - 1 })
      .eq('user_id', userId)
      .eq('credits', current)
      .select('credits')
      .maybeSingle();
    if (error) {
      this.logger.error(`decrement failed: ${error.message}`);
      return false;
    }
    return data !== null;
  }

  async addCredits(userId: string, amount: number): Promise<void> {
    const { error } = await this.db.client.rpc('add_credits', {
      p_user_id: userId,
      p_amount: amount,
    });
    if (error) {
      this.logger.error(`add_credits RPC failed: ${error.message}`);
      throw new InternalServerErrorException(error.message);
    }
  }
}
