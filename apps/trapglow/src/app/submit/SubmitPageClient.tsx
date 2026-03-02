'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassMorphCard } from '@/components/GlassMorphCard';
import { GENRES } from '@/lib/mock-data';
import { createBrowserClient } from '@supabase/ssr';

export function SubmitPageClient() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    artist_name: '',
    email: '',
    genre: '',
    city: '',
    spotify_url: '',
    soundcloud_url: '',
    apple_music_url: '',
    instagram: '',
    bio: '',
    why_feature: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      // Build media_urls from music links
      const media_urls = [
        formData.spotify_url,
        formData.soundcloud_url,
        formData.apple_music_url,
      ].filter(Boolean);

      // Combine text fields into content
      const contentParts = [
        `Genre: ${formData.genre}`,
        formData.city ? `City: ${formData.city}` : '',
        formData.instagram ? `Instagram: ${formData.instagram}` : '',
        `\nBio:\n${formData.bio}`,
        formData.why_feature ? `\nWhy Feature:\n${formData.why_feature}` : '',
      ].filter(Boolean);

      const { error: insertError } = await supabase.from('submissions').insert({
        user_id: null,
        brand: 'trapglow' as const,
        type: 'artist_feature' as const,
        title: `Artist Feature: ${formData.artist_name}`,
        content: contentParts.join('\n'),
        media_urls,
        contact_email: formData.email,
        contact_name: formData.artist_name,
        is_anonymous: true,
      });

      if (insertError) {
        throw new Error(insertError.message);
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="text-6xl mb-4">✨</div>
          <h2 className="text-2xl font-headline font-bold text-white mb-2">Submission Received!</h2>
          <p className="text-white/50 font-body mb-6">
            We&apos;ll review your music and get back to you within 48 hours. Keep creating.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setFormData({
                artist_name: '', email: '', genre: '', city: '',
                spotify_url: '', soundcloud_url: '', apple_music_url: '',
                instagram: '', bio: '', why_feature: '',
              });
            }}
            className="btn-ghost text-sm"
          >
            Submit Another
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <GlassMorphCard className="p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Artist name + email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/50 font-body mb-1.5 uppercase tracking-wider">Artist Name *</label>
              <input
                required
                type="text"
                value={formData.artist_name}
                onChange={(e) => setFormData({ ...formData, artist_name: e.target.value })}
                placeholder="Your artist name"
                className="input-glow"
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 font-body mb-1.5 uppercase tracking-wider">Email *</label>
              <input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@email.com"
                className="input-glow"
              />
            </div>
          </div>

          {/* Genre + City */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/50 font-body mb-1.5 uppercase tracking-wider">Primary Genre *</label>
              <select
                required
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                className="input-glow"
              >
                <option value="">Select genre</option>
                {GENRES.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-white/50 font-body mb-1.5 uppercase tracking-wider">City / Region</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Atlanta, GA"
                className="input-glow"
              />
            </div>
          </div>

          {/* Music links */}
          <div className="space-y-3">
            <p className="text-xs text-white/50 font-body uppercase tracking-wider">Music Links (at least one required)</p>
            <input
              type="text"
              value={formData.spotify_url}
              onChange={(e) => setFormData({ ...formData, spotify_url: e.target.value })}
              placeholder="Spotify profile or track URL"
              className="input-glow"
            />
            <input
              type="text"
              value={formData.soundcloud_url}
              onChange={(e) => setFormData({ ...formData, soundcloud_url: e.target.value })}
              placeholder="SoundCloud profile or track URL"
              className="input-glow"
            />
            <input
              type="text"
              value={formData.apple_music_url}
              onChange={(e) => setFormData({ ...formData, apple_music_url: e.target.value })}
              placeholder="Apple Music profile or track URL"
              className="input-glow"
            />
          </div>

          {/* Social */}
          <div>
            <label className="block text-xs text-white/50 font-body mb-1.5 uppercase tracking-wider">Instagram Handle</label>
            <input
              type="text"
              value={formData.instagram}
              onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
              placeholder="@yourusername"
              className="input-glow"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs text-white/50 font-body mb-1.5 uppercase tracking-wider">Short Bio *</label>
            <textarea
              required
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell us about yourself, your sound, your story..."
              className="input-glow resize-none"
            />
          </div>

          {/* Why feature */}
          <div>
            <label className="block text-xs text-white/50 font-body mb-1.5 uppercase tracking-wider">Why should we feature you?</label>
            <textarea
              rows={3}
              value={formData.why_feature}
              onChange={(e) => setFormData({ ...formData, why_feature: e.target.value })}
              placeholder="What makes your music special? Any notable achievements, co-signs, or milestones?"
              className="input-glow resize-none"
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-glow w-full text-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="inline-flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Submitting...
              </span>
            ) : (
              'Submit for Review ✨'
            )}
          </button>

          <p className="text-center text-[11px] text-white/30 font-body">
            Submissions are reviewed within 48 hours. We feature artists at our editorial discretion.
          </p>
        </form>
      </GlassMorphCard>
    </div>
  );
}
