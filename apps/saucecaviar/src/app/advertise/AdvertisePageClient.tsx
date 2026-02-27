'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { adRateCard } from '@/lib/mock-data';
import { AdSubmissionForm } from '@/components/AdSubmissionForm';
import { GlassMorphCard } from '@/components/GlassMorphCard';

export function AdvertisePageClient() {
  return (
    <div className="min-h-screen pt-28 pb-20 bg-secondary">
      <div className="container-caviar">
        {/* Header */}
        <motion.div
          className="mb-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-[10px] tracking-[0.4em] uppercase text-primary/60 font-body mb-4">
            Partnerships
          </p>
          <h1 className="text-4xl md:text-6xl font-headline text-text tracking-wide">
            Advertise With Us
          </h1>
          <p className="mt-4 text-lg font-accent italic text-text/40 max-w-xl mx-auto">
            Place your brand inside the most premium digital magazine experience on the internet.
          </p>
          <div className="mt-6 w-16 h-px bg-primary/40 mx-auto" />
        </motion.div>

        {/* Audience Stats */}
        <section className="mb-20">
          <h2 className="text-xl font-headline text-text tracking-wide text-center mb-10">
            Our Audience
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Monthly Readers', value: adRateCard.audience.monthlyReaders },
              { label: 'Avg. Time on Page', value: adRateCard.audience.avgTimeOnPage },
              { label: 'Demographics', value: adRateCard.audience.demographics },
              { label: 'Core Interests', value: adRateCard.audience.interests },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassMorphCard className="p-6 text-center h-full" tiltEnabled={false}>
                  <p className="text-2xl md:text-3xl font-headline text-primary">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-[10px] tracking-[0.2em] uppercase text-text/40 font-body">
                    {stat.label}
                  </p>
                </GlassMorphCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Rate Card */}
        <section className="mb-20">
          <h2 className="text-xl font-headline text-text tracking-wide text-center mb-10">
            Ad Placements & Rates
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adRateCard.placements.map((placement, i) => (
              <motion.div
                key={placement.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="card-caviar p-6"
              >
                <div className="flex items-baseline justify-between mb-3">
                  <h3 className="text-sm font-headline text-text tracking-wide">
                    {placement.name}
                  </h3>
                  <span className="text-lg font-headline text-primary">
                    ${placement.price.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-text/35 font-body leading-relaxed">
                  {placement.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Specs */}
        <section className="mb-20">
          <h2 className="text-xl font-headline text-text tracking-wide text-center mb-10">
            Creative Specifications
          </h2>
          <div className="card-glass p-8 md:p-12 max-w-2xl mx-auto">
            <div className="space-y-4">
              {[
                { label: 'Full Page', value: adRateCard.specs.fullPage },
                { label: 'Double-Page Spread', value: adRateCard.specs.spread },
                { label: 'Accepted Formats', value: adRateCard.specs.formats },
                { label: 'Max File Size', value: adRateCard.specs.maxFileSize },
              ].map((spec) => (
                <div key={spec.label} className="flex items-baseline justify-between py-3 border-b border-surface/20">
                  <span className="text-xs tracking-[0.2em] uppercase text-text/40 font-body">
                    {spec.label}
                  </span>
                  <span className="text-sm text-text/70 font-body">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Inquiry Form */}
        <section>
          <h2 className="text-xl font-headline text-text tracking-wide text-center mb-10">
            Submit an Inquiry
          </h2>
          <div className="card-glass p-8 md:p-12 max-w-2xl mx-auto">
            <AdSubmissionForm />
          </div>
        </section>
      </div>
    </div>
  );
}
