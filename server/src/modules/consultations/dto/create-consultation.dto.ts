import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateConsultationDto {
  @IsUUID()
  caseId!: string;

  @IsUUID()
  lawyerId!: string;

  @IsDateString()
  scheduledAt!: string;

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
}
