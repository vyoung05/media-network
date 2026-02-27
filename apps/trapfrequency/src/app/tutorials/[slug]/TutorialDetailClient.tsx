'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { GlassMorphCard } from '@/components/GlassMorphCard';
import type { Tutorial } from '@/lib/mock-data';
import { DAW_INFO, SKILL_COLORS, formatNumber } from '@/lib/mock-data';

interface TutorialDetailClientProps {
  tutorial: Tutorial;
}

export function TutorialDetailClient({ tutorial }: TutorialDetailClientProps) {
  const dawInfo = DAW_INFO[tutorial.daw];
  const skillColor = SKILL_COLORS[tutorial.skillLevel];

  return (
    <div className="min-h-screen py-12">
      <div className="container-freq max-w-4xl">
        {/* Breadcrumbs */}
        <nav className="mb-6">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral/40">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link href="/tutorials" className="hover:text-primary transition-colors">Tutorials</Link>
            <span>/</span>
            <span className="text-primary/60 truncate">{tutorial.title}</span>
          </div>
        </nav>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Meta badges */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span
              className="text-xs font-mono font-bold px-2.5 py-1 rounded-md border"
              style={{
                color: dawInfo.color,
                borderColor: `${dawInfo.color}40`,
                backgroundColor: `${dawInfo.color}15`,
              }}
            >
              {dawInfo.icon} {tutorial.daw}
            </span>
            <span
              className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-1 rounded-md"
              style={{
                color: skillColor,
                backgroundColor: `${skillColor}15`,
                border: `1px solid ${skillColor}30`,
              }}
            >
              {tutorial.skillLevel}
            </span>
            <span className="text-xs font-mono text-primary/60 bg-primary/5 border border-primary/20 px-2 py-1 rounded">
              {tutorial.category}
            </span>
            <span className="text-xs font-mono text-neutral/40 bg-surface px-2 py-1 rounded">
              ⏱ {tutorial.duration}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-headline font-black text-white leading-tight mb-4">
            {tutorial.title}
          </h1>

          <p className="text-lg text-neutral/60 leading-relaxed mb-6">
            {tutorial.excerpt}
          </p>

          {/* Author & stats */}
          <div className="flex items-center justify-between py-4 border-y border-primary/10">
            <Link href={`/producers/${tutorial.author.slug}`} className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-sm font-bold text-primary">{tutorial.author.name.charAt(0)}</span>
              </div>
              <div>
                <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                  {tutorial.author.name}
                </p>
                <p className="text-[10px] font-mono text-neutral/40">
                  {tutorial.author.location}
                </p>
              </div>
            </Link>
            <div className="flex items-center gap-4 text-neutral/40">
              <span className="text-xs font-mono flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {formatNumber(tutorial.viewCount)}
              </span>
              <span className="text-xs font-mono">♥ {formatNumber(tutorial.likeCount)}</span>
            </div>
          </div>
        </motion.div>

        {/* Cover image placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mt-8"
        >
          <div className="relative h-64 md:h-96 rounded-xl overflow-hidden bg-gradient-to-br from-surface via-mixer-dark to-secondary">
            <div className="absolute inset-0 bg-grid opacity-30" />
            <div
              className="absolute inset-0 opacity-10"
              style={{ background: `linear-gradient(135deg, ${dawInfo.color}33, transparent 60%)` }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <span className="text-6xl opacity-20">{dawInfo.icon}</span>
                <p className="text-sm font-mono text-neutral/20 mt-2">{tutorial.daw} Tutorial</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Article body placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-10"
        >
          <div className="prose prose-invert max-w-none">
            <p className="text-neutral/70 leading-relaxed text-lg">
              {tutorial.excerpt}
            </p>
            <p className="text-neutral/50 leading-relaxed mt-6">
              This tutorial will walk you through the complete process step by step.
              Whether you&apos;re just getting started or looking to refine your skills,
              we&apos;ll cover everything you need to know to get professional results
              in {tutorial.daw}.
            </p>

            <GlassMorphCard className="p-6 my-8" hoverTilt={false}>
              <h3 className="text-lg font-headline font-bold text-primary mb-3">What You&apos;ll Learn</h3>
              <ul className="space-y-2">
                {tutorial.tags.map((tag) => (
                  <li key={tag} className="flex items-center gap-2 text-sm text-neutral/60">
                    <span className="text-primary">▸</span>
                    <span className="capitalize">{tag} techniques and best practices</span>
                  </li>
                ))}
              </ul>
            </GlassMorphCard>

            <p className="text-neutral/40 text-sm font-mono mt-8">
              Full tutorial content coming soon. This is a preview of the TrapFrequency platform.
            </p>
          </div>
        </motion.div>

        {/* Tags */}
        <div className="mt-10 pt-6 border-t border-primary/10">
          <p className="text-xs font-mono text-neutral/30 uppercase tracking-wider mb-3">Tags</p>
          <div className="flex flex-wrap gap-2">
            {tutorial.tags.map((tag) => (
              <span key={tag} className="text-xs font-mono text-neutral/40 bg-white/5 px-3 py-1 rounded-lg">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
