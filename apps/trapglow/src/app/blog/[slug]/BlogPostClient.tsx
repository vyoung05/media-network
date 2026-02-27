'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { GlassMorphCard } from '@/components/GlassMorphCard';
import { MusicEmbed } from '@/components/MusicEmbed';
import type { BlogPost, Artist } from '@/lib/mock-data';
import { formatListeners } from '@/lib/mock-data';
import { formatDate, timeAgo } from '@media-network/shared';

interface BlogPostClientProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
  artist?: Artist;
}

export function BlogPostClient({ post, relatedPosts, artist }: BlogPostClientProps) {
  return (
    <article>
      {/* Hero */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <Image
          src={post.cover_image}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/70 to-secondary/30" />

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container-glow max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <span className="px-3 py-1 text-[10px] font-bold bg-primary/80 text-white rounded-full mb-4 inline-block">
                {post.category}
              </span>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-headline font-bold text-white leading-tight mb-4">
                {post.title}
              </h1>
              <div className="flex items-center gap-3 text-sm text-white/60 font-body">
                <span>By <span className="text-accent">{post.author.name}</span></span>
                <span className="text-white/20">·</span>
                <span>{formatDate(post.published_at)}</span>
                <span className="text-white/20">·</span>
                <span>{post.reading_time_minutes} min read</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-glow py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2">
            {/* Excerpt */}
            <p className="text-lg text-white/70 font-body leading-relaxed mb-8 italic border-l-2 border-primary pl-4">
              {post.excerpt}
            </p>

            {/* Body */}
            <div
              className="prose prose-invert prose-lg max-w-none font-body
                prose-headings:font-headline prose-headings:text-white
                prose-p:text-white/70 prose-p:leading-relaxed
                prose-a:text-accent prose-a:no-underline hover:prose-a:text-primary
                prose-strong:text-white
                prose-blockquote:border-primary prose-blockquote:text-white/50
              "
              dangerouslySetInnerHTML={{ __html: post.body }}
            />

            {/* Tags */}
            <div className="mt-10 pt-6 border-t border-white/[0.06]">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 text-xs font-body bg-white/5 text-white/40 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Share */}
            <div className="mt-6 flex items-center gap-3">
              <span className="text-xs text-white/30 font-body uppercase tracking-wider">Share</span>
              <button className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-accent hover:bg-white/10 transition-all">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </button>
              <button className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-accent hover:bg-white/10 transition-all">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>

            {/* Related posts */}
            {relatedPosts.length > 0 && (
              <div className="mt-12">
                <h3 className="text-xl font-headline font-bold text-white mb-6">Related Stories</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {relatedPosts.map((rp) => (
                    <Link key={rp.id} href={`/blog/${rp.slug}`}>
                      <GlassMorphCard className="group h-full">
                        <div className="relative h-32 overflow-hidden">
                          <Image
                            src={rp.cover_image}
                            alt={rp.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
                        </div>
                        <div className="p-3">
                          <h4 className="text-xs font-headline font-bold text-white group-hover:text-accent transition-colors line-clamp-2">
                            {rp.title}
                          </h4>
                          <p className="text-[10px] text-white/30 font-body mt-1">{rp.reading_time_minutes} min read</p>
                        </div>
                      </GlassMorphCard>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Author card */}
            <GlassMorphCard className="p-6">
              <h3 className="text-xs text-white/30 font-body uppercase tracking-wider mb-3">Written by</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">{post.author.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-sm font-headline font-bold text-white">{post.author.name}</p>
                  <p className="text-[11px] text-white/40 font-body capitalize">{post.author.role}</p>
                </div>
              </div>
              {post.author.bio && (
                <p className="text-xs text-white/50 font-body leading-relaxed">{post.author.bio}</p>
              )}
            </GlassMorphCard>

            {/* Associated artist */}
            {artist && (
              <Link href={`/artist/${artist.slug}`}>
                <GlassMorphCard className="p-6 group">
                  <h3 className="text-xs text-accent font-body uppercase tracking-wider mb-3">Featured Artist</h3>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all">
                      <Image src={artist.avatar} alt={artist.name} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-accent font-bold text-white group-hover:text-accent transition-colors">{artist.name}</p>
                      <p className="text-[11px] text-white/40 font-body">{artist.city}</p>
                    </div>
                  </div>
                  <div className="flex gap-4 mb-3">
                    <div>
                      <p className="text-sm font-headline font-bold text-white">{formatListeners(artist.monthly_listeners)}</p>
                      <p className="text-[10px] text-white/30 font-body">Listeners</p>
                    </div>
                    <div>
                      <p className="text-sm font-headline font-bold text-accent">{artist.glow_score}</p>
                      <p className="text-[10px] text-white/30 font-body">Glow Score</p>
                    </div>
                  </div>
                  {artist.spotify_embed && (
                    <MusicEmbed spotifyUrl={artist.spotify_embed} compact />
                  )}
                </GlassMorphCard>
              </Link>
            )}

            {/* Submit CTA */}
            <GlassMorphCard className="p-6 text-center">
              <h3 className="text-sm font-headline font-bold text-white mb-2">Got Music?</h3>
              <p className="text-xs text-white/40 font-body mb-4">
                Submit your music and get featured on TrapGlow.
              </p>
              <Link href="/submit" className="btn-glow text-xs w-full inline-block text-center">
                Submit Artist ✨
              </Link>
            </GlassMorphCard>
          </div>
        </div>
      </div>
    </article>
  );
}
