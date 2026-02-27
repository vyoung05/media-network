'use client';

import { useCallback, useRef } from 'react';

export function usePageTurnSound() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const play = useCallback(() => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      const now = ctx.currentTime;

      // Create a paper-like swoosh sound
      const bufferSize = ctx.sampleRate * 0.25;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Generate noise burst shaped like a page flip
      for (let i = 0; i < bufferSize; i++) {
        const t = i / bufferSize;
        // Fast attack, medium decay envelope
        const envelope = t < 0.1
          ? t / 0.1
          : Math.exp(-3 * (t - 0.1));
        // Filtered noise
        data[i] = (Math.random() * 2 - 1) * envelope * 0.15;
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;

      // Bandpass filter for paper sound
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 3000;
      filter.Q.value = 0.5;

      // Gentle gain
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      source.start(now);
      source.stop(now + 0.25);
    } catch {
      // Audio not supported, fail silently
    }
  }, []);

  return { play };
}
