'use client';

import React from 'react';

interface CategoryFilterProps {
  categories: readonly string[] | string[];
  activeCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  allLabel?: string;
}

export function CategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
  allLabel = 'All',
}: CategoryFilterProps) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide pb-1">
      <button
        onClick={() => onCategoryChange(null)}
        className={`flex-shrink-0 px-4 py-2 text-sm font-mono uppercase tracking-wider rounded transition-colors ${
          activeCategory === null
            ? 'bg-primary text-white'
            : 'bg-surface text-neutral hover:text-white hover:bg-surface/80'
        }`}
      >
        {allLabel}
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`flex-shrink-0 px-4 py-2 text-sm font-mono uppercase tracking-wider rounded transition-colors ${
            activeCategory === category
              ? 'bg-primary text-white'
              : 'bg-surface text-neutral hover:text-white hover:bg-surface/80'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
