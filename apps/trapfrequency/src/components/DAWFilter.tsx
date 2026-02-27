'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { DAW_INFO } from '@/lib/mock-data';
import type { DAWType } from '@/lib/mock-data';

interface DAWFilterProps {
  selected: DAWType | 'All';
  onSelect: (daw: DAWType | 'All') => void;
  showAll?: boolean;
}

const POPULAR_DAWS: DAWType[] = ['FL Studio', 'Ableton Live', 'Logic Pro', 'Pro Tools', 'MPC Software'];

export function DAWFilter({ selected, onSelect, showAll = true }: DAWFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {showAll && (
        <button
          onClick={() => onSelect('All')}
          className={`relative px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all duration-300 border ${
            selected === 'All'
              ? 'text-primary border-primary/50 bg-primary/10 shadow-[0_0_10px_rgba(57,255,20,0.15)]'
              : 'text-neutral/50 border-white/10 hover:border-primary/30 hover:text-primary/70'
          }`}
        >
          {selected === 'All' && (
            <motion.div
              layoutId="daw-filter-active"
              className="absolute inset-0 rounded-lg bg-primary/10 border border-primary/30"
              transition={{ type: 'spring', duration: 0.4 }}
            />
          )}
          <span className="relative z-10">All DAWs</span>
        </button>
      )}

      {POPULAR_DAWS.map((daw) => {
        const info = DAW_INFO[daw];
        const isSelected = selected === daw;
        return (
          <button
            key={daw}
            onClick={() => onSelect(daw)}
            className={`relative px-4 py-2 rounded-lg text-xs font-mono transition-all duration-300 border flex items-center gap-1.5 ${
              isSelected
                ? 'border-opacity-50 shadow-lg'
                : 'text-neutral/50 border-white/10 hover:border-opacity-30'
            }`}
            style={{
              color: isSelected ? info.color : undefined,
              borderColor: isSelected ? `${info.color}80` : undefined,
              backgroundColor: isSelected ? `${info.color}15` : undefined,
              boxShadow: isSelected ? `0 0 10px ${info.color}25` : undefined,
            }}
          >
            <span className="text-sm">{info.icon}</span>
            <span>{info.shortName}</span>
          </button>
        );
      })}
    </div>
  );
}
