// ============================================
// CONFIGURACIÓN DE ENTORNO
// Manejo seguro de variables de entorno
// ============================================

/**
 * Obtiene una variable de entorno de forma segura
 * @param {string} key - Nombre de la variable
 * @param {string} defaultValue - Valor por defecto
 * @returns {string}
 */
function isEmptyEnvValue(value) {
  return value === undefined || value === null || value === '';
}

function getRuntimeEnvValue(key) {
  if (typeof window === 'undefined') {
    return undefined;
  }

  const runtimeEnv = window.__ENV__;
  if (!runtimeEnv || typeof runtimeEnv !== 'object') {
    return undefined;
  }

  return runtimeEnv[key];
}

function getCraEnvKey(key) {
  if (key.startsWith('VITE_')) {
    return `REACT_APP_${key.slice(5)}`;
  }

  return null;
}

function getProcessEnv() {
  try {
    return process.env;
  } catch (e) {
    return undefined;
  }
}

function getEnvVar(key, defaultValue) {
  const hasRuntimeEnv = (
    typeof window !== 'undefined'
    && window.__ENV__
    && typeof window.__ENV__ === 'object'
  );

  const runtimeValue = getRuntimeEnvValue(key);
  if (!isEmptyEnvValue(runtimeValue)) {
    return runtimeValue;
  }

  const runtimeCraKey = getCraEnvKey(key);
  if (runtimeCraKey) {
    const runtimeCraValue = getRuntimeEnvValue(runtimeCraKey);
    if (!isEmptyEnvValue(runtimeCraValue)) {
      return runtimeCraValue;
    }
  }

  if (hasRuntimeEnv) {
    return defaultValue;
  }

  try {
    // Intentar obtener de import.meta.env (Vite)
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      const viteValue = import.meta.env[key];
      if (!isEmptyEnvValue(viteValue)) {
        return viteValue;
      }
    }
  } catch (e) {
    // Si falla, usar valor por defecto
  }

  // CRA/Webpack: process.env con prefijo REACT_APP_
  const processEnv = getProcessEnv();
  if (processEnv) {
    const directValue = processEnv[key];
    if (!isEmptyEnvValue(directValue)) {
      return directValue;
    }

    const craKey = getCraEnvKey(key);
    if (craKey && !isEmptyEnvValue(processEnv[craKey])) {
      return processEnv[craKey];
    }
  }

  return defaultValue;
}

function getMode() {
  const runtimeMode = getRuntimeEnvValue('MODE')
    || getRuntimeEnvValue('VITE_APP_ENV')
    || getRuntimeEnvValue('REACT_APP_ENV');

  if (!isEmptyEnvValue(runtimeMode)) {
    return runtimeMode;
  }

  try {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      const viteMode = import.meta.env.MODE;
      if (!isEmptyEnvValue(viteMode)) {
        return viteMode;
      }
    }
  } catch (e) {
    // Ignorar si import.meta no está disponible
  }

  const processEnv = getProcessEnv();
  if (processEnv && processEnv.NODE_ENV) {
    return processEnv.NODE_ENV;
  }

  return 'development';
}

/**
 * Configuración de entorno del sistema
 */
export const ENV = {
  // URL base de la API
  API_BASE_URL: getEnvVar('VITE_API_BASE_URL', '_VITE_API_BASE_URL_'),
  
  // Endpoint de login
  AUTH_LOGIN_ENDPOINT: getEnvVar('VITE_AUTH_LOGIN_ENDPOINT', '/auth/login'),
  
  // Endpoint de prueba/examen
  PRUEBA_ENDPOINT: getEnvVar('VITE_PRUEBA_ENDPOINT', '/prueba'),
  
  // Tiempo de expiración del token (en segundos)
  TOKEN_EXPIRY: parseInt(getEnvVar('VITE_TOKEN_EXPIRY', '1800'), 10),
  
  // Modo de desarrollo
  IS_DEV: getMode() === 'development',
  IS_PROD: getMode() === 'production',
  
  // Usar datos locales en lugar de API
  USE_LOCAL_EXAM_DATA: getEnvVar('VITE_USE_LOCAL_EXAM_DATA', 'false') === 'true'
};

/**
 * URL completa del endpoint de login
 */
export const LOGIN_URL = `${ENV.API_BASE_URL}${ENV.AUTH_LOGIN_ENDPOINT}`;

/**
 * URL completa del endpoint de prueba
 */
export const PRUEBA_URL = `${ENV.API_BASE_URL}${ENV.PRUEBA_ENDPOINT}`;

/**
 * URL completa para enviar respuestas (POST)
 */
export const SUBMIT_ANSWERS_URL = `${ENV.API_BASE_URL}${ENV.PRUEBA_ENDPOINT}`;


// Log de configuración en desarrollo
/*if (ENV.IS_DEV) {
  console.log('🔧 Configuración de entorno:', {
    API_BASE_URL: ENV.API_BASE_URL,
    AUTH_LOGIN_ENDPOINT: ENV.AUTH_LOGIN_ENDPOINT,
    TOKEN_EXPIRY: ENV.TOKEN_EXPIRY,
    IS_DEV: ENV.IS_DEV
  });
}*/
