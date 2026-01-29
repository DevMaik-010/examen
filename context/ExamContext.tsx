"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { EXAM_DATA, ExamData, Pregunta } from "@/lib/data";

// ============================================
// CONTEXTO DEL EXAMEN - SIN AUTENTICACIÓN
// Todo es público y accesible
// ============================================

interface ExamStats {
  totalQuestions: number;
  answeredQuestions: number;
  unansweredQuestions: number;
  flaggedQuestions: number;
  currentQuestion: number;
  progressPercentage: number;
  isComplete: boolean;
}

interface ExamContextType {
  // Estado
  currentQuestionIndex: number;
  userAnswers: Record<string, string>;
  flaggedQuestions: Set<string>;
  examStartTime: number | null;
  examInProgress: boolean;
  examData: ExamData;
  tiempoRestante: number;
  isRestored: boolean;

  // Funciones
  startExam: () => void;
  saveAnswer: (answer: string) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  goToQuestion: (index: number) => void;
  toggleFlag: (questionId: string) => void;
  isFlagged: (questionId: string) => boolean;
  isVisited: (questionId: string) => boolean;
  finishExam: () => void;
  resetExam: () => void;
  getAnswer: (questionId: string) => string | undefined;
  getCurrentQuestion: () => Pregunta;
  getProgress: () => number;
  isExamComplete: () => boolean;
  getStats: () => ExamStats;
}

const ExamContext = createContext<ExamContextType | null>(null);

export function ExamProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  // Datos del examen
  const [examData] = useState<ExamData>(EXAM_DATA);

  // Estado del examen
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(
    new Set(),
  );
  const [examStartTime, setExamStartTime] = useState<number | null>(null);
  const [examInProgress, setExamInProgress] = useState(false);
  const [tiempoRestante, setTiempoRestante] = useState(EXAM_DATA.tiempo_total);
  const [isRestored, setIsRestored] = useState(false);
  const [visitedQuestions, setVisitedQuestions] = useState<Set<string>>(
    new Set(),
  );

  // Timer countdown
  useEffect(() => {
    if (!examInProgress) return;

    const interval = setInterval(() => {
      setTiempoRestante((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          finishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examInProgress]);

  // Cargar estado desde localStorage al iniciar
  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedAnswers = localStorage.getItem("exam_user_answers");
    const savedIndex = localStorage.getItem("exam_current_index");
    const savedFlagged = localStorage.getItem("exam_flagged_questions");
    const savedStartTime = localStorage.getItem("exam_start_time");
    const savedInProgress = localStorage.getItem("exam_in_progress");
    const savedTiempo = localStorage.getItem("exam_tiempo_restante");
    const savedVisited = localStorage.getItem("exam_visited_questions");

    if (savedAnswers) setUserAnswers(JSON.parse(savedAnswers));
    if (savedIndex) setCurrentQuestionIndex(parseInt(savedIndex, 10));
    if (savedFlagged) setFlaggedQuestions(new Set(JSON.parse(savedFlagged)));
    if (savedStartTime) setExamStartTime(parseInt(savedStartTime, 10));
    if (savedInProgress === "true") setExamInProgress(true);
    if (savedTiempo) setTiempoRestante(parseInt(savedTiempo, 10));
    if (savedVisited) setVisitedQuestions(new Set(JSON.parse(savedVisited)));

    setIsRestored(true);
  }, []);

  // Guardar en localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("exam_user_answers", JSON.stringify(userAnswers));
  }, [userAnswers]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("exam_current_index", currentQuestionIndex.toString());
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(
      "exam_flagged_questions",
      JSON.stringify([...flaggedQuestions]),
    );
  }, [flaggedQuestions]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("exam_in_progress", examInProgress.toString());
  }, [examInProgress]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("exam_tiempo_restante", tiempoRestante.toString());
  }, [tiempoRestante]);

  // Guardar visited questions
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(
      "exam_visited_questions",
      JSON.stringify([...visitedQuestions]),
    );
  }, [visitedQuestions]);

  // Marcar pregunta actual como visitada
  useEffect(() => {
    if (!examInProgress) return;
    const currentQuestionId = examData.preguntas[currentQuestionIndex]?.id;
    if (currentQuestionId && !visitedQuestions.has(currentQuestionId)) {
      setVisitedQuestions((prev) => {
        const newSet = new Set(prev);
        newSet.add(currentQuestionId);
        return newSet;
      });
    }
  }, [
    currentQuestionIndex,
    examInProgress,
    examData.preguntas,
    visitedQuestions,
  ]);

  // Funciones
  const startExam = useCallback(() => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setFlaggedQuestions(new Set());
    setExamStartTime(Date.now());
    setExamInProgress(true);
    setTiempoRestante(examData.tiempo_total);
    setVisitedQuestions(new Set());

    if (typeof window !== "undefined") {
      localStorage.setItem("exam_start_time", Date.now().toString());
    }
  }, [examData.tiempo_total]);

  const saveAnswer = useCallback(
    (answer: string) => {
      const questionId = examData.preguntas[currentQuestionIndex]?.id;
      if (!questionId) return;

      setUserAnswers((prev) => ({
        ...prev,
        [questionId]: answer,
      }));
    },
    [examData.preguntas, currentQuestionIndex],
  );

  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex < examData.preguntas.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  }, [currentQuestionIndex, examData.preguntas.length]);

  const previousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  }, [currentQuestionIndex]);

  const goToQuestion = useCallback(
    (index: number) => {
      if (index >= 0 && index < examData.preguntas.length) {
        setCurrentQuestionIndex(index);
      }
    },
    [examData.preguntas.length],
  );

  const toggleFlag = useCallback((questionId: string) => {
    setFlaggedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  }, []);

  const isFlagged = useCallback(
    (questionId: string) => {
      return flaggedQuestions.has(questionId);
    },
    [flaggedQuestions],
  );

  const isVisited = useCallback(
    (questionId: string) => {
      return visitedQuestions.has(questionId);
    },
    [visitedQuestions],
  );

  const finishExam = useCallback(() => {
    setExamInProgress(false);

    // Guardar resultados
    const results = {
      answers: userAnswers,
      totalQuestions: examData.preguntas.length,
      answeredQuestions: Object.keys(userAnswers).length,
      completedAt: new Date().toISOString(),
    };

    if (typeof window !== "undefined") {
      localStorage.setItem("exam_results", JSON.stringify(results));
    }

    router.push("/fin");
  }, [userAnswers, examData.preguntas.length, router]);

  const resetExam = useCallback(() => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setFlaggedQuestions(new Set());
    setExamStartTime(null);
    setExamInProgress(false);
    setTiempoRestante(examData.tiempo_total);

    if (typeof window !== "undefined") {
      localStorage.removeItem("exam_current_index");
      localStorage.removeItem("exam_user_answers");
      localStorage.removeItem("exam_flagged_questions");
      localStorage.removeItem("exam_start_time");
      localStorage.removeItem("exam_in_progress");
      localStorage.removeItem("exam_results");
      localStorage.removeItem("exam_tiempo_restante");
      localStorage.removeItem("exam_visited_questions");
    }
  }, [examData.tiempo_total]);

  const getAnswer = useCallback(
    (questionId: string) => {
      return userAnswers[questionId];
    },
    [userAnswers],
  );

  const getCurrentQuestion = useCallback((): Pregunta => {
    return examData.preguntas[currentQuestionIndex] || examData.preguntas[0];
  }, [examData.preguntas, currentQuestionIndex]);

  const getProgress = useCallback(() => {
    return Math.round(
      ((currentQuestionIndex + 1) / examData.preguntas.length) * 100,
    );
  }, [currentQuestionIndex, examData.preguntas.length]);

  const isExamComplete = useCallback(() => {
    return currentQuestionIndex >= examData.preguntas.length - 1;
  }, [currentQuestionIndex, examData.preguntas.length]);

  const getStats = useCallback((): ExamStats => {
    const totalQuestions = examData.preguntas.length;
    const answeredQuestions = Object.keys(userAnswers).length;
    const unansweredQuestions = totalQuestions - answeredQuestions;
    const flaggedQuestionsCount = flaggedQuestions.size;

    return {
      totalQuestions,
      answeredQuestions,
      unansweredQuestions,
      flaggedQuestions: flaggedQuestionsCount,
      currentQuestion: currentQuestionIndex + 1,
      progressPercentage: getProgress(),
      isComplete: isExamComplete(),
    };
  }, [
    examData.preguntas.length,
    userAnswers,
    flaggedQuestions.size,
    currentQuestionIndex,
    getProgress,
    isExamComplete,
  ]);

  const value: ExamContextType = {
    currentQuestionIndex,
    userAnswers,
    flaggedQuestions,
    examStartTime,
    examInProgress,
    examData,
    tiempoRestante,
    isRestored,
    startExam,
    saveAnswer,
    nextQuestion,
    previousQuestion,
    goToQuestion,
    toggleFlag,
    isFlagged,
    isVisited,
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

export function useExam() {
  const context = useContext(ExamContext);
  if (!context) {
    throw new Error("useExam debe usarse dentro de ExamProvider");
  }
  return context;
}
