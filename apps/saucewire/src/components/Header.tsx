'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { SAUCEWIRE_CATEGORIES } from '@media-network/shared';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 border-b border-gray-800 ${
        scrolled
          ? 'bg-secondary/70 backdrop-blur-xl shadow-lg shadow-black/20'
          : 'bg-secondary/95 backdrop-blur-sm'
      }`}
    >
      {/* Top bar — timestamp + social */}
      <div className="hidden md:block border-b border-gray-800/50">
        <div className="container-wire flex items-center justify-between py-1">
          <span className="text-xs font-mono text-neutral">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
          <div className="flex items-center gap-4">
            <Link href="/submit" className="text-xs font-mono text-accent hover:text-primary transition-colors">
              Submit a Tip
            </Link>
            <Link href="/write" className="text-xs font-mono text-accent hover:text-primary transition-colors">
              Write for Us
            </Link>
            <Link href="/feed.xml" className="text-xs font-mono text-neutral hover:text-accent transition-colors" title="RSS Feed">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.18 15.64a2.18 2.18 0 010 4.36 2.18 2.18 0 010-4.36m0-12.64C3.42 3 1 3 1 3v4s1.57 0 3.36.14c2.14.17 3.9.72 5.41 1.66 1.73 1.08 2.91 2.55 3.56 4.43.52 1.49.78 3.51.78 5.77h4C18.11 10.05 13.18 3.61 6.18 3m0 6C3.58 9 1 9 1 9v4c1.52 0 2.93.15 4.23.44 1.58.36 2.74 1.01 3.48 1.94.78.98 1.18 2.38 1.18 4.18h4C13.89 13.53 10.78 9.6 6.18 9" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container-wire py-3">
        <div className="flex items-center justify-between">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            <motion.div animate={mobileMenuOpen ? 'open' : 'closed'}>
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </motion.div>
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex items-baseline">
              <span className="text-2xl md:text-3xl font-headline text-white tracking-tight group-hover:text-white/90 transition-colors">
                SAUCE
              </span>
              <span className="text-2xl md:text-3xl font-headline text-primary tracking-tight group-hover:text-primary/90 transition-colors">
                WIRE
              </span>
            </div>
          </Link>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-neutral hover:text-white transition-colors"
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="mt-3">
                <form action="/archive" method="GET" className="relative">
                  <input
                    name="q"
                    type="text"
                    placeholder="Search articles..."
                    className="input-wire pr-10"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral hover:text-white"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Category nav */}
      <nav className="border-t border-gray-800/50">
        <div className="container-wire">
          <div className="hidden md:flex items-center gap-1 py-1 overflow-x-auto scrollbar-hide">
            {SAUCEWIRE_CATEGORIES.map((category) => (
              <Link
                key={category}
                href={`/category/${category.toLowerCase()}`}
                className="px-4 py-2 text-sm font-mono text-neutral uppercase tracking-wider hover:text-white hover:bg-white/5 rounded transition-all duration-200 whitespace-nowrap"
              >
                {category}
              </Link>
            ))}
            <Link
              href="/archive"
              className="px-4 py-2 text-sm font-mono text-neutral uppercase tracking-wider hover:text-white hover:bg-white/5 rounded transition-all duration-200 whitespace-nowrap"
            >
              Archive
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden border-t border-gray-800 bg-secondary/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="py-2">
              {SAUCEWIRE_CATEGORIES.map((category, i) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={`/category/${category.toLowerCase()}`}
                    className="block px-6 py-3 text-sm font-mono text-neutral uppercase tracking-wider hover:text-white hover:bg-surface transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {category}
                  </Link>
                </motion.div>
              ))}
              <div className="border-t border-gray-800 mt-2 pt-2">
                <Link
                  href="/archive"
                  className="block px-6 py-3 text-sm font-mono text-neutral uppercase tracking-wider hover:text-white hover:bg-surface transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Archive
                </Link>
                <Link
                  href="/submit"
                  className="block px-6 py-3 text-sm font-mono text-accent uppercase tracking-wider hover:text-white hover:bg-surface transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Submit a Tip
                </Link>
                <Link
                  href="/write"
                  className="block px-6 py-3 text-sm font-mono text-accent uppercase tracking-wider hover:text-white hover:bg-surface transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Write for Us
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
