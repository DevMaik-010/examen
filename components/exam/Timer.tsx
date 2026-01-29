"use client";

import { useExam } from "@/context/ExamContext";

// ============================================
// COMPONENTE: TIMER GLOBAL
// Clonado fielmente de Timer.jsx con colores dinámicos
// ============================================

export function Timer() {
  const { tiempoRestante, examData } = useExam();

  const TIEMPO_TOTAL = examData.tiempo_total;

  // Formatear tiempo restante (HH:MM:SS)
  const formatearTiempo = (segundos: number) => {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segs = segundos % 60;
    return `${horas.toString().padStart(2, "0")}:${minutos.toString().padStart(2, "0")}:${segs.toString().padStart(2, "0")}`;
  };

  // Calcular el porcentaje de tiempo restante
  const percentage = (tiempoRestante / TIEMPO_TOTAL) * 100;

  // Determinar el color según el tiempo restante
  // >50% = verde (safe), >25% = amarillo (warning), <=25% = rojo (danger)
  const getColor = () => {
    if (percentage > 50) return "var(--timer-safe)";
    if (percentage > 25) return "var(--timer-warning)";
    return "var(--timer-danger)";
  };

  // Determinar si debe parpadear (últimos 5 minutos = 300 segundos)
  const shouldBlink = tiempoRestante <= 300 && tiempoRestante > 0;

  return (
    <div className="timer-container-fixed">
      <div
        className="timer-display"
        style={{
          color: getColor(),
          animation: shouldBlink ? "blink 1s infinite" : "none",
        }}
      >
        <span className="timer-icon">⏱️</span>
        <span className="timer-text">{formatearTiempo(tiempoRestante)}</span>
      </div>

      {/* Barra de progreso */}
      <div className="timer-bar">
        <div
          className="timer-bar-fill"
          style={{
            width: `${percentage}%`,
            backgroundColor: getColor(),
            transition: "width 1s linear, background-color 0.3s ease",
          }}
        />
      </div>

      {/* Etiqueta de tiempo total */}
      <div className="timer-label">
        Tiempo Total: {Math.floor(TIEMPO_TOTAL / 60)} minutos
      </div>

      <style jsx>{`
        .timer-container-fixed {
          position: fixed;
          top: 2rem;
          right: 2rem;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.5rem;
          z-index: 999;
          background: var(--bg-card);
          padding: 1rem;
          border-radius: 12px;
          border: 2px solid var(--border-card);
          box-shadow: var(--shadow-card);
          backdrop-filter: blur(10px);
        }

        .timer-display {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-orbitron), sans-serif;
          font-size: 1.8rem;
          font-weight: 700;
          padding: 0.5rem 1rem;
          background: var(--bg-timer);
          border: 2px solid currentColor;
          border-radius: 12px;
          min-width: 180px;
          justify-content: center;
          box-shadow: 0 0 20px currentColor;
        }

        .timer-icon {
          font-size: 2rem;
        }

        .timer-text {
          font-variant-numeric: tabular-nums;
        }

        .timer-bar {
          width: 100%;
          height: 8px;
          background: var(--bg-input);
          border-radius: 4px;
          overflow: hidden;
          min-width: 200px;
        }

        .timer-bar-fill {
          height: 100%;
          border-radius: 4px;
        }

        .timer-label {
          font-size: 0.75rem;
          color: var(--text-secondary);
          text-align: right;
          opacity: 0.7;
        }

        @keyframes blink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.3;
          }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .timer-container-fixed {
            top: 1rem;
            right: 1rem;
            padding: 0.75rem;
          }

          .timer-display {
            font-size: 1.4rem;
            padding: 0.4rem 0.8rem;
            min-width: 140px;
          }

          .timer-icon {
            font-size: 1.6rem;
          }

          .timer-bar {
            min-width: 150px;
          }

          .timer-label {
            font-size: 0.65rem;
          }
        }

        /* En móvil, mover arriba del toggle de tema */
        @media (max-width: 768px) {
          .timer-container-fixed {
            top: auto;
            bottom: 5.5rem;
            right: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
