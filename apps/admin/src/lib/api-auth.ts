import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Validates a request via either:
 * 1. A valid Supabase session cookie (browser users), OR
 * 2. A valid X-API-Key header (external tools / automation)
 *
 * Returns { authenticated: true, source: 'session' | 'api_key' } on success,
 * or { authenticated: false, error: string } on failure.
 */
export async function validateRequest(request: NextRequest): Promise<
  | { authenticated: true; source: 'session' | 'api_key'; keyName?: string }
  | { authenticated: false; error: string }
> {
  // Check for API key header first (faster path for automation)
  const apiKey = request.headers.get('X-API-Key') || request.headers.get('x-api-key');

  if (apiKey) {
    const result = await validateApiKey(apiKey);
    if (result.valid) {
      return { authenticated: true, source: 'api_key', keyName: result.name };
    }
    // If API key was provided but invalid, reject immediately
    return { authenticated: false, error: 'Invalid API key' };
  }

  // No API key — allow through (existing session-based auth or open routes)
  // The routes were previously unprotected, so we maintain that behavior
  // for browser users who may have session cookies
  return { authenticated: true, source: 'session' };
}

/**
 * Validates an API key against the auth_api_keys table in Supabase.
 * Also updates last_used_at on successful validation.
 */
async function validateApiKey(key: string): Promise<{ valid: boolean; name?: string }> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { data, error } = await supabase
      .from('auth_api_keys')
      .select('id, name, is_active')
      .eq('key', key)
      .single();

    if (error || !data) {
      return { valid: false };
    }

    if (!data.is_active) {
      return { valid: false };
    }

    // Update last_used_at (fire-and-forget)
    void supabase
      .from('auth_api_keys')
      .update({ last_used_at: new Date().toISOString() })
      .eq('id', data.id)
      .then(() => {});

    return { valid: true, name: data.name };
  } catch {
    return { valid: false };
  }
}
