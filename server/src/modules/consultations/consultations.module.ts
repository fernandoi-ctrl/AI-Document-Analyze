import { Module } from '@nestjs/common';
import { ConsultationsController } from './consultations.controller';
import { ConsultationsService } from './consultations.service';
import { ConsultationsRepository } from './consultations.repository';
import { ConsultationsMapper } from './consultations.mapper';
import { JwtAuthGuard } from '../../common/auth/jwt-auth.guard';

@Module({
  controllers: [ConsultationsController],
  providers: [ConsultationsService, ConsultationsRepository, ConsultationsMapper, JwtAuthGuard],
  exports: [ConsultationsService],
})
export class ConsultationsModule {}
