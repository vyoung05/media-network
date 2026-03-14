'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import type { MagazineIssue } from '@/lib/mock-data';
import type { Article } from '@media-network/shared';
import { SponsoredSection } from '@media-network/shared';
import { IssueCard } from './IssueCard';
import { SubscribeForm } from './SubscribeForm';
import { TextReveal } from './TextReveal';
import { GlassMorphCard } from './GlassMorphCard';
import { TrendingArticles } from './TrendingArticles';

interface HomePageClientProps {
  latestIssue: MagazineIssue;
  allIssues: MagazineIssue[];
  trendingArticles?: Article[];
}

// Hero images representing luxury lifestyle (fashion, cityscape, art, culture)
const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1920&h=1080&fit=crop', // Fashion editorial
  'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1920&h=1080&fit=crop', // Luxury style
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1920&h=1080&fit=crop', // Nightlife/music
  'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1920&h=1080&fit=crop', // Fashion runway
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1920&h=1080&fit=crop', // Portrait editorial
];

export function HomePageClient({ latestIssue, allIssues, trendingArticles = [] }: HomePageClientProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  // Rotating hero image
  const [heroIndex, setHeroIndex] = useState(0);

  // Determine hero image: use latest trending article cover, or rotate through lifestyle images
  const heroImages = React.useMemo(() => {
    const articleImages = trendingArticles
      .filter(a => a.cover_image)
      .slice(0, 3)
      .map(a => a.cover_image!);
    return articleImages.length > 0
      ? [...articleImages, ...HERO_IMAGES.slice(0, 2)]
      : HERO_IMAGES;
  }, [trendingArticles]);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  // Featured trending article for hero overlay
  const featuredArticle = trendingArticles.length > 0 ? trendingArticles[0] : null;

  return (
    <div>
      {/* ============ HERO — Rotating Lifestyle Images ============ */}
      <section ref={heroRef} className="relative h-screen overflow-hidden">
        {/* Background image with Ken Burns + rotation */}
        <motion.div
          className="absolute inset-0"
          style={{ scale: heroScale }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={heroIndex}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
            >
              <Image
                src={heroImages[heroIndex]}
                alt="SauceCaviar — Culture Served Premium"
                fill
                className="object-cover"
                priority={heroIndex === 0}
                sizes="100vw"
              />
            </motion.div>
          </AnimatePresence>
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
            {/* Context label */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-8 h-px bg-primary" />
              <span className="text-[10px] tracking-[0.4em] uppercase text-primary font-body">
                {featuredArticle
                  ? `Trending — ${featuredArticle.category}`
                  : `Latest Issue — #${latestIssue.issueNumber}`
                }
              </span>
            </motion.div>

            {/* Title — show featured article or latest issue */}
            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-headline text-text leading-[0.95] tracking-wide max-w-3xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {featuredArticle ? featuredArticle.title : latestIssue.title}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="mt-4 text-lg md:text-xl font-accent italic text-primary/80 max-w-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              {featuredArticle
                ? (featuredArticle.excerpt || 'Culture Served Premium')
                : latestIssue.subtitle
              }
            </motion.p>

            {/* Description — only show for issue mode */}
            {!featuredArticle && (
              <motion.p
                className="mt-4 text-sm text-text/40 font-body max-w-lg leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                {latestIssue.description}
              </motion.p>
            )}

            {/* CTA */}
            <motion.div
              className="mt-8 flex items-center gap-4"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              {featuredArticle ? (
                <>
                  <Link href={`/articles/${featuredArticle.slug}`}>
                    <motion.span
                      className="btn-primary inline-block"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      data-cursor="Read"
                    >
                      Read Story
                    </motion.span>
                  </Link>
                  <Link href={`/issues/${latestIssue.slug}`}>
                    <motion.span
                      className="btn-ghost inline-block"
                      whileHover={{ scale: 1.03 }}
                      data-cursor="Issue"
                    >
                      Latest Issue
                    </motion.span>
                  </Link>
                </>
              ) : (
                <>
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
                </>
              )}
            </motion.div>

            {/* Meta info */}
            <motion.div
              className="mt-8 flex items-center gap-6 text-[9px] tracking-[0.2em] uppercase text-text/20 font-body"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              {featuredArticle ? (
                <>
                  <span>{featuredArticle.author?.name || 'SauceCaviar'}</span>
                  <span className="w-1 h-1 rounded-full bg-primary/30" />
                  <span>{featuredArticle.reading_time_minutes} min read</span>
                  <span className="w-1 h-1 rounded-full bg-primary/30" />
                  <span>{featuredArticle.category}</span>
                </>
              ) : (
                <>
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
                </>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Image rotation indicators */}
        <div className="absolute bottom-8 right-8 flex gap-1.5 z-10">
          {heroImages.slice(0, 5).map((_, i) => (
            <button
              key={i}
              onClick={() => setHeroIndex(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                i === heroIndex ? 'bg-primary w-6' : 'bg-text/20 hover:bg-text/40'
              }`}
              aria-label={`Show image ${i + 1}`}
            />
          ))}
        </div>

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
              SauceCaviar is not a blog. It&apos;s not a feed. It&apos;s a curated editorial
              destination — where fashion, music, art, and luxury lifestyle converge.
              Every story is crafted with the precision of a luxury brand.
            </p>
            <p className="mt-4 text-sm text-text/25 font-body max-w-xl mx-auto leading-relaxed">
              From runway reports and artist features to watchmaking and architecture —
              we treat culture like the art form it is.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============ TRENDING ARTICLES — Real Supabase Content ============ */}
      {trendingArticles.length > 0 && (
        <TrendingArticles articles={trendingArticles} />
      )}

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
                Digital Magazine
              </p>
              <h2 className="text-3xl md:text-4xl font-headline text-text tracking-wide">
                Magazine Issues
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
                icon: '👗',
                title: 'Fashion & Style',
                desc: 'Runway reports, streetwear culture, designer collaborations, and the people redefining how we dress.',
              },
              {
                icon: '🎵',
                title: 'Music & Sound',
                desc: 'Artist features, album deep dives, producer spotlights, and the sonic landscape of modern culture.',
              },
              {
                icon: '✨',
                title: 'Luxury & Culture',
                desc: 'Watches, cars, travel, art, architecture, and the finer things — curated with editorial precision.',
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

      {/* ============ SPONSORED CONTENT ============ */}
      <section className="py-16 md:py-20 bg-secondary">
        <div className="container-caviar">
          <SponsoredSection
            slots={['sc-sponsored-1', 'sc-sponsored-2', 'sc-sponsored-3']}
            title="From Our Partners"
            headingClass="text-[10px] tracking-[0.3em] uppercase text-primary/40 font-body"
            badgeClass="text-text/20 bg-surface/30"
          />
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
