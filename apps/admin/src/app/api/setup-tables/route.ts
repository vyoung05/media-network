import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// POST /api/setup-tables — create notifications + announcements tables if they don't exist
export async function POST() {
  const supabase = getServiceClient();
  const results: string[] = [];

  // Create notifications table
  const { error: notifError } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS public.notifications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        type TEXT NOT NULL DEFAULT 'info',
        title TEXT NOT NULL,
        message TEXT,
        link TEXT,
        brand TEXT,
        read BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);
      CREATE INDEX IF NOT EXISTS idx_notifications_created ON public.notifications(created_at DESC);
    `,
  });

  if (notifError) {
    // Try direct SQL approach
    results.push(`notifications: ${notifError.message}`);
  } else {
    results.push('notifications: created');
  }

  // Create announcements table
  const { error: annError } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS public.announcements (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        message TEXT,
        type TEXT NOT NULL DEFAULT 'info',
        video_url TEXT,
        pinned BOOLEAN NOT NULL DEFAULT FALSE,
        active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `,
  });

  if (annError) {
    results.push(`announcements: ${annError.message}`);
  } else {
    results.push('announcements: created');
  }

  return NextResponse.json({ results });
}
