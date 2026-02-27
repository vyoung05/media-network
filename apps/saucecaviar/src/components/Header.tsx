'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { label: 'Issues', href: '/issues' },
  { label: 'About', href: '/about' },
  { label: 'Submit', href: '/submit' },
  { label: 'Advertise', href: '/advertise' },
  { label: 'Subscribe', href: '/subscribe' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled
          ? 'bg-secondary/80 backdrop-blur-xl border-b border-primary/10 shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <div className="container-caviar">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3" data-cursor="Home">
            <div className="flex flex-col">
              <span className="text-2xl md:text-3xl font-headline tracking-[0.15em] text-text group-hover:text-primary transition-colors duration-500">
                SAUCE<span className="text-primary group-hover:text-text transition-colors duration-500">CAVIAR</span>
              </span>
              <span className="text-[9px] tracking-[0.4em] uppercase text-primary/60 font-body hidden sm:block">
                Culture Served Premium
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-5 py-2 text-xs tracking-[0.2em] uppercase text-text/60
                         hover:text-primary transition-colors duration-300 font-body group"
                data-cursor={link.label}
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-primary
                               group-hover:w-full transition-all duration-500" />
              </Link>
            ))}
          </nav>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-text/60 hover:text-primary transition-colors"
            aria-label="Toggle menu"
          >
            <div className="flex flex-col gap-1.5 w-6">
              <motion.span
                animate={mobileMenuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                className="block h-[1px] bg-current transition-colors"
              />
              <motion.span
                animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                className="block h-[1px] bg-current transition-colors"
              />
              <motion.span
                animate={mobileMenuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                className="block h-[1px] bg-current transition-colors"
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="md:hidden bg-secondary/95 backdrop-blur-xl border-t border-primary/10 overflow-hidden"
          >
            <div className="container-caviar py-8">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link
                    href={link.href}
                    className="block py-4 text-lg tracking-[0.15em] uppercase text-text/60
                             hover:text-primary transition-colors duration-300 font-headline
                             border-b border-surface/30"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 pt-4"
              >
                <p className="text-[10px] tracking-[0.3em] uppercase text-primary/40 font-body">
                  Culture Served Premium — Est. 2025
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
