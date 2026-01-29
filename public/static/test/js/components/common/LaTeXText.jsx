import { useEffect, useRef } from 'react';

// ============================================
// COMPONENTE: RENDERIZADOR DE LATEX
// Renderiza texto con fórmulas LaTeX usando KaTeX
// ============================================

/**
 * Componente para renderizar texto con fórmulas LaTeX
 * Soporta:
 * - Inline math: $formula$
 * - Display math: $$formula$$
 * - Texto normal mezclado con fórmulas
 * 
 * Ejemplo:
 * "¿Qué capa del modelo $\\text{OSI}$ es responsable?"
 * -> "¿Qué capa del modelo OSI es responsable?"
 *    (con OSI renderizado como fórmula)
 */
export function LaTeXText({ children, className = '' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !children) return;

    // Cargar KaTeX dinámicamente
    const loadKaTeX = async () => {
      // Verificar si KaTeX ya está cargado
      if (window.katex) {
        renderMath();
        return;
      }

      // Cargar CSS de KaTeX
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
      document.head.appendChild(link);

      // Cargar JS de KaTeX
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';
      script.onload = () => {
        renderMath();
      };
      document.head.appendChild(script);
    };

    loadKaTeX();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children]);

  const renderMath = () => {
    if (!containerRef.current || !window.katex) return;

    const text = String(children);
    const container = containerRef.current;
    
    // Limpiar contenedor
    container.innerHTML = '';

    // Regex para encontrar fórmulas LaTeX
    // Soporta: $formula$ y $$formula$$
    const regex = /(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$)/g;
    
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      // Agregar texto antes de la fórmula
      if (match.index > lastIndex) {
        const textNode = document.createTextNode(text.substring(lastIndex, match.index));
        container.appendChild(textNode);
      }

      // Extraer fórmula
      const formula = match[0];
      const isDisplay = formula.startsWith('$$');
      const mathContent = isDisplay 
        ? formula.slice(2, -2)  // Remover $$ ... $$
        : formula.slice(1, -1);  // Remover $ ... $

      // Crear span para la fórmula
      const span = document.createElement('span');
      
      try {
        window.katex.render(mathContent, span, {
          displayMode: isDisplay,
          throwOnError: false,
          errorColor: '#cc0000',
          strict: false,
          trust: true
        });
        container.appendChild(span);
      } catch (error) {
        // Si falla, mostrar texto original
        console.warn('Error renderizando LaTeX:', error);
        const errorNode = document.createTextNode(formula);
        container.appendChild(errorNode);
      }

      lastIndex = regex.lastIndex;
    }

    // Agregar texto restante después de la última fórmula
    if (lastIndex < text.length) {
      const textNode = document.createTextNode(text.substring(lastIndex));
      container.appendChild(textNode);
    }
  };

  // Si no hay texto, retornar null
  if (!children) return null;

  return (
    <span 
      ref={containerRef} 
      className={`latex-text ${className}`}
      style={{ display: 'inline' }}
    >
      {children}
    </span>
  );
}

// ============================================
// COMPONENTE: BLOQUE DE LATEX
// Para fórmulas en display mode (centradas)
// ============================================

export function LaTeXBlock({ children, className = '' }) {
  return (
    <div className={`latex-block ${className}`} style={{ 
      textAlign: 'center', 
      margin: '1rem 0',
      padding: '0.5rem'
    }}>
      <LaTeXText>{children}</LaTeXText>
    </div>
  );
}
