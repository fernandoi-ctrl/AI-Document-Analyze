export type CaseType = 'civil' | 'mercantil' | 'penal' | 'familiar' | 'laboral';
export type RiskLevel = 'bajo' | 'medio' | 'alto';

export interface AnalysisResult {
  score: number;
  probability: number;
  risk_level: RiskLevel;
  strengths: string[];
  risks: string[];
  critical_issues: string[];
  recommendations: string[];
}

export interface PdfDocument {
  filename: string;
  buffer: Buffer;
}

export interface ImageDocument {
  filename: string;
  buffer: Buffer;
  mediaType: 'image/jpeg' | 'image/png';
}

export interface AIProvider {
  analyzeCase(
    description: string,
    documentText: string,
    caseType: CaseType,
  ): Promise<AnalysisResult>;

  summarizeChunk(chunk: string, caseType: CaseType): Promise<string>;

  ocrPdf(doc: PdfDocument): Promise<string>;
  ocrImage(doc: ImageDocument): Promise<string>;
}
