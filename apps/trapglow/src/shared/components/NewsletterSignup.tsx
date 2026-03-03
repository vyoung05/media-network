'use client';

import React, { useState } from 'react';

interface NewsletterSignupProps {
  brand: string;
  brandName: string;
  primaryColor: string;
  adminUrl?: string;
  className?: string;
}

export function NewsletterSignup({
  brand,
  brandName,
  primaryColor,
  adminUrl = 'https://media-network-admin.vercel.app',
  className = '',
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const res = await fetch(`${adminUrl}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, brand }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage(data.message || 'Subscribed!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className={`text-center py-4 ${className}`}>
        <p className="text-lg font-semibold" style={{ color: primaryColor }}>✓ You&apos;re in!</p>
        <p className="text-sm opacity-70 mt-1">{message}</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <h3 className="text-lg font-bold mb-2">Stay Updated</h3>
      <p className="text-sm opacity-60 mb-4">
        Get the latest from {brandName} delivered to your inbox.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1 px-4 py-2.5 rounded-lg bg-white/10 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-white/30 transition-colors"
          disabled={status === 'loading'}
        />
        <button
          type="submit"
          disabled={status === 'loading' || !email}
          className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: primaryColor }}
        >
          {status === 'loading' ? '...' : 'Subscribe'}
        </button>
      </form>
      {status === 'error' && (
        <p className="text-xs text-red-400 mt-2">{message}</p>
      )}
    </div>
  );
}
