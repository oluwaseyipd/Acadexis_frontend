'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState<string>('');
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!pathname) return;
    const normalized = pathname.replace(/\/+$/g, '') || '/';
    const activeNav = navItems.find(item => item.url === normalized);
    setActiveItem(activeNav ? activeNav.name : '');
  }, [pathname]);

  const navItems = [
    { name: 'Features', url: '/features' },
    { name: 'Pricing', url: '/pricing' },
    { name: 'Trust', url: '/trust' }
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              LOGO
            </Link>
          </div>

          {/* Nav Items */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.url}
                className={`relative pb-1 transition-colors ${
                  activeItem === item.name
                    ? 'text-green-500 font-semibold'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
                onClick={() => setActiveItem(item.name)}
              >
                {item.name}
                {activeItem === item.name && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500" />
                )}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="auth/login"
              className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="auth/register"
              className="px-6 py-2 text-white rounded-full bg-[#0f173e] hover:bg-[#1a2456] transition-colors font-semibold"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-gray-700 hover:text-gray-900"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={mobileOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden mt-4 space-y-4 pb-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.url}
                  className={`py-2 px-3 rounded-lg transition-colors ${
                    activeItem === item.name
                      ? 'text-green-500 font-semibold bg-gray-100'
                      : 'text-gray-700 hover:bg-gray-50'
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
            <div className="flex flex-col space-y-2">
              <Link
                href="auth/login"
                className="py-2 px-3 rounded-lg text-gray-700 hover:bg-gray-50"
                onClick={() => setMobileOpen(false)}
              >
                Sign in
              </Link>
              <Link
                href="auth/register"
                className="py-2 px-3 rounded-lg text-white bg-[#0f173e] hover:bg-[#1a2456] transition-colors font-semibold text-center"
                onClick={() => setMobileOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
