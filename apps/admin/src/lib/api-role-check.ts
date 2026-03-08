import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

type UserRole = 'admin' | 'editor' | 'writer' | 'artist' | 'producer' | 'reader';

interface RoleCheckResult {
  authorized: boolean;
  userId?: string;
  role?: UserRole;
  error?: NextResponse;
}

/**
 * Checks the calling user's role from their Supabase session.
 * Pass allowedRoles to restrict which roles can access the endpoint.
 * 
 * For API-key authenticated requests (automation), this passes through
 * since those are already validated by validateRequest().
 */
export async function checkUserRole(
  request: NextRequest,
  allowedRoles: UserRole[]
): Promise<RoleCheckResult> {
  try {
    // Check if this is an API key request (automation) — allow through
    const apiKey = request.headers.get('X-API-Key') || request.headers.get('x-api-key');
    if (apiKey) {
      return { authorized: true, role: 'admin' };
    }

    // Extract session from cookies
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    // Get auth token from cookies (Supabase stores session in cookies)
    const cookieHeader = request.headers.get('cookie') || '';
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
      global: {
        headers: { cookie: cookieHeader },
      },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return {
        authorized: false,
        error: NextResponse.json({ error: 'Not authenticated' }, { status: 401 }),
      };
    }

    // Get role from users table using service client
    const serviceClient = createClient(
      supabaseUrl,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { data: profile } = await serviceClient
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    const userRole = (profile?.role || 'reader') as UserRole;

    if (!allowedRoles.includes(userRole)) {
      return {
        authorized: false,
        userId: user.id,
        role: userRole,
        error: NextResponse.json(
          { error: 'Insufficient permissions. Admin access required.' },
          { status: 403 }
        ),
      };
    }

    return { authorized: true, userId: user.id, role: userRole };
  } catch {
    // If role check fails (e.g., no cookies in server context), 
    // fall through to allow the request — existing behavior for internal routes
    return { authorized: true };
  }
}
