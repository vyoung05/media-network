'use client';

import { useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';

interface PageViewTrackerProps {
  brand: string;
  articleId?: string;
}

function getSessionId(): string {
  const key = 'pv_session_id';
  let sessionId = sessionStorage.getItem(key);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem(key, sessionId);
  }
  return sessionId;
}

function shouldTrack(path: string): boolean {
  const key = `pv_last_${path}`;
  const last = sessionStorage.getItem(key);
  if (last) {
    const elapsed = Date.now() - parseInt(last, 10);
    if (elapsed < 30_000) return false; // 30-second debounce
  }
  sessionStorage.setItem(key, Date.now().toString());
  return true;
}

export function PageViewTracker({ brand, articleId }: PageViewTrackerProps) {
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return;

    const path = window.location.pathname;
    if (!shouldTrack(path)) return;

    const supabase = createBrowserClient(url, key);
    const sessionId = getSessionId();

    // Insert page view
    supabase
      .from('page_views')
      .insert({
        brand,
        path,
        referrer: document.referrer || null,
        user_agent: navigator.userAgent,
        session_id: sessionId,
        article_id: articleId || null,
      })
      .then(({ error }) => {
        if (error) console.error('[PageViewTracker] insert error:', error.message);
      });

    // Increment article view count if article_id provided
    if (articleId) {
      supabase
        .rpc('increment_view_count', { article_uuid: articleId })
        .then(({ error }) => {
          if (error) console.error('[PageViewTracker] increment error:', error.message);
        });
    }
  }, [brand, articleId]);

  return null;
}
