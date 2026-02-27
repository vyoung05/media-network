'use client';

import React, { useEffect, useState, useRef } from 'react';

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  triggerOnView?: boolean;
}

export function TextReveal({
  text,
  className = '',
  delay = 0,
  speed = 30,
  as: Tag = 'h1',
  triggerOnView = true,
}: TextRevealProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [started, setStarted] = useState(!triggerOnView);
  const ref = useRef<HTMLElement>(null);

  // Intersection Observer to trigger on view
  useEffect(() => {
    if (!triggerOnView || !ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [triggerOnView]);

  // Character by character reveal
  useEffect(() => {
    if (!started) return;

    const timeout = setTimeout(() => {
      let index = 0;
      const interval = setInterval(() => {
        if (index <= text.length) {
          setDisplayedText(text.slice(0, index));
          index++;
        } else {
          clearInterval(interval);
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, started, delay, speed]);

  return (
    <Tag ref={ref as React.RefObject<HTMLHeadingElement>} className={className}>
      {displayedText}
      {started && displayedText.length < text.length && (
        <span className="inline-block w-0.5 h-[1em] bg-primary animate-pulse ml-0.5 align-baseline" />
      )}
    </Tag>
  );
}
