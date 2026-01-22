// ============================================
// DATOS DEL EXAMEN - CARGA DESDE JSON
// ============================================

import preguntasJson from "./preguntas.json";
import textosJson from "./textos.json";

// Interfaces para los datos JSON
interface OpcionJson {
  clave: string;
  texto: string;
  es_correcta: boolean;
}

interface PreguntaJson {
  id: string;
  enunciado: string;
  opciones: OpcionJson[];
  sustento: string;
  dificultad: string;
  disciplinas: { nombre: string };
  componentes: { nombre: string };
  num_pregunta: number;
  texto_lectura_id: string | null;
}

interface TextoJson {
  id: string;
  titulo: string;
  contenido: string;
  fuente: string | null;
  componente_id: string;
}

// Interfaces para el sistema del examen
export interface Opcion {
  id: string;
  pregunta: string;
}

export interface Pregunta {
  id: string;
  pregunta: string;
  articulo?: string | null;
  articulo_titulo?: string | null;
  tipo_de_pregunta: number;
  tiempo: number;
  categoria: string;
  capacidad?: string | null;
  opciones: string[];
  opcionesCompletas: Opcion[];
  respuesta_correcta: string | null;
  // Nuevos campos del JSON
  disciplina?: string;
  componente?: string;
  dificultad?: string;
  sustento?: string;
  num_pregunta?: number;
  texto_lectura_id?: string | null;
}

export interface TextoLectura {
  id: string;
  titulo: string;
  contenido: string;
  fuente: string | null;
}

export interface ExamData {
  tema: string;
  descripcion: string;
  tiempo_total: number;
  tiempo_transcurrido: number;
  preguntas: Pregunta[];
  textos: TextoLectura[];
}

// Función para obtener el texto de lectura por ID
function getTextoById(textoId: string | null): { contenido: string; titulo: string } | null {
  if (!textoId) return null;
  const texto = (textosJson as TextoJson[]).find((t) => t.id === textoId);
  return texto ? { contenido: texto.contenido, titulo: texto.titulo } : null;
}

// Función para determinar la categoría según el componente
function getCategoriaFromComponente(componente: string): string {
  const componenteLower = componente.toLowerCase();
  if (componenteLower.includes("razonamiento")) return "razonamiento_logico";
  if (componenteLower.includes("comprensión") || componenteLower.includes("comprension")) return "comprension_lectora";
  if (componenteLower.includes("socioemocional") || componenteLower.includes("habilidades")) return "socio_emocional";
  return "conocimientos_generales";
}

// Función para determinar el tiempo según la categoría
function getTiempoPorCategoria(categoria: string): number {
  switch (categoria) {
    case "comprension_lectora":
      return 90;
    case "razonamiento_logico":
      return 60;
    case "socio_emocional":
      return 30;
    default:
      return 45;
  }
}

// Transformar preguntas del JSON al formato del sistema
function transformarPreguntas(preguntasRaw: PreguntaJson[]): Pregunta[] {
  return preguntasRaw.map((p, index) => {
    const categoria = getCategoriaFromComponente(p.componentes?.nombre || "");
    const textoData = getTextoById(p.texto_lectura_id);

    return {
      id: p.id,
      pregunta: p.enunciado,
      articulo: textoData?.contenido || null,
      articulo_titulo: textoData?.titulo || null,
      tipo_de_pregunta: 3, // Multiple choice
      tiempo: getTiempoPorCategoria(categoria),
      categoria: categoria,
      capacidad: p.disciplinas?.nombre || null,
      opciones: p.opciones.map((o) => o.texto),
      opcionesCompletas: p.opciones.map((o, idx) => ({
        id: `${p.id}-${o.clave}`,
        pregunta: o.texto,
      })),
      respuesta_correcta: p.opciones.find((o) => o.es_correcta)?.clave || null,
      // Campos adicionales
      disciplina: p.disciplinas?.nombre,
      componente: p.componentes?.nombre,
      dificultad: p.dificultad,
      sustento: p.sustento,
      num_pregunta: p.num_pregunta,
      texto_lectura_id: p.texto_lectura_id,
    };
  });
}

// Transformar textos del JSON
function transformarTextos(textosRaw: TextoJson[]): TextoLectura[] {
  return textosRaw.map((t) => ({
    id: t.id,
    titulo: t.titulo,
    contenido: t.contenido,
    fuente: t.fuente,
  }));
}

// Datos del examen cargados desde JSON
export const EXAM_DATA: ExamData = {
  tema: "ESFM",
  descripcion: "Prueba de admisión",
  tiempo_total: 7200, // 2 horas en segundos
  tiempo_transcurrido: 0,
  preguntas: transformarPreguntas(preguntasJson as PreguntaJson[]),
  textos: transformarTextos(textosJson as TextoJson[]),
};

// Función helper para obtener un texto de lectura
export function getTextoLectura(textoId: string): TextoLectura | undefined {
  return EXAM_DATA.textos.find((t) => t.id === textoId);
}

// Función helper para obtener preguntas por categoría
export function getPreguntasPorCategoria(categoria: string): Pregunta[] {
  return EXAM_DATA.preguntas.filter((p) => p.categoria === categoria);
}

// Función helper para obtener preguntas de un texto de lectura
export function getPreguntasPorTexto(textoId: string): Pregunta[] {
  return EXAM_DATA.preguntas.filter((p) => p.texto_lectura_id === textoId);
}
