'use client';

import React from 'react';
import { SubmissionForm, type SubmissionFormData } from '@media-network/ui';

export function SubmitPageClient() {
  const handleSubmit = async (data: SubmissionFormData) => {
    // In production, this would call the Supabase API
    console.log('Submission data:', data);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
  };

  return (
    <SubmissionForm
      brand="saucewire"
      type="news_tip"
      onSubmit={handleSubmit}
      allowAnonymous={true}
      title="Drop Your Tip"
      description="Include as many details as possible — links, screenshots, and context help us verify faster."
    />
  );
}
