import { useEffect } from 'react';

/**
 * Hook para manejar atajos de teclado globales del examen
 * Proporciona navegación y selección rápida para accesibilidad
 */
export function useKeyboardShortcuts({
  onNext,
  onPrevious,
  onToggleFlag,
  onSelectOption,
  onEscape,
  totalOptions = 0,
  isModalOpen = false,
  enabled = true
}) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e) => {
      // Si hay un modal abierto, solo permitir Escape
      if (isModalOpen) {
        if (e.key === 'Escape' && onEscape) {
          e.preventDefault();
          onEscape();
        }
        return;
      }

      // Prevenir acción si el usuario está escribiendo en un input
      const activeElement = document.activeElement;
      const isTyping = activeElement.tagName === 'INPUT' || 
                       activeElement.tagName === 'TEXTAREA' ||
                       activeElement.isContentEditable;

      if (isTyping && !e.ctrlKey && !e.altKey && !e.metaKey) {
        // Permitir teclas normales en inputs
        return;
      }

      // ============================================
      // ATAJOS CON CTRL
      // ============================================
      
      if (e.ctrlKey) {
        switch (e.key) {
          case 'ArrowRight':
            // Ctrl + → : Siguiente pregunta
            e.preventDefault();
            if (onNext) onNext();
            announceAction('Siguiente pregunta');
            break;

          case 'ArrowLeft':
            // Ctrl + ← : Pregunta anterior
            e.preventDefault();
            if (onPrevious) onPrevious();
            announceAction('Pregunta anterior');
            break;

          case 'm':
          case 'M':
            // Ctrl + M : Marcar/desmarcar pregunta
            e.preventDefault();
            if (onToggleFlag) onToggleFlag();
            announceAction('Pregunta marcada para revisión');
            break;

          default:
            break;
        }
        return;
      }

      // ============================================
      // ATAJOS DE SELECCIÓN RÁPIDA
      // ============================================

      // Números: 1, 2, 3, 4
      if (e.key >= '1' && e.key <= '9') {
        const optionIndex = parseInt(e.key, 10) - 1;
        if (optionIndex < totalOptions && onSelectOption) {
          e.preventDefault();
          onSelectOption(optionIndex);
          announceAction(`Opción ${e.key} seleccionada`);
        }
        return;
      }

      // Letras: A, B, C, D, E, F, etc.
      if (e.key >= 'a' && e.key <= 'z') {
        const optionIndex = e.key.charCodeAt(0) - 'a'.charCodeAt(0);
        if (optionIndex < totalOptions && onSelectOption) {
          e.preventDefault();
          onSelectOption(optionIndex);
          const letter = e.key.toUpperCase();
          announceAction(`Opción ${letter} seleccionada`);
        }
        return;
      }

      if (e.key >= 'A' && e.key <= 'Z') {
        const optionIndex = e.key.charCodeAt(0) - 'A'.charCodeAt(0);
        if (optionIndex < totalOptions && onSelectOption) {
          e.preventDefault();
          onSelectOption(optionIndex);
          announceAction(`Opción ${e.key} seleccionada`);
        }
        return;
      }

      // ============================================
      // ESCAPE
      // ============================================
      
      if (e.key === 'Escape' && onEscape) {
        e.preventDefault();
        onEscape();
      }
    };

    // Agregar listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    enabled,
    isModalOpen,
    onNext,
    onPrevious,
    onToggleFlag,
    onSelectOption,
    onEscape,
    totalOptions
  ]);
}

/**
 * Anuncia una acción al lector de pantalla
 * Usa un div oculto con aria-live
 */
function announceAction(message) {
  const announcer = getOrCreateAnnouncer();
  
  // Limpiar mensaje anterior
  announcer.textContent = '';
  
  // Pequeño delay para asegurar que el screen reader detecta el cambio
  setTimeout(() => {
    announcer.textContent = message;
  }, 100);

  // Limpiar después de 3 segundos
  setTimeout(() => {
    announcer.textContent = '';
  }, 3000);
}

/**
 * Obtiene o crea el elemento anunciador para screen readers
 */
function getOrCreateAnnouncer() {
  let announcer = document.getElementById('keyboard-announcer');
  
  if (!announcer) {
    announcer = document.createElement('div');
    announcer.id = 'keyboard-announcer';
    announcer.className = 'sr-only';
    announcer.setAttribute('role', 'status');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    document.body.appendChild(announcer);
  }
  
  return announcer;
}
