'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface SubscribeFormProps {
  variant?: 'inline' | 'full';
}

export function SubscribeForm({ variant = 'inline' }: SubscribeFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1500);
  };

  if (variant === 'full') {
    return (
      <div className="card-glass p-8 md:p-12">
        <div className="text-center">
          <p className="text-[10px] tracking-[0.4em] uppercase text-primary/60 font-body mb-4">
            Newsletter
          </p>
          <h3 className="text-2xl md:text-3xl font-headline text-text tracking-wide">
            Stay in the Loop
          </h3>
          <p className="mt-3 text-sm text-text/40 font-body max-w-md mx-auto">
            Get notified when new issues drop. Plus exclusive behind-the-scenes
            content and early access to features.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 max-w-md mx-auto">
          {status === 'success' ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-4"
            >
              <p className="text-primary font-accent italic text-lg">Welcome to the inner circle ✦</p>
              <p className="mt-2 text-text/40 text-sm">Check your inbox for confirmation.</p>
            </motion.div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="input-caviar flex-1"
                required
              />
              <motion.button
                type="submit"
                className="btn-primary whitespace-nowrap"
                disabled={status === 'loading'}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {status === 'loading' ? 'Joining...' : 'Subscribe'}
              </motion.button>
            </div>
          )}
          <p className="mt-4 text-[10px] text-text/20 text-center font-body">
            No spam. Culture only. Unsubscribe anytime.
          </p>
        </form>
      </div>
    );
  }

  // Inline variant
  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      {status === 'success' ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-primary font-accent italic text-sm"
        >
          You&apos;re in ✦
        </motion.p>
      ) : (
        <>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="input-caviar flex-1 text-sm"
            required
          />
          <motion.button
            type="submit"
            className="btn-outline-gold text-xs px-6"
            disabled={status === 'loading'}
            whileTap={{ scale: 0.95 }}
          >
            {status === 'loading' ? '...' : 'Join'}
          </motion.button>
        </>
      )}
    </form>
  );
}
