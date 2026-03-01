'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useBrand } from '@/contexts/BrandContext';
import type { Brand } from '@media-network/shared';

const BRAND_COLORS: Record<string, string> = {
  saucewire: '#E63946',
  saucecaviar: '#C9A84C',
  trapglow: '#8B5CF6',
  trapfrequency: '#39FF14',
};

const BRAND_NAMES: Record<string, string> = {
  saucewire: 'SauceWire',
  saucecaviar: 'SauceCaviar',
  trapglow: 'TrapGlow',
  trapfrequency: 'TrapFrequency',
};

interface SEOArticle {
  id: string;
  title: string;
  slug: string;
  brand: string;
  seo_title: string | null;
  seo_description: string | null;
  focus_keyword: string | null;
  seo_score: number;
  rules: Array<{
    id: string;
    label: string;
    passed: boolean;
    suggestion: string;
  }>;
  published_at: string | null;
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? 'text-emerald-400 bg-emerald-500/10' :
                score >= 60 ? 'text-yellow-400 bg-yellow-500/10' :
                score >= 40 ? 'text-orange-400 bg-orange-500/10' :
                              'text-red-400 bg-red-500/10';
  return (
    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${color}`}>
      {score}
    </span>
  );
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 80 ? '#10B981' : score >= 60 ? '#F59E0B' : score >= 40 ? '#F97316' : '#EF4444';
  return (
    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}

export function SEODashboard() {
  const { activeBrand } = useBrand();
  const [articles, setArticles] = useState<SEOArticle[]>([]);
  const [avgScore, setAvgScore] = useState(0);
  const [needsImprovement, setNeedsImprovement] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchScores() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (activeBrand !== 'all') params.set('brand', activeBrand);

        const res = await fetch(`/api/seo/scores?${params}`);
        const data = await res.json();

        setArticles(data.articles || []);
        setAvgScore(data.average_score || 0);
        setNeedsImprovement(data.needs_improvement || 0);
        setTotal(data.total || 0);
      } catch (err) {
        console.error('Failed to fetch SEO scores:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchScores();
  }, [activeBrand]);

  const scoreDistribution = {
    excellent: articles.filter(a => a.seo_score >= 80).length,
    good: articles.filter(a => a.seo_score >= 60 && a.seo_score < 80).length,
    fair: articles.filter(a => a.seo_score >= 40 && a.seo_score < 60).length,
    poor: articles.filter(a => a.seo_score < 40).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">SEO Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Search engine optimization scores and recommendations
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Average Score',
            value: loading ? '...' : `${avgScore}/100`,
            icon: '📊',
            color: avgScore >= 60 ? '#10B981' : '#F59E0B',
          },
          {
            label: 'Total Articles',
            value: loading ? '...' : total,
            icon: '📝',
            color: '#3B82F6',
          },
          {
            label: 'Needs Improvement',
            value: loading ? '...' : needsImprovement,
            icon: '⚠️',
            color: '#F97316',
          },
          {
            label: 'Excellent (80+)',
            value: loading ? '...' : scoreDistribution.excellent,
            icon: '✅',
            color: '#10B981',
          },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="stat-card"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl">{card.icon}</span>
            </div>
            <p className="text-2xl font-bold text-white">{card.value}</p>
            <p className="text-sm text-gray-500">{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Score Distribution */}
      {!loading && (
        <div className="glass-panel p-5">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Score Distribution</h3>
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Excellent (80-100)', count: scoreDistribution.excellent, color: '#10B981' },
              { label: 'Good (60-79)', count: scoreDistribution.good, color: '#F59E0B' },
              { label: 'Fair (40-59)', count: scoreDistribution.fair, color: '#F97316' },
              { label: 'Poor (0-39)', count: scoreDistribution.poor, color: '#EF4444' },
            ].map(d => (
              <div key={d.label} className="text-center">
                <div
                  className="text-3xl font-bold mb-1"
                  style={{ color: d.color }}
                >
                  {d.count}
                </div>
                <p className="text-xs text-gray-500">{d.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Average Score Bar */}
      {!loading && (
        <div className="glass-panel p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Network Average
            </h3>
            <ScoreBadge score={avgScore} />
          </div>
          <ScoreBar score={avgScore} />
        </div>
      )}

      {/* Articles List */}
      <div className="glass-panel overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06]">
          <h3 className="text-sm font-semibold text-white">
            All Articles — Sorted by Score (worst first)
          </h3>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : articles.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No published articles to score</p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {articles.map((article, i) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.02 }}
              >
                <div
                  className="px-6 py-4 hover:bg-white/[0.02] transition-colors cursor-pointer"
                  onClick={() => setExpandedId(expandedId === article.id ? null : article.id)}
                >
                  <div className="flex items-center gap-4">
                    <ScoreBadge score={article.seo_score} />
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: BRAND_COLORS[article.brand] || '#888' }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {article.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {BRAND_NAMES[article.brand]} · /{article.slug}
                      </p>
                    </div>
                    <div className="w-32">
                      <ScoreBar score={article.seo_score} />
                    </div>
                    <div className="flex gap-2 items-center">
                      {article.focus_keyword && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400">
                          {article.focus_keyword}
                        </span>
                      )}
                      <Link
                        href={`/dashboard/content/${article.id}/edit`}
                        className="text-xs text-blue-400 hover:text-blue-300"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Expanded Rules */}
                {expandedId === article.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-6 pb-4"
                  >
                    <div className="ml-12 space-y-2 bg-white/[0.02] rounded-lg p-4">
                      <h4 className="text-xs font-semibold text-gray-400 uppercase mb-3">
                        SEO Checklist
                      </h4>
                      {article.rules.map(rule => (
                        <div key={rule.id} className="flex items-start gap-2">
                          <span className={`text-sm flex-shrink-0 ${rule.passed ? 'text-emerald-400' : 'text-red-400'}`}>
                            {rule.passed ? '✅' : '❌'}
                          </span>
                          <div>
                            <p className={`text-sm ${rule.passed ? 'text-gray-300' : 'text-white'}`}>
                              {rule.label}
                            </p>
                            <p className="text-xs text-gray-500">{rule.suggestion}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
