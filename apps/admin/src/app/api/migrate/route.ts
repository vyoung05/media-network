import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Add metadata column if it doesn't exist
    const { error } = await supabase.rpc('exec_sql', {
      sql: "ALTER TABLE articles ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;"
    });

    // If rpc doesn't exist, try direct approach
    if (error) {
      // Test if column already exists by querying it
      const { error: testError } = await supabase
        .from('articles')
        .select('metadata')
        .limit(1);

      if (testError && testError.message.includes('metadata')) {
        return NextResponse.json({ error: 'Migration failed - metadata column does not exist and cannot be created via API. Run SQL manually.', details: error.message }, { status: 500 });
      }

      // Column already exists
      return NextResponse.json({ message: 'metadata column already exists' });
    }

    return NextResponse.json({ message: 'Migration complete' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
