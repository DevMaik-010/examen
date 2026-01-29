"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

// ============================================
// PÁGINA: INSTRUCCIONES
// ============================================

interface CurrentUser {
  username: string;
  es_usuario_discapacidad_visual?: boolean;
  completado?: number;
}

export default function InstruccionesPage() {
  const router = useRouter();
  const [hasResults, setHasResults] = useState(false);
  const [examInProgress, setExamInProgress] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Verificar si hay resultados guardados y obtener usuario
  useEffect(() => {
    const checkStatus = () => {
      // Verificar si el examen ya fue finalizado
      const examStatus = localStorage.getItem("exam_status");
      if (examStatus === "finalizado") {
        router.push("https://admision01.dgfm.minedu.gob.bo/");
        return;
      }

      const examResults = localStorage.getItem("exam_results");
      const inProgress = localStorage.getItem("exam_in_progress") === "true";
      const user = localStorage.getItem("exam_user");

      if (examResults) {
        setHasResults(true);
      }
      setExamInProgress(inProgress);

      if (user) {
        // Try to parse user data from localStorage
        try {
          const userData = JSON.parse(
            localStorage.getItem("exam_user_data") || "{}",
          );
          setCurrentUser({
            username: user,
            es_usuario_discapacidad_visual:
              userData.es_usuario_discapacidad_visual || false,
            completado: userData.completado ?? 0,
          });
        } catch {
          setCurrentUser({ username: user, completado: 0 });
        }
      }
    };

    checkStatus();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("exam_user");
    localStorage.removeItem("exam_user_data");
    router.push("/login");
  };

  const handleStartExam = async () => {
    setLoadError(null);
    setIsLoading(true);

    // Si hay un examen en progreso, preguntar si desea continuar o reiniciar
    if (examInProgress) {
      router.push("/prueba");
      return;
    }

    // Navigate to exam
    router.push("/prueba");
  };


  // Calculate time based on user disability
  const totalMinutes = currentUser?.es_usuario_discapacidad_visual ? 180 : 120;

  return (
    <div className="view-container">
      <div className="card">
        {/* Botón Cerrar Sesión */}
        <button onClick={handleLogout} className="logout-btn">
          🚪 Cerrar Sesión
        </button>

        <div className="status-badge">
          {hasResults
            ? "✓ Completado"
            : examInProgress
              ? "⏸️ En Progreso"
              : "📋 Instrucciones"}
        </div>

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
          </div>
        )}

        <div className="tech-line"></div>

        <main tabIndex={-1} style={{ marginBottom: "2rem" }}>
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
              Tienes un <strong>tiempo total {totalMinutes} minutos</strong>{" "}
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
              Una vez iniciada la prueba, no está permitido cerrar la pestaña o
              la ventana del navegador, así como apagar el ordenador.
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
              No olvides que tu prueba no será considerada si no presionas el
              botón &quot;Finalizar Prueba&quot;
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
              {/* Buttons can be added here if needed */}
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
            {/* Mostrar botón si completado es 0 */}
            {(currentUser?.completado === 0 ||
              currentUser?.completado === undefined) && (
              <button
                className="btn  max-w-[250px]"
                onClick={handleStartExam}
                disabled={isLoading}
              >
                {isLoading
                  ? "Cargando prueba..."
                  : examInProgress
                    ? "Continuar Prueba"
                    : "Iniciar Prueba"}
              </button>
            )}

            {currentUser?.completado === 2 && (
              <h3>¡Ya terminaste tu prueba!</h3>
            )}
          </>
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
            margin-bottom: 1rem;
          }
          .logout-btn {
            position: absolute;
            top: 1.5rem;
            right: 1.5rem;
            padding: 0.5rem 1rem;
            background: var(--bg-error);
            border: 0.7px solid #ff6b6b;
            border-radius: 8px;
            color: #ff6b6b;
            font-size: 0.85rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          .logout-btn:hover {
            background: #572530;
          }
        `}</style>
      </div>
      <ThemeToggle className="theme-toggle" />
    </div>
  );
}
