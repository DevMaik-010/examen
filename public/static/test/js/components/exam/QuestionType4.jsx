import { useState, useEffect } from 'react';
import { LaTeXText } from '../common/LaTeXText';

// ============================================
// COMPONENTE: PREGUNTA TIPO 4 - RESPUESTA ABIERTA
// Permite escribir texto libre
// Con soporte para fórmulas LaTeX
// ============================================

export function QuestionType4({ question, currentAnswer, onAnswer }) {
  const [text, setText] = useState(currentAnswer || '');
  const [charCount, setCharCount] = useState(currentAnswer?.length || 0);

  useEffect(() => {
    setText(currentAnswer || '');
    setCharCount(currentAnswer?.length || 0);
  }, [currentAnswer]);

  const handleChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    setCharCount(newText.length);
    onAnswer(newText);
  };

  const minChars = 10;
  const maxChars = 500;
  const isTooShort = charCount > 0 && charCount < minChars;
  const isNearLimit = charCount > maxChars * 0.9;

  return (
    <div className="question-type-4">
      <div className="question-text">
        <LaTeXText>{question.pregunta}</LaTeXText>
      </div>

      <div className="hint-text">
        💡 Escribe tu respuesta (mínimo {minChars} caracteres, máximo {maxChars})
      </div>

      <textarea
        className={`answer-textarea ${isTooShort ? 'warning' : ''} ${isNearLimit ? 'near-limit' : ''}`}
        placeholder="Escribe tu respuesta aquí..."
        value={text}
        onChange={handleChange}
        maxLength={maxChars}
        rows={8}
      />

      <div className="textarea-footer">
        <div className={`char-counter ${isTooShort ? 'warning' : ''} ${isNearLimit ? 'near-limit' : ''}`}>
          {charCount} / {maxChars} caracteres
          {isTooShort && (
            <span className="char-warning">
              {' '}(mínimo {minChars})
            </span>
          )}
        </div>

        {charCount >= minChars && (
          <div className="char-valid">
            ✓ Longitud válida
          </div>
        )}
      </div>

      <style>{`
        .question-type-4 {
          width: 100%;
        }

        .question-text {
          font-size: 1.2rem;
          line-height: 1.8;
          color: var(--text-primary);
          margin-bottom: 1rem;
          padding: 1.5rem;
          background: var(--bg-input);
          border-left: 4px solid var(--text-accent);
          border-radius: 8px;
        }

        .hint-text {
          font-size: 0.9rem;
          color: var(--text-accent);
          margin-bottom: 1rem;
          font-style: italic;
        }

        .answer-textarea {
          width: 100%;
          padding: 1.5rem;
          font-family: 'Fira Code', monospace;
          font-size: 1rem;
          line-height: 1.6;
          background: var(--bg-input);
          border: 2px solid var(--border-input);
          border-radius: 10px;
          color: var(--text-primary);
          resize: vertical;
          min-height: 200px;
          transition: all 0.3s ease;
        }

        .answer-textarea:focus {
          outline: none;
          border-color: var(--text-accent);
          box-shadow: 0 0 20px rgba(0, 255, 255, 0.2);
        }

        [data-theme="light"] .answer-textarea:focus {
          box-shadow: 0 0 20px rgba(37, 99, 235, 0.2);
        }

        .answer-textarea::placeholder {
          color: var(--text-muted);
          opacity: 0.6;
        }

        .answer-textarea.warning {
          border-color: #ffc107;
        }

        .answer-textarea.warning:focus {
          box-shadow: 0 0 20px rgba(255, 193, 7, 0.3);
        }

        .answer-textarea.near-limit {
          border-color: #ff6b6b;
        }

        .answer-textarea.near-limit:focus {
          box-shadow: 0 0 20px rgba(255, 107, 107, 0.3);
        }

        .textarea-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 0.75rem;
          font-family: 'Fira Code', monospace;
          font-size: 0.9rem;
        }

        .char-counter {
          color: var(--text-secondary);
          transition: color 0.3s ease;
        }

        .char-counter.warning {
          color: #ffc107;
          font-weight: 600;
        }

        .char-counter.near-limit {
          color: #ff6b6b;
          font-weight: 700;
          animation: pulse-warning 1.5s infinite;
        }

        .char-warning {
          font-weight: 600;
        }

        .char-valid {
          color: #00ff88;
          font-weight: 600;
          animation: fadeIn 0.3s ease-in;
        }

        [data-theme="light"] .char-valid {
          color: #00cc66;
        }

        @keyframes pulse-warning {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .question-text {
            font-size: 1rem;
            padding: 1rem;
          }

          .answer-textarea {
            font-size: 0.9rem;
            padding: 1rem;
            min-height: 150px;
          }

          .textarea-footer {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}
