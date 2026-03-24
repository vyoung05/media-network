import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: '', ...options });
          },
        },
      }
    );

    const { data: sessionData } = await supabase.auth.exchangeCodeForSession(code);

    // SECURITY: Verify this user has an approved admin/editor role
    // Only pre-created users in the 'users' table with proper roles can access the dashboard
    if (sessionData?.user) {
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', sessionData.user.id)
        .single();

      if (!profile || !['admin', 'editor', 'writer'].includes(profile.role)) {
        // User is not authorized — sign them out and redirect to login with error
        await supabase.auth.signOut();
        return NextResponse.redirect(
          new URL('/?error=access_denied', requestUrl.origin)
        );
      }
    }
  }

  return NextResponse.redirect(new URL('/dashboard', requestUrl.origin));
}
