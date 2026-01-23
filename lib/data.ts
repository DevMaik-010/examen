// ============================================
// DATOS DEL EXAMEN - CARGA DESDE data_real.json
// ============================================

import examDataReal from "./data_real.json";

// Interfaces para el sistema del examen
export interface Opcion {
  id: string;
  pregunta: string;
}

export interface Pregunta {
  id: string;
  pregunta: string;
  articulo?: string | null;
  tipo_de_pregunta: number;
  tiempo: number;
  categoria: string;
  capacidad?: string | null;
  opciones: string[];
  opcionesCompletas: Opcion[];
  respuesta_correcta: string | null;
}

export interface ExamData {
  tema: string;
  descripcion: string;
  tiempo_total: number;
  tiempo_transcurrido: number;
  preguntas: Pregunta[];
}

// Exportar los datos reales del JSON
export const EXAM_DATA: ExamData = examDataReal as ExamData;

// Función helper para obtener preguntas por categoría
export function getPreguntasPorCategoria(categoria: string): Pregunta[] {
  return EXAM_DATA.preguntas.filter((p) => p.categoria === categoria);
}
