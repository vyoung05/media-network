'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ShareIssueProps {
  title: string;
  url?: string;
}

export function ShareIssue({ title, url }: ShareIssueProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  const shareOptions = [
    {
      name: 'Twitter / X',
      action: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${title} — @SauceCaviar`)}&url=${encodeURIComponent(shareUrl)}`, '_blank'),
    },
    {
      name: 'Copy Link',
      action: () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
    },
  ];

  return (
    <div className="relative">
      <motion.button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 text-text/40 hover:text-primary transition-colors text-xs font-body uppercase tracking-wider"
        whileHover={{ scale: 1.02 }}
        data-cursor="Share"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
        </svg>
        Share
      </motion.button>

      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            className="absolute top-full right-0 mt-2 w-48 bg-surface/95 backdrop-blur-xl border border-surface/50 shadow-glass z-50"
          >
            {shareOptions.map((option) => (
              <button
                key={option.name}
                onClick={() => {
                  option.action();
                  if (option.name !== 'Copy Link') setShowMenu(false);
                }}
                className="w-full text-left px-4 py-3 text-xs text-text/60 hover:text-primary hover:bg-white/5 transition-colors font-body"
              >
                {option.name === 'Copy Link' && copied ? '✓ Copied!' : option.name}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
