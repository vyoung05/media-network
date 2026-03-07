'use client';

import React, { useEffect, useRef } from 'react';

type AdFormat = 'auto' | 'horizontal' | 'vertical' | 'rectangle';

interface AdBannerProps {
  slot: string;
  format?: AdFormat;
  responsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

declare global {
  interface Window {
    adsbygoogle: Array<Record<string, unknown>>;
  }
}

/**
 * Google AdSense ad banner component.
 * Reads client ID from NEXT_PUBLIC_ADSENSE_CLIENT_ID env var.
 * Shows nothing if no client ID is configured (graceful fallback).
 */
export function AdBanner({
  slot,
  format = 'auto',
  responsive = true,
  className = '',
  style,
}: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  useEffect(() => {
    if (!clientId || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense not loaded yet — no-op
    }
  }, [clientId]);

  // No client ID configured — render nothing (don't break the layout)
  if (!clientId) {
    return null;
  }

  const formatStyle: React.CSSProperties = (() => {
    switch (format) {
      case 'horizontal':
        return { display: 'inline-block', width: '728px', height: '90px', maxWidth: '100%' };
      case 'vertical':
        return { display: 'inline-block', width: '160px', height: '600px' };
      case 'rectangle':
        return { display: 'inline-block', width: '300px', height: '250px' };
      case 'auto':
      default:
        return { display: 'block' };
    }
  })();

  return (
    <div className={`ad-banner-wrapper ${className}`} style={style}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={formatStyle}
        data-ad-client={clientId}
        data-ad-slot={slot}
        {...(responsive && format === 'auto' ? { 'data-ad-format': 'auto', 'data-full-width-responsive': 'true' } : {})}
      />
    </div>
  );
}
