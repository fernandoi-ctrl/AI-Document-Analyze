import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/auth/jwt-auth.guard';
import { AuthUser } from '../../common/auth/auth-user.decorator';
import { RequestUser } from '../../common/auth/auth-user.types';
import { ConsultationsService } from './consultations.service';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';
import { ConsultationResponseDto } from './dto/consultation-response.dto';
import { AvailabilityQueryDto } from './dto/availability-query.dto';
import { AvailabilitySlotDto } from './dto/availability-slot.dto';

@Controller('consultations')
@UseGuards(JwtAuthGuard)
export class ConsultationsController {
  constructor(private readonly consultations: ConsultationsService) { }

  @Get()
  list(@AuthUser() user: RequestUser): Promise<ConsultationResponseDto[]> {
    return this.consultations.list(user.id);
  }

  @Get('availability/:lawyerId')
  availability(
    @Param('lawyerId', new ParseUUIDPipe()) lawyerId: string,
    @Query() query: AvailabilityQueryDto,
  ): Promise<AvailabilitySlotDto[]> {
    return this.consultations.getAvailability(lawyerId, query);
  }

  @Get(':id')
  findOne(
    @AuthUser() user: RequestUser,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<ConsultationResponseDto> {
    return this.consultations.findOne(id, user.id);
  }

  @Post()
  create(
    @AuthUser() user: RequestUser,
    @Body() dto: CreateConsultationDto,
  ): Promise<ConsultationResponseDto> {
    return this.consultations.create(user.id, dto);
  }

  @Put(':id')
  update(
    @AuthUser() user: RequestUser,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateConsultationDto,
  ): Promise<ConsultationResponseDto> {
    return this.consultations.update(id, user.id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @AuthUser() user: RequestUser,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    return this.consultations.remove(id, user.id);
  }
}
