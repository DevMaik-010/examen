"use client";

import { useState, useRef, useEffect } from "react";
import { useExam } from "@/context/ExamContext";

// ============================================
// COMPONENTE: PAGINACIÓN DE PREGUNTAS
// Navegación horizontal con scroll
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Estados para drag-to-scroll
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);

  const stats = getStats();
  const totalQuestions = examData.preguntas.length;

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

  // Drag-to-scroll handlers
  const handleMouseDown = (e: React.MouseEvent) => {
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
    setTimeout(() => setHasDragged(false), 100);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;

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
  const handleJump = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(jumpValue, 10);
    if (num >= 1 && num <= totalQuestions) {
      goToQuestion(num - 1);
      setJumpValue("");
    }
  };

  // Obtener estado de una pregunta
  const getQuestionState = (preguntaId: string, index: number) => {
    const isAnswered = getAnswer(preguntaId) !== undefined;
    const isFlaggedQuestion = isFlagged(preguntaId);
    const isCurrent = index === currentQuestionIndex;

    return {
      isAnswered,
      isFlagged: isFlaggedQuestion,
      isCurrent,
      className: `question-number ${isCurrent ? "current" : ""} ${isAnswered ? "answered" : ""} ${isFlaggedQuestion ? "flagged" : ""}`,
    };
  };

  const progressPercentage = Math.round(
    (stats.answeredQuestions / totalQuestions) * 100,
  );

  return (
    <nav className="question-pagination">
      {/* Navegación scrolleable */}
      <div
        className="pagination-scroll-container custom-scrollbar"
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {examData.preguntas.map((pregunta, index) => {
          const state = getQuestionState(pregunta.id, index);

          return (
            <button
              key={pregunta.id}
              className={state.className}
              onClick={() => {
                if (!hasDragged) {
                  goToQuestion(index);
                }
              }}
            >
              <span>{index + 1}</span>
              {state.isFlagged && <span className="flag-indicator">🚩</span>}
            </button>
          );
        })}
      </div>

      {/* Info y salto rápido */}
      <div className="pagination-info">
        <span className="info-text">
          Pregunta <strong>{currentQuestionIndex + 1}</strong> de{" "}
          <strong>{totalQuestions}</strong> ·{" "}
          <strong>{stats.answeredQuestions}</strong> respondidas (
          {progressPercentage}%)
        </span>

        <form className="jump-form" onSubmit={handleJump}>
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
          />
          <button type="submit" className="jump-btn" disabled={!jumpValue}>
            →
          </button>
        </form>
      </div>

      <style jsx>{`
        .question-pagination {
          width: 100%;
          background: var(--bg-card);
          border: 2px solid var(--border-card);
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: var(--shadow-card);
        }

        .pagination-scroll-container {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
          overflow-x: auto;
          overflow-y: hidden;
          padding: 0.5rem 0;
          cursor: grab;
          user-select: none;
        }

        .pagination-scroll-container:active {
          cursor: grabbing;
        }

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
        }

        .question-number.current {
          background: #3b5998 !important;
          border-color: #3b5998 !important;
          color: white !important;
          box-shadow: 0 0 0 3px rgba(59, 89, 152, 0.3) !important;
          transform: scale(1.1);
        }

        .question-number.answered:not(.current) {
          background: #00ff88;
          border-color: #00ff88;
          color: #0a0e27;
        }

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
          color: var(--text-accent);
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
          margin: 0;
        }

        .jump-input:focus {
          outline: none;
          border-color: var(--text-accent);
        }

        .jump-btn {
          padding: 0.4rem 0.8rem;
          border: 2px solid var(--text-accent);
          border-radius: 6px;
          background: var(--text-accent);
          color: var(--bg-card);
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .jump-btn:hover:not(:disabled) {
          transform: translateX(2px);
        }

        .jump-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .pagination-info {
            flex-direction: column;
            align-items: flex-start;
          }

          .jump-form {
            width: 100%;
          }
        }
      `}</style>
    </nav>
  );
}
