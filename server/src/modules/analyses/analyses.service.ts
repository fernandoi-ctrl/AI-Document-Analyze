import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AI_PROVIDER } from '../../ai/ai-provider.tokens';
import { AIProvider } from '../../ai/ai-provider.interface';
import { CasesService } from '../cases/cases.service';
import { CaseInputDto } from '../cases/dto/case-input.dto';
import { DocumentsService } from '../documents/documents.service';
import { ChunkProcessorService } from '../documents/chunk-processor.service';
import { UploadedFile } from '../documents/types';
import { CreditsService } from '../payments/credits.service';
import { AnalysesRepository, PersistedAnalysis } from './analyses.repository';
import { JobStoreService } from './job-store.service';

export interface StartAnalysisInput {
  userId: string;
  caseInput: CaseInputDto;
  files: UploadedFile[];
}

@Injectable()
export class AnalysesService {
  private readonly logger = new Logger(AnalysesService.name);

  constructor(
    private readonly cases: CasesService,
    private readonly documents: DocumentsService,
    private readonly chunks: ChunkProcessorService,
    private readonly repo: AnalysesRepository,
    private readonly jobs: JobStoreService,
    private readonly credits: CreditsService,
    @Inject(AI_PROVIDER) private readonly ai: AIProvider,
  ) {}

  async start({ userId, caseInput, files }: StartAnalysisInput): Promise<{ jobId: string }> {
    this.documents.validate(files);
    const validated = this.cases.validate(caseInput, files.length > 0);

    if (files.length > 0) {
      const consumed = await this.credits.consumeOne(userId);
      if (!consumed) {
        throw new HttpException('no_credits', HttpStatus.PAYMENT_REQUIRED);
      }
    }

    const jobId = randomUUID();
    this.jobs.create(jobId);
    void this.run(jobId, validated.caseType, validated.description, files, userId);
    return { jobId };
  }

  list(userId: string): Promise<PersistedAnalysis[]> {
    return this.repo.listForUser(userId);
  }

  find(id: string, userId: string): Promise<PersistedAnalysis> {
    return this.repo.findForUser(id, userId);
  }

  getJob(jobId: string) {
    return this.jobs.get(jobId);
  }

  private async run(
    jobId: string,
    caseType: CaseInputDto['caseType'],
    description: string,
    files: UploadedFile[],
    userId: string,
  ): Promise<void> {
    try {
      this.jobs.update(jobId, {
        status: 'processing',
        progress: 10,
        message: 'Extrayendo texto de los documentos...',
      });

      const fullText = await this.documents.extractAll(files, (i, total) => {
        this.jobs.update(jobId, {
          progress: 10 + Math.round((i / Math.max(total, 1)) * 30),
          message: `Procesando documento ${i + 1} de ${total}: ${files[i]?.originalname ?? ''}`,
        });
      });

      let processed = fullText;
      if (this.chunks.needsChunking(fullText)) {
        this.jobs.update(jobId, {
          progress: 45,
          message: 'El expediente es extenso. Resumiendo por partes...',
        });
        processed = await this.chunks.summarizeAll(fullText, caseType, (done, total) => {
          this.jobs.update(jobId, {
            progress: 45 + Math.round((done / total) * 30),
            message: `Analizando fragmento ${done} de ${total}...`,
          });
        });
      }

      this.jobs.update(jobId, {
        progress: 80,
        message: 'Generando análisis legal con inteligencia artificial...',
      });

      const result = await this.ai.analyzeCase(description, processed, caseType);
      await this.repo.save({ userId, caseText: description, result });

      this.jobs.update(jobId, {
        status: 'done',
        progress: 100,
        message: 'Análisis completado.',
        result,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido.';
      this.logger.error(`Job ${jobId} failed: ${message}`);
      this.jobs.update(jobId, {
        status: 'error',
        progress: 0,
        message: 'Ocurrió un error durante el análisis.',
        error: message,
      });
    }
  }
}
