"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

// ============================================
// PÁGINA: FIN (Clonado fielmente de FinPage.jsx)
// ============================================

export default function FinPage() {
  const router = useRouter();

  useEffect(() => {
    // Limpiar datos del examen cuando se completa
    localStorage.removeItem("exam_in_progress");
    localStorage.removeItem("exam_current_index");
  }, []);

  const handleLogout = () => {
    // Limpiar todo y volver a instrucciones
    localStorage.removeItem("exam_results");
    localStorage.removeItem("exam_user_answers");
    localStorage.removeItem("exam_flagged_questions");
    localStorage.removeItem("exam_start_time");
    localStorage.removeItem("exam_in_progress");
    localStorage.removeItem("exam_tiempo_restante");
    router.push("/instrucciones");
  };

  return (
    <div className="view-container">
      <div className="card" style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: "4rem",
            marginBottom: "1rem",
            animation: "bounce 1s ease-in-out",
          }}
        >
          🎉
        </div>
        <h1 style={{ fontSize: "2rem" }}>¡Prueba Completada!</h1>
        <p style={{ fontSize: "1.1rem", color: "#3bc2c2ff" }}>
          Has finalizado la prueba exitosamente
        </p>
        <div className="tech-line"></div>
        <p>
          Gracias por tu participación, <strong>cierra tu sesión</strong> para
          resguardar tu Información.
        </p>
        <button className="logout-btn" onClick={handleLogout}>
          🚪 Cerrar Sesión
        </button>
        <style jsx>{`
          @keyframes bounce {
            0%,
            100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-20px);
            }
          }
          .logout-btn {
            margin-top: 1.5rem;
            padding: 0.75rem 1.5rem;
            background: rgba(255, 50, 50, 0.1);
            border: 1px solid rgba(255, 50, 50, 0.3);
            border-radius: 8px;
            color: #ff6b6b;
            cursor: pointer;
            font-family: "Fira Code", monospace;
            font-size: 1rem;
            transition: all 0.3s ease;
          }
          .logout-btn:hover {
            background: rgba(255, 50, 50, 0.2);
            transform: scale(1.05);
          }
        `}</style>
      </div>
      <ThemeToggle className="theme-toggle" />
    </div>
  );
}
