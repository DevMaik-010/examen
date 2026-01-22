"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

// ============================================
// PÁGINA: INSTRUCCIONES (Clonado de InstruccionesPage.jsx)
// Sin autenticación - Todo público
// ============================================

export default function InstruccionesPage() {
  const router = useRouter();
  const [hasResults, setHasResults] = useState(false);
  const [examInProgress, setExamInProgress] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  // Verificar si hay resultados guardados y obtener usuario
  useEffect(() => {
    const checkStatus = () => {
      const examResults = localStorage.getItem("exam_results");
      const inProgress = localStorage.getItem("exam_in_progress") === "true";
      const user = localStorage.getItem("exam_user");

      if (examResults) {
        setHasResults(true);
      }
      setExamInProgress(inProgress);
      setUsername(user);
    };

    checkStatus();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("exam_user");
    router.push("/login");
  };

  const handleStartExam = () => {
    // Si hay un examen en progreso, preguntar si desea continuar o reiniciar
    if (examInProgress) {
      const continueExam = window.confirm(
        "Tienes una prueba en progreso. ¿Deseas continuar donde lo dejaste?",
      );

      if (!continueExam) {
        // Limpiar estado
        localStorage.removeItem("exam_current_index");
        localStorage.removeItem("exam_user_answers");
        localStorage.removeItem("exam_flagged_questions");
        localStorage.removeItem("exam_start_time");
        localStorage.removeItem("exam_in_progress");
        localStorage.removeItem("exam_tiempo_restante");
      }
    }

    router.push("/prueba");
  };

  const handleRetakeExam = () => {
    const confirm = window.confirm(
      "¿Estás seguro de que deseas volver a realizar la prueba? Esto eliminará tus resultados anteriores.",
    );

    if (confirm) {
      localStorage.removeItem("exam_results");
      localStorage.removeItem("exam_current_index");
      localStorage.removeItem("exam_user_answers");
      localStorage.removeItem("exam_flagged_questions");
      localStorage.removeItem("exam_start_time");
      localStorage.removeItem("exam_in_progress");
      localStorage.removeItem("exam_tiempo_restante");
      setHasResults(false);
      router.push("/prueba");
    }
  };

  return (
    <div className="view-container">
      <div className="card">
        {/* Header con Status Badge y Logout */}
        {/* Botón Cerrar Sesión */}
        <button onClick={handleLogout} className="logout-btn top-6 right-6 absolute">
          🚪 Cerrar Sesión
        </button>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "1rem",
          }}
        >
          <div className="status-badge">
            {hasResults
              ? "✓ Completado"
              : examInProgress
                ? "⏸️ En Progreso"
                : "📋 Instrucciones"}
          </div>
        </div>

        {/* User Card */}
        {username && (
          <div className="user-card">
            <span>👤</span>
            <span style={{ color: "#99a7bbff" }}>Usuario:</span>
            <span style={{ color: "#00ffff", fontFamily: "monospace" }}>
              {username}
            </span>
          </div>
        )}

        <div className="tech-line"></div>

        <div style={{ marginBottom: "2rem" }}>
          <h3
            style={{
              color: "#32bbbbff",
              fontSize: "1.2rem",
              marginBottom: "1rem",
              fontFamily: "Orbitron, sans-serif",
            }}
          >
            📌 Instrucciones Importantes
          </h3>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              color: "#99a7bbff",
            }}
          >
            <li
              style={{
                marginBottom: "0.8rem",
                paddingLeft: "1.5rem",
                position: "relative",
              }}
            >
              <span style={{ position: "absolute", left: 0, color: "#00ffff" }}>
                ▸
              </span>
              Tienes un <strong>tiempo total de 120 minutos</strong> para
              completar toda la prueba
            </li>
            <li
              style={{
                marginBottom: "0.8rem",
                paddingLeft: "1.5rem",
                position: "relative",
              }}
            >
              <span style={{ position: "absolute", left: 0, color: "#00ffff" }}>
                ▸
              </span>
              El tiempo corre de forma <strong>continua</strong> desde que
              inicias
            </li>
            <li
              style={{
                marginBottom: "0.8rem",
                paddingLeft: "1.5rem",
                position: "relative",
              }}
            >
              <span style={{ position: "absolute", left: 0, color: "#00ffff" }}>
                ▸
              </span>
              Al llegar a <strong>0 minutos</strong>, la prueba finalizará
              automáticamente
            </li>
            <li
              style={{
                marginBottom: "0.8rem",
                paddingLeft: "1.5rem",
                position: "relative",
              }}
            >
              <span style={{ position: "absolute", left: 0, color: "#00ffff" }}>
                ▸
              </span>
              Las preguntas se presentan <strong>una a la vez</strong>
            </li>
            <li
              style={{
                marginBottom: "0.8rem",
                paddingLeft: "1.5rem",
                position: "relative",
              }}
            >
              <span style={{ position: "absolute", left: 0, color: "#00ffff" }}>
                ▸
              </span>
              Puedes <strong>navegar libremente</strong> entre preguntas
              (Anterior/Siguiente)
            </li>
            <li
              style={{
                marginBottom: "0.8rem",
                paddingLeft: "1.5rem",
                position: "relative",
              }}
            >
              <span style={{ position: "absolute", left: 0, color: "#00ffff" }}>
                ▸
              </span>
              Usa el <strong>navegador de preguntas</strong> para saltar a
              cualquier número, inserta el número de la pregunta y presiona
              enter
            </li>
            <li
              style={{
                marginBottom: "0.8rem",
                paddingLeft: "1.5rem",
                position: "relative",
              }}
            >
              <span style={{ position: "absolute", left: 0, color: "#00ffff" }}>
                ▸
              </span>
              🚩 Tienes la opción de marcar una pregunta en caso de no estar
              seguro de tu respuesta
            </li>
            <li
              style={{
                marginBottom: "0.8rem",
                paddingLeft: "1.5rem",
                position: "relative",
              }}
            >
              <span style={{ position: "absolute", left: 0, color: "#00ffff" }}>
                ▸
              </span>
              Administra tu tiempo sabiamente
            </li>
          </ul>
        </div>

        {examInProgress && !hasResults && (
          <div
            style={{
              padding: "1rem",
              background: "rgba(255, 200, 0, 0.1)",
              border: "1px solid rgba(255, 200, 0, 0.3)",
              borderRadius: "8px",
              marginBottom: "1.5rem",
              textAlign: "center",
            }}
          >
            <p
              style={{
                color: "#ffc107",
                marginBottom: 0,
                fontWeight: "bold",
              }}
            >
              ⚠️ Tienes una prueba en progreso
            </p>
          </div>
        )}

        {hasResults ? (
          <div>
            <div
              style={{
                padding: "1.5rem",
                background: "rgba(0, 255, 100, 0.1)",
                border: "1px solid rgba(0, 255, 100, 0.3)",
                borderRadius: "8px",
                textAlign: "center",
                marginBottom: "1rem",
              }}
            >
              <p
                style={{
                  color: "#57c793ff",
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  marginBottom: 0,
                }}
              >
                ✓ Ya completaste la prueba
              </p>
            </div>

            <button
              className="btn"
              onClick={handleRetakeExam}
              style={{
                background: "rgba(255, 100, 100, 0.2)",
                borderColor: "#ff6b6b",
              }}
            >
              🔄 Volver a Realizar
            </button>
          </div>
        ) : (
          <button className="btn max-w-[250px]" onClick={handleStartExam}>
            {examInProgress ? "Continuar Prueba" : "Iniciar Prueba"}
          </button>
        )}

        <style jsx>{`
          .status-badge {
            display: inline-block;
            padding: 0.5rem 1rem;
            background: rgba(0, 255, 255, 0.1);
            border: 1px solid rgba(0, 255, 255, 0.3);
            border-radius: 20px;
            font-size: 0.85rem;
            color: var(--text-accent);
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .logout-btn {
            padding: 0.5rem 1rem;
            background: transparent;
            border: 1px solid #ff6b6b;
            border-radius: 8px;
            color: #ff6b6b;
            font-size: 0.85rem;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          .logout-btn:hover {
            background: rgba(255, 107, 107, 0.15);
          }
          .user-card {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 1rem 1.25rem;
            background: rgba(0, 20, 40, 0.6);
            border: 1px solid rgba(0, 255, 255, 0.2);
            border-radius: 12px;
            margin-bottom: 1.5rem;
          }
        `}</style>
      </div>
      <ThemeToggle className="theme-toggle" />
    </div>
  );
}
