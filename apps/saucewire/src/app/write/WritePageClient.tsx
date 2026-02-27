'use client';

import React from 'react';
import { SubmissionForm, type SubmissionFormData } from '@media-network/ui';

export function WritePageClient() {
  const handleSubmit = async (data: SubmissionFormData) => {
    // In production, this would call the Supabase API
    console.log('Article pitch:', data);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
  };

  return (
    <SubmissionForm
      brand="saucewire"
      type="article_pitch"
      onSubmit={handleSubmit}
      allowAnonymous={false}
      title="Pitch Your Story"
      description="Tell us what you want to write about. Include an outline, angle, and why it matters to the culture."
    />
  );
}
