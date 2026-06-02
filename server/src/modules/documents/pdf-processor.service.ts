import { Inject, Injectable, Logger } from '@nestjs/common';
import pdfParse from 'pdf-parse';
import { AI_PROVIDER } from '../../ai/ai-provider.tokens';
import { AIProvider } from '../../ai/ai-provider.interface';
import { UploadedFile } from './types';

@Injectable()
export class PdfProcessorService {
  private readonly logger = new Logger(PdfProcessorService.name);
  private readonly minExtractableChars = 50;

  constructor(@Inject(AI_PROVIDER) private readonly ai: AIProvider) {}

  async extractText(file: UploadedFile): Promise<string> {
    if (file.mimetype === 'application/pdf') {
      return this.fromPdf(file);
    }
    if (file.mimetype.startsWith('image/')) {
      return this.fromImage(file);
    }
    return '';
  }

  private async fromPdf(file: UploadedFile): Promise<string> {
    let parsed = '';
    try {
      const data = await pdfParse(file.buffer);
      parsed = data.text.trim();
    } catch (err) {
      this.logger.warn(`pdf-parse failed for ${file.originalname}: ${(err as Error).message}`);
    }

    if (parsed.length >= this.minExtractableChars) {
      return wrap(`Inicio de documento: ${file.originalname}`, parsed, 'Fin de documento');
    }

    this.logger.log(
      `${file.originalname}: only ${parsed.length} extractable chars, falling back to OCR`,
    );

    try {
      const text = await this.ai.ocrPdf({ filename: file.originalname, buffer: file.buffer });
      if (!text) return `[Documento PDF: ${file.originalname} — sin texto extraíble]`;
      return wrap(`Inicio de documento (OCR): ${file.originalname}`, text, 'Fin de documento');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'desconocido';
      return `[Error al hacer OCR del PDF "${file.originalname}": ${message}]`;
    }
  }

  private async fromImage(file: UploadedFile): Promise<string> {
    if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
      return `[Imagen no soportada: ${file.originalname}]`;
    }
    try {
      const text = await this.ai.ocrImage({
        filename: file.originalname,
        buffer: file.buffer,
        mediaType: file.mimetype,
      });
      return wrap(`Inicio de imagen: ${file.originalname}`, text, 'Fin de imagen');
    } catch {
      return `[Error al procesar imagen: ${file.originalname}]`;
    }
  }
}

function wrap(header: string, body: string, footer: string): string {
  return `--- ${header} ---\n${body}\n--- ${footer} ---`;
}
