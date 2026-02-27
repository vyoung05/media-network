'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassMorphCard } from '@/components/GlassMorphCard';
import { TextReveal } from '@/components/TextReveal';

type SubmissionType = 'beat' | 'tutorial' | 'gear_review' | 'writer';

export function SubmitPageClient() {
  const [activeTab, setActiveTab] = useState<SubmissionType>('beat');
  const [submitted, setSubmitted] = useState(false);

  const tabs = [
    { id: 'beat' as const, label: 'Submit a Beat', icon: '🎵', description: 'Share your instrumental with the community' },
    { id: 'tutorial' as const, label: 'Submit Tutorial', icon: '📚', description: 'Write a step-by-step production guide' },
    { id: 'gear_review' as const, label: 'Gear Review', icon: '🎛️', description: 'Review equipment you use and love' },
    { id: 'writer' as const, label: 'Write for Us', icon: '✍️', description: 'Apply to become a TrapFrequency contributor' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen py-20">
        <div className="container-freq max-w-xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <GlassMorphCard className="p-12" glowColor="rgba(57, 255, 20, 0.15)">
              <div className="flex items-center justify-center gap-[3px] h-10 mb-6">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-[3px] bg-primary rounded-full animate-waveform"
                    style={{
                      height: `${Math.random() * 80 + 20}%`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
              <h2 className="text-3xl font-headline font-bold text-primary glow-text mb-4">
                Submitted!
              </h2>
              <p className="text-neutral/60 mb-6">
                Thanks for your submission. Our team will review it and get back to you within 48 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="btn-ghost"
              >
                Submit Another
              </button>
            </GlassMorphCard>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container-freq max-w-3xl">
        {/* Header */}
        <div className="mb-10">
          <TextReveal
            text="SUBMIT"
            as="h1"
            className="text-4xl md:text-5xl font-headline font-black text-white tracking-tight mb-3"
            speed={40}
          />
          <p className="text-lg text-neutral/50 font-body">
            Share your beats, tutorials, and reviews with the TrapFrequency community.
          </p>
        </div>

        {/* Type Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-4 rounded-xl border text-left transition-all duration-300 ${
                activeTab === tab.id
                  ? 'border-primary/50 bg-primary/10 shadow-[0_0_15px_rgba(57,255,20,0.1)]'
                  : 'border-white/10 bg-surface/50 hover:border-primary/20'
              }`}
            >
              <span className="text-2xl block mb-2">{tab.icon}</span>
              <span className={`text-xs font-mono font-bold block mb-1 ${
                activeTab === tab.id ? 'text-primary' : 'text-neutral/60'
              }`}>
                {tab.label}
              </span>
              <span className="text-[10px] text-neutral/30 font-mono block leading-relaxed">
                {tab.description}
              </span>
            </button>
          ))}
        </div>

        {/* Form */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <GlassMorphCard className="p-6 md:p-8" hoverTilt={false}>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Common fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-neutral/50 uppercase tracking-wider mb-2 block">
                    Your Name *
                  </label>
                  <input type="text" required className="input-freq" placeholder="Producer name..." />
                </div>
                <div>
                  <label className="text-xs font-mono text-neutral/50 uppercase tracking-wider mb-2 block">
                    Email *
                  </label>
                  <input type="email" required className="input-freq" placeholder="your@email.com" />
                </div>
              </div>

              {/* Beat-specific fields */}
              {activeTab === 'beat' && (
                <>
                  <div>
                    <label className="text-xs font-mono text-neutral/50 uppercase tracking-wider mb-2 block">
                      Beat Title *
                    </label>
                    <input type="text" required className="input-freq" placeholder="Name your beat..." />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-mono text-neutral/50 uppercase tracking-wider mb-2 block">BPM</label>
                      <input type="number" className="input-freq" placeholder="140" />
                    </div>
                    <div>
                      <label className="text-xs font-mono text-neutral/50 uppercase tracking-wider mb-2 block">Key</label>
                      <input type="text" className="input-freq" placeholder="C minor" />
                    </div>
                    <div>
                      <label className="text-xs font-mono text-neutral/50 uppercase tracking-wider mb-2 block">Genre</label>
                      <input type="text" className="input-freq" placeholder="Trap" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-mono text-neutral/50 uppercase tracking-wider mb-2 block">
                      Audio Link (SoundCloud, BeatStars, etc.) *
                    </label>
                    <input type="url" required className="input-freq" placeholder="https://..." />
                  </div>
                </>
              )}

              {/* Tutorial-specific fields */}
              {activeTab === 'tutorial' && (
                <>
                  <div>
                    <label className="text-xs font-mono text-neutral/50 uppercase tracking-wider mb-2 block">
                      Tutorial Title *
                    </label>
                    <input type="text" required className="input-freq" placeholder="How to..." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-mono text-neutral/50 uppercase tracking-wider mb-2 block">DAW</label>
                      <select className="input-freq">
                        <option>FL Studio</option>
                        <option>Ableton Live</option>
                        <option>Logic Pro</option>
                        <option>Pro Tools</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-mono text-neutral/50 uppercase tracking-wider mb-2 block">Skill Level</label>
                      <select className="input-freq">
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                        <option>Master</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* Gear review fields */}
              {activeTab === 'gear_review' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-mono text-neutral/50 uppercase tracking-wider mb-2 block">
                        Product Name *
                      </label>
                      <input type="text" required className="input-freq" placeholder="e.g., MPC Live II" />
                    </div>
                    <div>
                      <label className="text-xs font-mono text-neutral/50 uppercase tracking-wider mb-2 block">
                        Brand *
                      </label>
                      <input type="text" required className="input-freq" placeholder="e.g., Akai" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-mono text-neutral/50 uppercase tracking-wider mb-2 block">
                      Your Rating
                    </label>
                    <select className="input-freq w-auto">
                      <option>5 — Exceptional</option>
                      <option>4 — Great</option>
                      <option>3 — Good</option>
                      <option>2 — Fair</option>
                      <option>1 — Poor</option>
                    </select>
                  </div>
                </>
              )}

              {/* Writer application fields */}
              {activeTab === 'writer' && (
                <>
                  <div>
                    <label className="text-xs font-mono text-neutral/50 uppercase tracking-wider mb-2 block">
                      Portfolio / Website
                    </label>
                    <input type="url" className="input-freq" placeholder="https://your-portfolio.com" />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-neutral/50 uppercase tracking-wider mb-2 block">
                      Areas of Expertise
                    </label>
                    <input type="text" className="input-freq" placeholder="e.g., FL Studio, Mixing, Sound Design" />
                  </div>
                </>
              )}

              {/* Description / body */}
              <div>
                <label className="text-xs font-mono text-neutral/50 uppercase tracking-wider mb-2 block">
                  {activeTab === 'writer' ? 'Why do you want to write for TrapFrequency?' : 'Description'}
                </label>
                <textarea
                  rows={5}
                  className="input-freq resize-none"
                  placeholder={
                    activeTab === 'beat' ? 'Describe your beat, inspiration, process...' :
                    activeTab === 'tutorial' ? 'Outline what the tutorial covers...' :
                    activeTab === 'gear_review' ? 'Share your experience with this gear...' :
                    'Tell us about your background and what you want to write about...'
                  }
                />
              </div>

              {/* Social links */}
              <div>
                <label className="text-xs font-mono text-neutral/50 uppercase tracking-wider mb-2 block">
                  Social Links (optional)
                </label>
                <input type="url" className="input-freq mb-2" placeholder="Instagram URL" />
                <input type="url" className="input-freq" placeholder="YouTube / SoundCloud URL" />
              </div>

              <button type="submit" className="btn-primary w-full">
                Submit {activeTab === 'beat' ? 'Beat' : activeTab === 'tutorial' ? 'Tutorial' : activeTab === 'gear_review' ? 'Review' : 'Application'}
              </button>
            </form>
          </GlassMorphCard>
        </motion.div>
      </div>
    </div>
  );
}
