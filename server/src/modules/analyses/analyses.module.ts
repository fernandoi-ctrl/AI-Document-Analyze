import { Module } from '@nestjs/common';
import { CasesModule } from '../cases/cases.module';
import { DocumentsModule } from '../documents/documents.module';
import { PaymentsModule } from '../payments/payments.module';
import { AnalysesController } from './analyses.controller';
import { AnalysesService } from './analyses.service';
import { AnalysesRepository } from './analyses.repository';
import { JobStoreService } from './job-store.service';
import { JwtAuthGuard } from '../../common/auth/jwt-auth.guard';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';
@Module({
  imports: [MulterModule.register({
    storage: multer.memoryStorage(),
  }), CasesModule, DocumentsModule, PaymentsModule],
  controllers: [AnalysesController],
  providers: [AnalysesService, AnalysesRepository, JobStoreService, JwtAuthGuard],
})
export class AnalysesModule { }
