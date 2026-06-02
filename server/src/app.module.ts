import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AiModule } from './ai/ai.module';
import { StorageModule } from './storage/storage.module';
import { AuthModule } from './modules/auth/auth.module';
import { CasesModule } from './modules/cases/cases.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { AnalysesModule } from './modules/analyses/analyses.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { DatabaseService } from './database/database.service';
@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ['.env'], isGlobal: true }),
    DatabaseModule,
    AiModule,
    StorageModule,
    AuthModule,
    CasesModule,
    DocumentsModule,
    PaymentsModule,
    AnalysesModule,
  ],
  providers: [DatabaseService],
})
export class AppModule { }
