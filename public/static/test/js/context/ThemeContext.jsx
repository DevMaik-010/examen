import React, { useState, useEffect, createContext } from 'react';

// ============================================
// CONTEXTO DE TEMA (Dark/Light Mode)
// ============================================

export const ThemeContext = createContext(null);

// Definición de temas
export const THEMES = {
  DARK: 'dark',
  LIGHT: 'light'
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Intentar obtener el tema guardado
    const savedTheme = localStorage.getItem('app_theme');
    
    // Si existe, usarlo
    if (savedTheme && Object.values(THEMES).includes(savedTheme)) {
      return savedTheme;
    }
    
    // Si no, detectar preferencia del sistema
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return THEMES.LIGHT;
    }
    
    // Por defecto, modo oscuro
    return THEMES.DARK;
  });

  // Sincronizar con localStorage
  useEffect(() => {
    localStorage.setItem('app_theme', theme);
    
    // Aplicar clase al body para CSS global
    document.body.setAttribute('data-theme', theme);
    
    // Actualizar meta theme-color para PWA
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content', 
        theme === THEMES.DARK ? '#0a0e27' : '#f0f4f8'
      );
    }
  }, [theme]);

  // Detectar cambios en la preferencia del sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    
    const handleChange = (e) => {
      // Solo auto-cambiar si el usuario no ha establecido preferencia manual
      const hasManualPreference = localStorage.getItem('app_theme_manual');
      if (!hasManualPreference) {
        setTheme(e.matches ? THEMES.LIGHT : THEMES.DARK);
      }
    };

    // Navegadores modernos
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      // Navegadores antiguos
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  /**
   * Cambia entre tema claro y oscuro
   */
  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
      // Marcar que el usuario ha establecido preferencia manual
      localStorage.setItem('app_theme_manual', 'true');
      return newTheme;
    });
  };

  /**
   * Establece un tema específico
   * @param {string} newTheme - 'dark' o 'light'
   */
  const setSpecificTheme = (newTheme) => {
    if (Object.values(THEMES).includes(newTheme)) {
      setTheme(newTheme);
      localStorage.setItem('app_theme_manual', 'true');
    }
  };

  /**
   * Resetea la preferencia manual y usa la del sistema
   */
  const resetToSystemTheme = () => {
    localStorage.removeItem('app_theme_manual');
    
    const systemPrefersDark = window.matchMedia && 
                              window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    setTheme(systemPrefersDark ? THEMES.DARK : THEMES.LIGHT);
  };

  /**
   * Verifica si está en modo oscuro
   */
  const isDarkMode = theme === THEMES.DARK;

  /**
   * Verifica si está en modo claro
   */
  const isLightMode = theme === THEMES.LIGHT;

  const value = {
    theme,
    isDarkMode,
    isLightMode,
    toggleTheme,
    setSpecificTheme,
    resetToSystemTheme,
    THEMES
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
