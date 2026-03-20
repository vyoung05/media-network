import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { createBrowserClient, createServerClient, type CookieOptions } from '@supabase/ssr';

// ======================== CONFIG ========================
// Env vars are read lazily inside each getter to avoid module-load race
// conditions in monorepo setups where Next.js hasn't injected the vars yet.

function getUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set');
  return url;
}

function getAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set');
  return key;
}

// ======================== BROWSER CLIENT ========================

let browserClient: SupabaseClient | null = null;

export function getSupabaseBrowserClient(): SupabaseClient {
  if (browserClient) return browserClient;
  browserClient = createBrowserClient(getUrl(), getAnonKey(), {
    auth: {
      flowType: 'pkce',
      detectSessionInUrl: true,
      persistSession: true,
      autoRefreshToken: true,
      lock: (name: string, acquireTimeout: number, fn: () => Promise<any>) => {
        return fn();
      },
    },
  });
  return browserClient;
}

// ======================== SERVER CLIENT ========================

export function getSupabaseServerClient(cookieStore: {
  get: (name: string) => { value: string } | undefined;
  set: (name: string, value: string, options: CookieOptions) => void;
  delete: (name: string, options: CookieOptions) => void;
}): SupabaseClient {
  return createServerClient(getUrl(), getAnonKey(), {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set(name, value, options);
        } catch {
          // Server component — can't set cookies
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.delete(name, options);
        } catch {
          // Server component — can't delete cookies
        }
      },
    },
  });
}

// ======================== SERVICE CLIENT ========================

let serviceClient: SupabaseClient | null = null;

export function getSupabaseServiceClient(): SupabaseClient {
  if (serviceClient) return serviceClient;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
  }
  serviceClient = createClient(getUrl(), serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  return serviceClient;
}

// ======================== TYPE HELPER ========================

export type { SupabaseClient };
