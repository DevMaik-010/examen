import React, { useState, useEffect, createContext } from "react";
import { useNavigate } from "react-router-dom";
import { examService } from "../services/examService";

// ============================================
// CONTEXTO DEL EXAMEN - SOLO API (NO DATOS LOCALES)
// ============================================

export const ExamContext = createContext(null);

export function ExamProvider({ children }) {
  // Datos del examen (SOLO desde API, persistido en localStorage)
  const [examData, setExamData] = useState(() => {
    // Intentar cargar preguntas desde localStorage (solo persistencia de sesión)
    const savedExamData = localStorage.getItem("exam_data");
    if (savedExamData) {
      try {
        return JSON.parse(savedExamData);
      } catch (e) {
        console.error("Error al parsear exam_data:", e);
      }
    }
    // Si no hay guardadas, retornar null (se cargará desde API)
    return null;
  });

  const [isLoadingExam, setIsLoadingExam] = useState(false);
  const [examLoadError, setExamLoadError] = useState(null);
  // Estado del examen
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
    const saved = localStorage.getItem("exam_current_index");
    return saved ? parseInt(saved, 10) : 0;
  });

  const [userAnswers, setUserAnswers] = useState(() => {
    const saved = localStorage.getItem("exam_user_answers");
    return saved ? JSON.parse(saved) : {};
  });

  // Rastrear tiempo de inicio de cada pregunta
  const [questionStartTimes, setQuestionStartTimes] = useState(() => {
    const saved = localStorage.getItem("exam_question_times");
    return saved ? JSON.parse(saved) : {};
  });

  // Rastrear tiempo de respuesta de cada pregunta (en segundos)
  const [answerTimes, setAnswerTimes] = useState(() => {
    const saved = localStorage.getItem("exam_answer_times");
    return saved ? JSON.parse(saved) : {};
  });

  const [examStartTime, setExamStartTime] = useState(() => {
    const saved = localStorage.getItem("exam_start_time");
    return saved ? parseInt(saved, 10) : null;
  });

  const [examInProgress, setExamInProgress] = useState(() => {
    return localStorage.getItem("exam_in_progress") === "true";
  });

  const [flaggedQuestions, setFlaggedQuestions] = useState(() => {
    const saved = localStorage.getItem("exam_flagged_questions");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  const navigate = useNavigate();

  // Sincronizar con localStorage
  useEffect(() => {
    localStorage.setItem("exam_current_index", currentQuestionIndex);
  }, [currentQuestionIndex]);

  useEffect(() => {
    localStorage.setItem("exam_user_answers", JSON.stringify(userAnswers));
  }, [userAnswers]);

  useEffect(() => {
    if (examStartTime) {
      localStorage.setItem("exam_start_time", examStartTime);
    }
  }, [examStartTime]);

  useEffect(() => {
    localStorage.setItem("exam_in_progress", examInProgress);
  }, [examInProgress]);

  useEffect(() => {
    localStorage.setItem(
      "exam_flagged_questions",
      JSON.stringify([...flaggedQuestions]),
    );
  }, [flaggedQuestions]);

  // Guardar examData en localStorage cuando cambie (preguntas de API)
  useEffect(() => {
    localStorage.setItem("exam_data", JSON.stringify(examData));
  }, [examData]);

  // Sincronizar tiempos de respuesta
  useEffect(() => {
    localStorage.setItem(
      "exam_question_times",
      JSON.stringify(questionStartTimes),
    );
  }, [questionStartTimes]);

  useEffect(() => {
    localStorage.setItem("exam_answer_times", JSON.stringify(answerTimes));
  }, [answerTimes]);

  // Registrar tiempo de inicio cuando cambia la pregunta
  useEffect(() => {
    if (
      examInProgress &&
      examData &&
      examData.preguntas &&
      examData.preguntas[currentQuestionIndex]
    ) {
      const questionId = examData.preguntas[currentQuestionIndex].id;

      // Solo registrar si no existe ya un tiempo de inicio para esta pregunta
      if (!questionStartTimes[questionId]) {
        setQuestionStartTimes((prev) => ({
          ...prev,
          [questionId]: Date.now(),
        }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestionIndex, examInProgress, examData]);

  /**
   * Carga las preguntas del examen SOLO desde API
   * NO usa datos locales de prueba
   */
  const loadExamQuestions = async () => {
    setIsLoadingExam(true);
    setExamLoadError(null);

    try {
      // console.log("🌐 Cargando preguntas desde API...");
      const result = await examService.getExamQuestions();

      if (result.success) {
        setExamData(result.data);

        // Guardar en localStorage para persistencia
        localStorage.setItem("exam_data", JSON.stringify(result.data));

        // Guardar tiempo total del examen
        if (result.data.tiempo_total) {
          localStorage.setItem("exam_duration", result.data.tiempo_total);
        }

        console.log("✅ Preguntas cargadas desde API exitosamente");
        return { success: true, source: "api" };
      } else {
        // ERROR: No hay datos locales de respaldo
        const errorMsg =
          result.error || "Error al cargar preguntas desde el servidor";
        setExamLoadError(errorMsg);
        console.error("❌ Error cargando preguntas:", errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (error) {
      // ERROR: No hay datos locales de respaldo
      const errorMsg =
        "No se pudo conectar con el servidor. Verifica tu conexión a internet.";
      setExamLoadError(errorMsg);
      console.error("❌ Error al cargar preguntas:", error);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoadingExam(false);
    }
  };

  /**
   * Sincroniza el tiempo con el backend (llamado periódicamente por el Timer)
   * Solo actualiza tiempo_transcurrido sin recargar preguntas
   */
  const syncTimeWithBackend = async () => {
    try {
      console.log("🔄 Sincronizando tiempo con backend...");
      const result = await examService.getExamQuestions();

      if (result.success && result.data.tiempo_transcurrido !== undefined) {
        // Actualizar solo el tiempo transcurrido sin afectar las preguntas
        setExamData((prevData) => ({
          ...prevData,
          tiempo_transcurrido: result.data.tiempo_transcurrido,
        }));

        console.log(
          "✅ Tiempo sincronizado:",
          result.data.tiempo_transcurrido,
          "segundos",
        );
      }
    } catch (error) {
      console.error("⚠️ Error al sincronizar tiempo:", error);
      // No hacer nada - continuar con el tiempo local
    }
  };

  /**
   * Inicia el examen (carga preguntas desde API o local según configuración)
   */
  const startExam = async () => {
    const result = await loadExamQuestions();

    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setQuestionStartTimes({}); // Limpiar tiempos de inicio
    setAnswerTimes({}); // Limpiar tiempos de respuesta
    setExamStartTime(Date.now());
    setExamInProgress(true);

    return result;
  };

  /**
   * Guarda la respuesta del usuario para la pregunta actual
   * @param {any} answer - La respuesta del usuario
   */
  const saveAnswer = (answer) => {
    if (
      !examData ||
      !examData.preguntas ||
      !examData.preguntas[currentQuestionIndex]
    ) {
      console.error("No se puede guardar la respuesta: pregunta no encontrada");
      return;
    }

    const pregunta = examData.preguntas[currentQuestionIndex];
    const questionId = pregunta.id;

    // Guardar respuesta localmente
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));

    // Calcular tiempo de respuesta
    const startTime = questionStartTimes[questionId];
    let tiempoRespuesta = 0;

    if (startTime) {
      tiempoRespuesta = Math.round((Date.now() - startTime) / 1000);
      setAnswerTimes((prev) => ({
        ...prev,
        [questionId]: tiempoRespuesta,
      }));
    }

    // ✅ AUTOSAVE: Encontrar opcion_id
    let opcionId = null;

    if (pregunta.opcionesCompletas) {
      const opcionSeleccionada = pregunta.opcionesCompletas.find(
        (opt) => opt.pregunta === answer,
      );
      opcionId = opcionSeleccionada ? opcionSeleccionada.id : null;
    } else {
      // Fallback: usar índice
      const indexOpcion = pregunta.opciones.indexOf(answer);
      opcionId = indexOpcion !== -1 ? String(indexOpcion + 1) : null;
    }

    // ✅ Llamar autosave en segundo plano (no esperar)
    if (opcionId) {
      examService
        .autosaveAnswer(questionId, opcionId, tiempoRespuesta)
        .catch((err) => console.warn("Autosave ignorado:", err));
    }
  };

  /**
   * Avanza a la siguiente pregunta
   */
  const nextQuestion = () => {
    if (!examData || !examData.preguntas || examData.preguntas.length === 0) {
      return;
    }

    // Usar setTimeout para evitar problemas de navegación durante efectos
    setTimeout(() => {
      if (currentQuestionIndex < examData.preguntas.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        finishExam();
      }
    }, 0);
  };

  /**
   * Retrocede a la pregunta anterior
   */
  const previousQuestion = () => {
    if (!examData || !examData.preguntas || examData.preguntas.length === 0) {
      return;
    }

    setTimeout(() => {
      if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex((prev) => prev - 1);
      }
    }, 0);
  };

  /**
   * Salta directamente a una pregunta específica
   * @param {number} index - Índice de la pregunta (0-based)
   */
  const goToQuestion = (index) => {
    if (!examData || !examData.preguntas || examData.preguntas.length === 0) {
      return;
    }

    setTimeout(() => {
      if (index >= 0 && index < examData.preguntas.length) {
        setCurrentQuestionIndex(index);
      }
    }, 0);
  };

  /**
   * Marca/desmarca una pregunta para revisión
   * @param {number} questionId - ID de la pregunta
   */
  const toggleFlag = (questionId) => {
    setFlaggedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  /**
   * Verifica si una pregunta está marcada
   * @param {number} questionId - ID de la pregunta
   * @returns {boolean}
   */
  const isFlagged = (questionId) => {
    return flaggedQuestions.has(questionId);
  };

  /**
   * Finaliza el examen
   */
  const finishExam = async () => {
    if (!examData || !examData.preguntas || examData.preguntas.length === 0) {
      console.error(
        "No se puede finalizar la prueba: no hay preguntas cargadas",
      );
      return;
    }

    const endTime = Date.now();
    const totalTime = examStartTime ? endTime - examStartTime : 0;
    localStorage.setItem("exam_finished", "true");

    // Construir objeto de respuestas en formato API
    const respuestasParaAPI = [];

    examData.preguntas.forEach((pregunta) => {
      const userAnswer = userAnswers[pregunta.id];

      // Solo incluir preguntas que fueron respondidas
      if (userAnswer !== undefined && userAnswer !== null) {
        // Encontrar el ID de la opción seleccionada
        let opcionId = null;

        if (pregunta.opcionesCompletas) {
          // Si tenemos la estructura completa de la API
          const opcionSeleccionada = pregunta.opcionesCompletas.find(
            (opt) => opt.pregunta === userAnswer,
          );
          opcionId = opcionSeleccionada ? opcionSeleccionada.id : null;
        } else {
          // Fallback: usar el índice de la opción (1, 2, 3, 4...)
          const indexOpcion = pregunta.opciones.indexOf(userAnswer);
          opcionId = indexOpcion !== -1 ? String(indexOpcion + 1) : null;
        }

        if (opcionId) {
          respuestasParaAPI.push({
            codigo_pregunta: pregunta.id,
            opcion_id: opcionId,
            tiempo_respuesta: answerTimes[pregunta.id] || 0,
          });
        }
      }
    });

    localStorage.removeItem("exam_global_timer");

    // console.log("📊 Resumen de la prueba:");
    // console.log("Total preguntas:", examData.preguntas.length);
    // console.log("Preguntas respondidas:", Object.keys(userAnswers).length);
    // console.log("Respuestas a enviar:", respuestasParaAPI.length);

    // Enviar respuestas a la API
    const submitResult = await examService.submitAnswers(respuestasParaAPI);

    if (submitResult.success) {
      console.log("✅ Respuestas enviadas exitosamente");
    } else {
      console.error("❌ Error al enviar respuestas:", submitResult.error);
    }

    // Guardar resultados localmente (para página de resultados)
    const results = {
      answers: userAnswers,
      answerTimes: answerTimes,
      respuestasAPI: respuestasParaAPI,
      submitResult: submitResult,
      startTime: examStartTime,
      endTime: endTime,
      totalTime: totalTime,
      totalQuestions: examData.preguntas.length,
      answeredQuestions: Object.keys(userAnswers).length,
      completedAt: new Date().toISOString(),
    };

    localStorage.setItem("exam_results", JSON.stringify(results));

    // Limpiar el timer global
    localStorage.removeItem("exam_global_timer");

    // Limpiar estado del examen en progreso
    setExamInProgress(false);

    // Navegar a la página de finalización usando replace
    // Esto reemplaza /prueba en el historial, evitando volver atrás
    setTimeout(() => {
      navigate("/fin", { replace: true });
    }, 100);
  };

  /**
   * Reinicia el examen
   */
  const resetExam = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setFlaggedQuestions(new Set());
    setExamStartTime(null);
    setExamInProgress(false);
    // setExamData(EXAM_DATA); // Resetear a datos locales
    setQuestionStartTimes({}); // Limpiar tiempos de inicio
    setAnswerTimes({}); // Limpiar tiempos de respuesta

    // Limpiar localStorage
    localStorage.removeItem("exam_current_index");
    localStorage.removeItem("exam_user_answers");
    localStorage.removeItem("exam_flagged_questions");
    localStorage.removeItem("exam_start_time");
    localStorage.removeItem("exam_in_progress");
    localStorage.removeItem("exam_results");
    localStorage.removeItem("exam_global_timer");
    localStorage.removeItem("exam_data"); // Limpiar preguntas de API
    localStorage.removeItem("exam_question_times"); // Limpiar tiempos de inicio
    localStorage.removeItem("exam_answer_times"); // Limpiar tiempos de respuesta
  };

  /**
   * Obtiene la respuesta guardada para una pregunta
   * @param {number} questionId - ID de la pregunta
   * @returns {any} - La respuesta guardada o undefined
   */
  const getAnswer = (questionId) => {
    return userAnswers[questionId];
  };

  /**
   * Obtiene la pregunta actual
   */
  const getCurrentQuestion = () => {
    if (
      !examData ||
      !examData.preguntas ||
      !examData.preguntas[currentQuestionIndex]
    ) {
      // Retornar una pregunta vacía por defecto
      return {
        id: "temp",
        pregunta: "Cargando pregunta...",
        tipo_de_pregunta: 3,
        tiempo: 0,
        opciones: [],
        opcionesCompletas: [],
      };
    }
    return examData.preguntas[currentQuestionIndex];
  };

  /**
   * Calcula el progreso del examen (0-100)
   */
  const getProgress = () => {
    if (!examData || !examData.preguntas || examData.preguntas.length === 0) {
      return 0;
    }
    return Math.round(
      ((currentQuestionIndex + 1) / examData.preguntas.length) * 100,
    );
  };

  /**
   * Verifica si el examen está completo
   */
  const isExamComplete = () => {
    if (!examData || !examData.preguntas || examData.preguntas.length === 0) {
      return false;
    }
    return currentQuestionIndex >= examData.preguntas.length - 1;
  };

  /**
   * Obtiene estadísticas del examen
   */
  const getStats = () => {
    if (!examData || !examData.preguntas || examData.preguntas.length === 0) {
      return {
        totalQuestions: 0,
        answeredQuestions: 0,
        unansweredQuestions: 0,
        currentQuestion: 0,
        progressPercentage: 0,
        isComplete: false,
      };
    }

    const totalQuestions = examData.preguntas.length;
    const answeredQuestions = Object.keys(userAnswers).length;
    const unansweredQuestions = totalQuestions - answeredQuestions;
    const progressPercentage = getProgress();
    const flaggedQuestionsCount = flaggedQuestions.size;

    return {
      totalQuestions,
      answeredQuestions,
      unansweredQuestions,
      flaggedQuestions: flaggedQuestionsCount,
      currentQuestion: currentQuestionIndex + 1,
      progressPercentage,
      isComplete: isExamComplete(),
    };
  };

  const value = {
    // Estado
    currentQuestionIndex,
    userAnswers,
    flaggedQuestions,
    examStartTime,
    examInProgress,
    examData,
    isLoadingExam,
    examLoadError,

    // Funciones
    startExam,
    loadExamQuestions,
    syncTimeWithBackend,
    saveAnswer,
    nextQuestion,
    previousQuestion,
    goToQuestion,
    toggleFlag,
    isFlagged,
    finishExam,
    resetExam,
    getAnswer,
    getCurrentQuestion,
    getProgress,
    isExamComplete,
    getStats,
  };

  return <ExamContext.Provider value={value}>{children}</ExamContext.Provider>;
}
