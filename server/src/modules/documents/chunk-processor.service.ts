import { Inject, Injectable } from '@nestjs/common';
import { AI_PROVIDER } from '../../ai/ai-provider.tokens';
import { AIProvider, CaseType } from '../../ai/ai-provider.interface';

const CHUNK_SIZE = 6000;
const DIRECT_LIMIT = 20_000;

export type ChunkProgress = (done: number, total: number) => void;

@Injectable()
export class ChunkProcessorService {
  constructor(@Inject(AI_PROVIDER) private readonly ai: AIProvider) {}

  needsChunking(text: string): boolean {
    return text.length > DIRECT_LIMIT;
  }

  split(text: string): string[] {
    if (text.length <= CHUNK_SIZE) return [text];

    const chunks: string[] = [];
    let start = 0;
    while (start < text.length) {
      let end = start + CHUNK_SIZE;
      if (end < text.length) {
        const paragraphEnd = text.lastIndexOf('\n\n', end);
        const sentenceEnd = text.lastIndexOf('. ', end);
        if (paragraphEnd > start + CHUNK_SIZE * 0.5) end = paragraphEnd;
        else if (sentenceEnd > start + CHUNK_SIZE * 0.5) end = sentenceEnd + 1;
      }
      chunks.push(text.slice(start, end).trim());
      start = end;
    }
    return chunks.filter((c) => c.length > 0);
  }

  async summarizeAll(text: string, caseType: CaseType, onProgress?: ChunkProgress): Promise<string> {
    const chunks = this.split(text);
    if (chunks.length === 1) return chunks[0];

    const summaries: string[] = [];
    for (let i = 0; i < chunks.length; i++) {
      summaries.push(await this.ai.summarizeChunk(chunks[i], caseType));
      onProgress?.(i + 1, chunks.length);
    }

    const combined = summaries.map((s, i) => `## Fragmento ${i + 1}\n${s}`).join('\n\n');
    return `RESUMEN CONDENSADO DEL EXPEDIENTE (${chunks.length} fragmentos procesados):\n\n${combined}`;
  }
}
