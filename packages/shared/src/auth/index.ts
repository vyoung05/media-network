import type { SupabaseClient } from '@supabase/supabase-js';
import type { User, UserRole, Brand } from '../types';

// ======================== AUTH HELPERS ========================

export async function signUp(
  supabase: SupabaseClient,
  email: string,
  password: string,
  name: string
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  });

  if (error) throw error;
  return data;
}

export async function signIn(
  supabase: SupabaseClient,
  email: string,
  password: string
) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signOut(supabase: SupabaseClient) {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession(supabase: SupabaseClient) {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
}

export async function getCurrentUser(supabase: SupabaseClient): Promise<User | null> {
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) return null;

  const { data: profile, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .single();

  if (error || !profile) return null;
  return profile as User;
}

// ======================== ROLE CHECKS ========================

export function isAdmin(user: User | null): boolean {
  return user?.role === 'admin';
}

export function isEditor(user: User | null): boolean {
  return user?.role === 'editor' || user?.role === 'admin';
}

export function isWriter(user: User | null): boolean {
  return ['admin', 'editor', 'writer'].includes(user?.role || '');
}

export function canManageContent(user: User | null): boolean {
  return ['admin', 'editor'].includes(user?.role || '');
}

export function canCreateArticles(user: User | null): boolean {
  return ['admin', 'editor', 'writer'].includes(user?.role || '');
}

export function canReviewSubmissions(user: User | null): boolean {
  return ['admin', 'editor'].includes(user?.role || '');
}

export function hasRoleOrHigher(user: User | null, minRole: UserRole): boolean {
  const roleHierarchy: Record<UserRole, number> = {
    admin: 6,
    editor: 5,
    writer: 4,
    artist: 3,
    producer: 3,
    reader: 1,
  };

  if (!user) return false;
  return roleHierarchy[user.role] >= roleHierarchy[minRole];
}

export function hasBrandAccess(user: User | null, brand: Brand): boolean {
  if (!user) return false;
  if (user.role === 'admin') return true;
  return user.brand_affiliations.includes(brand);
}

// ======================== UPDATE PROFILE ========================

export async function updateUserProfile(
  supabase: SupabaseClient,
  userId: string,
  updates: Partial<Pick<User, 'name' | 'bio' | 'avatar_url' | 'links'>>
) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data as User;
}

export async function updateUserRole(
  supabase: SupabaseClient,
  userId: string,
  role: UserRole
) {
  const { data, error } = await supabase
    .from('users')
    .update({ role })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data as User;
}
