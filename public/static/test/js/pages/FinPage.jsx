import { useEffect } from "react";
// import { useNavigate } from 'react-router-dom';
import { useAuth } from "../hooks/useAuth";
import { LogoutButton } from "../components/layout/LogoutButton";

// ============================================
// PÁGINA: FIN
// ============================================

export default function FinPage() {
  const { completeExam } = useAuth();
  // const navigat  e = useNavigate();

  useEffect(() => {
    completeExam();
  }, [completeExam]);

  // const handleBackToInstrucciones = () => {
  //   navigate('/instrucciones');
  // };

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
        {/* <button className="btn" onClick={handleBackToInstrucciones}>
          Volver al Inicio
        </button> */}
        <LogoutButton />
        <style>{`
          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-20px);
            }
          }
        `}</style>
      </div>
    </div>
  );
}
