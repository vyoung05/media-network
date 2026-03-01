import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@media-network/shared';

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseServiceClient();

    // Check if Vincent's account already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', 'vyoung86@gmail.com')
      .single();

    if (existingUser) {
      return NextResponse.json(
        { message: 'Admin account already exists', userId: existingUser.id },
        { status: 200 }
      );
    }

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'vyoung86@gmail.com',
      password: 'MediaNetwork2025!',
      email_confirm: true,
      user_metadata: { name: 'Vincent Young' },
    });

    if (authError) throw authError;

    // Create user profile in the users table
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: 'vyoung86@gmail.com',
        name: 'Vincent Young',
        role: 'admin',
        avatar_url: null,
        bio: 'Founder & Admin of Media Network',
        links: {},
        brand_affiliations: ['saucewire', 'saucecaviar', 'trapglow', 'trapfrequency'],
        is_verified: true,
      })
      .select()
      .single();

    if (profileError) throw profileError;

    return NextResponse.json(
      { message: 'Admin account created successfully', user: profile },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error seeding admin:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to seed admin account' },
      { status: 500 }
    );
  }
}
