'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { getLatestIssue, getAllIssues } from '@/lib/mock-data';
import { IssueCard } from './IssueCard';
import { SubscribeForm } from './SubscribeForm';
import { TextReveal } from './TextReveal';
import { GlassMorphCard } from './GlassMorphCard';

export function HomePageClient() {
  const latestIssue = getLatestIssue();
  const allIssues = getAllIssues();
  const heroRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <div>
      {/* ============ HERO — Latest Issue ============ */}
      <section ref={heroRef} className="relative h-screen overflow-hidden">
        {/* Background image with Ken Burns */}
        <motion.div
          className="absolute inset-0"
          style={{ scale: heroScale }}
        >
          <Image
            src={latestIssue.coverImage}
            alt={latestIssue.title}
            fill
            className="object-cover ken-burns-zoom"
            priority
            sizes="100vw"
          />
        </motion.div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/40 to-secondary/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/60 to-transparent" />

        {/* Vignette */}
        <div className="absolute inset-0 vignette pointer-events-none" />

        {/* Hero content */}
        <motion.div
          className="relative h-full flex flex-col justify-end pb-20 md:pb-28"
          style={{ opacity: heroOpacity, y: heroY }}
        >
          <div className="container-caviar">
            {/* Latest issue label */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-8 h-px bg-primary" />
              <span className="text-[10px] tracking-[0.4em] uppercase text-primary font-body">
                Latest Issue — #{latestIssue.issueNumber}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-headline text-text leading-[0.95] tracking-wide max-w-3xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {latestIssue.title}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="mt-4 text-lg md:text-xl font-accent italic text-primary/80 max-w-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              {latestIssue.subtitle}
            </motion.p>

            {/* Description */}
            <motion.p
              className="mt-4 text-sm text-text/40 font-body max-w-lg leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              {latestIssue.description}
            </motion.p>

            {/* CTA */}
            <motion.div
              className="mt-8 flex items-center gap-4"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              <Link href={`/issues/${latestIssue.slug}`}>
                <motion.span
                  className="btn-primary inline-block"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  data-cursor="Read"
                >
                  Read Issue
                </motion.span>
              </Link>
              <Link href="/issues">
                <motion.span
                  className="btn-ghost inline-block"
                  whileHover={{ scale: 1.03 }}
                  data-cursor="Archive"
                >
                  All Issues
                </motion.span>
              </Link>
            </motion.div>

            {/* Meta info */}
            <motion.div
              className="mt-8 flex items-center gap-6 text-[9px] tracking-[0.2em] uppercase text-text/20 font-body"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              <span>{latestIssue.season}</span>
              <span className="w-1 h-1 rounded-full bg-primary/30" />
              <span>{latestIssue.pageCount} Pages</span>
              <span className="w-1 h-1 rounded-full bg-primary/30" />
              <span>
                {new Date(latestIssue.publishedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <motion.div
            className="w-5 h-8 rounded-full border border-text/20 flex items-start justify-center p-1.5"
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          >
            <div className="w-0.5 h-2 bg-primary/60 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* ============ ABOUT TEASER ============ */}
      <section className="py-24 md:py-32 bg-secondary relative overflow-hidden">
        <div className="container-narrow text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
          >
            <div className="divider-ornament mb-8">
              <span className="text-primary text-lg">✦</span>
            </div>

            <TextReveal as="h2" className="text-3xl md:text-4xl font-headline text-text tracking-wide">
              Culture Served Premium
            </TextReveal>

            <p className="mt-6 text-lg font-accent italic text-text/40 leading-relaxed max-w-2xl mx-auto">
              SauceCaviar is not a blog. It&apos;s not a feed. It&apos;s a curated, interactive
              digital magazine — crafted with the same obsessive attention to detail
              that our featured artists bring to their work.
            </p>
            <p className="mt-4 text-sm text-text/25 font-body max-w-xl mx-auto leading-relaxed">
              Each issue is an experience: page-flip reading, cinematic photography,
              editorial writing that treats culture like the art form it is.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============ PAST ISSUES GRID ============ */}
      <section ref={sectionRef} className="py-16 md:py-24 bg-secondary">
        <div className="container-caviar">
          <motion.div
            className="flex items-end justify-between mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div>
              <p className="text-[10px] tracking-[0.4em] uppercase text-primary/60 font-body mb-3">
                Archive
              </p>
              <h2 className="text-3xl md:text-4xl font-headline text-text tracking-wide">
                Past Issues
              </h2>
            </div>
            <Link
              href="/issues"
              className="text-xs tracking-[0.2em] uppercase text-text/40 hover:text-primary transition-colors font-body hidden md:block"
              data-cursor="View All"
            >
              View All →
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {allIssues.map((issue, i) => (
              <IssueCard key={issue.id} issue={issue} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURES STRIP ============ */}
      <section className="py-16 md:py-20 bg-secondary border-t border-b border-surface/20">
        <div className="container-caviar">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '📖',
                title: 'Interactive Flipbook',
                desc: 'Turn pages with realistic animations, shadows, and sound. Desktop & mobile.',
              },
              {
                icon: '🎨',
                title: 'Print-Quality Design',
                desc: 'Magazine-grade typography, columns, pull quotes, and editorial photography.',
              },
              {
                icon: '✨',
                title: 'Curated Culture',
                desc: 'Fashion, music, art — not content, not noise, but art. Every issue is a limited edition.',
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
              >
                <GlassMorphCard className="p-8 h-full" tiltEnabled={false}>
                  <span className="text-2xl">{feature.icon}</span>
                  <h3 className="mt-4 text-lg font-headline text-text tracking-wide">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-text/40 font-body leading-relaxed">
                    {feature.desc}
                  </p>
                </GlassMorphCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SUBSCRIBE ============ */}
      <section className="py-24 md:py-32 bg-secondary">
        <div className="container-narrow">
          <SubscribeForm variant="full" />
        </div>
      </section>
    </div>
  );
}
