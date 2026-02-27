'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useInView } from 'framer-motion';
import type { Article } from '@media-network/shared';
import { SAUCEWIRE_CATEGORIES } from '@media-network/shared';
import { BreakingBanner } from '@media-network/ui';
import { CategoryFilter } from '@media-network/ui';
import { NewsFeed } from '@media-network/ui';
import { ArticleCard } from '@media-network/ui';
import { TrendingSidebar } from './TrendingSidebar';

interface HomePageClientProps {
  articles: Article[];
  breakingArticles: Article[];
  trendingArticles: Article[];
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
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function HomePageClient({
  articles,
  breakingArticles,
  trendingArticles,
}: HomePageClientProps) {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleArticleClick = (article: Article) => {
    router.push(`/${article.slug}`);
  };

  const handleCategoryClick = (category: string) => {
    router.push(`/category/${category.toLowerCase()}`);
  };

  // Featured article (first article)
  const featuredArticle = articles[0];
  const remainingArticles = articles.slice(1);

  return (
    <>
      {/* Breaking news banner */}
      <BreakingBanner
        articles={breakingArticles}
        onArticleClick={handleArticleClick}
      />

      {/* Tagline bar */}
      <div className="bg-surface border-b border-gray-800">
        <div className="container-wire py-3 flex items-center justify-between">
          <p className="text-xs font-mono text-neutral uppercase tracking-[0.2em]">
            Culture. Connected. Now.
          </p>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs font-mono text-green-400">LIVE</span>
          </div>
        </div>
      </div>

      <div className="container-wire py-6">
        {/* Featured article */}
        {featuredArticle && (
          <StaggeredSection className="mb-8">
            <ArticleCard
              article={featuredArticle}
              variant="featured"
              onClick={handleArticleClick}
              onCategoryClick={handleCategoryClick}
            />
          </StaggeredSection>
        )}

        {/* Category filter */}
        <StaggeredSection className="mb-6" delay={0.1}>
          <CategoryFilter
            categories={SAUCEWIRE_CATEGORIES}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </StaggeredSection>

        {/* Main layout: Feed + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Feed */}
          <StaggeredSection className="lg:col-span-2" delay={0.15}>
            <div className="bg-surface rounded-lg border border-gray-800/50 overflow-hidden">
              <NewsFeed
                brand="saucewire"
                articles={remainingArticles}
                category={activeCategory}
                onArticleClick={handleArticleClick}
                onCategoryClick={handleCategoryClick}
                autoRefreshInterval={30000}
              />
            </div>
          </StaggeredSection>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <StaggeredSection delay={0.2}>
              <TrendingSidebar articles={trendingArticles} />
            </StaggeredSection>

            {/* Submit tip CTA */}
            <StaggeredSection delay={0.25}>
              <div className="bg-surface rounded-lg border border-gray-800/50 p-6 text-center">
                <h3 className="text-lg font-headline text-white mb-2">Got a Story?</h3>
                <p className="text-sm text-neutral mb-4">
                  Know something the culture needs to hear? Drop us a tip.
                </p>
                <a
                  href="/submit"
                  className="inline-block w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors text-center"
                >
                  Submit a Tip
                </a>
              </div>
            </StaggeredSection>

            {/* Network promo */}
            <StaggeredSection delay={0.3}>
              <div className="bg-gradient-to-br from-surface to-secondary rounded-lg border border-gray-800/50 p-6">
                <h4 className="text-xs font-mono text-neutral uppercase tracking-wider mb-3">
                  The Network
                </h4>
                <div className="space-y-2">
                  {[
                    { name: 'SauceCaviar', tagline: 'Culture Served Premium', color: '#C9A84C' },
                    { name: 'TrapGlow', tagline: 'Shining Light on What\'s Next', color: '#8B5CF6' },
                    { name: 'TrapFrequency', tagline: 'Tune Into The Craft', color: '#39FF14' },
                  ].map((brand) => (
                    <motion.div
                      key={brand.name}
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-3 py-2 px-3 rounded hover:bg-secondary/50 transition-colors cursor-pointer"
                    >
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: brand.color }}
                      />
                      <div>
                        <span className="text-sm font-bold text-white">{brand.name}</span>
                        <span className="text-xs text-neutral ml-2">{brand.tagline}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </StaggeredSection>
          </div>
        </div>
      </div>
    </>
  );
}
