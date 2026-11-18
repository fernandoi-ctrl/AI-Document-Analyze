import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AiModule } from './ai/ai.module';
import { GeoModule } from './geo/geo.module';
import { StorageModule } from './storage/storage.module';
import { AuthModule } from './modules/auth/auth.module';
import { CasesModule } from './modules/cases/cases.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { AnalysesModule } from './modules/analyses/analyses.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ConsultationsModule } from './modules/consultations/consultations.module';
import { LawyersModule } from './modules/lawyers/lawyers.module';
import { DatabaseService } from './database/database.service';
@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ['./server/.env'], isGlobal: true }),
    DatabaseModule,
    AiModule,
    GeoModule,
    StorageModule,
    AuthModule,
    CasesModule,
    DocumentsModule,
    PaymentsModule,
    AnalysesModule,
    ConsultationsModule,
    LawyersModule,
  ],
  providers: [DatabaseService],
})
export class AppModule { }
