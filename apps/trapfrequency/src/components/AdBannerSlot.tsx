'use client';

import React from 'react';
import { AdBanner } from '@media-network/shared';

interface AdBannerSlotProps {
  slot: string;
  format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
  responsive?: boolean;
  className?: string;
}

/**
 * Wrapper for AdBanner that adds site-specific styling.
 * Used in layout.tsx and page components for TrapFrequency.
 */
export function AdBannerSlot({ slot, format = 'auto', responsive = true, className = '' }: AdBannerSlotProps) {
  return (
    <div className={`flex justify-center py-3 ${className}`}>
      <AdBanner slot={slot} format={format} responsive={responsive} />
    </div>
  );
}
