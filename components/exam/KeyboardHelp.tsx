"use client";

import { useState } from "react";

// ============================================
// COMPONENTE: AYUDA DE ATAJOS DE TECLADO
// ============================================

export function KeyboardHelp() {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts = [
    {
      category: "Navegación",
      items: [
        { keys: ["Ctrl", "→"], description: "Siguiente pregunta" },
        { keys: ["Ctrl", "←"], description: "Pregunta anterior" },
        { keys: ["Tab"], description: "Navegar entre elementos" },
      ],
    },
    {
      category: "Selección Rápida",
      items: [
        {
          keys: ["1", "2", "3", "4"],
          description: "Seleccionar opción por número",
        },
        {
          keys: ["A", "B", "C", "D"],
          description: "Seleccionar opción por letra",
        },
      ],
    },
    {
      category: "Acciones",
      items: [
        { keys: ["Ctrl", "M"], description: "Marcar pregunta para revisión" },
        { keys: ["Escape"], description: "Cerrar diálogo" },
      ],
    },
  ];

  return (
    <>
      <button
        className="keyboard-help-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Mostrar atajos de teclado"
      >
        <span>⌨️</span>
        <span className="help-text">Atajos</span>
      </button>

      {isOpen && (
        <div className="keyboard-help-overlay" onClick={() => setIsOpen(false)}>
          <div
            className="keyboard-help-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="help-header">
              <h2>⌨️ Atajos de Teclado</h2>
              <button className="close-btn" onClick={() => setIsOpen(false)}>
                ✕
              </button>
            </div>

            <div className="help-content">
              {shortcuts.map((section, idx) => (
                <div key={idx} className="shortcut-section">
                  <h3 className="section-title">{section.category}</h3>
                  <div className="shortcuts-list">
                    {section.items.map((shortcut, i) => (
                      <div key={i} className="shortcut-item">
                        <div className="shortcut-keys">
                          {shortcut.keys.map((key, j) => (
                            <kbd key={j} className="key">
                              {key}
                            </kbd>
                          ))}
                        </div>
                        <span className="shortcut-description">
                          {shortcut.description}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .keyboard-help-button {
          position: fixed;
          bottom: 2rem;
          left: 2rem;
          z-index: 998;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: var(--bg-card);
          border: 2px solid var(--text-accent);
          border-radius: 12px;
          color: var(--text-primary);
          font-family: var(--font-fira-code), monospace;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          box-shadow: var(--shadow-card);
          transition: all 0.3s ease;
        }

        .keyboard-help-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 255, 255, 0.3);
        }

        .help-text {
          display: none;
        }

        @media (min-width: 768px) {
          .help-text {
            display: inline;
          }
        }

        .keyboard-help-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          z-index: 999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .keyboard-help-panel {
          background: var(--bg-card);
          border: 2px solid var(--border-card);
          border-radius: 16px;
          max-width: 600px;
          width: 100%;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }

        .help-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 2px solid var(--border-card);
          position: sticky;
          top: 0;
          background: var(--bg-card);
          z-index: 1;
        }

        .help-header h2 {
          margin: 0;
          color: var(--text-primary);
          font-size: 1.5rem;
          font-family: var(--font-orbitron), sans-serif;
        }

        .close-btn {
          background: transparent;
          border: 2px solid var(--border-card);
          border-radius: 8px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--text-secondary);
          font-size: 1.5rem;
          transition: all 0.2s ease;
        }

        .close-btn:hover {
          background: var(--bg-input);
          border-color: var(--text-accent);
          color: var(--text-primary);
        }

        .help-content {
          padding: 1.5rem;
        }

        .shortcut-section {
          margin-bottom: 2rem;
        }

        .section-title {
          color: var(--text-accent);
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 1rem;
          font-family: var(--font-orbitron), sans-serif;
        }

        .shortcuts-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .shortcut-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem;
          background: var(--bg-input);
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .shortcut-item:hover {
          transform: translateX(4px);
        }

        .shortcut-keys {
          display: flex;
          gap: 0.5rem;
          flex-shrink: 0;
        }

        .key {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 2rem;
          padding: 0.25rem 0.5rem;
          background: var(--bg-card);
          border: 2px solid var(--border-card);
          border-radius: 6px;
          font-family: var(--font-fira-code), monospace;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .shortcut-description {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin-left: 1rem;
        }

        @media (max-width: 768px) {
          .keyboard-help-button {
            bottom: 1rem;
            left: 1rem;
            padding: 0.75rem;
          }

          .shortcut-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .shortcut-description {
            margin-left: 0;
          }
        }
      `}</style>
    </>
  );
}
