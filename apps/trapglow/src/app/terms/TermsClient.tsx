'use client';

import React from 'react';
import { TermsContent } from '@media-network/shared';

export function TermsClient() {
  return (
    <div className="container-glow py-12 md:py-20">
      <TermsContent
        siteName="TrapGlow"
        siteUrl="https://trapglow.com"
        contactEmail="legal@trapglow.com"
        primaryColorClass="text-accent"
        headingClass="font-headline font-bold text-white"
        bodyClass="text-white/60 font-body"
      />
    </div>
  );
}
