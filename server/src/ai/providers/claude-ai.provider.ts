import { Injectable, InternalServerErrorException, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import pdfParse from "pdf-parse";
import {
  AIProvider,
  AnalysisResult,
  CaseType,
  ImageDocument,
  PdfDocument,
} from '../ai-provider.interface';
import { Jurisdiction } from '../../geo/jurisdiction.types';
import {
  OCR_IMAGE_PROMPT,
  OCR_PDF_PROMPT,
  buildChunkSummaryPrompt,
  buildAnalysisSystemPrompt,
} from '../prompts/legal-analysis.prompt';
import { fromBuffer } from 'pdf2pic';

const ANALYSIS_MODEL = 'claude-opus-4-7';
const OCR_MODEL = 'claude-haiku-4-5-20251001';

@Injectable()
export class ClaudeAIProvider implements AIProvider, OnModuleInit {
  private client!: Anthropic;

  constructor(private readonly config: ConfigService) { }

  onModuleInit(): void {
    const apiKey = this.config.get<string>('ANTHROPIC_API_KEY');
    if (!apiKey) {
      throw new InternalServerErrorException('ANTHROPIC_API_KEY is not configured');
    }
    this.client = new Anthropic({ apiKey });
  }

  async analyzeCase(
    description: string,
    documentText: string,
    caseType: CaseType,
    jurisdiction: Jurisdiction,
  ): Promise<AnalysisResult> {
    const response = await this.client.messages.create({
      model: ANALYSIS_MODEL,
      max_tokens: 4096,
      system: buildAnalysisSystemPrompt(caseType, jurisdiction),
      messages: [
        {
          role: 'user',
          content:
            `Descripción del caso aportada por el usuario:\n${description || '(sin descripción)'}\n\n` +
            `Contenido de los documentos:\n${documentText || '(sin documentos)'}`,
        },
      ],
    });

    const text = response.content[0]?.type === 'text' ? response.content[0].text : '';
    const json = extractJson(text);
    return json as AnalysisResult;
  }

  async summarizeChunk(chunk: string, caseType: CaseType): Promise<string> {
    const response = await this.client.messages.create({
      model: OCR_MODEL,
      max_tokens: 2048,
      system: buildChunkSummaryPrompt(caseType),
      messages: [{ role: 'user', content: chunk }],
    });
    return response.content[0]?.type === 'text' ? response.content[0].text.trim() : '';
  }

  async ocrPdf(doc: PdfDocument): Promise<string> {
    const base64Image = await getPdfImageBase64(doc.buffer);
    const extractedText = await getPdfText(doc.buffer);
    const response = await this.client.messages.create({
      model: OCR_MODEL,
      max_tokens: 8192,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: 'image/png', data: base64Image } },
            { type: 'text', text: extractedText },
          ],
        },
      ],
    });
    return response.content[0]?.type === 'text' ? response.content[0].text.trim() : '';
  }

  async ocrImage(doc: ImageDocument): Promise<string> {
    const base64 = doc.buffer.toString('base64');
    const response = await this.client.messages.create({
      model: OCR_MODEL,
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: doc.mediaType, data: base64 } },
            { type: 'text', text: OCR_IMAGE_PROMPT },
          ],
        },
      ],
    });
    return response.content[0]?.type === 'text' ? response.content[0].text.trim() : '';
  }
}

function extractJson(text: string): unknown {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1) {
    throw new Error('System response did not contain JSON');
  }
  return JSON.parse(text.slice(start, end + 1));
}
async function getPdfText(buffer: Buffer): Promise<string> {
  const pdfData = await pdfParse(buffer);
  return pdfData.text;
}

async function getPdfImageBase64(buffer: Buffer): Promise<string> {
  const convert = fromBuffer(buffer, {
    density: 100,
    format: 'png',
    width: 600,
    height: 800,
  });
  const result = await convert(1, { responseType: 'base64' });
  return result.base64 ?? '';
}