import { useState } from "react";
import { useExam } from "../../hooks/useExam";
import { useKeyboardShortcuts } from "../../hooks/useKeyboardShortcuts";
import { Timer } from "./Timer";
import { QuestionDisplay } from "./QuestionDisplay";
import { QuestionPagination } from "./QuestionPagination";
import { KeyboardHelp } from "./KeyboardHelp";
import { useEffect } from "react";

// ============================================
// COMPONENTE: MOTOR DEL EXAMEN
// Orquesta todo el sistema de preguntas con navegación mejorada
// ============================================

export function ExamEngine() {
  const {
    currentQuestionIndex,
    getCurrentQuestion,
    saveAnswer,
    nextQuestion,
    previousQuestion,
    toggleFlag,
    isFlagged,
    finishExam,
    getAnswer,
    getStats,
    examData,
    syncTimeWithBackend,
  } = useExam();

  const currentQuestion = getCurrentQuestion();
  const stats = getStats();
  const [isPaused] = useState(false); // setIsPaused no usado por ahora
  const [showFinishModal, setShowFinishModal] = useState(false); // Modal de confirmación
  const [isTimeUp, setIsTimeUp] = useState(false); // Nuevo estado para indicar si se acabó el tiempo

  useEffect(() => {
    const timeUp = localStorage.getItem("exam_time_up");
    if (timeUp === "true") {
      console.log("⚠️ Tiempo ya agotado - Mostrando modal persistente");
      setIsTimeUp(true);
      setShowFinishModal(true);
    }
  }, []);

  // Atajos de teclado para accesibilidad y navegación rápida
  useKeyboardShortcuts({
    onNext: nextQuestion,
    onPrevious: previousQuestion,
    onToggleFlag: () => toggleFlag(currentQuestion?.id),
    onSelectOption: (optionIndex) => {
      if (currentQuestion?.opciones && currentQuestion.opciones[optionIndex]) {
        saveAnswer(currentQuestion.opciones[optionIndex]);
      }
    },
    onEscape: () => {
      if (showFinishModal && !isTimeUp) {
        setShowFinishModal(false);
      }
    },
    totalOptions: currentQuestion?.opciones?.length || 0,
    isModalOpen: showFinishModal,
    enabled: true,
  });

  // Validar que existan datos del examen (después de los hooks)
  if (!examData || !examData.preguntas || examData.preguntas.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "3rem" }}>
        <h2>Cargando prueba...</h2>
        <p>Por favor espera</p>
      </div>
    );
  }

  // Obtener respuesta actual directamente del contexto
  const currentAnswer = getAnswer(currentQuestion.id);

  // Manejar cuando se guarda una respuesta
  const handleAnswer = (answer) => {
    saveAnswer(answer);
  };

  // Manejar cuando el tiempo global se acaba
  const handleTimeUp = async () => {
    console.log("⏰ Tiempo agotado - Guardando estado y finalizando...");

    // ✅ Marcar que el tiempo se agotó
    localStorage.setItem("exam_time_up", "true");

    setIsTimeUp(true);
    setShowFinishModal(true);

    // ✅ Finalizar examen automáticamente (enviar respuestas)
    await finishExam();

    // Ya no es necesario mostrar modal aquí porque finishExam() redirige a /fin
  };

  // Manejar navegación manual
  const handleNext = () => {
    nextQuestion();
  };

  const handlePrevious = () => {
    previousQuestion();
  };

  // Manejar marcar/desmarcar pregunta
  const handleToggleFlag = () => {
    toggleFlag(currentQuestion.id);
  };

  // Abrir modal de confirmación
  const handleFinishClick = () => {
    setShowFinishModal(true);
  };

  // Confirmar finalización
  const handleConfirmFinish = async () => {
    setShowFinishModal(false);
    if (isTimeUp) {
      localStorage.removeItem("exam_time_up");
    }
    await finishExam();
  };

  // Cancelar finalización
  const handleCancelFinish = () => {
    if (!isTimeUp) {
      setShowFinishModal(false);
    }
  };

  // Verificar si puede avanzar o retroceder
  const canGoNext = currentQuestionIndex < examData.preguntas.length - 1; // ✅ CORRECTO
  const canGoPrevious = currentQuestionIndex > 0;
  const isCurrentFlagged = isFlagged(currentQuestion.id);

  return (
    <div className="exam-engine">
      {/* Timer global - sincronizado con backend cada 30s */}
      <Timer
        onTimeUp={handleTimeUp}
        isPaused={isPaused}
        totalTime={examData.tiempo_total || 7200}
        elapsedTime={examData.tiempo_transcurrido || 0}
        onSyncRequired={syncTimeWithBackend}
      />

      {/* Header del examen */}
      <div className="exam-header">
        <div className="exam-header-content">
          <h2 className="exam-title">{examData.tema}</h2>
          <p className="exam-description">{examData.descripcion}</p>
        </div>
      </div>

      {/* Barra de progreso */}
      {/* <ProgressBar
        current={stats.currentQuestion}
        total={stats.totalQuestions}
        percentage={stats.progressPercentage}
      /> */}

      {/* Botones de navegación superiores */}
      <nav
        className="exam-controls-top"
        role="navigation"
        aria-label="Navegación entre preguntas"
      >
        <button
          className={`control-btn btn-secondary ${!canGoPrevious ? "disabled" : ""}`}
          onClick={handlePrevious}
          disabled={!canGoPrevious}
          aria-label={`Ir a pregunta anterior. Pregunta actual: ${stats.currentQuestion} de ${stats.totalQuestions}`}
          aria-disabled={!canGoPrevious}
        >
          <span aria-hidden="true">←</span> Anterior
        </button>

        <button
          className={`control-btn btn-primary ${!canGoNext ? "disabled" : ""}`}
          onClick={handleNext}
          disabled={!canGoNext}
          aria-label={`Ir a siguiente pregunta. Pregunta actual: ${stats.currentQuestion} de ${stats.totalQuestions}`}
          aria-disabled={!canGoNext}
        >
          Siguiente <span aria-hidden="true">→</span>
        </button>
      </nav>

      {/* Contenedor de la pregunta */}
      <main
        className="question-container"
        role="main"
        aria-label={`Pregunta ${stats.currentQuestion} de ${stats.totalQuestions}`}
      >
        <QuestionDisplay
          question={currentQuestion}
          currentAnswer={currentAnswer}
          onAnswer={handleAnswer}
        />
      </main>

      {/* Paginación de preguntas */}
      <QuestionPagination />

      {/* Controles de navegación */}
      <nav
        className="exam-controls"
        role="navigation"
        aria-label="Controles principales de la prueba"
      >
        {/* Botones de navegación y acción */}
        <div className="control-buttons">
          <button
            className={`control-btn btn-secondary ${!canGoPrevious ? "disabled" : ""}`}
            onClick={handlePrevious}
            disabled={!canGoPrevious}
            aria-label="Ir a pregunta anterior"
            aria-disabled={!canGoPrevious}
          >
            <span aria-hidden="true">←</span> Anterior
          </button>

          <button
            className={`control-btn btn-flag ${isCurrentFlagged ? "flagged" : ""}`}
            onClick={handleToggleFlag}
            aria-label={
              isCurrentFlagged
                ? "Quitar marca de revisión de esta pregunta"
                : "Marcar esta pregunta para revisión posterior"
            }
            aria-pressed={isCurrentFlagged}
          >
            <span aria-hidden="true">🚩</span>{" "}
            {isCurrentFlagged ? "Marcada" : "Marcar"}
          </button>

          <button
            className="control-btn btn-danger"
            onClick={handleFinishClick}
            aria-label={`Finalizar prueba y enviar respuestas. Has respondido ${stats.answeredQuestions} de ${stats.totalQuestions} preguntas`}
          >
            <span aria-hidden="true">✓</span> Finalizar Prueba
          </button>

          <button
            className={`control-btn btn-primary ${!canGoNext ? "disabled" : ""}`}
            onClick={handleNext}
            disabled={!canGoNext}
            aria-label="Ir a siguiente pregunta"
            aria-disabled={!canGoNext}
          >
            Siguiente <span aria-hidden="true">→</span>
          </button>
        </div>
      </nav>

      {/* Modal de confirmación */}
      {showFinishModal && (
        <div
          className="modal-overlay"
          onClick={handleCancelFinish}
          role="presentation"
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
          >
            <div className="modal-header">
              <h3 id="modal-title">
                <span aria-hidden="true">{isTimeUp ? "⏰" : "⚠️"}</span>{" "}
                {isTimeUp ? "¡Tiempo Terminado!" : "Confirmar Finalización"}
              </h3>
            </div>
            <div className="modal-body" id="modal-description">
              <p>
                {isTimeUp
                  ? "El tiempo de la prueba se ha agotado. A continuación verás el resumen de tus respuestas antes de finalizar."
                  : "¿Estás seguro de que deseas finalizar la prueba?"}
              </p>
              <div
                className="modal-stats"
                role="status"
                aria-label="Estadísticas de la prueba"
              >
                <p>
                  <strong>Total preguntas:</strong> {stats.totalQuestions}
                </p>
                <p>
                  <strong>Respondidas:</strong> {stats.answeredQuestions}
                </p>
                <p>
                  <strong>Sin responder:</strong> {stats.unansweredQuestions}
                </p>
                {stats.flaggedQuestions > 0 && (
                  <p>
                    <strong>
                      <span aria-hidden="true">🚩</span> Marcadas:
                    </strong>{" "}
                    {stats.flaggedQuestions}
                  </p>
                )}
              </div>
              {stats.unansweredQuestions > 0 && (
                <p
                  style={{ color: "#ff9800", marginTop: "1rem" }}
                  role="alert"
                  aria-live="polite"
                >
                  <span aria-hidden="true">⚠️</span> Tienes{" "}
                  {stats.unansweredQuestions} pregunta(s) sin responder.
                </p>
              )}
              {stats.flaggedQuestions > 0 && (
                <p
                  style={{ color: "#ff9800", marginTop: "0.5rem" }}
                  role="alert"
                  aria-live="polite"
                >
                  <span aria-hidden="true">🚩</span> Tienes{" "}
                  {stats.flaggedQuestions} pregunta(s) marcada(s) para revisar.
                </p>
              )}
            </div>
            <div className="modal-footer">
              {!isTimeUp && (
                <button
                  className="modal-btn btn-cancel"
                  onClick={handleCancelFinish}
                  aria-label="Cancelar y volver a la prueba"
                >
                  Cancelar
                </button>
              )}
              <button
                className="modal-btn btn-confirm"
                onClick={handleConfirmFinish}
                aria-label="Confirmar finalización y enviar respuestas"
              >
                Sí, Finalizar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Estadísticas */}
      <div className="exam-stats">
        <div className="stat-item">
          <span className="stat-label">Respondidas:</span>
          <span className="stat-value">
            {stats.answeredQuestions}/{stats.totalQuestions}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Sin responder:</span>
          <span className="stat-value">{stats.unansweredQuestions}</span>
        </div>
      </div>

      {/* Ayuda de atajos de teclado */}
      <KeyboardHelp />

      <style>{`
        .exam-engine {
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
          padding: 2rem;
          padding-top: 1rem;
        }

        .exam-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
        }

        .exam-header-content {
          flex: 1;
          max-width: 700px;
        }

        .exam-title {
          font-family: 'Orbitron', sans-serif;
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, var(--text-gradient-start) 0%, var(--text-gradient-end) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .exam-description {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin: 0;
        }

        .question-container {
          background: var(--bg-card);
          border: 1px solid var(--border-card);
          border-radius: 16px;
          padding: 2.5rem;
          margin: 2rem 0;
          box-shadow: var(--shadow-card);
        }

        .exam-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          margin: 2rem 0;
          flex-wrap: wrap;
        }

        .control-navigator {
          flex: 0 0 auto;
        }

        .control-buttons {
          display: flex;
          gap: 1rem;
          flex: 1;
          justify-content: flex-end;
        }

        .control-btn {
          padding: 1rem 2rem;
          font-family: 'Fira Code', monospace;
          font-size: 1rem;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .btn-primary {
          background: linear-gradient(135deg, var(--text-gradient-start) 0%, var(--text-gradient-end) 100%);
          color: var(--bg-card);
          box-shadow: var(--shadow-button);
          margin-left: auto;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: var(--shadow-button-hover);
        }

        .btn-secondary {
          background: var(--bg-card);
          color: var(--text-primary);
          border: 2px solid var(--border-card);
          box-shadow: var(--shadow-card);
        }

        .btn-secondary:hover:not(:disabled) {
          background: var(--bg-hover);
          border-color: var(--primary);
          transform: translateY(-2px);
        }

        .btn-flag {
          background: var(--bg-card);
          color: var(--text-primary);
          border: 2px solid var(--border-card);
          box-shadow: var(--shadow-card);
        }

        .btn-flag:hover {
          background: var(--bg-hover);
          border-color: #ff9800;
          transform: translateY(-2px);
        }

        .btn-flag.flagged {
          background: #ff9800;
          border-color: #ff9800;
          color: white;
        }

        .btn-flag.flagged:hover {
          background: #f57c00;
          border-color: #f57c00;
        }

        .btn-danger {
          background: linear-gradient(135deg, #ff5252 0%, #f44336 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(244, 67, 54, 0.4);
        }

        .btn-danger:hover {
          background: linear-gradient(135deg, #ff1744 0%, #d32f2f 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(244, 67, 54, 0.5);
        }

        /* Controles superiores */
        .exam-controls-top {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          margin: 1.5rem 0;
          padding: 1rem;
          background: var(--bg-input);
          border-radius: 12px;
        }

        .exam-controls-top .control-btn {
          flex: 1;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
        }

        .modal-content {
          background: var(--bg-card);
          border-radius: 16px;
          padding: 2rem;
          max-width: 500px;
          width: 90%;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          border: 2px solid var(--border-card);
        }

        .modal-header {
          margin-bottom: 1.5rem;
        }

        .modal-header h3 {
          margin: 0;
          color: var(--text-primary);
          font-size: 1.5rem;
        }

        .modal-body {
          margin-bottom: 2rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .modal-body p {
          margin: 0.5rem 0;
        }

        .modal-stats {
          background: var(--bg-input);
          padding: 1rem;
          border-radius: 8px;
          margin: 1rem 0;
        }

        .modal-stats p {
          margin: 0.5rem 0;
          font-family: 'Fira Code', monospace;
        }

        .modal-footer {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
        }

        .modal-btn {
          padding: 0.75rem 1.5rem;
          font-family: 'Fira Code', monospace;
          font-size: 0.95rem;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-cancel {
          background: var(--bg-card);
          color: var(--text-primary);
          border: 2px solid var(--border-card);
        }

        .btn-cancel:hover {
          background: var(--bg-hover);
          border-color: var(--primary);
        }

        .btn-confirm {
          background: linear-gradient(135deg, #ff5252 0%, #f44336 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(244, 67, 54, 0.4);
        }

        .btn-confirm:hover {
          background: linear-gradient(135deg, #ff1744 0%, #d32f2f 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(244, 67, 54, 0.5);
        }

        .control-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none !important;
        }

        .control-info {
          flex: 1;
          text-align: left;
        }

        .answer-hint {
          font-size: 0.9rem;
          color: var(--text-accent);
          font-style: italic;
        }

        .exam-stats {
          display: flex;
          justify-content: center;
          gap: 2rem;
          padding: 1.5rem;
          background: var(--bg-input);
          border-radius: 12px;
          margin-top: 2rem;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: 'Fira Code', monospace;
        }

        .stat-label {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .stat-value {
          color: var(--text-accent);
          font-weight: 700;
          font-size: 1.1rem;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .exam-engine {
            padding: 1rem;
            padding-top: 0.5rem;
          }

          .exam-header {
            flex-direction: column;
          }

          .exam-title {
            font-size: 1.2rem;
          }

          .question-container {
            padding: 1.5rem;
          }

          .exam-controls-top {
            flex-direction: column;
          }

          .exam-controls-top .control-btn {
            width: 100%;
          }

          .exam-controls {
            margin: 1rem 0;
          }

          .control-buttons {
            width: 100%;
            flex-direction: column;
            gap: 0.75rem;
          }

          .control-btn {
            width: 100%;
          }

          .modal-content {
            width: 95%;
            padding: 1.5rem;
          }

          .modal-footer {
            flex-direction: column;
          }

          .modal-btn {
            width: 100%;
          }

          .control-info {
            text-align: center;
          }

          .exam-stats {
            flex-direction: column;
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
