'use client';

import React from 'react';
import { PrivacyPolicyContent } from '@media-network/shared';

export function PrivacyPolicyClient() {
  return (
    <div className="container-glow py-12 md:py-20">
      <PrivacyPolicyContent
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
