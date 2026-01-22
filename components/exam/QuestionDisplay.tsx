"use client";

import { Pregunta } from "@/lib/data";

// ============================================
// COMPONENTE: DISPLAY DE PREGUNTA
// Renderiza pregunta tipo selección simple
// ============================================

interface QuestionDisplayProps {
  question: Pregunta;
  currentAnswer: string | undefined;
  onAnswer: (answer: string) => void;
}

export function QuestionDisplay({
  question,
  currentAnswer,
  onAnswer,
}: QuestionDisplayProps) {
  return (
    <div className="question-display">
      {/* Indicador del tipo de pregunta */}
      <div className="badge-info mb-6">◉ SELECCIÓN SIMPLE</div>

      {/* Mostrar artículo si existe (comprensión lectora) */}
      {question.articulo && (
        <div className="article-container mb-6">
          <div className="article-header">
            <span>📖</span> Artículo de Lectura
            <span className="scroll-indicator">↕️ Desliza para leer</span>
          </div>
          <div className="article-content custom-scrollbar">
            {question.articulo}
          </div>
        </div>
      )}

      {/* Pregunta */}
      <div className="question-text mb-8">
        <p
          className="texto text-lg leading-relaxed"
          style={{ color: "var(--text-primary)" }}
        >
          {question.pregunta}
        </p>
      </div>

      {/* Instrucción */}
      <p className="texto mb-6 text-base text-accent italic">
        💡 Selecciona una sola opción
      </p>

      {/* Options */}
      <div className="space-y-4">
        {question.opciones.map((opcion, index) => (
          <label
            key={index}
            className={`option-item ${currentAnswer === opcion ? "option-selected" : ""}`}
            onClick={() => onAnswer(opcion)}
          >
            <span
              className={`option-radio ${currentAnswer === opcion ? "option-radio-selected" : ""}`}
            >
              {currentAnswer === opcion && (
                <span className="option-radio-dot"></span>
              )}
            </span>
            <span className="texto text-base">{opcion}</span>
          </label>
        ))}
      </div>

      <style jsx>{`
        .article-container {
          padding: 1.5rem;
          background: var(--bg-input);
          border-radius: 12px;
          border: 2px solid var(--border-card);
        }

        .article-header {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-accent);
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid var(--border-card);
          font-family: var(--font-orbitron), sans-serif;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .scroll-indicator {
          font-size: 0.85rem;
          font-weight: 500;
          color: #0099ff;
          background: rgba(0, 255, 255, 0.1);
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          border: 1px solid rgba(0, 255, 255, 0.3);
          font-family: var(--font-fira-code), monospace;
        }

        .article-content {
          font-size: 1rem;
          line-height: 1.8;
          color: var(--text-primary);
          max-height: 300px;
          overflow-y: auto;
          padding-right: 1rem;
          white-space: pre-wrap;
        }

        .question-display {
          width: 100%;
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
