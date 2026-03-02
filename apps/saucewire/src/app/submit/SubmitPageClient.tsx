'use client';

import React from 'react';
import { SubmissionForm, type SubmissionFormData } from '@media-network/ui';
import { createBrowserClient } from '@supabase/ssr';

export function SubmitPageClient() {
  const handleSubmit = async (data: SubmissionFormData) => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { error } = await supabase.from('submissions').insert({
      user_id: null,
      brand: data.brand,
      type: data.type,
      title: data.title,
      content: data.content,
      media_urls: data.media_urls,
      contact_email: data.contact_email || null,
      contact_name: data.contact_name || null,
      is_anonymous: data.is_anonymous,
    });

    if (error) {
      throw new Error(error.message);
    }
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
