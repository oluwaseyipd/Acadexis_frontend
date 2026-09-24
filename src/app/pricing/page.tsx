'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  CircleCheck,
  ShieldCheck,
  Landmark,
  ShieldPlus,
  ArrowRight,
  Check,
  HelpCircle,
  Zap,
  Building2,
  GraduationCap
} from 'lucide-react';

interface PricingPlan {
  name: string;
  monthlyPrice: string;
  annualPrice: string;
  period: string;
  badge?: string;
  popular?: boolean;
  about: string;
  features: string[];
  cta: string;
  ctaLink: string;
}

const pricingPlans: PricingPlan[] = [
  {
    name: 'Scholar',
    monthlyPrice: '$0',
    annualPrice: '$0',
    period: 'forever',
    about: 'Essential verified study tools for individual students and independent learners.',
    features: [
      'Grounded AI Tutor (10 document packs/mo)',
      'Coordinate-level citations on PDF courseware',
      'Flashcard & practice quiz generator',
      'Standard academic integrity guard',
      '1 GB Cloud document storage'
    ],
    cta: 'Start Learning Free',
    ctaLink: '/auth/register'
  },
  {
    name: 'Researcher & Faculty',
    monthlyPrice: '$19',
    annualPrice: '$15',
    period: 'per month',
    badge: 'MOST POPULAR',
    popular: true,
    about: 'Advanced tools for serious researchers, teaching assistants, and university faculty.',
    features: [
      'Unlimited courseware grounding (PDF, PPTX, DOCX)',
      'High-priority coordinate citation engine',
      'Faculty struggle heatmap & student analytics',
      'Automated midterm exam question generator',
      '20 GB Cloud document storage',
      'Direct LaTeX math & code snippet export'
    ],
    cta: 'Upgrade to Faculty Pro',
    ctaLink: '/auth/register'
  },
  {
    name: 'Institutional Department',
    monthlyPrice: 'Custom',
    annualPrice: 'Custom',
    period: 'annual billing',
    badge: 'CAMPUS LICENSE',
    about: 'Tailored campus deployment for university faculties, academic deans, and research labs.',
    features: [
      'Unlimited departmental seats & storage',
      'Institutional Google & SAML Single Sign-On (.edu)',
      'Canvas, Blackboard, & Moodle LMS Integration',
      'FERPA compliance & custom data sovereignty',
      'Dedicated faculty onboarding & academic SLA',
      'University-wide student struggle diagnostics'
    ],
    cta: 'Contact Institutional Sales',
    ctaLink: '/support'
  }
];

const comparisonRows = [
  { feature: 'Grounded AI Study Lab', scholar: '10 packs/mo', researcher: 'Unlimited', institutional: 'Unlimited' },
  { feature: 'Coordinate Bounding Box Citations', scholar: 'Included', researcher: 'Included', institutional: 'Included' },
  { feature: 'Supported Formats', scholar: 'PDF, TXT', researcher: 'PDF, PPTX, DOCX, LaTeX', institutional: 'All Formats + LMS' },
  { feature: 'Faculty Struggle Heatmaps', scholar: '—', researcher: 'Included', institutional: 'Included (Dept Wide)' },
  { feature: 'Automated Exam & Quiz Generator', scholar: 'Standard', researcher: 'Advanced', institutional: 'Enterprise Bank' },
  { feature: 'University Domain SSO (.edu)', scholar: '—', researcher: 'Optional', institutional: 'SAML / Google SSO' },
  { feature: 'FERPA & Data Sovereignty Agreement', scholar: 'Standard Terms', researcher: 'Standard Terms', institutional: 'Custom SLA & DPA' },
  { feature: 'Dedicated Faculty Support', scholar: 'Community', researcher: 'Priority Email', institutional: 'Dedicated Account Lead' }
];

export default function PricingPage() {
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'annual'>('annual');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-[#83FBA5] selection:text-[#002147]">
      <Navbar />

      <main className="px-4 sm:px-6 lg:px-8 py-12 sm:py-20 min-h-screen">
        {/* ── Hero Section ─────────────────────────────────────────────────── */}
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 bg-slate-200 border border-slate-300 text-[#002147] text-xs font-semibold px-3.5 py-1.5 rounded-full"
          >
            <GraduationCap className="w-4 h-4 text-green-700" />
            <span>Transparent Academic Pricing</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#002147] leading-tight"
          >
            Academic Excellence, <span className="text-green-700">Sustainably Scaled</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.16 }}
            className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600 leading-relaxed"
          >
            Choose the tier tailored to your academic journey—from free tools for undergraduate scholars to enterprise grounding for university departments.
          </motion.p>

          {/* Billing Interval Toggle */}
          <div className="pt-6 flex items-center justify-center">
            <div className="flex items-center bg-slate-200 p-1 rounded-xl border border-slate-300 relative">
              <button
                onClick={() => setBillingInterval('monthly')}
                className={`relative px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors z-10 ${
                  billingInterval === 'monthly' ? 'text-white' : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                {billingInterval === 'monthly' && (
                  <motion.div
                    layoutId="billingIndicator"
                    className="absolute inset-0 bg-[#002147] rounded-lg -z-10 shadow-sm"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingInterval('annual')}
                className={`relative px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors z-10 flex items-center gap-1.5 ${
                  billingInterval === 'annual' ? 'text-white' : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                {billingInterval === 'annual' && (
                  <motion.div
                    layoutId="billingIndicator"
                    className="absolute inset-0 bg-[#002147] rounded-lg -z-10 shadow-sm"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                <span>Annual Billing</span>
                <span className="bg-[#83FBA5] text-[#002147] text-[10px] font-bold px-1.5 py-0.5 rounded">
                  Save 25%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Pricing Plans Grid ────────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto mt-14 grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {pricingPlans.map((plan, index) => {
            const isPopular = plan.popular;
            const price =
              billingInterval === 'annual' ? plan.annualPrice : plan.monthlyPrice;

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.08 }}
                whileHover={{ y: -4 }}
                className={`relative rounded-2xl p-6 sm:p-8 flex flex-col justify-between text-left transition-all ${
                  isPopular
                    ? 'bg-[#002147] text-white border-2 border-[#83FBA5] shadow-xl'
                    : 'bg-white text-slate-800 border border-slate-200 shadow-sm'
                }`}
              >
                {plan.badge && (
                  <div
                    className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      isPopular
                        ? 'bg-[#83FBA5] text-[#002147] border border-[#002147]'
                        : 'bg-[#002147] text-[#83FBA5] border border-[#003366]'
                    }`}
                  >
                    {plan.badge}
                  </div>
                )}

                <div>
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <p className={`text-xs sm:text-sm mt-2 leading-relaxed ${isPopular ? 'text-slate-300' : 'text-slate-600'}`}>
                    {plan.about}
                  </p>

                  <div className="my-6 pt-4 border-t border-slate-200/40">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-4xl sm:text-5xl font-extrabold tracking-tight">{price}</span>
                      <span className={`text-xs sm:text-sm ${isPopular ? 'text-slate-300' : 'text-slate-500'}`}>
                        /{plan.period}
                      </span>
                    </div>
                  </div>

                  {/* Features checklist */}
                  <ul className="space-y-3 text-xs sm:text-sm">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Check
                          className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                            isPopular ? 'text-[#83FBA5]' : 'text-green-600'
                          }`}
                        />
                        <span className={isPopular ? 'text-slate-200' : 'text-slate-700'}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4">
                  <motion.div whileTap={{ scale: 0.98 }}>
                    <Link
                      href={plan.ctaLink}
                      className={`w-full py-3.5 px-4 rounded-lg font-bold text-center block text-sm transition-colors ${
                        isPopular
                          ? 'bg-[#83FBA5] hover:bg-[#6ee791] text-[#002147]'
                          : 'bg-[#002147] hover:bg-[#0a2f5c] text-white'
                      }`}
                    >
                      {plan.cta}
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Trust & Institutional Compliance Badges ──────────────────────── */}
        <div className="mt-16 max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-slate-700">
            <ShieldCheck className="w-5 h-5 text-green-600" />
            <span>256-bit Encrypted Courseware</span>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-slate-700">
            <Landmark className="w-5 h-5 text-green-600" />
            <span>University Invoicing & Purchase Orders</span>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-slate-700">
            <ShieldPlus className="w-5 h-5 text-green-600" />
            <span>FERPA & Academic Integrity Compliant</span>
          </div>
        </div>

        {/* ── Detailed Comparison Matrix ───────────────────────────────────── */}
        <div className="mt-20 max-w-7xl mx-auto bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-sm space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#002147]">Detailed Feature Comparison</h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Full breakdown of capabilities across individual, faculty, and campus licenses.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b-2 border-slate-200 text-slate-900">
                  <th className="py-3 px-4 font-bold">Feature</th>
                  <th className="py-3 px-4 font-bold">Scholar ($0)</th>
                  <th className="py-3 px-4 font-bold text-green-700">Researcher ($15/mo)</th>
                  <th className="py-3 px-4 font-bold text-[#002147]">Institutional</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {comparisonRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-slate-800">{row.feature}</td>
                    <td className="py-3.5 px-4 text-slate-600">{row.scholar}</td>
                    <td className="py-3.5 px-4 font-semibold text-green-700">{row.researcher}</td>
                    <td className="py-3.5 px-4 font-semibold text-[#002147]">{row.institutional}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Final Pricing CTA Banner (Solid Navy, Zero Gradients) ────────── */}
        <div className="mt-20 max-w-7xl mx-auto bg-[#002147] text-white p-8 sm:p-16 rounded-2xl border border-[#003366] text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Need a custom department or university pilot?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Our academic liaisons work directly with faculty heads and university IT to configure SSO, LMS integrations, and campus-wide licensing.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.div whileTap={{ scale: 0.98 }}>
              <Link
                href="/support"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#83FBA5] hover:bg-[#6ee791] text-[#002147] font-bold rounded-lg text-sm transition-colors shadow-sm"
              >
                <span>Request Department Pilot</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
            <motion.div whileTap={{ scale: 0.98 }}>
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#001733] hover:bg-[#0a2f5c] text-white border border-slate-600 font-semibold rounded-lg text-sm transition-colors"
              >
                <span>Create Free Scholar Account</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
