'use client';

import React from 'react';
import type { Brand } from '@media-network/shared';

interface LivePreviewProps {
  brand: Brand;
  title: string;
  excerpt: string;
  body: string;
  coverImage: string;
  category: string;
  tags: string[];
  metadata: Record<string, any>;
  contentType: string;
}

const BRAND_STYLES: Record<Brand, {
  bg: string; text: string; accent: string; surface: string; font: string; name: string;
}> = {
  saucewire: { bg: '#111111', text: '#FFFFFF', accent: '#E63946', surface: '#1B1B2F', font: 'font-sans', name: 'SauceWire' },
  saucecaviar: { bg: '#0A0A0A', text: '#FAFAF7', accent: '#C9A84C', surface: '#2D2D2D', font: 'font-serif', name: 'SauceCaviar' },
  trapglow: { bg: '#0F0B2E', text: '#F8F8FF', accent: '#8B5CF6', surface: '#1A1035', font: 'font-sans', name: 'TrapGlow' },
  trapfrequency: { bg: '#0D0D0D', text: '#E0E0E0', accent: '#39FF14', surface: '#1A1A2E', font: 'font-mono', name: 'TrapFrequency' },
};

export function LivePreview({
  brand, title, excerpt, body, coverImage, category, tags, metadata, contentType,
}: LivePreviewProps) {
  const style = BRAND_STYLES[brand];

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 border-b border-admin-border bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: style.accent }} />
          <span className="text-xs font-mono text-gray-500">Preview: {style.name}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500/60" />
          <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
          <div className="w-2 h-2 rounded-full bg-green-500/60" />
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto"
        style={{ backgroundColor: style.bg, color: style.text }}
      >
        {/* Browser bar mock */}
        <div className="flex items-center gap-2 px-4 py-2 bg-black/30">
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-full bg-white/10" />
            <div className="w-3 h-3 rounded-full bg-white/10" />
          </div>
          <div className="flex-1 bg-white/10 rounded px-3 py-0.5">
            <span className="text-[10px] text-gray-500 font-mono">
              {brand === 'saucecaviar' ? 'saucecaviar.com' : brand === 'trapglow' ? 'trapglow.com' : brand === 'saucewire' ? 'saucewire.com' : 'trapfrequency.com'}
              /{title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40) : 'article-slug'}
            </span>
          </div>
        </div>

        {/* Content preview */}
        <div className="p-6 max-w-2xl mx-auto">
          {/* Category badge */}
          {category && (
            <div className="mb-3">
              <span
                className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded"
                style={{ backgroundColor: style.accent + '20', color: style.accent }}
              >
                {category}
              </span>
              {metadata.is_breaking && (
                <span className="ml-2 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-red-500/20 text-red-400 animate-pulse">
                  ⚡ BREAKING
                </span>
              )}
            </div>
          )}

          {/* Title */}
          <h1
            className={`${style.font} text-2xl font-bold leading-tight mb-3`}
            style={{ color: style.text }}
          >
            {title || 'Article Title'}
          </h1>

          {/* Subtitle (SauceCaviar) */}
          {metadata.subtitle && (
            <p className="text-base italic mb-3" style={{ color: style.text + '99' }}>
              {metadata.subtitle}
            </p>
          )}

          {/* Meta line */}
          <div className="flex items-center gap-2 text-[11px] mb-4" style={{ color: style.text + '66' }}>
            <span>By <span style={{ color: style.accent }}>Vincent Young</span></span>
            <span>•</span>
            <span>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            {metadata.difficulty && (
              <>
                <span>•</span>
                <span>{metadata.difficulty === 'beginner' ? '🟢' : metadata.difficulty === 'intermediate' ? '🟡' : metadata.difficulty === 'advanced' ? '🔴' : '⚫'} {metadata.difficulty}</span>
              </>
            )}
          </div>

          {/* Artist info bar (TrapGlow) */}
          {metadata.artist_name && (
            <div className="rounded-lg p-3 mb-4 flex items-center gap-3" style={{ backgroundColor: style.surface }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold" style={{ backgroundColor: style.accent + '30', color: style.accent }}>
                {metadata.artist_name[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold">{metadata.artist_name}</p>
                <p className="text-[10px]" style={{ color: style.text + '66' }}>
                  {metadata.genre && <span>{metadata.genre}</span>}
                  {metadata.location && <span> • {metadata.location}</span>}
                </p>
              </div>
              {metadata.spotify_url && (
                <div className="ml-auto flex gap-1">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-[8px]">🎵</div>
                </div>
              )}
            </div>
          )}

          {/* Beat info bar (TrapFrequency) */}
          {metadata.bpm && (
            <div className="rounded-lg p-3 mb-4 grid grid-cols-3 gap-2 text-center" style={{ backgroundColor: style.surface }}>
              <div>
                <p className="text-lg font-bold font-mono" style={{ color: style.accent }}>{metadata.bpm}</p>
                <p className="text-[9px] uppercase tracking-wider" style={{ color: style.text + '66' }}>BPM</p>
              </div>
              <div>
                <p className="text-lg font-bold font-mono" style={{ color: style.accent }}>{metadata.musical_key || '—'}</p>
                <p className="text-[9px] uppercase tracking-wider" style={{ color: style.text + '66' }}>KEY</p>
              </div>
              <div>
                <p className="text-lg font-bold font-mono" style={{ color: style.accent }}>{metadata.beat_genre || '—'}</p>
                <p className="text-[9px] uppercase tracking-wider" style={{ color: style.text + '66' }}>GENRE</p>
              </div>
            </div>
          )}

          {/* Audio player mock */}
          <div className="rounded-lg p-3 mb-4 flex items-center gap-3" style={{ backgroundColor: style.surface }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: style.accent }}>
              <span className="text-white text-xs ml-0.5">▶</span>
            </div>
            <div className="flex-1">
              <p className="text-[10px] uppercase tracking-wider" style={{ color: style.text + '66' }}>🎧 Listen to article</p>
              <div className="h-1 rounded-full mt-1" style={{ backgroundColor: style.text + '15' }}>
                <div className="h-full rounded-full w-0" style={{ backgroundColor: style.accent }} />
              </div>
            </div>
            <span className="text-[10px] font-mono" style={{ color: style.text + '44' }}>0:00</span>
          </div>

          {/* Cover image */}
          {coverImage && (
            <div className="relative aspect-video rounded-lg overflow-hidden mb-4 bg-white/5">
              <img
                src={coverImage}
                alt=""
                className="w-full h-full object-cover"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            </div>
          )}

          {/* Excerpt */}
          {excerpt && (
            <p className="text-sm font-semibold mb-4 pl-3 border-l-2" style={{ borderColor: style.accent, color: style.text + 'CC' }}>
              {excerpt}
            </p>
          )}

          {/* Body */}
          {body ? (
            <div
              className="prose prose-sm max-w-none"
              style={{ color: style.text + 'DD' }}
              dangerouslySetInnerHTML={{ __html: body.replace(/\n/g, '<br/>') }}
            />
          ) : (
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-3 rounded" style={{ backgroundColor: style.text + '10', width: `${100 - i * 15}%` }} />
              ))}
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-4 pt-4" style={{ borderTop: `1px solid ${style.text}15` }}>
              {tags.map(tag => (
                <span key={tag} className="text-[10px] px-2 py-0.5 rounded" style={{ backgroundColor: style.text + '10', color: style.text + '88' }}>
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Gear rating (TrapFrequency) */}
          {metadata.rating && (
            <div className="mt-4 p-3 rounded-lg text-center" style={{ backgroundColor: style.surface }}>
              <p className="text-3xl font-bold font-mono" style={{ color: style.accent }}>{metadata.rating}/10</p>
              <p className="text-[10px] uppercase tracking-wider" style={{ color: style.text + '66' }}>Overall Rating</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
