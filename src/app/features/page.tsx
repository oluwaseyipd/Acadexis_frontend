'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  GraduationCap,
  MapPin,
  ShieldCheck,
  BarChart3,
  FileText,
  Check,
  ArrowRight,
  BookOpen,
  Sparkles,
  Zap,
  Lock,
  Layers,
  Search,
  CheckCircle2,
  FileCode,
  FileSpreadsheet
} from 'lucide-react';

interface FeatureModule {
  id: string;
  badge: string;
  title: string;
  headline: string;
  description: string;
  bullets: string[];
  image: string;
  codeSnippet?: string;
}

const featureModules: FeatureModule[] = [
  {
    id: 'citations',
    badge: 'Coordinate Bounding Box Technology',
    title: 'Coordinate Citations',
    headline: 'Every statement anchored to exact paragraph coordinates.',
    description:
      'Standard AI cites vague links or invents paper titles. Acadexis extracts mathematical bounding-box coordinates for every single fact, linking responses to the exact sentence, formula, or diagram in your professor’s uploaded slides.',
    bullets: [
      'Line-level paragraph and slide coordinate mapping',
      'Visual bounding box highlight in native PDF / PPTX viewer',
      '1-click jump from AI chat response to source material',
      'Immutable audit trail for university academic integrity'
    ],
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'heatmaps',
    badge: 'Faculty Diagnostic Analytics',
    title: 'Struggle Heatmaps',
    headline: 'Pinpoint cohort confusion 48 hours before midterm exams.',
    description:
      'Turn hundreds of anonymous student questions into aggregated pedagogical insights. Faculty dashboards highlight which lecture slides, formulas, or weekly modules are causing high query velocity and confusion.',
    bullets: [
      'Anonymous cohort query aggregation by lecture slide',
      'Concept difficulty grading (High, Moderate, Mastered)',
      'Actionable recommendations for upcoming revision lectures',
      'Longitudinal mastery trends across semesters'
    ],
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'studylab',
    badge: '24/7 Verified AI Tutor',
    title: 'AI Study Lab',
    headline: 'Syllabus-bounded revision tailored to your professor’s notation.',
    description:
      'Students can engage in interactive study sessions with an AI tutor that speaks the exact terminology of their enrolled course. Ask for step-by-step derivations, concept summaries, and practical examples without fear of unverified external data.',
    bullets: [
      'Strict syllabus boundary guard prevents hallucinated answers',
      'Customized explanations adhering to course notation and grading keys',
      'Instant LaTeX mathematical formula rendering',
      'Bookmark verified answers and code snippets for quick pre-exam review'
    ],
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'quizengine',
    badge: 'Automated Assessment Engine',
    title: 'Quiz & Flashcard Generator',
    headline: 'Instant assessment generation extracted directly from lecture slides.',
    description:
      'Transform 200-page slide decks into comprehensive practice exams in seconds. Automatically generate multiple-choice, true/false, and short-answer questions verified against official textbook content.',
    bullets: [
      'Automatic question drafting from slide decks and reading packs',
      'Instant grading with source coordinate explanations',
      'Spaced repetition flashcards for rapid key term memorization',
      'Export formatted quiz banks directly for LMS platforms'
    ],
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80'
  }
];

export default function FeaturesPage() {
  const [selectedFeature, setSelectedFeature] = useState<string>(featureModules[0].id);

  const activeModule = featureModules.find((f) => f.id === selectedFeature) || featureModules[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-[#83FBA5] selection:text-[#002147]">
      <Navbar />

      {/* ── Features Hero Section ────────────────────────────────────────── */}
      <section className="bg-[#002147] text-white pt-16 pb-20 sm:pt-24 sm:pb-28 px-4 sm:px-6 lg:px-8 border-b border-[#003366]">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 bg-[#001733] border border-[#003366] text-[#83FBA5] text-xs font-semibold px-3.5 py-1.5 rounded-full"
          >
            <Sparkles className="w-4 h-4" />
            <span>Platform Capabilities</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight"
          >
            Comprehensive Intelligence Grounded in <span className="text-[#83FBA5]">Course Truth</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.16 }}
            className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed"
          >
            Explore the specialized tooling built specifically for higher education: from bounding-box coordinate citations to real-time student struggle heatmaps.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.24 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <motion.div whileTap={{ scale: 0.98 }}>
              <Link
                href="/auth/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#83FBA5] hover:bg-[#6ee791] text-[#002147] font-bold rounded-lg transition-colors text-base shadow-sm"
              >
                <span>Try Acadexis Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
            <motion.div whileTap={{ scale: 0.98 }}>
              <Link
                href="/pricing"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#001733] hover:bg-[#0a2f5c] text-white border border-slate-600 font-semibold rounded-lg transition-colors text-base"
              >
                <span>View Plans & Pricing</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Interactive Feature Deep-Dive Section ─────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Feature Selector Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-slate-100 rounded-xl border border-slate-200 max-w-3xl mx-auto">
            {featureModules.map((mod) => {
              const isActive = selectedFeature === mod.id;
              return (
                <button
                  key={mod.id}
                  onClick={() => setSelectedFeature(mod.id)}
                  className={`relative px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors z-10 ${
                    isActive ? 'text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="featureTabIndicator"
                      className="absolute inset-0 bg-[#002147] rounded-lg -z-10 shadow-sm"
                      transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                    />
                  )}
                  {mod.title}
                </button>
              );
            })}
          </div>

          {/* Active Feature Display Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
            >
              <div className="lg:col-span-6 space-y-6">
                <span className="inline-block text-xs font-bold uppercase tracking-wider text-green-700 bg-green-100 px-3 py-1 rounded-md border border-green-200">
                  {activeModule.badge}
                </span>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#002147] tracking-tight">
                  {activeModule.headline}
                </h2>

                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  {activeModule.description}
                </p>

                <div className="space-y-3 pt-2">
                  {activeModule.bullets.map((bullet, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-800">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <motion.div whileTap={{ scale: 0.98 }}>
                    <Link
                      href="/auth/register"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#002147] hover:bg-[#0a2f5c] text-white font-semibold rounded-lg text-xs sm:text-sm transition-colors"
                    >
                      <span>Get Started with {activeModule.title}</span>
                      <ArrowRight className="w-4 h-4 text-[#83FBA5]" />
                    </Link>
                  </motion.div>
                </div>
              </div>

              <div className="lg:col-span-6 relative h-[300px] sm:h-[400px] rounded-xl overflow-hidden border border-slate-300 shadow-md">
                <Image
                  src={activeModule.image}
                  alt={activeModule.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[#002147]/20"></div>
                <div className="absolute bottom-4 left-4 right-4 bg-[#002147]/95 border border-white/20 p-4 rounded-xl text-white text-xs backdrop-blur-sm">
                  <div className="font-bold text-[#83FBA5] mb-1">{activeModule.title}</div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Deterministic coordinate mapping ensures full compliance with faculty honor codes and university peer-review standards.
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

        </div>
      </section>

      {/* ── Multi-Modal File Format Ingestion ──────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center max-w-3xl mx-auto space-y-4"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-[#002147] bg-slate-200 px-3 py-1 rounded-full">
              Multi-Modal Ingestion
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#002147] tracking-tight">
              Ingest Official Courseware in Seconds
            </h2>
            <p className="text-base text-slate-600">
              Acadexis supports your entire academic repository with automatic multi-modal parsing and semantic indexing.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="bg-white p-6 rounded-xl border border-slate-200 space-y-3"
            >
              <div className="w-10 h-10 rounded-lg bg-[#002147] text-[#83FBA5] flex items-center justify-center font-bold">
                PDF
              </div>
              <h3 className="text-base font-bold text-slate-900">Textbooks & Research Papers</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Extracts columns, embedded citations, equations, and page numbers with coordinate bounding boxes.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="bg-white p-6 rounded-xl border border-slate-200 space-y-3"
            >
              <div className="w-10 h-10 rounded-lg bg-[#002147] text-[#83FBA5] flex items-center justify-center font-bold">
                PPTX
              </div>
              <h3 className="text-base font-bold text-slate-900">Lecture Slides</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Indexes slide titles, bullet hierarchies, diagrams, and speaker notes per lecture week.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="bg-white p-6 rounded-xl border border-slate-200 space-y-3"
            >
              <div className="w-10 h-10 rounded-lg bg-[#002147] text-[#83FBA5] flex items-center justify-center font-bold">
                DOCX
              </div>
              <h3 className="text-base font-bold text-slate-900">Syllabi & Reading Lists</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Structures grading rubrics, schedule timelines, and core course objectives.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="bg-white p-6 rounded-xl border border-slate-200 space-y-3"
            >
              <div className="w-10 h-10 rounded-lg bg-[#002147] text-[#83FBA5] flex items-center justify-center font-bold">
                TeX
              </div>
              <h3 className="text-base font-bold text-slate-900">LaTeX Mathematical Formulas</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Accurately interprets complex mathematical matrices, proofs, and physical thermodynamic laws.
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────────────────────────────── */}
      <section className="bg-[#002147] text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Ready to ground your courses in verifiable AI?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Join hundreds of university scholars and lecturers building on Acadexis today.
          </p>
          <div className="pt-2">
            <motion.div whileTap={{ scale: 0.98 }}>
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#83FBA5] hover:bg-[#6ee791] text-[#002147] font-bold rounded-lg transition-colors text-base shadow-sm"
              >
                <span>Get Started with University Email</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
