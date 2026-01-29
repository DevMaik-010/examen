import { useContext } from 'react';
import { ExamContext } from '../context/ExamContext';

// ============================================
// CUSTOM HOOK - useExam
// ============================================

export function useExam() {
  const context = useContext(ExamContext);
  
  if (!context) {
    throw new Error('useExam debe usarse dentro de ExamProvider');
  }
  
  return context;
}
