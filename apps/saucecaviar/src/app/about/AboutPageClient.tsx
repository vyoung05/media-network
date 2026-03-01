'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GlassMorphCard } from '@/components/GlassMorphCard';
import { TextReveal } from '@/components/TextReveal';

const team = [
  { name: 'Vincent Young', role: 'Founder & Creative Director', bio: 'Visionary behind the SauceCaviar brand and the entire media network.' },
  { name: 'Editorial Team', role: 'Editors & Writers', bio: 'A curated collective of culture writers, fashion journalists, and music critics.' },
  { name: 'Art Direction', role: 'Visual Design', bio: 'Magazine-grade layouts, cinematic photography, and premium visual storytelling.' },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function AboutPageClient() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero */}
      <div className="container-caviar mb-16">
        <h1 className="text-5xl md:text-7xl font-headline font-bold text-white mb-6">
          <TextReveal as="span">Culture Served</TextReveal>{' '}
          <span className="text-primary italic"><TextReveal as="span" delay={0.3}>Premium</TextReveal></span>
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-lg md:text-xl text-warm-white/60 font-body max-w-3xl leading-relaxed"
        >
          SauceCaviar is a luxury interactive digital magazine exploring fashion, music, art,
          and the creative forces shaping our world. Each issue is a curated experience —
          designed to be flipped, explored, and savored like the finest editorial print,
          reimagined for the digital age.
        </motion.p>
      </div>

      {/* Mission */}
      <div className="container-caviar mb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <GlassMorphCard className="p-8 md:p-12">
            <h2 className="text-2xl font-headline font-bold text-primary mb-4">Our Mission</h2>
            <p className="text-warm-white/70 font-body leading-relaxed text-lg">
              In an era of infinite scroll and disposable content, we believe in the power of
              curation. Every article, every photograph, every layout in SauceCaviar is intentional.
              We don&apos;t chase trends — we spotlight the creators, visionaries, and movements
              that define culture at its highest level.
            </p>
            <p className="text-warm-white/70 font-body leading-relaxed text-lg mt-4">
              Our interactive magazine format isn&apos;t just a gimmick — it&apos;s a statement.
              Great content deserves a great container. The page-flip experience, the ambient audio,
              the cinematic reveals — they all serve the same purpose: making you slow down and
              truly engage with what you&apos;re reading.
            </p>
          </GlassMorphCard>
        </motion.div>
      </div>

      {/* Team */}
      <div className="container-caviar mb-16">
        <h2 className="text-3xl font-headline font-bold text-white mb-8">The Team</h2>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {team.map((member) => (
            <motion.div key={member.name} variants={item}>
              <GlassMorphCard className="p-6 h-full">
                <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center mb-4">
                  <span className="text-2xl font-headline font-bold text-primary">
                    {member.name.charAt(0)}
                  </span>
                </div>
                <h3 className="text-lg font-headline font-bold text-white">{member.name}</h3>
                <p className="text-sm text-primary font-body mb-2">{member.role}</p>
                <p className="text-sm text-warm-white/50 font-body">{member.bio}</p>
              </GlassMorphCard>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Part of the Network */}
      <div className="container-caviar">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <GlassMorphCard className="p-8 md:p-12 text-center">
            <h2 className="text-2xl font-headline font-bold text-white mb-4">Part of the Network</h2>
            <p className="text-warm-white/60 font-body mb-8 max-w-2xl mx-auto">
              SauceCaviar is the flagship of a four-brand media network — each with its own voice,
              audience, and purpose. One database. One vision. Four distinct experiences.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              {[
                { name: 'SauceCaviar', color: '#C9A84C', tagline: 'The Magazine' },
                { name: 'TrapGlow', color: '#8B5CF6', tagline: 'Music Discovery' },
                { name: 'SauceWire', color: '#E63946', tagline: 'The News Wire' },
                { name: 'TrapFrequency', color: '#39FF14', tagline: 'Production Hub' },
              ].map((brand) => (
                <div key={brand.name} className="text-center">
                  <div
                    className="w-3 h-3 rounded-full mx-auto mb-2"
                    style={{ backgroundColor: brand.color, boxShadow: `0 0 12px ${brand.color}60` }}
                  />
                  <p className="text-sm font-headline font-bold text-white">{brand.name}</p>
                  <p className="text-xs text-warm-white/40 font-body">{brand.tagline}</p>
                </div>
              ))}
            </div>
          </GlassMorphCard>
        </motion.div>
      </div>
    </div>
  );
}
