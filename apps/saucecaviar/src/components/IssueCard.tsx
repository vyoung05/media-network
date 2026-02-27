'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import type { MagazineIssue } from '@/lib/mock-data';

interface IssueCardProps {
  issue: MagazineIssue;
  index?: number;
}

export function IssueCard({ issue, index = 0 }: IssueCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 200, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 200, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['5deg', '-5deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-5deg', '5deg']);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      className="group"
    >
      <Link href={`/issues/${issue.slug}`} data-cursor="Read">
        <div className="relative overflow-hidden bg-surface/20 border border-surface/30
                        transition-all duration-700 group-hover:border-primary/30 group-hover:shadow-gold-lg">
          {/* Cover image */}
          <div className="relative aspect-[3/4] overflow-hidden">
            <Image
              src={issue.coverImage}
              alt={issue.title}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

            {/* Issue number badge */}
            <div className="absolute top-4 left-4">
              <span className="text-[9px] tracking-[0.3em] uppercase text-primary/80 font-body
                             bg-black/40 backdrop-blur-sm px-3 py-1.5 border border-primary/20">
                Issue #{issue.issueNumber}
              </span>
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-700" />

            {/* Read button on hover */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            >
              <span className="px-6 py-2.5 border border-white/40 text-white text-xs tracking-[0.2em] uppercase font-body backdrop-blur-sm bg-black/20">
                Read Issue
              </span>
            </motion.div>
          </div>

          {/* Info */}
          <div className="p-5">
            <h3 className="text-lg font-headline text-text tracking-wide group-hover:text-primary transition-colors duration-500">
              {issue.title}
            </h3>
            <p className="mt-1 text-xs font-accent italic text-text/40">
              {issue.subtitle}
            </p>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-[9px] tracking-[0.2em] uppercase text-text/25 font-body">
                {issue.season}
              </p>
              <p className="text-[9px] tracking-[0.2em] uppercase text-text/25 font-body">
                {issue.pageCount} Pages
              </p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
