import { useState, useRef, useEffect } from "react";
import { useExam } from "../../hooks/useExam";

// ============================================
// COMPONENTE: PAGINACIÓN DE PREGUNTAS CON SCROLL
// Navegación horizontal scrolleable con drag-to-scroll
// ============================================

export function QuestionPagination() {
  const {
    currentQuestionIndex,
    goToQuestion,
    getAnswer,
    isFlagged,
    examData,
    getStats,
  } = useExam();

  const [jumpValue, setJumpValue] = useState("");
  const scrollContainerRef = useRef(null);

  // Estados para drag-to-scroll
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);

  const stats = getStats();

  // Auto-scroll al botón actual
  useEffect(() => {
    if (scrollContainerRef.current) {
      const currentButton = scrollContainerRef.current.querySelector(
        ".question-number.current",
      );
      if (currentButton) {
        currentButton.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [currentQuestionIndex]);

  // Validar que existan preguntas (después de todos los hooks)
  if (!examData || !examData.preguntas || examData.preguntas.length === 0) {
    return <div>Cargando preguntas...</div>;
  }

  const totalQuestions = examData.preguntas.length;

  // Drag-to-scroll handlers
  const handleMouseDown = (e) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setHasDragged(false);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    scrollContainerRef.current.style.cursor = "grabbing";
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = "grab";
    }
    // Reset hasDragged después de un pequeño delay
    setTimeout(() => setHasDragged(false), 100);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;

    // Si se movió más de 5px, considerar como drag
    if (Math.abs(walk) > 5) {
      setHasDragged(true);
      scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.style.cursor = "grab";
      }
    }
  };

  // Salto rápido
  const handleJump = (e) => {
    e.preventDefault();
    const num = parseInt(jumpValue, 10);
    if (num >= 1 && num <= totalQuestions) {
      goToQuestion(num - 1);
      setJumpValue("");
    }
  };

  // Obtener estado de una pregunta
  const getQuestionState = (pregunta, index) => {
    const isAnswered = getAnswer(pregunta.id) !== undefined;
    const isFlaggedQuestion = isFlagged(pregunta.id);
    const isCurrent = index === currentQuestionIndex;

    return {
      isAnswered,
      isFlagged: isFlaggedQuestion,
      isCurrent,
      className: `question-number ${isCurrent ? "current" : ""} ${isAnswered ? "answered" : ""} ${isFlaggedQuestion ? "flagged" : ""}`,
    };
  };

  // Calcular progreso basado en respuestas contestadas
  const progressPercentage = Math.round(
    (stats.answeredQuestions / totalQuestions) * 100,
  );

  return (
    <nav
      className="question-pagination"
      role="navigation"
      aria-label="Navegación de preguntas del examen"
    >
      {/* Navegación scrolleable horizontal con drag */}
      <div
        className="pagination-scroll-container"
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        role="list"
        aria-label="Lista de preguntas"
        tabIndex="0"
      >
        {examData.preguntas.map((pregunta, index) => {
          const state = getQuestionState(pregunta, index);

          // Construir aria-label descriptivo
          const statusParts = [];
          if (state.isCurrent) statusParts.push("pregunta actual");
          if (state.isAnswered) statusParts.push("respondida");
          if (state.isFlagged) statusParts.push("marcada para revisión");
          if (!state.isAnswered && !state.isCurrent)
            statusParts.push("sin responder");

          const ariaLabel = `Pregunta ${index + 1} de ${totalQuestions}${statusParts.length > 0 ? ", " + statusParts.join(", ") : ""}`;

          return (
            <li // <-- Nuevo elemento <li> con rol implícito o explícito
              key={pregunta.id}
              // role="listitem"
            >
              <button // <-- Ahora el botón está DENTRO del listitem
                className={state.className}
                onClick={(e) => {
                  if (!hasDragged) {
                    goToQuestion(index);
                  }
                }}
                aria-label={ariaLabel}
                aria-current={state.isCurrent ? "step" : undefined}
              >
                {/* ... contenido del botón ... */}
                <span aria-hidden={state.isCurrent}>{index + 1}</span>
                {state.isCurrent && (
                  <span className="sr-only">Pregunta actual</span>
                )}
                {state.isFlagged && (
                  <>
                    <span className="flag-indicator" aria-hidden="true">
                      🚩
                    </span>
                    <span className="sr-only">Marcada</span>
                  </>
                )}
              </button>
            </li>
          );
        })}
      </div>

      {/* Info y salto rápido */}
      <div
        className="pagination-info"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <span
          className="info-text"
          aria-label={`Pregunta ${currentQuestionIndex + 1} de ${totalQuestions}. ${stats.answeredQuestions} preguntas respondidas de ${totalQuestions}, ${progressPercentage} por ciento completado`}
        >
          Pregunta <strong>{currentQuestionIndex + 1}</strong> de{" "}
          <strong>{totalQuestions}</strong>·{" "}
          <strong>{stats.answeredQuestions}</strong> respondidas (
          {progressPercentage}%)
        </span>

        <form
          className="jump-form"
          onSubmit={handleJump}
          role="search"
          aria-label="Ir a pregunta específica"
        >
          <label htmlFor="jump-input">Ir a pregunta:</label>
          <input
            id="jump-input"
            type="number"
            min="1"
            max={totalQuestions}
            value={jumpValue}
            onChange={(e) => setJumpValue(e.target.value)}
            placeholder="#"
            className="jump-input"
            aria-label={`Número de pregunta, entre 1 y ${totalQuestions}`}
            aria-describedby="jump-hint"
          />
          <span id="jump-hint" className="sr-only">
            Introduce un número de pregunta y presiona Enter para ir
            directamente
          </span>
          <button
            type="submit"
            className="jump-btn"
            disabled={!jumpValue}
            aria-label="Ir a la pregunta indicada"
          >
            <span aria-hidden="true">→</span>
          </button>
        </form>
      </div>

      <style>{`
        .question-pagination {
          width: 100%;
          background: var(--bg-card);
          border: 2px solid var(--border-card);
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: var(--shadow-card);
        }

        /* Container scrolleable con drag */
        .pagination-scroll-container {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
          overflow-x: auto;
          overflow-y: hidden;
          padding: 0.5rem 0;
          cursor: grab;
          user-select: none;
          
          /* Scrollbar personalizada - Firefox */
          scrollbar-width: thin;
          scrollbar-color: #00ffff #1a1f3a;
        }

        .pagination-scroll-container:active {
          cursor: grabbing;
        }

        /* Scrollbar personalizada - Chrome/Safari */
        .pagination-scroll-container::-webkit-scrollbar {
          height: 10px;
        }

        .pagination-scroll-container::-webkit-scrollbar-track {
          background: #1a1f3a;
          border-radius: 5px;
          box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.3);
        }

        .pagination-scroll-container::-webkit-scrollbar-thumb {
          background: linear-gradient(90deg, #00ffff, #00cccc);
          border-radius: 5px;
          border: 2px solid #0a0e27;
          box-shadow: 0 2px 6px rgba(0, 255, 255, 0.3);
        }

        .pagination-scroll-container::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(90deg, #00cccc, #00ffff);
          box-shadow: 0 2px 10px rgba(0, 255, 255, 0.6);
        }

        .pagination-scroll-container::-webkit-scrollbar-thumb:active {
          background: #00ffff;
          box-shadow: 0 2px 15px rgba(0, 255, 255, 0.8);
        }

        /* Modo claro */
        [data-theme="light"] .pagination-scroll-container::-webkit-scrollbar-track {
          background: #e8eef7;
          box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
        }

        [data-theme="light"] .pagination-scroll-container::-webkit-scrollbar-thumb {
          background: linear-gradient(90deg, #4a90e2, #3b7ac9);
          border: 2px solid #ffffff;
          box-shadow: 0 2px 6px rgba(74, 144, 226, 0.3);
        }

        [data-theme="light"] .pagination-scroll-container::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(90deg, #3b7ac9, #4a90e2);
          box-shadow: 0 2px 10px rgba(74, 144, 226, 0.6);
        }

        [data-theme="light"] .pagination-scroll-container {
          scrollbar-color: #4a90e2 #e8eef7;
        }

        /* Botones de números */
        .question-number {
          position: relative;
          min-width: 45px;
          height: 45px;
          padding: 0.5rem 0.75rem;
          border: 2px solid var(--border-card);
          border-radius: 8px;
          background: var(--bg-input);
          color: var(--text-primary);
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.25rem;
          user-select: none;
        }

        .question-number:hover {
          background: var(--bg-hover);
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        /* Pregunta actual - color azul oscuro */
        .question-number.current {
          background: #3b5998 !important;
          border-color: #3b5998 !important;
          color: white !important;
          box-shadow: 0 0 0 3px rgba(59, 89, 152, 0.3) !important;
          transform: scale(1.1);
        }

        /* Pregunta respondida - color verde */
        .question-number.answered:not(.current) {
          background: #00ff88;
          border-color: #00ff88;
          color: #0a0e27;
        }

        .question-number.answered:not(.current):hover {
          background: #00dd77;
        }

        /* Pregunta marcada - borde naranja */
        .question-number.flagged {
          border-color: #ff9800;
          box-shadow: 0 0 0 2px rgba(255, 152, 0, 0.3);
        }

        .flag-indicator {
          font-size: 0.7rem;
          position: absolute;
          top: -4px;
          right: -4px;
        }

        /* Info y salto */
        .pagination-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .info-text {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .info-text strong {
          color: var(--primary);
        }

        .jump-form {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .jump-form label {
          font-size: 0.85rem;
          color: var(--text-secondary);
          white-space: nowrap;
        }

        .jump-input {
          width: 60px;
          padding: 0.4rem 0.6rem;
          border: 2px solid var(--border-card);
          border-radius: 6px;
          background: var(--bg-input);
          color: var(--text-primary);
          font-size: 0.9rem;
          text-align: center;
        }

        .jump-input:focus {
          outline: none;
          border-color: var(--primary);
        }

        .jump-btn {
          padding: 0.4rem 0.8rem;
          border: 2px solid var(--primary);
          border-radius: 6px;
          background: var(--primary);
          color: var(--bg-card);
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .jump-btn:hover:not(:disabled) {
          background: #00cccc;
          border-color: #00cccc;
          transform: translateX(2px);
        }

        .jump-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .question-pagination {
            padding: 1rem;
          }

          .question-number {
            min-width: 40px;
            height: 40px;
            font-size: 0.85rem;
          }

          .pagination-info {
            flex-direction: column;
            align-items: flex-start;
          }

          .jump-form {
            width: 100%;
          }

          .info-text {
            font-size: 0.85rem;
          }
        }

        /* Screen Reader Only - Visible solo para lectores de pantalla */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }
      `}</style>
    </nav>
  );
}
