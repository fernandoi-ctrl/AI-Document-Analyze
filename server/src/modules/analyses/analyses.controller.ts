import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import multer from 'multer';
import { JwtAuthGuard } from '../../common/auth/jwt-auth.guard';
import { AuthUser } from '../../common/auth/auth-user.decorator';
import { RequestUser } from '../../common/auth/auth-user.types';
import { MAX_FILES } from '../documents/dto/upload-rules';
import { UploadedFile } from '../documents/types';
import { CaseInputDto } from '../cases/dto/case-input.dto';
import { AnalysesService } from './analyses.service';
import { AnalysisDetailDto, AnalysisSummaryDto } from './dto/analysis-response.dto';
import { Job, JobStoreService } from './job-store.service';

@Controller('analyses')
@UseGuards(JwtAuthGuard)
export class AnalysesController {
  constructor(
    private readonly analyses: AnalysesService,
    private readonly jobs: JobStoreService,
  ) { }

  @Post()
  @UseInterceptors(FilesInterceptor('files', MAX_FILES))
  start(
    @AuthUser() user: RequestUser,
    @Body() caseInput: CaseInputDto,
    @UploadedFiles() files: Express.Multer.File[] = [],
  ): Promise<{ jobId: string }> {
    const mapped: UploadedFile[] = files.map((f) => ({
      originalname: f.originalname,
      mimetype: f.mimetype,
      size: f.size,
      buffer: f.buffer,
    }));
    return this.analyses.start({ userId: user.id, caseInput, files: mapped });
  }

  @Get()
  async list(@AuthUser() user: RequestUser): Promise<AnalysisSummaryDto[]> {
    const rows = await this.analyses.list(user.id);
    return rows.map((r) => ({
      id: r.id,
      createdAt: r.created_at,
      caseText: r.case_text,
      score: r.score,
      probability: r.probability,
      riskLevel: r.risk_level,
    }));
  }

  @Get(':id')
  async detail(
    @AuthUser() user: RequestUser,
    @Param('id') id: string,
  ): Promise<AnalysisDetailDto> {
    const row = await this.analyses.find(id, user.id);
    return {
      id: row.id,
      createdAt: row.created_at,
      caseText: row.case_text,
      score: row.score,
      probability: row.probability,
      riskLevel: row.risk_level,
      result: row.result_json,
    };
  }

  @Get('jobs/:jobId/events')
  stream(
    @Param('jobId') jobId: string,
    @Req() req: Request,
    @Res() res: Response,
  ): void {
    const job = this.analyses.getJob(jobId);
    if (!job) throw new NotFoundException('Trabajo no encontrado.');

    res.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    });
    res.flushHeaders();

    const send = (data: Partial<Job>): void => {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    send(job);
    if (job.status === 'done' || job.status === 'error') {
      res.end();
      return;
    }

    const channel = `update:${jobId}`;
    const cleanup = (): void => {
      clearTimeout(timeout);
      this.jobs.removeListener(channel, onUpdate);
    };

    const onUpdate = (updated: Job): void => {
      send(updated);
      if (updated.status === 'done' || updated.status === 'error') {
        cleanup();
        res.end();
      }
    };

    const timeout = setTimeout(() => {
      send({ status: 'error', message: 'Tiempo de espera agotado.' });
      cleanup();
      res.end();
    }, 5 * 60 * 1000);

    this.jobs.on(channel, onUpdate);
    req.on('close', () => cleanup());
  }
}
