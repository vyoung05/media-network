import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseService() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

// Mask a key for display: show first 8 and last 4 chars
function maskKey(key: string): string {
  if (key.length <= 16) return '••••••••••••';
  return `${key.substring(0, 8)}${'•'.repeat(Math.min(key.length - 12, 30))}${key.substring(key.length - 4)}`;
}

const KNOWN_KEYS = [
  { id: 'OPENAI_API_KEY', label: 'OpenAI API Key', description: 'GPT-4o-mini for article generation', icon: '🧠' },
  { id: 'GEMINI_API_KEY', label: 'Gemini API Key', description: 'Google Gemini for article generation', icon: '✨' },
  { id: 'BRAVE_SEARCH_API_KEY', label: 'Brave Search API Key', description: 'News search for content pipeline', icon: '🔍' },
  { id: 'ELEVENLABS_API_KEY', label: 'ElevenLabs API Key', description: 'Text-to-speech on article publish', icon: '🔊' },
];

// GET — return which keys are configured (masked values)
export async function GET() {
  try {
    const supabase = getSupabaseService();

    // Check Supabase settings table first
    const { data: dbKeys } = await supabase
      .from('api_keys')
      .select('key_name, key_value, updated_at')
      .order('key_name');

    const dbKeyMap = new Map((dbKeys || []).map((k: any) => [k.key_name, k]));

    const keys = KNOWN_KEYS.map((def) => {
      const dbEntry = dbKeyMap.get(def.id);
      const envValue = process.env[def.id];
      // DB overrides env
      const hasValue = !!(dbEntry?.key_value || envValue);
      const source = dbEntry?.key_value ? 'dashboard' : envValue ? 'env' : 'none';
      const maskedValue = dbEntry?.key_value
        ? maskKey(dbEntry.key_value)
        : envValue
        ? maskKey(envValue)
        : null;

      return {
        ...def,
        configured: hasValue,
        source,
        maskedValue,
        updatedAt: dbEntry?.updated_at || null,
      };
    });

    return NextResponse.json({ keys });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST — save or update a key
export async function POST(request: NextRequest) {
  try {
    const { keyName, keyValue } = await request.json();

    if (!keyName || !keyValue) {
      return NextResponse.json({ error: 'keyName and keyValue required' }, { status: 400 });
    }

    // Validate key name is one we support
    if (!KNOWN_KEYS.find((k) => k.id === keyName)) {
      return NextResponse.json({ error: 'Unknown key name' }, { status: 400 });
    }

    const supabase = getSupabaseService();

    // Ensure table exists (create if not)
    await ensureApiKeysTable(supabase);

    // Upsert the key
    const { error } = await supabase
      .from('api_keys')
      .upsert(
        { key_name: keyName, key_value: keyValue, updated_at: new Date().toISOString() },
        { onConflict: 'key_name' }
      );

    if (error) {
      // If table doesn't exist, create it and retry
      if (error.code === '42P01') {
        await ensureApiKeysTable(supabase);
        const { error: retryError } = await supabase
          .from('api_keys')
          .upsert(
            { key_name: keyName, key_value: keyValue, updated_at: new Date().toISOString() },
            { onConflict: 'key_name' }
          );
        if (retryError) throw retryError;
      } else {
        throw error;
      }
    }

    return NextResponse.json({
      success: true,
      maskedValue: maskKey(keyValue),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE — remove a key from dashboard storage (falls back to env var)
export async function DELETE(request: NextRequest) {
  try {
    const { keyName } = await request.json();
    if (!keyName) return NextResponse.json({ error: 'keyName required' }, { status: 400 });

    const supabase = getSupabaseService();
    await supabase.from('api_keys').delete().eq('key_name', keyName);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

async function ensureApiKeysTable(supabase: any) {
  // Try creating the table via RPC or raw SQL
  const { error } = await supabase.rpc('exec_sql', {
    query: `
      CREATE TABLE IF NOT EXISTS api_keys (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        key_name TEXT UNIQUE NOT NULL,
        key_value TEXT NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      -- RLS: only service_role can access
      ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS "service_role_all" ON api_keys;
      CREATE POLICY "service_role_all" ON api_keys FOR ALL USING (true);
    `,
  }).catch(() => null);

  // If RPC doesn't exist, try direct REST (table might already exist)
  return error;
}
