'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export function AdSubmissionForm() {
  const [formData, setFormData] = useState({
    companyName: '',
    contactEmail: '',
    contactName: '',
    placement: '',
    budget: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setTimeout(() => setStatus('success'), 2000);
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <div className="w-16 h-px bg-primary mx-auto mb-6" />
        <h3 className="text-2xl font-headline text-text">Inquiry Received</h3>
        <p className="mt-3 text-text/40 font-body max-w-md mx-auto">
          Our advertising team will review your inquiry and get back to you within 48 hours.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-[10px] tracking-[0.2em] uppercase text-text/40 font-body mb-2">
            Company Name *
          </label>
          <input
            type="text"
            required
            value={formData.companyName}
            onChange={e => updateField('companyName', e.target.value)}
            className="input-caviar"
            placeholder="Your brand"
          />
        </div>
        <div>
          <label className="block text-[10px] tracking-[0.2em] uppercase text-text/40 font-body mb-2">
            Contact Email *
          </label>
          <input
            type="email"
            required
            value={formData.contactEmail}
            onChange={e => updateField('contactEmail', e.target.value)}
            className="input-caviar"
            placeholder="you@company.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-[10px] tracking-[0.2em] uppercase text-text/40 font-body mb-2">
            Contact Name *
          </label>
          <input
            type="text"
            required
            value={formData.contactName}
            onChange={e => updateField('contactName', e.target.value)}
            className="input-caviar"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="block text-[10px] tracking-[0.2em] uppercase text-text/40 font-body mb-2">
            Preferred Placement
          </label>
          <select
            value={formData.placement}
            onChange={e => updateField('placement', e.target.value)}
            className="input-caviar"
          >
            <option value="">Select placement</option>
            <option value="inside-front">Inside Front Cover ($5,000)</option>
            <option value="full-page">Full Page Interior ($3,500)</option>
            <option value="spread">Double-Page Spread ($6,000)</option>
            <option value="back-cover">Back Cover ($4,500)</option>
            <option value="inside-back">Inside Back Cover ($4,000)</option>
            <option value="digital-banner">Digital Banner ($1,500)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-[10px] tracking-[0.2em] uppercase text-text/40 font-body mb-2">
          Budget Range
        </label>
        <select
          value={formData.budget}
          onChange={e => updateField('budget', e.target.value)}
          className="input-caviar"
        >
          <option value="">Select range</option>
          <option value="1500-3500">$1,500 — $3,500</option>
          <option value="3500-6000">$3,500 — $6,000</option>
          <option value="6000-10000">$6,000 — $10,000</option>
          <option value="10000+">$10,000+</option>
          <option value="custom">Custom / Multi-Issue Deal</option>
        </select>
      </div>

      <div>
        <label className="block text-[10px] tracking-[0.2em] uppercase text-text/40 font-body mb-2">
          Message
        </label>
        <textarea
          value={formData.message}
          onChange={e => updateField('message', e.target.value)}
          className="textarea-caviar"
          placeholder="Tell us about your brand and what you're looking for..."
          rows={4}
        />
      </div>

      <motion.button
        type="submit"
        className="btn-primary w-full"
        disabled={status === 'loading'}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        {status === 'loading' ? 'Submitting...' : 'Submit Inquiry'}
      </motion.button>
    </form>
  );
}
