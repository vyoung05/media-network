'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/tutorials', label: 'Tutorials' },
  { href: '/beats', label: 'Beats' },
  { href: '/gear', label: 'Gear' },
  { href: '/submit', label: 'Submit' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
      className={`sticky top-0 z-50 transition-all duration-300 border-b ${
        scrolled
          ? 'bg-secondary/70 backdrop-blur-xl shadow-lg shadow-black/20 border-primary/10'
          : 'bg-secondary/95 backdrop-blur-sm border-primary/5'
      }`}
    >
      {/* Top accent line */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="container-freq py-3">
        <div className="flex items-center justify-between">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral hover:text-primary transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group" data-cursor="HOME">
            {/* EQ Bars Icon */}
            <div className="flex items-end gap-[3px] h-6">
              <div className="w-[3px] bg-primary rounded-full animate-eq-bar-1" />
              <div className="w-[3px] bg-primary rounded-full animate-eq-bar-2" />
              <div className="w-[3px] bg-primary rounded-full animate-eq-bar-3" />
              <div className="w-[3px] bg-primary rounded-full animate-eq-bar-4" />
            </div>
            <div className="flex items-baseline">
              <span className="text-xl md:text-2xl font-headline font-bold text-white tracking-wider group-hover:text-white/90 transition-colors">
                TRAP
              </span>
              <span className="text-xl md:text-2xl font-headline font-bold text-primary tracking-wider group-hover:text-primary/90 transition-colors glow-text">
                FREQUENCY
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-mono text-neutral/70 uppercase tracking-wider hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200"
                data-cursor={link.label.toUpperCase()}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/feed.xml" className="p-2 text-neutral/50 hover:text-primary transition-colors" title="RSS Feed">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.18 15.64a2.18 2.18 0 010 4.36 2.18 2.18 0 010-4.36m0-12.64C3.42 3 1 3 1 3v4s1.57 0 3.36.14c2.14.17 3.9.72 5.41 1.66 1.73 1.08 2.91 2.55 3.56 4.43.52 1.49.78 3.51.78 5.77h4C18.11 10.05 13.18 3.61 6.18 3m0 6C3.58 9 1 9 1 9v4c1.52 0 2.93.15 4.23.44 1.58.36 2.74 1.01 3.48 1.94.78.98 1.18 2.38 1.18 4.18h4C13.89 13.53 10.78 9.6 6.18 9" />
              </svg>
            </Link>
            <Link href="/submit" className="btn-primary text-xs py-2 px-4">
              Submit a Beat
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden border-t border-primary/10 bg-secondary/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="py-2">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className="block px-6 py-3 text-sm font-mono text-neutral/70 uppercase tracking-wider hover:text-primary hover:bg-primary/5 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="border-t border-primary/10 mt-2 pt-2 px-6 pb-4">
                <Link
                  href="/submit"
                  className="block text-center btn-primary text-xs py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Submit a Beat
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
