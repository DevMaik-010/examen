// ============================================
// CONFIGURACIÓN DEL EXAMEN
// ============================================

// Configuración de tiempo del examen
export const EXAM_CONFIG = {
  // Tiempo por defecto del examen en minutos
  DEFAULT_TIME_MINUTES: 60,
  // Tiempo extendido para accesibilidad (discapacidad visual)
  EXTENDED_TIME_MINUTES: 180,
};

// Helper para convertir minutos a segundos
export const minutesToSeconds = (minutes: number): number => minutes * 60;

// Helper para convertir segundos a minutos
export const secondsToMinutes = (seconds: number): number =>
  Math.floor(seconds / 60);
