import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { AnalysisResult } from '../../ai/ai-provider.interface';

export interface PersistedAnalysis {
  id: string;
  created_at: string;
  case_text: string | null;
  score: number | null;
  probability: number | null;
  risk_level: string | null;
  result_json: AnalysisResult | null;
}

@Injectable()
export class AnalysesRepository {
  private readonly logger = new Logger(AnalysesRepository.name);

  constructor(private readonly db: DatabaseService) {}

  async save(input: {
    userId: string;
    caseText: string;
    result: AnalysisResult;
  }): Promise<void> {
    const { error } = await this.db.client.from('analyses').insert([
      {
        user_id: input.userId,
        case_text: input.caseText,
        score: input.result.score,
        probability: input.result.probability,
        risk_level: input.result.risk_level,
        result_json: input.result,
      },
    ]);
    if (error) {
      this.logger.error(`saveAnalysis failed: ${error.message}`);
      throw new InternalServerErrorException('No se pudo guardar el análisis.');
    }
  }

  async listForUser(userId: string): Promise<PersistedAnalysis[]> {
    const { data, error } = await this.db.client
      .from('analyses')
      .select('id, created_at, case_text, score, probability, risk_level, result_json')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw new InternalServerErrorException(error.message);
    return (data ?? []) as PersistedAnalysis[];
  }

  async findForUser(id: string, userId: string): Promise<PersistedAnalysis> {
    const { data, error } = await this.db.client
      .from('analyses')
      .select('id, created_at, case_text, score, probability, risk_level, result_json')
      .eq('id', id)
      .eq('user_id', userId)
      .maybeSingle();
    if (error) throw new InternalServerErrorException(error.message);
    if (!data) throw new NotFoundException('Análisis no encontrado.');
    return data as PersistedAnalysis;
  }
}
