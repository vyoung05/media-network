'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/discover', label: 'Discover' },
  { href: '/blog', label: 'Blog' },
  { href: '/submit', label: 'Submit' },
  { href: '/write', label: 'Write' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-secondary/80 backdrop-blur-xl shadow-lg shadow-primary/5 border-b border-white/[0.06]'
          : 'bg-transparent'
      }`}
    >
      <div className="container-glow">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group relative">
            {/* Glow behind logo */}
            <div className="absolute -inset-4 bg-primary/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-baseline">
              <span className="text-2xl md:text-3xl font-accent font-bold text-white tracking-tight">
                TRAP
              </span>
              <span className="text-2xl md:text-3xl font-accent font-bold text-gradient tracking-tight">
                GLOW
              </span>
            </div>
            {/* Animated dot */}
            <div className="w-2 h-2 rounded-full bg-accent animate-glow-pulse" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-body text-white/60 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-300 relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full group-hover:w-6 transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* Desktop right actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/submit"
              className="px-4 py-2 text-sm font-bold text-secondary bg-accent rounded-lg hover:bg-accent/90 transition-all duration-300 hover:shadow-lg hover:shadow-accent/20"
            >
              Submit Artist
            </Link>
            <Link
              href="/feed.xml"
              className="p-2 text-white/40 hover:text-accent transition-colors"
              title="RSS Feed"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.18 15.64a2.18 2.18 0 010 4.36 2.18 2.18 0 010-4.36m0-12.64C3.42 3 1 3 1 3v4s1.57 0 3.36.14c2.14.17 3.9.72 5.41 1.66 1.73 1.08 2.91 2.55 3.56 4.43.52 1.49.78 3.51.78 5.77h4C18.11 10.05 13.18 3.61 6.18 3m0 6C3.58 9 1 9 1 9v4c1.52 0 2.93.15 4.23.44 1.58.36 2.74 1.01 3.48 1.94.78.98 1.18 2.38 1.18 4.18h4C13.89 13.53 10.78 9.6 6.18 9" />
              </svg>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white/60 hover:text-white transition-colors"
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
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden border-t border-white/[0.06] bg-secondary/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="py-4 px-4 space-y-1">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className="block px-4 py-3 text-sm font-body text-white/70 hover:text-white hover:bg-surface rounded-lg transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: NAV_LINKS.length * 0.05 }}
                className="pt-2"
              >
                <Link
                  href="/submit"
                  className="block w-full text-center px-4 py-3 bg-accent text-secondary font-bold rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Submit Artist
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
