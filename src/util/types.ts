// ─── Quiz Data Types ──────────────────────────────────────────────────────────

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizData {
  courseId: string;
  title: string;
  description: string;
  totalQuestions: number;
  timeLimit: number; // in minutes
  passingScore: number; // percentage
  questions: QuizQuestion[];
}

// ─── Quiz Session / Attempt Types ─────────────────────────────────────────────

export interface QuizAnswer {
  questionId: string;
  selectedIndex: number | null;
  isCorrect: boolean;
}

export interface QuizAttempt {
  courseId: string;
  startedAt: string; // ISO string
  completedAt: string; // ISO string
  timeUsed: number; // seconds
  answers: QuizAnswer[];
  score: number; // percentage 0–100
  passed: boolean;
  attemptNumber: number;
}

// ─── Result Page Types ────────────────────────────────────────────────────────

export interface QuizResult {
  attempt: QuizAttempt;
  quiz: QuizData;
  correctCount: number;
  wrongCount: number;
  unansweredCount: number;
}