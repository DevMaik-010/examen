"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useExam, ExamProvider } from "@/context/ExamContext";
import { ExamEngine } from "@/components/exam/ExamEngine";
import ThemeToggle from "@/components/ThemeToggle";

// ============================================
// PÁGINA: PRUEBA (Clonado de PruebaPage.jsx)
// ============================================

function PruebaContent() {
  const { examInProgress, startExam, examData } = useExam();
  const router = useRouter();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initExam = async () => {
      // Verificar si ya hay resultados guardados (examen ya completado)
      const examResults = localStorage.getItem("exam_results");

      if (examResults) {
        // El examen ya fue completado, redirigir a fin
        router.replace("/fin");
        return;
      }

      // Si no hay examen en progreso, iniciarlo
      if (!examInProgress) {
        startExam();
      }

      setIsInitializing(false);
    };

    initExam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mostrar loading mientras inicializa
  if (isInitializing || !examData) {
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
          <p style={{ color: "var(--text-secondary)" }}>Por favor espera</p>
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
      <ThemeToggle className="theme-toggle" />
    </div>
  );
}

export default function PruebaPage() {
  return (
    <ExamProvider>
      <PruebaContent />
    </ExamProvider>
  );
}
