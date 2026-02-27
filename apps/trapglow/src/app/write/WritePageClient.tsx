'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassMorphCard } from '@/components/GlassMorphCard';

export function WritePageClient() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    portfolio_url: '',
    twitter: '',
    areas_of_interest: '',
    pitch: '',
    sample_work: '',
    experience: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-headline font-bold text-white mb-2">Application Received!</h2>
          <p className="text-white/50 font-body mb-6">
            We review writer applications weekly. If your voice fits TrapGlow, 
            we&apos;ll reach out with next steps.
          </p>
          <button onClick={() => setSubmitted(false)} className="btn-ghost text-sm">
            Submit Another
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <GlassMorphCard className="p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name + email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/50 font-body mb-1.5 uppercase tracking-wider">Full Name *</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your name"
                className="input-glow"
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 font-body mb-1.5 uppercase tracking-wider">Email *</label>
              <input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@email.com"
                className="input-glow"
              />
            </div>
          </div>

          {/* Portfolio + Social */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/50 font-body mb-1.5 uppercase tracking-wider">Portfolio / Website</label>
              <input
                type="url"
                value={formData.portfolio_url}
                onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })}
                placeholder="https://yoursite.com"
                className="input-glow"
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 font-body mb-1.5 uppercase tracking-wider">Twitter / X</label>
              <input
                type="text"
                value={formData.twitter}
                onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                placeholder="@yourusername"
                className="input-glow"
              />
            </div>
          </div>

          {/* Areas of interest */}
          <div>
            <label className="block text-xs text-white/50 font-body mb-1.5 uppercase tracking-wider">Areas of Interest *</label>
            <input
              required
              type="text"
              value={formData.areas_of_interest}
              onChange={(e) => setFormData({ ...formData, areas_of_interest: e.target.value })}
              placeholder="e.g., Hip-hop interviews, Afrobeats features, Industry analysis"
              className="input-glow"
            />
          </div>

          {/* Experience */}
          <div>
            <label className="block text-xs text-white/50 font-body mb-1.5 uppercase tracking-wider">Writing Experience</label>
            <textarea
              rows={3}
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              placeholder="Where have you published? What's your background?"
              className="input-glow resize-none"
            />
          </div>

          {/* Pitch */}
          <div>
            <label className="block text-xs text-white/50 font-body mb-1.5 uppercase tracking-wider">Story Pitch *</label>
            <textarea
              required
              rows={4}
              value={formData.pitch}
              onChange={(e) => setFormData({ ...formData, pitch: e.target.value })}
              placeholder="Pitch us a story you'd want to write for TrapGlow. What's the angle? Who's it about? Why now?"
              className="input-glow resize-none"
            />
          </div>

          {/* Sample work link */}
          <div>
            <label className="block text-xs text-white/50 font-body mb-1.5 uppercase tracking-wider">Sample Work (link)</label>
            <input
              type="url"
              value={formData.sample_work}
              onChange={(e) => setFormData({ ...formData, sample_work: e.target.value })}
              placeholder="Link to a published piece"
              className="input-glow"
            />
          </div>

          <button type="submit" className="btn-primary w-full text-center">
            Apply to Write ✍️
          </button>

          <p className="text-center text-[11px] text-white/30 font-body">
            We review applications weekly and respond to all applicants.
          </p>
        </form>
      </GlassMorphCard>
    </div>
  );
}
