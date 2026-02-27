'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface WaveformPlayerProps {
  waveformData: number[];
  title: string;
  producer: string;
  duration: string;
  bpm?: number;
  musicKey?: string;
  compact?: boolean;
  className?: string;
}

export function WaveformPlayer({
  waveformData,
  title,
  producer,
  duration,
  bpm,
  musicKey,
  compact = false,
  className = '',
}: WaveformPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const waveformRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Simulate playback progress
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 0.5;
        });
      }, 100);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying]);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const handleWaveformClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!waveformRef.current) return;
      const rect = waveformRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const pct = (x / rect.width) * 100;
      setProgress(Math.max(0, Math.min(100, pct)));
    },
    []
  );

  const barHeight = compact ? 24 : 40;
  const progressPct = progress / 100;

  // Format time display
  const currentTime = (() => {
    const parts = duration.split(':');
    const totalSec = parseInt(parts[0]) * 60 + parseInt(parts[1]);
    const currentSec = Math.floor(totalSec * progressPct);
    const m = Math.floor(currentSec / 60);
    const s = currentSec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  })();

  return (
    <div className={`${className}`}>
      <div className="flex items-center gap-3">
        {/* Play / Pause */}
        <button
          onClick={togglePlay}
          className={`flex-shrink-0 w-${compact ? '10' : '12'} h-${compact ? '10' : '12'} rounded-full border-2 border-primary flex items-center justify-center transition-all duration-300 hover:bg-primary/20 hover:shadow-[0_0_20px_rgba(57,255,20,0.3)] ${
            isPlaying ? 'bg-primary/10' : 'bg-transparent'
          }`}
          style={{ width: compact ? 40 : 48, height: compact ? 40 : 48 }}
          data-cursor="PLAY"
        >
          {isPlaying ? (
            <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-primary ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Waveform visualization */}
        <div className="flex-1 min-w-0">
          {!compact && (
            <div className="flex items-center justify-between mb-1.5">
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate">{title}</p>
                <p className="text-xs text-neutral/50 font-mono truncate">{producer}</p>
              </div>
              <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                {bpm && (
                  <span className="text-xs font-mono text-accent/80 bg-accent/10 px-2 py-0.5 rounded">
                    {bpm} BPM
                  </span>
                )}
                {musicKey && (
                  <span className="text-xs font-mono text-cool/80 bg-cool/10 px-2 py-0.5 rounded">
                    {musicKey}
                  </span>
                )}
              </div>
            </div>
          )}

          <div
            ref={waveformRef}
            className="relative flex items-end gap-[2px] cursor-pointer group"
            style={{ height: barHeight }}
            onClick={handleWaveformClick}
            onMouseLeave={() => setHoveredBar(null)}
          >
            {waveformData.map((value, i) => {
              const barProgress = i / waveformData.length;
              const isPlayed = barProgress <= progressPct;
              const isHovered = hoveredBar !== null && i <= hoveredBar;
              const h = Math.max(3, value * barHeight);

              return (
                <motion.div
                  key={i}
                  className="flex-1 rounded-full transition-colors duration-150"
                  style={{
                    height: h,
                    backgroundColor: isPlayed
                      ? 'rgb(57, 255, 20)'
                      : isHovered
                        ? 'rgba(57, 255, 20, 0.4)'
                        : 'rgba(57, 255, 20, 0.15)',
                    boxShadow: isPlayed ? '0 0 4px rgba(57, 255, 20, 0.3)' : 'none',
                    minWidth: 2,
                  }}
                  onMouseEnter={() => setHoveredBar(i)}
                  initial={false}
                  animate={isPlaying && isPlayed ? { scaleY: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.3 }}
                />
              );
            })}
          </div>

          {/* Time display */}
          <div className="flex items-center justify-between mt-1">
            <span className="text-[10px] font-mono text-neutral/40">{currentTime}</span>
            <span className="text-[10px] font-mono text-neutral/40">{duration}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
