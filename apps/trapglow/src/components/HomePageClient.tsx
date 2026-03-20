'use client';

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { ArtistCard } from './ArtistCard';
import { GlowUpLeaderboard } from './GlowUpLeaderboard';
import { DailyDiscovery } from './DailyDiscovery';
import { TextReveal } from './TextReveal';
import { GlassMorphCard } from './GlassMorphCard';
import { SponsoredSection } from '@media-network/shared';
import type { Article } from '@media-network/shared';
import type { Artist } from '@/lib/mock-data';
import { formatListeners } from '@/lib/mock-data';

interface HomePageClientProps {
  featuredArtists: Artist[];
  dailyPicks: Artist[];
  leaderboardArtists: Artist[];
  trendingArticles: Article[];
  allArtists: Artist[];
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

/* Gradient placeholder for articles without cover images */
function ArticleGradientPlaceholder({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-gradient-to-br from-primary/40 via-surface to-accent/30 ${className}`}>
      <div className="absolute inset-0 gradient-mesh opacity-60" />
      <div className="absolute inset-0 flex items-center justify-center">
        <svg className="w-10 h-10 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      </div>
    </div>
  );
}

export function HomePageClient({
  featuredArtists,
  dailyPicks,
  leaderboardArtists,
  trendingArticles,
  allArtists,
}: HomePageClientProps) {
  const router = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);
  const [heroImageFailed, setHeroImageFailed] = useState(false);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const handleArtistClick = (artist: Artist) => {
    router.push(`/artist/${artist.slug}`);
  };

  const topFeatured = featuredArtists[0];
  const hasHeroImage = topFeatured?.cover_image;

  // Split articles for hero and list sections
  const heroArticles = trendingArticles.slice(0, 3);
  const listArticles = trendingArticles.slice(0, 5);

  return (
    <>
      {/* Hero section */}
      <section ref={heroRef} className="relative h-[85vh] md:h-[90vh] overflow-hidden">
        {/* Background: artist image with parallax OR animated gradient fallback */}
        {hasHeroImage && !heroImageFailed ? (
          <motion.div style={{ y: heroY, scale: heroScale }} className="absolute inset-0">
            <Image
              src={topFeatured.cover_image}
              alt="TrapGlow Hero"
              fill
              className="object-cover"
              priority
              onError={() => setHeroImageFailed(true)}
            />
          </motion.div>
        ) : (
          /* Animated gradient background fallback */
          <div className="absolute inset-0">
            <div className="hero-animated-gradient" />
            {/* Floating orbs */}
            <div className="hero-orb hero-orb-1" />
            <div className="hero-orb hero-orb-2" />
            <div className="hero-orb hero-orb-3" />
            {/* Mesh grid effect */}
            <div className="absolute inset-0 hero-grid opacity-[0.04]" />
          </div>
        )}

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/70 to-secondary/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 via-transparent to-transparent" />

        {/* Mesh gradient accents */}
        <div className="absolute inset-0 gradient-mesh opacity-40" />

        {/* Hero content */}
        <div className="absolute inset-0 flex items-center">
          <div className="container-glow">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className="max-w-2xl"
            >
              {/* Tagline badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/15 backdrop-blur-sm rounded-full border border-primary/20 mb-6"
              >
                <div className="w-2 h-2 rounded-full bg-accent animate-glow-pulse" />
                <span className="text-xs font-body font-medium text-white/70">Shining Light on What&apos;s Next</span>
              </motion.div>

              <TextReveal
                text="Discover Tomorrow's"
                as="h1"
                className="text-4xl md:text-6xl lg:text-7xl font-accent font-bold text-white leading-tight mb-1"
                speed={40}
              />
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="text-4xl md:text-6xl lg:text-7xl font-accent font-bold text-gradient leading-tight mb-6"
              >
                Biggest Artists
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-lg text-white/50 font-body max-w-lg mb-8 leading-relaxed"
              >
                The premier platform for emerging music talent. Artist spotlights, 
                curated discovery, and the glow up leaderboard — all in one place.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="flex flex-wrap gap-3"
              >
                <Link href="/discover" className="btn-glow">
                  Explore Artists
                  <svg className="w-4 h-4 inline ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link href="/submit" className="btn-ghost">
                  Submit Artist
                </Link>
              </motion.div>
            </motion.div>

            {/* Floating featured artist card (desktop) */}
            {topFeatured && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4, duration: 0.6 }}
                className="hidden xl:block absolute right-8 bottom-24 w-72"
              >
                <GlassMorphCard className="p-4" onClick={() => handleArtistClick(topFeatured)}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary/30">
                      <Image src={topFeatured.avatar} alt={topFeatured.name} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="text-[10px] text-accent font-body uppercase tracking-widest">Now Featured</p>
                      <p className="text-sm font-accent font-bold text-white">{topFeatured.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-white/40 font-body">
                    <span>{formatListeners(topFeatured.monthly_listeners)} listeners</span>
                    <span className="text-accent font-bold">Score: {topFeatured.glow_score}</span>
                  </div>
                  <div className="mt-2 flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-0.5 bg-accent rounded-full waveform-bar" style={{ animationDelay: `${i * 0.12}s` }} />
                    ))}
                  </div>
                </GlassMorphCard>
              </motion.div>
            )}
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] text-white/30 font-body uppercase tracking-[0.3em]">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-2 bg-white/40 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Trending Articles Hero Section — news-style layout */}
      {heroArticles.length > 0 && (
        <section className="section-glow py-12 md:py-16">
          <div className="container-glow">
            <StaggeredSection>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-headline font-bold text-white">Trending Now</h2>
                  <p className="text-sm text-white/40 font-body mt-1">Fresh stories and features</p>
                </div>
                <Link href="/blog" className="text-sm text-accent hover:text-accent/80 font-body transition-colors flex items-center gap-1">
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
                        <Image
                          src={heroArticles[0].cover_image}
                          alt={heroArticles[0].title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <ArticleGradientPlaceholder className="absolute inset-0" />
                      )}
                    </div>
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/60 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-secondary/30 to-transparent" />
                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                      <span className="inline-block px-3 py-1 text-[10px] font-body font-semibold uppercase tracking-wider text-accent bg-accent/10 backdrop-blur-sm rounded-full border border-accent/20 mb-3">
                        {heroArticles[0].category}
                      </span>
                      <h3 className="text-xl md:text-3xl font-headline font-bold text-white leading-tight mb-3 group-hover:text-accent transition-colors line-clamp-3">
                        {heroArticles[0].title}
                      </h3>
                      {heroArticles[0].excerpt && (
                        <p className="text-sm text-white/50 font-body line-clamp-2 mb-4 max-w-lg">
                          {heroArticles[0].excerpt}
                        </p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-white/40 font-body">
                        {heroArticles[0].author && (
                          <div className="flex items-center gap-2">
                            {heroArticles[0].author.avatar_url && (
                              <div className="relative w-6 h-6 rounded-full overflow-hidden ring-1 ring-white/20">
                                <Image src={heroArticles[0].author.avatar_url} alt={heroArticles[0].author.name} fill className="object-cover" />
                              </div>
                            )}
                            <span>{heroArticles[0].author.name}</span>
                          </div>
                        )}
                        <span className="text-white/10">·</span>
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
                        <Image
                          src={article.cover_image}
                          alt={article.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <ArticleGradientPlaceholder className="absolute inset-0" />
                      )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/50 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <span className="inline-block px-2.5 py-0.5 text-[9px] font-body font-semibold uppercase tracking-wider text-accent bg-accent/10 backdrop-blur-sm rounded-full border border-accent/20 mb-2">
                        {article.category}
                      </span>
                      <h3 className="text-base md:text-lg font-headline font-bold text-white leading-snug group-hover:text-accent transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-2 text-[11px] text-white/40 font-body">
                        {article.author && <span>{article.author.name}</span>}
                        <span className="text-white/10">·</span>
                        <span>{article.reading_time_minutes} min read</span>
                      </div>
                    </div>
                  </Link>
                </StaggeredSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured artists section */}
      <section className="section-glow py-16">
        <div className="container-glow">
          <StaggeredSection>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-headline font-bold text-white">Featured Artists</h2>
                <p className="text-sm text-white/40 font-body mt-1">Handpicked by our editors</p>
              </div>
              <Link href="/discover" className="text-sm text-accent hover:text-accent/80 font-body transition-colors flex items-center gap-1">
                View all
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </StaggeredSection>

          {/* Featured spotlight */}
          {featuredArtists[0] && (
            <StaggeredSection className="mb-8" delay={0.1}>
              <ArtistCard
                artist={featuredArtists[0]}
                variant="featured"
                onClick={handleArtistClick}
              />
            </StaggeredSection>
          )}

          {/* Featured grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredArtists.slice(1, 4).map((artist, index) => (
              <StaggeredSection key={artist.id} delay={0.15 + index * 0.08}>
                <ArtistCard
                  artist={artist}
                  variant="default"
                  onClick={handleArtistClick}
                  index={index}
                />
              </StaggeredSection>
            ))}
          </div>
        </div>
      </section>

      {/* Daily Discovery */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary via-glow-deep to-secondary" />
        <div className="container-glow relative z-10">
          <StaggeredSection>
            <DailyDiscovery artists={dailyPicks} onArtistClick={handleArtistClick} />
          </StaggeredSection>
        </div>
      </section>

      {/* Glow Up + Latest articles */}
      <section className="section-glow py-16">
        <div className="container-glow">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Leaderboard */}
            <StaggeredSection className="lg:col-span-1">
              <GlowUpLeaderboard
                artists={leaderboardArtists}
                onArtistClick={handleArtistClick}
              />
            </StaggeredSection>

            {/* Latest articles list */}
            <StaggeredSection className="lg:col-span-2" delay={0.1}>
              <div className="card-glow p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-headline font-bold text-white">Latest Features</h3>
                  <Link href="/blog" className="text-xs text-accent font-body hover:text-accent/80 transition-colors">
                    View all →
                  </Link>
                </div>
                <div className="space-y-4">
                  {listArticles.length > 0 ? (
                    listArticles.map((article, index) => (
                      <motion.div
                        key={article.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.06 }}
                      >
                        <Link href={`/blog/${article.slug}`} className="flex gap-4 p-3 rounded-xl hover:bg-white/5 transition-all group">
                          <div className="relative w-24 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            {article.cover_image ? (
                              <Image src={article.cover_image} alt={article.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                            ) : (
                              <ArticleGradientPlaceholder className="absolute inset-0" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] text-accent font-body uppercase tracking-wider">{article.category}</span>
                            <h4 className="text-sm font-headline font-bold text-white line-clamp-2 group-hover:text-accent transition-colors">
                              {article.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              {article.author && (
                                <>
                                  <span className="text-[11px] text-white/30 font-body">{article.author.name}</span>
                                  <span className="text-white/10">·</span>
                                </>
                              )}
                              <span className="text-[11px] text-white/30 font-body">{article.reading_time_minutes} min</span>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-sm text-white/30 font-body">No articles yet — check back soon.</p>
                    </div>
                  )}
                </div>
              </div>
            </StaggeredSection>
          </div>
        </div>
      </section>

      {/* Sponsored content — native ad cards */}
      <section className="section-glow py-12">
        <div className="container-glow">
          <StaggeredSection>
            <SponsoredSection
              slots={['tg-sponsored-1', 'tg-sponsored-2', 'tg-sponsored-3']}
              headingClass="text-xs font-body text-white/30 uppercase tracking-widest"
              badgeClass="text-white/25 bg-white/5"
            />
          </StaggeredSection>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute inset-0 noise-overlay" />
        <div className="container-glow relative z-10 text-center">
          <StaggeredSection>
            <motion.div className="max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-accent font-bold text-white mb-4">
                Ready to <span className="text-gradient">Glow Up?</span>
              </h2>
              <p className="text-lg text-white/50 font-body mb-8">
                Submit your music and get featured in front of thousands of music fans, 
                industry professionals, and fellow artists.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/submit" className="btn-glow text-lg px-8 py-4">
                  Submit Your Music ✨
                </Link>
                <Link href="/write" className="btn-ghost text-lg px-8 py-4">
                  Write for TrapGlow
                </Link>
              </div>
            </motion.div>
          </StaggeredSection>
        </div>
      </section>

      {/* Network bar */}
      <section className="border-t border-white/[0.06] py-8">
        <div className="container-glow">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-xs text-white/20 font-body uppercase tracking-widest">The Media Network</span>
            <div className="flex flex-wrap justify-center gap-6">
              {[
                { name: 'SauceCaviar', color: '#C9A84C', tagline: 'Culture Served Premium' },
                { name: 'SauceWire', color: '#E63946', tagline: 'Culture Connected Now' },
                { name: 'TrapFrequency', color: '#39FF14', tagline: 'Tune Into The Craft' },
              ].map((brand) => (
                <div key={brand.name} className="flex items-center gap-2 opacity-40 hover:opacity-80 transition-opacity cursor-pointer">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: brand.color }} />
                  <span className="text-xs text-white font-body font-medium">{brand.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
