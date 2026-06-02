import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { EventEmitter } from 'events';
import { AnalysisResult } from '../../ai/ai-provider.interface';

export type JobStatus = 'pending' | 'processing' | 'done' | 'error';

export interface Job {
  id: string;
  status: JobStatus;
  progress: number;
  message: string;
  result?: AnalysisResult;
  error?: string;
  createdAt: number;
}

export type JobUpdate = Partial<Omit<Job, 'id' | 'createdAt'>>;

@Injectable()
export class JobStoreService extends EventEmitter implements OnModuleDestroy {
  private readonly jobs = new Map<string, Job>();
  private readonly cleanupTimer: NodeJS.Timeout;

  constructor() {
    super();
    this.cleanupTimer = setInterval(() => this.cleanup(), 30 * 60 * 1000);
  }

  create(id: string): Job {
    const job: Job = {
      id,
      status: 'pending',
      progress: 0,
      message: 'Iniciando análisis...',
      createdAt: Date.now(),
    };
    this.jobs.set(id, job);
    return job;
  }

  update(id: string, update: JobUpdate): void {
    const job = this.jobs.get(id);
    if (!job) return;
    Object.assign(job, update);
    this.emit(`update:${id}`, { ...job });
  }

  get(id: string): Job | undefined {
    return this.jobs.get(id);
  }

  private cleanup(): void {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    for (const [id, job] of this.jobs.entries()) {
      if (job.createdAt < oneHourAgo) this.jobs.delete(id);
    }
  }

  onModuleDestroy(): void {
    clearInterval(this.cleanupTimer);
  }
}
