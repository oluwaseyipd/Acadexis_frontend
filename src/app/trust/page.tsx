'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  ShieldCheck,
  Lock,
  GraduationCap,
  CheckCircle2,
  FileCheck2,
  KeyRound,
  Server,
  ArrowRight,
  Database,
  Building2,
  EyeOff
} from 'lucide-react';

const trustPillars = [
  {
    icon: <ShieldCheck className="w-6 h-6 text-[#83FBA5]" />,
    title: 'Zero-Hallucination Grounding Boundary',
    description:
      'Unlike generic consumer AI engines that pull text from unverified internet sources, Acadexis confines inference strictly to uploaded course materials. If an answer cannot be proven with high mathematical certainty from the syllabus, our system explicitly responds with "Not found in course materials".'
  },
  {
    icon: <Lock className="w-6 h-6 text-[#83FBA5]" />,
    title: 'Proprietary Material & Copyright Protection',
    description:
      'Faculty lecture slides, notes, and exams uploaded to Acadexis remain 100% the intellectual property of the professor and university. Your documents are never used to train public foundational AI models, nor are they indexed into open search engines.'
  },
  {
    icon: <Database className="w-6 h-6 text-[#83FBA5]" />,
    title: 'FERPA & Academic Data Sovereignty',
    description:
      'Student queries, grades, and interaction logs are encrypted at rest with AES-256 and in transit with TLS 1.3. We uphold strict compliance with the Family Educational Rights and Privacy Act (FERPA) and global academic privacy standards.'
  },
  {
    icon: <KeyRound className="w-6 h-6 text-[#83FBA5]" />,
    title: 'Verified .edu / .ac.uk Domain Access',
    description:
      'Institutional accounts are gated behind validated university domains and SAML/Google SSO. This ensures only matriculated students and faculty members from verified departments can access courseware hubs.'
  }
];

const auditSteps = [
  {
    step: '01',
    title: 'Multi-Modal Ingestion & Coordinate Indexing',
    desc: 'PDF, PPTX, and DOCX files are encrypted and processed into deterministic coordinate bounding boxes with tamper-proof checksums.'
  },
  {
    step: '02',
    title: 'Syllabus-Bounded Inference',
    desc: 'When a student or researcher queries the AI, inference is strictly constrained to the course coordinate index.'
  },
  {
    step: '03',
    title: 'Coordinate Citation & Audit Log Generation',
    desc: 'The response delivers line and slide references. All query events are logged anonymously for faculty struggle heatmaps.'
  }
];

export default function TrustPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-[#83FBA5] selection:text-[#002147]">
      <Navbar />

      {/* ── Trust Hero Section ────────────────────────────────────────────── */}
      <section className="bg-[#002147] text-white pt-16 pb-20 sm:pt-24 sm:pb-28 px-4 sm:px-6 lg:px-8 border-b border-[#003366]">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 bg-[#001733] border border-[#003366] text-[#83FBA5] text-xs font-semibold px-3.5 py-1.5 rounded-full"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Institutional Trust & Integrity Architecture</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight"
          >
            Built for the Rigor of <span className="text-[#83FBA5]">University Integrity</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.16 }}
            className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed"
          >
            Acadexis is engineered to bridge the promise of generative AI with the strict ethical, pedagogical, and security standards of higher education.
          </motion.p>
        </div>
      </section>

      {/* ── 4 Pillars of Institutional Trust ──────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center max-w-3xl mx-auto space-y-4"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-green-700 bg-green-100 px-3 py-1 rounded-full border border-green-200">
              Core Safeguards
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#002147] tracking-tight">
              Our Commitments to Academic Institutions
            </h2>
            <p className="text-base text-slate-600">
              Four foundational pillars that protect faculty intellectual property and uphold the university honor code.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {trustPillars.map((pillar, idx) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.08 }}
                whileHover={{ y: -4 }}
                className="bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-4 shadow-sm hover:border-slate-400 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-[#002147] flex items-center justify-center">
                  {pillar.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900">{pillar.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{pillar.description}</p>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ── Verification Pipeline Flow ────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto space-y-14">
          
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center max-w-3xl mx-auto space-y-4"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-[#002147] bg-slate-200 px-3 py-1 rounded-full">
              Audit Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#002147] tracking-tight">
              The Immutable Grounding Audit Trail
            </h2>
            <p className="text-base text-slate-600">
              How every AI query is traced, bounded, and verified against courseware.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {auditSteps.map((step, sIdx) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: sIdx * 0.1 }}
                className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-4"
              >
                <div className="w-10 h-10 rounded-xl bg-[#002147] text-[#83FBA5] font-bold text-sm flex items-center justify-center">
                  {step.step}
                </div>
                <h3 className="text-lg font-bold text-slate-900">{step.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ── Institutional Contact Banner ──────────────────────────────────── */}
      <section className="bg-[#002147] text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Have questions regarding campus compliance or DPA?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Our academic trust and legal officers are available to review institutional Data Protection Agreements (DPAs) and faculty security protocols.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.div whileTap={{ scale: 0.98 }}>
              <Link
                href="/support"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#83FBA5] hover:bg-[#6ee791] text-[#002147] font-bold rounded-lg text-sm transition-colors shadow-sm"
              >
                <span>Contact Academic Trust Officer</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
            <motion.div whileTap={{ scale: 0.98 }}>
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#001733] hover:bg-[#0a2f5c] text-white border border-slate-600 font-semibold rounded-lg text-sm transition-colors"
              >
                <span>Sign Up with University Email</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
