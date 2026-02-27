'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface TextRevealProps {
  children: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  delay?: number;
  once?: boolean;
  splitBy?: 'word' | 'char';
}

export function TextReveal({
  children,
  className = '',
  as: Tag = 'p',
  delay = 0,
  once = true,
  splitBy = 'word',
}: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: '-50px' });

  const units = splitBy === 'char' ? children.split('') : children.split(' ');

  return (
    <Tag className={className} ref={ref as React.RefObject<HTMLHeadingElement & HTMLParagraphElement>}>
      {units.map((unit, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: '100%', opacity: 0 }}
            animate={isInView ? { y: '0%', opacity: 1 } : { y: '100%', opacity: 0 }}
            transition={{
              duration: 0.5,
              delay: delay + i * (splitBy === 'char' ? 0.02 : 0.04),
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {unit}{splitBy === 'word' ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
