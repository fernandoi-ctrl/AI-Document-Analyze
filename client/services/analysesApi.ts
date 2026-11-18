import { supabase } from '@/lib/supabase'
import { API_URL, apiFetch, apiRequest } from './apiClient'
import type { AnalysisResult, AnalysisSummary, CaseType } from '@/types/analysis'
import { readSession } from '@/lib/sessionStorage'

export function fetchAnalyses() {
  return apiRequest<AnalysisSummary[]>('/analyses')
}
export interface AnalysisDetail extends AnalysisSummary {
  result: AnalysisResult | null
}

export async function startAnalysis(
  caseType: CaseType,
  description: string,
  files: File[],
): Promise<{ jobId: string }> {
  const formData = new FormData()
  formData.append('caseType', caseType)
  formData.append('description', description)
  for (const f of files) formData.append('files', f, f.name)
  return apiFetch<{ jobId: string }>('/analyses', { method: 'POST', formData })
}

export function listAnalyses(): Promise<AnalysisSummary[]> {
  return apiFetch<AnalysisSummary[]>('/analyses')
}

export function getAnalysis(id: string): Promise<AnalysisDetail> {
  return apiFetch<AnalysisDetail>(`/analyses/${id}`)
}

export async function streamJobEvents(jobId: string): Promise<EventSource> {
  // const { data } = await supabase.auth.getSession()
  const session = readSession()
  const token = session?.session.accessToken ?? ''
  const url = `${API_URL}/analyses/jobs/${jobId}/events?access_token=${encodeURIComponent(token)}`
  return new EventSource(url)
}