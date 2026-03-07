'use client';

import React from 'react';
import { PrivacyPolicyContent } from '@media-network/shared';

export function PrivacyPolicyClient() {
  return (
    <div className="container-freq py-12 md:py-20">
      <PrivacyPolicyContent
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
