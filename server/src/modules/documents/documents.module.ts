import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { PdfProcessorService } from './pdf-processor.service';
import { ChunkProcessorService } from './chunk-processor.service';

@Module({
  providers: [DocumentsService, PdfProcessorService, ChunkProcessorService],
  exports: [DocumentsService, ChunkProcessorService],
})
export class DocumentsModule {}
