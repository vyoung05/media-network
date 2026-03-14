'use client';

import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle: Array<Record<string, unknown>>;
  }
}

const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

function useAdSensePush() {
  const pushed = useRef(false);
  useEffect(() => {
    if (!clientId || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense script not loaded yet — no-op
    }
  }, []);
}

/* ─── Sponsored Badge ─── */
function SponsoredBadge({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded opacity-60 ${className}`}
    >
      Sponsored
    </span>
  );
}

/* ═══════════════════════════════════════════════════
   1. NativeInFeedAd
   Looks exactly like an ArticleCard "wire" variant.
   Renders a Google AdSense in-feed ad unit.
   ═══════════════════════════════════════════════════ */

interface NativeInFeedAdProps {
  slot: string;
  /** Tailwind classes for the sponsored badge color. Default: muted gray. */
  badgeClass?: string;
  className?: string;
}

export function NativeInFeedAd({
  slot,
  badgeClass = 'text-neutral/50 bg-white/5',
  className = '',
}: NativeInFeedAdProps) {
  useAdSensePush();

  if (!clientId) return null;

  return (
    <div className={`group border-b border-gray-800 py-4 px-4 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <SponsoredBadge className={badgeClass} />
          </div>
          {/* AdSense in-feed ad unit */}
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client={clientId}
            data-ad-slot={slot}
            data-ad-format="fluid"
            data-ad-layout-key="-fb+5w+4e-db+86"
          />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   2. NativeInArticleAd
   AdSense in-article format — text-based, minimal,
   designed to flow between paragraphs.
   ═══════════════════════════════════════════════════ */

interface NativeInArticleAdProps {
  slot: string;
  badgeClass?: string;
  className?: string;
}

export function NativeInArticleAd({
  slot,
  badgeClass = 'text-neutral/50 bg-white/5',
  className = '',
}: NativeInArticleAdProps) {
  useAdSensePush();

  if (!clientId) return null;

  return (
    <div className={`my-8 ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        <div className="flex-1 h-px bg-gray-800/50" />
        <SponsoredBadge className={badgeClass} />
        <div className="flex-1 h-px bg-gray-800/50" />
      </div>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', textAlign: 'center' }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format="fluid"
        data-ad-layout="in-article"
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   3. SponsoredSection
   "From Our Partners" section for homepages.
   Shows 2-3 native ad cards in the same grid style.
   ═══════════════════════════════════════════════════ */

interface SponsoredSectionProps {
  slots: string[];
  title?: string;
  /** Tailwind classes for section heading */
  headingClass?: string;
  badgeClass?: string;
  className?: string;
}

export function SponsoredSection({
  slots,
  title = 'From Our Partners',
  headingClass = 'text-xs font-mono text-neutral/40 uppercase tracking-wider',
  badgeClass = 'text-neutral/50 bg-white/5',
  className = '',
}: SponsoredSectionProps) {
  // Push once per slot
  const pushed = useRef(false);
  useEffect(() => {
    if (!clientId || pushed.current) return;
    try {
      slots.forEach(() => {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      });
      pushed.current = true;
    } catch {
      // no-op
    }
  }, [slots]);

  if (!clientId) return null;

  return (
    <div className={className}>
      <div className="flex items-center gap-3 mb-4">
        <span className={headingClass}>{title}</span>
        <div className="flex-1 h-px bg-gray-800/30" />
        <SponsoredBadge className={badgeClass} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {slots.map((slot) => (
          <div
            key={slot}
            className="bg-surface rounded-lg overflow-hidden border border-gray-800/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20"
          >
            <ins
              className="adsbygoogle"
              style={{ display: 'block' }}
              data-ad-client={clientId}
              data-ad-slot={slot}
              data-ad-format="fluid"
              data-ad-layout-key="-fb+5w+4e-db+86"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Legacy export for backward compatibility ─── */
export { NativeInFeedAd as AdBanner };
