// supabaseClient.js — fetches public config from the server and creates a
// single shared Supabase client for the whole frontend.

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

let clientPromise = null;

export function getSupabase() {
  if (!clientPromise) {
    clientPromise = fetch('/api/config')
      .then((r) => r.json())
      .then(({ supabaseUrl, supabaseAnonKey }) => {
        if (!supabaseUrl || !supabaseAnonKey) {
          console.warn('Supabase config is empty — check SUPABASE_URL / SUPABASE_ANON_KEY on the server.');
        }
        return createClient(supabaseUrl, supabaseAnonKey);
      });
  }
  return clientPromise;
}
