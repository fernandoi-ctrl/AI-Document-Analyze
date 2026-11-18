import { CaseType } from '../ai-provider.interface';
import { Jurisdiction } from '../../geo/jurisdiction.types';

/**
 * Country-agnostic description of each legal area. The concrete legal system
 * (codes, statutes, terminology) is anchored to a country at prompt-build time
 * via the caller's {@link Jurisdiction}.
 */
export const CASE_CONTEXT: Record<CaseType, string> = {
  civil: 'derecho civil (obligaciones, contratos, responsabilidad civil, bienes)',
  mercantil: 'derecho mercantil (sociedades, contratos mercantiles, títulos de crédito)',
  penal: 'derecho penal y procesal penal (delitos, derechos del imputado y de la víctima)',
  familiar: 'derecho familiar (divorcio, pensión alimenticia, guarda y custodia, adopción)',
  laboral: 'derecho laboral (relación de trabajo, despido, prestaciones, seguridad social)',
};

export function buildAnalysisSystemPrompt(
  caseType: CaseType,
  jurisdiction: Jurisdiction,
): string {
  const legalContext = CASE_CONTEXT[caseType];
  const { countryName } = jurisdiction;
  return `Eres Analiza tu juicio AI, un sistema experto en ${legalContext} conforme al sistema legal vigente en ${countryName}.

Aplica EXCLUSIVAMENTE la legislación, códigos, jurisprudencia y terminología jurídica propios de ${countryName}. No mezcles ni asumas marcos legales de otros países.

Tu función es evaluar objetivamente la fortaleza del caso presentado y generar un análisis estructurado.

IMPORTANTE:
- Basa tu análisis únicamente en los documentos y descripción proporcionados
- Usa la terminología legal correcta de ${countryName}
- Sé honesto sobre debilidades y fortalezas
- Si hay información insuficiente, indícalo en los riesgos
- Si desconoces una norma específica de ${countryName}, indícalo como información faltante en lugar de inventarla
- No inventes hechos que no estén en los documentos ni normas que no puedas sustentar

Responde ÚNICAMENTE con un objeto JSON válido, sin texto adicional, con esta estructura exacta:
{
  "score": <número del 1 al 10>,
  "probability": <porcentaje del 0 al 100>,
  "risk_level": <"bajo" | "medio" | "alto">,
  "strengths": [<lista de 2 a 5 puntos fuertes del caso>],
  "risks": [<lista de 2 a 5 riesgos identificados>],
  "critical_issues": [<lista de 0 a 3 problemas críticos que podrían hundir el caso, vacía si no hay>],
  "recommendations": [<lista de 3 a 5 acciones recomendadas>]
}`;
}

export const OCR_PDF_PROMPT =
  'Transcribe TODO el texto visible de este documento PDF, página por página y en orden. ' +
  'Incluye fechas, nombres, números de expediente, artículos legales citados, sellos, firmas ' +
  'y cualquier texto presente. Si una parte es ilegible, márcala con [ilegible]. ' +
  'Si una página es completamente una imagen (foto, escaneado, sello), descríbela ' +
  'brevemente entre corchetes, ej. [Imagen: sello del juzgado]. ' +
  'Devuelve solo el texto transcrito, sin comentarios introductorios ni resúmenes.';

export const OCR_IMAGE_PROMPT =
  'Transcribe todo el texto visible en esta imagen de documento legal. Incluye todo: fechas, ' +
  'nombres, números de expediente, artículos citados, y cualquier texto presente. Si hay partes ' +
  'ilegibles, indícalo con [ilegible]. Solo devuelve el texto transcrito, sin comentarios adicionales.';

export function buildChunkSummaryPrompt(caseType: CaseType): string {
  return `Eres un asistente legal experto en ${CASE_CONTEXT[caseType]}. ` +
    'Recibes un fragmento de un expediente legal. Devuelve un resumen breve, factual y útil, ' +
    'preservando datos concretos (fechas, nombres, números de expediente, artículos citados, montos). ' +
    'No agregues opiniones, no inventes información, no incluyas introducciones ni comentarios.';
}
