'use client';

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SEORule } from '@media-network/shared';

interface SEOPanelProps {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  coverImage: string;
  focusKeyword: string;
  seoTitle: string;
  seoDescription: string;
  onSeoTitleChange: (val: string) => void;
  onSeoDescriptionChange: (val: string) => void;
  onFocusKeywordChange: (val: string) => void;
  brand: string;
  brandDomain?: string;
}

const BRAND_COLORS: Record<string, string> = {
  saucewire: '#E63946',
  saucecaviar: '#C9A84C',
  trapglow: '#8B5CF6',
  trapfrequency: '#39FF14',
};

function calculateSEOScore(props: {
  title: string;
  seoTitle: string;
  seoDescription: string;
  focusKeyword: string;
  body: string;
  slug: string;
  coverImage: string;
  excerpt: string;
}): { score: number; rules: SEORule[] } {
  const rules: SEORule[] = [];
  let passed = 0;
  const total = 9;

  const effectiveTitle = props.seoTitle || props.title || '';
  const effectiveDesc = props.seoDescription || props.excerpt || '';
  const keyword = (props.focusKeyword || '').toLowerCase();

  // 1. Title length
  const titleLen = effectiveTitle.length;
  const titleOk = titleLen >= 50 && titleLen <= 60;
  rules.push({
    id: 'title_length',
    label: `Title length (${titleLen}/60)`,
    passed: titleOk,
    suggestion: titleOk ? 'Perfect title length!' : titleLen < 50 ? 'Title is too short. Aim for 50-60 characters.' : 'Title is too long. Keep it under 60 characters.',
  });
  if (titleOk) passed++;

  // 2. Meta description
  const descLen = effectiveDesc.length;
  const descOk = descLen >= 120 && descLen <= 160;
  rules.push({
    id: 'meta_description',
    label: `Meta description (${descLen}/160)`,
    passed: descOk,
    suggestion: descOk ? 'Great description length!' : descLen < 120 ? 'Description is too short. Aim for 120-160 characters.' : 'Description is too long. Keep it under 160 characters.',
  });
  if (descOk) passed++;

  // 3. Keyword in title
  const kwInTitle = keyword && effectiveTitle.toLowerCase().includes(keyword);
  rules.push({
    id: 'keyword_in_title',
    label: 'Focus keyword in title',
    passed: !!kwInTitle,
    suggestion: kwInTitle ? 'Keyword found in title!' : keyword ? `Add "${props.focusKeyword}" to your title.` : 'Set a focus keyword first.',
  });
  if (kwInTitle) passed++;

  // 4. Keyword in first paragraph
  const firstPara = props.body.split('\n').find(p => p.trim().length > 0) || '';
  const kwInFirst = keyword && firstPara.toLowerCase().includes(keyword);
  rules.push({
    id: 'keyword_in_first_para',
    label: 'Focus keyword in first paragraph',
    passed: !!kwInFirst,
    suggestion: kwInFirst ? 'Keyword in opening paragraph!' : 'Include focus keyword in the first paragraph of your content.',
  });
  if (kwInFirst) passed++;

  // 5. Keyword in meta description
  const kwInDesc = keyword && effectiveDesc.toLowerCase().includes(keyword);
  rules.push({
    id: 'keyword_in_description',
    label: 'Focus keyword in meta description',
    passed: !!kwInDesc,
    suggestion: kwInDesc ? 'Keyword in description!' : 'Add your focus keyword to the meta description.',
  });
  if (kwInDesc) passed++;

  // 6. Content length
  const wordCount = props.body.trim().split(/\s+/).length;
  const longEnough = wordCount > 300;
  rules.push({
    id: 'content_length',
    label: `Content length (${wordCount} words)`,
    passed: longEnough,
    suggestion: longEnough ? 'Good content length!' : `Only ${wordCount} words. Aim for at least 300.`,
  });
  if (longEnough) passed++;

  // 7. Has image
  const hasImage = !!props.coverImage;
  rules.push({
    id: 'has_image',
    label: 'Cover image set',
    passed: hasImage,
    suggestion: hasImage ? 'Cover image detected!' : 'Add a cover image for better SEO and social sharing.',
  });
  if (hasImage) passed++;

  // 8. Has links
  const hasLinks = props.body.includes('href=') || props.body.includes('<a ');
  rules.push({
    id: 'has_links',
    label: 'Internal/external links',
    passed: hasLinks,
    suggestion: hasLinks ? 'Links found in content!' : 'Add links to related articles or external sources.',
  });
  if (hasLinks) passed++;

  // 9. Readable slug
  const slugOk = props.slug.length > 0 && props.slug.length < 80 && /^[a-z0-9-]+$/.test(props.slug);
  rules.push({
    id: 'readable_slug',
    label: 'URL slug',
    passed: slugOk,
    suggestion: slugOk ? 'Clean URL slug!' : 'Keep your slug short, lowercase, with hyphens only.',
  });
  if (slugOk) passed++;

  return { score: Math.round((passed / total) * 100), rules };
}

function ScoreCircle({ score }: { score: number }) {
  const color = score >= 80 ? '#10B981' : score >= 60 ? '#F59E0B' : score >= 40 ? '#F97316' : '#EF4444';
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg className="w-24 h-24 transform -rotate-90">
        <circle cx="48" cy="48" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
        <motion.circle
          cx="48" cy="48" r={radius} fill="none"
          stroke={color} strokeWidth="6" strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-bold text-white">{score}</span>
      </div>
    </div>
  );
}

export function SEOPanel(props: SEOPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<'seo' | 'social'>('seo');

  const { score, rules } = useMemo(() => calculateSEOScore({
    title: props.title,
    seoTitle: props.seoTitle,
    seoDescription: props.seoDescription,
    focusKeyword: props.focusKeyword,
    body: props.body,
    slug: props.slug,
    coverImage: props.coverImage,
    excerpt: props.excerpt,
  }), [props.title, props.seoTitle, props.seoDescription, props.focusKeyword, props.body, props.slug, props.coverImage, props.excerpt]);

  const brandColor = BRAND_COLORS[props.brand] || '#3B82F6';
  const brandDomain = props.brandDomain || `${props.brand}.com`;
  const effectiveTitle = props.seoTitle || props.title || 'Page Title';
  const effectiveDesc = props.seoDescription || props.excerpt || 'Page description will appear here...';

  return (
    <div className="glass-panel overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-5 py-3 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">🔍</span>
          <h3 className="text-sm font-semibold text-white">SEO Optimization</h3>
          <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${
            score >= 80 ? 'bg-emerald-500/10 text-emerald-400' :
            score >= 60 ? 'bg-yellow-500/10 text-yellow-400' :
            'bg-red-500/10 text-red-400'
          }`}>
            {score}/100
          </span>
        </div>
        <span className="text-gray-500 text-xs">{isExpanded ? '▲' : '▼'}</span>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {/* Tabs */}
            <div className="px-5 flex gap-4 border-b border-white/[0.06]">
              {[
                { id: 'seo' as const, label: 'SEO Fields' },
                { id: 'social' as const, label: 'Social Preview' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 text-xs font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-white'
                      : 'border-transparent text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-5 space-y-4">
              {activeTab === 'seo' && (
                <>
                  {/* Score + Fields */}
                  <div className="flex gap-6">
                    <ScoreCircle score={score} />
                    <div className="flex-1 space-y-3">
                      {/* Focus Keyword */}
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Focus Keyword</label>
                        <input
                          type="text"
                          value={props.focusKeyword}
                          onChange={(e) => props.onFocusKeywordChange(e.target.value)}
                          placeholder="e.g., hip hop news"
                          className="admin-input text-sm w-full"
                        />
                      </div>

                      {/* SEO Title */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs text-gray-400">SEO Title</label>
                          <span className={`text-[10px] font-mono ${
                            (props.seoTitle || props.title).length >= 50 && (props.seoTitle || props.title).length <= 60
                              ? 'text-emerald-400' : 'text-gray-500'
                          }`}>
                            {(props.seoTitle || props.title).length}/60
                          </span>
                        </div>
                        <input
                          type="text"
                          value={props.seoTitle}
                          onChange={(e) => props.onSeoTitleChange(e.target.value)}
                          placeholder={props.title || 'Auto-generated from title'}
                          className="admin-input text-sm w-full"
                        />
                      </div>

                      {/* SEO Description */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs text-gray-400">Meta Description</label>
                          <span className={`text-[10px] font-mono ${
                            (props.seoDescription || props.excerpt).length >= 120 && (props.seoDescription || props.excerpt).length <= 160
                              ? 'text-emerald-400' : 'text-gray-500'
                          }`}>
                            {(props.seoDescription || props.excerpt).length}/160
                          </span>
                        </div>
                        <textarea
                          value={props.seoDescription}
                          onChange={(e) => props.onSeoDescriptionChange(e.target.value)}
                          placeholder={props.excerpt || 'Auto-generated from excerpt'}
                          rows={2}
                          className="admin-input text-sm w-full resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Rules Checklist */}
                  <div className="border-t border-white/5 pt-4 space-y-2">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">SEO Checklist</h4>
                    {rules.map(rule => (
                      <div key={rule.id} className="flex items-start gap-2">
                        <span className="text-xs flex-shrink-0 mt-0.5">
                          {rule.passed ? '✅' : '❌'}
                        </span>
                        <div className="flex-1">
                          <p className={`text-xs ${rule.passed ? 'text-gray-400' : 'text-white'}`}>
                            {rule.label}
                          </p>
                          {!rule.passed && (
                            <p className="text-[10px] text-gray-600">{rule.suggestion}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {activeTab === 'social' && (
                <div className="space-y-5">
                  {/* Google Preview */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-400 uppercase mb-3">Google Preview</h4>
                    <div className="p-4 bg-white rounded-lg">
                      <p className="text-sm text-green-700 font-mono truncate">
                        {brandDomain}/{props.slug || 'article-slug'}
                      </p>
                      <h3 className="text-lg text-blue-700 hover:underline cursor-pointer font-medium truncate mt-0.5">
                        {effectiveTitle}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mt-0.5">
                        {effectiveDesc}
                      </p>
                    </div>
                  </div>

                  {/* Twitter Preview */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-400 uppercase mb-3">Twitter / X Preview</h4>
                    <div className="rounded-xl overflow-hidden border border-white/10">
                      {props.coverImage && (
                        <div className="aspect-[2/1] bg-gray-800">
                          <img src={props.coverImage} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="p-3 bg-[#15202B]">
                        <p className="text-white text-sm font-bold truncate">{effectiveTitle}</p>
                        <p className="text-gray-500 text-xs line-clamp-2">{effectiveDesc}</p>
                        <p className="text-gray-500 text-xs mt-1">🔗 {brandDomain}</p>
                      </div>
                    </div>
                  </div>

                  {/* Facebook Preview */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-400 uppercase mb-3">Facebook Preview</h4>
                    <div className="rounded-lg overflow-hidden border border-white/10">
                      {props.coverImage && (
                        <div className="aspect-[1.91/1] bg-gray-800">
                          <img src={props.coverImage} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="p-3 bg-[#242526]">
                        <p className="text-[10px] text-gray-500 uppercase">{brandDomain}</p>
                        <p className="text-white text-sm font-bold truncate mt-0.5">{effectiveTitle}</p>
                        <p className="text-gray-400 text-xs line-clamp-1">{effectiveDesc}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
