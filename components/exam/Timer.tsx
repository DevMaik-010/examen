"use client";

import { useExam } from "@/context/ExamContext";

// ============================================
// COMPONENTE: TIMER GLOBAL
// ============================================

export function Timer() {
  const { tiempoRestante, examData } = useExam();

  const TIEMPO_TOTAL = examData.tiempo_total;

  // Formatear tiempo
  const formatearTiempo = (segundos: number) => {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segs = segundos % 60;
    return `${horas.toString().padStart(2, "0")}:${minutos.toString().padStart(2, "0")}:${segs.toString().padStart(2, "0")}`;
  };

  const tiempoProgreso = (tiempoRestante / TIEMPO_TOTAL) * 100;

  return (
    <div className="flex flex-col items-center justify-center gap-2 card-timer fixed top-[30px] right-[30px] z-10">
      <div className="flex items-center gap-2 mb-2 timer-box max-h-[150px]">
        <span className="text-[2rem]">⏱️</span>
        <span className="timer-display">{formatearTiempo(tiempoRestante)}</span>
      </div>
      <div className="timer-progress-bar">
        <div
          className="timer-progress-fill"
          style={{ width: `${tiempoProgreso}%` }}
        ></div>
      </div>
      <div className="w-full">
        <p
          className="text-xs texto text-end"
          style={{ color: "var(--text-secondary)" }}
        >
          Tiempo Total: 120 minutos
        </p>
      </div>
    </div>
  );
}
