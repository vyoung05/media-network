'use client';

import React from 'react';
import { TermsContent } from '@media-network/shared';

export function TermsClient() {
  return (
    <div className="container-freq py-12 md:py-20">
      <TermsContent
        siteName="TrapFrequency"
        siteUrl="https://trapfrequency.com"
        contactEmail="legal@trapfrequency.com"
        primaryColorClass="text-primary"
        headingClass="font-headline font-bold text-white"
        bodyClass="text-neutral/60 font-mono"
      />
    </div>
  );
}
