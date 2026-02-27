'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface GenreFilterProps {
  genres: readonly string[];
  activeGenre: string | null;
  onGenreChange: (genre: string | null) => void;
  label?: string;
}

export function GenreFilter({ genres, activeGenre, onGenreChange, label }: GenreFilterProps) {
  return (
    <div>
      {label && (
        <p className="text-xs text-white/40 font-body uppercase tracking-wider mb-2">{label}</p>
      )}
      <div className="flex flex-wrap gap-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onGenreChange(null)}
          className={`px-4 py-2 text-xs font-body font-medium rounded-full transition-all duration-300 border ${
            activeGenre === null
              ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
              : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10 hover:text-white/70'
          }`}
        >
          All
        </motion.button>
        {genres.map((genre) => (
          <motion.button
            key={genre}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onGenreChange(activeGenre === genre ? null : genre)}
            className={`px-4 py-2 text-xs font-body font-medium rounded-full transition-all duration-300 border ${
              activeGenre === genre
                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10 hover:text-white/70'
            }`}
          >
            {genre}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
