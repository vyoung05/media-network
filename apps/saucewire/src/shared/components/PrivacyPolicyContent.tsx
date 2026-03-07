'use client';

import React from 'react';

interface PrivacyPolicyContentProps {
  siteName: string;
  siteUrl: string;
  contactEmail: string;
  primaryColorClass?: string;
  headingClass?: string;
  bodyClass?: string;
}

/**
 * Shared privacy policy content used across all Young Empire brand sites.
 * Styled with Tailwind classes passed as props to match each site's theme.
 */
export function PrivacyPolicyContent({
  siteName,
  siteUrl,
  contactEmail,
  primaryColorClass = 'text-white',
  headingClass = 'font-bold text-white',
  bodyClass = 'text-gray-300',
}: PrivacyPolicyContentProps) {
  const lastUpdated = 'July 12, 2025';

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className={`text-3xl md:text-4xl mb-2 ${headingClass}`}>Privacy Policy</h1>
      <p className={`text-sm mb-8 opacity-50 ${bodyClass}`}>Last updated: {lastUpdated}</p>

      <div className={`space-y-8 leading-relaxed ${bodyClass}`}>
        {/* Intro */}
        <section>
          <p>
            {siteName} (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), operated by{' '}
            <strong className={primaryColorClass}>The Young Empire LLC</strong>, is committed to protecting your
            privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard
            your information when you visit{' '}
            <a href={siteUrl} className={`underline ${primaryColorClass}`}>{siteUrl}</a>{' '}
            (the &ldquo;Site&rdquo;).
          </p>
        </section>

        {/* 1. Information We Collect */}
        <section>
          <h2 className={`text-xl mb-3 ${headingClass}`}>1. Information We Collect</h2>
          <h3 className={`text-lg mb-2 ${headingClass}`}>Information Collected Automatically</h3>
          <p className="mb-3">
            When you visit our Site, we may automatically collect certain information about your
            device and usage, including:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>IP address and approximate location</li>
            <li>Browser type and version</li>
            <li>Operating system</li>
            <li>Referring URLs and pages visited</li>
            <li>Time spent on pages and interaction data</li>
            <li>Device identifiers</li>
          </ul>

          <h3 className={`text-lg mb-2 mt-4 ${headingClass}`}>Cookies and Tracking Technologies</h3>
          <p>
            We use cookies, web beacons, and similar tracking technologies to collect information
            about your browsing activity. This includes first-party cookies for site functionality
            and third-party cookies for analytics and advertising.
          </p>

          <h3 className={`text-lg mb-2 mt-4 ${headingClass}`}>Information You Provide</h3>
          <p>
            If you subscribe to our newsletter, submit content, or contact us, we collect the
            information you voluntarily provide, such as your name and email address.
          </p>
        </section>

        {/* 2. Google AdSense and Advertising */}
        <section>
          <h2 className={`text-xl mb-3 ${headingClass}`}>2. Google AdSense &amp; Advertising</h2>
          <p className="mb-3">
            We use Google AdSense to display advertisements on our Site. Google AdSense uses
            cookies and similar technologies to serve ads based on your prior visits to our Site
            and other websites.
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              Google&apos;s use of advertising cookies enables it and its partners to serve ads
              based on your visit to our Site and/or other sites on the internet.
            </li>
            <li>
              You may opt out of personalized advertising by visiting{' '}
              <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className={`underline ${primaryColorClass}`}>
                Google Ads Settings
              </a>.
            </li>
            <li>
              You may also opt out of third-party vendor cookies at{' '}
              <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className={`underline ${primaryColorClass}`}>
                www.aboutads.info/choices
              </a>.
            </li>
          </ul>
          <p className="mt-3">
            For more information on how Google uses data, please visit{' '}
            <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className={`underline ${primaryColorClass}`}>
              Google&apos;s Privacy &amp; Terms
            </a>.
          </p>
        </section>

        {/* 3. Third-Party Services */}
        <section>
          <h2 className={`text-xl mb-3 ${headingClass}`}>3. Third-Party Services</h2>
          <p className="mb-3">We may use the following third-party services:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Google Analytics</strong> — to analyze site traffic and usage patterns</li>
            <li><strong>Google AdSense</strong> — to display relevant advertisements</li>
            <li><strong>Supabase</strong> — for database and authentication services</li>
            <li><strong>Vercel</strong> — for website hosting and delivery</li>
          </ul>
          <p className="mt-3">
            Each of these services has its own privacy policy governing the use of your information.
          </p>
        </section>

        {/* 4. How We Use Your Information */}
        <section>
          <h2 className={`text-xl mb-3 ${headingClass}`}>4. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>To operate and maintain the Site</li>
            <li>To improve user experience and site performance</li>
            <li>To display relevant advertisements</li>
            <li>To send newsletters (only if you subscribe)</li>
            <li>To analyze site traffic and trends</li>
            <li>To respond to inquiries and submissions</li>
          </ul>
        </section>

        {/* 5. CCPA */}
        <section>
          <h2 className={`text-xl mb-3 ${headingClass}`}>5. Your California Privacy Rights (CCPA)</h2>
          <p className="mb-3">
            If you are a California resident, you have the right to:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Request disclosure of the categories and specific pieces of personal information we collect</li>
            <li>Request deletion of your personal information</li>
            <li>Opt out of the sale of your personal information (we do not sell personal information)</li>
            <li>Not be discriminated against for exercising your privacy rights</li>
          </ul>
          <p className="mt-3">
            To exercise these rights, contact us at{' '}
            <a href={`mailto:${contactEmail}`} className={`underline ${primaryColorClass}`}>{contactEmail}</a>.
          </p>
        </section>

        {/* 6. GDPR */}
        <section>
          <h2 className={`text-xl mb-3 ${headingClass}`}>6. Rights for EEA/UK Users (GDPR)</h2>
          <p className="mb-3">
            If you are located in the European Economic Area or United Kingdom, you have the following rights:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Right to access your personal data</li>
            <li>Right to rectification of inaccurate data</li>
            <li>Right to erasure (&ldquo;right to be forgotten&rdquo;)</li>
            <li>Right to restrict processing</li>
            <li>Right to data portability</li>
            <li>Right to object to processing</li>
          </ul>
          <p className="mt-3">
            To exercise these rights, please contact us at{' '}
            <a href={`mailto:${contactEmail}`} className={`underline ${primaryColorClass}`}>{contactEmail}</a>.
          </p>
        </section>

        {/* 7. Data Retention */}
        <section>
          <h2 className={`text-xl mb-3 ${headingClass}`}>7. Data Retention</h2>
          <p>
            We retain your personal information only for as long as necessary to fulfill the purposes
            outlined in this policy, unless a longer retention period is required or permitted by law.
          </p>
        </section>

        {/* 8. Children's Privacy */}
        <section>
          <h2 className={`text-xl mb-3 ${headingClass}`}>8. Children&apos;s Privacy</h2>
          <p>
            Our Site is not directed to individuals under the age of 13. We do not knowingly
            collect personal information from children under 13. If we learn that we have
            collected personal information from a child under 13, we will take steps to delete
            such information.
          </p>
        </section>

        {/* 9. Changes */}
        <section>
          <h2 className={`text-xl mb-3 ${headingClass}`}>9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. The updated version will be
            indicated by an updated &ldquo;Last Updated&rdquo; date. We encourage you to review
            this page periodically.
          </p>
        </section>

        {/* 10. Contact */}
        <section>
          <h2 className={`text-xl mb-3 ${headingClass}`}>10. Contact Us</h2>
          <p>If you have questions about this Privacy Policy, please contact us:</p>
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
