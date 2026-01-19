"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

// Datos ficticios de preguntas
const preguntasFicticias = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  tipo: "SELECCIÓN SIMPLE",
  pregunta: [
    "En la Filosofía moderna, Immanuel Kant propuso una nueva forma de comprender el conocimiento humano. Según su planteamiento, ¿cómo se origina el conocimiento?",
    "¿Cuál es el resultado de la siguiente operación matemática: 15 × 8 + 32 - 18?",
    "En el contexto de la literatura boliviana, ¿quién escribió la obra 'Raza de Bronce'?",
    "La célula es la unidad básica de la vida. ¿Cuál es el organelo responsable de la producción de energía?",
    "En historia universal, ¿en qué año comenzó la Revolución Francesa?",
    "¿Cuál es la capital del departamento de Oruro en Bolivia?",
    "En química, ¿cuál es el símbolo del elemento Sodio?",
    "¿Qué tipo de ángulo mide exactamente 90 grados?",
    "En geografía, ¿cuál es el lago navegable más alto del mundo?",
    "¿Quién fue el libertador de Bolivia?",
  ][i % 10],
  opciones: [
    "La experiencia únicamente.",
    "La interacción entre experiencia y estructuras racionales.",
    "La razón pura únicamente.",
    "La intuición mística.",
  ],
}));

const TIEMPO_TOTAL = 2 * 60 * 60; // 2 horas en segundos

const Prueba = () => {
  const router = useRouter();
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [respuestas, setRespuestas] = useState<Record<number, number>>({});
  const [marcadas, setMarcadas] = useState<Set<number>>(new Set());
  const [tiempoRestante, setTiempoRestante] = useState(TIEMPO_TOTAL);

  // Timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTiempoRestante((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Formatear tiempo
  const formatearTiempo = useCallback((segundos: number) => {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segs = segundos % 60;
    return `${horas.toString().padStart(2, "0")}:${minutos.toString().padStart(2, "0")}:${segs.toString().padStart(2, "0")}`;
  }, []);

  const pregunta = preguntasFicticias[preguntaActual];
  const totalPreguntas = preguntasFicticias.length;
  const respondidas = Object.keys(respuestas).length;
  const sinResponder = totalPreguntas - respondidas;
  const porcentaje = Math.round((respondidas / totalPreguntas) * 100);
  const tiempoProgreso = (tiempoRestante / TIEMPO_TOTAL) * 100;

  const seleccionarRespuesta = (opcionIndex: number) => {
    setRespuestas((prev) => ({ ...prev, [preguntaActual]: opcionIndex }));
  };

  const marcarPregunta = () => {
    setMarcadas((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(preguntaActual)) {
        newSet.delete(preguntaActual);
      } else {
        newSet.add(preguntaActual);
      }
      return newSet;
    });
  };

  const irAPregunta = (index: number) => {
    if (index >= 0 && index < totalPreguntas) {
      setPreguntaActual(index);
    }
  };

  const finalizarPrueba = () => {
    alert(`Prueba finalizada!\nRespondidas: ${respondidas}/${totalPreguntas}`);
    router.push("/resultados");
  };

  return (
    <div className="min-h-screen p-6 md:p-8 flex flex-col items-center">
      {/* Container centrado */}
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1
              className="text-3xl font-bold texto2"
              style={{ color: "var(--text-primary)" }}
            >
              ESFM
            </h1>
            <p
              className="texto text-lg"
              style={{ color: "var(--text-secondary)" }}
            >
              Prueba de admisión
            </p>
          </div>

          {/* Timer */}
          <div className="timer-box">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">⏱️</span>
              <span className="timer-display">
                {formatearTiempo(tiempoRestante)}
              </span>
            </div>
            {/* Progress Bar */}
            <div className="timer-progress-bar">
              <div
                className="timer-progress-fill"
                style={{ width: `${tiempoProgreso}%` }}
              ></div>
            </div>
            <p
              className="text-sm texto mt-2"
              style={{ color: "var(--text-secondary)" }}
            >
              Tiempo Total: 120 minutos
            </p>
          </div>
        </div>

        {/* Navigation Buttons Top */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => irAPregunta(preguntaActual - 1)}
            disabled={preguntaActual === 0}
            className="nav-btn nav-btn-outline flex-1"
          >
            ← ANTERIOR
          </button>
          <button
            onClick={() => irAPregunta(preguntaActual + 1)}
            disabled={preguntaActual === totalPreguntas - 1}
            className="nav-btn nav-btn-primary flex-1"
          >
            SIGUIENTE →
          </button>
        </div>

        {/* Question Card */}
        <div className="question-card mb-8">
          {/* Badge */}
          <div className="badge-info inline-block mb-6">◉ {pregunta.tipo}</div>

          {/* Question */}
          <div className="question-text mb-8">
            <p
              className="texto text-lg leading-relaxed"
              style={{ color: "var(--text-primary)" }}
            >
              {pregunta.pregunta}
            </p>
          </div>

          {/* Instruction */}
          <p className="texto mb-6 text-base" style={{ color: "#ffc800" }}>
            💡 Selecciona una sola opción
          </p>

          {/* Options */}
          <div className="space-y-4">
            {pregunta.opciones.map((opcion, index) => (
              <label
                key={index}
                className={`option-item ${respuestas[preguntaActual] === index ? "option-selected" : ""}`}
              >
                <input
                  type="radio"
                  name={`pregunta-${preguntaActual}`}
                  checked={respuestas[preguntaActual] === index}
                  onChange={() => seleccionarRespuesta(index)}
                  className="hidden"
                />
                <span
                  className={`option-radio ${respuestas[preguntaActual] === index ? "option-radio-selected" : ""}`}
                >
                  {respuestas[preguntaActual] === index && (
                    <span className="option-radio-dot"></span>
                  )}
                </span>
                <span className="texto text-base">{opcion}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Question Navigator */}
        <div className="question-card mb-8">
          <div className="grid grid-cols-10 gap-2 mb-6">
            {Array.from({ length: 100 }, (_, i) => {
              const qIndex = i;
              const isAnswered = respuestas[qIndex] !== undefined;
              const isCurrent = qIndex === preguntaActual;
              const isMarked = marcadas.has(qIndex);

              return (
                <button
                  key={i}
                  onClick={() => irAPregunta(qIndex)}
                  className={`question-nav-btn ${isCurrent ? "current" : ""} ${isAnswered ? "answered" : ""} ${isMarked ? "marked" : ""}`}
                >
                  {qIndex + 1}
                  {isMarked && <span className="marked-dot">•</span>}
                </button>
              );
            })}
          </div>

          {/* Progress */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <p className="texto" style={{ color: "var(--text-secondary)" }}>
              Pregunta{" "}
              <span className="font-bold text-white">{preguntaActual + 1}</span>{" "}
              de {totalPreguntas} • {respondidas} respondidas ({porcentaje}%)
            </p>
            <div className="flex items-center gap-3">
              <span
                className="texto"
                style={{ color: "var(--text-secondary)" }}
              >
                Ir a pregunta:
              </span>
              <input
                type="number"
                min="1"
                max={totalPreguntas}
                placeholder="#"
                className="go-to-input"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const value = parseInt(
                      (e.target as HTMLInputElement).value,
                    );
                    if (value >= 1 && value <= totalPreguntas) {
                      irAPregunta(value - 1);
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex gap-4 flex-wrap justify-center">
            <button
              onClick={() => irAPregunta(preguntaActual - 1)}
              disabled={preguntaActual === 0}
              className="nav-btn nav-btn-outline"
            >
              ← ANTERIOR
            </button>
            <button onClick={marcarPregunta} className="nav-btn nav-btn-mark">
              🚩 MARCAR
            </button>
            <button
              onClick={finalizarPrueba}
              className="nav-btn nav-btn-finish"
            >
              ✓ FINALIZAR PRUEBA
            </button>
            <button
              onClick={() => irAPregunta(preguntaActual + 1)}
              disabled={preguntaActual === totalPreguntas - 1}
              className="nav-btn nav-btn-primary"
            >
              SIGUIENTE →
            </button>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="text-center mb-8">
          <p
            className="texto text-lg"
            style={{ color: "var(--text-secondary)" }}
          >
            Respondidas:{" "}
            <span style={{ color: "#22c55e" }} className="font-bold">
              {respondidas}/{totalPreguntas}
            </span>
            {"  "}Sin responder:{" "}
            <span style={{ color: "#ff6b6b" }} className="font-bold">
              {sinResponder}
            </span>
          </p>
        </div>
      </div>

      {/* Atajos */}
      <button className="atajos-btn">☰ Atajos</button>

      {/* Theme Toggle */}
      <ThemeToggle className="theme-toggle" />
    </div>
  );
};

export default Prueba;
