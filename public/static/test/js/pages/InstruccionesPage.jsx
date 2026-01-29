import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useExam } from "../hooks/useExam";
import { LogoutButton } from "../components/layout/LogoutButton";
import { StatusBadge } from "../components/layout/StatusBadge";

// ============================================
// PÁGINA: INSTRUCCIONES
// ============================================

export default function InstruccionesPage() {
  const { currentUser } = useAuth();
  const { examInProgress, startExam, resetExam, isLoadingExam } = useExam();
  const navigate = useNavigate();
  const location = useLocation();
  const [hasResults, setHasResults] = useState(false);
  const [loadError, setLoadError] = useState(null);

  // Verificar si hay resultados guardados
  useEffect(() => {
    const examResults = localStorage.getItem("exam_results");
    // Si viene redirigido con el estado examCompleted o ya tiene resultados, mostrar mensaje de finalizado
    if (location.state?.examCompleted || examResults) {
      setHasResults(true);
    }
  }, [location.state]);

  const handleStartExam = async () => {
    setLoadError(null);

    // Si hay un examen en progreso, preguntar si desea continuar o reiniciar
    if (examInProgress) {
      const continueExam = window.confirm(
        "¿Tienes una prueba en progreso. ¿Deseas continuar donde lo dejaste?",
      );

      if (!continueExam) {
        resetExam();
      }
      navigate("/prueba");
      return;
    }

    // Cargar examen desde API
    const result = await startExam();

    if (result.success) {
      navigate("/prueba");
    } else {
      // Mostrar error pero permitir continuar con datos locales
      setLoadError(result.error);
      navigate("/prueba"); // Navegar de todas formas (usa datos locales)
    }
  };

  // const handleViewResults = () => {
  //   navigate('/fin');
  // };

  // eslint-disable-next-line no-unused-vars
  const handleRetakeExam = () => {
    const confirm = window.confirm(
      "¿Estás seguro de que deseas volver a realizar la prueba? Esto eliminará tus resultados anteriores.",
    );

    if (confirm) {
      // Limpiar resultados y estado
      localStorage.removeItem("exam_results");
      resetExam();
      setHasResults(false);
      navigate("/prueba");
    }
  };

  return (
    <div className="view-container">
      <div className="card">
        <LogoutButton />

        <StatusBadge>
          {hasResults
            ? "✓ Completado"
            : examInProgress
              ? "⏸️ En Progreso"
              : "📋 Instrucciones"}
        </StatusBadge>

        {/* <h2>ESFM</h2> */}

        {/* Información del usuario */}
        {currentUser && (
          <div
            style={{
              padding: "1rem",
              background: "rgba(0, 255, 255, 0.05)",
              border: "1px solid rgba(0, 255, 255, 0.2)",
              borderRadius: "8px",
              marginBottom: "1.5rem",
            }}
          >
            <p style={{ marginBottom: "0.5rem" }}>
              <strong>👤 Usuario:</strong> {currentUser.username}
            </p>
            {/* <p style={{ marginBottom: '0.5rem' }}>
              <strong>📧 Email:</strong> {currentUser.email}
            </p> */}
            {/* <p style={{ marginBottom: 0 }}>
              <strong>🎭 Rol:</strong>
              <span style={{
                marginLeft: '0.5rem',
                padding: '0.25rem 0.75rem',
                background: 'rgba(0, 255, 255, 0.2)',
                borderRadius: '12px',
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                fontWeight: 'bold'
              }}>
                {currentUser.role}
              </span>
            </p> */}
          </div>
        )}

        {/* <p><strong>Tema:</strong> {examData?.tema || 'Cargando...'}</p> */}
        <div className="tech-line"></div>

        <main tabindex="-1" style={{ marginBottom: "2rem" }}>
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
              Tienes un{" "}
              <strong>
                tiempo total{" "}
                {currentUser.es_usuario_discapacidad_visual ? "180" : "120"}{" "}
                minutos
              </strong>{" "}
              para completar toda la prueba
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
              Una vez iniciada la prueba, no está permitido cerrar la pestaña o la ventana del navegador, así como apagar el ordenador.
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
            {/* <li style={{ marginBottom: '0.8rem', paddingLeft: '1.5rem', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0, color: '#00ffff' }}>▸</span>
              Total de preguntas: <strong>{examData?.preguntas?.length || 0}</strong>
            </li> */}
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
              No olvides que tu prueba no será considerada si  no presionas el botón "Finalizar Prueba"
            </li>
          </ul>
        </main>

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

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              {/*
              <button
                className="btn"
                onClick={handleViewResults}
                style={{ flex: '1', minWidth: '200px' }}
              >
                Ver Resultados
              </button>
               <button
                className="btn"
                onClick={handleRetakeExam}
                style={{
                  flex: '1',
                  minWidth: '200px',
                  background: 'rgba(255, 100, 100, 0.2)',
                  borderColor: '#ff6b6b'
                }}
              >
                Volver a Realizar
              </button> */}
            </div>
          </div>
        ) : (
          <>
            {loadError && (
              <div
                style={{
                  padding: "1rem",
                  background: "rgba(255, 200, 100, 0.1)",
                  border: "1px solid rgba(255, 200, 100, 0.3)",
                  borderRadius: "8px",
                  marginBottom: "1.5rem",
                }}
              >
                <p
                  style={{
                    color: "#ffcc00",
                    marginBottom: 0,
                    fontSize: "0.9rem",
                  }}
                >
                  ⚠️ {loadError}
                </p>
                <p
                  style={{
                    color: "var(--text-secondary)",
                    marginTop: "0.5rem",
                    marginBottom: 0,
                    fontSize: "0.85rem",
                  }}
                >
                  Se usarán las preguntas locales de respaldo.
                </p>
              </div>
            )}
            {/* mostrar boton si completado es 0 */}
            {currentUser?.completado === 0 && (
              <button
                className="btn"
                onClick={handleStartExam}
                disabled={isLoadingExam}
              >
                {isLoadingExam
                  ? "Cargando prueba..."
                  : examInProgress
                    ? "Continuar Prueba"
                    : "Iniciar Prueba"}
              </button>
            )}
            {/* {currentUser?.completado} */}

            {currentUser?.completado === 2 && (
              <h3>¡Ya terminaste tu prueba!</h3>
            )}
          </>
        )}
      </div>
    </div>
  );
}
