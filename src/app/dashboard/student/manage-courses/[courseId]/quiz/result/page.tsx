"use client";

/**
 * TODO: Quiz endpoints need to be implemented in the backend API
 * Once implemented, replace mock quiz data with real API calls
 * Current implementation uses mock data from src/util/quizzes.ts
 */

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { quizData } from "@/util/quizzes";
import { QuizAttempt } from "@/util/types";
import {
  Trophy,
  XCircle,
  CheckCircle2,
  Clock,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowLeft,
  Target,
  MinusCircle,
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${String(s).padStart(2, "0")}s`;
}

function getScoreRing(score: number) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return { circ, offset };
}

export default function QuizResultPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const router = useRouter();
  const quiz = quizData[courseId];

  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem(`quiz-result-${courseId}`);
    if (raw) {
      const parsed = JSON.parse(raw) as QuizAttempt;
      setTimeout(() => setAttempt(parsed), 0);
    }
  }, [courseId]);

  if (!quiz || !attempt) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <p className="text-gray-500">No result found. Please take the quiz first.</p>
          <button
            onClick={() => router.push(`/dashboard/student/manage-courses/${courseId}/quiz`)}
            className="text-sm font-semibold text-green-600 hover:underline"
          >
            Go to quiz →
          </button>
        </div>
    );
  }

  const correctCount = attempt.answers.filter((a) => a.isCorrect).length;
  const wrongCount = attempt.answers.filter(
    (a) => a.selectedIndex !== null && !a.isCorrect
  ).length;
  const unansweredCount = attempt.answers.filter((a) => a.selectedIndex === null).length;
  const passed = attempt.passed;

  const { circ, offset } = getScoreRing(attempt.score);

  // ── AI recommendation text based on score ─────────────────────────────────
  const aiRecommendation = (() => {
    if (attempt.score >= 90)
      return `Outstanding performance on the ${quiz.title.replace(" Quiz", "")} quiz! You've mastered the core concepts. I recommend exploring advanced topics or attempting a timed challenge to push your understanding further.`;
    if (attempt.score >= quiz.passingScore)
      return `Good work passing the quiz! You're solid on the fundamentals, but I noticed some gaps in ${
        quiz.questions
          .filter((_, i) => !attempt.answers[i]?.isCorrect)
          .slice(0, 2)
          .map((q) => q.question.split("?")[0].slice(-30))
          .join(" and ")
      }. I recommend revisiting those modules before moving on.`;
    return `You didn't pass this time — but that's okay! Based on your answers, I recommend reviewing the entire ${quiz.title.replace(" Quiz", "")} module, focusing especially on the questions you got wrong. You can retake the quiz anytime.`;
  })();

  return (
      <div className="max-w-180 mx-auto px-6 py-10 flex flex-col gap-6">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push(`/dashboard/student/manage-courses/${courseId}`)}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft size={14} strokeWidth={2} />
            Back to course
          </button>
        </div>

        {/* ── Score hero card ─────────────────────────────────────────────── */}
        <div
          className={`relative rounded-2xl overflow-hidden px-8 py-10 flex flex-col sm:flex-row items-center gap-8 ${
            passed
              ? "bg-linear-to-br from-[#0f173e] to-[#1a3a2a]"
              : "bg-linear-to-br from-[#0f173e] to-[#3a1a1a]"
          }`}
        >
          <div className="absolute top-0 right-0 w-56 h-56 bg-white/5 rounded-full blur-3xl pointer-events-none" />

          {/* Score ring */}
          <div className="relative shrink-0">
            <svg width="140" height="140" className="-rotate-90">
              {/* Background track */}
              <circle cx="70" cy="70" r="52" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
              {/* Progress arc */}
              <circle
                cx="70"
                cy="70"
                r="52"
                fill="none"
                stroke={passed ? "#4ade80" : "#f87171"}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={offset}
                style={{ transition: "stroke-dashoffset 1s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-white font-serif">{attempt.score}%</span>
              <span
                className={`text-xs font-semibold ${passed ? "text-green-400" : "text-red-400"}`}
              >
                {passed ? "PASSED" : "FAILED"}
              </span>
            </div>
          </div>

          {/* Text */}
          <div className="flex flex-col gap-2 text-center sm:text-left">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              {passed ? (
                <Trophy size={20} strokeWidth={1.8} className="text-yellow-400" />
              ) : (
                <Target size={20} strokeWidth={1.8} className="text-red-400" />
              )}
              <h1 className="text-2xl font-bold text-white font-serif">
                {passed ? "Quiz Passed!" : "Better luck next time"}
              </h1>
            </div>
            <p className="text-sm text-white/60 leading-relaxed max-w-85">
              {passed
                ? `You scored ${attempt.score}% — above the ${quiz.passingScore}% passing threshold.`
                : `You scored ${attempt.score}%. You need ${quiz.passingScore}% to pass. Retake the quiz anytime.`}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-white/40 justify-center sm:justify-start mt-1">
              <Clock size={13} strokeWidth={1.8} />
              Time used: {formatTime(attempt.timeUsed)}
            </div>
          </div>
        </div>

        {/* ── Stats breakdown ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              icon: CheckCircle2,
              label: "Correct",
              value: correctCount,
              color: "text-green-600",
              bg: "bg-green-50",
              border: "border-green-100",
            },
            {
              icon: XCircle,
              label: "Wrong",
              value: wrongCount,
              color: "text-red-500",
              bg: "bg-red-50",
              border: "border-red-100",
            },
            {
              icon: MinusCircle,
              label: "Skipped",
              value: unansweredCount,
              color: "text-gray-400",
              bg: "bg-gray-50",
              border: "border-gray-200",
            },
          ].map(({ icon: Icon, label, value, color, bg, border }) => (
            <div
              key={label}
              className={`${bg} border ${border} rounded-xl p-5 flex flex-col items-center gap-2`}
            >
              <Icon size={22} strokeWidth={1.8} className={color} />
              <span className={`text-2xl font-bold font-serif ${color}`}>{value}</span>
              <span className="text-xs text-gray-500">{label}</span>
            </div>
          ))}
        </div>

        {/* ── AI Recommendation ───────────────────────────────────────────── */}
        <div className="relative bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-400" />
          <div className="px-7 py-6 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Sparkles size={15} strokeWidth={2} className="text-green-500" />
              <h2 className="text-sm font-bold text-[#0f173e]">AI Recommendation</h2>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{aiRecommendation}</p>
          </div>
        </div>

        {/* ── Per-question review ─────────────────────────────────────────── */}
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-[#0f173e] font-serif">Question Review</h2>

          {quiz.questions.map((q, i) => {
            const answer = attempt.answers[i];
            const isCorrect = answer?.isCorrect;
            const isSkipped = answer?.selectedIndex === null;
            const isExpanded = expandedIndex === i;

            return (
              <div
                key={q.id}
                className={`bg-white rounded-xl border shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-200 ${
                  isCorrect
                    ? "border-green-200"
                    : isSkipped
                    ? "border-gray-200"
                    : "border-red-200"
                }`}
              >
                {/* Question row */}
                <button
                  onClick={() => setExpandedIndex(isExpanded ? null : i)}
                  className="w-full flex items-start gap-4 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  {/* Status icon */}
                  <span className="shrink-0 mt-0.5">
                    {isSkipped ? (
                      <MinusCircle size={18} strokeWidth={1.8} className="text-gray-400" />
                    ) : isCorrect ? (
                      <CheckCircle2 size={18} strokeWidth={1.8} className="text-green-500" />
                    ) : (
                      <XCircle size={18} strokeWidth={1.8} className="text-red-500" />
                    )}
                  </span>

                  <span className="flex-1 text-sm font-medium text-[#0f173e] leading-snug">
                    <span className="text-gray-400 mr-2 font-normal">Q{i + 1}.</span>
                    {q.question}
                  </span>

                  {isExpanded ? (
                    <ChevronUp size={16} strokeWidth={2} className="text-gray-400 shrink-0 mt-0.5" />
                  ) : (
                    <ChevronDown size={16} strokeWidth={2} className="text-gray-400 shrink-0 mt-0.5" />
                  )}
                </button>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="border-t border-gray-100 px-5 py-4 flex flex-col gap-3 bg-[#f8f9fc]">
                    {/* Options */}
                    <div className="flex flex-col gap-2">
                      {q.options.map((opt, oi) => {
                        const isSelected = answer?.selectedIndex === oi;
                        const isCorrectOpt = q.correctIndex === oi;
                        let cls =
                          "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm border ";

                        if (isCorrectOpt) {
                          cls += "bg-green-50 border-green-300 text-green-800";
                        } else if (isSelected && !isCorrectOpt) {
                          cls += "bg-red-50 border-red-300 text-red-700";
                        } else {
                          cls += "bg-white border-gray-200 text-gray-500";
                        }

                        return (
                          <div key={oi} className={cls}>
                            {isCorrectOpt ? (
                              <CheckCircle2 size={15} strokeWidth={2} className="text-green-500 shrink-0" />
                            ) : isSelected ? (
                              <XCircle size={15} strokeWidth={2} className="text-red-400 shrink-0" />
                            ) : (
                              <span className="w-4 h-4 shrink-0" />
                            )}
                            {opt}
                            {isCorrectOpt && (
                              <span className="ml-auto text-[10px] font-bold text-green-600 uppercase tracking-wide">
                                Correct
                              </span>
                            )}
                            {isSelected && !isCorrectOpt && (
                              <span className="ml-auto text-[10px] font-bold text-red-500 uppercase tracking-wide">
                                Your answer
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    <div className="flex items-start gap-2.5 bg-white border border-blue-100 rounded-lg px-4 py-3">
                      <Sparkles size={14} strokeWidth={2} className="text-blue-400 mt-0.5 shrink-0" />
                      <p className="text-xs text-gray-600 leading-relaxed">
                        <span className="font-semibold text-blue-600">Explanation: </span>
                        {q.explanation}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Actions ─────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 pb-8">
          <button
            onClick={() => router.push(`/dashboard/student/manage-courses/${courseId}/quiz`)}
            className="flex-1 flex items-center justify-center gap-2 bg-[#0f173e] hover:bg-[#1a2456] text-white font-semibold rounded-xl py-3.5 text-sm transition-all duration-200"
          >
            <RefreshCw size={16} strokeWidth={2} />
            Retake Quiz
          </button>
          <button
            onClick={() => router.push(`/dashboard/student/manage-courses/${courseId}`)}
            className="flex-1 flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-xl py-3.5 text-sm transition-all duration-200"
          >
            <ArrowLeft size={16} strokeWidth={2} />
            Back to Course
          </button>
        </div>
      </div>
  );
}