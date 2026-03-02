import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { Brand, UserRole } from '@media-network/shared';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    // 1. Verify the calling user is an authenticated admin
    const cookieStore = request.cookies;
    const supabaseAuth = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(_name: string, _value: string, _options: CookieOptions) {
          // Can't set cookies in route handler directly
        },
        remove(_name: string, _options: CookieOptions) {
          // Can't remove cookies in route handler directly
        },
      },
    });

    const { data: { user: callerAuth } } = await supabaseAuth.auth.getUser();
    if (!callerAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check caller is admin
    const { data: callerProfile } = await supabaseAuth
      .from('users')
      .select('role')
      .eq('id', callerAuth.id)
      .single();

    if (!callerProfile || callerProfile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // 2. Parse request body
    const body = await request.json();
    const { email, password, name, role, brand_affiliations } = body as {
      email: string;
      password: string;
      name: string;
      role: UserRole;
      brand_affiliations: Brand[];
    };

    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: 'Missing required fields: email, password, name, role' },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles: UserRole[] = ['writer', 'editor', 'artist', 'producer', 'reader'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: `Invalid role. Must be one of: ${validRoles.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate brand affiliations
    const validBrands: Brand[] = ['saucecaviar', 'trapglow', 'saucewire', 'trapfrequency'];
    if (brand_affiliations && !brand_affiliations.every((b: string) => validBrands.includes(b as Brand))) {
      return NextResponse.json(
        { error: 'Invalid brand affiliations' },
        { status: 400 }
      );
    }

    // 3. Create auth user via service role (admin API)
    const supabaseService = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { data: authData, error: authError } = await supabaseService.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm so they can log in immediately
      user_metadata: { name },
    });

    if (authError) {
      return NextResponse.json(
        { error: `Auth creation failed: ${authError.message}` },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'User creation failed: no user returned' },
        { status: 500 }
      );
    }

    // 4. Insert into users table
    // avatar_url starts null — user uploads via the Writers edit panel.
    // Photos go to Supabase Storage `avatars` bucket as {user_id}.webp
    // The resulting public URL is stored here and used on ALL front-end sites.
    const { data: userData, error: insertError } = await supabaseService
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        name,
        role,
        brand_affiliations: brand_affiliations || [],
        is_verified: false,
        show_on_site: false,
        avatar_url: null,
        bio: null,
        links: {},
      })
      .select()
      .single();

    if (insertError) {
      // Attempt to clean up the auth user if insert fails
      await supabaseService.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { error: `User profile creation failed: ${insertError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      user: userData,
      credentials: {
        email,
        temporary_password: password,
      },
    });
  } catch (err) {
    console.error('Create user error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
