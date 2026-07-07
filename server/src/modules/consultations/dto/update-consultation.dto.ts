import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { ConsultationStatus } from '../enums/consultation-status.enum';

export class UpdateConsultationDto {
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsOptional()
  @IsInt()
  @Min(15)
  @Max(240)
  durationMinutes?: number;

  @IsOptional()
  @IsString()
  @MaxLength(2_000)
  notes?: string;

  @IsOptional()
  @IsUrl({ require_protocol: true })
  meetingUrl?: string;

  @IsOptional()
  @IsEnum(ConsultationStatus)
  status?: ConsultationStatus;
}
