import { useState, useEffect } from 'react';
import { LaTeXText } from '../common/LaTeXText';

// ============================================
// COMPONENTE: PREGUNTA TIPO 2 - SELECCIÓN MÚLTIPLE
// Permite seleccionar varias opciones
// Con soporte para fórmulas LaTeX
// ============================================

export function QuestionType2({ question, currentAnswer, onAnswer }) {
  const [selectedOptions, setSelectedOptions] = useState(currentAnswer || []);

  useEffect(() => {
    setSelectedOptions(currentAnswer || []);
  }, [currentAnswer]);

  const handleToggleOption = (option) => {
    let newSelected;
    
    if (selectedOptions.includes(option)) {
      // Deseleccionar
      newSelected = selectedOptions.filter(item => item !== option);
    } else {
      // Seleccionar
      newSelected = [...selectedOptions, option];
    }
    
    setSelectedOptions(newSelected);
    onAnswer(newSelected);
  };

  return (
    <div className="question-type-2">
      <div className="question-text">
        <LaTeXText>{question.pregunta}</LaTeXText>
      </div>

      <div className="hint-text">
        💡 Selecciona todas las opciones correctas
      </div>

      <div className="options-list">
        {question.opciones.map((option, index) => {
          const isSelected = selectedOptions.includes(option);
          
          return (
            <button
              key={index}
              className={`option-button ${isSelected ? 'selected' : ''}`}
              onClick={() => handleToggleOption(option)}
            >
              <span className="option-checkbox">
                {isSelected ? '☑' : '☐'}
              </span>
              <span className="option-text">
                <LaTeXText>{option}</LaTeXText>
              </span>
            </button>
          );
        })}
      </div>

      {selectedOptions.length > 0 && (
        <div className="selected-count">
          {selectedOptions.length} opción{selectedOptions.length !== 1 ? 'es' : ''} seleccionada{selectedOptions.length !== 1 ? 's' : ''}
        </div>
      )}

      <style>{`
        .question-type-2 {
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
          margin-bottom: 1.5rem;
          font-style: italic;
        }

        .options-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .option-button {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.2rem 1.5rem;
          font-family: 'Fira Code', monospace;
          font-size: 1rem;
          text-align: left;
          border: 2px solid var(--border-input);
          border-radius: 10px;
          background: var(--bg-card);
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .option-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent);
          transition: left 0.5s;
        }

        .option-button:hover::before {
          left: 100%;
        }

        .option-button:hover {
          border-color: var(--text-accent);
          transform: translateX(5px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .option-checkbox {
          font-size: 1.8rem;
          min-width: 30px;
          text-align: center;
          color: var(--text-accent);
        }

        .option-text {
          flex: 1;
          line-height: 1.6;
        }

        .option-button.selected {
          background: linear-gradient(
            135deg,
            var(--bg-badge),
            rgba(var(--text-accent-rgb), 0.1)
          );
          border-color: var(--text-accent);
          box-shadow: 0 0 20px rgba(0, 255, 255, 0.2);
          transform: translateX(5px);
        }

        [data-theme="light"] .option-button.selected {
          box-shadow: 0 0 20px rgba(37, 99, 235, 0.2);
        }

        .selected-count {
          margin-top: 1.5rem;
          padding: 0.75rem 1rem;
          background: var(--bg-info);
          border: 1px solid var(--border-info);
          border-radius: 8px;
          text-align: center;
          font-size: 0.95rem;
          color: var(--text-accent);
          font-weight: 600;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .question-text {
            font-size: 1rem;
            padding: 1rem;
          }

          .option-button {
            padding: 1rem;
            font-size: 0.9rem;
          }

          .option-checkbox {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
