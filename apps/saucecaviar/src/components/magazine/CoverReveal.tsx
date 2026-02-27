'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface CoverRevealProps {
  coverImage: string;
  title: string;
  subtitle: string;
  issueNumber: number;
  onRevealComplete: () => void;
}

export function CoverReveal({ coverImage, title, subtitle, issueNumber, onRevealComplete }: CoverRevealProps) {
  const [revealed, setRevealed] = useState(false);

  const handleReveal = () => {
    setRevealed(true);
    setTimeout(onRevealComplete, 1500);
  };

  return (
    <AnimatePresence>
      {!revealed && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-secondary flex items-center justify-center"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          {/* Background image with Ken Burns */}
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.3 }}
            transition={{ duration: 2, ease: 'easeOut' }}
          >
            <Image
              src={coverImage}
              alt={title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/60 to-secondary/40" />
          </motion.div>

          {/* Content */}
          <div className="relative z-10 text-center px-8">
            {/* Issue number */}
            <motion.p
              className="text-[10px] tracking-[0.5em] uppercase text-primary/60 font-body mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Issue #{issueNumber}
            </motion.p>

            {/* Ornamental line */}
            <motion.div
              className="w-16 h-px bg-primary/40 mx-auto mb-8"
              initial={{ width: 0 }}
              animate={{ width: 64 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            />

            {/* Title */}
            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-headline text-text tracking-wide"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.8, duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {title}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="mt-4 text-lg md:text-xl font-accent italic text-primary/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.8 }}
            >
              {subtitle}
            </motion.p>

            {/* Open button */}
            <motion.button
              onClick={handleReveal}
              className="mt-12 btn-outline-gold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              data-cursor="Open"
            >
              Open Issue
            </motion.button>

            {/* SauceCaviar branding */}
            <motion.p
              className="mt-16 text-[9px] tracking-[0.4em] uppercase text-text/20 font-body"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2, duration: 0.6 }}
            >
              SauceCaviar Magazine
            </motion.p>
          </div>

          {/* Vignette */}
          <div className="absolute inset-0 pointer-events-none vignette" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
