'use client';

import { createClient } from '@supabase/supabase-js';
import { useSession, useUser } from '@clerk/nextjs';
import { useMemo } from 'react';

/**
 * Hook that returns a Supabase client authenticated with the current
 * Clerk session token. Every request the client makes will carry the
 * Clerk JWT so Supabase RLS can gate rows by `user_id`.
 */
export function useSupabase() {
  const { session } = useSession();

  const client = useMemo(() => {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          fetch: async (url, options = {}) => {
            const clerkToken = await session?.getToken({
              template: 'supabase',
            });

            const headers = new Headers(options?.headers);
            if (clerkToken) {
              headers.set('Authorization', `Bearer ${clerkToken}`);
            }

            return fetch(url, { ...options, headers });
          },
        },
      },
    );
  }, [session]);

  return client;
}

/**
 * Returns the current Clerk user ID (e.g. `user_abc123`), or null
 * if not signed in. Use this as the `user_id` value for all
 * Supabase inserts.
 */
export function useUserId(): string | null {
  const { user } = useUser();
  return user?.id ?? null;
}
