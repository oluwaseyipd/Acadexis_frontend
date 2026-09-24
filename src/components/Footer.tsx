'use client';

import React from 'react';
import Link from 'next/link';
import { GraduationCap, ShieldCheck, Lock, Globe, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#002147] text-white border-t border-[#003366]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#0f173e] border border-white/10 flex items-center justify-center text-[#83FBA5]">
                <GraduationCap className="w-6 h-6" strokeWidth={2.2} />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-tight text-white">
                  Acadexis
                </span>
                <span className="text-[11px] uppercase font-semibold tracking-wider text-[#83FBA5] -mt-1">
                  The Digital Athenaeum
                </span>
              </div>
            </Link>
            <p className="text-slate-300 text-sm leading-relaxed max-w-sm">
              The institutional AI knowledge grounding platform engineered for universities. Anchoring student inquiry and faculty diagnostics in verified courseware with coordinate-level citations.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-slate-300">
              <span className="inline-flex items-center gap-1 bg-[#0f173e] px-2.5 py-1 rounded-md border border-white/10">
                <ShieldCheck className="w-3.5 h-3.5 text-[#83FBA5]" />
                FERPA Compliant
              </span>
              <span className="inline-flex items-center gap-1 bg-[#0f173e] px-2.5 py-1 rounded-md border border-white/10">
                <Lock className="w-3.5 h-3.5 text-[#83FBA5]" />
                256-bit Encrypted
              </span>
            </div>
          </div>

          {/* Col 1: Platform */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#83FBA5] mb-4">
              Platform
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <Link href="/features" className="hover:text-white transition-colors">
                  AI Study Lab
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-white transition-colors">
                  Coordinate Citations
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-white transition-colors">
                  Struggle Heatmaps
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-white transition-colors">
                  Automated Quiz Engine
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  Pricing & Plans
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Solutions */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#83FBA5] mb-4">
              Solutions
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <Link href="/auth/register" className="hover:text-white transition-colors">
                  For University Students
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="hover:text-white transition-colors">
                  For Lecturers & Faculty
                </Link>
              </li>
              <li>
                <Link href="/trust" className="hover:text-white transition-colors">
                  Department Heads
                </Link>
              </li>
              <li>
                <Link href="/trust" className="hover:text-white transition-colors">
                  Research Laboratories
                </Link>
              </li>
              <li>
                <Link href="/trust" className="hover:text-white transition-colors">
                  Institutional SSO (.edu)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Trust & Governance */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#83FBA5] mb-4">
              Trust & Security
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <Link href="/trust" className="hover:text-white transition-colors">
                  Academic Integrity Policy
                </Link>
              </li>
              <li>
                <Link href="/trust" className="hover:text-white transition-colors">
                  Zero-Hallucination Protocol
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-white transition-colors">
                  Support & Help Center
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-[#003366] flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Acadexis Inc. The Digital Athenaeum. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-green-400"></span>
              Systems Operational (99.99% Uptime)
            </span>
            <Link href="/trust" className="hover:text-slate-200 transition-colors">
              Security Overview
            </Link>
            <Link href="/support" className="hover:text-slate-200 transition-colors">
              Contact Faculty Desk
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}