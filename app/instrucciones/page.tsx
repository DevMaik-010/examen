"use client";

import React from "react";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

const Instrucciones = () => {
  const router = useRouter();
  const userId = "admin_fake";

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-6">
      <div className="card max-w-3xl w-full">
        <div className="flex justify-end">
            <button onClick={handleLogout} className="btn-secondary font-semibold rounded-3xl">
              🚪 Cerrar Sesión  
            </button>
        </div>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          {/* Badge INSTRUCCIONES */}
          <div className="badge-info">📋 INSTRUCCIONES</div>
        </div>

        {/* User Card */}
        <div className="user-card mb-8">
          <span>👤</span>
          <span className="texto">Usuario:</span>
          <span className="text-primary font-mono">{userId}</span>
        </div>

        <div className="tech-line"></div>

        {/* Instructions Section */}
        <h2 className="section-title">📢 Instrucciones Importantes</h2>

        {/* Instructions List */}
        <ul className="space-y-4 texto flex flex-col gap-2">
          <li className="instruction-item">
            <span className="instruction-bullet">▸</span>
            <span>
              Tienes un{" "}
              <strong className="instruction-highlight">
                tiempo total de 120 minutos
              </strong>{" "}
              para completar toda la prueba
            </span>
          </li>
          <li className="instruction-item">
            <span className="instruction-bullet">▸</span>
            <span>
              El tiempo corre de forma{" "}
              <strong className="instruction-highlight">continua</strong> desde
              que inicias
            </span>
          </li>
          <li className="instruction-item">
            <span className="instruction-bullet">▸</span>
            <span>
              Al llegar a{" "}
              <strong className="instruction-highlight">0 minutos,</strong> la
              prueba finalizará automáticamente
            </span>
          </li>
          <li className="instruction-item">
            <span className="instruction-bullet">▸</span>
            <span>
              Las preguntas se presentan{" "}
              <strong className="instruction-highlight">una a la vez</strong>
            </span>
          </li>
          <li className="instruction-item">
            <span className="instruction-bullet">▸</span>
            <span>
              Puedes{" "}
              <strong className="instruction-highlight">
                navegar libremente
              </strong>{" "}
              entre preguntas (Anterior/Siguiente)
            </span>
          </li>
          <li className="instruction-item">
            <span className="instruction-bullet">▸</span>
            <span>
              Usa el{" "}
              <strong className="instruction-highlight">
                navegador de preguntas
              </strong>{" "}
              para saltar a cualquier número, inserta el número de la pregunta y
              presiona enter
            </span>
          </li>
          <li className="instruction-item">
            <span className="instruction-bullet">▸</span>
            <span>
              🚩 Tienes la opción de marcar una pregunta en caso de no estar
              seguro de tu respuesta
            </span>
          </li>
          <li className="instruction-item">
            <span className="instruction-bullet">▸</span>
            <span>Administra tu tiempo sabiamente</span>
          </li>
        </ul>
        <button className="btn_iniciar" onClick={() => router.push("/prueba")}>INICIAR PRUEBA</button>
      </div>

      {/* Theme Toggle */}
      <ThemeToggle className="theme-toggle" />
    </div>
  );
};

export default Instrucciones;
