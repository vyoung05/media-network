'use client';

import React, { useState, FormEvent } from 'react';
import type { Brand, SubmissionType } from '@media-network/shared';
import { isValidEmail } from '@media-network/shared';

interface SubmissionFormProps {
  brand: Brand;
  type: SubmissionType;
  onSubmit: (data: SubmissionFormData) => Promise<void>;
  allowAnonymous?: boolean;
  title?: string;
  description?: string;
}

export interface SubmissionFormData {
  brand: Brand;
  type: SubmissionType;
  title: string;
  content: string;
  contact_name: string;
  contact_email: string;
  is_anonymous: boolean;
  media_urls: string[];
}

export function SubmissionForm({
  brand,
  type,
  onSubmit,
  allowAnonymous = false,
  title,
  description,
}: SubmissionFormProps) {
  const [formData, setFormData] = useState<SubmissionFormData>({
    brand,
    type,
    title: '',
    content: '',
    contact_name: '',
    contact_email: '',
    is_anonymous: false,
    media_urls: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mediaUrlInput, setMediaUrlInput] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!formData.content.trim()) {
      setError('Content is required');
      return;
    }
    if (!formData.is_anonymous) {
      if (!formData.contact_name.trim()) {
        setError('Name is required (or submit anonymously)');
        return;
      }
      if (!formData.contact_email.trim() || !isValidEmail(formData.contact_email)) {
        setError('A valid email is required (or submit anonymously)');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addMediaUrl = () => {
    const url = mediaUrlInput.trim();
    if (url && !formData.media_urls.includes(url)) {
      setFormData(prev => ({
        ...prev,
        media_urls: [...prev.media_urls, url],
      }));
      setMediaUrlInput('');
    }
  };

  const removeMediaUrl = (url: string) => {
    setFormData(prev => ({
      ...prev,
      media_urls: prev.media_urls.filter(u => u !== url),
    }));
  };

  const getTypeLabel = (t: SubmissionType): string => {
    const labels: Record<SubmissionType, string> = {
      article_pitch: 'Article Pitch',
      artist_feature: 'Artist Feature Request',
      beat_submission: 'Beat Submission',
      news_tip: 'News Tip',
    };
    return labels[t];
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-surface rounded-lg text-center">
        <div className="text-4xl mb-4">✅</div>
        <h3 className="text-xl font-bold text-white mb-2">Submitted Successfully!</h3>
        <p className="text-neutral">
          Thank you for your {getTypeLabel(type).toLowerCase()}. Our team will review it shortly.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setFormData({
              brand,
              type,
              title: '',
              content: '',
              contact_name: '',
              contact_email: '',
              is_anonymous: false,
              media_urls: [],
            });
          }}
          className="mt-6 px-6 py-2 bg-primary text-white rounded font-semibold hover:opacity-90 transition-opacity"
        >
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {title && <h2 className="text-2xl font-black text-white mb-2">{title}</h2>}
      {description && <p className="text-neutral mb-6">{description}</p>}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Type badge */}
        <div className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary rounded text-sm font-mono">
          {getTypeLabel(type)}
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-white mb-1">
            Title / Subject *
          </label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder={type === 'news_tip' ? 'What happened?' : 'Give your submission a title'}
            className="w-full px-4 py-3 bg-secondary border border-gray-700 rounded-lg text-white placeholder-neutral focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            maxLength={200}
          />
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-semibold text-white mb-1">
            {type === 'news_tip' ? 'Details *' : 'Content *'}
          </label>
          <textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            placeholder={
              type === 'news_tip'
                ? 'Share the details — who, what, when, where. Include any links or sources.'
                : 'Write your content here...'
            }
            rows={8}
            className="w-full px-4 py-3 bg-secondary border border-gray-700 rounded-lg text-white placeholder-neutral focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-y"
          />
        </div>

        {/* Media URLs */}
        <div>
          <label className="block text-sm font-semibold text-white mb-1">
            Media Links (optional)
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={mediaUrlInput}
              onChange={(e) => setMediaUrlInput(e.target.value)}
              placeholder="https://..."
              className="flex-1 px-4 py-2 bg-secondary border border-gray-700 rounded-lg text-white placeholder-neutral focus:outline-none focus:border-primary"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addMediaUrl();
                }
              }}
            />
            <button
              type="button"
              onClick={addMediaUrl}
              className="px-4 py-2 bg-accent text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Add
            </button>
          </div>
          {formData.media_urls.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.media_urls.map((url) => (
                <span
                  key={url}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-gray-800 text-xs text-neutral rounded"
                >
                  <span className="truncate max-w-[200px]">{url}</span>
                  <button
                    type="button"
                    onClick={() => removeMediaUrl(url)}
                    className="text-red-400 hover:text-red-300 ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Anonymous toggle */}
        {allowAnonymous && (
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_anonymous}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, is_anonymous: e.target.checked }))
              }
              className="w-4 h-4 rounded border-gray-600 bg-secondary text-primary focus:ring-primary"
            />
            <span className="text-sm text-neutral">Submit anonymously</span>
          </label>
        )}

        {/* Contact info (if not anonymous) */}
        {!formData.is_anonymous && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="contact_name" className="block text-sm font-semibold text-white mb-1">
                Your Name *
              </label>
              <input
                id="contact_name"
                type="text"
                value={formData.contact_name}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, contact_name: e.target.value }))
                }
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-secondary border border-gray-700 rounded-lg text-white placeholder-neutral focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="contact_email" className="block text-sm font-semibold text-white mb-1">
                Email *
              </label>
              <input
                id="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, contact_email: e.target.value }))
                }
                placeholder="you@email.com"
                className="w-full px-4 py-3 bg-secondary border border-gray-700 rounded-lg text-white placeholder-neutral focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="p-3 bg-red-600/10 border border-red-600/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-primary text-white rounded-lg font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Submitting...
            </span>
          ) : (
            'Submit'
          )}
        </button>
      </form>
    </div>
  );
}
