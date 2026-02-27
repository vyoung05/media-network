'use client';

import React, { useRef, useState } from 'react';
import type { Article, Brand } from '@media-network/shared';

type ShareFormat = 'story' | 'post' | 'twitter';

interface ShareCardProps {
  article: Article;
  brand?: Brand;
  format?: ShareFormat;
  onDownload?: (format: ShareFormat) => void;
}

const FORMAT_CONFIGS: Record<ShareFormat, { width: number; height: number; label: string }> = {
  story: { width: 1080, height: 1920, label: 'Story (9:16)' },
  post: { width: 1080, height: 1080, label: 'Post (1:1)' },
  twitter: { width: 1200, height: 675, label: 'Twitter (16:9)' },
};

const BRAND_STYLES: Record<Brand, { primary: string; secondary: string; accent: string; name: string }> = {
  saucewire: { primary: '#E63946', secondary: '#111111', accent: '#1DA1F2', name: 'SAUCEWIRE' },
  saucecaviar: { primary: '#C9A84C', secondary: '#0A0A0A', accent: '#F5F0E8', name: 'SAUCECAVIAR' },
  trapglow: { primary: '#8B5CF6', secondary: '#0F0B2E', accent: '#06F5D6', name: 'TRAPGLOW' },
  trapfrequency: { primary: '#39FF14', secondary: '#0D0D0D', accent: '#FFB800', name: 'TRAPFREQUENCY' },
};

export function ShareCard({
  article,
  brand = 'saucewire',
  format: initialFormat = 'post',
  onDownload,
}: ShareCardProps) {
  const [activeFormat, setActiveFormat] = useState<ShareFormat>(initialFormat);
  const cardRef = useRef<HTMLDivElement>(null);
  const styles = BRAND_STYLES[brand];
  const config = FORMAT_CONFIGS[activeFormat];

  // Scale factor to fit preview in container
  const previewScale = activeFormat === 'story' ? 0.2 : activeFormat === 'post' ? 0.28 : 0.3;

  const handleDownload = () => {
    onDownload?.(activeFormat);

    // Canvas-based download for client-side generation
    const card = cardRef.current;
    if (!card) return;

    const canvas = document.createElement('canvas');
    canvas.width = config.width;
    canvas.height = config.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw background
    ctx.fillStyle = styles.secondary;
    ctx.fillRect(0, 0, config.width, config.height);

    // Draw gradient overlay
    const gradient = ctx.createLinearGradient(0, 0, config.width, config.height);
    gradient.addColorStop(0, styles.secondary);
    gradient.addColorStop(1, `${styles.primary}22`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, config.width, config.height);

    // Draw accent line
    ctx.fillStyle = styles.primary;
    ctx.fillRect(60, config.height * 0.15, 4, 60);

    // Draw category
    ctx.fillStyle = styles.accent;
    ctx.font = 'bold 24px sans-serif';
    ctx.textBaseline = 'top';
    ctx.letterSpacing = '4px';
    ctx.fillText(article.category.toUpperCase(), 80, config.height * 0.15);

    // Draw title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${activeFormat === 'twitter' ? '48' : '56'}px sans-serif`;
    ctx.letterSpacing = '-1px';

    // Word wrap title
    const maxWidth = config.width - 120;
    const words = article.title.split(' ');
    let line = '';
    let y = config.height * 0.25;
    const lineHeight = activeFormat === 'twitter' ? 58 : 68;

    words.forEach((word) => {
      const testLine = line + (line ? ' ' : '') + word;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && line) {
        ctx.fillText(line, 60, y);
        line = word;
        y += lineHeight;
      } else {
        line = testLine;
      }
    });
    ctx.fillText(line, 60, y);

    // Draw bottom bar
    const bottomY = config.height - 100;
    ctx.fillStyle = `${styles.primary}33`;
    ctx.fillRect(0, bottomY, config.width, 100);

    // Draw brand name
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 28px sans-serif';
    ctx.letterSpacing = '2px';
    const brandName = styles.name;
    const namePartIndex = brandName === 'SAUCEWIRE' ? 5 : brandName === 'SAUCECAVIAR' ? 5 : brandName === 'TRAPGLOW' ? 4 : 4;

    ctx.fillText(brandName.substring(0, namePartIndex), 60, bottomY + 40);
    ctx.fillStyle = styles.primary;
    ctx.fillText(
      brandName.substring(namePartIndex),
      60 + ctx.measureText(brandName.substring(0, namePartIndex)).width,
      bottomY + 40
    );

    // Draw domain
    ctx.fillStyle = '#8D99AE';
    ctx.font = '18px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`${brand.replace('_', '')}.com`, config.width - 60, bottomY + 42);

    // Export as PNG
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${article.slug}-${activeFormat}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  return (
    <div className="space-y-4">
      {/* Format selector */}
      <div className="flex gap-2">
        {(Object.keys(FORMAT_CONFIGS) as ShareFormat[]).map((fmt) => (
          <button
            key={fmt}
            onClick={() => setActiveFormat(fmt)}
            className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${
              activeFormat === fmt
                ? 'bg-primary text-white'
                : 'bg-surface text-neutral hover:text-white border border-gray-700'
            }`}
          >
            {FORMAT_CONFIGS[fmt].label}
          </button>
        ))}
      </div>

      {/* Card preview */}
      <div className="flex justify-center bg-surface/50 rounded-lg p-6 border border-gray-800/50">
        <div
          ref={cardRef}
          className="relative overflow-hidden rounded-lg shadow-2xl"
          style={{
            width: config.width * previewScale,
            height: config.height * previewScale,
            background: styles.secondary,
          }}
        >
          {/* Background gradient */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${styles.secondary} 0%, ${styles.primary}15 100%)`,
            }}
          />

          {/* Accent dots */}
          <div
            className="absolute rounded-full opacity-10"
            style={{
              width: config.width * previewScale * 0.5,
              height: config.width * previewScale * 0.5,
              top: '-10%',
              right: '-10%',
              background: `radial-gradient(circle, ${styles.primary} 0%, transparent 70%)`,
            }}
          />

          {/* Content */}
          <div className="relative h-full flex flex-col justify-between p-[8%]">
            {/* Category */}
            <div className="flex items-center gap-1">
              <div
                className="w-[2px] rounded-full"
                style={{
                  height: `${12 * previewScale * 5}px`,
                  backgroundColor: styles.primary,
                }}
              />
              <span
                className="font-mono font-bold uppercase"
                style={{
                  fontSize: `${Math.max(8, 16 * previewScale * 5)}px`,
                  color: styles.accent,
                  letterSpacing: '2px',
                }}
              >
                {article.category}
              </span>
            </div>

            {/* Title */}
            <div className="flex-1 flex items-center py-[4%]">
              <h2
                className="font-bold leading-tight"
                style={{
                  fontSize: `${Math.max(10, (activeFormat === 'twitter' ? 28 : 32) * previewScale * 5)}px`,
                  color: '#FFFFFF',
                  letterSpacing: '-0.5px',
                }}
              >
                {article.title}
              </h2>
            </div>

            {/* Bottom bar */}
            <div
              className="flex items-center justify-between rounded-md px-[4%] py-[2%]"
              style={{ backgroundColor: `${styles.primary}22` }}
            >
              <span
                className="font-bold"
                style={{
                  fontSize: `${Math.max(7, 14 * previewScale * 5)}px`,
                  color: '#FFFFFF',
                }}
              >
                <span>{styles.name.substring(0, styles.name === 'SAUCEWIRE' ? 5 : 4)}</span>
                <span style={{ color: styles.primary }}>
                  {styles.name.substring(styles.name === 'SAUCEWIRE' ? 5 : 4)}
                </span>
              </span>
              <span
                className="font-mono"
                style={{
                  fontSize: `${Math.max(6, 10 * previewScale * 5)}px`,
                  color: '#8D99AE',
                }}
              >
                {brand}.com
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Download button */}
      <button
        onClick={handleDownload}
        className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download {FORMAT_CONFIGS[activeFormat].label}
      </button>
    </div>
  );
}
