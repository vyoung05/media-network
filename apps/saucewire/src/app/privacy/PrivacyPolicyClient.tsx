'use client';

import React from 'react';
import { PrivacyPolicyContent } from '@media-network/shared';

export function PrivacyPolicyClient() {
  return (
    <div className="container-wire py-12 md:py-20">
      <PrivacyPolicyContent
        siteName="SauceWire"
        siteUrl="https://saucewire.com"
        contactEmail="legal@saucewire.com"
        primaryColorClass="text-primary"
        headingClass="font-headline font-bold text-white"
        bodyClass="text-neutral"
      />
    </div>
  );
}
