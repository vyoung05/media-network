'use client';

import React from 'react';
import { TermsContent } from '@media-network/shared';

export function TermsClient() {
  return (
    <div className="container-caviar py-16 md:py-24">
      <TermsContent
        siteName="SauceCaviar"
        siteUrl="https://saucecaviar.com"
        contactEmail="legal@saucecaviar.com"
        primaryColorClass="text-primary"
        headingClass="font-headline text-text tracking-wide"
        bodyClass="text-text/60 font-body"
      />
    </div>
  );
}
