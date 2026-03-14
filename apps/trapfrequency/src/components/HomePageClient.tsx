'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { TextReveal } from './TextReveal';
import { GlassMorphCard } from './GlassMorphCard';
import { TutorialCard } from './TutorialCard';
import { BeatCard } from './BeatCard';
import { GearReviewCard } from './GearReviewCard';
import { ProducerCard } from './ProducerCard';
import { FrequencyChart } from './FrequencyChart';
import { SamplePackCard } from './SamplePackCard';
import { WaveformPlayer } from './WaveformPlayer';
import { SponsoredSection } from '@media-network/shared';
import type { Article } from '@media-network/shared';
import type { Tutorial, Beat, GearReview, Producer, FrequencyChartEntry, SamplePack } from '@/lib/mock-data';

interface HomePageClientProps {
  tutorials: Tutorial[];
  beats: Beat[];
  gearReviews: GearReview[];
  producers: Producer[];
  chartEntries: FrequencyChartEntry[];
  samplePacks: SamplePack[];
  trendingArticles: Article[];
}

/* Gradient placeholder for articles without cover images */
function ArticleGradientPlaceholder({ category, className = '' }: { category?: string; className?: string }) {
  return (
    <div className={`bg-gradient-to-br from-primary/30 via-surface to-cool/20 ${className}`}>
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
        <div className="flex items-end gap-[2px] h-8 opacity-30">
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className="w-[2px] bg-primary rounded-full"
              style={{ height: `${Math.sin(i * 0.5) * 60 + 40}%` }}
            />
          ))}
        </div>
        {category && (
          <span className="text-[10px] font-mono text-white/30 uppercase tracking-wider">
            {category}
          </span>
        )}
      </div>
    </div>
  );
}

/* Graceful image with fallback */
function SafeImage({ src, alt, className = '', category }: { src: string | null; alt: string; className?: string; category?: string }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <ArticleGradientPlaceholder category={category} className={`absolute inset-0 ${className}`} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={`object-cover w-full h-full ${className}`}
      onError={() => setFailed(true)}
    />
  );
}

function StaggeredSection({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function HomePageClient({
  tutorials,
  beats,
  gearReviews,
  producers,
  chartEntries,
  samplePacks,
  trendingArticles,
}: HomePageClientProps) {
  const featuredBeat = beats[0];

  // Rotating hero article ticker
  const [heroArticleIndex, setHeroArticleIndex] = useState(0);
  useEffect(() => {
    if (trendingArticles.length <= 1) return;
    const interval = setInterval(() => {
      setHeroArticleIndex((prev) => (prev + 1) % Math.min(trendingArticles.length, 4));
    }, 5000);
    return () => clearInterval(interval);
  }, [trendingArticles.length]);

  const heroArticle = trendingArticles[heroArticleIndex];
  const heroArticles = trendingArticles.slice(0, 3);
  const gridArticles = trendingArticles.slice(1, 6);

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
              className="text-lg md:text-xl text-neutral/60 font-body max-w-2xl mx-auto mb-8 leading-relaxed"
            >
              Tutorials, beats, gear reviews, and producer spotlights.
              Everything you need to level up your production game.
            </motion.p>

            {/* Dynamic featured article ticker in the hero */}
            {heroArticle && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="mb-8"
              >
                <Link href={`/blog/${heroArticle.slug}`} className="group">
                  <div className="inline-flex items-center gap-3 bg-white/[0.04] backdrop-blur-sm border border-primary/15 rounded-xl px-5 py-3 hover:border-primary/30 transition-all max-w-2xl mx-auto">
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <span className="text-[10px] font-mono text-primary/70 uppercase tracking-wider">Trending</span>
                    </div>
                    <div className="h-4 w-px bg-primary/20 flex-shrink-0" />
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={heroArticleIndex}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.3 }}
                        className="text-sm text-white/70 font-body group-hover:text-primary/90 transition-colors text-left line-clamp-1"
                      >
                        {heroArticle.title}
                      </motion.span>
                    </AnimatePresence>
                    <svg className="w-4 h-4 text-primary/40 flex-shrink-0 group-hover:text-primary/70 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/blog" className="btn-primary">
                Read Latest Articles
              </Link>
              <Link href="/tutorials" className="btn-ghost">
                Browse Tutorials
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
                { value: `${trendingArticles.length > 0 ? '22+' : '0'}`, label: 'Articles' },
                { value: '500+', label: 'Tutorials' },
                { value: '2.5K+', label: 'Beats' },
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

      {/* ============ TRENDING ARTICLES ============ */}
      {heroArticles.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="container-freq">
            <StaggeredSection>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <div className="flex items-end gap-[2px] h-5">
                      <div className="w-[2px] h-2 bg-primary rounded-full animate-eq-bar-1" />
                      <div className="w-[2px] h-4 bg-primary rounded-full animate-eq-bar-2" />
                      <div className="w-[2px] h-3 bg-primary rounded-full animate-eq-bar-3" />
                      <div className="w-[2px] h-5 bg-primary rounded-full animate-eq-bar-4" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-headline font-bold text-white">
                      Trending <span className="text-primary glow-text">Now</span>
                    </h2>
                  </div>
                  <p className="text-sm text-neutral/40 font-mono mt-1">Fresh stories and deep dives</p>
                </div>
                <Link href="/blog" className="btn-ghost text-xs hidden md:inline-flex items-center gap-1" data-cursor="VIEW ALL">
                  All articles
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </StaggeredSection>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Main featured article — big card */}
              {heroArticles[0] && (
                <StaggeredSection className="lg:row-span-2" delay={0.1}>
                  <Link href={`/blog/${heroArticles[0].slug}`} className="group block relative h-full min-h-[360px] md:min-h-[460px] rounded-2xl overflow-hidden">
                    <div className="absolute inset-0">
                      {heroArticles[0].cover_image ? (
                        <SafeImage
                          src={heroArticles[0].cover_image}
                          alt={heroArticles[0].title}
                          category={heroArticles[0].category}
                          className="transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <ArticleGradientPlaceholder category={heroArticles[0].category} className="absolute inset-0" />
                      )}
                    </div>
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/60 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-secondary/30 to-transparent" />
                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                      <span className="inline-block px-3 py-1 text-[10px] font-mono font-semibold uppercase tracking-wider text-primary bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20 mb-3">
                        {heroArticles[0].category}
                      </span>
                      <h3 className="text-xl md:text-3xl font-headline font-bold text-white leading-tight mb-3 group-hover:text-primary transition-colors line-clamp-3">
                        {heroArticles[0].title}
                      </h3>
                      {heroArticles[0].excerpt && (
                        <p className="text-sm text-white/50 font-body line-clamp-2 mb-4 max-w-lg">
                          {heroArticles[0].excerpt}
                        </p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-white/40 font-mono">
                        {heroArticles[0].author && (
                          <span>{heroArticles[0].author.name}</span>
                        )}
                        <span className="text-white/20">·</span>
                        <span>{heroArticles[0].reading_time_minutes} min read</span>
                      </div>
                    </div>
                  </Link>
                </StaggeredSection>
              )}

              {/* Secondary hero articles — smaller cards stacked */}
              {heroArticles.slice(1, 3).map((article, index) => (
                <StaggeredSection key={article.id} delay={0.2 + index * 0.1}>
                  <Link href={`/blog/${article.slug}`} className="group block relative h-[200px] md:h-[220px] rounded-2xl overflow-hidden">
                    <div className="absolute inset-0">
                      {article.cover_image ? (
                        <SafeImage
                          src={article.cover_image}
                          alt={article.title}
                          category={article.category}
                          className="transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <ArticleGradientPlaceholder category={article.category} className="absolute inset-0" />
                      )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/50 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <span className="inline-block px-2.5 py-0.5 text-[9px] font-mono font-semibold uppercase tracking-wider text-primary bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20 mb-2">
                        {article.category}
                      </span>
                      <h3 className="text-base md:text-lg font-headline font-bold text-white leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-2 text-[11px] text-white/40 font-mono">
                        {article.author && <span>{article.author.name}</span>}
                        <span className="text-white/20">·</span>
                        <span>{article.reading_time_minutes} min read</span>
                      </div>
                    </div>
                  </Link>
                </StaggeredSection>
              ))}
            </div>

            {/* Additional article cards in a row below */}
            {gridArticles.length > 2 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
                {gridArticles.slice(2, 5).map((article, i) => (
                  <StaggeredSection key={article.id} delay={0.1 + i * 0.05}>
                    <Link href={`/blog/${article.slug}`} className="group block">
                      <GlassMorphCard className="h-full">
                        <div className="relative h-40 overflow-hidden">
                          {article.cover_image ? (
                            <SafeImage
                              src={article.cover_image}
                              alt={article.title}
                              category={article.category}
                              className="transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <ArticleGradientPlaceholder category={article.category} className="absolute inset-0" />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-surface/90 to-transparent" />
                          <div className="absolute top-3 left-3">
                            <span className="text-[9px] font-mono text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded uppercase tracking-wider">
                              {article.category}
                            </span>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="text-sm font-bold text-white group-hover:text-primary transition-colors line-clamp-2 mb-2 leading-snug">
                            {article.title}
                          </h3>
                          {article.excerpt && (
                            <p className="text-xs text-neutral/50 line-clamp-2 mb-3 leading-relaxed">
                              {article.excerpt}
                            </p>
                          )}
                          <div className="flex items-center justify-between pt-3 border-t border-primary/10">
                            <div className="flex items-center gap-2">
                              {article.author && (
                                <>
                                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                                    <span className="text-[9px] font-bold text-primary">
                                      {article.author.name.charAt(0)}
                                    </span>
                                  </div>
                                  <span className="text-[10px] text-neutral/50 font-mono">{article.author.name}</span>
                                </>
                              )}
                            </div>
                            <span className="text-[10px] text-neutral/40 font-mono">{article.reading_time_minutes} min</span>
                          </div>
                        </div>
                      </GlassMorphCard>
                    </Link>
                  </StaggeredSection>
                ))}
              </div>
            )}

            <div className="mt-6 text-center md:hidden">
              <Link href="/blog" className="btn-ghost text-xs">View All Articles →</Link>
            </div>
          </div>
        </section>
      )}

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

            {/* Featured Producers + Latest Articles sidebar — 2/5 */}
            <div className="lg:col-span-2">
              {/* Latest articles list */}
              {trendingArticles.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-headline font-bold text-white">
                      Latest <span className="text-primary">Features</span>
                    </h3>
                    <Link href="/blog" className="text-[10px] text-primary font-mono hover:text-primary/80 transition-colors uppercase tracking-wider">
                      View all →
                    </Link>
                  </div>
                  <GlassMorphCard className="p-4" hoverTilt={false}>
                    <div className="space-y-3">
                      {trendingArticles.slice(0, 4).map((article, index) => (
                        <motion.div
                          key={article.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.06 }}
                        >
                          <Link href={`/blog/${article.slug}`} className="flex gap-3 p-2 rounded-lg hover:bg-white/5 transition-all group">
                            <div className="relative w-20 h-14 rounded-lg overflow-hidden flex-shrink-0">
                              {article.cover_image ? (
                                <SafeImage
                                  src={article.cover_image}
                                  alt={article.title}
                                  category={article.category}
                                  className="transition-transform duration-500 group-hover:scale-110"
                                />
                              ) : (
                                <ArticleGradientPlaceholder category={article.category} className="absolute inset-0" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-[9px] text-primary font-mono uppercase tracking-wider">{article.category}</span>
                              <h4 className="text-xs font-bold text-white line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                                {article.title}
                              </h4>
                              <span className="text-[10px] text-neutral/30 font-mono">{article.reading_time_minutes} min</span>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </GlassMorphCard>
                </div>
              )}

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

      {/* ============ SPONSORED CONTENT ============ */}
      <section className="py-12">
        <div className="container-freq">
          <SponsoredSection
            slots={['tf-sponsored-1', 'tf-sponsored-2', 'tf-sponsored-3']}
            headingClass="text-xs font-mono text-neutral/30 uppercase tracking-wider"
            badgeClass="text-primary/30 bg-primary/5"
          />
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
