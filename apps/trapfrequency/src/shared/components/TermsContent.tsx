'use client';

import React from 'react';

interface TermsContentProps {
  siteName: string;
  siteUrl: string;
  contactEmail: string;
  primaryColorClass?: string;
  headingClass?: string;
  bodyClass?: string;
}

/**
 * Shared Terms of Service content used across all Young Empire brand sites.
 */
export function TermsContent({
  siteName,
  siteUrl,
  contactEmail,
  primaryColorClass = 'text-white',
  headingClass = 'font-bold text-white',
  bodyClass = 'text-gray-300',
}: TermsContentProps) {
  const lastUpdated = 'July 12, 2025';

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className={`text-3xl md:text-4xl mb-2 ${headingClass}`}>Terms of Service</h1>
      <p className={`text-sm mb-8 opacity-50 ${bodyClass}`}>Last updated: {lastUpdated}</p>

      <div className={`space-y-8 leading-relaxed ${bodyClass}`}>
        {/* 1. Acceptance */}
        <section>
          <h2 className={`text-xl mb-3 ${headingClass}`}>1. Acceptance of Terms</h2>
          <p>
            By accessing or using {siteName} at{' '}
            <a href={siteUrl} className={`underline ${primaryColorClass}`}>{siteUrl}</a>{' '}
            (the &ldquo;Site&rdquo;), operated by{' '}
            <strong className={primaryColorClass}>The Young Empire LLC</strong>,
            you agree to be bound by these Terms of Service (&ldquo;Terms&rdquo;).
            If you do not agree, do not use the Site.
          </p>
        </section>

        {/* 2. Content */}
        <section>
          <h2 className={`text-xl mb-3 ${headingClass}`}>2. Content and Intellectual Property</h2>
          <p className="mb-3">
            All content published on this Site — including articles, images, graphics, logos,
            audio, video, and software — is the property of {siteName} or its content creators
            and is protected by copyright and intellectual property laws.
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>You may share links to our content with proper attribution.</li>
            <li>You may not reproduce, distribute, or republish our content without written permission.</li>
            <li>Some content may be generated or assisted by AI tools. Such content is clearly labeled.</li>
          </ul>
        </section>

        {/* 3. User Submissions */}
        <section>
          <h2 className={`text-xl mb-3 ${headingClass}`}>3. User Submissions</h2>
          <p className="mb-3">
            If you submit content to {siteName} (tips, articles, music, images, etc.), you:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Grant us a non-exclusive, worldwide, royalty-free license to use, edit, publish, and distribute your submission.</li>
            <li>Represent that you own or have the right to submit such content.</li>
            <li>Acknowledge that we may edit submissions for clarity, style, or length.</li>
            <li>Understand that we are not obligated to publish any submission.</li>
          </ul>
        </section>

        {/* 4. Advertising */}
        <section>
          <h2 className={`text-xl mb-3 ${headingClass}`}>4. Advertising Disclaimer</h2>
          <p className="mb-3">
            This Site displays advertisements served by third-party ad networks, including
            Google AdSense. Please note:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Advertisements are clearly distinguishable from editorial content.</li>
            <li>We do not endorse the products or services advertised unless explicitly stated.</li>
            <li>Clicking on ads may take you to third-party websites governed by their own terms and privacy policies.</li>
            <li>We are not responsible for the content of third-party advertisements.</li>
          </ul>
        </section>

        {/* 5. Prohibited Uses */}
        <section>
          <h2 className={`text-xl mb-3 ${headingClass}`}>5. Prohibited Uses</h2>
          <p className="mb-3">You agree not to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Use the Site for any unlawful purpose</li>
            <li>Scrape, crawl, or harvest content in bulk without permission</li>
            <li>Interfere with or disrupt the Site&apos;s infrastructure</li>
            <li>Impersonate any person or entity</li>
            <li>Use automated tools to access the Site in a manner that exceeds reasonable usage</li>
            <li>Submit false, misleading, or defamatory content</li>
          </ul>
        </section>

        {/* 6. Disclaimers */}
        <section>
          <h2 className={`text-xl mb-3 ${headingClass}`}>6. Disclaimers</h2>
          <p className="mb-3">
            THE SITE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE.&rdquo; WE MAKE
            NO WARRANTIES, EXPRESS OR IMPLIED, REGARDING THE SITE&apos;S ACCURACY, RELIABILITY,
            OR AVAILABILITY.
          </p>
          <p>
            We do not guarantee that the Site will be uninterrupted, error-free, or free of
            viruses or other harmful components.
          </p>
        </section>

        {/* 7. Limitation of Liability */}
        <section>
          <h2 className={`text-xl mb-3 ${headingClass}`}>7. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, The Young Empire LLC and its officers,
            directors, employees, and agents shall not be liable for any indirect, incidental,
            special, or consequential damages arising out of or related to your use of the Site.
          </p>
        </section>

        {/* 8. Third-Party Links */}
        <section>
          <h2 className={`text-xl mb-3 ${headingClass}`}>8. Third-Party Links</h2>
          <p>
            Our Site may contain links to third-party websites or services. We are not
            responsible for the content, privacy practices, or terms of any third-party sites.
            Visiting third-party links is at your own risk.
          </p>
        </section>

        {/* 9. Modifications */}
        <section>
          <h2 className={`text-xl mb-3 ${headingClass}`}>9. Modifications</h2>
          <p>
            We reserve the right to modify these Terms at any time. Changes will be effective
            immediately upon posting. Your continued use of the Site after changes constitutes
            acceptance of the modified Terms.
          </p>
        </section>

        {/* 10. Governing Law */}
        <section>
          <h2 className={`text-xl mb-3 ${headingClass}`}>10. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the
            State of Florida, without regard to its conflict of law principles.
          </p>
        </section>

        {/* 11. Contact */}
        <section>
          <h2 className={`text-xl mb-3 ${headingClass}`}>11. Contact Us</h2>
          <p>If you have questions about these Terms, please contact us:</p>
          <div className="mt-3 p-4 rounded-lg bg-white/5 border border-white/10">
            <p><strong className={primaryColorClass}>The Young Empire LLC</strong></p>
            <p>
              Email:{' '}
              <a href={`mailto:${contactEmail}`} className={`underline ${primaryColorClass}`}>{contactEmail}</a>
            </p>
            <p>
              Website:{' '}
              <a href={siteUrl} className={`underline ${primaryColorClass}`}>{siteUrl}</a>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
