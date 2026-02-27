'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TextReveal } from './TextReveal';
import { GlassMorphCard } from './GlassMorphCard';
import { TutorialCard } from './TutorialCard';
import { BeatCard } from './BeatCard';
import { GearReviewCard } from './GearReviewCard';
import { ProducerCard } from './ProducerCard';
import { FrequencyChart } from './FrequencyChart';
import { SamplePackCard } from './SamplePackCard';
import { WaveformPlayer } from './WaveformPlayer';
import type { Tutorial, Beat, GearReview, Producer, FrequencyChartEntry, SamplePack } from '@/lib/mock-data';

interface HomePageClientProps {
  tutorials: Tutorial[];
  beats: Beat[];
  gearReviews: GearReview[];
  producers: Producer[];
  chartEntries: FrequencyChartEntry[];
  samplePacks: SamplePack[];
}

export function HomePageClient({
  tutorials,
  beats,
  gearReviews,
  producers,
  chartEntries,
  samplePacks,
}: HomePageClientProps) {
  const featuredBeat = beats[0];

  return (
    <div className="min-h-screen">
      {/* ============ HERO SECTION ============ */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-secondary via-surface/50 to-secondary" />
        <div className="absolute inset-0 bg-grid opacity-40" />

        {/* Floating waveform decoration */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 opacity-[0.06] pointer-events-none">
          <div className="flex items-center justify-center gap-[2px] h-40">
            {Array.from({ length: 120 }).map((_, i) => (
              <div
                key={i}
                className="w-[3px] bg-primary rounded-full"
                style={{
                  height: `${Math.sin(i * 0.15) * 40 + Math.random() * 50 + 10}%`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Green glow orbs */}
        <div className="absolute top-20 right-1/4 w-72 h-72 bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-cool/5 rounded-full blur-[120px]" />

        <div className="container-freq relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-6"
            >
              <span className="text-xs font-mono text-primary/80 uppercase tracking-[0.3em] bg-primary/5 border border-primary/10 px-4 py-1.5 rounded-full">
                Tune Into The Craft
              </span>
            </motion.div>

            {/* Main headline */}
            <TextReveal
              text="MUSIC PRODUCTION STARTS HERE"
              as="h1"
              className="text-4xl md:text-6xl lg:text-7xl font-headline font-black text-white leading-tight mb-6 tracking-tight"
              speed={25}
            />

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="text-lg md:text-xl text-neutral/60 font-body max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Tutorials, beats, gear reviews, and producer spotlights.
              Everything you need to level up your production game.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/tutorials" className="btn-primary">
                Browse Tutorials
              </Link>
              <Link href="/beats" className="btn-ghost">
                Explore Beats
              </Link>
            </motion.div>

            {/* Stats strip */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="mt-16 flex items-center justify-center gap-8 md:gap-16"
            >
              {[
                { value: '500+', label: 'Tutorials' },
                { value: '2.5K+', label: 'Beats' },
                { value: '150+', label: 'Producers' },
                { value: '50K+', label: 'Community' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-xl md:text-2xl font-headline font-bold text-primary glow-text">{stat.value}</p>
                  <p className="text-[10px] font-mono text-neutral/40 uppercase tracking-wider mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ FEATURED BEAT SHOWCASE ============ */}
      {featuredBeat && (
        <section className="py-12">
          <div className="container-freq">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <GlassMorphCard className="p-6 md:p-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs font-mono text-primary/80 uppercase tracking-wider">
                    Now Playing — Featured Beat
                  </span>
                </div>
                <WaveformPlayer
                  waveformData={featuredBeat.waveformData}
                  title={featuredBeat.title}
                  producer={featuredBeat.producer.name}
                  duration={featuredBeat.duration}
                  bpm={featuredBeat.bpm}
                  musicKey={featuredBeat.key}
                />
                <div className="flex flex-wrap gap-2 mt-4">
                  {featuredBeat.tags.map((tag) => (
                    <span key={tag} className="text-[10px] font-mono text-neutral/40 bg-white/5 px-2 py-0.5 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              </GlassMorphCard>
            </motion.div>
          </div>
        </section>
      )}

      {/* ============ LATEST TUTORIALS ============ */}
      <section className="py-16">
        <div className="container-freq">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-headline font-bold text-white">
                Latest <span className="text-primary glow-text">Tutorials</span>
              </h2>
              <p className="text-sm text-neutral/40 font-mono mt-1">Level up your production skills</p>
            </div>
            <Link href="/tutorials" className="btn-ghost text-xs hidden md:inline-flex" data-cursor="VIEW ALL">
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {tutorials.slice(0, 6).map((tutorial, i) => (
              <TutorialCard key={tutorial.id} tutorial={tutorial} index={i} />
            ))}
          </div>

          <div className="mt-6 text-center md:hidden">
            <Link href="/tutorials" className="btn-ghost text-xs">View All Tutorials →</Link>
          </div>
        </div>
      </section>

      {/* ============ TWO COLUMNS: FREQUENCY CHART + FEATURED PRODUCERS ============ */}
      <section className="py-16 bg-surface/30">
        <div className="container-freq">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Frequency Chart — 3/5 */}
            <div className="lg:col-span-3">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-end gap-[2px] h-5">
                  <div className="w-[2px] h-2 bg-primary rounded-full animate-eq-bar-1" />
                  <div className="w-[2px] h-4 bg-primary rounded-full animate-eq-bar-2" />
                  <div className="w-[2px] h-3 bg-primary rounded-full animate-eq-bar-3" />
                  <div className="w-[2px] h-5 bg-primary rounded-full animate-eq-bar-4" />
                </div>
                <h2 className="text-2xl font-headline font-bold text-white">
                  Frequency <span className="text-primary glow-text">Charts</span>
                </h2>
              </div>
              <GlassMorphCard className="py-2" hoverTilt={false}>
                <FrequencyChart entries={chartEntries} />
              </GlassMorphCard>
            </div>

            {/* Featured Producers — 2/5 */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-headline font-bold text-white">
                  Featured <span className="text-cool">Producers</span>
                </h2>
              </div>
              <div className="space-y-4">
                {producers.slice(0, 3).map((producer, i) => (
                  <ProducerCard key={producer.id} producer={producer} index={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ BEAT SHOWCASE ============ */}
      <section className="py-16">
        <div className="container-freq">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-headline font-bold text-white">
                Beat <span className="text-primary glow-text">Showcase</span>
              </h2>
              <p className="text-sm text-neutral/40 font-mono mt-1">Fresh instrumentals from top producers</p>
            </div>
            <Link href="/beats" className="btn-ghost text-xs hidden md:inline-flex" data-cursor="VIEW ALL">
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {beats.slice(0, 8).map((beat, i) => (
              <BeatCard key={beat.id} beat={beat} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ GEAR REVIEWS ============ */}
      <section className="py-16 bg-surface/30">
        <div className="container-freq">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-headline font-bold text-white">
                Gear <span className="text-accent glow-text-amber">Reviews</span>
              </h2>
              <p className="text-sm text-neutral/40 font-mono mt-1">Equipment that shapes the sound</p>
            </div>
            <Link href="/gear" className="btn-ghost text-xs hidden md:inline-flex" data-cursor="VIEW ALL">
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {gearReviews.slice(0, 4).map((review, i) => (
              <GearReviewCard key={review.id} review={review} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ SAMPLE PACKS ============ */}
      <section className="py-16">
        <div className="container-freq">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-headline font-bold text-white">
                Sample Pack <span className="text-primary glow-text">Spotlight</span>
              </h2>
              <p className="text-sm text-neutral/40 font-mono mt-1">Curated sounds for your next project</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {samplePacks.slice(0, 3).map((pack, i) => (
              <SamplePackCard key={pack.id} pack={pack} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ SUBMIT CTA ============ */}
      <section className="py-20">
        <div className="container-freq">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <GlassMorphCard className="p-8 md:p-12 text-center" glowColor="rgba(57, 255, 20, 0.1)">
              <div className="flex items-center justify-center gap-[3px] h-8 mb-6">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-[3px] bg-primary/40 rounded-full"
                    style={{
                      height: `${Math.sin(i * 0.4) * 50 + 50}%`,
                    }}
                  />
                ))}
              </div>

              <h2 className="text-3xl md:text-4xl font-headline font-bold text-white mb-4">
                Got <span className="text-primary glow-text">Beats</span>?
              </h2>
              <p className="text-lg text-neutral/60 max-w-xl mx-auto mb-8 leading-relaxed">
                Submit your beats, tutorials, or gear reviews. Join the TrapFrequency community
                and get your work in front of thousands of producers.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/submit" className="btn-primary">
                  Submit a Beat
                </Link>
                <Link href="/submit" className="btn-accent">
                  Write for Us
                </Link>
              </div>
            </GlassMorphCard>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
