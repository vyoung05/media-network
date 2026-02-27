'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getIssueBySlug } from '@/lib/mock-data';
import { MagazineReader } from '@/components/magazine/MagazineReader';

interface IssueReaderClientProps {
  slug: string;
}

export function IssueReaderClient({ slug }: IssueReaderClientProps) {
  const issue = getIssueBySlug(slug);

  if (!issue) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary">
        <div className="text-center">
          <h1 className="text-4xl font-headline text-text">Issue Not Found</h1>
          <p className="mt-4 text-text/40 font-body">
            This issue doesn&apos;t exist or has been archived.
          </p>
          <Link href="/issues" className="mt-8 btn-ghost inline-block">
            ← Back to Issues
          </Link>
        </div>
      </div>
    );
  }

  return <MagazineReader issue={issue} />;
}
