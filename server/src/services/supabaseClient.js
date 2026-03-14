import { createClient } from '@supabase/supabase-js';

let cachedClient;

export const createSupabaseClient = () => {
  if (cachedClient) return cachedClient;

  const url = process.env.SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRole) {
    throw new Error('Supabase credentials are not configured');
  }

  cachedClient = createClient(url, serviceRole, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return cachedClient;
};
