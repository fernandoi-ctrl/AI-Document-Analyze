import { AnalysisResult } from '../../../ai/ai-provider.interface';

export class AnalysisSummaryDto {
  id!: string;
  createdAt!: string;
  caseText!: string | null;
  score!: number | null;
  probability!: number | null;
  riskLevel!: string | null;
}

export class AnalysisDetailDto extends AnalysisSummaryDto {
  result!: AnalysisResult | null;
}
