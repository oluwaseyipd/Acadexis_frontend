'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap, Menu, X, ArrowRight } from 'lucide-react';

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState<string>('');
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  const navItems = [
    { name: 'Features', url: '/features' },
    { name: 'Pricing', url: '/pricing' },
    { name: 'Trust & Integrity', url: '/trust' },
    { name: 'Support', url: '/support' },
  ];

  useEffect(() => {
    if (!pathname) return;
    const normalized = pathname.replace(/\/+$/g, '') || '/';
    const activeNav = navItems.find((item) => item.url === normalized);
    setActiveItem(activeNav ? activeNav.name : '');
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18 py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-[#002147] flex items-center justify-center text-green-400 group-hover:bg-[#0f173e] transition-colors">
              <GraduationCap className="w-6 h-6 text-[#83FBA5]" strokeWidth={2.2} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-[#002147]">
                Acadexis
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-500 -mt-1">
                The Digital Athenaeum
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-full border border-slate-200">
            {navItems.map((item) => {
              const isActive = activeItem === item.name;
              return (
                <Link
                  key={item.name}
                  href={item.url}
                  className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
                    isActive
                      ? 'bg-white text-[#002147] shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-[#002147] hover:bg-white/60'
                  }`}
                  onClick={() => setActiveItem(item.name)}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/auth/login"
              className="px-4 py-2 text-sm font-semibold text-[#002147] hover:text-green-700 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white rounded-lg bg-[#002147] hover:bg-[#0a2f5c] transition-colors shadow-sm"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 text-[#83FBA5]" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 space-y-3">
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.url}
                  className={`py-2.5 px-3 rounded-lg text-base font-medium transition-colors ${
                    activeItem === item.name
                      ? 'text-[#002147] font-semibold bg-slate-100'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                  onClick={() => {
                    setActiveItem(item.name);
                    setMobileOpen(false);
                  }}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
              <Link
                href="/auth/login"
                className="py-2.5 px-3 rounded-lg text-center font-medium text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Sign in
              </Link>
              <Link
                href="/auth/register"
                className="py-2.5 px-3 rounded-lg text-center font-semibold text-white bg-[#002147] hover:bg-[#0a2f5c] transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Get Started Free
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
