import React, { useState, useEffect, createContext } from 'react';
import { authService } from '../services/authService';

// ============================================
// CONTEXTO DE AUTENTICACIÓN CON VALIDACIÓN REAL
// ============================================

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return authService.isAuthenticated();
  });

  const [currentUser, setCurrentUser] = useState(() => {
    return authService.getCurrentUser();
  });

  const [examCompleted, setExamCompleted] = useState(() => {
    return localStorage.getItem('examCompleted') === 'true';
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sincronizar estado de examen con localStorage
  useEffect(() => {
    localStorage.setItem('examCompleted', examCompleted);
  }, [examCompleted]);

  /**
   * Inicia sesión con credenciales
   * @param {string} username - Nombre de usuario
   * @param {string} password - Contraseña
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  const login = async (username, password) => {
    setLoading(true);
    setError(null);

    try {
      const result = await authService.login(username, password);

      if (result.success) {
        setIsAuthenticated(true);
        setCurrentUser(result.user);
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMessage = 'Error al iniciar sesión';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cierra la sesión del usuario
   */
  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setExamCompleted(false);
    setError(null);
  };

  /**
   * Marca el examen como completado
   */
  const completeExam = () => {
    setExamCompleted(true);
  };

  /**
   * Verifica si el usuario tiene un rol específico
   * @param {string} role - Rol a verificar
   * @returns {boolean}
   */
  const hasRole = (role) => {
    return authService.hasRole(role);
  };

  /**
   * Verifica si el usuario tiene un permiso específico
   * @param {string} permission - Permiso a verificar
   * @returns {boolean}
   */
  const hasPermission = (permission) => {
    return authService.hasPermission(permission);
  };

  /**
   * Verifica si el usuario tiene alguno de los roles especificados
   * @param {string[]} roles - Array de roles
   * @returns {boolean}
   */
  const hasAnyRole = (roles) => {
    return authService.hasAnyRole(roles);
  };

  /**
   * Limpia el error actual
   */
  const clearError = () => {
    setError(null);
  };

  const value = {
    // Estado
    isAuthenticated,
    currentUser,
    examCompleted,
    loading,
    error,

    // Funciones
    login,
    logout,
    completeExam,
    hasRole,
    hasPermission,
    hasAnyRole,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
