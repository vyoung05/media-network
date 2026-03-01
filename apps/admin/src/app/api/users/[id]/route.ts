import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// PATCH /api/users/[id] — update user profile + optionally reset password
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, role, brand_affiliations, bio, is_verified, password } = body;

    const supabase = getServiceClient();

    // Update profile in public.users
    const updates: Record<string, any> = {};
    if (name !== undefined) updates.name = name;
    if (role !== undefined) updates.role = role;
    if (brand_affiliations !== undefined) updates.brand_affiliations = brand_affiliations;
    if (bio !== undefined) updates.bio = bio;
    if (is_verified !== undefined) updates.is_verified = is_verified;
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // If password provided, update auth password
    if (password && password.length >= 6) {
      const { error: authError } = await supabase.auth.admin.updateUserById(
        params.id,
        { password }
      );
      if (authError) {
        return NextResponse.json(
          { error: `Profile updated but password change failed: ${authError.message}` },
          { status: 207 }
        );
      }
    }

    return NextResponse.json({ user: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}

// DELETE /api/users/[id] — delete user (auth + profile)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getServiceClient();

    // Delete from public.users first (CASCADE will handle related records)
    const { error: profileError } = await supabase
      .from('users')
      .delete()
      .eq('id', params.id);

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    // Delete auth user
    const { error: authError } = await supabase.auth.admin.deleteUser(params.id);

    if (authError) {
      return NextResponse.json(
        { error: `Profile deleted but auth removal failed: ${authError.message}` },
        { status: 207 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
