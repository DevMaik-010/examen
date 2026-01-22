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
    // Verificar si el examen ya fue finalizado
    const examStatus = localStorage.getItem("exam_status");
    if (examStatus === "finalizado") {
      router.push("https://admision01.dgfm.minedu.gob.bo/");
      return;
    }

    // Limpiar datos del examen cuando se completa
    localStorage.removeItem("exam_in_progress");
    localStorage.removeItem("exam_current_index");
  }, [router]);

  const handleLogout = () => {
    // Marcar examen como finalizado antes de limpiar
    
    // Limpiar todo el localStorage y volver a la página principal
    localStorage.clear();
    router.push("https://admision01.dgfm.minedu.gob.bo/");
    
    localStorage.setItem("exam_status", "finalizado");
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
        <button className="logout-btn border top-6 right-6 absolute" onClick={handleLogout}>
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
            padding: 0.5rem 1rem;
            background: var(--bg-error);
            border: 0,7px solid #ff6b6b;
            border-radius: 8px;
            color: #ff6b6b;
            font-size: 0.85rem;
            font-weight: semibold;
            cursor: pointer;
            transition: all 0.3s ease;
            
          }
          .logout-btn:hover {
            background: rgba(255, 107, 107, 0.15);
          }
        `}</style>
      </div>
      <ThemeToggle className="theme-toggle" />
    </div>
  );
}
