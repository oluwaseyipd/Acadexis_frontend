'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  GraduationCap,
  ShieldCheck,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  BarChart3,
  FileText,
  Check,
  X,
  MapPin,
  ChevronDown,
  Building2,
  Cpu,
  Brain,
  Award,
  AlertCircle,
  Copy,
  CheckCheck
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Interactive Mock Data for Hero Sandbox
// ─────────────────────────────────────────────────────────────────────────────

interface SandboxPrompt {
  id: string;
  topic: string;
  course: string;
  question: string;
  answerText: string;
  citationDoc: string;
  citationPage: string;
  citationCoordinate: string;
  sourceSnippet: string;
}

const sandboxPrompts: SandboxPrompt[] = [
  {
    id: 'thermo',
    topic: 'Thermodynamics',
    course: 'ME204: Engineering Thermodynamics',
    question: 'What is the theoretical maximum efficiency of a Carnot heat engine operating between 600K and 300K?',
    answerText:
      'According to the Carnot efficiency theorem, the maximum theoretical efficiency η_max is determined strictly by the absolute temperatures of the hot and cold reservoirs: η = 1 - (T_cold / T_hot). For T_hot = 600 K and T_cold = 300 K: η = 1 - (300 / 600) = 0.50 (50.0%).',
    citationDoc: 'Lecture_05_Carnot_Cycles.pdf',
    citationPage: 'Page 18, Section 4.2',
    citationCoordinate: 'Bounding Box [X: 142, Y: 380, W: 520, H: 85]',
    sourceSnippet: 'Theorem 4.2 (Carnot Limit): No engine operating between two thermal reservoirs can be more efficient than a reversible Carnot engine operating between the same temperatures. Efficiency is defined as η = 1 - T_L/T_H.'
  },
  {
    id: 'dsa',
    topic: 'Algorithms',
    course: 'CS301: Data Structures & Algorithms',
    question: 'What is the worst-case and average-case time complexity of QuickSelect with median-of-medians?',
    answerText:
      'With the Median-of-Medians pivot selection algorithm, QuickSelect guarantees a worst-case time complexity of O(n) linear time, preventing the O(n²) degradation of standard randomized QuickSelect.',
    citationDoc: 'CS301_Module3_DivideAndConquer.pptx',
    citationPage: 'Slide 32 · Complexity Analysis',
    citationCoordinate: 'Bounding Box [X: 88, Y: 210, W: 610, H: 95]',
    sourceSnippet: 'Slide 32: The recurrence T(n) <= T(n/5) + T(7n/10 + 6) + O(n) resolves by induction to T(n) = O(n) in both average and worst cases, ensuring deterministic linear performance.'
  },
  {
    id: 'bio',
    topic: 'Cell Biology',
    course: 'BIO110: Principles of Molecular Biology',
    question: 'During which phase of meiosis does crossing over (genetic recombination) occur?',
    answerText:
      'Crossing over occurs exclusively during Prophase I of Meiosis, specifically in the Pachytene sub-stage, where homologous non-sister chromatids form chiasmata and exchange genetic segments.',
    citationDoc: 'Syllabus_Bio110_Cell_Division.pdf',
    citationPage: 'Page 44, Paragraph 3',
    citationCoordinate: 'Bounding Box [X: 110, Y: 460, W: 490, H: 75]',
    sourceSnippet: 'Meiotic Prophase I: Synaptonemal complex stabilizes bivalents during Zygotene. Recombination nodules catalyze crossover events during Pachytene at cytologically visible chiasmata.'
  }
];

// Heatmap mock data
const heatmapCourses = [
  {
    code: 'CS301: Data Structures & Algorithms',
    enrolled: 184,
    avgMastery: 78,
    topics: [
      { name: 'Red-Black Tree Rotations', queries: 94, pct: 88, confusionLevel: 'High', status: 'Needs Review' },
      { name: 'Amortized Complexity Analysis', queries: 82, pct: 76, confusionLevel: 'High', status: 'Needs Review' },
      { name: 'Dijkstra Shortest Path', queries: 41, pct: 42, confusionLevel: 'Medium', status: 'Moderate' },
      { name: 'Array vs Linked List', queries: 12, pct: 15, confusionLevel: 'Low', status: 'Mastered' }
    ]
  },
  {
    code: 'ME204: Engineering Thermodynamics',
    enrolled: 142,
    avgMastery: 72,
    topics: [
      { name: 'Entropy Generation in Open Systems', queries: 112, pct: 92, confusionLevel: 'High', status: 'Needs Review' },
      { name: 'Rankine Cycle Reheat Calculations', queries: 68, pct: 64, confusionLevel: 'Medium', status: 'Moderate' },
      { name: 'Ideal Gas Law Applications', queries: 15, pct: 18, confusionLevel: 'Low', status: 'Mastered' }
    ]
  },
  {
    code: 'BIO110: Principles of Molecular Biology',
    enrolled: 230,
    avgMastery: 85,
    topics: [
      { name: 'Operon Regulation (Lac & Trp)', queries: 128, pct: 95, confusionLevel: 'High', status: 'Needs Review' },
      { name: 'DNA Polymerase Proofreading', queries: 53, pct: 50, confusionLevel: 'Medium', status: 'Moderate' },
      { name: 'Ribosome Assembly Structure', queries: 20, pct: 22, confusionLevel: 'Low', status: 'Mastered' }
    ]
  }
];

// Quiz sample data
const sampleQuizQuestions = [
  {
    question: 'Why does Acadexis use coordinate-level bounding box citations instead of standard generic link citations?',
    options: [
      'To verify claims against exact page paragraphs and eliminate AI hallucinations.',
      'To shorten the length of generated responses.',
      'To replace the need for course instructors.',
      'To prevent students from reading the original course syllabus.'
    ],
    correct: 0,
    explanation:
      'Coordinate citations anchor every single fact to exact physical coordinates inside uploaded university courseware, providing verifiable proof for academic integrity.'
  }
];

export default function HomePage() {
  // Sandbox state
  const [activeTab, setActiveTab] = useState<'study' | 'heatmap' | 'quiz'>('study');
  const [selectedPrompt, setSelectedPrompt] = useState<SandboxPrompt>(sandboxPrompts[0]);
  const [showCoordinateHighlight, setShowCoordinateHighlight] = useState<boolean>(true);
  const [copiedCitation, setCopiedCitation] = useState<boolean>(false);

  // Heatmap state
  const [selectedCourseIdx, setSelectedCourseIdx] = useState<number>(0);

  // Interactive Quiz state
  const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Role Switcher state
  const [activeRole, setActiveRole] = useState<'students' | 'lecturers' | 'admins'>('students');

  // FAQ open states
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const handleCopyCitation = () => {
    navigator.clipboard?.writeText(
      `${selectedPrompt.citationDoc} (${selectedPrompt.citationPage}) - ${selectedPrompt.citationCoordinate}`
    );
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-[#83FBA5] selection:text-[#002147]">
      {/* ── Top Announcement Banner ────────────────────────────────────────── */}
      <div className="bg-[#001733] text-slate-200 text-xs sm:text-sm py-2.5 px-4 border-b border-[#002855]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-[#83FBA5] text-[#002147] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
              New
            </span>
            <span className="text-xs sm:text-sm">
              <strong>Zero-Hallucination v2.4:</strong> Deterministic coordinate citations for PDF, PPTX, and DOCX courseware.
            </span>
          </div>
          <Link
            href="/auth/register"
            className="hidden sm:inline-flex items-center gap-1 text-[#83FBA5] hover:text-white font-semibold transition-colors"
          >
            <span>Request Institutional Pilot</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <Navbar />

      {/* ── Hero Section (Solid Navy SaaS Banner) ─────────────────────────── */}
      <section className="bg-[#002147] text-white pt-14 pb-18 sm:pt-20 sm:pb-28 px-4 sm:px-6 lg:px-8 border-b border-[#003366]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Hero Column */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="lg:col-span-6 space-y-6"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-[#001733] border border-[#003366] text-[#83FBA5] text-xs font-semibold px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-[#83FBA5]"></span>
                <span>The Academic Grounding Platform</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12]">
                AI you can <span className="text-[#83FBA5]">trust</span>. Education you can <span className="text-[#83FBA5]">verify</span>.
              </h1>

              {/* Subheadline */}
              <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
                The institutional AI platform strictly grounded in official university lecture slides, syllabi, and textbooks. Eliminate hallucinations with line-level coordinate citations and real-time student struggle analytics.
              </p>

              {/* Dual CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <motion.div whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/auth/register"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#83FBA5] hover:bg-[#6ee791] text-[#002147] font-bold rounded-lg transition-colors text-base shadow-sm"
                  >
                    <span>Start Free with University Email</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
                <motion.div whileTap={{ scale: 0.98 }}>
                  <a
                    href="#platform-sandbox"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#001733] hover:bg-[#0a2f5c] text-white border border-slate-600 font-semibold rounded-lg transition-colors text-base"
                  >
                    <span>Explore Live Sandbox</span>
                    <ChevronDown className="w-4 h-4 text-[#83FBA5]" />
                  </a>
                </motion.div>
              </div>

              {/* Trust checklist */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-6 border-t border-[#003366] text-xs sm:text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#83FBA5] flex-shrink-0" />
                  <span>Verified .edu SSO</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#83FBA5] flex-shrink-0" />
                  <span>0% Hallucination Guard</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#83FBA5] flex-shrink-0" />
                  <span>Exact PDF Coordinates</span>
                </div>
              </div>
            </motion.div>

            {/* Right Hero Column: Interactive Sandbox Container */}
            <motion.div
              id="platform-sandbox"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, delay: 0.15, ease: 'easeOut' }}
              className="lg:col-span-6 w-full"
            >
              <div className="bg-[#001733] border-2 border-[#003366] rounded-2xl overflow-hidden shadow-2xl">
                
                {/* Sandbox Header / Tab Switcher */}
                <div className="bg-[#000f24] px-4 py-3 border-b border-[#002855] flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
                    <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
                    <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
                    <span className="ml-2 text-xs font-mono text-slate-400">acadexis-sandbox.edu</span>
                  </div>

                  {/* Tab Selector with Framer Motion layoutId */}
                  <div className="flex items-center bg-[#002147] p-1 rounded-lg border border-[#003366] relative">
                    {(['study', 'heatmap', 'quiz'] as const).map((tab) => {
                      const isActive = activeTab === tab;
                      const label =
                        tab === 'study' ? 'AI Study Lab' : tab === 'heatmap' ? 'Struggle Heatmap' : 'Verified Quiz';
                      return (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`relative px-3 py-1.5 text-xs font-medium rounded-md transition-colors z-10 ${
                            isActive ? 'text-[#002147] font-bold' : 'text-slate-300 hover:text-white'
                          }`}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="sandboxActiveTab"
                              className="absolute inset-0 bg-[#83FBA5] rounded-md -z-10"
                              transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                            />
                          )}
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Tab 1: AI Study Lab Demo */}
                <AnimatePresence mode="wait">
                  {activeTab === 'study' && (
                    <motion.div
                      key="tab-study"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="p-4 sm:p-5 space-y-4 text-slate-200"
                    >
                      {/* Topic Pill Selector */}
                      <div>
                        <div className="text-xs text-slate-400 font-semibold mb-2 uppercase tracking-wider">
                          Select a sample course query:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {sandboxPrompts.map((p) => {
                            const isSelected = selectedPrompt.id === p.id;
                            return (
                              <button
                                key={p.id}
                                onClick={() => setSelectedPrompt(p)}
                                className={`px-2.5 py-1.5 text-xs rounded-md border text-left transition-all ${
                                  isSelected
                                    ? 'bg-[#002147] border-[#83FBA5] text-[#83FBA5] font-semibold ring-1 ring-[#83FBA5]/40'
                                    : 'bg-[#001f44] border-[#003366] text-slate-300 hover:border-slate-500'
                                }`}
                              >
                                {p.topic}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Chat Bubble: Question */}
                      <div className="bg-[#002147] p-3.5 rounded-xl border border-[#003366] text-xs sm:text-sm">
                        <div className="flex items-center gap-2 mb-1.5 text-[#83FBA5] text-xs font-semibold">
                          <GraduationCap className="w-4 h-4" />
                          <span>Student Query • {selectedPrompt.course}</span>
                        </div>
                        <p className="text-white font-medium">{selectedPrompt.question}</p>
                      </div>

                      {/* Chat Bubble: Grounded AI Response */}
                      <div className="bg-[#0a2342] p-4 rounded-xl border border-[#1b3d6c] space-y-3 text-xs sm:text-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-[#83FBA5] text-xs font-bold">
                            <Sparkles className="w-4 h-4 text-[#83FBA5]" />
                            <span>Acadexis Verified Tutor</span>
                          </div>
                          <span className="bg-[#001733] text-[#83FBA5] border border-[#83FBA5]/40 text-[10px] px-2 py-0.5 rounded font-mono">
                            100% Grounded
                          </span>
                        </div>

                        <p className="text-slate-200 leading-relaxed">{selectedPrompt.answerText}</p>

                        {/* Clickable Citation Highlight Badge */}
                        <div className="pt-2 border-t border-[#1b3d6c] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setShowCoordinateHighlight(!showCoordinateHighlight)}
                            className="inline-flex items-center gap-1.5 bg-[#001733] hover:bg-[#002855] text-[#83FBA5] border border-[#83FBA5]/50 px-3 py-1.5 rounded text-xs font-mono transition-colors text-left"
                          >
                            <MapPin className="w-3.5 h-3.5 text-[#83FBA5] flex-shrink-0" />
                            <span>{selectedPrompt.citationDoc} • {selectedPrompt.citationPage}</span>
                          </motion.button>
                          <span className="text-[11px] text-slate-400">Click citation to inspect coordinate</span>
                        </div>
                      </div>

                      {/* Source Document Coordinate Highlight Simulation */}
                      {showCoordinateHighlight && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.25 }}
                          className="bg-[#000f24] p-3 rounded-lg border-2 border-[#83FBA5]/70 text-xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between text-[11px] text-slate-400">
                            <span className="font-mono text-[#83FBA5] font-semibold">📍 {selectedPrompt.citationCoordinate}</span>
                            <button
                              onClick={handleCopyCitation}
                              className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                            >
                              {copiedCitation ? (
                                <>
                                  <CheckCheck className="w-3 h-3 text-[#83FBA5]" />
                                  <span className="text-[#83FBA5]">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                          <div className="bg-[#002147] p-2.5 rounded border border-[#83FBA5]/40 text-slate-300 font-mono text-[11px] leading-snug">
                            <span className="text-white font-semibold">Exact Source Excerpt: </span>
                            &ldquo;{selectedPrompt.sourceSnippet}&rdquo;
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}

                  {/* Tab 2: Lecturer Struggle Heatmap Demo */}
                  {activeTab === 'heatmap' && (
                    <motion.div
                      key="tab-heatmap"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="p-4 sm:p-5 space-y-4 text-slate-200"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="text-xs text-slate-400 uppercase font-semibold">Faculty Dashboard</div>
                          <div className="text-sm font-bold text-white">Student Struggle Diagnostic Heatmap</div>
                        </div>
                        <select
                          value={selectedCourseIdx}
                          onChange={(e) => setSelectedCourseIdx(Number(e.target.value))}
                          className="bg-[#002147] border border-[#003366] text-xs text-slate-200 px-3 py-1.5 rounded-md outline-none"
                        >
                          {heatmapCourses.map((c, i) => (
                            <option key={c.code} value={i}>
                              {c.code}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Metrics Row */}
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-[#002147] p-2.5 rounded-lg border border-[#003366]">
                          <div className="text-lg font-bold text-white">{heatmapCourses[selectedCourseIdx].enrolled}</div>
                          <div className="text-[10px] text-slate-400">Enrolled Students</div>
                        </div>
                        <div className="bg-[#002147] p-2.5 rounded-lg border border-[#003366]">
                          <div className="text-lg font-bold text-[#83FBA5]">
                            {heatmapCourses[selectedCourseIdx].avgMastery}%
                          </div>
                          <div className="text-[10px] text-slate-400">Cohort Mastery</div>
                        </div>
                        <div className="bg-[#002147] p-2.5 rounded-lg border border-[#003366]">
                          <div className="text-lg font-bold text-amber-400">
                            {heatmapCourses[selectedCourseIdx].topics.filter((t) => t.confusionLevel === 'High').length}
                          </div>
                          <div className="text-[10px] text-slate-400">Struggle Alerts</div>
                        </div>
                      </div>

                      {/* Animated Confusion Topic Breakdown List */}
                      <div className="space-y-2.5">
                        <div className="text-xs font-semibold text-slate-300">Confusing Concepts (Query Velocity):</div>
                        {heatmapCourses[selectedCourseIdx].topics.map((t, idx) => (
                          <div
                            key={t.name + idx}
                            className="bg-[#002147] p-3 rounded-lg border border-[#003366] space-y-1.5 text-xs"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-white font-medium">{t.name}</span>
                                <span className="text-slate-400 text-[11px] ml-2">({t.queries} queries)</span>
                              </div>
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  t.confusionLevel === 'High'
                                    ? 'bg-red-900/60 text-red-200 border border-red-500/40'
                                    : t.confusionLevel === 'Medium'
                                    ? 'bg-amber-900/60 text-amber-200 border border-amber-500/40'
                                    : 'bg-green-900/60 text-green-200 border border-green-500/40'
                                }`}
                              >
                                {t.status}
                              </span>
                            </div>

                            {/* Animated Query Velocity Bar */}
                            <div className="w-full bg-[#000f24] h-2 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${t.pct}%` }}
                                transition={{ duration: 0.5, ease: 'easeOut', delay: idx * 0.08 }}
                                className={`h-full rounded-full ${
                                  t.confusionLevel === 'High'
                                    ? 'bg-red-500'
                                    : t.confusionLevel === 'Medium'
                                    ? 'bg-amber-400'
                                    : 'bg-[#83FBA5]'
                                }`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="bg-[#000f24] p-3 rounded-lg border border-[#003366] text-xs text-[#83FBA5] flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>Actionable: Spend 10 minutes reviewing flagged concepts in next lecture.</span>
                      </div>
                    </motion.div>
                  )}

                  {/* Tab 3: Verified Quiz Generator Demo */}
                  {activeTab === 'quiz' && (
                    <motion.div
                      key="tab-quiz"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="p-4 sm:p-5 space-y-4 text-slate-200"
                    >
                      <div className="flex items-center justify-between border-b border-[#003366] pb-2">
                        <div>
                          <div className="text-xs text-slate-400 font-semibold uppercase">Instant Course Quiz</div>
                          <div className="text-sm font-bold text-white">Syllabus-Derived Comprehension Check</div>
                        </div>
                        <span className="bg-[#002147] text-[#83FBA5] text-[10px] px-2 py-1 rounded font-mono border border-[#003366]">
                          Question 1 of 1
                        </span>
                      </div>

                      <p className="text-sm font-medium text-white leading-relaxed">
                        {sampleQuizQuestions[0].question}
                      </p>

                      <div className="space-y-2">
                        {sampleQuizQuestions[0].options.map((opt, oIdx) => {
                          const isSelected = quizSelectedOption === oIdx;
                          const isCorrect = sampleQuizQuestions[0].correct === oIdx;
                          let optStyle = 'bg-[#002147] border-[#003366] text-slate-200 hover:border-slate-400';

                          if (quizSubmitted) {
                            if (isCorrect) {
                              optStyle = 'bg-green-900/50 border-green-500 text-green-200';
                            } else if (isSelected && !isCorrect) {
                              optStyle = 'bg-red-900/50 border-red-500 text-red-200';
                            }
                          } else if (isSelected) {
                            optStyle = 'bg-[#003366] border-[#83FBA5] text-white';
                          }

                          return (
                            <button
                              key={oIdx}
                              onClick={() => {
                                if (!quizSubmitted) setQuizSelectedOption(oIdx);
                              }}
                              className={`w-full p-3 rounded-lg border text-left text-xs sm:text-sm transition-colors flex items-center justify-between ${optStyle}`}
                            >
                              <span>{opt}</span>
                              {quizSubmitted && isCorrect && <Check className="w-4 h-4 text-green-400 ml-2 flex-shrink-0" />}
                              {quizSubmitted && isSelected && !isCorrect && (
                                <X className="w-4 h-4 text-red-400 ml-2 flex-shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {!quizSubmitted ? (
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          disabled={quizSelectedOption === null}
                          onClick={() => setQuizSubmitted(true)}
                          className="w-full py-2.5 bg-[#83FBA5] disabled:opacity-50 text-[#002147] font-bold rounded-lg text-xs transition-colors"
                        >
                          Submit Verification
                        </motion.button>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-[#000f24] p-3 rounded-lg border border-[#003366] text-xs space-y-1.5"
                        >
                          <div className="text-green-400 font-bold">✓ Explanation & Source Verification:</div>
                          <p className="text-slate-300">{sampleQuizQuestions[0].explanation}</p>
                          <button
                            onClick={() => {
                              setQuizSubmitted(false);
                              setQuizSelectedOption(null);
                            }}
                            className="mt-2 text-[#83FBA5] hover:underline text-[11px] font-semibold"
                          >
                            Reset Quiz
                          </button>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── Institutional Proof & Academic Partners Bar ────────────────────── */}
      <section className="bg-white py-12 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-500 mb-8">
            ANCHORING RIGOROUS ACADEMIC VERIFICATION ACROSS DISCIPLINES
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6 items-center text-center">
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center"
            >
              <Cpu className="w-6 h-6 text-[#002147] mb-1.5" />
              <span className="text-xs font-bold text-slate-800">Faculty of Engineering</span>
              <span className="text-[10px] text-slate-500">Distributed & Mechanical</span>
            </motion.div>
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center"
            >
              <Brain className="w-6 h-6 text-[#002147] mb-1.5" />
              <span className="text-xs font-bold text-slate-800">School of Computing</span>
              <span className="text-[10px] text-slate-500">Algorithms & AI Labs</span>
            </motion.div>
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center"
            >
              <BookOpen className="w-6 h-6 text-[#002147] mb-1.5" />
              <span className="text-xs font-bold text-slate-800">College of Health Sciences</span>
              <span className="text-[10px] text-slate-500">Biomedical & Genetics</span>
            </motion.div>
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center"
            >
              <Building2 className="w-6 h-6 text-[#002147] mb-1.5" />
              <span className="text-xs font-bold text-slate-800">Department of Economics</span>
              <span className="text-[10px] text-slate-500">Econometrics & Policy</span>
            </motion.div>
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center col-span-2 md:col-span-1"
            >
              <Award className="w-6 h-6 text-[#002147] mb-1.5" />
              <span className="text-xs font-bold text-slate-800">University Research Desk</span>
              <span className="text-[10px] text-slate-500">Peer-Reviewed Grounding</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Problem vs Solution (Why Generic AI Fails in Academia) ─────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center max-w-3xl mx-auto space-y-4"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-green-700 bg-green-100 px-3 py-1 rounded-full border border-green-200">
              Beyond the Black Box
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#002147] tracking-tight">
              Generic AI hallucinates. Acadexis proves every word.
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Standard consumer LLMs invent plausible citations and hallucinate non-existent formulas. Acadexis solves this with a strict boundary engine that confines all inference to verified course files.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Generic AI Card */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-red-200 space-y-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-red-600 font-bold text-lg">
                  <X className="w-6 h-6 p-1 bg-red-100 rounded-full" />
                  <span>Generic Consumer AI</span>
                </div>
                <span className="text-xs font-semibold text-red-700 bg-red-50 px-2.5 py-1 rounded border border-red-200">
                  Unverified
                </span>
              </div>

              <div className="space-y-4 text-sm text-slate-700">
                <div className="p-3.5 rounded-lg bg-red-50/60 border border-red-100">
                  <p className="text-xs font-mono text-red-800 font-bold mb-1">Hallucinated References</p>
                  <p className="text-slate-600 text-xs">
                    Generates fake research authors, imaginary paper URLs, and fabricated textbook page numbers that fail academic review.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-red-50/60 border border-red-100">
                  <p className="text-xs font-mono text-red-800 font-bold mb-1">No Syllabus Boundary</p>
                  <p className="text-slate-600 text-xs">
                    Answers from unvetted Internet forum sources that conflict with your professor&apos;s specific notation and grading rubric.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-red-50/60 border border-red-100">
                  <p className="text-xs font-mono text-red-800 font-bold mb-1">Blind to Faculty</p>
                  <p className="text-slate-600 text-xs">
                    Lecturers have zero visibility into what concepts their students find difficult before midterm exams.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Acadexis Verified Engine Card */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="bg-[#002147] text-white p-6 sm:p-8 rounded-2xl border-2 border-[#83FBA5] space-y-6 shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#83FBA5] font-bold text-lg">
                  <Check className="w-6 h-6 p-1 bg-green-800 text-[#83FBA5] rounded-full" />
                  <span>Acadexis Institutional Engine</span>
                </div>
                <span className="text-xs font-semibold text-[#002147] bg-[#83FBA5] px-2.5 py-1 rounded font-bold">
                  Verified Truth
                </span>
              </div>

              <div className="space-y-4 text-sm text-slate-200">
                <div className="p-3.5 rounded-lg bg-[#001733] border border-[#003366]">
                  <p className="text-xs font-mono text-[#83FBA5] font-bold mb-1">Coordinate-Level Citations</p>
                  <p className="text-slate-300 text-xs">
                    Every answer is mathematically anchored to bounding box coordinates on the exact slide, page, and paragraph uploaded by faculty.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-[#001733] border border-[#003366]">
                  <p className="text-xs font-mono text-[#83FBA5] font-bold mb-1">Strict Syllabus Confinement</p>
                  <p className="text-slate-300 text-xs">
                    If an answer isn&apos;t in your official course materials, the engine explicitly responds &ldquo;Not found in syllabus&rdquo; instead of guessing.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-[#001733] border border-[#003366]">
                  <p className="text-xs font-mono text-[#83FBA5] font-bold mb-1">Lecturer Struggle Heatmaps</p>
                  <p className="text-slate-300 text-xs">
                    Aggregates anonymous question frequency into actionable pedagogical heatmaps, allowing professors to address misconceptions early.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 4 Core Pillars Feature Grid ────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-b border-slate-200">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center max-w-3xl mx-auto space-y-4"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-[#002147] tracking-tight">
              Engineered for the Full Rigor of Higher Education
            </h2>
            <p className="text-base text-slate-600">
              Modern SaaS architecture built specifically for university departments, research groups, and students.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: 0.05 }}
              whileHover={{ y: -4 }}
              className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col justify-between space-y-4 hover:border-slate-400 transition-colors"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-lg bg-[#002147] text-[#83FBA5] flex items-center justify-center font-bold">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Coordinate Citations</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Every AI assertion highlights the exact line, diagram, or formula in the source PDF or slide deck.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-200 text-xs font-semibold text-green-700">
                0% Unverified Output →
              </div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col justify-between space-y-4 hover:border-slate-400 transition-colors"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-lg bg-[#002147] text-[#83FBA5] flex items-center justify-center font-bold">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Hallucination Guard</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Deterministic grounding blocks speculative answers. If it is not in the courseware, Acadexis says so.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-200 text-xs font-semibold text-green-700">
                Integrity Compliant →
              </div>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: 0.15 }}
              whileHover={{ y: -4 }}
              className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col justify-between space-y-4 hover:border-slate-400 transition-colors"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-lg bg-[#002147] text-[#83FBA5] flex items-center justify-center font-bold">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Struggle Heatmaps</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Real-time analytics for professors to see which lecture slides generate the highest confusion.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-200 text-xs font-semibold text-green-700">
                Pedagogical Diagnostics →
              </div>
            </motion.div>

            {/* Feature 4 */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: 0.2 }}
              whileHover={{ y: -4 }}
              className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col justify-between space-y-4 hover:border-slate-400 transition-colors"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-lg bg-[#002147] text-[#83FBA5] flex items-center justify-center font-bold">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Instant Ingestion</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Drag and drop 500-page textbooks, PPTX slides, and DOCX notes with automatic semantic indexing.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-200 text-xs font-semibold text-green-700">
                Multi-Modal Parsing →
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── Interactive Role Deep-Dive (Students vs Lecturers vs Admins) ───── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="flex flex-col items-center text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#002147] bg-slate-200 px-3 py-1 rounded-full">
              Tailored Workspaces
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#002147] tracking-tight">
              Designed for the Entire Academy
            </h2>
            <p className="text-base text-slate-600 max-w-2xl">
              Whether you are preparing for final exams or directing an entire academic faculty, Acadexis adapts to your exact workflow.
            </p>

            {/* Role Toggle Tabs with Framer Motion layoutId */}
            <div className="flex items-center bg-white p-1 rounded-xl border border-slate-300 shadow-sm mt-4 relative">
              {(['students', 'lecturers', 'admins'] as const).map((role) => {
                const isActive = activeRole === role;
                const label =
                  role === 'students'
                    ? 'For Students'
                    : role === 'lecturers'
                    ? 'For Lecturers & Faculty'
                    : 'For Institutions';
                return (
                  <button
                    key={role}
                    onClick={() => setActiveRole(role)}
                    className={`relative px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors z-10 ${
                      isActive ? 'text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeRoleIndicator"
                        className="absolute inset-0 bg-[#002147] rounded-lg -z-10 shadow-sm"
                        transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                      />
                    )}
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Role Content Card: Student View */}
          <AnimatePresence mode="wait">
            {activeRole === 'students' && (
              <motion.div
                key="role-students"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 lg:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                <div className="lg:col-span-6 space-y-6">
                  <div className="inline-flex items-center gap-2 text-xs font-bold uppercase text-green-700 bg-green-50 px-3 py-1 rounded border border-green-200">
                    <GraduationCap className="w-4 h-4" />
                    <span>Student Study Lab</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#002147]">
                    Study with absolute certainty. Never guess a citation again.
                  </h3>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                    Stop losing marks on AI hallucinated sources. Ask complex questions against your course slides, get step-by-step explanations, and click citations to view the exact lecture slide paragraph.
                  </p>
                  <div className="space-y-3 text-sm text-slate-700">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span><strong>Instant PDF Annotation:</strong> Jump to exact line numbers in lecture slides with one click.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span><strong>Automated Flashcards & Quizzes:</strong> Test yourself on questions extracted directly from exam slides.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span><strong>Academic Integrity Guard:</strong> Complies with university citation and honor code standards.</span>
                    </div>
                  </div>
                  <div className="pt-4">
                    <motion.div whileTap={{ scale: 0.98 }}>
                      <Link
                        href="/auth/register"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#002147] hover:bg-[#0a2f5c] text-white font-semibold rounded-lg text-sm transition-colors"
                      >
                        <span>Create Student Account</span>
                        <ArrowRight className="w-4 h-4 text-[#83FBA5]" />
                      </Link>
                    </motion.div>
                  </div>
                </div>

                <div className="lg:col-span-6 relative h-[280px] sm:h-[360px] rounded-xl overflow-hidden border border-slate-200">
                  <Image
                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80"
                    alt="University students collaborating in library with laptops"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-4 left-4 right-4 bg-[#002147]/95 border border-white/20 p-4 rounded-xl text-white text-xs backdrop-blur-sm">
                    <div className="font-bold text-[#83FBA5] mb-1">Student Verification Lab</div>
                    <p className="text-slate-300">&ldquo;I cut my exam revision time in half because every definition is linked directly to slide coordinates.&rdquo;</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Role Content Card: Lecturer View */}
            {activeRole === 'lecturers' && (
              <motion.div
                key="role-lecturers"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 lg:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                <div className="lg:col-span-6 space-y-6">
                  <div className="inline-flex items-center gap-2 text-xs font-bold uppercase text-green-700 bg-green-50 px-3 py-1 rounded border border-green-200">
                    <BarChart3 className="w-4 h-4" />
                    <span>Faculty & Lecturer Portal</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#002147]">
                    Know what students don&apos;t understand before midterms.
                  </h3>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                    Upload your syllabus and slide decks once. Acadexis indexes them for your enrolled cohort and provides anonymous query heatmaps showing exactly which slides cause confusion.
                  </p>
                  <div className="space-y-3 text-sm text-slate-700">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span><strong>Student Struggle Heatmaps:</strong> Identify confusing concepts 48 hours before exams.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span><strong>Automated Exam Question Drafting:</strong> Generate verified multiple choice and short answer tests.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span><strong>Course Material Protection:</strong> Proprietary slides stay strictly within your institutional domain.</span>
                    </div>
                  </div>
                  <div className="pt-4">
                    <motion.div whileTap={{ scale: 0.98 }}>
                      <Link
                        href="/auth/register"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#002147] hover:bg-[#0a2f5c] text-white font-semibold rounded-lg text-sm transition-colors"
                      >
                        <span>Request Lecturer Access</span>
                        <ArrowRight className="w-4 h-4 text-[#83FBA5]" />
                      </Link>
                    </motion.div>
                  </div>
                </div>

                <div className="lg:col-span-6 relative h-[280px] sm:h-[360px] rounded-xl overflow-hidden border border-slate-200">
                  <Image
                    src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80"
                    alt="Professor presenting lecture slides in modern university amphitheater"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-4 left-4 right-4 bg-[#002147]/95 border border-white/20 p-4 rounded-xl text-white text-xs backdrop-blur-sm">
                    <div className="font-bold text-[#83FBA5] mb-1">Faculty Analytics Hub</div>
                    <p className="text-slate-300">&ldquo;Instead of guessing what students struggled with, I check my heatmap and tailor each review session with precision.&rdquo;</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Role Content Card: Institutional Admin View */}
            {activeRole === 'admins' && (
              <motion.div
                key="role-admins"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 lg:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                <div className="lg:col-span-6 space-y-6">
                  <div className="inline-flex items-center gap-2 text-xs font-bold uppercase text-green-700 bg-green-50 px-3 py-1 rounded border border-green-200">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Enterprise & Governance</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#002147]">
                    Institutional governance, FERPA compliance, and domain SSO.
                  </h3>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                    Provide safe, sanctioned AI tools across your entire university campus. Enforce strict academic integrity policies with comprehensive audit trails and institutional SSO integration.
                  </p>
                  <div className="space-y-3 text-sm text-slate-700">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span><strong>Academic Domain SSO:</strong> Restrict access automatically to verified .edu / .ac.uk accounts.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span><strong>Zero Data Leakage:</strong> University courseware is never used to train public commercial models.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span><strong>Integrity Audit Logs:</strong> Transparent verification logs for academic boards and department chairs.</span>
                    </div>
                  </div>
                  <div className="pt-4">
                    <motion.div whileTap={{ scale: 0.98 }}>
                      <Link
                        href="/trust"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#002147] hover:bg-[#0a2f5c] text-white font-semibold rounded-lg text-sm transition-colors"
                      >
                        <span>Read Institutional Trust Whitepaper</span>
                        <ArrowRight className="w-4 h-4 text-[#83FBA5]" />
                      </Link>
                    </motion.div>
                  </div>
                </div>

                <div className="lg:col-span-6 relative h-[280px] sm:h-[360px] rounded-xl overflow-hidden border border-slate-200">
                  <Image
                    src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80"
                    alt="University campus architecture"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-4 left-4 right-4 bg-[#002147]/95 border border-white/20 p-4 rounded-xl text-white text-xs backdrop-blur-sm">
                    <div className="font-bold text-[#83FBA5] mb-1">Campus-Wide Infrastructure</div>
                    <p className="text-slate-300">&ldquo;Ensuring compliant AI adoption that upholds the academic standards of our faculty.&rdquo;</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </section>

      {/* ── 3-Step Grounding Pipeline (How It Works) ───────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-b border-slate-200">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center max-w-3xl mx-auto space-y-4"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-[#002147] bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              The Verification Pipeline
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#002147] tracking-tight">
              How Courseware Turns into Verified Grounding
            </h2>
            <p className="text-base text-slate-600">
              A 3-step deterministic pipeline that bridges university materials with verified AI intelligence.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            
            {/* Step 1 */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-4"
            >
              <div className="w-10 h-10 rounded-xl bg-[#002147] text-[#83FBA5] font-bold text-sm flex items-center justify-center">
                01
              </div>
              <h3 className="text-xl font-bold text-slate-900">Upload Courseware</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Faculty or students upload course syllabi, lecture slides (PPTX), PDFs, and reading lists to their secure workspace.
              </p>
              <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs font-mono text-slate-600">
                Supported: .pdf, .pptx, .docx
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: 0.12 }}
              className="bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-4"
            >
              <div className="w-10 h-10 rounded-xl bg-[#002147] text-[#83FBA5] font-bold text-sm flex items-center justify-center">
                02
              </div>
              <h3 className="text-xl font-bold text-slate-900">Coordinate Indexing</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Our engine parses text, formulas, and diagrams, creating a deterministic coordinate map for every paragraph and slide.
              </p>
              <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs font-mono text-slate-600">
                Bounding Box Coordinate Extraction
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: 0.18 }}
              className="bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-4"
            >
              <div className="w-10 h-10 rounded-xl bg-[#002147] text-[#83FBA5] font-bold text-sm flex items-center justify-center">
                03
              </div>
              <h3 className="text-xl font-bold text-slate-900">Study & Analytics</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Students ask questions and get citation-backed answers; lecturers receive aggregated heatmaps of student struggle topics.
              </p>
              <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs font-mono text-slate-600">
                Verified Tutoring + Real-Time Heatmaps
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── Key Impact Metrics Grid ────────────────────────────────────────── */}
      <section className="bg-[#002147] text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-[#003366]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 text-center">
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
              className="space-y-2 p-4 rounded-xl bg-[#001733] border border-[#003366]"
            >
              <div className="text-3xl sm:text-5xl font-extrabold text-[#83FBA5]">99.8%</div>
              <div className="text-xs sm:text-sm font-semibold text-white">Citation Precision</div>
              <p className="text-[11px] sm:text-xs text-slate-400">Verified against line coordinates</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.08 }}
              className="space-y-2 p-4 rounded-xl bg-[#001733] border border-[#003366]"
            >
              <div className="text-3xl sm:text-5xl font-extrabold text-[#83FBA5]">0%</div>
              <div className="text-xs sm:text-sm font-semibold text-white">Speculative Hallucinations</div>
              <p className="text-[11px] sm:text-xs text-slate-400">Strict syllabus boundary guard</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.16 }}
              className="space-y-2 p-4 rounded-xl bg-[#001733] border border-[#003366]"
            >
              <div className="text-3xl sm:text-5xl font-extrabold text-[#83FBA5]">4.2 hrs</div>
              <div className="text-xs sm:text-sm font-semibold text-white">Saved Per Student / Wk</div>
              <p className="text-[11px] sm:text-xs text-slate-400">Rapid source and formula lookup</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.24 }}
              className="space-y-2 p-4 rounded-xl bg-[#001733] border border-[#003366]"
            >
              <div className="text-3xl sm:text-5xl font-extrabold text-[#83FBA5]">68%</div>
              <div className="text-xs sm:text-sm font-semibold text-white">Faster Gap Identification</div>
              <p className="text-[11px] sm:text-xs text-slate-400">For lecturers before midterm exams</p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── Academic Testimonials ──────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center max-w-2xl mx-auto space-y-3"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-green-700 bg-green-100 px-3 py-1 rounded-full border border-green-200">
              Peer Endorsements
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#002147] tracking-tight">
              Trusted by Faculty and Students
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              See what professors and scholars say about the transition from black-box AI to coordinate-grounded study.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            
            {/* Review 1 */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35 }}
              whileHover={{ y: -4 }}
              className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm flex flex-col justify-between"
            >
              <p className="text-slate-700 text-sm leading-relaxed italic">
                &ldquo;Before Acadexis, students would turn in assignments with plausible-looking AI citations that were completely fictitious. Now, every single answer cites slide numbers from my actual lectures.&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full relative overflow-hidden bg-slate-200 flex-shrink-0">
                  <Image
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80"
                    alt="Prof. Dr. David Alistair"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">Dr. David Alistair</div>
                  <div className="text-xs text-slate-500">Associate Professor of Computer Science</div>
                </div>
              </div>
            </motion.div>

            {/* Review 2 */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm flex flex-col justify-between"
            >
              <p className="text-slate-700 text-sm leading-relaxed italic">
                &ldquo;The struggle heatmap is a game-changer. I saw that 40% of my class was querying the Carnot cycle proof, so I dedicated the first 15 minutes of Monday&apos;s lecture to it. Exam scores jumped 18%.&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full relative overflow-hidden bg-slate-200 flex-shrink-0">
                  <Image
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=80"
                    alt="Dr. Sarah Jenkins"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">Dr. Sarah Jenkins</div>
                  <div className="text-xs text-slate-500">Department of Mechanical Engineering</div>
                </div>
              </div>
            </motion.div>

            {/* Review 3 */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: 0.2 }}
              whileHover={{ y: -4 }}
              className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm flex flex-col justify-between"
            >
              <p className="text-slate-700 text-sm leading-relaxed italic">
                &ldquo;As a biomedical student, precise details matter. Being able to click a citation in the chat and have Acadexis highlight the exact paragraph in my microbiology textbook is incredible.&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full relative overflow-hidden bg-slate-200 flex-shrink-0">
                  <Image
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80"
                    alt="James O'Connor"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">James O&apos;Connor</div>
                  <div className="text-xs text-slate-500">Honors Biomedical Student</div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── Interactive Institutional FAQ Accordion ────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#002147] bg-slate-100 px-3 py-1 rounded-full">
              Frequently Asked Questions
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#002147] tracking-tight">
              Institutional Clarity & Honor Code
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Key questions on syllabus protection, coordinate citations, and university compliance.
            </p>
          </div>

          <div className="space-y-4">
            
            {/* FAQ 1 */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleFaq(0)}
                className="w-full p-5 text-left font-bold text-slate-900 bg-slate-50 hover:bg-slate-100 flex items-center justify-between transition-colors text-sm sm:text-base"
              >
                <span>How does Acadexis guarantee zero AI hallucinations?</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-500 transition-transform duration-200 ${
                    openFaq === 0 ? 'rotate-180 text-[#002147]' : ''
                  }`}
                />
              </button>
              <AnimatePresence initial={false}>
                {openFaq === 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 text-sm text-slate-600 leading-relaxed bg-white border-t border-slate-200 space-y-2">
                      <p>
                        Unlike generic chat tools that pull random text from internet scrapes, Acadexis employs a deterministic grounding boundary. Every question submitted to the AI tutor is constrained to the verified text nodes and coordinate indices of your professor&apos;s uploaded documents.
                      </p>
                      <p>
                        If an answer cannot be proven with high mathematical confidence within the uploaded materials, the model is architected to state &ldquo;Not found in course materials&rdquo; rather than speculating.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* FAQ 2 */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleFaq(1)}
                className="w-full p-5 text-left font-bold text-slate-900 bg-slate-50 hover:bg-slate-100 flex items-center justify-between transition-colors text-sm sm:text-base"
              >
                <span>How are lecturer lecture slides and proprietary notes protected?</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-500 transition-transform duration-200 ${
                    openFaq === 1 ? 'rotate-180 text-[#002147]' : ''
                  }`}
                />
              </button>
              <AnimatePresence initial={false}>
                {openFaq === 1 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 text-sm text-slate-600 leading-relaxed bg-white border-t border-slate-200">
                      <p>
                        All materials uploaded to Acadexis are encrypted at rest with AES-256 and in transit with TLS 1.3. Your course materials are never sold, indexed into public search engines, or used to train open public foundation models. Only students actively enrolled in your specific university course can access your grounded hub.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* FAQ 3 */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleFaq(2)}
                className="w-full p-5 text-left font-bold text-slate-900 bg-slate-50 hover:bg-slate-100 flex items-center justify-between transition-colors text-sm sm:text-base"
              >
                <span>Which file formats and document types are supported?</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-500 transition-transform duration-200 ${
                    openFaq === 2 ? 'rotate-180 text-[#002147]' : ''
                  }`}
                />
              </button>
              <AnimatePresence initial={false}>
                {openFaq === 2 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 text-sm text-slate-600 leading-relaxed bg-white border-t border-slate-200">
                      <p>
                        Acadexis natively parses Adobe PDF (.pdf), Microsoft PowerPoint (.pptx, .ppt), Microsoft Word (.docx), and Markdown/text (.txt, .md). Our multi-modal parser extracts slides, headers, tables, code blocks, and mathematical LaTeX expressions.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* FAQ 4 */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleFaq(3)}
                className="w-full p-5 text-left font-bold text-slate-900 bg-slate-50 hover:bg-slate-100 flex items-center justify-between transition-colors text-sm sm:text-base"
              >
                <span>How does academic email verification and single sign-on (SSO) work?</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-500 transition-transform duration-200 ${
                    openFaq === 3 ? 'rotate-180 text-[#002147]' : ''
                  }`}
                />
              </button>
              <AnimatePresence initial={false}>
                {openFaq === 3 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 text-sm text-slate-600 leading-relaxed bg-white border-t border-slate-200">
                      <p>
                        Acadexis integrates with Google University OAuth SSO and validates institutional domains (such as .edu, .edu.ng, and .ac.uk). When a student or professor logs in, they are matched to their registered faculty and department for automatic role allocation.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </section>

      {/* ── High-Converting SaaS Final CTA Banner ──────────────────────────── */}
      <section className="bg-[#002147] text-white py-20 px-4 sm:px-6 lg:px-8 border-t border-[#003366]">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          
          <div className="inline-flex items-center gap-2 bg-[#001733] border border-[#003366] text-[#83FBA5] text-xs font-semibold px-4 py-1.5 rounded-full">
            <GraduationCap className="w-4 h-4" />
            <span>Join The Digital Athenaeum</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            The future of institutional intelligence is anchored.
          </h2>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Experience the first AI platform engineered specifically for the precision and academic integrity of modern universities.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <motion.div whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
              <Link
                href="/auth/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#83FBA5] hover:bg-[#6ee791] text-[#002147] font-bold rounded-lg transition-colors text-base shadow-lg"
              >
                <span>Get Started with University Email</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
            <motion.div whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
              <Link
                href="/pricing"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#001733] hover:bg-[#0a2f5c] text-white border border-slate-600 font-semibold rounded-lg transition-colors text-base"
              >
                <span>View Institutional Pricing</span>
              </Link>
            </motion.div>
          </div>

          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#83FBA5]" /> No credit card required for scholars
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#83FBA5]" /> Instant .edu verification
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#83FBA5]" /> Full FERPA compliance
            </span>
          </div>

        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <Footer />
    </div>
  );
}
