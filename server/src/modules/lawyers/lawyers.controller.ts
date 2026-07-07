import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/auth/jwt-auth.guard';
import { LawyersService } from './lawyers.service';
import { LawyerResponseDto } from './dto/lawyer-response.dto';

@Controller('lawyers')
@UseGuards(JwtAuthGuard)
export class LawyersController {
  constructor(private readonly lawyers: LawyersService) {}

  @Get()
  list(): Promise<LawyerResponseDto[]> {
    return this.lawyers.list();
  }
}
