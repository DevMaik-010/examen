import { LaTeXText } from '../common/LaTeXText';

// ============================================
// COMPONENTE: PREGUNTA TIPO 1 - VERDADERO/FALSO
// Con soporte para fórmulas LaTeX
// ============================================

export function QuestionType1({ question, currentAnswer, onAnswer }) {
  const handleAnswer = (value) => {
    onAnswer(value);
  };

  return (
    <div className="question-type-1">
      <div className="question-text">
        <LaTeXText>{question.pregunta}</LaTeXText>
      </div>

      <div className="vf-buttons">
        <button
          className={`vf-button vf-true ${currentAnswer === 'Verdadero' ? 'selected' : ''}`}
          onClick={() => handleAnswer('Verdadero')}
        >
          <span className="vf-icon">✓</span>
          <span className="vf-label">Verdadero</span>
        </button>

        <button
          className={`vf-button vf-false ${currentAnswer === 'Falso' ? 'selected' : ''}`}
          onClick={() => handleAnswer('Falso')}
        >
          <span className="vf-icon">✗</span>
          <span className="vf-label">Falso</span>
        </button>
      </div>

      <style>{`
        .question-type-1 {
          width: 100%;
        }

        .question-text {
          font-size: 1.2rem;
          line-height: 1.8;
          color: var(--text-primary);
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: var(--bg-input);
          border-left: 4px solid var(--text-accent);
          border-radius: 8px;
        }

        .vf-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .vf-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 1.5rem 2rem;
          font-family: 'Fira Code', monospace;
          font-size: 1.1rem;
          font-weight: 600;
          border: 2px solid var(--border-input);
          border-radius: 12px;
          background: var(--bg-card);
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
        }

        .vf-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          transition: left 0.5s;
        }

        .vf-button:hover::before {
          left: 100%;
        }

        .vf-icon {
          font-size: 1.8rem;
          font-weight: bold;
        }

        .vf-label {
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .vf-true:hover {
          border-color: #00ff88;
          box-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
        }

        .vf-false:hover {
          border-color: #ff6b6b;
          box-shadow: 0 0 20px rgba(255, 107, 107, 0.3);
        }

        .vf-true.selected {
          background: linear-gradient(135deg, rgba(0, 255, 136, 0.2), rgba(0, 200, 100, 0.2));
          border-color: #00ff88;
          color: #00ff88;
          box-shadow: 0 0 30px rgba(0, 255, 136, 0.4);
          transform: scale(1.05);
        }

        .vf-false.selected {
          background: linear-gradient(135deg, rgba(255, 107, 107, 0.2), rgba(220, 38, 38, 0.2));
          border-color: #ff6b6b;
          color: #ff6b6b;
          box-shadow: 0 0 30px rgba(255, 107, 107, 0.4);
          transform: scale(1.05);
        }

        [data-theme="light"] .vf-true.selected {
          color: #00cc66;
          border-color: #00cc66;
        }

        [data-theme="light"] .vf-false.selected {
          color: #dc2626;
          border-color: #dc2626;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .question-text {
            font-size: 1rem;
            padding: 1rem;
          }

          .vf-buttons {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .vf-button {
            padding: 1.2rem 1.5rem;
            font-size: 1rem;
          }

          .vf-icon {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
