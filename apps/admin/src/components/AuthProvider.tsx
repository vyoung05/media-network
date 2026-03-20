'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import type { User } from '@media-network/shared';
import type { Session, SupabaseClient } from '@supabase/supabase-js';

interface AuthContextType {
  supabase: SupabaseClient;
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => getSupabaseBrowserClient());
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Safety timeout — if auth check takes too long, stop loading
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 8000);

    // Get initial session with retry
    async function initSession() {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const { data: { session: s }, error } = await supabase.auth.getSession();
          if (error && attempt === 0) {
            // First attempt failed — wait briefly and retry
            await new Promise(r => setTimeout(r, 1000));
            continue;
          }
          clearTimeout(timeout);
          setSession(s);
          if (s?.user) {
            await fetchUserProfile(s.user.id);
          } else {
            setLoading(false);
          }
          return;
        } catch {
          if (attempt === 0) {
            await new Promise(r => setTimeout(r, 1000));
            continue;
          }
        }
      }
      // Both attempts failed
      clearTimeout(timeout);
      setLoading(false);
    }

    initSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, s) => {
        setSession(s);
        if (s?.user) {
          await fetchUserProfile(s.user.id);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    return () => {
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, [supabase]);

  async function fetchUserProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) {
        // User exists in auth but not in users table yet — that's OK for first login
        setUser(null);
      } else {
        setUser(data as User);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        supabase,
        session,
        user,
        loading,
        signOut: handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
