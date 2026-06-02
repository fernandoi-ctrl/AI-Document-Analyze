import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { CaseType } from '../../../ai/ai-provider.interface';

export const ALLOWED_CASE_TYPES: CaseType[] = [
  'civil',
  'mercantil',
  'penal',
  'familiar',
  'laboral',
];

export class CaseInputDto {
  @IsIn(ALLOWED_CASE_TYPES)
  caseType!: CaseType;

  @IsOptional()
  @IsString()
  @MaxLength(20_000)
  description?: string;
}
