"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { quizData } from "@/util/quizzes";
import { QuizAnswer } from "@/util/types";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

export default function QuizAttemptPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const router = useRouter();
  const quiz = quizData[courseId];

  const TOTAL_SECONDS = (quiz?.timeLimit ?? 15) * 60;

  // ── State ───────────────────────────────────────────────────────────────────
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(quiz?.totalQuestions ?? 10).fill(null),
  );
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
  const [showConfirm, setShowConfirm] = useState(false);
  const startedAt = useRef(new Date().toISOString());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // ── Timer ───────────────────────────────────────────────────────────────────
  const submitQuiz = useCallback(
    (remainingSeconds: number) => {
      if (!quiz) return;
      if (timerRef.current) clearInterval(timerRef.current);

      const timeUsed = TOTAL_SECONDS - remainingSeconds;
      const quizAnswers: QuizAnswer[] = quiz.questions.map((q, i) => ({
        questionId: q.id,
        selectedIndex: answers[i],
        isCorrect: answers[i] === q.correctIndex,
      }));

      const correctCount = quizAnswers.filter((a) => a.isCorrect).length;
      const score = Math.round((correctCount / quiz.totalQuestions) * 100);

      const result = {
        courseId,
        startedAt: startedAt.current,
        completedAt: new Date().toISOString(),
        timeUsed,
        answers: quizAnswers,
        score,
        passed: score >= quiz.passingScore,
        attemptNumber: 1,
      };

      sessionStorage.setItem(`quiz-result-${courseId}`, JSON.stringify(result));
      router.push(`/dashboard/student/courses/${courseId}/quiz/result`);
    },
    [answers, courseId, quiz, TOTAL_SECONDS, router],
  );

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          submitQuiz(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [submitQuiz]);

  if (!quiz) return null;

  const currentQuestion = quiz.questions[currentIndex];
  const selectedAnswer = answers[currentIndex];
  const answeredCount = answers.filter((a) => a !== null).length;
  const isLast = currentIndex === quiz.totalQuestions - 1;

  // Time formatting
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timeStr = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  const isUrgent = timeLeft <= 120; // last 2 minutes

  const handleSelect = (optionIndex: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentIndex] = optionIndex;
      return next;
    });
  };

  const handleNext = () => {
    if (currentIndex < quiz.totalQuestions - 1) setCurrentIndex((i) => i + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  // ── Option label helper ─────────────────────────────────────────────────────
  const OPTION_LABELS = ["A", "B", "C", "D"];

  return (
    <>
      <div className="max-w-[1500px] mx-auto px-6 py-8 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row gap-6">


          {/* ── Question card ───────────────────────────────────────────────── */}
          <div className="w-full max-w-[800px] flex-shrink-0 bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.05),0_8px_24px_rgba(15,23,62,0.06)] overflow-hidden">
            {/* Question header */}
            <div className="bg-[#f8f9fc] border-b border-gray-100 px-8 py-6">
              <div className="flex items-start gap-3">
                <span className="shrink-0 w-7 h-7 rounded-lg bg-[#0f173e] text-white text-xs font-bold flex items-center justify-center mt-0.5">
                  {currentIndex + 1}
                </span>
                <p className="text-[#0f173e] font-semibold text-lg leading-snug font-serif">
                  {currentQuestion.question}
                </p>
              </div>
            </div>

            {/* Options */}
            <div className="px-8 py-6 flex flex-col gap-3">
              {currentQuestion.options.map((option, i) => {
                const isSelected = selectedAnswer === i;
                return (
                  <button
                    key={i}
                    onClick={() => handleSelect(i)}
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border-2 text-left transition-all duration-150 group ${
                      isSelected
                        ? "border-[#0f173e] bg-[#0f173e]/5"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {/* Label bubble */}
                    <span
                      className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
                        isSelected
                          ? "bg-[#0f173e] text-white"
                          : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                      }`}
                    >
                      {OPTION_LABELS[i]}
                    </span>
                    <span
                      className={`text-sm leading-relaxed transition-colors ${
                        isSelected
                          ? "text-[#0f173e] font-medium"
                          : "text-gray-700"
                      }`}
                    >
                      {option}
                    </span>
                    {isSelected && (
                      <CheckCircle2
                        size={18}
                        strokeWidth={2}
                        className="ml-auto text-green-500 shrink-0"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* ── Navigation buttons ──────────────────────────────────────────── */}
            <div className="flex items-center justify-between gap-3 px-8 py-6 ">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={16} strokeWidth={2.5} />
                Previous
              </button>

              {isLast ? (
                <button
                  onClick={() => setShowConfirm(true)}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white text-sm font-semibold transition-all duration-200 shadow-sm"
                >
                  Submit Quiz
                  <CheckCircle2 size={16} strokeWidth={2.5} />
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0f173e] hover:bg-[#1a2456] active:scale-[0.98] text-white text-sm font-semibold transition-all duration-200"
                >
                  Next
                  <ChevronRight size={16} strokeWidth={2.5} />
                </button>
              )}
            </div>
          </div>



          <div className="max-w-[500px] flex flex-col gap-6 md:gap-12 ml-0 md:ml-[100px]">
            {/* ── Top bar: progress + timer ───────────────────────────────────── */}
            <div className="flex items-center justify-between gap-4">
              {/* Progress bar */}
              <div className="flex flex-col gap-1.5 flex-1">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>
                    Question{" "}
                    <span className="font-semibold text-[#0f173e]">
                      {currentIndex + 1}
                    </span>{" "}
                    of {quiz.totalQuestions}
                  </span>
                  <span className="text-green-600 font-semibold">
                    {answeredCount}/{quiz.totalQuestions} answered
                  </span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all duration-300"
                    style={{
                      width: `${((currentIndex + 1) / quiz.totalQuestions) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Timer */}
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold text-sm transition-colors ${
                  isUrgent
                    ? "bg-red-50 text-red-600 border border-red-200"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                <Clock
                  size={15}
                  strokeWidth={2}
                  className={isUrgent ? "animate-pulse" : ""}
                />
                {timeStr}
              </div>
            </div>
            {/* ── Question navigator dots ─────────────────────────────────────── */}
            <div className="flex gap-2">
              {quiz.questions.map((_, i) => {
                const isAnswered = answers[i] !== null;
                const isCurrent = i === currentIndex;
                return (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    title={`Question ${i + 1}`}
                    className={`flex items-center justify-center w-10 h-10 rounded-lg text-xs font-bold transition-all duration-150 border ${
                      isCurrent
                        ? "bg-[#0f173e] text-white border-[#0f173e] scale-110"
                        : isAnswered
                          ? "bg-green-50 text-green-700 border-green-300"
                          : "bg-white text-gray-400 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>

            {/* ── Navigation buttons ──────────────────────────────────────────── */}
            <div className="flex items-end justify-end gap-3">
              <button
                onClick={() => setShowConfirm(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white text-sm font-semibold transition-all duration-200 shadow-sm"
              >
                Submit Quiz
                <CheckCircle2 size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Submit confirmation modal ───────────────────────────────────────── */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowConfirm(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-100 w-full p-7 flex flex-col gap-5 z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                <AlertTriangle
                  size={20}
                  strokeWidth={1.8}
                  className="text-orange-500"
                />
              </div>
              <h2 className="text-lg font-bold text-[#0f173e] font-serif">
                Submit Quiz?
              </h2>
            </div>

            <div className="flex flex-col gap-1.5">
              <p className="text-sm text-gray-600 leading-relaxed">
                You have answered{" "}
                <span className="font-semibold text-[#0f173e]">
                  {answeredCount}
                </span>{" "}
                of <span className="font-semibold">{quiz.totalQuestions}</span>{" "}
                questions.
              </p>
              {answeredCount < quiz.totalQuestions && (
                <p className="text-sm text-orange-600 font-medium">
                  ⚠ {quiz.totalQuestions - answeredCount} question
                  {quiz.totalQuestions - answeredCount > 1 ? "s" : ""} left
                  unanswered.
                </p>
              )}
              <p className="text-sm text-gray-500">
                Unanswered questions will be marked as incorrect.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Keep reviewing
              </button>
              <button
                onClick={() => submitQuiz(timeLeft)}
                className="flex-1 py-3 rounded-xl bg-[#0f173e] hover:bg-[#1a2456] text-white text-sm font-semibold transition-all"
              >
                Yes, submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
