import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useExam } from "../hooks/useExam";
import { ExamEngine } from "../components/exam/ExamEngine";

// ============================================
// PÁGINA: PRUEBA (Carga preguntas desde API)
// ============================================

export default function PruebaPage() {
  const { examInProgress, startExam, isLoadingExam, examLoadError } = useExam();
  const navigate = useNavigate();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initExam = async () => {
      // Verificar si ya hay resultados guardados (examen ya completado)
      const examResults = localStorage.getItem("exam_results");
      if (examResults) {
        // El examen ya fue completado, redirigir a fin
        navigate("/fin", { replace: true });
        return;
      }

      // Si no hay examen en progreso, iniciarlo (carga desde API)
      if (!examInProgress) {
        await startExam();
      }
      setIsInitializing(false);
    };

    initExam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo ejecutar una vez al montar

  // Mostrar loading mientras inicializa
  if (isInitializing || isLoadingExam) {
    return (
      <div
        className="view-container"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⏳</div>
          <h2>Cargando prueba...</h2>
          <p style={{ color: "var(--text-secondary)" }}>
            Conectando con el servidor...
          </p>
        </div>
      </div>
    );
  }

  // Si hay error y no se pudo cargar, mostrar error sin permitir continuar
  if (examLoadError) {
    return (
      <div
        className="view-container"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{ textAlign: "center", maxWidth: "600px", padding: "2rem" }}
        >
          <div style={{ fontSize: "2.2rem", marginBottom: "1rem" }}>❌</div>
          <h2 style={{ color: "var(--text-primary)", marginBottom: "1rem" }}>
            Error al Cargar la Prueba
          </h2>
          <div
            style={{
              padding: "1.5rem",
              background: "rgba(255, 82, 82, 0.1)",
              border: "2px solid rgba(255, 82, 82, 0.3)",
              borderRadius: "12px",
              marginBottom: "2rem",
            }}
          >
            <p
              style={{
                color: "#ff5252",
                margin: 0,
                fontSize: "1rem",
                lineHeight: "1.6",
              }}
            >
              {examLoadError}
            </p>
          </div>
          {/* <div style={{
            padding: '1rem',
            background: 'rgba(0, 255, 255, 0.05)',
            border: '1px solid rgba(0, 255, 255, 0.2)',
            borderRadius: '8px',
            marginBottom: '2rem'
          }}>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem', lineHeight: '1.6' }}>
              <strong>Posibles soluciones:</strong><br />
              • Verifica tu conexión a internet<br />
              • Vuelve a iniciar sesión<br />
              • Contacta al administrador si el problema persiste
            </p>
          </div> */}
          {/* <button
            className="btn"
            onClick={() => window.location.reload()}
            style={{ marginRight: '1rem' }}
          >
            🔄 Reintentar
          </button> */}
          <button
            className="btn"
            onClick={() => navigate("/instrucciones")}
            style={{ background: "rgba(87, 116, 128, 0.9)" }}
          >
            ← Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="view-container"
      style={{ minHeight: "100vh", padding: "1rem" }}
    >
      <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
        <ExamEngine />
      </div>
    </div>
  );
}
