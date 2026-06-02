import { BadRequestException, Injectable } from '@nestjs/common';
import {
  ALLOWED_MIME_TYPES,
  MAX_FILES,
  MAX_FILE_SIZE_BYTES,
  isAllowedMime,
} from './dto/upload-rules';
import { UploadedFile } from './types';
import { PdfProcessorService } from './pdf-processor.service';

@Injectable()
export class DocumentsService {
  constructor(private readonly pdf: PdfProcessorService) {}

  validate(files: UploadedFile[]): void {
    if (files.length > MAX_FILES) {
      throw new BadRequestException(`Máximo ${MAX_FILES} archivos permitidos.`);
    }
    for (const f of files) {
      if (f.size > MAX_FILE_SIZE_BYTES) {
        throw new BadRequestException(`El archivo "${f.originalname}" supera el límite de 10 MB.`);
      }
      if (!isAllowedMime(f.mimetype)) {
        throw new BadRequestException(
          `El tipo de archivo "${f.mimetype}" no está permitido. Use ${ALLOWED_MIME_TYPES.join(', ')}.`,
        );
      }
    }
  }

  async extractAll(files: UploadedFile[], onProgress?: (i: number, total: number) => void): Promise<string> {
    const parts: string[] = [];
    for (let i = 0; i < files.length; i++) {
      onProgress?.(i, files.length);
      parts.push(await this.pdf.extractText(files[i]));
    }
    return parts.join('\n\n');
  }
}
