export interface AnalysisSummary {
  id: string
  createdAt: string
  caseText: string | null
  score: number | null
  probability: number | null
  riskLevel: string | null
}
export type CaseType = 'civil' | 'mercantil' | 'penal' | 'familiar' | 'laboral' | 'nose'
export type RiskLevel = 'bajo' | 'medio' | 'alto'
export type JobStatus = 'pending' | 'processing' | 'done' | 'error'

export const CASE_TYPE_LABELS: Record<CaseType, string> = {
  civil: 'Civil',
  mercantil: 'Mercantil',
  penal: 'Penal',
  familiar: 'Familiar',
  laboral: 'Laboral',
  nose: 'Nose'
}

export interface AnalysisResult {
  score: number
  probability: number
  risk_level: RiskLevel
  strengths: string[]
  risks: string[]
  critical_issues: string[]
  recommendations: string[]
}

export interface Job {
  id: string
  status: JobStatus
  progress: number
  message: string
  result?: AnalysisResult
  error?: string
  createdAt: number
}

export interface JobUpdate {
  status: JobStatus
  progress: number
  message: string
  result?: AnalysisResult
  error?: string
}
