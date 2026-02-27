'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';

interface AudioPlayerProps {
  src?: string;
  title: string;
  duration?: string;
  brand?: 'saucewire' | 'saucecaviar' | 'trapglow' | 'trapfrequency';
}

export function AudioPlayer({
  src,
  title,
  duration = '4 min listen',
  brand = 'saucewire',
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [isMinimized, setIsMinimized] = useState(false);

  const brandColors: Record<string, { primary: string; glow: string }> = {
    saucewire: { primary: '#E63946', glow: 'rgba(230, 57, 70, 0.3)' },
    saucecaviar: { primary: '#C9A84C', glow: 'rgba(201, 168, 76, 0.3)' },
    trapglow: { primary: '#8B5CF6', glow: 'rgba(139, 92, 246, 0.3)' },
    trapfrequency: { primary: '#39FF14', glow: 'rgba(57, 255, 20, 0.3)' },
  };

  const colors = brandColors[brand];

  // Generate fake waveform data for visual
  const [waveformData] = useState(() =>
    Array.from({ length: 80 }, () => Math.random() * 0.7 + 0.3)
  );

  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    ctx.scale(dpr, dpr);

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    const barWidth = width / waveformData.length;
    const progressRatio = totalDuration > 0 ? currentTime / totalDuration : 0;

    ctx.clearRect(0, 0, width, height);

    waveformData.forEach((value, i) => {
      const x = i * barWidth;
      const barHeight = value * height * 0.8;
      const y = (height - barHeight) / 2;
      const ratio = i / waveformData.length;

      if (ratio <= progressRatio) {
        ctx.fillStyle = colors.primary;
        ctx.shadowColor = colors.glow;
        ctx.shadowBlur = 4;
      } else {
        ctx.fillStyle = 'rgba(141, 153, 174, 0.3)';
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
      }

      const gap = 1;
      ctx.beginPath();
      ctx.roundRect(x + gap / 2, y, barWidth - gap, barHeight, 1);
      ctx.fill();
    });
  }, [waveformData, currentTime, totalDuration, colors]);

  useEffect(() => {
    drawWaveform();
  }, [drawWaveform]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setTotalDuration(audioRef.current.duration);
  };

  const handleSeek = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!audioRef.current || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = x / rect.width;
    audioRef.current.currentTime = ratio * totalDuration;
  };

  const changeSpeed = () => {
    const speeds = [1, 1.5, 2];
    const nextIndex = (speeds.indexOf(speed) + 1) % speeds.length;
    const newSpeed = speeds[nextIndex];
    setSpeed(newSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed;
    }
  };

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Demo mode without actual audio
  const isDemoMode = !src;

  return (
    <>
      {/* Main player */}
      <div className="bg-surface/80 backdrop-blur-md border border-gray-800/50 rounded-lg overflow-hidden">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            {/* Play button */}
            <button
              onClick={isDemoMode ? undefined : togglePlay}
              className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-105"
              style={{ backgroundColor: colors.primary }}
              disabled={isDemoMode}
            >
              {isPlaying ? (
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-mono text-neutral uppercase tracking-wider flex items-center gap-2">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
                Listen to article
              </p>
              <p className="text-sm text-white font-semibold truncate">{title}</p>
            </div>

            {/* Duration */}
            <span className="text-xs font-mono text-neutral flex-shrink-0">
              {isDemoMode ? duration : `${formatTime(currentTime)} / ${formatTime(totalDuration)}`}
            </span>

            {/* Speed toggle */}
            <button
              onClick={changeSpeed}
              className="flex-shrink-0 px-2 py-1 text-xs font-mono rounded border border-gray-700 text-neutral hover:text-white hover:border-gray-600 transition-colors"
            >
              {speed}x
            </button>
          </div>

          {/* Waveform */}
          <canvas
            ref={canvasRef}
            className="w-full h-10 cursor-pointer rounded"
            onClick={isDemoMode ? undefined : handleSeek}
          />
        </div>

        {/* Hidden audio element */}
        {src && (
          <audio
            ref={audioRef}
            src={src}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
            preload="metadata"
          />
        )}
      </div>

      {/* Sticky mini player (shows when scrolled past main player and playing) */}
      {isPlaying && isMinimized && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-md border-t border-gray-800">
          <div className="container-wire py-2 flex items-center gap-3">
            <button onClick={togglePlay} className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white truncate">{title}</p>
            </div>
            <span className="text-xs font-mono text-neutral">
              {formatTime(currentTime)} / {formatTime(totalDuration)}
            </span>
          </div>
        </div>
      )}
    </>
  );
}
