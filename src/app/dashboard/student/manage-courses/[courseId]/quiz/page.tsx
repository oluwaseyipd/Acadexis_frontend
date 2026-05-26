"use client";
 
import { useParams, useRouter } from "next/navigation";
import { quizData } from "@/util/quizzes";
import {
  Clock,
  BookOpenCheck,
  Target,
  RefreshCw,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
 

export default function QuizPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const router = useRouter();
 
  const quiz = quizData[courseId];

    const INFO_CARDS = [
    {
      icon: BookOpenCheck,
      label: "Questions",
      value: `${quiz.totalQuestions} Questions`,
      sub: "Multiple choice",
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      icon: Clock,
      label: "Time Limit",
      value: `${quiz.timeLimit} Minutes`,
      sub: "Overall timer",
      color: "text-orange-500",
      bg: "bg-orange-50",
    },
    {
      icon: Target,
      label: "Pass Score",
      value: `${quiz.passingScore}%`,
      sub: "Minimum to pass",
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      icon: RefreshCw,
      label: "Attempts",
      value: "Unlimited",
      sub: "Retake anytime",
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
  ];
 
  // if (!quiz) {
  //   return (
  //       <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
  //         <AlertCircle size={40} className="text-red-400" strokeWidth={1.5} />
  //         <p className="text-lg font-semibold text-gray-600">Quiz not found for this course.</p>
  //       </div>
  //   );
  // }
 
  const handleStart = () => {
    router.push(`/dashboard/student/courses/${courseId}/quiz/attempt`);
  };
 

 
    return(
      <div className="mx-auto px-8 py-8 flex flex-col gap-8 font-sans">
      {/* Heading */}
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2 flex-1">
            <h1 className="text-4xl font-bold text-[#0f173e] tracking-tight leading-tight font-geist-sans">
              Quizzes
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed max-w-120">
                Test your knowledge and reinforce your learning with AI-generated quizzes from the course content. 
            </p>
          </div>
        </div>
      </div>

       {/* ── Breadcrumb ─────────────────────────────────────────────────── */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 font-medium tracking-wide uppercase">
          <button
            onClick={() => router.push("/dashboard/student")}
            className="hover:text-green-600 transition-colors"
          >
            Courses
          </button>
          <ChevronRight size={13} strokeWidth={2.5} />
          <button
            onClick={() => router.push(`/dashboard/student/courses/${courseId}`)}
            className="hover:text-green-600 transition-colors capitalize"
          >
            {quiz.title.replace(" Quiz", "")}
          </button>
          <ChevronRight size={13} strokeWidth={2.5} />
          <span className="text-gray-600">Quiz</span>
        </nav>
 
        {/* ── Hero header ────────────────────────────────────────────────── */}
        <div className="relative bg-[#0f173e] rounded-2xl px-8 py-10 overflow-hidden flex flex-col gap-3">
          {/* background glow */}
          <div className="absolute top-0 right-0 w-56 h-56 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
 
          <span className="self-start text-[10px] font-bold tracking-widest text-green-400 bg-green-400/15 border border-green-400/25 px-3 py-1 rounded-full uppercase">
            Knowledge Check
          </span>
          <h1 className="text-3xl font-bold text-white font-serif leading-tight relative z-10">
            {quiz.title}
          </h1>
          <p className="text-sm text-white/60 leading-relaxed max-w-120 relative z-10">
            {quiz.description}
          </p>
        </div>
 
        {/* ── Info cards ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {INFO_CARDS.map(({ icon: Icon, label, value, sub, color, bg }) => (
            <div
              key={label}
              className="bg-white rounded-xl p-4 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col gap-3"
            >
              <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center`}>
                <Icon size={17} strokeWidth={1.8} className={color} />
              </div>
              <div>
                <p className="text-sm font-bold text-[#0f173e] leading-tight">{value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>
 
        {/* ── Rules ──────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 flex flex-col gap-4">
          <h2 className="text-sm font-bold text-[#0f173e] tracking-wide">Before you begin</h2>
          <ul className="flex flex-col gap-3">
            {[
              "You have 15 minutes to complete all 10 questions — the timer starts when you click Start.",
              "Each question is multiple choice with one correct answer.",
              "You can navigate between questions freely using Previous and Next.",
              "Unanswered questions count as incorrect — answer every question.",
              "Your score and a full question-by-question review will appear on the result page.",
              "You may retake this quiz as many times as you like.",
            ].map((rule, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-600 leading-relaxed">
                <CheckCircle2
                  size={16}
                  strokeWidth={2}
                  className="text-green-500 mt-0.5 shrink-0"
                />
                {rule}
              </li>
            ))}
          </ul>
        </div>
 
        {/* ── CTA ────────────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleStart}
            className="w-full flex items-center justify-center gap-2 bg-[#0f173e] hover:bg-[#1a2456] active:scale-[0.99] text-white font-semibold rounded-xl py-4 text-base transition-all duration-200 shadow-sm"
          >
            Start Quiz
            <ChevronRight size={18} strokeWidth={2.5} />
          </button>
          <button
            onClick={() => router.back()}
            className="w-full text-center text-sm text-gray-400 hover:text-gray-600 transition-colors py-2"
          >
            Go back to course
          </button>
        </div>


    </div>
    );
}
