'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { createBrowserClient } from '@supabase/ssr';

type SubmissionType = 'writer' | 'artist';

export function SubmitPageClient() {
  const [type, setType] = useState<SubmissionType>('writer');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '', email: '', portfolio: '', category: '', pitch: '', samples: '',
  });

  const updateField = (field: string, value: string) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStatus('loading');

    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      // Build content from pitch + category + type
      const contentParts = [
        `Submission Type: ${type === 'writer' ? 'Writer' : 'Artist'}`,
        `Category: ${formData.category}`,
        formData.portfolio ? `Portfolio: ${formData.portfolio}` : '',
        `\n${type === 'writer' ? 'Pitch' : 'About Their Work'}:\n${formData.pitch}`,
      ].filter(Boolean);

      // Parse sample links into media_urls
      const media_urls = formData.samples
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean);

      const { error: insertError } = await supabase.from('submissions').insert({
        user_id: null,
        brand: 'saucecaviar' as const,
        type: type === 'writer' ? ('article_pitch' as const) : ('artist_feature' as const),
        title: `${type === 'writer' ? 'Writer Pitch' : 'Artist Application'}: ${formData.name}`,
        content: contentParts.join('\n'),
        media_urls,
        contact_email: formData.email,
        contact_name: formData.name,
        is_anonymous: true,
      });

      if (insertError) {
        throw new Error(insertError.message);
      }

      setStatus('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed. Please try again.');
      setStatus('idle');
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen pt-28 pb-20 bg-secondary flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-px bg-primary mx-auto mb-8" />
          <h2 className="text-3xl font-headline text-text">Submission Received</h2>
          <p className="mt-4 text-text/40 font-body">
            Thank you for your interest in contributing to SauceCaviar.
            Our editorial team reviews every submission personally and will be in touch within 7 business days.
          </p>
          <p className="mt-6 text-sm font-accent italic text-primary/60">
            Culture is better when everyone has a seat at the table.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 bg-secondary">
      <div className="container-narrow">
        {/* Header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-[10px] tracking-[0.4em] uppercase text-primary/60 font-body mb-4">
            Contribute
          </p>
          <h1 className="text-4xl md:text-6xl font-headline text-text tracking-wide">
            Submit Your Work
          </h1>
          <p className="mt-4 text-sm text-text/40 font-body max-w-lg mx-auto leading-relaxed">
            SauceCaviar is built by a community of writers, photographers, and artists
            who believe culture deserves premium treatment. If that sounds like you, we want to hear from you.
          </p>
          <div className="mt-6 w-16 h-px bg-primary/40 mx-auto" />
        </motion.div>

        {/* Type selector */}
        <div className="flex justify-center gap-4 mb-12">
          {(['writer', 'artist'] as const).map((t) => (
            <motion.button
              key={t}
              onClick={() => setType(t)}
              className={`px-8 py-3 text-xs tracking-[0.2em] uppercase font-body transition-all duration-300 border ${
                type === t
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-surface/30 text-text/40 hover:border-surface/50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {t === 'writer' ? '✍️ Writer' : '🎨 Artist'}
            </motion.button>
          ))}
        </div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="card-glass p-8 md:p-12 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-text/40 font-body mb-2">
                Full Name *
              </label>
              <input
                type="text" required value={formData.name}
                onChange={e => updateField('name', e.target.value)}
                className="input-caviar" placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-text/40 font-body mb-2">
                Email *
              </label>
              <input
                type="email" required value={formData.email}
                onChange={e => updateField('email', e.target.value)}
                className="input-caviar" placeholder="you@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-text/40 font-body mb-2">
              Portfolio / Website
            </label>
            <input
              type="text" value={formData.portfolio}
              onChange={e => updateField('portfolio', e.target.value)}
              className="input-caviar" placeholder="your-portfolio.com or https://your-portfolio.com"
            />
          </div>

          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-text/40 font-body mb-2">
              Category *
            </label>
            <select
              required value={formData.category}
              onChange={e => updateField('category', e.target.value)}
              className="input-caviar"
            >
              <option value="">Select a category</option>
              {type === 'writer' ? (
                <>
                  <option value="feature">Feature Article</option>
                  <option value="culture">Culture Essay</option>
                  <option value="fashion">Fashion Writing</option>
                  <option value="music">Music Writing</option>
                  <option value="interview">Interview</option>
                </>
              ) : (
                <>
                  <option value="photography">Photography</option>
                  <option value="illustration">Illustration</option>
                  <option value="music">Music / Audio Art</option>
                  <option value="visual-art">Visual Art</option>
                  <option value="fashion-design">Fashion Design</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-text/40 font-body mb-2">
              {type === 'writer' ? 'Pitch / Story Idea *' : 'Tell Us About Your Work *'}
            </label>
            <textarea
              required value={formData.pitch}
              onChange={e => updateField('pitch', e.target.value)}
              className="textarea-caviar"
              placeholder={type === 'writer'
                ? 'What story do you want to tell? Why does it matter? Why now?'
                : 'Describe your artistic practice, aesthetic, and what you\'d bring to the magazine.'}
              rows={5}
            />
          </div>

          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-text/40 font-body mb-2">
              Relevant Links / Samples
            </label>
            <textarea
              value={formData.samples}
              onChange={e => updateField('samples', e.target.value)}
              className="textarea-caviar"
              placeholder="Links to published work, social media, or samples (one per line)"
              rows={3}
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-sm">
              {error}
            </div>
          )}

          <motion.button
            type="submit"
            className="btn-primary w-full"
            disabled={status === 'loading'}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            {status === 'loading' ? 'Submitting...' : 'Submit Application'}
          </motion.button>

          <p className="text-[10px] text-text/20 text-center font-body">
            We review every submission personally. Response time: ~7 business days.
          </p>
        </motion.form>
      </div>
    </div>
  );
}
