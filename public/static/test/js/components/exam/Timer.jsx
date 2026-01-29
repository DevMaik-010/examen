import { useState, useEffect, useRef } from "react";

// ============================================
// COMPONENTE: TIMER GLOBAL (Tiempo configurable desde API)
// ============================================

export function Timer({ onTimeUp, isPaused = false, totalTime = 7200 }) {
  const TOTAL_TIME = totalTime; // Usar tiempo de la API (por defecto 120 min = 7200 seg)
  const startTimestampRef = useRef(null);
  const hasCalledTimeUpRef = useRef(false);

  // Inicializar estado con el tiempo CORRECTO desde el principio
  const [timeLeft, setTimeLeft] = useState(() => {
    const savedTimer = localStorage.getItem("exam_global_timer");

    if (savedTimer) {
      // Ya existe timer guardado (ej: volvió con F5)
      const { startTimestamp } = JSON.parse(savedTimer);
      startTimestampRef.current = startTimestamp;

      const elapsed = Math.floor((Date.now() - startTimestamp) / 1000);
      const remaining = Math.max(0, TOTAL_TIME - elapsed);

      return remaining;
    } else {
      // Primera vez - crear timer global
      const now = Date.now();
      startTimestampRef.current = now;

      localStorage.setItem(
        "exam_global_timer",
        JSON.stringify({
          startTimestamp: now,
          totalTime: TOTAL_TIME,
        }),
      );

      return TOTAL_TIME;
    }
  });

  const intervalRef = useRef(null);

  // Cuenta regresiva
  useEffect(() => {
    if (isPaused || !startTimestampRef.current) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    // Limpiar intervalo anterior si existe
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Actualizar cada segundo basándose en el timestamp original
    intervalRef.current = setInterval(() => {
      const savedTimer = localStorage.getItem("exam_global_timer");

      if (!savedTimer) {
        clearInterval(intervalRef.current);
        return;
      }

      const { startTimestamp } = JSON.parse(savedTimer);
      const elapsed = Math.floor((Date.now() - startTimestamp) / 1000);
      const remaining = Math.max(0, TOTAL_TIME - elapsed);

      setTimeLeft(remaining);

      // Solo llamar onTimeUp una vez cuando llega a 0
      if (remaining === 0 && !hasCalledTimeUpRef.current) {
        hasCalledTimeUpRef.current = true;
        clearInterval(intervalRef.current);
        localStorage.removeItem("exam_global_timer");

        if (onTimeUp) {
          onTimeUp();
        }
      }
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaused, onTimeUp]);

  // Formatear tiempo restante (HH:MM:SS)
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Calcular el porcentaje de tiempo restante
  const percentage = (timeLeft / TOTAL_TIME) * 100;

  // Determinar el color según el tiempo restante
  const getColor = () => {
    if (percentage > 50) return "var(--timer-safe)";
    if (percentage > 25) return "var(--timer-warning)";
    return "var(--timer-danger)";
  };

  // Determinar si debe parpadear (últimos 5 minutos)
  const shouldBlink = timeLeft <= 300 && timeLeft > 0;

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
        <span className="timer-text">{formatTime(timeLeft)}</span>
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
      <div className="timer-label">Tiempo Total: 120 minutos</div>

      <style>{`
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
          font-family: 'Orbitron', sans-serif;
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
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.3;
          }
        }

        /* Variables de tema */
        [data-theme="dark"] {
          --bg-timer: rgba(20, 25, 45, 0.9);
          --timer-safe: #00ff88;
          --timer-warning: #ffc107;
          --timer-danger: #ff6b6b;
        }

        [data-theme="light"] {
          --bg-timer: rgba(255, 255, 255, 0.95);
          --timer-safe: #00cc66;
          --timer-warning: #f59e0b;
          --timer-danger: #dc2626;
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

        /* Asegurar que esté sobre el toggle de tema */
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
