import { Module } from '@nestjs/common';
import { LawyersController } from './lawyers.controller';
import { LawyersService } from './lawyers.service';
import { LawyersRepository } from './lawyers.repository';
import { LawyersMapper } from './lawyers.mapper';
import { JwtAuthGuard } from '../../common/auth/jwt-auth.guard';

@Module({
  controllers: [LawyersController],
  providers: [LawyersService, LawyersRepository, LawyersMapper, JwtAuthGuard],
  exports: [LawyersService],
})
export class LawyersModule {}
