'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { MagazineIssue } from '@/lib/mock-data';
import { IssueCard } from '@/components/IssueCard';

interface IssuesPageClientProps {
  issues: MagazineIssue[];
}

export function IssuesPageClient({ issues }: IssuesPageClientProps) {

  return (
    <div className="min-h-screen pt-28 pb-20 bg-secondary">
      <div className="container-caviar">
        {/* Header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[10px] tracking-[0.4em] uppercase text-primary/60 font-body mb-4">
            The Archive
          </p>
          <h1 className="text-4xl md:text-6xl font-headline text-text tracking-wide">
            All Issues
          </h1>
          <p className="mt-4 text-sm text-text/40 font-accent italic max-w-lg mx-auto">
            Every issue is a limited edition. Every page is a deliberate act of curation.
          </p>
          <div className="mt-6 w-16 h-px bg-primary/40 mx-auto" />
        </motion.div>

        {/* Issues grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {issues.map((issue, i) => (
            <IssueCard key={issue.id} issue={issue} index={i} />
          ))}
        </div>

        {/* Empty state / coming soon */}
        <motion.div
          className="mt-16 text-center py-12 border border-dashed border-surface/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-sm text-text/20 font-accent italic">
            More issues coming soon. Subscribe to be the first to know.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
