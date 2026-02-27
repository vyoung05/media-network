'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TutorialCard } from '@/components/TutorialCard';
import { DAWFilter } from '@/components/DAWFilter';
import { TextReveal } from '@/components/TextReveal';
import type { Tutorial, DAWType, SkillLevel, TutorialCategory } from '@/lib/mock-data';
import { SKILL_COLORS } from '@/lib/mock-data';

interface TutorialsPageClientProps {
  tutorials: Tutorial[];
}

const SKILL_LEVELS: SkillLevel[] = ['Beginner', 'Intermediate', 'Advanced', 'Master'];
const CATEGORIES: TutorialCategory[] = ['Sound Design', 'Mixing', 'Mastering', 'Beat Making', 'Sampling', 'Music Theory', 'Arrangement', 'Vocal Production', 'Synthesis', 'Workflow'];

export function TutorialsPageClient({ tutorials }: TutorialsPageClientProps) {
  const [selectedDAW, setSelectedDAW] = useState<DAWType | 'All'>('All');
  const [selectedLevel, setSelectedLevel] = useState<SkillLevel | 'All'>('All');
  const [selectedCategory, setSelectedCategory] = useState<TutorialCategory | 'All'>('All');

  const filteredTutorials = useMemo(() => {
    return tutorials.filter((t) => {
      if (selectedDAW !== 'All' && t.daw !== selectedDAW) return false;
      if (selectedLevel !== 'All' && t.skillLevel !== selectedLevel) return false;
      if (selectedCategory !== 'All' && t.category !== selectedCategory) return false;
      return true;
    });
  }, [tutorials, selectedDAW, selectedLevel, selectedCategory]);

  return (
    <div className="min-h-screen py-12">
      <div className="container-freq">
        {/* Header */}
        <div className="mb-10">
          <TextReveal
            text="TUTORIALS"
            as="h1"
            className="text-4xl md:text-5xl font-headline font-black text-white tracking-tight mb-3"
            speed={30}
          />
          <p className="text-lg text-neutral/50 font-body max-w-xl">
            Step-by-step production guides from industry professionals.
            Filter by DAW, skill level, or topic.
          </p>
        </div>

        {/* Filters */}
        <div className="space-y-4 mb-10">
          {/* DAW Filter */}
          <div>
            <label className="text-xs font-mono text-neutral/40 uppercase tracking-wider mb-2 block">
              Filter by DAW
            </label>
            <DAWFilter selected={selectedDAW} onSelect={setSelectedDAW} />
          </div>

          {/* Skill Level */}
          <div>
            <label className="text-xs font-mono text-neutral/40 uppercase tracking-wider mb-2 block">
              Skill Level
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedLevel('All')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-300 border ${
                  selectedLevel === 'All'
                    ? 'text-primary border-primary/50 bg-primary/10'
                    : 'text-neutral/50 border-white/10 hover:border-primary/30'
                }`}
              >
                All Levels
              </button>
              {SKILL_LEVELS.map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-300 border ${
                    selectedLevel === level
                      ? 'border-opacity-50'
                      : 'text-neutral/50 border-white/10 hover:border-opacity-30'
                  }`}
                  style={{
                    color: selectedLevel === level ? SKILL_COLORS[level] : undefined,
                    borderColor: selectedLevel === level ? `${SKILL_COLORS[level]}80` : undefined,
                    backgroundColor: selectedLevel === level ? `${SKILL_COLORS[level]}15` : undefined,
                  }}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="text-xs font-mono text-neutral/40 uppercase tracking-wider mb-2 block">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-300 border ${
                  selectedCategory === 'All'
                    ? 'text-primary border-primary/50 bg-primary/10'
                    : 'text-neutral/50 border-white/10 hover:border-primary/30'
                }`}
              >
                All Topics
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-300 border ${
                    selectedCategory === cat
                      ? 'text-cool border-cool/50 bg-cool/10'
                      : 'text-neutral/50 border-white/10 hover:border-cool/30'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <span className="text-sm font-mono text-neutral/40">
            {filteredTutorials.length} tutorial{filteredTutorials.length !== 1 ? 's' : ''} found
          </span>
        </div>

        {/* Tutorial Grid */}
        {filteredTutorials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTutorials.map((tutorial, i) => (
              <TutorialCard key={tutorial.id} tutorial={tutorial} index={i} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-xl font-headline text-neutral/30 mb-2">No tutorials found</p>
            <p className="text-sm font-mono text-neutral/20">Try adjusting your filters</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
