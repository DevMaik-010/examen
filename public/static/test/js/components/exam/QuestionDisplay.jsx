import { QuestionType1 } from './QuestionType1';
import { QuestionType2 } from './QuestionType2';
import { QuestionType3 } from './QuestionType3';
import { QuestionType4 } from './QuestionType4';

// ============================================
// COMPONENTE: DISPLAY DE PREGUNTA
// Renderiza el tipo correcto de pregunta
// ============================================

export function QuestionDisplay({ question, currentAnswer, onAnswer }) {
  // Renderizar el componente apropiado según el tipo de pregunta
  const renderQuestion = () => {
    switch (question.tipo_de_pregunta) {
      case 1:
        // Verdadero/Falso
        return (
          <QuestionType1
            question={question}
            currentAnswer={currentAnswer}
            onAnswer={onAnswer}
          />
        );

      case 2:
        // Selección Múltiple
        return (
          <QuestionType2
            question={question}
            currentAnswer={currentAnswer}
            onAnswer={onAnswer}
          />
        );

      case 3:
        // Selección Simple
        return (
          <QuestionType3
            question={question}
            currentAnswer={currentAnswer}
            onAnswer={onAnswer}
          />
        );

      case 4:
        // Respuesta Abierta
        return (
          <QuestionType4
            question={question}
            currentAnswer={currentAnswer}
            onAnswer={onAnswer}
          />
        );

      default:
        return (
          <div className="question-error">
            ⚠️ Tipo de pregunta no reconocido: {question.tipo_de_pregunta}
          </div>
        );
    }
  };

  return (
    <div className="question-display">
      {/* Indicador del tipo de pregunta */}
      <div className="question-type-badge">
        {getQuestionTypeName(question.tipo_de_pregunta)}
      </div>

      {/* Renderizar pregunta */}
      {renderQuestion()}

      <style>{`
        .question-display {
          width: 100%;
          animation: slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .question-type-badge {
          display: inline-block;
          padding: 0.5rem 1rem;
          margin-bottom: 1.5rem;
          background: var(--bg-badge);
          border: 1px solid var(--border-badge);
          border-radius: 20px;
          font-family: 'Fira Code', monospace;
          font-size: 0.85rem;
          color: var(--text-accent);
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 600;
        }

        .question-error {
          padding: 2rem;
          background: rgba(255, 107, 107, 0.1);
          border: 2px solid #ff6b6b;
          border-radius: 12px;
          color: #ff6b6b;
          text-align: center;
          font-size: 1.1rem;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
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

// Función auxiliar para obtener el nombre del tipo de pregunta
function getQuestionTypeName(type) {
  const types = {
    1: '📝 Verdadero/Falso',
    2: '☑️ Selección Múltiple',
    3: '⦿ Selección Simple',
    4: '✍️ Respuesta Abierta'
  };

  return types[type] || '❓ Tipo Desconocido';
}
